// =============================================================================
// parser.js
// Copyright © 2021- gaku.iwa All Rights Reserved.
// =============================================================================
import { O, P, Q, T, V } from "./define.js";

// -----------------------------------------------------------------------------
// 制御配列を逆順に検索して、制御キーから設定値を取得する
// -----------------------------------------------------------------------------
// `t`:テンポ         1 ~ 480
// `v`:音量           0 ~ 15
// `!`:一時的な音量   0 ~ 15
// `p`:パン          -8 ~ 0 ~ +8、左〜中央〜右
// `o`:オクターブ     1 ~ 9
// `q`:ゲートタイム   1 ~ 8、スタッカート的な効果
// `l`:音長
// `&`:タイ or スラー
const searchCTRL = (ary, chr, def) => {
  let rtn = { key: chr, value: def, index: -1 };
  for (var i = ary.length - 1; i >= 0; --i) {
    if (ary[i].ctrl !== chr) continue;
    rtn.value = Number(ary[i].param);
    rtn.index = i;
    break;
  }
  return rtn;
};

// -----------------------------------------------------------------------------
// 制御配列を逆順に検索して、制御キーから設定値を取得する
// -----------------------------------------------------------------------------
// `m`:LFO
const searchLFO = (ary, chr) => {
  let rtn = { key: chr, value: ``, index: -1 };
  for (var i = ary.length - 1; i >= 0; --i) {
    if (ary[i].ctrl !== chr) continue;
    rtn.value = ary[i].param;
    rtn.index = i;
    break;
  }
  return rtn;
};

// -----------------------------------------------------------------------------
// 制御配列と音階データから、Web Audio APIで利用しやすい形式へ変換
const convert = (ary, tn) => {
  const rtn = {
    t: Math.max(Math.min(searchCTRL(ary, `t`, T.def).value, T.max), T.min),
    v: Math.max(Math.min(searchCTRL(ary, `v`, V.def).value, V.max), V.min),
    p: Math.max(Math.min(searchCTRL(ary, `p`, P.def).value, P.max), P.min),
    o: Math.max(Math.min(searchCTRL(ary, `o`, O.def).value, O.max), O.min),
    q: Math.max(Math.min(searchCTRL(ary, `q`, Q.def).value, Q.max), Q.min),
    tn: `c`,
    l: `4`,
    j: 0,
    m: ``,
  };

  // ---------------------------------------------------------------------------
  // 音階指定の前に一時的な音量指定があった場合
  // 判定後、一時的な指定音量へ変更し、制御配列から取り除く
  let v = searchCTRL(ary, `!`, V.def);
  if (v.index !== -1) {
    rtn.v = Math.max(Math.min(v.value, V.max), V.min);
    ary.splice(v.index, 1);
  }

  // ---------------------------------------------------------------------------
  // 音階指定の前にタイorスラー指定があった場合
  // 判定後、jointフラグを立てて、制御配列から取り除く
  let j = searchCTRL(ary, `&`, rtn.j);
  rtn.j = Math.max(Math.min(j.value, 1), 0);
  if (rtn.j === 1) {
    ary.splice(j.index, 1);
  }

  // ---------------------------------------------------------------------------
  // LFO
  // 判定後、制御配列から取り除く
  let m = searchLFO(ary, `m`);
  if (m.index !== -1) {
    rtn.m = m.value;
    ary.splice(m.index, 1);
  }

  // ---------------------------------------------------------------------------
  // 音長
  let l = searchCTRL(ary, `l`, rtn.l);
  rtn.l = tn.len === `` ? l.value.toString() : tn.len === `.` ? l.value.toString() + `.` : tn.len;

  // ---------------------------------------------------------------------------
  // 音階
  rtn.tn = (tn.tone + `  `).slice(0, 2);
  return rtn;
};

// -----------------------------------------------------------------------------
// MMLパーサー
const parser = (mml_part) => {
  const parser_result = [];
  mml_part.forEach((mml) => {
    let tmp = { ctrl:``, param:``, tone:``, len:``, };
    let dmy = JSON.parse(JSON.stringify(tmp));
    let ctrlAry = [];
    let toneAry = [];

    // -------------------------------------------------------------------------
    // ひと文字ずつ読み込んで、
    // 制御配列（ctrlAry） or 音階配列（toneAry）へ積み込む
    Array.prototype.forEach.call(mml, (item) => {
      const chr = item.toLowerCase();
      switch (chr) {
        case `t`:
        case `v`:
        case `p`:
        case `o`:
        case `l`:
        case `q`:
        case `>`:
        case `<`:
        case `!`:
        case `m`:
          if (dmy.ctrl !== chr || dmy.tone !== chr) {
            if (dmy.ctrl !== ``) ctrlAry.push(dmy);
            if (dmy.tone !== ``) toneAry.push(convert(ctrlAry, dmy));
            dmy = JSON.parse(JSON.stringify(tmp));
          }
          switch (chr) {
            case `t`: // テンポ
              dmy.ctrl = `t`;
              break;
            case `v`: // 音量
              dmy.ctrl = `v`;
              break;
            case `p`: // パン
              dmy.ctrl = `p`;
              break;
            case `o`: // 音階
              dmy.ctrl = `o`;
              break;
            case `q`: // ゲートタイム
              dmy.ctrl = `q`;
              break;
            case `l`: // 音長
              dmy.ctrl = `l`;
              break;
            case `>`: // オクターブ上げ
              {
                let o = searchCTRL(ctrlAry, `o`, 4);
                dmy.ctrl = o.key;
                dmy.param = (o.value + 1).toString();
              }
              break;
            case `<`: // オクターブ下げ
              {
                let o = searchCTRL(ctrlAry, `o`, 4);
                dmy.ctrl = o.key;
                dmy.param = (o.value - 1).toString();
              }
              break;
            case `!`: // 一時的な音量
              dmy.ctrl = `!`;
              break;
            case `m`: // LFO
              dmy.ctrl = `m`;
              break;
          }
          break;

        case `&`: // タイ or スラー
          if (dmy.ctrl !== chr || dmy.tone !== chr) {
            if (dmy.ctrl !== ``) ctrlAry.push(dmy);
            if (dmy.tone !== ``) toneAry.push(convert(ctrlAry, dmy));
            dmy = JSON.parse(JSON.stringify(tmp));
            dmy.ctrl = `&`;
            dmy.param = `1`;
          }
          break;

        case `r`: // 休符
        case `a`: // 音階 ラ
        case `b`: // 音階 シ
        case `c`: // 音階 ド
        case `d`: // 音階 レ
        case `e`: // 音階 ミ
        case `f`: // 音階 ファ
        case `g`: // 音階 ソ
          if (dmy.ctrl !== chr || dmy.tone !== chr) {
            if (dmy.ctrl !== ``) ctrlAry.push(dmy);
            if (dmy.tone !== ``) toneAry.push(convert(ctrlAry, dmy));
            dmy = JSON.parse(JSON.stringify(tmp));
          }
          dmy.tone += chr;
          break;

        case `-`: // 半音サゲ or 負パラメータ
        case `+`: // 半音アゲ or 正パラメータ
        case `#`: // 半音アゲ ← 音階の後の記述のみ有効
          if (dmy.tone.length === 1 && `a` <= dmy.tone && dmy.tone <= `g`) {
            dmy.tone += chr;
          }
          if (dmy.ctrl === `p` && (chr === `-` || chr === `+`)) {
            dmy.param += chr;
          }
          break;

        case `.`: // 付点←連続した付点（二重、三重）は、２個目以降は無視
                  // LFOパラメータ｜小数値
          if (dmy.ctrl === `m`) dmy.param += chr;
          if (dmy.tone !== `` && !dmy.len.includes(`.`)) {
            dmy.len += chr;
          }
          break;

        case `/`: // LFOパラメータ｜区切り文字
          if (dmy.ctrl === `m`) dmy.param += chr;
          break;

        case `0`:
        case `1`:
        case `2`:
        case `3`:
        case `4`:
        case `5`:
        case `6`:
        case `7`:
        case `8`:
        case `9`:
          if (dmy.ctrl !== ``) dmy.param += chr;
          if (dmy.tone !== ``) dmy.len += chr;
          break;

        default: // 無視
      }
    });

    // -------------------------------------------------------------------------
    // 最後の要素を積み込んでいないので、
    // 制御配列（ctrlAry） or 音階配列（toneAry）へ積み込む
    if (dmy.ctrl !== ``) ctrlAry.push(dmy);
    if (dmy.tone !== ``) toneAry.push(convert(ctrlAry, dmy));

    // -------------------------------------------------------------------------
    // １音ずつの音階配列から「＆」による音の結合を考慮して、
    // 音量、パンポット、オクターブ、音長、音階を配列化する
    // テンポとゲートタイムは、結合前の指定値を採用する
    let tmpAry = [];
    for (let loop = 0; loop < toneAry.length; ++loop) {
      let rtn = {
        t: toneAry[loop].t,
        q: toneAry[loop].q,
        v: [],
        p: [],
        o: [],
        l: [],
        m: [],
        tn: [],
      };
      if (toneAry[loop].j === 1) {
        // ＆記号あり、前要素からの延長
        if (0 < tmpAry.length) {
          rtn = tmpAry[tmpAry.length - 1];
          rtn.v.push(toneAry[loop].v);
          rtn.p.push(toneAry[loop].p);
          rtn.o.push(toneAry[loop].o);
          rtn.l.push(toneAry[loop].l);
          rtn.m.push(toneAry[loop].m);
          rtn.tn.push(toneAry[loop].tn);
        } else {
          rtn.v.push(toneAry[loop].v);
          rtn.p.push(toneAry[loop].p);
          rtn.o.push(toneAry[loop].o);
          rtn.l.push(toneAry[loop].l);
          rtn.m.push(toneAry[loop].m);
          rtn.tn.push(toneAry[loop].tn);
          tmpAry.push(rtn);
        }
      } else {
        // ＆記号なし、新要素として追加
        rtn.v.push(toneAry[loop].v);
        rtn.p.push(toneAry[loop].p);
        rtn.o.push(toneAry[loop].o);
        rtn.l.push(toneAry[loop].l);
        rtn.m.push(toneAry[loop].m);
        rtn.tn.push(toneAry[loop].tn);
        tmpAry.push(rtn);
      }
    }

    // -------------------------------------------------------------------------
    // デバッグログ
    tmpAry.forEach((x) => {
      console.log(`T${("   " + x.t.toString()).slice(-3)} Q[${x.q}] V[${x.v}] P[${x.p}] O[${x.o}][${x.tn}] L[${x.l}] LFO[${x.m}]`);
    });
    console.log("-".repeat(40));

    // -------------------------------------------------------------------------
    // パース結果をパート配列へ
    let part = {};
    part.toneAry = tmpAry;
    parser_result.push(part);
  });
  return parser_result;
};

export { parser };
