// =============================================================================
// event.js
// Copyright © 2024- gaku.iwa All Rights Reserved.
// =============================================================================
const sleep = (time) => new Promise((r) => setTimeout(r, time))
const auxArray = new Array(mml_data.mml.length)

const renderAnalysis = (canvasSpectrum, canvasWaveform, analyser) => {
	//
	{
		const ctxSpectrum = canvasSpectrum.getContext('2d')
		ctxSpectrum.fillStyle = "blue"

		const freqData = new Uint8Array(analyser.frequencyBinCount)
		analyser.getByteFrequencyData(freqData)
		const length = freqData.length
		const W = canvasSpectrum.width
		const H = canvasSpectrum.height

		ctxSpectrum.clearRect(0, 0, W, H)
		ctxSpectrum.beginPath()
		ctxSpectrum.fillStyle = "#acd"
		ctxSpectrum.moveTo(0, H)
		const iStart = 0
		const iStop = Math.floor(length / 2)
		const range = iStop - iStart
		for (let i = iStart; i <= iStop; ++i) {
			ctxSpectrum.lineTo(W * (i - iStart) / range, H * (1 - (freqData[i] / 256.0)))
		}
		ctxSpectrum.lineTo(W, H)
		ctxSpectrum.fill()
	}
	//
	{
		const ctxWaveform = canvasWaveform.getContext('2d')
		ctxWaveform.fillStyle = "blue"

		const waveData = new Uint8Array(analyser.fftSize)
		analyser.getByteTimeDomainData(waveData)
		const length = waveData.length
		const W = canvasWaveform.width
		const H = canvasWaveform.height

		ctxWaveform.clearRect(0, 0, W, H)
		ctxWaveform.beginPath()
		ctxWaveform.strokeStyle = "#acd"
		ctxWaveform.moveTo(0, (0.1 + 0.8 * waveData[0] / 256.0) * H)
		for (let i = 0; i < length; ++i) {
			ctxWaveform.lineTo(W * i / length, (0.1 + 0.8 * waveData[i] / 256.0) * H)
		}
		ctxWaveform.stroke()
	}
}

// -----------------------------------------------------------------------------
//	演奏開始ボタンイベント
const data_play = (idx) => {
	if ((mml_data.mml.length - 1) < idx) {
		return
	}
	data_stop(idx)
	const c = mml_data.mml[idx]
	const aux = new AudioContext()
	const analyser = aux.createAnalyser({
		fftSize: 1024,
		minDecibels: -100,
		maxDecibels: 100,
		smoothingTimeConstant: 0
	})
	// analyser.fftSize = 1024
	const canvasSpectrum = document.getElementById("analysis-spectrum")
	const canvasWaveform = document.getElementById("analysis-waveform")
	const loopFactry = () => {
		let handler = {}
		const loop = () => {
			renderAnalysis(canvasSpectrum, canvasWaveform, analyser)
			// 次のフレーム時の処理の実行を予約
			handler.id = requestAnimationFrame(loop);
		}
		// 初回呼び出し
		handler.id = requestAnimationFrame(loop)
		return handler
	}
	let interval = loopFactry()
	node_mml.assemble(aux, analyser, node_mml.parser(c.part))
		.then(() => {
			//	演奏終了、再生→表示、停止→非表示
			playList.forEach(x => { if (x.id == idx) { p = x } })
			stopList.forEach(x => { if (x.id == idx) { s = x } })
			p.classList.remove(`d-none`)
			s.classList.add(`d-none`)
			// cancelAnimationFrame(interval.id)
		})
	auxArray[idx] = aux
}

// -----------------------------------------------------------------------------
//	演奏停止ボタンイベント
const data_stop = (idx) => {
	if ((auxArray[idx] ?? null) !== null) {
		auxArray[idx].close()
		auxArray[idx] = null
	}
}

// -----------------------------------------------------------------------------
//	秒数→時分秒ミリ秒文字列へ変換
const data_time = (idx) => {
	if ((mml_data.mml.length - 1) < idx) {
		return
	}
	const c = mml_data.mml[idx]
	const s = node_mml.playtime(node_mml.parser(c.part))
	const hh = Math.floor(s / 3600)
	const mm = Math.floor((s - (hh * 3600)) / 60)
	const ss = Math.floor(s - (hh * 3600 + mm * 60))
	const ff = Math.round((s - (hh * 3600 + mm * 60 + ss)) * 1000)
	const buff = ``
		+ `${hh == 0 ? "00" : ("00" + hh).slice(-2)}:`
		+ `${mm == 0 ? "00" : ("00" + mm).slice(-2)}:`
		+ `${ss == 0 ? "00" : ("00" + ss).slice(-2)}.`
		+ `${ff == 0 ? "000" : ("000" + ff).slice(-3)}`
	return buff
}

// -----------------------------------------------------------------------------
//	HTML TABLE 要素の動的生成
const generateTableElementsDynamically = (elem, idx) => {
	document.getElementById("data_list").innerHTML += `
<tr>
	<th scope="row" class="centering-parent">
		<label class="centering-children">${(idx + 1).toString()}</label>
	</th>
	<td class="centering-parent">
		<button id="btn${elem}" type="button" class="btn btn-outline-primary border-0 centering-children">
			<i name="play" id="${elem}" class="far fa-play-circle fa-xl "></i>
			<i name="stop" id="${elem}" class="far fa-stop-circle fa-xl d-none"></i>
		</button>
	</td>
	<td class="centering-parent">
		<label name="title" id="${elem}" class="p-0 btn border-0 w-100 text-start fw-light" for="btn${elem}">${mml_data.mml[elem].title}</label>
		<label name="title" id="${elem}" class="p-0 btn border-0 w-100 text-end d-none d-sm-block " for="btn${elem}">${data_time(elem)}</label>
	</td>
</tr>
`}
if (mml_data.index) {
	mml_data.index.forEach((elem, idx) => { generateTableElementsDynamically(elem, idx) })
} else {
	mml_data.mml.forEach((_, idx) => { generateTableElementsDynamically(idx, idx); idx++ })
}
