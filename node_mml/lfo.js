//	============================================================================
//	lfo.js
//	Copyright © 2023- gaku.iwa All Rights Reserved.
//	============================================================================
import { toSEC } from "./define.js"

//	----------------------------------------------------------------------------
//	LFOパラメータの分解
const parserLFO = (strParam, tempo, def_gatetime) => {
	const rtn = {
		type: 0,

		v_gateTime: 0,
		v_depth: 0,
		v_speed: 0,

		t_gateTime: 0,
		t_depth: 0,
		t_speed: 0,
	}

	if (strParam.length < 1) {
		return rtn
	}

	let ary = strParam.split(`/`) || ``
	let speed, depth, ln, tm
	if ([3, 4].includes(ary.length)) {
		//	揺らぎ効果のタイプ
		rtn.type = Number(ary[0])
		switch (rtn.type) {
			case 1:
				//	Vibrato
				speed = Number(ary[1])
				depth = Number(ary[2])
				ln = ary.length === 4 ? ary[3] || def_gatetime : def_gatetime

				//	揺らぎ効果の深さ
				rtn.v_depth = depth

				//	揺らぎ効果の音長
				if (!ln.includes(`.`)) {
					tm = Number(ln)
					rtn.v_gateTime = toSEC(tempo, tm)
				} else {
					tm = Number(ln.replace(`.`, ``))
					rtn.v_gateTime = toSEC(tempo, tm) + toSEC(tempo, tm * 2)
				}

				//	揺らぎ効果の回数
				rtn.v_speed = speed / rtn.v_gateTime
				break

			case 2:
				//	Tremolo
				speed = Number(ary[1])
				depth = Number(ary[2]) / 100.0
				ln = ary.length === 4 ? ary[3] || def_gatetime : def_gatetime

				//	揺らぎ効果の深さ
				rtn.t_depth = depth

				//	揺らぎ効果の音長
				if (!ln.includes(`.`)) {
					tm = Number(ln)
					rtn.t_gateTime = toSEC(tempo, tm)
				} else {
					tm = Number(ln.replace(`.`, ``))
					rtn.t_gateTime = toSEC(tempo, tm) + toSEC(tempo, tm * 2)
				}

				//	揺らぎ効果の回数
				rtn.t_speed = speed / rtn.t_gateTime
				break
		}
	} else if ([6, 7].includes(ary.length)) {
		//	揺らぎ効果のタイプ
		rtn.type = Number(ary[0])
		switch (rtn.type) {
			case 3:
				//	Vibrato
				speed = Number(ary[1])
				depth = Number(ary[2])
				ln = ary[3] || def_gatetime

				//	揺らぎ効果の深さ
				rtn.v_depth = depth

				//	揺らぎ効果の音長
				if (!ln.includes(`.`)) {
					tm = Number(ln)
					rtn.v_gateTime = toSEC(tempo, tm)
				} else {
					tm = Number(ln.replace(`.`, ``))
					rtn.v_gateTime = toSEC(tempo, tm) + toSEC(tempo, tm * 2)
				}

				//	揺らぎ効果の回数
				rtn.v_speed = speed / rtn.v_gateTime

				//	Tremolo
				speed = Number(ary[4])
				depth = Number(ary[5]) / 100.0
				ln = ary.length === 7 ? ary[6] || def_gatetime : def_gatetime

				//	揺らぎ効果の深さ
				rtn.t_depth = depth

				//	揺らぎ効果の音長
				if (!ln.includes(`.`)) {
					tm = Number(ln)
					rtn.t_gateTime = toSEC(tempo, tm)
				} else {
					tm = Number(ln.replace(`.`, ``))
					rtn.t_gateTime = toSEC(tempo, tm) + toSEC(tempo, tm * 2)
				}

				//	揺らぎ効果の回数
				rtn.t_speed = speed / rtn.t_gateTime
				break
		}
	}
	return rtn
}

export { parserLFO }
