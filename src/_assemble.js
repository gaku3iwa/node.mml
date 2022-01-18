// ============================================================================
// _assemble.js
// Copyright © 2021- gaku.iwa All Rights Reserved.
// ============================================================================
import { P, Q, V, nn, rest, toSEC } from "./_define.js";

// ----------------------------------------------------------------------------
// 音階配列からWeb Audio APIの組み立て
// ----------------------------------------------------------------------------
//  < part >
//  +-------+    +-------+    +-------+
//  | osciN | -> | gainN | -> | panrN | -+
//  +-------+    +-------+    +-------+  |   +--------------+    +-----+
//                                       +-> | master(gain) | -> | dst |
//  +-------+    +-------+    +-------+  |   +--------------+    +-----+
//  | osciN | -> | gainN | -> | panrN | -+
//  +-------+    +-------+    +-------+
//
const assemble = (parse_result) => {
  const aux = new AudioContext();
  const dst = aux.destination;
  const ctx = dst.context;
  const ary = [];
  const tm_start = aux.currentTime;
  // --------------------------------------------------------------------------
  // MMLパーサー処理結果をパート毎にループ処理
  parse_result.forEach((part) => {
    const osciN = ctx.createOscillator();
    const gainN = ctx.createGain();
    const panrN = ctx.createStereoPanner();
    let Timing = tm_start;

    // ------------------------------------------------------------------------
    // パートの音階配列を１音毎にループ処理
    part.toneAry.forEach((tn) => {
      let fullTime = 0;
      let gateTime = 0;

      // ----------------------------------------------------------------------
      // 休符、音符 -> osciN
      // 音量       -> gainN
      // パン       -> panrN
      if (tn.tn[0] === rest) {
        osciN.frequency.setValueAtTime(0, Timing);
        gainN.gain.setValueAtTime(0, Timing);
        panrN.pan.setValueAtTime(0, Timing);

        // --------------------------------------------------------------------
        // 休符の場合、ゲートタイムを上限値に上書きする
        tn.q = Q.max;

        // --------------------------------------------------------------------
        // 音長配列（付点なし、付点あり）=> 次の発音タイミング計算
        tn.l.forEach((ln) => {
          if (!ln.includes(`.`)) {
            let tm = Number(ln);
            fullTime += toSEC(tn.t, tm);
          } else {
            let tm = Number(ln.replace(`.`, ``));
            fullTime += toSEC(tn.t, tm) + toSEC(tn.t, tm * 2);
          }
        });

        // --------------------------------------------------------------------
        // ゲートタイム（スタッカート）の音長計算
        gateTime = (fullTime * tn.q) / Q.max; // <= ゲートタイムを加味
        Timing += gateTime;
      } else {
        let subTiming = Timing;
        let subgateTime = 0;

        for (let idx = 0; idx < tn.tn.length; ++idx) {
          if (idx === 0) {
            // ----------------------------------------------------------------
            // 発音時点の音量
            let gval = Math.cos((1 - tn.v[idx] / V.max) * 0.5 * Math.PI);
            gainN.gain.setValueAtTime(gval, subTiming);
            // ----------------------------------------------------------------
            // 発音時点のパンポット
            let pval = tn.p[idx] / P.max;
            panrN.pan.setValueAtTime(pval, subTiming);
            // ----------------------------------------------------------------
            // 発音時点の音階（周波数）
            let freq = nn[tn.o[idx]][tn.tn[idx].replace(`+`, `#`)];
            osciN.frequency.setValueAtTime(freq, subTiming);
          }

          // ------------------------------------------------------------------
          // 音長配列（付点なし、付点あり）=> 次の発音タイミング計算
          let ln = tn.l[idx];
          if (!ln.includes(`.`)) {
            let tm = Number(ln);
            subgateTime = toSEC(tn.t, tm);
          } else {
            let tm = Number(ln.replace(`.`, ``));
            subgateTime = toSEC(tn.t, tm) + toSEC(tn.t, tm * 2);
          }
          subTiming += subgateTime;

          // ------------------------------------------------------------------
          // 音階配列に複数の値が入っている場合、
          // 音量、パンポット、タイ or スラーの処理
          if (1 < tn.tn.length && idx !== tn.tn.length - 1) {
            // 音量
            let gval = Math.sin((tn.v[idx + 1] / V.max) * 0.5 * Math.PI);
            gainN.gain.linearRampToValueAtTime(gval, subTiming);
            // パンポット
            let pval = tn.p[idx + 1] / P.max;
            panrN.pan.linearRampToValueAtTime(pval, subTiming);
            // 音階
            let freq = nn[tn.o[idx + 1]][tn.tn[idx + 1].replace(`+`, `#`)];
            osciN.frequency.linearRampToValueAtTime(freq, subTiming);
          }
        }

        // --------------------------------------------------------------------
        // 音長配列（付点なし、付点あり）=> 次の発音タイミング計算
        tn.l.forEach((ln) => {
          if (!ln.includes(`.`)) {
            let tm = Number(ln);
            fullTime += toSEC(tn.t, tm);
          } else {
            let tm = Number(ln.replace(`.`, ``));
            fullTime += toSEC(tn.t, tm) + toSEC(tn.t, tm * 2);
          }
        });

        // --------------------------------------------------------------------
        // ゲートタイム（スタッカート）の音長計算
        gateTime = (fullTime * tn.q) / Q.max; // <= ゲートタイムを加味
        Timing += gateTime;

        // --------------------------------------------------------------------
        // ADSRの代用
        // 音量減衰 => 次の発音タイミングまでに半分まで減衰させる
        if (tn.v.length < 2) {
          let gval = gainN.gain.value;
          gainN.gain.linearRampToValueAtTime(gval * 0.5, Timing);
        }
      }

      // ----------------------------------------------------------------------
      // ゲートタイム（スタッカート）=> 次の発音タイミング計算
      // 次の発音タイミングまでに休符を挟み込んでスタッカートを再現
      if (tn.q < Q.max) {
        osciN.frequency.setValueAtTime(0, Timing);
        gainN.gain.setValueAtTime(0, Timing);
        panrN.pan.setValueAtTime(0, Timing);
        Timing += fullTime - gateTime;
      }
    });
    osciN.type = "square";
    osciN.start(tm_start);
    osciN.stop(Timing);

    // ------------------------------------------------------------------------
    //  +-------+    +-------+    +-------+      +-------+
    //  | osciN | -> | gainN | -> | panrN |  =>  |  ary  |
    //  +-------+    +-------+    +-------+      +-------+
    osciN.connect(gainN);
    gainN.connect(panrN);
    ary.push(panrN);
  });

  // --------------------------------------------------------------------------
  //  +-------+      +--------+    +-------+
  //  |  ary  |  =>  | master | -> |  dst  |
  //  +-------+      +--------+    +-------+
  // const master = ctx.createGain();
  // master.gain.value = 1;
  // ary.forEach((x) => x.connect(master));
  // master.connect(dst);

  // --------------------------------------------------------------------------
  //  +-------+      +-------+
  //  |  ary  |  =>  |  dst  |
  //  +-------+      +-------+
  ary.forEach((x) => x.connect(dst));

  return aux;
};

export { assemble };
