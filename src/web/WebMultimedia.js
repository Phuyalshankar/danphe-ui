'use strict';

/**
 * 🎥 WebMultimedia v1.0 — Browser Multimedia Engine for Dolphin Web Target
 * WebCam Access, Microphone Recording, HTML5 Video & Local File Pickers with Graceful Fallbacks
 */
class WebMultimedia {
    static getClientScript() {
        return `
        // 🎙️ Web Voice Microphone Recording Handler
        window.DolphinWebMic = {
            mediaRecorder: null,
            audioChunks: [],
            recordedBlob: null,
            recordedUrl: '',

            start: function(state, updateDOM) {
                var self = this;
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    self.fallbackAudioPicker(state, updateDOM);
                    return;
                }
                navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
                    self.audioChunks = [];
                    self.mediaRecorder = new MediaRecorder(stream);
                    self.mediaRecorder.ondataavailable = function(e) {
                        if (e.data.size > 0) self.audioChunks.push(e.data);
                    };
                    self.mediaRecorder.onstop = function() {
                        self.recordedBlob = new Blob(self.audioChunks, { type: 'audio/webm' });
                        self.recordedUrl = URL.createObjectURL(self.recordedBlob);
                        state.sys_mic_status = 'Voice Recorded! 🎙️ (Ready to play)';
                        if (updateDOM) updateDOM();
                    };
                    self.mediaRecorder.start();
                    state.sys_mic_status = 'Recording Voice... 🔴';
                    if (updateDOM) updateDOM();
                }).catch(function(err) {
                    // Graceful fallback for PCs without physical Mic Hardware
                    state.sys_mic_status = 'Mic Hardware Not Detected — Select Audio File 🎙️';
                    if (updateDOM) updateDOM();
                    self.fallbackAudioPicker(state, updateDOM);
                });
            },

            fallbackAudioPicker: function(state, updateDOM) {
                var self = this;
                var input = document.createElement('input');
                input.type = 'file';
                input.accept = 'audio/*';
                input.onchange = function(e) {
                    var file = e.target.files[0];
                    if (file) {
                        self.recordedUrl = URL.createObjectURL(file);
                        state.sys_mic_status = 'Selected Audio: ' + file.name + ' 🎵';
                        state.sys_picked_audio_name = file.name;
                        state.sys_picked_audio_url = self.recordedUrl;
                        if (updateDOM) updateDOM();
                    }
                };
                input.click();
            },

            stop: function(state, updateDOM) {
                if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                    this.mediaRecorder.stop();
                    this.mediaRecorder.stream.getTracks().forEach(function(track) { track.stop(); });
                } else if (this.recordedUrl) {
                    state.sys_mic_status = 'Audio File Ready to Play! 🎙️';
                    if (updateDOM) updateDOM();
                }
            },

            play: function(state, updateDOM) {
                if (this.recordedUrl) {
                    var a = new Audio(this.recordedUrl);
                    a.play().catch(function() {});
                    state.sys_mic_status = 'Playing Audio Stream... ▶️';
                    if (updateDOM) updateDOM();
                } else {
                    this.fallbackAudioPicker(state, updateDOM);
                }
            }
        };

        // 📷 Web Camera & File Picker Handler with Graceful Fallback
        window.DolphinWebCamera = {
            snapOrPick: function(acceptType, state, updateDOM, callback) {
                var self = this;
                self.pickFile(acceptType, state, updateDOM, callback);
            },
            pickFile: function(acceptType, state, updateDOM, callback) {
                var input = document.createElement('input');
                input.type = 'file';
                input.accept = acceptType || '*/*';
                input.onchange = function(e) {
                    var file = e.target.files[0];
                    if (file) {
                        var url = URL.createObjectURL(file);
                        if (callback) callback(file, url);
                    }
                };
                input.click();
            }
        };

        // 🎨 64-Channel HTML5 Canvas Video Engine for Web Browser Target (Opcode 0x61)
        window.initTitanWebCanvas = function() {
            var canvas = document.querySelector('canvas') || document.querySelector('[type="0x61"]');
            if (!canvas || canvas.getAttribute('data-titan-inited')) return;
            canvas.setAttribute('data-titan-inited', 'true');

            canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth || 1280 : 1280;
            canvas.height = Math.round(canvas.width * (9 / 16));
            var ctx = canvas.getContext('2d');
            if (!ctx) return;

            var baseUrl = canvas.getAttribute('src') || canvas.getAttribute('data-src') || (window.location.protocol + '//' + window.location.hostname + ':9094');
            if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

            var columns = 8;
            var rows = 8;
            var images = {};
            var selectedCam = -1;

            function drawGrid() {
                var w = canvas.width;
                var h = canvas.height;
                ctx.fillStyle = '#020817';
                ctx.fillRect(0, 0, w, h);

                if (selectedCam > 0) {
                    // Fullscreen Zoom View
                    var formattedId = selectedCam < 10 ? 'cam_0' + selectedCam : 'cam_' + selectedCam;
                    var img = images[selectedCam];
                    if (img && img.complete && img.naturalWidth !== 0) {
                        ctx.drawImage(img, 0, 0, w, h);
                    } else {
                        ctx.fillStyle = '#0f172a';
                        ctx.fillRect(0, 0, w, h);
                    }
                    ctx.strokeStyle = '#38bdf8';
                    ctx.lineWidth = 4;
                    ctx.strokeRect(0, 0, w, h);
                    ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
                    ctx.fillRect(10, 10, 260, 40);
                    ctx.fillStyle = '#38bdf8';
                    ctx.font = 'bold 18px sans-serif';
                    ctx.fillText('📹 CH' + (selectedCam < 10 ? '0' + selectedCam : selectedCam) + ' - FULLSCREEN VIEW', 20, 36);
                    return;
                }

                var cellW = w / columns;
                var cellH = h / rows;

                for (var r = 0; r < rows; r++) {
                    for (var c = 0; c < columns; c++) {
                        var camId = r * columns + c + 1;
                        var x = c * cellW;
                        var y = r * cellH;

                        var img = images[camId];
                        if (img && img.complete && img.naturalWidth !== 0) {
                            ctx.drawImage(img, x, y, cellW, cellH);
                        } else {
                            ctx.fillStyle = '#0a0f1e';
                            ctx.fillRect(x, y, cellW, cellH);
                        }

                        // OSD Grid Border
                        ctx.strokeStyle = '#1e3a5f';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(x, y, cellW, cellH);

                        // OSD Header
                        ctx.fillStyle = 'rgba(2, 8, 23, 0.75)';
                        ctx.fillRect(x + 2, y + 2, cellW - 4, 18);
                        ctx.fillStyle = '#38bdf8';
                        ctx.font = 'bold 10px monospace';
                        ctx.fillText('CH' + (camId < 10 ? '0' + camId : camId), x + 6, y + 14);

                        // REC Badge
                        ctx.fillStyle = '#ef4444';
                        ctx.beginPath();
                        ctx.arc(x + cellW - 10, y + 10, 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

            function fetchSnapshots() {
                for (var id = 1; id <= 64; id++) {
                    (function(camId) {
                        var formattedId = camId < 10 ? 'cam_0' + camId : 'cam_' + camId;
                        var img = new Image();
                        img.onload = function() {
                            images[camId] = img;
                            drawGrid();
                        };
                        img.src = baseUrl + '/nvr/snapshot/' + formattedId + '?t=' + Date.now();
                    })(id);
                }
            }

            canvas.addEventListener('click', function(e) {
                var rect = canvas.getBoundingClientRect();
                var clickX = e.clientX - rect.left;
                var clickY = e.clientY - rect.top;
                if (selectedCam > 0) {
                    selectedCam = -1;
                } else {
                    var cellW = canvas.width / columns;
                    var cellH = canvas.height / rows;
                    var col = Math.floor(clickX / cellW);
                    var row = Math.floor(clickY / cellH);
                    selectedCam = row * columns + col + 1;
                }
                drawGrid();
            });

            drawGrid();
            fetchSnapshots();
            setInterval(fetchSnapshots, 2000);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', window.initTitanWebCanvas);
        } else {
            setTimeout(window.initTitanWebCanvas, 100);
        }
        `;
    }
}

module.exports = WebMultimedia;
