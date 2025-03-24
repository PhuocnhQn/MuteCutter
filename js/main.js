const fs = require('fs');
const { decode } = require('wav-decoder');

var csInterface = new CSInterface();
let arrAudioCut = [];

(function () {
	'use strict';
	var path, slash;
	path = location.href;
	if (getOS() == "MAC") {
		slash = "/";
		path = path.substring(0, path.length - 11);
	}
	if (getOS() == "WIN") {
		slash = "/";
		path = path.substring(8, path.length - 11);
	}
	var pathPresets = path + "/Preset/";
	var pathPresetsAudio = pathPresets + "/Audio/WAV 48 kHz 16-bit.epr";


	var currentYear = new Date().getFullYear();
	document.getElementById('current-year').textContent = currentYear;

	saveToLocalStorage('cb-toggle3');
	restoreFileCountsFromStorage();
	document.getElementById('btnCut').addEventListener('click', function () {
		try {
			localStorage.setItem("audioTrackInput", document.getElementById('audioTrackInput').value);
			localStorage.setItem("videoTrackInput", document.getElementById('videoTrackInput').value);
			localStorage.setItem("secondInput", document.getElementById('secondInput').value);
			localStorage.setItem("dbInput", document.getElementById('dbInput').value);
			const cbToggle3 = JSON.stringify(document.getElementById('cb-toggle3').checked);
			// document.getElementById(id).checked);

			var numDB = document.getElementById('dbInput').value;
			var timeSecond = document.getElementById('secondInput').value;
			// Tạm thời vô hiệu hóa các phần tử khác để không cho click vào trong quá trình
			document.body.style.pointerEvents = 'none';
			document.getElementById('processing-info').style.display = 'block';
			var audioTrackInput = document.getElementById('audioTrackInput').value;
			var videoTrackInput = document.getElementById('videoTrackInput').value;

			csInterface.evalScript('toggleAllAudioTracksExcept("' + audioTrackInput + '","' + pathPresetsAudio + '","' + videoTrackInput + '")', function (result) {
				var check_Track = JSON.parse(result);
				if (check_Track.success) {
					var userDataFolder = require('path').join(process.env.APPDATA, 'AutoCutBLV');
					var audioFilePath = require('path').join(userDataFolder, 'audioCut.wav');
					try {
						analyzeAudio(audioFilePath, numDB, timeSecond).then((audioData) => {
							arrAudioCut = audioData; // Lưu trữ mảng audioData vào biến arrAudioCut
							var timecodes = JSON.stringify(arrAudioCut);
							csInterface.evalScript('razorVideo("' + timecodes + '","' + videoTrackInput + '","' + audioTrackInput + '","' + cbToggle3 + '")', result => {
								var razor_Track = JSON.parse(result);
								if (razor_Track.success) {
									document.getElementById('processing-info').style.display = 'none';
									document.body.style.pointerEvents = 'auto';
									Swal.fire({
										icon: 'success',
										title: 'Successfully!',
										showConfirmButton: false,
										timer: 1000
									});
								} else {
									document.getElementById('processing-info').style.display = 'none';
									document.body.style.pointerEvents = 'auto';
									Swal.fire({
										icon: 'error',
										title: 'Failed!',
										text: razor_Track.message,
									});
								}
							});
						}).catch(error => {
							document.getElementById('processing-info').style.display = 'none';
							document.body.style.pointerEvents = 'auto';
							Swal.fire({
								icon: 'error',
								title: 'Failed!',
								text: 'An error occurred: ' + error,
							});
						});

					} catch (error) {
						document.getElementById('processing-info').style.display = 'none';
						document.body.style.pointerEvents = 'auto';
						alert("Error: " + error.message + " at line " + error.lineNumber);
					}
				} else {
					document.getElementById('processing-info').style.display = 'none';
					document.body.style.pointerEvents = 'auto';
					Swal.fire({
						icon: 'error',
						title: 'Failed!',
						text: check_Track.message,
					});
				}
			});
		} catch (error) {
			document.getElementById('processing-info').style.display = 'none';
			document.body.style.pointerEvents = 'auto';
			alert("Error: " + error.message + " at line " + error.lineNumber);
		}
	});


}());
function restoreFileCountsFromStorage() {
	try {
		if (localStorage.getItem("dbInput")) {
			document.getElementById('dbInput').value = localStorage.getItem("dbInput");
		}
		if (localStorage.getItem("secondInput")) {
			document.getElementById('secondInput').value = localStorage.getItem("secondInput");
		}
		if (localStorage.getItem("videoTrackInput")) {
			document.getElementById('videoTrackInput').value = localStorage.getItem("videoTrackInput");
		}
		if (localStorage.getItem("audioTrackInput")) {
			document.getElementById('audioTrackInput').value = localStorage.getItem("audioTrackInput");
		}

		const cbToggle3 = document.getElementById('cb-toggle3');
		const cbToggle3Status = localStorage.getItem('cb-toggle3');

		if (cbToggle3Status === 'true') {
			cbToggle3.checked = true;
		} else {
			cbToggle3.checked = false;
		}
	} catch (error) {
		document.getElementById('processing-info').style.display = 'none';
		document.body.style.pointerEvents = 'auto';
		Swal.fire({
			icon: 'error',
			title: 'Failed!',
			text: "Error " + error,
		});
	}
}
function saveToLocalStorage(id) {
	document.getElementById(id).addEventListener('click', () => {
		localStorage.setItem(id, document.getElementById(id).checked);
	});
}
async function analyzeAudio(filePath, numDB, timeSecond) {
	try {
		const wavFilePath = filePath.replace(/\.mp3$/, '.wav');
		const audioData = await decode(fs.readFileSync(wavFilePath));
		const signal = audioData.channelData[0];
		const sampleRate = audioData.sampleRate;

		const chunkSize = 1024;
		const lowLoudnessInfo = [];
		const arrAudioCut = [];
		let currentStart = null;
		let isInLowLoudness = false;

		for (let i = 0; i < signal.length; i += chunkSize) {
			const chunk = signal.slice(i, i + chunkSize);
			const rms = Math.sqrt(chunk.reduce((sum, value) => sum + value * value, 0) / chunk.length);
			const dB = 20 * Math.log10(rms);
			const currentTime = i / sampleRate;

			if (dB < Number(numDB)) {
				if (!isInLowLoudness) {
					currentStart = currentTime;
					isInLowLoudness = true;
				}
			} else {
				if (isInLowLoudness) {
					const duration = currentTime - currentStart;
					if (duration > Number(timeSecond)) {
						lowLoudnessInfo.push(`Từ ${currentStart.toFixed(2)}s đến ${currentTime.toFixed(2)}s có dB < 2.5`);
						arrAudioCut.push(currentStart);
						arrAudioCut.push(currentTime);
					}
					isInLowLoudness = false;
				}
			}
		}

		if (isInLowLoudness) {
			const duration = (signal.length / sampleRate) - currentStart;
			if (duration > 1) {
				lowLoudnessInfo.push(`Từ ${currentStart.toFixed(2)}s đến ${(signal.length / sampleRate).toFixed(2)}s có dB < 2.5`);
				arrAudioCut.push(currentStart);
				arrAudioCut.push(signal.length / sampleRate);
			}
		}

		// const outputFilePath = 'C:\\Users\\Phuoc\\Downloads\\low_loudness_info.txt';
		// fs.writeFileSync(outputFilePath, lowLoudnessInfo.join('\n'), 'utf8');
		// alert(`Đã ghi thông tin vào tệp: ${outputFilePath}`);
		return arrAudioCut;

	} catch (error) {
		alert('Có lỗi xảy ra: ' + error);
	}
}
function getOS() {
	var userAgent = window.navigator.userAgent,
		platform = window.navigator.platform,
		macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
		windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
		os = null;

	if (macosPlatforms.indexOf(platform) != -1) {
		os = "MAC";
	} else if (windowsPlatforms.indexOf(platform) != -1) {
		os = "WIN";
	}
	return os;
}