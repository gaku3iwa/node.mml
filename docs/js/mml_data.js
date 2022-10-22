// =============================================================================
// mml_data.js
// Copyright © 2021- gaku.iwa All Rights Reserved.
// =============================================================================

// -----------------------------------------------------------------------------
// MML楽曲演奏サンプル
const mml_data = {
  comment: "WebAudioAPIを活用したMML楽曲演奏",
  index: [3, 4, 5, 6, 7, 8, 9, 1, 2, 0],
  mml: [
    {
      title: "デモ曲 bad apple mini ",
      part: [
        "t140 l16 o4 p0 " +
          // [intro 1]
          " q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ || q8<d+8d+>q6 d+ r d+c+d+ | <q8g+8 q7d+>g+ <q8f+8 q7d+>f+" +
          " q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ || q8<d+8d+>q6 d+ r d+c+d+ | <q8g+8 q7d+>g+ <q8f+8 q7d+>a+" +
          // [intro 2]
          " q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ || q8<d+8d+>q6 d+ r d+c+d+ | <q8g+8 q7d+>g+ <q8f+8 q7d+>f+" +
          " q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ || q8<d+8d+>q6 d+ r d+c+d+ | <q8g+8 q7d+>g+ <q8f+8 q7d+>f+" +
          // [A]
          " o4 q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ | o4 q8<d+8d+>q6 d+ r d+ c+ d+ | <q8g+8 q7d+>g+ <q8f+8 q7d+>f+ " +
          " o4 q8<b 8b > q6 b  r b a b  | q8<b 8b > q6 b  r b a b  | o4 q8 c+8c+>q6 c+ r c+<b >c+ | <q8d 8   d > q6 d+ r d+ c+ d+ " +
          " o4 q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ | o4 q8<d+8d+>q6 d+ r d+ c+ d+ | <q8g+8 q7d+>g+ <q8f+8 q7d+>f+ " +
          " o4 q8<b 8b > q6 b  r b a b  | q8<b 8b > q6 b  r b a b  | o4 q8 c+8c+>q6 c+ r c+<b >c+ | <q8d 8   d > q6 d+ r d+ c+ d+ " +
          // [A']
          " o4 q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ | o4 q8<d+8d+>q6 d+ r d+ c+ d+ | <q8g+8 q7d+>g+ <q8f+8 q7d+>f+ " +
          " o4 q8<b 8b > q6 b  r b a b  | q8<b 8b > q6 b  r b a b  | o4 q8 c+8c+>q6 c+ r c+<b >c+ | <q8d 8   d > q6 d+ r d+ c+ d+ " +
          " o4 q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ | o4 q8<d+8d+>q6 d+ r d+ c+ d+ | <q8g+8 q7d+>g+ <q8f+8 q7d+>f+ " +
          " o4 q8<b 8b > q6 b  r b a b  | q8<b 8b > q6 b  r b a b  | o4 q8 c+8c+>q6 c+ r c+<b >c+ | <q8d 8   d > q6 d+ r d+ c+ d+ " +
          // [B]
          " o4 q8<b 8b > q6 b  r b a b  | q8<b 8b > q6 b  r b a b  | o4 q8 c+8c+>q6 c+ r c+<b >c+ | o4 q8 c+8c+>q6 c+ r c+<b >c+ | o5 q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ " +
          " o4 q8<b 8b > q6 b  r b a b  | q8<b 8b > q6 b  r b a b  | o4 q8 c+8c+>q6 c+ r c+<b >c+ | o4 q8 c+8c+>q6 c+ r c+<b >c+ | o5 q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ " +
          " o4 q8<b 8b > q6 b  r b a b  | q8<b 8b > q6 b  r b a b  | o4 q8 c+8c+>q6 c+ r c+<b >c+ | o4 q8 c+8c+>q6 c+ r c+<b >c+ | o5 q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ " +
          " o4 q8<b 8b > q6 b  r b a b  | q8<b 8b > q6 b  r b a b  | o4 q8 c+8c+>q6 c+ r c+<b >c+ | o4 q8 c+8c+>q6 c+ r c+<b >c+ | o5 q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ " +
          // [C]
          " o4 l1 q8 " +
          " < b > c+  d+ & d+ | < b > c+  d+ & !6 d+ & | !3 d+ & !0 d+ r1 r1 | r1 r1 r1 r2 g+4 f+4 " +
          "",
        "t140 l16 o4 p8 v5 r64 " +
          // [intro 1]
          " r1 r1 | " +
          " r1 r1 | " +
          // [intro 2]
          " q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ || q8<d+8d+> q6 d+ r d+c+d+ | <q8g+8 q7d+>g+ <q8f+8 q7d+>f+" +
          " q8<d+8d+> q6 d+ r d+c+d+ | q8<d+8d+> q6 d+ r d+c+d+ || q8<d+8d+> q6 d+ r d+c+d+ | <q8g+8 q7d+>g+ <q8f+8 q7d+>f+" +
          "",
        "t140 l8 p0 q8 " +
          // [intro 1]
          " r1 r1 | " +
          " r1 r1 | " +
          // [intro 2]
          " r1 r1 | " +
          " r1 r1 | " +
          // [A]
          " o5 d+ff+g+a+4>d+c+   <a+4d+4a+g+f+f      d+ff+g+a+4g+f+    fd+ff+ fd+ df  " +
          " o5 d+ff+g+a+4>d+c+   <a+4d+4a+g+f+f      d+ff+g+a+4g+f+    f4 f+4 g+4 a+4 " +
          // [A']
          " o5 d+ff+g+a+4>d+c+   <a+4d+4a+g+f+f      d+ff+g+a+4g+f+    fd+ff+ fd+ df  " +
          " o5 d+ff+g+a+4>d+c+   <a+4d+4a+g+f+f      d+ff+g+a+4g+f+    f4 f+4 g+4 a+4 " +
          // [B]
          " o6 c+d+<a+g+a+4g+a+  >c+d+<a+g+a+4 g+a+  g+f+f c+ d+4c+d+  f f+g+a+d+4g+a+ " +
          " o6 c+d+<a+g+a+4g+a+  >c+d+<a+g+a+4 g+a+  g+f+f c+ d+4c+d+  f f+g+a+d+4g+a+ " +
          " o6 c+d+<a+g+a+4g+a+  >c+d+<a+g+a+4 g+a+  g+f+f c+ d+4c+d+  f f+g+a+d+4g+a+ " +
          " o6 c+d+<a+g+a+4g+a+  >c+d+<a+g+a+4>c+d+  f+f d+c+<a+4g+a+  g+f+f c+d+4g+a+ " +
          // [C]
          " o6 c+d+<a+g+a+4g+a+  >c+d+<a+g+a+4 g+a+  g+f+f c+ d+4c+d+  f f+g+a+d+4g+a+ " +
          " o6 c+d+<a+g+a+4g+a+  >c+d+<a+g+a+4 g+a+  g+f+f c+ d+4c+d+  f f+g+a+d+4g+a+ " +
          " o6 c+d+<a+g+a+4g+a+  >c+d+<a+g+a+4 g+a+  g+f+f c+ d+4c+d+  f f+g+a+d+4g+a+ " +
          " o6 c+d+<a+g+a+4g+a+  >c+d+<a+g+a+4>c+d+  f+f d+c+<a+4g+a+  g+f+f c+d+2 " +
          "",
        "t140 l8 p8 v5 q8 r64 " +
          // [intro 1]
          " r1 r1 | " +
          " r1 r1 | " +
          // [intro 2]
          " r1 r1 | " +
          " r1 r1 | " +
          // [A]
          " o5 d+ff+g+a+4>d+c+   <a+4d+4a+g+f+f      d+ff+g+a+4g+f+    fd+ff+ fd+ df  " +
          " o5 d+ff+g+a+4>d+c+   <a+4d+4a+g+f+f      d+ff+g+a+4g+f+    f4 f+4 g+4 a+4 " +
          // [A']
          " o5 d+ff+g+a+4>d+c+   <a+4d+4a+g+f+f      d+ff+g+a+4g+f+    fd+ff+ fd+ df  " +
          " o5 d+ff+g+a+4>d+c+   <a+4d+4a+g+f+f      d+ff+g+a+4g+f+    f4 f+4 g+4 a+4 " +
          // [B]
          " o6 c+d+<a+g+a+4g+a+  >c+d+<a+g+a+4 g+a+  g+f+f c+ d+4c+d+  f f+g+a+d+4g+a+ " +
          " o6 c+d+<a+g+a+4g+a+  >c+d+<a+g+a+4 g+a+  g+f+f c+ d+4c+d+  f f+g+a+d+4g+a+ " +
          " o6 c+d+<a+g+a+4g+a+  >c+d+<a+g+a+4 g+a+  g+f+f c+ d+4c+d+  f f+g+a+d+4g+a+ " +
          " o6 c+d+<a+g+a+4g+a+  >c+d+<a+g+a+4>c+d+  f+f d+c+<a+4g+a+  g+f+f c+d+4g+a+ " +
          // [C]
          " o6 c+d+<a+g+a+4g+a+  >c+d+<a+g+a+4 g+a+  g+f+f c+ d+4c+d+  f f+g+a+d+4g+a+ " +
          " o6 c+d+<a+g+a+4g+a+  >c+d+<a+g+a+4 g+a+  g+f+f c+ d+4c+d+  f f+g+a+d+4g+a+ " +
          " o6 c+d+<a+g+a+4g+a+  >c+d+<a+g+a+4 g+a+  g+f+f c+ d+4c+d+  f f+g+a+d+4g+a+ " +
          " o6 c+d+<a+g+a+4g+a+  >c+d+<a+g+a+4>c+d+  f+f d+c+<a+4g+a+  g+f+f c+d+2 " +
          "",
      ],
    },
    {
      title: "デモ曲 ロトのテーマ",
      part: [
        "t125 q7 o5 p0           | l8 a.a16        a g  g g  |  f  g    a b- a g     | a b->c            d   f   d   | c <b- a      g.g16g |  a.a16        a a   f  a     |    g4.& m1/8/5/g 2. r " +
          "|: q7 o6 c 8.c 16     | l4 f g          a    b-   | >c  f2        e8.d 16 | d.  c            <b 8 b 8>d 8 | c <a 2      <a8.a16 |     a  a      b    >d-       | l8 d  & m1/8/5/d 2  d   e f | g&     m1/8/5/g2 d d f " +
          "|     l4 f   e  d  c  | l8 a & m1/8/5/a2  b- a g  |     f2   d4   f4      | g& m1/8/5/g2      a   g   f   |    f 2 e 4   c4     | >   c &m1/8/5/c 2  <a  b- >c |    d  & m1/8/5/d 2 <d   e f | q8  l2 m1/16/5/1 b-  a |  f4& m1/8/5/f :|" +
          "|: q7 o6 c 8.c 16     | l4 f g          a    b-   | >c  f2        e8.d 16 | d.  c            <b 8 b 8>d 8 | c <a 2      <a8.a16 |     a  a      b    >d-       | l8 d  & m1/8/5/d 2  d   e f | g&     m1/8/5/g2 d d f " +
          "|     l4 f   e  d  c  | l8 a & m1/8/5/a2  b- a g  |     f2   d4   f4      | g& m1/8/5/g2      a   g   f   |    f 2 e 4   c4     | >   c &m1/8/5/c 2  <a  b- >c |    d  & m1/8/5/d 2 <d   e f | q8  l2 m1/16/5/1 b-  a |  f4& m1/8/5/f :|",
        "t125 q7 o5 p0           | l8 f.f16        f c  c c  | <a >c    f g  f c     | f g  a            b- >d  <b-  | a  g   f     c.c16c |  f.f16        f     f  <a >f |    c4.& m1/8/5/c 2. r " +
          "|: q7 o5 b-8.b-16     | l4 a>c          f    f    |  f  f2        f8.b-16 | b-. a             g+8 g+8 b-8 | a  f 2       r      | <c# c#        d     e        | l8 f  & m1/8/5/f 2  f   g a  | >d&    m1/8/5/d2<b   b>d " +
          "|     l4 d   c <b- b- | l8 >d-&m1/8/5/d-2 d- d-d- |  d2<a4        a4      | >d&m1/8/5/d2     <b   b   b   |    b-2 b-4   b-4    | >f+&m1/8/5/f+2      f+ g  a  |    b- & m1/8/5/b-2 <b- >c d  | q8  l2 m1/16/5/1 d   e   | <a4& m1/8/5/a :|" +
          "|: q7 o5 b-8.b-16     | l4 a>c          f    f    |  f  f2        f8.b-16 | b-. a             g+8 g+8 b-8 | a  f 2       r      | <c# c#        d     e        | l8 f  & m1/8/5/f 2  f   g a  | >d&    m1/8/5/d2<b   b>d " +
          "|     l4 d   c <b- b- | l8 >d-&m1/8/5/d-2 d- d-d- |  d2<a4        a4      | >d&m1/8/5/d2     <b   b   b   |    b-2 b-4   b-4    | >f+&m1/8/5/f+2      f+ g  a  |    b- & m1/8/5/b-2 <b- >c d  | q8  l2 m1/16/5/1 d   e   | <a4& m1/8/5/a :|",
        "t125 q8 o4 p0           | l8  r2.            |  r2.               |  r2.                 | r2.             |  r2.              |      r2.              |        r2          " +
          "|: q7 o4 r4           | l4  f e  d+   d    | <a2   b-2          | >f c <f     >f       | <f a >c  f      | <a2    a2         |     >d <a f       d   |        b>d g  <g   " +
          "|       >c2     c  e  |    <a>d- e   <a    | >d e  f    d       |  c- d g     <g       | >c c  g  b-     |  a g-  d    <d    |      g  a b-      g   | q8    >g c b-  c   |  f c <f :|" +
          "|: q7 o4 r4           | l4  f e  d+   d    | <a2   b-2          | >f c <f     >f       | <f a >c  f      | <a2    a2         |     >d <a f       d   |        b>d g  <g   " +
          "|       >c2     c  e  |    <a>d- e   <a    | >d e  f    d       |  c- d g     <g       | >c c  g  b-     |  a g-  d    <d    |      g  a b-      g   | q8    >g c b-  c   |  f c <f :|",
      ],
    },
    {
      title: "デモSE レベルアップ",
      part: ["l16 o6 ffff rd#rg rf4&f8&!0f", "l16 o6 c<ba#a rgra# ra4&a8&!0a"],
    },
    {
      title: "デモ曲 地上テーマ",
      part: ["t180 o6 l8 q7  eere rce4 q7 g4r4 <g4r4 ", "t180 o5 l8 q7  f#f#rf# rf#f#4 q7 b4r4 r2 "],
    },
    {
      title: "デモSE アイテム出現",
      part: ["t180 o5 l32 c&cgg# d&dg#a d#&d#ab- e&eb-b "],
    },
    {
      title: "デモSE パワーアップ",
      part: ["t180 l32 o5 c<g>ceg>c<g <a->ce-a-e-a->ce-a- <<b->dfb-fb->dfb-f "],
    },
    {
      title: "デモSE コイン",
      part: ["o6 b16>e4.&!0e8"],
    },
    {
      title: "デモSE コイン ビブラート入り",
      part: ["o6 b16>e8&m1/5/3/4.e&!0e8"],
    },
    {
      title: "デモSE 1UP",
      part: ["o7 l16 eg>ecdg "],
    },
    {
      title: "デモ曲 GAME OVER",
      part: [
        "t160 o6 l8 cr4 <gr4  e4 a6b6a6 g+4 b-4 g+4 g4  r1 ",
        "t160 o5 l8 er4  cr4 <g4 r2     r2      r 4 e d e1 ",
        "t160 o4 l8 gr4  er4  c4 f2     g+2&    g+4 c4& c1 ",
      ],
    },
    {
      title: "デモ曲 あいさつ ",
      part: ["o3 l1 c g c ", "o4 l1 c g c ", "o5 l1 e d e ", "o5 l1 g f g ", "o6 l1 c<b>c "],
    },
    {
      title: "デモ曲 あいさつ 豪華版 ",
      part: [
        "    p-8 o3 l16   c1 g1 c1 & !0 c ",
        "    p 8 o4 l16   c1 g1 c1 & !0 c ",
        "v5  p 8 o3 l16 r c1 g1 c1 & !0 c ",
        "v5  p-8 o4 l16 r c1 g1 c1 & !0 c ",
        "    p 0 o5 l16   e1 d1 e1 & !0 e ",
        "    p 0 o5 l16   g1 f1 g1 & !0 g ",
        "    p 0 o6 l16   c1<b1>c1 & !0 c ",
      ],
    },
  ],
};
