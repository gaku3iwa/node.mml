// =============================================================================
// _play.js
// Copyright © 2021- gaku.iwa All Rights Reserved.
// =============================================================================
import { parser } from "./_parser.js";
import { assemble } from "./_assemble.js";

// -----------------------------------------------------------------------------
// MML再生（mml配列インデックス指定）
const play = (idx) => {
  if (mml_data.mml.length - 1 < idx) return;
  let val = mml_data.mml[idx].part || ``;
  if (val === ``) return;
  return assemble(parser(val));
};

export { play };
