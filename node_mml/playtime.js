//	============================================================================
//	playtime.js
//	Copyright © 2024- gaku.iwa All Rights Reserved.
//	============================================================================
import { Q, rest, toSEC } from "./define.js"

//	----------------------------------------------------------------------------
const playtime = (parse_result) => {
	const ary = []
	parse_result.forEach((part) => {
		let Timing = 0					//	１パートの演奏時間[sec]
		part.toneAry.forEach((tn) => {
			let fullTime = 0
			let gateTime = 0
			switch (tn.tn[0]) {
				case rest:
					tn.q = Q.max
					tn.l.forEach((ln) => {
						if (!ln.includes(`.`)) {
							let tm = Number(ln)
							fullTime += toSEC(tn.t, tm)
						} else {
							let tm = Number(ln.replace(`.`, ``))
							fullTime += toSEC(tn.t, tm) + toSEC(tn.t, tm * 2)
						}
					})
					gateTime = (fullTime * tn.q) / Q.max
					Timing += gateTime
					break

				default:
					let subTiming = Timing
					let subgateTime = 0
					for (let idx = 0; idx < tn.tn.length; ++idx) {
						let ln = tn.l[idx]
						if (!ln.includes(`.`)) {
							let tm = Number(ln)
							subgateTime = toSEC(tn.t, tm)
						} else {
							let tm = Number(ln.replace(`.`, ``))
							subgateTime = toSEC(tn.t, tm) + toSEC(tn.t, tm * 2)
						}
						subTiming += subgateTime
					}
					tn.l.forEach((ln) => {
						if (!ln.includes(`.`)) {
							let tm = Number(ln)
							fullTime += toSEC(tn.t, tm)
						} else {
							let tm = Number(ln.replace(`.`, ``))
							fullTime += toSEC(tn.t, tm) + toSEC(tn.t, tm * 2)
						}
					})
					gateTime = (fullTime * tn.q) / Q.max
					Timing += gateTime
					break
			}
			if (tn.q < Q.max) {
				Timing += fullTime - gateTime
			}
		})
		ary.push(Timing)
	})
	//	各パートの最大演奏時間[sec]を返す
	return Math.max(...ary)
}

export { playtime }
