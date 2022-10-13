// =============================================================================
// assemble.js
// Copyright © 2021- gaku.iwa All Rights Reserved.
// =============================================================================
import { P, Q, V, nn, rest, toSEC } from "./define.js";

// -----------------------------------------------------------------------------
// LFOパラメータの分解、Web Audio APIで利用しやすい形式へ変換
const parserLFO = (strParam, tempo, gatetime) => {
  const rtn = {
    type: 0,
    gateTime: 0,
    depth: 0,
    speed: 0,
  };

  if (strParam.length < 1) {
    return rtn;
  }

  let ary = strParam.split(`/`) || ``;
  if (ary.length === 3 || ary.length === 4) {
    //  揺らぎ効果のタイプ
    rtn.type = Number(ary[0]);

    //  揺らぎ効果の深さ
    rtn.depth = Number(ary[2]);

    //  揺らぎ効果の音長
    let ln = ary.length === 4 ? ary[3] : gatetime;
    if (!ln.includes(`.`)) {
      let tm = Number(ln);
      rtn.gateTime = toSEC(tempo, tm);
    } else {
      let tm = Number(ln.replace(`.`, ``));
      rtn.gateTime = toSEC(tempo, tm) + toSEC(tempo, tm * 2);
    }

    //  揺らぎ効果の回数
    rtn.speed = Number(ary[1]) / rtn.gateTime;
  }
  return rtn;
};

// -----------------------------------------------------------------------------
// 音階配列からWeb Audio APIの組み立て
// -----------------------------------------------------------------------------
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
  const tm_zero = aux.currentTime;
  const tm_start = tm_zero;

  // ---------------------------------------------------------------------------
  // MMLパーサー処理結果をパート毎にループ処理
  parse_result.forEach((part) => {
    // -------------------------------------------------------------------------
    // Tone Node インスタンス化
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    const pan = ctx.createStereoPanner();

    // -------------------------------------------------------------------------
    // 変数初期化
    let Timing = 0; // 全体の演奏時間

    // -------------------------------------------------------------------------
    // LFO Node インスタンス化
    // -------------------------------------------------------------------------
    // 接続方法が異なるだけなので、１つのインスタンスでビブラート効果と
    // トレモロ効果を切り替える方針で実装したけど…
    // 'setConnectAtTime'みたいな感じで、接続方法を時系列で切り替えできない😱
    // 一晩考えた結果、単純に２つのインスタンスを保持する結論に達しました

    // -------------------------------------------------------------------------
    // LFO Node for Vibrato
    const vib_dep = ctx.createGain();
    vib_dep.gain.value = 0;
    vib_dep.connect(osc.frequency); // ←周波数に作用

    const vib_lfo = ctx.createOscillator();
    vib_lfo.frequency.value = 0;
    vib_lfo.connect(vib_dep); // ←depthに接続

    // -------------------------------------------------------------------------
    // LFO Node for Tremolo
    const tre_dep = ctx.createGain();
    tre_dep.gain.value = 0;
    tre_dep.connect(vol.gain); // ←音量に作用

    const tre_lfo = ctx.createOscillator();
    tre_lfo.frequency.value = 0;
    tre_lfo.connect(tre_dep); // ←depthに接続

    // -------------------------------------------------------------------------
    // パートの音階配列を１音毎にループ処理
    part.toneAry.forEach((tn) => {
      // -----------------------------------------------------------------------
      // 変数初期化
      let fullTime = 0; // 音長全体の時間
      let gateTime = 0; // スタッカートを考慮した発音時間

      switch (tn.tn[0]) {
        case rest:
          {
            // 休符
            // -----------------------------------------------------------------
            // Tone Node
            osc.frequency.setValueAtTime(0, Timing);
            vol.gain.setValueAtTime(0, Timing);
            pan.pan.setValueAtTime(0, Timing);

            // -----------------------------------------------------------------
            // LFO Node
            vib_dep.gain.setValueAtTime(0, Timing);
            vib_lfo.frequency.setValueAtTime(0, Timing);
            tre_dep.gain.setValueAtTime(0, Timing);
            tre_lfo.frequency.setValueAtTime(0, Timing);

            // -----------------------------------------------------------------
            // 休符の場合、ゲートタイムを上限値に上書きする
            tn.q = Q.max;

            // -----------------------------------------------------------------
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

            // -----------------------------------------------------------------
            // スタッカートのゲートタイム（音長）計算
            gateTime = (fullTime * tn.q) / Q.max; // <= ゲートタイムを加味
            Timing += gateTime;
          }
          break;

        default:
          {
            // 音符
            // -----------------------------------------------------------------
            // 変数初期化
            let subTiming = Timing;
            let subgateTime = 0;

            for (let idx = 0; idx < tn.tn.length; ++idx) {
              if (idx === 0) {
                // -------------------------------------------------------------
                // 発音時点の音量
                let val_vol = Math.cos((1 - tn.v[idx] / V.max) * 0.5 * Math.PI);
                vol.gain.setValueAtTime(val_vol, subTiming);

                // -------------------------------------------------------------
                // 発音時点のパンポット
                let val_pan = tn.p[idx] / P.max;
                pan.pan.setValueAtTime(val_pan, subTiming);

                // -------------------------------------------------------------
                // 発音時点の音階（周波数）
                let freq = nn[tn.o[idx]][tn.tn[idx].replace(`+`, `#`)];
                osc.frequency.setValueAtTime(freq, subTiming);

                // -------------------------------------------------------------
                // setting LFO
                let lfo_param = parserLFO(tn.m[idx] || ``, tn.t, tn.l[idx]);
                switch (lfo_param.type) {
                  case 1: // Vibrato
                    vib_dep.gain.setValueAtTime(lfo_param.depth, subTiming);
                    vib_lfo.frequency.setValueAtTime(lfo_param.speed, subTiming);
                    vib_dep.gain.setValueAtTime(0, subTiming + lfo_param.gateTime);
                    vib_lfo.frequency.setValueAtTime(0, subTiming + lfo_param.gateTime);
                    break;
                  case 2: // Tremolo
                    tre_dep.gain.setValueAtTime(lfo_param.depth, subTiming);
                    tre_lfo.frequency.setValueAtTime(lfo_param.speed, subTiming);
                    tre_dep.gain.setValueAtTime(0, subTiming + lfo_param.gateTime);
                    tre_lfo.frequency.setValueAtTime(0, subTiming + lfo_param.gateTime);
                    break;
                  default:
                    break;
                }
              }

              // ---------------------------------------------------------------
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

              // ---------------------------------------------------------------
              // 音階配列に複数の値が入っている場合、
              // 音量、パンポット、タイ or スラーの処理
              if (1 < tn.tn.length && idx !== tn.tn.length - 1) {
                // -------------------------------------------------------------
                // 音量
                let val_vol = Math.sin((tn.v[idx + 1] / V.max) * 0.5 * Math.PI);
                vol.gain.linearRampToValueAtTime(val_vol, subTiming);

                // -------------------------------------------------------------
                // パンポット
                let val_pan = tn.p[idx + 1] / P.max;
                pan.pan.linearRampToValueAtTime(val_pan, subTiming);

                // -------------------------------------------------------------
                // 音階
                let freq = nn[tn.o[idx + 1]][tn.tn[idx + 1].replace(`+`, `#`)];
                // osc.frequency.linearRampToValueAtTime(freq, subTiming);
                osc.frequency.exponentialRampToValueAtTime(freq, subTiming);

                // -------------------------------------------------------------
                // setting LFO
                let lfo_param = parserLFO(tn.m[idx + 1] || ``, tn.t, tn.l[idx + 1]);
                switch (lfo_param.type) {
                  case 1: // Vibrato
                    vib_dep.gain.setValueAtTime(lfo_param.depth, subTiming);
                    vib_lfo.frequency.setValueAtTime(lfo_param.speed, subTiming);
                    vib_dep.gain.setValueAtTime(0, subTiming + lfo_param.gateTime);
                    vib_lfo.frequency.setValueAtTime(0, subTiming + lfo_param.gateTime);
                    break;
                  case 2: // Tremolo
                    tre_dep.gain.setValueAtTime(lfo_param.depth, subTiming);
                    tre_lfo.frequency.setValueAtTime(lfo_param.speed, subTiming);
                    tre_dep.gain.setValueAtTime(0, subTiming + lfo_param.gateTime);
                    tre_lfo.frequency.setValueAtTime(0, subTiming + lfo_param.gateTime);
                    break;
                  default:
                    break;
                }
              }
            }

            // -----------------------------------------------------------------
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

            // -----------------------------------------------------------------
            // スタッカートのゲートタイム（音長）計算
            // -----------------------------------------------------------------
            // 例）Ｑ６を指定した場合
            //
            // |-----1-----2-----3-----4-----5-----6-----7-----8
            // |<- fullTime                                  ->|
            // |<- gateTime                      ->|
            //                                     |<- 無 音 ->|
            //                                                 |<- 次の発音タイミング
            gateTime = (fullTime * tn.q) / Q.max;
            Timing += gateTime;

            // -----------------------------------------------------------------
            // ADSRの代用
            // 音量減衰 => 次の発音タイミングまでに半分まで減衰させる
            if (tn.v.length < 2) {
              let val_vol = vol.gain.value;
              // vol.gain.linearRampToValueAtTime(val_vol * 0.5, Timing);
              vol.gain.exponentialRampToValueAtTime(val_vol * 0.5, Timing);
            }
          }
          break;
      }

      // -----------------------------------------------------------------------
      // スタッカートの無音時間の加算
      // 一旦発音を止め、演奏全体時間（Timing）を次の発音タイミングまでスキップ
      // -----------------------------------------------------------------------
      // 例）Ｑ６を指定した場合
      //
      // |-----1-----2-----3-----4-----5-----6-----7-----8
      // |<- fullTime                                  ->|
      // |<- gateTime                      ->|
      //                                     |<- 無 音 ->|
      //                                                 |<- 次の発音タイミング
      if (tn.q < Q.max) {
        // ---------------------------------------------------------------------
        // Tone Node
        osc.frequency.setValueAtTime(0, Timing);
        vol.gain.setValueAtTime(0, Timing);
        pan.pan.setValueAtTime(0, Timing);

        // ---------------------------------------------------------------------
        // LFO Node
        vib_dep.gain.setValueAtTime(0, Timing);
        vib_lfo.frequency.setValueAtTime(0, Timing);
        tre_dep.gain.setValueAtTime(0, Timing);
        tre_lfo.frequency.setValueAtTime(0, Timing);

        // ---------------------------------------------------------------------
        // 無音時間の加算
        Timing += fullTime - gateTime;
      }
    });

    // -------------------------------------------------------------------------
    // Tone Oscillator
    osc.type = "square";
    osc.start(tm_start);
    osc.stop(tm_start + Timing);

    // -------------------------------------------------------------------------
    // LFO Oscillator for Vibrato
    vib_lfo.start(tm_start);
    vib_lfo.stop(tm_start + Timing);

    // -------------------------------------------------------------------------
    // LFO Oscillator for Tremolo
    tre_lfo.start(tm_start);
    tre_lfo.stop(tm_start + Timing);

    // -------------------------------------------------------------------------
    //  +-------+    +-------+    +-------+      +-------+
    //  | osciN | -> | gainN | -> | panrN |  =>  |  ary  |
    //  +-------+    +-------+    +-------+      +-------+
    osc.connect(vol);
    vol.connect(pan);
    ary.push(pan);
  });

  // ---------------------------------------------------------------------------
  //  +-------+      +--------+    +-------+
  //  |  ary  |  =>  | master | -> |  dst  |
  //  +-------+      +--------+    +-------+
  // const master = ctx.createGain();
  // master.gain.value = 1;
  // ary.forEach((x) => x.connect(master));
  // master.connect(dst);

  // ---------------------------------------------------------------------------
  //  +-------+      +-------+
  //  |  ary  |  =>  |  dst  |
  //  +-------+      +-------+
  ary.forEach((x) => x.connect(dst));

  return aux;
};

export { assemble };
