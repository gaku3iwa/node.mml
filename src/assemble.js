// =============================================================================
// assemble.js
// Copyright © 2021- gaku.iwa All Rights Reserved.
// =============================================================================
import { P, Q, V, nn, rest, toSEC } from "./define.js";

// -----------------------------------------------------------------------------
// LFOパラメータの分解、Web Audio APIで利用しやすい形式へ変換
const parserLFO = (strParam, tempo, def_gatetime) => {
  const rtn = {
    type: 0,

    v_gateTime: 0,
    v_depth: 0,
    v_speed: 0,

    t_gateTime: 0,
    t_depth: 0,
    t_speed: 0,
  };

  if (strParam.length < 1) {
    return rtn;
  }

  let ary = strParam.split(`/`) || ``;
  if (ary.length === 3 || ary.length === 4) {
    //  揺らぎ効果のタイプ
    rtn.type = Number(ary[0]);

    switch (rtn.type) {
      case 1:
        {
          let speed = Number(ary[1]);
          let depth = Number(ary[2]);
          let ln = ary.length === 4 ? ary[3] || def_gatetime : def_gatetime;

          //  揺らぎ効果の深さ
          rtn.v_depth = depth;

          //  揺らぎ効果の音長
          if (!ln.includes(`.`)) {
            let tm = Number(ln);
            rtn.v_gateTime = toSEC(tempo, tm);
          } else {
            let tm = Number(ln.replace(`.`, ``));
            rtn.v_gateTime = toSEC(tempo, tm) + toSEC(tempo, tm * 2);
          }

          //  揺らぎ効果の回数
          rtn.v_speed = speed / rtn.v_gateTime;
        }
        break;

      case 2:
        {
          let speed = Number(ary[1]);
          let depth = Number(ary[2]) / 100.0;
          let ln = ary.length === 4 ? ary[3] || def_gatetime : def_gatetime;

          //  揺らぎ効果の深さ
          rtn.t_depth = depth;

          //  揺らぎ効果の音長
          if (!ln.includes(`.`)) {
            let tm = Number(ln);
            rtn.t_gateTime = toSEC(tempo, tm);
          } else {
            let tm = Number(ln.replace(`.`, ``));
            rtn.t_gateTime = toSEC(tempo, tm) + toSEC(tempo, tm * 2);
          }

          //  揺らぎ効果の回数
          rtn.t_speed = speed / rtn.t_gateTime;
        }
        break;
    }
  } else if (ary.length === 6 || ary.length === 7) {
    //  揺らぎ効果のタイプ
    rtn.type = Number(ary[0]);

    switch (rtn.type) {
      case 3:
        {
          let speed = Number(ary[1]);
          let depth = Number(ary[2]);
          let ln = ary[3] || def_gatetime;

          //  揺らぎ効果の深さ
          rtn.v_depth = depth;

          //  揺らぎ効果の音長
          if (!ln.includes(`.`)) {
            let tm = Number(ln);
            rtn.v_gateTime = toSEC(tempo, tm);
          } else {
            let tm = Number(ln.replace(`.`, ``));
            rtn.v_gateTime = toSEC(tempo, tm) + toSEC(tempo, tm * 2);
          }

          //  揺らぎ効果の回数
          rtn.v_speed = speed / rtn.v_gateTime;
        }
        {
          let speed = Number(ary[4]);
          let depth = Number(ary[5]) / 100.0;
          let ln = ary.length === 7 ? ary[6] || def_gatetime : def_gatetime;

          //  揺らぎ効果の深さ
          rtn.t_depth = depth;

          //  揺らぎ効果の音長
          if (!ln.includes(`.`)) {
            let tm = Number(ln);
            rtn.t_gateTime = toSEC(tempo, tm);
          } else {
            let tm = Number(ln.replace(`.`, ``));
            rtn.t_gateTime = toSEC(tempo, tm) + toSEC(tempo, tm * 2);
          }

          //  揺らぎ効果の回数
          rtn.t_speed = speed / rtn.t_gateTime;
        }
        break;
    }
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
    const v_dep = ctx.createGain();
    v_dep.gain.value = 0;
    v_dep.connect(osc.frequency); // ←周波数に作用

    const v_lfo = ctx.createOscillator();
    v_lfo.frequency.value = 0;
    v_lfo.connect(v_dep); // ←depthに接続

    // -------------------------------------------------------------------------
    // LFO Node for Tremolo
    const t_dep = ctx.createGain();
    t_dep.gain.value = 0;
    t_dep.connect(vol.gain); // ←音量に作用

    const t_lfo = ctx.createOscillator();
    t_lfo.frequency.value = 0;
    t_lfo.connect(t_dep); // ←depthに接続

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
            v_dep.gain.setValueAtTime(0, Timing);
            v_lfo.frequency.setValueAtTime(0, Timing);
            t_dep.gain.setValueAtTime(0, Timing);
            t_lfo.frequency.setValueAtTime(0, Timing);

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
                    {
                      v_dep.gain.setValueAtTime(lfo_param.v_depth, subTiming);
                      v_lfo.frequency.setValueAtTime(lfo_param.v_speed, subTiming);
                      v_dep.gain.setValueAtTime(0, subTiming + lfo_param.v_gateTime);
                      v_lfo.frequency.setValueAtTime(0, subTiming + lfo_param.v_gateTime);
                    }
                    break;

                  case 2: // Tremolo
                    {
                      let tmp_depth = val_vol * lfo_param.t_depth;
                      t_dep.gain.setValueAtTime(tmp_depth, subTiming);
                      t_lfo.frequency.setValueAtTime(lfo_param.t_speed, subTiming);
                      t_dep.gain.setValueAtTime(0, subTiming + lfo_param.t_gateTime);
                      t_lfo.frequency.setValueAtTime(0, subTiming + lfo_param.t_gateTime);
                    }
                    break;

                  case 3: // Vibrato & Tremolo
                    {
                      v_dep.gain.setValueAtTime(lfo_param.v_depth, subTiming);
                      v_lfo.frequency.setValueAtTime(lfo_param.v_speed, subTiming);
                      v_dep.gain.setValueAtTime(0, subTiming + lfo_param.v_gateTime);
                      v_lfo.frequency.setValueAtTime(0, subTiming + lfo_param.v_gateTime);

                      let tmp_depth = val_vol * lfo_param.t_depth;
                      t_dep.gain.setValueAtTime(tmp_depth, subTiming);
                      t_lfo.frequency.setValueAtTime(lfo_param.t_speed, subTiming);
                      t_dep.gain.setValueAtTime(0, subTiming + lfo_param.t_gateTime);
                      t_lfo.frequency.setValueAtTime(0, subTiming + lfo_param.t_gateTime);
                    }
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
                    {
                      v_dep.gain.setValueAtTime(lfo_param.v_depth, subTiming);
                      v_lfo.frequency.setValueAtTime(lfo_param.v_speed, subTiming);
                      v_dep.gain.setValueAtTime(0, subTiming + lfo_param.v_gateTime);
                      v_lfo.frequency.setValueAtTime(0, subTiming + lfo_param.v_gateTime);
                    }
                    break;

                  case 2: // Tremolo
                    {
                      let tmp_depth = val_vol * lfo_param.t_depth;
                      t_dep.gain.setValueAtTime(tmp_depth, subTiming);
                      t_lfo.frequency.setValueAtTime(lfo_param.t_speed, subTiming);
                      t_dep.gain.setValueAtTime(0, subTiming + lfo_param.t_gateTime);
                      t_lfo.frequency.setValueAtTime(0, subTiming + lfo_param.t_gateTime);
                    }
                    break;

                  case 3: // Vibrato & Tremolo
                    {
                      v_dep.gain.setValueAtTime(lfo_param.v_depth, subTiming);
                      v_lfo.frequency.setValueAtTime(lfo_param.v_speed, subTiming);
                      v_dep.gain.setValueAtTime(0, subTiming + lfo_param.v_gateTime);
                      v_lfo.frequency.setValueAtTime(0, subTiming + lfo_param.v_gateTime);

                      let tmp_depth = val_vol * lfo_param.t_depth;
                      t_dep.gain.setValueAtTime(tmp_depth, subTiming);
                      t_lfo.frequency.setValueAtTime(lfo_param.t_speed, subTiming);
                      t_dep.gain.setValueAtTime(0, subTiming + lfo_param.t_gateTime);
                      t_lfo.frequency.setValueAtTime(0, subTiming + lfo_param.t_gateTime);
                    }
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
              vol.gain.linearRampToValueAtTime(val_vol * 0.5, Timing);
              // vol.gain.exponentialRampToValueAtTime(val_vol * 0.5, Timing);
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
        v_dep.gain.setValueAtTime(0, Timing);
        v_lfo.frequency.setValueAtTime(0, Timing);
        t_dep.gain.setValueAtTime(0, Timing);
        t_lfo.frequency.setValueAtTime(0, Timing);

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
    v_lfo.start(tm_start);
    v_lfo.stop(tm_start + Timing);

    // -------------------------------------------------------------------------
    // LFO Oscillator for Tremolo
    t_lfo.start(tm_start);
    t_lfo.stop(tm_start + Timing);

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
