"object" != typeof JSON && (JSON = {}), function () { "use strict"; var rx_one = /^[\],:{}\s]*$/, rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, rx_four = /(?:^|:|,)(?:\s*\[)+/g, rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta, rep; function f(t) { return t < 10 ? "0" + t : t } function this_value() { return this.valueOf() } function quote(t) { return rx_escapable.lastIndex = 0, rx_escapable.test(t) ? '"' + t.replace(rx_escapable, function (t) { var e = meta[t]; return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + t + '"' } function str(t, e) { var r, n, o, u, f, a = gap, i = e[t]; switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(t)), "function" == typeof rep && (i = rep.call(e, t, i)), typeof i) { case "string": return quote(i); case "number": return isFinite(i) ? String(i) : "null"; case "boolean": case "null": return String(i); case "object": if (!i) return "null"; if (gap += indent, f = [], "[object Array]" === Object.prototype.toString.apply(i)) { for (u = i.length, r = 0; r < u; r += 1)f[r] = str(r, i) || "null"; return o = 0 === f.length ? "[]" : gap ? "[\n" + gap + f.join(",\n" + gap) + "\n" + a + "]" : "[" + f.join(",") + "]", gap = a, o } if (rep && "object" == typeof rep) for (u = rep.length, r = 0; r < u; r += 1)"string" == typeof rep[r] && (o = str(n = rep[r], i)) && f.push(quote(n) + (gap ? ": " : ":") + o); else for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (o = str(n, i)) && f.push(quote(n) + (gap ? ": " : ":") + o); return o = 0 === f.length ? "{}" : gap ? "{\n" + gap + f.join(",\n" + gap) + "\n" + a + "}" : "{" + f.join(",") + "}", gap = a, o } } "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null }, Boolean.prototype.toJSON = this_value, Number.prototype.toJSON = this_value, String.prototype.toJSON = this_value), "function" != typeof JSON.stringify && (meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, JSON.stringify = function (t, e, r) { var n; if (indent = gap = "", "number" == typeof r) for (n = 0; n < r; n += 1)indent += " "; else "string" == typeof r && (indent = r); if ((rep = e) && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify"); return str("", { "": t }) }), "function" != typeof JSON.parse && (JSON.parse = function (text, reviver) { var j; function walk(t, e) { var r, n, o = t[e]; if (o && "object" == typeof o) for (r in o) Object.prototype.hasOwnProperty.call(o, r) && (void 0 !== (n = walk(o, r)) ? o[r] = n : delete o[r]); return reviver.call(t, e, o) } if (text = String(text), rx_dangerous.lastIndex = 0, rx_dangerous.test(text) && (text = text.replace(rx_dangerous, function (t) { return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) })), rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({ "": j }, "") : j; throw new SyntaxError("JSON.parse") }) }();
///////////////////cắt audio////////////////////////

function getTimeTrack(trackIndex) {
    if (checkVideoTrack(trackIndex) == true) {
        var sequence = app.project.activeSequence;
        var videoTrack = sequence.videoTracks[trackIndex - 1];
        var clips = videoTrack.clips;
        var lastClip = videoTrack.clips[clips.length - 1];
        var endTimeInSeconds = lastClip.end.seconds;
        // return endTimeInSeconds;
        return JSON.stringify({ success: true, endTimeInSeconds: endTimeInSeconds });
    } else {
        return JSON.stringify({ success: false, message: "Video track " + trackIndex + " has more than 1 clip or no clip. \nOr please 'Nest' Again into a new sequence." });
    }
}
// Hàm xóa clip tại video track nhất định
function removeClipFromVideoTrack(trackIndex, clipIndex) {
    var sequence = app.project.activeSequence;
    var jsonResponse = {
        success: false,
        message: "",
        clipCount: 0
    };

    try {
        // Lấy video track tại trackIndex
        var videoTrack = sequence.videoTracks[trackIndex];

        // Kiểm tra sự tồn tại của video track
        if (!videoTrack) {
            jsonResponse.message = "Video track does not exist.";
            return jsonResponse; // Trả về JSON không được chuyển thành chuỗi
        }

        // Lấy danh sách clips trong video track
        var clips = videoTrack.clips;

        // Kiểm tra số lượng clips trong video track
        if (clips.length === 0) {
            jsonResponse.message = "There are no clips in the video track.";
            return jsonResponse;
        }

        // Kiểm tra chỉ số clip có hợp lệ không
        if (clipIndex < 0 || clipIndex >= clips.length) {
            jsonResponse.message = "Invalid clip index.";
            return jsonResponse;
        }

        // Xóa clip tại chỉ số clipIndex
        var clipToRemove = clips[clipIndex];
        clipToRemove.remove(0, 1); // Xóa clip

        jsonResponse.success = true;
        jsonResponse.message = "Clip was successfully deleted.";
        jsonResponse.clipCount = clips.length - 1; // Cập nhật số lượng clip sau khi xóa
    } catch (error) {
        jsonResponse.message = "An error occurred.: " + error.message;
    }
    return JSON.stringify(jsonResponse);
    // return jsonResponse; // Trả về đối tượng JSON
}
// Hàm để lấy số lượng clips trong video track và trả về dưới dạng JSON
function getClipCountInVideoTrackAsJson(trackIndex) {
    // Lấy sequence đang hoạt động
    var sequence = app.project.activeSequence;
    var result = {};

    if (sequence) {
        // Kiểm tra nếu trackIndex hợp lệ
        if (trackIndex < sequence.videoTracks.length) {
            var videoTrack = sequence.videoTracks[trackIndex]; // Lấy track video theo chỉ số
            var clipCount = videoTrack.clips.length; // Lấy số lượng clip trong track

            // Kiểm tra nếu có clip trong video track
            if (clipCount > 0) {
                result.trackIndex = trackIndex;
                result.clipCount = clipCount;
                result.message = "Number of clips in video track " + trackIndex + " là: " + clipCount;
            } else {
                result.trackIndex = trackIndex;
                result.clipCount = 0;
                result.message = "There are no clips in the video track " + trackIndex + ".";
            }
        } else {
            result.error = "Video track index " + trackIndex + " does not exist.";
        }
    } else {
        result.error = "No sequences are active.";
    }

    // Trả về kết quả dưới dạng JSON
    return JSON.stringify(result);
}

function moveTimelineToClip(clipIndex, video_Track) {
    // Lấy sequence đang hoạt động
    var sequence = app.project.activeSequence;

    if (sequence) {
        // Lấy video track đầu tiên (track 0)
        var videoTrack = sequence.videoTracks[video_Track];

        if (clipIndex >= 0 && clipIndex < videoTrack.clips.length) {
            // Lấy clip tại vị trí `clipIndex` 
            var targetClip = videoTrack.clips[clipIndex];
            // Di chuyển timeline đến điểm bắt đầu của clip
            sequence.setPlayerPosition(targetClip.start.ticks);
        } else {
            // return "Clip at position " + clipIndex + " in track 0 was not found.";
            return JSON.stringify({ success: false, error: "Clip at position " + clipIndex + " in track 0 was not found." });
        }
    } else {
        // return "There are no active sequences.";
        return JSON.stringify({ success: false, error: "There are no active sequences." + trackIndex });
    }
}
function getClipDurations(track_Index) {
    // Lấy sequence đang hoạt động
    var sequence = app.project.activeSequence;

    if (sequence) {
        // Xác định track video cần lấy thông tin (ở đây là track 1, có chỉ số 0)
        var trackIndex = Number(track_Index); // Thay đổi chỉ số này nếu muốn chọn track khác
        var videoTrack = sequence.videoTracks[trackIndex];

        if (videoTrack) {
            var clipData = [];
            for (var i = 0; i < videoTrack.clips.numItems; i++) {
                var clip = videoTrack.clips[i];
                var inPoint = clip.inPoint.seconds; // Điểm bắt đầu (giây)
                var outPoint = clip.outPoint.seconds; // Điểm kết thúc (giây)
                var duration = outPoint - inPoint; // Khoảng thời gian (giây)
                var filePath = clip.projectItem.getMediaPath(); // Đường dẫn của file video
                clipData.push({ inPoint: inPoint, outPoint: outPoint, duration: duration, filePath: filePath });
            }
            // Trả về mảng chứa thông tin của các clip
            return JSON.stringify({ success: true, data: clipData });
        } else {
            return JSON.stringify({ success: false, error: "Video track not found in index" + trackIndex });
        }
    } else {
        return JSON.stringify({ success: false, error: "There are no active sequences." });
    }
}
function importFilesToProject1(data) {
    try {
        // alert("importFiles")
        var dataImport = data;
        // alert(dataImport.importFiles.toString())
        if (dataImport.importFiles) {
            var binSong = importFilesToBin("Song", dataImport.audioPaths);
            if (binSong == true && dataImport.syncSequen == true) {
                var binIndexSong = findBinIndexAndCount("Song").index;
                var numberAudioBin = app.project.rootItem.children[binIndexSong].children;
                for (var a = 0; a < numberAudioBin.numItems; a++) {
                    // $.sleep(1000);//nghỉ 1000 mili giây
                    insertAudioIntoSequence(1, false, true, a, binIndexSong);
                }
            }
            var binClips = importFilesToBin("Clips", dataImport.videoPaths);
            if (binClips == true && dataImport.syncSequen == true) {
                var binIndexClips = findBinIndexAndCount("Clips").index;
                var numberVideoBin = app.project.rootItem.children[binIndexClips].children;
                for (var a = 0; a < numberVideoBin.numItems; a++) {
                    insertVideoIntoSequence(0, true, true, a, binIndexClips);
                }
            }
            var binBRoll = importFilesToBin("B-Roll", dataImport.imagePaths);
            if (binBRoll == true && dataImport.syncSequen == true) {
                var binIndexBRoll = findBinIndexAndCount("B-Roll").index;
                var numberBrollBin = app.project.rootItem.children[binIndexBRoll].children;
                for (var a = 0; a < numberBrollBin.numItems; a++) {
                    insertVideoIntoSequence(1, true, true, a, binIndexBRoll);
                }
            }
            if (binSong == true && binClips == true && binBRoll == true) {
                var success = true;
            }
            else {
                var success = false;
                var error = "Unable to import the file into the project or sequence.";
            }
            return JSON.stringify({ success: success, error: error });
        }
        else {
            if (dataImport.syncSequen == true) {
                var binIndexSong = findBinIndexAndCount("Song").index;
                var numberAudioBin = app.project.rootItem.children[binIndexSong].children;
                for (var a = 0; a < numberAudioBin.numItems; a++) {
                    // $.sleep(1000);//nghỉ 1000 mili giây
                    insertAudioIntoSequence(1, false, true, a, binIndexSong);
                }
                var binIndexClips = findBinIndexAndCount("Clips").index;
                var numberVideoBin = app.project.rootItem.children[binIndexClips].children;
                for (var a = 0; a < numberVideoBin.numItems; a++) {
                    insertVideoIntoSequence(0, true, true, a, binIndexClips);
                }
                var binIndexBRoll = findBinIndexAndCount("B-Roll").index;
                var numberBrollBin = app.project.rootItem.children[binIndexBRoll].children;
                for (var a = 0; a < numberBrollBin.numItems; a++) {
                    insertVideoIntoSequence(1, true, true, a, binIndexBRoll);
                }
                return JSON.stringify({ success: true, error: null });
            }
            else {
                var error = "Unable to import the file into the project or sequence.";
                return JSON.stringify({ success: false, error: error });
            }
        }
    } catch (error) {
        // alert(error)
        return JSON.stringify({ success: false, error: error.message });
    }

}
function importFilesToProject(data) {
    try {
        var sequence = app.project.activeSequence;
        var lastClipEnd = getTimeSequen(sequence);
        var dataImport = data;
        // alert(dataImport.importFiles.toString())
        if (dataImport.importFiles) {
            var binClips = importFilesToBin("Clips", dataImport.videoPaths);
            if (binClips.success == true && dataImport.syncSequen == true) {
                var trackInVideo = 0;
                var binIndexClips = findBinIndexAndCount("Clips").index;
                var numberVideoBin = app.project.rootItem.children[binIndexClips].children;
                for (var a = 0; a < numberVideoBin.numItems; a++) {
                    var item = numberVideoBin[a];
                    if (item && item.type === ProjectItemType.CLIP) {
                        var path = new File(item.getMediaPath());
                        var videoPaths = dataImport.videoPaths;
                        if (videoPaths.length > 0) {
                            for (var j = 0; j < videoPaths.length; j++) {
                                var path_ = new File(videoPaths[j]);
                                if (path.toString() === path_.toString()) {
                                    var videoTrack = findTracksWithSound(sequence, false);
                                    insertFileToTrack(trackInVideo, true, lastClipEnd.lastClipEndTime, a, binIndexClips, false);
                                    trackInVideo++;
                                }
                            }
                        }
                    }
                }
            }
            var binSong = importFilesToBin("Song", dataImport.audioPaths);
            // alert(dataImport.importFiles.toString())
            if (binSong.success == true && dataImport.syncSequen == true) {
                var trackInAudio = 0;
                if (trackInVideo > 0) {
                    var trackInAudio = trackInVideo;
                }
                var binIndexSong = findBinIndexAndCount("Song").index;
                var numberAudioBin = app.project.rootItem.children[binIndexSong].children;
                for (var a = 0; a < numberAudioBin.numItems; a++) {
                    var item = numberAudioBin[a];
                    if (item && item.type === ProjectItemType.CLIP) {
                        var path = new File(item.getMediaPath());
                        var audioPaths = dataImport.audioPaths;
                        if (audioPaths.length > 0) {
                            for (var j = 0; j < audioPaths.length; j++) {
                                var path_ = new File(audioPaths[j]);
                                if (path.toString() === path_.toString()) {
                                    var audioTrack = findTracksWithSound(sequence, true);
                                    insertFileToTrack(trackInAudio, true, lastClipEnd.lastClipEndTime, a, binIndexSong, true);
                                    trackInAudio++;
                                }
                            }
                        }
                    }
                }
            }
            // return JSON.stringify({ success: true });

            var binBRoll = importFilesToBin("B-Roll", dataImport.imagePaths);
            if (binBRoll.success == true && dataImport.syncSequen == true) {
                var trackInImage = 0;
                if (trackInVideo > 0) {
                    var trackInImage = trackInVideo;
                }
                var binIndexBRoll = findBinIndexAndCount("B-Roll").index;
                var numberBrollBin = app.project.rootItem.children[binIndexBRoll].children;
                for (var a = 0; a < numberBrollBin.numItems; a++) {
                    var item = numberBrollBin[a];
                    if (item && item.type === ProjectItemType.CLIP) {
                        var path = new File(item.getMediaPath());
                        var imagePaths = dataImport.imagePaths;
                        if (imagePaths.length > 0) {
                            for (var j = 0; j < imagePaths.length; j++) {
                                var path_ = new File(imagePaths[j]);
                                if (path.toString() === path_.toString()) {
                                    // alert(path.toString() + "  " + path_.toString())
                                    var videoTrack = findTracksWithSound(sequence, false);
                                    // alert(trackInImage.toString())
                                    insertFileToTrack(trackInImage, true, lastClipEnd.lastClipEndTime, a, binIndexBRoll, false);
                                    trackInImage++;
                                }
                            }
                        }
                    }
                }
            }
            if (binSong.success == true || binClips.success == true || binBRoll.success == true) {
                var success = true;
            }
            else {
                var success = false;
                var error = "Unable to import the file into the project or sequence.";
            }
            return JSON.stringify({ success: success, error: error });
        }
        // else {
        //     if (dataImport.syncSequen == true) {
        //         var binIndexSong = findBinIndexAndCount("Song").index;
        //         var numberAudioBin = app.project.rootItem.children[binIndexSong].children;
        //         for (var a = 0; a < numberAudioBin.numItems; a++) {
        //             // $.sleep(1000);//nghỉ 1000 mili giây
        //             insertAudioIntoSequence(1, false, true, a, binIndexSong);
        //         }
        //         var binIndexClips = findBinIndexAndCount("Clips").index;
        //         var numberVideoBin = app.project.rootItem.children[binIndexClips].children;
        //         for (var a = 0; a < numberVideoBin.numItems; a++) {
        //             insertVideoIntoSequence(0, true, true, a, binIndexClips);
        //         }
        //         var binIndexBRoll = findBinIndexAndCount("B-Roll").index;
        //         var numberBrollBin = app.project.rootItem.children[binIndexBRoll].children;
        //         for (var a = 0; a < numberBrollBin.numItems; a++) {
        //             insertVideoIntoSequence(1, true, true, a, binIndexBRoll);
        //         }
        //         return JSON.stringify({ success: true, error: null });
        // }
        else {
            var error = "Unable to import the file into the project or sequence.";
            return JSON.stringify({ success: false, error: error });
        }
        // }
    } catch (error) {
        // alert(error)
        return JSON.stringify({ success: false, error: error.message + " " + error.line });
    }

}
function applyEffectToTrack(effectName) {
    try {
        var result = getTrackPositionOfSelectedClip();
        if (result === false) {
            return JSON.stringify({ error: "No clip selected." }); // Check result
        }
        var proj = app.project;
        var sequence = proj.activeSequence;
        var mainClips = sequence.videoTracks[result - 1].clips;
        for (var i = 0; i < mainClips.numItems; i++) {
            app.enableQE();
            var qeSequence = qe.project.getActiveSequence(0);
            var qeTrackOne = qeSequence.getVideoTrackAt(result - 1);
            var effectToApply = qe.project.getVideoEffectByName(String(effectName));
            var item = qeTrackOne.getItemAt(i);
            item.addVideoEffect(effectToApply);
        }
        return JSON.stringify({ success: true }); // Trả về JSON.stringify
    } catch (error) {
        return JSON.stringify({ error: error.line }); // Trả về JSON.stringify
    }
}
function applyTransitionToTrack(transitionName) {
    try {
        var result = getTrackPositionOfSelectedClip();
        if (result === false) {
            return JSON.stringify({ error: "No clip selected." }); // Check result
        }
        var proj = app.project;
        var sequence = proj.activeSequence;
        var mainClips = sequence.videoTracks[result - 1].clips;
        for (var i = 1; i < mainClips.numItems; i++) {
            app.enableQE();
            var qeSequence = qe.project.getActiveSequence(0);
            var qeTrackOne = qeSequence.getVideoTrackAt(result - 1);
            var transitionToApply = qe.project.getVideoTransitionByName(String(transitionName));
            var item = qeTrackOne.getItemAt(i);
            item.addTransition(transitionToApply, true);
        }
        return JSON.stringify({ success: true }); // Trả về JSON.stringify
    } catch (error) {
        return JSON.stringify({ error: error.line }); // Trả về JSON.stringify
    }
}
function deselectAllClips() {
    var sequence = app.project.activeSequence; // Lấy sequence đang hoạt động
    if (sequence) {
        // Lặp qua tất cả video tracks trong sequence
        for (var i = 0; i < sequence.videoTracks.length; i++) {
            var track = sequence.videoTracks[i];
            // Lặp qua tất cả các clip trong track
            for (var j = 0; j < track.clips.length; j++) {
                var clip = track.clips[j];
                // Bỏ chọn clip
                clip.setSelected(false, false);
            }
        }
        return true; // Trả về true nếu thành công
    } else {
        return "There are no active sequences.";
    }
}

function selectClips() {
    var status = "An error occurred"; // Error message
    var track; // Khai báo biến track
    try {
        var result = getTrackPositionOfSelectedClip();
        if (result === false) {
            status = "No selected clip found.";
            return JSON.stringify({ track: null, status: status }); // Trả về null cho track
        }
        var deselectClips = deselectAllClips();
        if (deselectClips) {
            track = selectAllClipsInTrack(result - 1);
            status = true;
        } else {
            return deselectClips;
        }
    } catch (error) {
        status = error.message; // Ghi lại thông báo lỗi
    }
    return JSON.stringify({ track: track, status: status });
}
// Hàm để tìm vị trí track của clip đã được chọn
function getTrackPositionOfSelectedClip() {
    // Lấy sequence đang hoạt động
    var sequence = app.project.activeSequence;

    if (sequence) {
        // Lấy tất cả clip đã chọn
        var selectedClips = sequence.getSelection();

        if (selectedClips.length > 0) {
            // Lặp qua tất cả video tracks trong sequence
            for (var i = 0; i < sequence.videoTracks.length; i++) {
                var track = sequence.videoTracks[i];
                var trackIndex = i + 1; // Chỉ số track (bắt đầu từ 1 để dễ đọc)

                // Lặp qua tất cả các clip trong track
                for (var j = 0; j < track.clips.length; j++) {
                    var clip = track.clips[j];

                    // Kiểm tra xem clip có được chọn hay không
                    if (clip.isSelected()) {
                        return trackIndex;
                    }
                }
            }
            return false;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
// Hàm để chọn tất cả video trong track được chỉ định
function selectAllClipsInTrack(trackIndex) {
    var sequence = app.project.activeSequence; // Lấy sequence đang hoạt động

    if (sequence) {
        // Kiểm tra xem trackIndex có hợp lệ không
        if (trackIndex >= 0 && trackIndex < sequence.videoTracks.length) {
            var videoTrack = sequence.videoTracks[trackIndex]; // Lấy track video theo chỉ số
            var clipCount = videoTrack.clips.length; // Đếm số clip trong track

            if (clipCount > 0) {
                // Lặp qua tất cả các clip trong track và chọn chúng
                for (var i = 0; i < clipCount; i++) {
                    videoTrack.clips[i].setSelected(true, true); // Chọn clip
                }
                return trackIndex; // Thông báo thành công
            } else {
                return "There are no clips in the video track " + (trackIndex + 1) + ".";
            }
        } else {
            return "Invalid track index. Please enter a number from 0 to " + (sequence.videoTracks.length - 1) + ".";
        }
    } else {
        return "There are no active sequences.";
    }
}
function getVideoTransition_List() {
    app.enableQE();
    var transitionList = qe.project.getVideoTransitionList();
    return JSON.stringify(transitionList);
}
function getVideoEffect_List() {
    app.enableQE();
    var effectList = qe.project.getVideoEffectList();
    return JSON.stringify(effectList);
}
function getAllAudioTrackStates() {
    // Lấy sequence đang hoạt động
    var sequence = app.project.activeSequence;

    if (sequence) {
        // Tạo mảng để lưu trữ trạng thái của các audio track
        var audioTrackStates = [];

        // Lặp qua tất cả các audio track trong sequence
        for (var i = 0; i < sequence.audioTracks.length; i++) {
            // Lấy audio track hiện tại
            var audioTrack = sequence.audioTracks[i];

            // Kiểm tra xem audio track có clip hay không
            if (audioTrack.clips.numItems > 0) {
                // Kiểm tra xem audio track có bị tắt tiếng hay không
                var isMuted = audioTrack.isMuted();

                // Lưu trạng thái của audio track vào mảng
                audioTrackStates.push({ trackIndex: i + 1, isMuted: isMuted });
            }
        }

        return audioTrackStates;
    } else {
        return "There are no active sequences.";
    }
}
function setMuteForAudioTrack(audioTrackIndex, muteState) {
    var sequence = app.project.activeSequence;
    if (sequence && audioTrackIndex > 0 && audioTrackIndex <= sequence.audioTracks.length) {
        sequence.audioTracks[audioTrackIndex - 1].setMute(muteState);
    } else {
        alert("No sequence is active or the audio track index is invalid.");
    }
}



function setAllAudioTracksExceptOne(trackIndexToKeep) {
    var sequence = app.project.activeSequence;
    if (sequence) {
        for (var i = 0; i < sequence.audioTracks.length; i++) {
            if (i + 1 !== trackIndexToKeep && sequence.audioTracks[i].clips.numItems > 0) {
                sequence.audioTracks[i].setMute(1);
            }
        }
        // Kiểm tra xem trackIndexToKeep có đang tắt tiếng không
        if (sequence.audioTracks[trackIndexToKeep - 1].isMuted()) {
            sequence.audioTracks[trackIndexToKeep - 1].setMute(0); // Bật trackIndexToKeep lên nếu nó đang tắt tiếng
        }
        return true;
    } else {
        return "There are no active sequences.";
    }
}
function isEndTimeEqual(sequence, videoIndex, audioIndex) {

    if (!sequence) {
        // alert("Không có sequence nào đang hoạt động.");
        return false;
    }

    // Lấy track video và audio
    var videoTrack = sequence.videoTracks[videoIndex];
    var audioTrack = sequence.audioTracks[audioIndex];

    if (videoTrack && videoTrack.clips.length > 0 && audioTrack && audioTrack.clips.length > 0) {
        // Lấy clip cuối cùng trong track video và audio
        var lastVideoClip = videoTrack.clips[videoTrack.clips.length - 1];
        var lastAudioClip = audioTrack.clips[audioTrack.clips.length - 1];

        // Lấy thời gian kết thúc của clip cuối cùng trong cả hai track
        var videoEndTime = lastVideoClip.end.seconds;
        var audioEndTime = lastAudioClip.end.seconds;

        // Kiểm tra nếu thời gian kết thúc bằng nhau
        if (videoEndTime === audioEndTime) {
            // alert("Thời gian kết thúc của clip cuối cùng trong video và audio là bằng nhau.");
            return true;
        } else {
            // alert("Thời gian kết thúc của clip cuối cùng trong video và audio không bằng nhau.");
            return "The end time of the last clip in video and audio are not equal.";
        }
    } else {
        // alert("Không có đủ clip trong track video hoặc audio.");
        return "There are not enough clips in the video or audio track.";
    }
}
function toggleAllAudioTracksExcept(trackIndexToKeep, presetExport, track_Video) {
    try {
        if (checkVideoTrack(track_Video) == true && checkAudioTrack(trackIndexToKeep) == true) {
            // kiểm tra video và audio có bằng nhau không
            var sequence = app.project.activeSequence;
            var isEndTime = isEndTimeEqual(sequence, track_Video - 1, trackIndexToKeep - 1);
            // alert(isEndTime.toString())
            if (isEndTime !== true) {
                return JSON.stringify({ success: false, message: isEndTime });
            }
            var initialAudioTrackStates = getAllAudioTrackStates();
            setAllAudioTracksExceptOne(trackIndexToKeep);
            var exAudio = exportWav(presetExport);
            if (exAudio) {
                for (var i = 0; i < initialAudioTrackStates.length; i++) {
                    var trackIndex = initialAudioTrackStates[i].trackIndex;
                    var isMuted = initialAudioTrackStates[i].isMuted;
                    var Muted;
                    if (isMuted == true) {
                        Muted = 1;
                    }
                    else {
                        Muted = 0;
                    }
                    setMuteForAudioTrack(trackIndex, Muted);
                }
                return JSON.stringify({ success: true });
            }
            else {
                return JSON.stringify({ success: false, message: "Audio output error." });
            }
        } else {
            return JSON.stringify({ success: false, message: "Video track " + track_Video + " has more than 1 clip or no clip. \nOr please 'Nest' Again into a new sequence." });
        }

    } catch (error) {
        return JSON.stringify({ success: false, error: error.message });
    }

}
function exportWav(presetExport) {
    var pathEpr = new File(presetExport);
    var audioWav = new Folder(Folder.userData + "/AutoCutBLV");
    if (!audioWav.exists) {
        audioWav.create();
    }
    var proj = app.project;
    var sequence = proj.activeSequence;

    if (!sequence) {
        return "No sequence is currently selected.";
    }
    // Kiểm tra xem có video hoặc audio trong sequence không
    var hasAudio = false;
    // Kiểm tra audio tracks
    for (var j = 0; j < sequence.audioTracks.numTracks; j++) {
        var audioTrack = sequence.audioTracks[j];
        if (audioTrack.clips.numItems > 0) {
            hasAudio = true;
            break;
        }
    }
    if (hasAudio) {
        sequence.exportAsMediaDirect(audioWav.fsName + "\\" + "audioCut" + ".wav", pathEpr.fsName, 0);
        return true;
    } else {
        return "No video or audio found in the sequence.";
    }
}
// Sử dụng hàm để tìm kiếm vị trí bin
function findBinIndexAndCount(name) {
    var bins = app.project.rootItem.children;
    var count = 0;
    var index = -1;
    for (var i = 0; i < bins.numItems; i++) {
        var bin = bins[i];
        if (bin.type === ProjectItemType.BIN) {
            count++;
            if (bin.name === name) {
                index = i;
            }
        }
    }
    return { count: count, index: index };
}
function addTrackAtPosition(positionVideo, quantityTrackVideo, positionAudio, quantityTrackAudio) {
    app.enableQE();
    var seq = qe.project.getActiveSequence();
    if (seq) {
        var success = seq.addTracks(quantityTrackVideo, positionVideo, quantityTrackAudio, 1, positionAudio, 0, 0, 0);
    }
}
function findTracksWithSound(sequence, audio_video) {
    if (!sequence) {
        return { success: false, message: "Không có sequence nào đang hoạt động." };
    }
    var tracksWithSound = [];
    if (audio_video == true) {
        for (var i = 0; i < sequence.audioTracks.numTracks; i++) {
            var audioTrack = sequence.audioTracks[i];
            if (audioTrack.clips.length > 0) {
                tracksWithSound.push(i + 1);
                if ((i + 1) == sequence.audioTracks.numTracks) {
                    var newTrack = addTrackAtPosition(0, 0, i + 1, 1);
                }
            }
        }
    }
    else {
        for (var i = 0; i < sequence.videoTracks.numTracks; i++) {
            var videoTrack = sequence.videoTracks[i];
            if (videoTrack.clips.length > 0) {
                tracksWithSound.push(i + 1);
                if ((i + 1) == sequence.videoTracks.numTracks) {
                    var newTrack = addTrackAtPosition(i + 1, 1, 0, 0);
                }
            }
        }
    }
    return { success: true, tracksWithSound: tracksWithSound };
}
function getTimeSequen(sequence) {
    if (!sequence) {
        return { success: false, message: "Không có sequence nào đang hoạt động." };
    }

    var lastClipEnd = 0; // Biến lưu trữ thời gian kết thúc cuối cùng

    // Kiểm tra các track video
    for (var i = 0; i < sequence.videoTracks.numTracks; i++) {
        var videoTrack = sequence.videoTracks[i];
        if (videoTrack.clips.length > 0) {
            var lastVideoClipEnd = videoTrack.clips[videoTrack.clips.length - 1].end.seconds;
            lastClipEnd = Math.max(lastClipEnd, lastVideoClipEnd); // Cập nhật thời gian kết thúc cuối cùng
        }
    }

    // Kiểm tra các track audio
    for (var j = 0; j < sequence.audioTracks.numTracks; j++) {
        var audioTrack = sequence.audioTracks[j];
        if (audioTrack.clips.length > 0) {
            var lastAudioClipEnd = audioTrack.clips[audioTrack.clips.length - 1].end.seconds;
            lastClipEnd = Math.max(lastClipEnd, lastAudioClipEnd); // Cập nhật thời gian kết thúc cuối cùng
        }
    }
    return { success: true, lastClipEndTime: lastClipEnd };

}
function importFilesToBin(binName, path) {
    var binExists = false;
    var bin = app.project.rootItem;
    for (var i = 0; i < app.project.rootItem.children.numItems; i++) {
        var currentBin = app.project.rootItem.children[i];
        if (currentBin.type === 2 && currentBin.name === binName) {
            binExists = true;
            break;
        }
    }
    // if (binExists) {
    var filePathsInTargetBin = getFilePathsInBinByName(bin, binName);
    //     alert(filePathsInTargetBin.length.toString())
    //     alert("bin already exists");
    //     // return { success: true }
    // }

    var result = importFileToProject(binName, path, filePathsInTargetBin, binExists, currentBin);
    if (result.success !== true) {
        // return "Error importing files: " + result.message;
        return { success: false, message: "Error importing files: " + result.message };
    } else {
        return { success: true, fileImport: result.fileImport };
    }

    function importFileToProject(binName, path, filePathsInTargetBin, binExists, currentBin) {
        var fileImport = [];
        var filesToImport = path;

        if (filesToImport.length > 0) {
            // Tạo Bin khi có file, hoặc sử dụng Bin đã có sẵn
            var newBin;
            if (!binExists) {
                newBin = app.project.rootItem.createBin(binName);
            } else {
                newBin = currentBin;
            }

            for (var j = 0; j < filesToImport.length; j++) {
                var filePath = new File(filesToImport[j]);

                // Kiểm tra xem filePath đã tồn tại trong filePathsInTargetBin chưa
                var fileExists = false;

                if (filePathsInTargetBin.length > 0) {
                    for (var i = 0; i < filePathsInTargetBin.length; i++) {
                        var filePathBin = new File(filePathsInTargetBin[i]);

                        // Nếu file đã tồn tại trong bin, bỏ qua và không import
                        if (filePath.toString() === filePathBin.toString()) {
                            fileExists = true;
                            break;
                        }
                    }
                }

                // Nếu file chưa tồn tại trong bin, import nó
                if (!fileExists) {
                    fileImport.push(filePath);
                    var importResult = app.project.importFiles([filePath.fsName.replace("file:///", "/").replace("//", "/")], true, newBin, false);
                }
            }

            return { success: true, fileImport: fileImport };
        } else {
            return { success: false, message: "No files found" };
        }
    }

}
// Hàm để lấy tất cả các đường dẫn tệp trong bin có tên "a"
function getFilePathsInBinByName(bin, targetName) {
    var filePaths = [];

    // Kiểm tra nếu tên bin trùng với targetName ("a")
    if (bin.name === targetName) {
        for (var i = 0; i < bin.children.numItems; i++) {
            var item = bin.children[i];

            if (item.type === ProjectItemType.CLIP) {
                // Nếu mục là một clip, lấy đường dẫn của tệp
                filePaths.push(item.getMediaPath().toString());
            } else if (item.type === ProjectItemType.BIN) {
                // Nếu mục là một bin con, tiếp tục tìm kiếm trong bin đó
                filePaths = filePaths.concat(getFilePathsInBinByName(item, targetName));
            }
        }
    } else {
        // Nếu tên bin không khớp, kiểm tra bin con
        for (var i = 0; i < bin.children.numItems; i++) {
            var item = bin.children[i];
            if (item.type === ProjectItemType.BIN) {
                filePaths = filePaths.concat(getFilePathsInBinByName(item, targetName));
            }
        }
    }

    return filePaths;
}
function insertVideoIntoSequence(insertIntoTrack, overwrite, insertAtEnd, numberClipToInsert, numBin) {
    // var insertIntoTrack = 0; chèn vào theo dõi
    // var overwrite = false; ghi đè lên
    // var insertAtEnd = false; chèn ở cuối
    // var numberClipToInsert = 0; số Kẹp Để Chèn
    var seq = app.project.activeSequence;
    var availibleClips = app.project.rootItem.children[numBin].children;
    var clipToInsert = availibleClips[numberClipToInsert];
    var videoTrack = seq.videoTracks[insertIntoTrack];
    // alert(videoTrack.clips[numClips - 1].end.ticks)
    if (insertAtEnd) {
        var numClips = videoTrack.clips.numItems;
        if (numClips == 0) {
            var dstTicks = 0;
        } else {
            var dstTicks = videoTrack.clips[numClips - 1].end.seconds;
        }
    } else {
        var dstTicks = 0;
    }
    if (overwrite) {
        videoTrack.overwriteClip(clipToInsert, dstTicks);
    } else {
        videoTrack.insertClip(clipToInsert, dstTicks);
    }
    // alert("đã chằn")
    // var giay = dstTicks / 254016000000;
    // alert(videoTrack.clips[videoTrack.clips.numItems - 1].start.seconds)
    // Đảm bảo mỗi hình ảnh được chèn vào có thời lượng 12 giây
    // var seq = app.project.activeSequence;
    // var videoTrack = seq.videoTracks[insertIntoTrack];
    // videoTrack.clips[videoTrack.clips.numItems - 1].end = time// 254016000000; // Cộng thêm 12 giây vào thời gian bắt đầu
    // alert("done " + videoTrack.clips.numItems.toString() + " bắt đầu " + videoTrack.clips[videoTrack.clips.numItems - 1].start.seconds + " kết thúc " + videoTrack.clips[videoTrack.clips.numItems - 1].end.seconds);
}
function insertAudioIntoSequence(insertIntoTrack, overwrite, insertAtEnd, numberClipToInsert, numBin) {
    // var insertIntoTrack = 0; chèn vào theo dõi
    // var overwrite = false; ghi đè lên
    // var insertAtEnd = false; chèn ở cuối
    // var numberClipToInsert = 0; số Kẹp Để Chèn
    var seq = app.project.activeSequence;
    var availibleClips = app.project.rootItem.children[numBin].children;
    var clipToInsert = availibleClips[numberClipToInsert];
    var audioTrack = seq.audioTracks[insertIntoTrack];
    // alert(audioTrack.clips[numClips - 1].end.ticks)
    if (insertAtEnd) {
        var numClips = audioTrack.clips.numItems;
        if (numClips == 0) {
            var dstTicks = 0;
        } else {
            var dstTicks = audioTrack.clips[numClips - 1].end.ticks;
        }
    } else {
        var dstTicks = 0;
    }
    if (overwrite) {
        audioTrack.overwriteClip(clipToInsert, dstTicks);
    } else {
        audioTrack.insertClip(clipToInsert, dstTicks);
    }
}
function insertFileToTrack(insertIntoTrack, overwrite, dstTicks, numberClipToInsert, numBin, audio_video) {
    var seq = app.project.activeSequence;
    var availibleClips = app.project.rootItem.children[numBin].children;
    var clipToInsert = availibleClips[numberClipToInsert];
    if (audio_video) {
        var track = seq.audioTracks[insertIntoTrack];
    } else {
        var track = seq.videoTracks[insertIntoTrack];
    }
    if (overwrite) {
        track.overwriteClip(clipToInsert, dstTicks);
    } else {
        track.insertClip(clipToInsert, dstTicks);
    }
}
function checkVideoTrack(track) {
    var activeSequence = app.project.activeSequence;
    if (activeSequence && activeSequence.videoTracks.length > 0) {
        return activeSequence.videoTracks[track - 1].clips.length === 1;
    }
    return false;
}

function checkAudioTrack(track) {
    var activeSequence = app.project.activeSequence;
    if (activeSequence && activeSequence.audioTracks.length > 0) {
        return activeSequence.audioTracks[track - 1].clips.length === 1;
    }
    return false;
}

function getClipTimestamps(sequence, trackIndexVideo, trackIndexAudio) {
    if (!sequence) {
        alert("Không có sequence nào đang hoạt động.");
        return [];
    }

    var videoTrack = sequence.videoTracks[trackIndexVideo];
    var audioTrack = sequence.audioTracks[trackIndexAudio];
    var clipTimestamps = []; // Mảng lưu dấu thời gian của các clip

    // Kiểm tra xem track có clip hay không
    if (videoTrack && audioTrack && videoTrack.clips.numItems > 0) {
        for (var i = 0; i < videoTrack.clips.numItems; i++) {
            var clip = videoTrack.clips[i];
            var audio = audioTrack.clips[i];
            var inPoint = clip.start.seconds;    // Thời gian bắt đầu của clip
            var outPoint = clip.end.seconds;  // Thời gian kết thúc của clip
            var duration = outPoint - inPoint;     // Thời lượng của clip

            // Thêm dấu thời gian của clip vào mảng
            clipTimestamps.push({
                audio: audio,
                clip: clip,
                clipName: clip.name,
                inPoint: inPoint,
                outPoint: outPoint,
                duration: duration
            });
        }

        // Trả về mảng chứa thông tin của các clip
        return clipTimestamps;
    } else {
        alert("Track không có clip nào.");
        return [];
    }
}

function alignClips(trackIndexVideo, trackIndexAudio) {
    // Gọi hàm
    var sequence = app.project.activeSequence;
    if (!sequence) {
        return JSON.stringify({ success: false, message: "There are no active sequences." });
    }

    var clipInfo = getClipTimestamps(sequence, trackIndexVideo, trackIndexAudio);

    if (clipInfo.length > 0) {
        for (var j = 1; j < clipInfo.length; j++) {
            var newStart = clipInfo[j - 1].outPoint;
            clipInfo[j].clip.start = newStart;
            clipInfo[j].clip.end = newStart + clipInfo[j].duration;
            clipInfo[j].audio.start = newStart;
            clipInfo[j].audio.end = newStart + clipInfo[j].duration;
            clipInfo = getClipTimestamps(sequence, trackIndexVideo, trackIndexAudio); // Cập nhật lại thông tin clip
        }
        return JSON.stringify({ success: true });
    } else {
        return JSON.stringify({ success: false, message: "No clips or audio found." });
    }
}
function razorAudio(time_code, audio_Tracks) {
    var timecodes = JSON.parse(time_code); // Danh sách timecodes từ input JSON
    if (timecodes.length === 0) {
        // alert("Không có timecode nào để cắt.");
        return JSON.stringify({ success: false, message: "There is no timecode to cut." });
    }
    var time = new Time();
    app.enableQE();
    var qeSequence = qe.project.getActiveSequence();
    var audioTrack = qeSequence.getAudioTrackAt(audio_Tracks - 1);
    var deleteVideo = 0;
    for (var i = 0; i < timecodes.length; i++) {
        time.seconds = timecodes[i];
        var timecode = time.getFormatted(app.project.activeSequence.getSettings().videoFrameRate, app.project.activeSequence.getSettings().videoDisplayFormat);
        audioTrack.razor(timecode); // Cắt tại mỗi vị trí timecode
        deleteVideo++;
        if (deleteVideo == 2) {
            deleteSecondLastAudio(audio_Tracks - 1);
            deleteVideo = 0;
        }
    }
    return JSON.stringify({ success: true });

}

function getLastClipEndTime(trackIndex) {
    var sequence = app.project.activeSequence;
    if (!sequence) {
        return null;
    }
    // Lấy track video tại index được chỉ định
    var videoTrack = sequence.videoTracks[trackIndex];

    // Kiểm tra xem track video có chứa clip nào không
    if (videoTrack && videoTrack.clips.length > 0) {
        // Lấy clip cuối cùng trong track video
        var lastVideoClip = videoTrack.clips[videoTrack.clips.length - 1];

        // Lấy thời gian kết thúc của clip cuối cùng
        var videoEndTime = lastVideoClip.end.seconds;
        return videoEndTime;
    } else {
        return null;
    }
}

function razorVideo(result, video_Tracks, audio_Tracks, cutAudio) {
    var cut_Audio = JSON.parse(cutAudio);
    var timecodes = JSON.parse(result); // Danh sách timecodes từ input JSON
    if (timecodes.length === 0) {
        // alert("Không có timecode nào để cắt.");
        return JSON.stringify({ success: false, message: "There is no timecode to cut." });
    }
    var time = new Time();
    app.enableQE();
    var qeSequence = qe.project.getActiveSequence();
    var videoTrack = qeSequence.getVideoTrackAt(video_Tracks - 1);
    var audioTrack = qeSequence.getAudioTrackAt(audio_Tracks - 1);
    var getLastClip = getLastClipEndTime(video_Tracks - 1)
    var deleteVideo = 0;
    for (var i = 0; i < timecodes.length; i++) {
        time.seconds = timecodes[i];
        var timecode = time.getFormatted(app.project.activeSequence.getSettings().videoFrameRate, app.project.activeSequence.getSettings().videoDisplayFormat);
        videoTrack.razor(timecode); // Cắt tại mỗi vị trí timecode
        if (cut_Audio) {
            audioTrack.razor(timecode);
        }
        deleteVideo++;
        if (deleteVideo == 2) {
            var clipDelete = 2;
            // alert(getLastClip + " " + timecode + " " + deleteVideo + "  " + timecodes[i])
            if (Number(getLastClip) == Number(timecodes[i]) || Number(getLastClip) < Number(timecodes[i])) {
                clipDelete = 1;
            }
            deleteSecondLastClip(video_Tracks - 1, clipDelete);
            if (cut_Audio) {
                deleteSecondLastAudio(audio_Tracks - 1, clipDelete);
            }
            deleteVideo = 0;
        }
    }
    //trả về loại bỏ các khoảng trống
    if (cut_Audio) {
        return alignClips(video_Tracks - 1, audio_Tracks - 1);
    } else {
        return JSON.stringify({ success: true });
    }


}
function deleteSecondLastClip(videoTrackIndex, clipDelete) {
    var activeSequence = app.project.activeSequence;

    if (activeSequence && videoTrackIndex >= 0 && videoTrackIndex < activeSequence.videoTracks.length) {
        var videoTrack = activeSequence.videoTracks[videoTrackIndex];
        var clipCount = videoTrack.clips.length;

        // Kiểm tra nếu có đủ clip để xóa clip áp chót
        if (clipCount > 1) {
            var secondLastClip = videoTrack.clips[clipCount - clipDelete]; // Lấy clip áp chót
            secondLastClip.remove(false, true); // Xóa clip áp chót (không ripple delete, align to video)
            return "Deleted the second-last clip on video track " + (videoTrackIndex + 1) + ".";
        } else {
            return "Not enough clips to delete the second-last one.";
        }
    } else {
        return "Invalid video track number or no active sequence.";
    }
}
function deleteSecondLastAudio(audioTrackIndex, clipDelete) {
    var activeSequence = app.project.activeSequence;

    if (activeSequence && audioTrackIndex >= 0 && audioTrackIndex < activeSequence.audioTracks.length) {
        var audioTrack = activeSequence.audioTracks[audioTrackIndex];
        var clipCount = audioTrack.clips.length;

        // Kiểm tra nếu có đủ clip để xóa clip áp chót
        if (clipCount > 1) {
            var secondLastClip = audioTrack.clips[clipCount - clipDelete]; // Lấy clip áp chót
            secondLastClip.remove(false, true); // Xóa clip áp chót (không ripple delete, align to audio)
            return "Deleted the second-last clip on audio track " + (audioTrackIndex + 1) + ".";
        } else {
            return "Not enough clips to delete the second-last one.";
        }
    } else {
        return "Invalid video track number or no active sequence.";
    }
}
