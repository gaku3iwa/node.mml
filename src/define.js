// =============================================================================
// define.js
// Copyright © 2021- gaku.iwa All Rights Reserved.
// =============================================================================

// -----------------------------------------------------------------------------
// 下限値、上限値、規定値 他
const rest = `r `;
// prettier-ignore
const T = { min:  1, max: 480, def: 120 };
// prettier-ignore
const V = { min:  0, max:  15, def:  10 };
// prettier-ignore
const P = { min: -8, max:  +8, def:   0, center: 0, left: -8, right: +8 };
// prettier-ignore
const O = { min:  1, max:   9, def:   4 };
// prettier-ignore
const Q = { min:  1, max:   8, def:   8 };

// -----------------------------------------------------------------------------
// 秒数へ変換
// -----------------------------------------------------------------------------
// テンポと音長から秒数を算出する
// ex.) 「toSEC(120, 4)」=> 0.5[sec]を返却します
//      「t120 c4」
//        =>  １分間に４分音符120個分の速さで「ド」を４分音符の長さで鳴らす
//            Web Audio APIには、具体的な「秒数指定」が必要なので…
const toSEC = (tempo, length) => (60 / tempo) * (4 / length);

// -----------------------------------------------------------------------------
// 周波数へ変換
// -----------------------------------------------------------------------------
// num = 69（o5 a => 440Hz）を基準に平均律の周波数値へ変換する
// => 平均律は１オクターブを12等分した音階のこと
const toHz = (num) => 440 * Math.pow(2, (num - 69) / 12);

// -----------------------------------------------------------------------------
// 音階テーブル（「o5 a」=> 440Hzが基準）
// -----------------------------------------------------------------------------
// ex.1) 「o4 a-」=> nn[4]["a-"] を指定する
// ex.2) 「o5 a 」=> nn[5]["a "] を指定する
// ex.3) 「o6 a#」=> nn[6]["a#"] を指定する
// -----------------------------------------------------------------------------
// prettier-ignore
const nn = [
  {
    // o0
                      "d-": toHz(0x01), "e-": toHz(0x03), "f-": toHz(0x04), "g-": toHz(0x06), "a-": toHz(0x08), "b-": toHz(0x0a), // 10
    "c ": toHz(0x00), "d ": toHz(0x02), "e ": toHz(0x04), "f ": toHz(0x05), "g ": toHz(0x07), "a ": toHz(0x09), "b ": toHz(0x0b), // 11
    "c#": toHz(0x01), "d#": toHz(0x03), "e#": toHz(0x05), "f#": toHz(0x06), "g#": toHz(0x08), "a#": toHz(0x0a), "b#": toHz(0x0c), // 12
  },
  {
    // o1
    "c-": toHz(0x0b), "d-": toHz(0x0d), "e-": toHz(0x0f), "f-": toHz(0x10), "g-": toHz(0x12), "a-": toHz(0x14), "b-": toHz(0x16), // 22
    "c ": toHz(0x0c), "d ": toHz(0x0e), "e ": toHz(0x10), "f ": toHz(0x11), "g ": toHz(0x13), "a ": toHz(0x15), "b ": toHz(0x17), // 23
    "c#": toHz(0x0d), "d#": toHz(0x0f), "e#": toHz(0x11), "f#": toHz(0x12), "g#": toHz(0x14), "a#": toHz(0x16), "b#": toHz(0x18), // 24
  },
  {
    // o2
    "c-": toHz(0x17), "d-": toHz(0x19), "e-": toHz(0x1b), "f-": toHz(0x1c), "g-": toHz(0x1e), "a-": toHz(0x20), "b-": toHz(0x22), // 34
    "c ": toHz(0x18), "d ": toHz(0x1a), "e ": toHz(0x1c), "f ": toHz(0x1d), "g ": toHz(0x1f), "a ": toHz(0x21), "b ": toHz(0x23), // 35
    "c#": toHz(0x19), "d#": toHz(0x1b), "e#": toHz(0x1d), "f#": toHz(0x1e), "g#": toHz(0x20), "a#": toHz(0x22), "b#": toHz(0x24), // 36
  },
  {
    // o3
    "c-": toHz(0x23), "d-": toHz(0x25), "e-": toHz(0x27), "f-": toHz(0x28), "g-": toHz(0x2a), "a-": toHz(0x2c), "b-": toHz(0x2e), // 46
    "c ": toHz(0x24), "d ": toHz(0x26), "e ": toHz(0x28), "f ": toHz(0x29), "g ": toHz(0x2b), "a ": toHz(0x2d), "b ": toHz(0x2f), // 47
    "c#": toHz(0x25), "d#": toHz(0x27), "e#": toHz(0x29), "f#": toHz(0x2a), "g#": toHz(0x2c), "a#": toHz(0x2e), "b#": toHz(0x30), // 48
  },
  {
    // o4
    "c-": toHz(0x2f), "d-": toHz(0x31), "e-": toHz(0x33), "f-": toHz(0x34), "g-": toHz(0x36), "a-": toHz(0x38), "b-": toHz(0x3a), // 58
    "c ": toHz(0x30), "d ": toHz(0x32), "e ": toHz(0x34), "f ": toHz(0x35), "g ": toHz(0x37), "a ": toHz(0x39), "b ": toHz(0x3b), // 59
    "c#": toHz(0x31), "d#": toHz(0x33), "e#": toHz(0x35), "f#": toHz(0x36), "g#": toHz(0x38), "a#": toHz(0x3a), "b#": toHz(0x3c), // 60
  },
  {
    // o5
    "c-": toHz(0x3b), "d-": toHz(0x3d), "e-": toHz(0x3f), "f-": toHz(0x40), "g-": toHz(0x42), "a-": toHz(0x44), "b-": toHz(0x46), // 70
    "c ": toHz(0x3c), "d ": toHz(0x3e), "e ": toHz(0x40), "f ": toHz(0x41), "g ": toHz(0x43), "a ": toHz(0x45), "b ": toHz(0x47), // 71
    "c#": toHz(0x3d), "d#": toHz(0x3f), "e#": toHz(0x41), "f#": toHz(0x42), "g#": toHz(0x44), "a#": toHz(0x46), "b#": toHz(0x48), // 72
  },
  {
    // o6
    "c-": toHz(0x47), "d-": toHz(0x49), "e-": toHz(0x4b), "f-": toHz(0x4c), "g-": toHz(0x4e), "a-": toHz(0x50), "b-": toHz(0x52), // 82
    "c ": toHz(0x48), "d ": toHz(0x4a), "e ": toHz(0x4c), "f ": toHz(0x4d), "g ": toHz(0x4f), "a ": toHz(0x51), "b ": toHz(0x53), // 83
    "c#": toHz(0x49), "d#": toHz(0x4b), "e#": toHz(0x4d), "f#": toHz(0x4e), "g#": toHz(0x50), "a#": toHz(0x52), "b#": toHz(0x54), // 84
  },
  {
    // o7
    "c-": toHz(0x53), "d-": toHz(0x55), "e-": toHz(0x57), "f-": toHz(0x58), "g-": toHz(0x5a), "a-": toHz(0x5c), "b-": toHz(0x5e), // 94
    "c ": toHz(0x54), "d ": toHz(0x56), "e ": toHz(0x58), "f ": toHz(0x59), "g ": toHz(0x5b), "a ": toHz(0x5d), "b ": toHz(0x5f), // 95
    "c#": toHz(0x55), "d#": toHz(0x57), "e#": toHz(0x59), "f#": toHz(0x5a), "g#": toHz(0x5c), "a#": toHz(0x5e), "b#": toHz(0x60), // 96
  },
  {
    // o8
    "c-": toHz(0x5f), "d-": toHz(0x61), "e-": toHz(0x63), "f-": toHz(0x64), "g-": toHz(0x66), "a-": toHz(0x68), "b-": toHz(0x6a), // 106
    "c ": toHz(0x60), "d ": toHz(0x62), "e ": toHz(0x64), "f ": toHz(0x65), "g ": toHz(0x67), "a ": toHz(0x69), "b ": toHz(0x6b), // 107
    "c#": toHz(0x61), "d#": toHz(0x63), "e#": toHz(0x65), "f#": toHz(0x66), "g#": toHz(0x68), "a#": toHz(0x6a), "b#": toHz(0x6c), // 108
  },
  {
    // o9
    "c-": toHz(0x6b), "d-": toHz(0x6d), "e-": toHz(0x6f), "f-": toHz(0x70), "g-": toHz(0x72), "a-": toHz(0x74), "b-": toHz(0x76), // 118
    "c ": toHz(0x6c), "d ": toHz(0x6e), "e ": toHz(0x70), "f ": toHz(0x71), "g ": toHz(0x73), "a ": toHz(0x75), "b ": toHz(0x77), // 119
    "c#": toHz(0x6d), "d#": toHz(0x6f), "e#": toHz(0x71), "f#": toHz(0x72), "g#": toHz(0x74), "a#": toHz(0x76), "b#": toHz(0x78), // 120
  },
  {
    // o10
    "c-": toHz(0x77), "d-": toHz(0x79), "e-": toHz(0x7b), "f-": toHz(0x7c), "g-": toHz(0x7e),
    "c ": toHz(0x78), "d ": toHz(0x7a), "e ": toHz(0x7c), "f ": toHz(0x7d), "g ": toHz(0x7f),
    "c#": toHz(0x79), "d#": toHz(0x7b), "e#": toHz(0x7d), "f#": toHz(0x7e),
  },
];

export { O, P, Q, T, V, nn, rest, toHz, toSEC };
