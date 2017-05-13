var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("api", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DEFAULT_BASE = './api/';
    var API = (function () {
        function API() {
        }
        API.prototype.request = function (resource) {
            return fetch(DEFAULT_BASE + resource).then(function (response) {
                return response.text();
            });
        };
        API.prototype.getSentence = function () {
            return this.request('sentence');
        };
        return API;
    }());
    exports.default = API;
});
define("dsp", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FrequencyBins = (function () {
        function FrequencyBins(analyzerNode, skip) {
            if (skip === void 0) { skip = 2; }
            this.analyzerNode = analyzerNode;
            this.skip = skip;
            var binCount = this.analyzerNode.frequencyBinCount;
            this.temp = new Float32Array(binCount);
            this.bins = new Float32Array(binCount - skip);
        }
        FrequencyBins.prototype.update = function () {
            this.analyzerNode.getFloatFrequencyData(this.temp);
            this.bins.set(this.temp.subarray(this.skip));
        };
        return FrequencyBins;
    }());
    exports.FrequencyBins = FrequencyBins;
});
define("viz", ["require", "exports", "dsp"], function (require, exports, dsp_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MIN_DB_LEVEL = -85; // The dB level that is 0 in the levels display
    var MAX_DB_LEVEL = -30; // The dB level that is 100% in the levels display
    var DB_LEVEL_RANGE = MAX_DB_LEVEL - MIN_DB_LEVEL;
    exports.HEAT_COLORS = [];
    function generateHeatColors() {
        function color(value) {
            var h = (1.0 - value) * 240;
            return "hsl(" + h + ", 100%, 50%)";
        }
        for (var i = 0; i < 256; i++) {
            exports.HEAT_COLORS.push(color(i / 256));
        }
    }
    generateHeatColors();
    function clamp(v, a, b) {
        if (v < a)
            v = a;
        if (v > b)
            v = b;
        return v;
    }
    exports.clamp = clamp;
    var darkScale = chroma.scale('Spectral').domain([1, 0]);
    exports.DarkTheme = {
        backgroundColor: "#212121",
        scale: function (value) {
            return darkScale(value);
        }
    };
    var lightScale = chroma.scale('Set1');
    exports.LightTheme = {
        backgroundColor: "#F5F5F5",
        scale: function (value) {
            return lightScale(value);
        }
    };
    var hotScale = chroma.scale({
        colors: ['#000000', '#ff0000', '#ffff00', '#ffffff'],
        positions: [0, .25, .75, 1],
        mode: 'rgb',
        limits: [0, 300]
    });
    var hotScale = chroma.scale(['#000000', '#ff0000', '#ffff00', '#ffffff']);
    var CanvasView = (function () {
        // theme = LightTheme;
        function CanvasView(canvas, width, height) {
            this.canvas = canvas;
            this.width = width;
            this.height = height;
            this.theme = exports.DarkTheme;
            this.reset();
        }
        CanvasView.prototype.reset = function () {
            this.ratio = window.devicePixelRatio || 1;
            this.canvas.width = this.width * this.ratio;
            this.canvas.height = this.height * this.ratio;
            this.canvas.style.width = this.width + "px";
            this.canvas.style.height = this.height + "px";
            this.ctx = this.canvas.getContext("2d");
        };
        CanvasView.prototype.start = function () {
            var self = this;
            function tick() {
                self.update();
                self.render();
                requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        };
        CanvasView.prototype.update = function () {
        };
        CanvasView.prototype.render = function () {
        };
        return CanvasView;
    }());
    var AnalyzerNodeView = (function (_super) {
        __extends(AnalyzerNodeView, _super);
        function AnalyzerNodeView(analyzerNode, canvas, width, height) {
            var _this = _super.call(this, canvas, width, height) || this;
            _this.isRecording = false;
            _this.frequency = new dsp_1.FrequencyBins(analyzerNode);
            return _this;
        }
        return AnalyzerNodeView;
    }(CanvasView));
    exports.AnalyzerNodeView = AnalyzerNodeView;
    var LinearAnalyzerNodeView = (function (_super) {
        __extends(LinearAnalyzerNodeView, _super);
        function LinearAnalyzerNodeView(analyzerNode, canvas, width, height) {
            var _this = _super.call(this, analyzerNode, canvas, width, height) || this;
            _this.binWidth = 5;
            _this.binHPadding = 1;
            _this.binTotalWidth = _this.binWidth + _this.binHPadding;
            _this.tickHeight = 2;
            _this.tickVPadding = 1;
            _this.tickTotalHeight = _this.tickHeight + _this.tickVPadding;
            _this.reset();
            _this.start();
            return _this;
        }
        LinearAnalyzerNodeView.prototype.update = function () {
            this.frequency.update();
        };
        LinearAnalyzerNodeView.prototype.render = function () {
            var ctx = this.ctx;
            ctx.save();
            ctx.scale(this.ratio, this.ratio);
            ctx.fillStyle = this.theme.backgroundColor;
            ctx.fillRect(0, 0, this.width, this.height);
            var maxBinCount = this.width / this.binTotalWidth | 0;
            var binCount = Math.min(maxBinCount, this.frequency.bins.length);
            for (var i = 0; i < binCount; i++) {
                ctx.fillStyle = this.theme.scale(i / binCount);
                var value = clamp((this.frequency.bins[i] - MIN_DB_LEVEL) / DB_LEVEL_RANGE, 0, 1);
                var ticks = this.height / 2 * value / this.tickTotalHeight | 0;
                // let maxTicks = this.height / this.tickTotalHeight | 0;
                for (var j = 0; j < ticks; j++) {
                    // ctx.fillStyle = this.theme.scale(j / ticks);
                    // ctx.fillStyle = this.theme.scale(j / maxTicks);
                    ctx.globalAlpha = 1;
                    ctx.fillRect(i * this.binTotalWidth, this.height / 2 - j * this.tickTotalHeight, this.binWidth, this.tickHeight);
                    ctx.globalAlpha = 0.5;
                    ctx.fillRect(i * this.binTotalWidth, this.height / 2 + j * this.tickTotalHeight, this.binWidth, this.tickHeight);
                }
                ctx.globalAlpha = 0.3;
                ctx.fillRect(i * this.binTotalWidth, this.height / 2, this.binWidth, this.tickHeight);
            }
            ctx.restore();
        };
        return LinearAnalyzerNodeView;
    }(AnalyzerNodeView));
    exports.LinearAnalyzerNodeView = LinearAnalyzerNodeView;
    var SpectogramAnalyzerNodeView = (function (_super) {
        __extends(SpectogramAnalyzerNodeView, _super);
        function SpectogramAnalyzerNodeView(analyzerNode, canvas, width, height) {
            var _this = _super.call(this, analyzerNode, canvas, width, height) || this;
            _this.binWidth = 4;
            _this.binHPadding = 0;
            _this.binTotalWidth = _this.binWidth + _this.binHPadding;
            _this.tickHeight = 4;
            _this.tickVPadding = 1;
            _this.tickTotalHeight = _this.tickHeight + _this.tickVPadding;
            _this.reset();
            _this.start();
            return _this;
        }
        SpectogramAnalyzerNodeView.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this.tmpCanvas = document.createElement("canvas");
            this.tmpCanvas.width = this.canvas.width;
            this.tmpCanvas.height = this.canvas.height;
            this.tmpCtx = this.tmpCanvas.getContext("2d");
        };
        SpectogramAnalyzerNodeView.prototype.update = function () {
            this.frequency.update();
        };
        SpectogramAnalyzerNodeView.prototype.render = function () {
            var ctx = this.ctx;
            // Save
            this.tmpCtx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height);
            ctx.save();
            ctx.save();
            ctx.scale(this.ratio, this.ratio);
            ctx.fillStyle = this.theme.backgroundColor;
            ctx.fillRect(0, 0, this.width, this.height);
            var maxBinCount = this.width / this.binTotalWidth | 0;
            var binCount = Math.min(maxBinCount, this.frequency.bins.length);
            for (var i = 0; i < binCount; i++) {
                ctx.fillStyle = this.theme.scale(i / binCount);
                var value = clamp((this.frequency.bins[i] - MIN_DB_LEVEL) / DB_LEVEL_RANGE, 0, 1);
                ctx.globalAlpha = value;
                ctx.fillRect(this.width - this.binTotalWidth, i * this.tickTotalHeight, this.binWidth, this.tickHeight);
            }
            ctx.restore();
            ctx.translate(-this.binTotalWidth, 0);
            ctx.drawImage(this.tmpCanvas, 0, 0);
            ctx.restore();
        };
        return SpectogramAnalyzerNodeView;
    }(AnalyzerNodeView));
    exports.SpectogramAnalyzerNodeView = SpectogramAnalyzerNodeView;
    var RadialAnalyzerNodeView = (function (_super) {
        __extends(RadialAnalyzerNodeView, _super);
        function RadialAnalyzerNodeView(analyzerNode, canvas, width, height) {
            var _this = _super.call(this, analyzerNode, canvas, width, height) || this;
            _this.binWidth = 5;
            _this.binHPadding = 1;
            _this.binTotalWidth = _this.binWidth + _this.binHPadding;
            _this.tickHeight = 4;
            _this.tickVPadding = 2;
            _this.tickTotalHeight = _this.tickHeight + _this.tickVPadding;
            _this.reset();
            _this.start();
            return _this;
        }
        RadialAnalyzerNodeView.prototype.update = function () {
            this.frequency.update();
        };
        RadialAnalyzerNodeView.prototype.render = function () {
            var ctx = this.ctx;
            ctx.save();
            ctx.scale(this.ratio, this.ratio);
            ctx.fillStyle = this.theme.backgroundColor;
            ctx.fillRect(0, 0, this.width, this.height);
            var innerRadius = 12 * this.ratio;
            if (this.isRecording) {
                ctx.beginPath();
                var animation = Math.abs(Math.sin(performance.now() / 1000));
                var radius = innerRadius / 3 + innerRadius / 4 * animation;
                ctx.fillStyle = this.theme.scale(animation);
                ctx.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            var binCount = this.frequency.bins.length;
            ctx.translate(this.width / 2, this.height / 2);
            var angle = Math.PI * 2 / binCount;
            for (var i = 0; i < binCount; i++) {
                ctx.rotate(angle);
                var value = clamp((this.frequency.bins[i] - MIN_DB_LEVEL) / DB_LEVEL_RANGE, 0, 1);
                var ticks = (Math.min(this.width, this.height) / 2 * value / this.tickTotalHeight) | 0;
                ctx.fillStyle = this.theme.scale(i / binCount);
                ctx.globalAlpha = 1;
                for (var j = 0; j < ticks; j++) {
                    var r = (innerRadius + j * this.tickTotalHeight);
                    var t_1 = Math.max((2 * r * Math.sin(angle / 2) - this.tickVPadding) | 0, 1);
                    ctx.fillRect(innerRadius + j * this.tickTotalHeight, -t_1 / 2, this.tickHeight, t_1);
                }
                ctx.globalAlpha = 0.3;
                var t = Math.max((2 * innerRadius * Math.sin(angle / 2) - this.tickVPadding) | 0, 1);
                ctx.fillRect(innerRadius, -t / 2, this.tickHeight, t);
            }
            ctx.restore();
        };
        return RadialAnalyzerNodeView;
    }(AnalyzerNodeView));
    exports.RadialAnalyzerNodeView = RadialAnalyzerNodeView;
});
define("record", ["require", "exports", "api", "viz"], function (require, exports, api_1, viz_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function assert(c, message) {
        if (message === void 0) { message = ""; }
        if (!c) {
            throw new Error(message);
        }
    }
    exports.assert = assert;
    // These are some things that can go wrong:
    var ERR_NO_RECORDING = 'Please record first.';
    var ERR_NO_PLAYBACK = 'Please listen before submitting.';
    var ERR_PLATFORM = 'Your browser does not support audio recording.';
    var ERR_NO_CONSENT = 'You did not consent to recording. ' +
        'You must click the "I Agree" button in order to use this website.';
    var ERR_NO_MIC = 'You did not allow this website to use the microphone. ' +
        'The website needs the microphone to record your voice.';
    var ERR_UPLOAD_FAILED = 'Uploading your recording to the server failed. ' +
        'This may be a temporary problem. Please try again.';
    var ERR_DATA_FAILED = 'Submitting your profile data failed. ' +
        'This may be a temporary problem. Please try again.';
    var REPLAY_TIMEOUT = 200;
    var SOUNDCLIP_URL = '/upload/';
    /* Uneeded for now, but these are good to know
    var PROD_URL = 'https://www.mturk.com';
    var PROD_ACTION = PROD_URL + '/mturk/externalSubmit';
    */
    function generateGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    function getUserId() {
        if (localStorage.userId) {
            return localStorage.userId;
        }
        localStorage.userId = generateGUID();
        return localStorage.userId;
    }
    var Component = (function () {
        function Component() {
            this.state = Object.create(null);
        }
        Component.prototype.setState = function (state) {
            var needsUpdating = false;
            for (var k in state) {
                if (this.state[k] != state[k]) {
                    this.state[k] = state[k];
                    needsUpdating = true;
                }
            }
            if (needsUpdating) {
                this.forceUpdate();
            }
        };
        Component.prototype.forceUpdate = function () {
            var _this = this;
            if (this.updateTimeout) {
                return;
            }
            this.updateTimeout = setTimeout(function () {
                _this.update();
                _this.updateTimeout = 0;
            });
        };
        Component.prototype.update = function () {
        };
        return Component;
    }());
    exports.Component = Component;
    var Audio = (function () {
        function Audio(microphone) {
            this.chunks = [];
            var audioContext = new AudioContext();
            var sourceNode = audioContext.createMediaStreamSource(microphone);
            var volumeNode = audioContext.createGain();
            var analyzerNode = audioContext.createAnalyser();
            var outputNode = audioContext.createMediaStreamDestination();
            // Make sure we're doing mono everywhere.
            sourceNode.channelCount = 1;
            volumeNode.channelCount = 1;
            analyzerNode.channelCount = 1;
            outputNode.channelCount = 1;
            // Connect the nodes together
            sourceNode.connect(volumeNode);
            volumeNode.connect(analyzerNode);
            analyzerNode.connect(outputNode);
            // and set up the recorder.
            this.recorder = new MediaRecorder(outputNode.stream);
            // Set up the analyzer node, and allocate an array for its data
            // FFT size 64 gives us 32 bins. But those bins hold frequencies up to
            // 22kHz or more, and we only care about visualizing lower frequencies
            // which is where most human voice lies, so we use fewer bins
            analyzerNode.fftSize = 128;
            // Another audio node used by the beep() function
            var beeperVolume = audioContext.createGain();
            beeperVolume.connect(audioContext.destination);
            this.analyzerNode = analyzerNode;
            this.audioContext = audioContext;
        }
        Audio.prototype.start = function () {
            var _this = this;
            this.recorder.ondataavailable = function (e) {
                console.log("Recording ...");
                _this.chunks.push(e.data);
            };
            // We want to be able to record up to 60s of audio in a single blob.
            // Without this argument to start(), Chrome will call dataavailable
            // very frequently.
            this.recorder.start(20000);
        };
        Audio.prototype.stop = function () {
            var self = this;
            return new Promise(function (res, reject) {
                self.recorder.onstop = function (e) {
                    console.log("Recorder Stopped");
                    var blob = new Blob(self.chunks, { 'type': 'audio/ogg; codecs=opus' });
                    self.chunks = [];
                    self.lastRecording = blob;
                    res(blob);
                };
                self.recorder.stop();
            });
        };
        Audio.getMicrophone = function () {
            return new Promise(function (res, reject) {
                function resolve(stream) {
                    res(stream);
                }
                // Reject the promise with a 'permission denied' error code
                function deny() { reject(ERR_NO_MIC); }
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ audio: true }).then(resolve, deny);
                }
                else if (navigator.getUserMedia) {
                    navigator.getUserMedia({ audio: true }, resolve, deny);
                }
                else if (navigator.webkitGetUserMedia) {
                    navigator.webkitGetUserMedia({ audio: true }, resolve, deny);
                }
                else if (navigator.mozGetUserMedia) {
                    navigator.mozGetUserMedia({ audio: true }, resolve, deny);
                }
                else {
                    reject(ERR_PLATFORM); // Browser does not support getUserMedia
                }
            });
        };
        return Audio;
    }());
    exports.Audio = Audio;
    var RecordComponent = (function (_super) {
        __extends(RecordComponent, _super);
        function RecordComponent(container, microphone) {
            var _this = _super.call(this) || this;
            _this.container = container;
            _this.recordingInterval = 0;
            _this.state = {
                sentence: "",
                message: "",
                recording: false,
                playing: false,
                recordingStartTime: 0
            };
            _this.api = new api_1.default();
            _this.audio = new Audio(microphone);
            _this.mount();
            _this.newSentence();
            return _this;
        }
        RecordComponent.prototype.mount = function () {
            this.container.innerHTML = "\n    <p id=\"message\" class=\"panel\"></p>\n    <div id=\"record-screen\" class=\"screen disabled\">\n      <div id=\"error-screen\" class=\"screen panel\" hidden>\n        <div class=\"panel-head\">Error</div>\n        <div class=\"panel-content\">\n          <p class=\"title\" id=\"error-message\"></p>\n          <h2 hidden id=\"error-reload\">\n            Reload the page to try again\n          </h2>\n          <p id=\"error-supported\">\n            Please check your browser's compatibility:\n            <table>\n              <tr><th>Platform<th>Browser</tr>\n              <tr><td>Desktop<td>Firefox, Chrome supported</tr>\n              <tr><td>Android<td>Firefox supported</tr>\n              <tr><td>iPhone, iPad<td><b>Not supported</b></tr>\n            </table>\n          </p>\n        </div>\n      </div>\n\n      <div id=\"sentence\" class=\"title\">Say something out loud!</div>\n      <span id=\"record-progress\" class=\"progress small\"></span>\n      <div id=\"toolbar\">\n        <button id=\"recordButton\" class=\"active\" type=\"button\">Record</button>\n        <button id=\"playButton\" type=\"button\">Play</button>\n        <button id=\"uploadButton\" type=\"button\">Submit</button>\n        <button id=\"nextButton\" type=\"button\">Next</button>\n      </div>\n      <input id=\"excerpt\" type=\"hidden\" name=\"excerpt\" value=\"\">\n      <div id=\"elapsedTime\"></div>\n      <div id=\"viz\">\n        <canvas id=\"radialLevels\" width=100 height=100></canvas>\n      </div>\n      <span id=\"upload-progress\" class=\"progress small\"></span>\n      <input id=\"sensitivity\" style=\"display: none\"\n                              type=\"range\" min=\"1\" max=\"200\"></input>\n      <audio id=\"player\" controls=\"controls\" class=\"disabled\"></audio>\n    </div>";
            // <canvas id="levels" width=100 height=100></canvas>
            // <canvas id="spectrogram" width=100 height=100></canvas>
            var $ = document.querySelector.bind(document);
            this.messageEl = $('#message');
            this.sentenceEl = $('#sentence');
            var el = document.querySelector('#record-screen');
            this.recordButtonEl = el.querySelector('#recordButton');
            this.playButtonEl = el.querySelector('#playButton');
            this.uploadButtonEl = el.querySelector('#uploadButton');
            this.nextButtonEl = el.querySelector('#nextButton');
            this.elapsedTimeEl = el.querySelector('#elapsedTime');
            this.playerEl = el.querySelector('#player');
            this.recordButtonEl.addEventListener('click', this.onRecordClick.bind(this));
            this.uploadButtonEl.addEventListener('click', this.onUploadClick.bind(this));
            this.playButtonEl.addEventListener('click', this.onPlayClick.bind(this));
            this.nextButtonEl.addEventListener('click', this.onNextClick.bind(this));
            // var levels = el.querySelector('#levels') as HTMLCanvasElement;
            var radialLevels = el.querySelector('#radialLevels');
            // var spectrogram = el.querySelector('#spectrogram') as HTMLCanvasElement;
            // this.visualizer = new LinearAnalyzerNodeView(this.audio.analyzerNode, levels, 384, 300);
            this.radialVisualizer = new viz_1.RadialAnalyzerNodeView(this.audio.analyzerNode, radialLevels, 300, 300);
            // this.spectrogramVisualizer = new SpectogramAnalyzerNodeView(this.audio.analyzerNode, spectrogram, 500, 300);
            this.playerEl.addEventListener('canplaythrough', this.onCanPlayThrough.bind(this));
            this.playerEl.addEventListener('play', this.onPlay.bind(this));
            this.playerEl.addEventListener('ended', this.onPlayEnded.bind(this));
        };
        RecordComponent.prototype.onRecordClick = function () {
            if (this.state.recording) {
                this.stopRecording();
            }
            else {
                this.startRecording();
            }
        };
        RecordComponent.prototype.startRecording = function () {
            var _this = this;
            this.setState({
                recording: true,
                recordingStartTime: this.audio.audioContext.currentTime
            });
            this.recordingInterval = setInterval(function () {
                _this.forceUpdate();
            });
            this.audio.start();
        };
        RecordComponent.prototype.stopRecording = function () {
            var _this = this;
            this.setState({ recording: false });
            assert(this.recordingInterval);
            clearInterval(this.recordingInterval);
            this.recordingInterval = 0;
            this.audio.stop().then(function () {
                _this.forceUpdate();
            });
        };
        RecordComponent.prototype.onUploadClick = function () {
            // Save
            // var a = document.createElement('a');
            // var url = window.URL.createObjectURL(this.audio.lastRecording);
            // a.href = url;
            // a.download = "rec.ogg";
            // document.body.appendChild(a);
            // a.click();
            // document.body.removeChild(a);
            // window.URL.revokeObjectURL(url);
            // Upload
            var self = this;
            var upload = new Promise(function (resolve, reject) {
                var req = new XMLHttpRequest();
                req.upload.addEventListener('load', resolve);
                req.upload.addEventListener("error", reject);
                req.open('POST', SOUNDCLIP_URL);
                req.setRequestHeader('uid', getUserId());
                req.setRequestHeader('sentence', encodeURIComponent(self.state.sentence));
                req.send(self.audio.lastRecording);
            });
            upload.then(function () {
                console.log("Uploaded Ok.");
            }).catch(function (e) {
                console.log("Upload Error: " + ERR_UPLOAD_FAILED);
            });
        };
        RecordComponent.prototype.onPlayClick = function () {
            this.playerEl.src = URL.createObjectURL(this.audio.lastRecording);
            if (this.state.playing) {
                this.playerEl.pause();
                this.setState({ playing: false });
                return;
            }
            this.playerEl.play();
            this.setState({ playing: true });
        };
        RecordComponent.prototype.onPlay = function () {
        };
        RecordComponent.prototype.onCanPlayThrough = function () {
        };
        RecordComponent.prototype.onPlayEnded = function () {
            this.setState({ playing: false });
        };
        RecordComponent.prototype.onNextClick = function () {
            this.newSentence();
        };
        RecordComponent.prototype.newSentence = function () {
            var _this = this;
            this.setState({ message: "Fetching Sentence" });
            this.api.getSentence().then(function (sentence) {
                _this.setState({ sentence: sentence });
            });
        };
        RecordComponent.prototype.update = function () {
            this.sentenceEl.textContent = "" + this.state.sentence;
            this.messageEl.textContent = this.state.message ? "" + this.state.message : "N/A";
            this.recordButtonEl.textContent = this.state.recording ? 'Stop' : 'Record';
            this.playButtonEl.textContent = this.state.playing ? 'Stop' : 'Play';
            // this.visualizer.isRecording = this.state.recording;
            this.radialVisualizer.isRecording = this.state.recording;
            // this.spectrogramVisualizer.isRecording = this.state.recording;
            if (this.state.recording) {
                var elapsedTime = this.audio.audioContext.currentTime - this.state.recordingStartTime;
                // this.elapsedTimeEl.innerText = elapsedTime.toFixed(2);
            }
            this.recordButtonEl.classList.toggle('disabled', this.state.playing);
            this.playButtonEl.classList.toggle('disabled', this.state.recording || !this.audio.lastRecording);
            this.uploadButtonEl.classList.toggle('disabled', !this.audio.lastRecording || this.state.recording || this.state.playing);
            this.nextButtonEl.classList.toggle('disabled', this.state.recording || this.state.playing);
        };
        return RecordComponent;
    }(Component));
    exports.RecordComponent = RecordComponent;
    function start() {
        Audio.getMicrophone().then(function (microphone) {
            new RecordComponent(document.getElementById('content'), microphone);
        });
    }
    exports.default = start;
});
define("app", ["require", "exports", "record"], function (require, exports, record_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        /**
         * App will handle routing to page controllers.
         */
        function App(container) {
            this.container = container;
        }
        /**
         * Entry point for the application.
         */
        App.prototype.run = function () {
            // For now, we will just show recording screen.
            record_1.default();
        };
        return App;
    }());
    exports.default = App;
});
/// <reference path="./vendor/require.d.ts" />
function run(appModule) {
    var App = appModule.default;
    var container = document.getElementById('content');
    var app = new App(container);
    app.run();
}
// Configure entry point regaurdless of if requirejs has loaded yet.
if (!require) {
    var require_1 = {
        deps: ["app"],
        callback: run
    };
}
else {
    require(['app'], run);
}
define("pages/record", ["require", "exports", "api", "viz"], function (require, exports, api_2, viz_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function start() {
        'use strict';
        function getQuery() {
            if (window._query) {
                return window._query;
            }
            var query = location.search.substr(1);
            var result = {};
            query.split("&").forEach(function (part) {
                var item = part.split("=");
                result[item[0]] = decodeURIComponent(item[1]);
            });
            window._query = result;
            return result;
        }
        function generateGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        function getUserId() {
            if (localStorage.userId) {
                return localStorage.userId;
            }
            localStorage.userId = generateGuid();
            return localStorage.userId;
        }
        // var MIN_DB_LEVEL = -85;      // The dB level that is 0 in the levels display
        // var MAX_DB_LEVEL = -30;      // The dB level that is 100% in the levels display
        // var LOUD_THRESHOLD = -40;    // Above this dB level we display in red
        var SILENCE_THRESHOLD = -65; // Levels below this db threshold count as silence
        var SILENCE_DURATION = 1.5; // How many seconds of quiet before stop recording
        var STOP_BEEP_HZ = 440; // Frequency and duration of beep
        var STOP_BEEP_S = 0.3;
        var rightside = true;
        var REPLAY_TIMEOUT = 200;
        // The microphone stream we get from getUserMedia
        var microphone;
        // The sentence we're currently recording.
        var currentSentence;
        // These are some things that can go wrong:
        var ERR_NO_RECORDING = 'Please record first.';
        var ERR_NO_PLAYBACK = 'Please listen before submitting.';
        var ERR_PLATFORM = 'Your browser does not support audio recording.';
        var ERR_NO_CONSENT = 'You did not consent to recording. ' +
            'You must click the "I Agree" button in order to use this website.';
        var ERR_NO_MIC = 'You did not allow this website to use the microphone. ' +
            'The website needs the microphone to record your voice.';
        var ERR_UPLOAD_FAILED = 'Uploading your recording to the server failed. ' +
            'This may be a temporary problem. Please try again.';
        var ERR_DATA_FAILED = 'Submitting your profile data failed. ' +
            'This may be a temporary problem. Please try again.';
        var SOUNDCLIP_URL = '/upload/';
        /* Uneeded for now, but these are good to know
        var PROD_URL = 'https://www.mturk.com';
        var PROD_ACTION = PROD_URL + '/mturk/externalSubmit';
        */
        var $ = document.querySelector.bind(document);
        function setMessage(message) {
            var m = $('#message');
            m.textContent = message;
            m.className = 'panel';
        }
        function empty(el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        }
        function checkPlatformSupport() {
            function isWebAudioSupported() {
                return typeof window.AudioContext === 'function';
            }
            function isGetUserMediaSupported() {
                var gum = (navigator.mediaDevices &&
                    navigator.mediaDevices.getUserMedia) ||
                    navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia;
                return typeof gum === 'function';
            }
            function isMediaRecorderSupported() {
                return typeof window.MediaRecorder === 'function';
            }
            if (!isGetUserMediaSupported() ||
                !isWebAudioSupported() ||
                !isMediaRecorderSupported()) {
                return Promise.reject(ERR_PLATFORM);
            }
            else {
                return Promise.resolve(true);
            }
        }
        function setupPage() {
            var content = "\n  <p id=\"message\" class=\"panel\"></p>\n  <div id=\"record-screen\" class=\"screen disabled\">\n    <div id=\"error-screen\" class=\"screen panel\" hidden>\n      <div class=\"panel-head\">Error</div>\n      <div class=\"panel-content\">\n        <p class=\"title\" id=\"error-message\"></p>\n        <h2 hidden id=\"error-reload\">\n          Reload the page to try again\n        </h2>\n        <p id=\"error-supported\">\n          Please check your browser's compatibility:\n          <table>\n            <tr><th>Platform<th>Browser</tr>\n            <tr><td>Desktop<td>Firefox, Chrome supported</tr>\n            <tr><td>Android<td>Firefox supported</tr>\n            <tr><td>iPhone, iPad<td><b>Not supported</b></tr>\n          </table>\n        </p>\n      </div>\n    </div>\n\n    <div id=\"title\" class=\"title\">\n      Please grant microphone access\n    </div>\n\n    <div id=\"sentence\" class=\"title\">Say something out loud!</div>\n    <span id=\"record-progress\" class=\"progress small\"></span>\n    <button id=\"recordButton\" class=\"active\" type=\"button\">\n      Record\n    </button>\n    <button id=\"playButton\" type=\"button\">Play</button>\n    <button id=\"uploadButton\" type=\"button\">Submit</button>\n    <input id=\"excerpt\" type=\"hidden\" name=\"excerpt\" value=\"\">\n    <div id=\"elapsedtime\">00.0s</div>\n    <div id=\"divlevels\">\n      <canvas id=\"levels\" width=100 height=100></canvas>\n      <canvas id=\"radialLevels\" width=100 height=100></canvas>\n      <canvas id=\"spectrogram\" width=100 height=100></canvas>\n    </div>\n    <span id=\"upload-progress\" class=\"progress small\"></span>\n    <input id=\"sensitivity\" style=\"display: none\"\n                            type=\"range\" min=\"1\" max=\"200\"></input>\n    <audio id=\"player\" controls=\"controls\" class=\"disabled\"></audio>\n  </div>";
            document.getElementById('content').innerHTML = content;
            setMessage('Loading...');
            var query = getQuery();
            // Fetch sentence from our server api.
            var api = new api_2.default();
            api.getSentence().then(function (sentence) {
                currentSentence = sentence;
                $('#sentence').textContent = '"' + currentSentence + '"';
                $('#excerpt').value = currentSentence;
                setMessage('record');
            });
        }
        // Use getUserMedia() to get access to the user's microphone.
        // This can fail because the browser does not support it, or
        // because the user does not give permission.
        function getMicrophone() {
            return new Promise(function (res, reject) {
                function resolve(stream) {
                    microphone = stream;
                    res(stream);
                }
                // Reject the promise with a 'permission denied' error code
                function deny() { reject(ERR_NO_MIC); }
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ audio: true }).then(resolve, deny);
                }
                else if (navigator.getUserMedia) {
                    navigator.getUserMedia({ audio: true }, resolve, deny);
                }
                else if (navigator.webkitGetUserMedia) {
                    navigator.webkitGetUserMedia({ audio: true }, resolve, deny);
                }
                else if (navigator.mozGetUserMedia) {
                    navigator.mozGetUserMedia({ audio: true }, resolve, deny);
                }
                else {
                    reject(ERR_PLATFORM); // Browser does not support getUserMedia
                }
            });
        }
        // If anything goes wrong in the app startup sequence, this function
        // is called to tell the user what went wrong
        function displayErrorMessage(error) {
            console.error(error);
            $('#record-progress').className = '';
            $('#upload-progress').className = '';
            var recordScreen = document.querySelector('#record-screen');
            recordScreen.classList.add('disabled');
            recordScreen.hidden = false;
            setMessage(error);
            document.querySelector('#title').textContent = '';
            if (error === ERR_PLATFORM) {
                // Fatal error. Just show a table of supported browsers
                document.querySelector('#error-reload').hidden = true;
                document.querySelector('#error-supported').hidden = false;
                document.querySelector('#error-screen').hidden = false;
            }
            else {
                // Otherwise, the user can correct the errror. Invite them to reload
                document.querySelector('#error-reload').hidden = false;
                document.querySelector('#error-supported').hidden = true;
                document.querySelector('#error-screen').hidden = false;
            }
        }
        function RecordingScreen(element, microphone) {
            this.element = element;
            this.player = element.querySelector('#player');
            // Build the WebAudio graph we'll be using
            var audioContext = new AudioContext();
            var sourceNode = audioContext.createMediaStreamSource(microphone);
            var volumeNode = audioContext.createGain();
            var analyzerNode = audioContext.createAnalyser();
            var outputNode = audioContext.createMediaStreamDestination();
            // make sure we're doing mono everywhere
            sourceNode.channelCount = 1;
            volumeNode.channelCount = 1;
            analyzerNode.channelCount = 1;
            outputNode.channelCount = 1;
            // connect the nodes together
            sourceNode.connect(volumeNode);
            volumeNode.connect(analyzerNode);
            analyzerNode.connect(outputNode);
            // and set up the recorder
            var recorder = new MediaRecorder(outputNode.stream);
            var chunks = [];
            // Set up the analyzer node, and allocate an array for its data
            // FFT size 64 gives us 32 bins. But those bins hold frequencies up to
            // 22kHz or more, and we only care about visualizing lower frequencies
            // which is where most human voice lies, so we use fewer bins
            analyzerNode.fftSize = 128;
            // Another audio node used by the beep() function
            var beeperVolume = audioContext.createGain();
            beeperVolume.connect(audioContext.destination);
            // This canvas object displays the audio levels for the incoming signal
            var levels = element.querySelector('#levels');
            var radialLevels = element.querySelector('#radialLevels');
            var spectrogram = element.querySelector('#spectrogram');
            var recording = false; // Are we currently recording?
            var lastSoundTime; // When was the last time we heard a sound?
            var recordButton = element.querySelector('#recordButton');
            var playButton = element.querySelector('#playButton');
            var uploadButton = element.querySelector('#uploadButton');
            var canuploadandplay = false;
            var playing = false;
            // How much we amplify the signal from the microphone.
            // If we've got a saved value, use that.
            var microphoneGain = parseFloat(localStorage.microphoneGain);
            // CLOCK!
            var timeBegan = null;
            var timeStopped = null;
            var stoppedDuration = 0;
            var started = null;
            function clockreset() {
                clearInterval(started);
                stoppedDuration = 0;
                timeBegan = null;
                timeStopped = null;
                document.getElementById("elapsedtime").innerHTML = "00.0s";
            }
            function clockRunning() {
                var currentTime = new Date();
                var timeElapsed = new Date(+currentTime - timeBegan - stoppedDuration);
                /*
              var hour = timeElapsed.getUTCHours();
              var min = timeElapsed.getUTCMinutes();
              */
                var sec = timeElapsed.getUTCSeconds();
                var ms = Math.round(timeElapsed.getUTCMilliseconds() / 100);
                document.getElementById("elapsedtime").innerHTML =
                    (sec > 9 ? sec : "0" + sec) + "." + ms + 's';
            }
            function clockstart() {
                clockreset();
                if (timeBegan === null) {
                    timeBegan = new Date();
                }
                if (timeStopped !== null) {
                    stoppedDuration += (+new Date() - timeStopped);
                }
                started = setInterval(clockRunning, 100);
            }
            function clockstop() {
                timeStopped = new Date();
                clearInterval(started);
            }
            // After REPLAY_TIMEOUT, replay the recorded clip.
            this.player.addEventListener('canplaythrough', function () {
                this.player.className = ''; // Remove disabled.
                setTimeout(function () {
                    this.player.play();
                }.bind(this), REPLAY_TIMEOUT);
            }.bind(this));
            this.player.addEventListener('play', function () {
                playing = true;
            }.bind(this));
            // After player ended, make sure to enable submission (again).
            this.player.addEventListener('ended', function () {
                playing = false;
                $('#recordButton').textContent = 'Record';
                $('#uploadButton').classList.add('active');
            }.bind(this));
            // A RecordingScreen object has methods for hiding and showing.
            // Everything else is private inside this constructor
            this.show = function () {
                clockreset();
                this.element.hidden = false;
            }.bind(this);
            this.play = function (recording) {
                this.recording = recording;
                this.player.src = URL.createObjectURL(recording);
            }.bind(this);
            recorder.ondataavailable = function (e) {
                chunks.push(e.data);
            };
            recorder.onstop = function () {
                recordButton.className = '';
                var blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                element.dispatchEvent(new CustomEvent('record', {
                    detail: blob
                }));
                chunks = [];
            };
            // If no saved value, start with a reasonable default
            // See PlaybackScreen for the code that allows the user to change this
            if (!microphoneGain) {
                // Need to turn the sensitivity way up on Android
                if (navigator.userAgent.indexOf('ndroid') !== -1) {
                    microphoneGain = 5;
                }
                else {
                    microphoneGain = 2;
                }
                localStorage.microphoneGain = microphoneGain;
            }
            var sensitivity = element.querySelector('#sensitivity');
            sensitivity.onchange = function () {
                microphoneGain = parseFloat(this.value) / 10;
                volumeNode.gain.value = microphoneGain;
                localStorage.microphoneGain = microphoneGain;
            }.bind(this);
            sensitivity.value = microphoneGain * 10;
            volumeNode.gain.value = microphoneGain;
            function startRecording() {
                // I wanted to do a beep to indicate the start of recording
                // But it was too hard to not record the end of the beep,
                // particularly on Chrome.
                if (!recording) {
                    clockstart();
                    recording = true;
                    lastSoundTime = audioContext.currentTime;
                    // We want to be able to record up to 60s of audio in a single blob.
                    // Without this argument to start(), Chrome will call dataavailable
                    // very frequently.
                    recorder.start(20000);
                    recordButton.textContent = 'Stop';
                    $('#player').className = 'disabled';
                    $('#record-progress').className = 'progress small active';
                    document.querySelector('#uploadButton').classList.remove('active');
                    document.body.className = 'recording';
                }
            }
            function stopRecording() {
                if (recording) {
                    canuploadandplay = true;
                    clockstop();
                    recording = false;
                    document.body.className = '';
                    recordButton.className = 'disabled'; // disabled 'till after the beep
                    $('#record-progress').className = 'progress small';
                    empty(recordButton);
                    recordButton.textContent = 'Playing';
                    recorder.stop();
                }
            }
            // function visualize() {
            //   // Clear the canvas
            //   var context = levels.getContext('2d');
            //   context.clearRect(0, 0, levels.width, levels.height);
            //   // Get the FFT data
            //   analyzerNode.getFloatFrequencyData(frequencyBins);
            //   // Display it as a barchart.
            //   // Drop bottom few bins, since they are often misleadingly high
            //   var skip = 2;
            //   var n = frequencyBins.length - skip;
            //   var barwidth = levels.width/n;
            //   var maxValue = MIN_DB_LEVEL;
            //   var dbRange = (MAX_DB_LEVEL - MIN_DB_LEVEL);
            //   // Loop through the values and draw the bars
            //   // while we're at it, find the maximum value
            //   rightside = !rightside;
            //   for(var i = 0; i < n; i++) {
            //     var value = frequencyBins[i+skip];
            //     if (value > maxValue) {
            //       maxValue = value;
            //     }
            //     var ratio = (value - MIN_DB_LEVEL) / dbRange;
            //     var height = levels.height * ratio;
            //     if (height < 0) {
            //       continue;
            //     }
            //     // calculate height
            //     var total;
            //     var inverso;
            //     total = levels.height - height - 50;
            //     inverso = total + height;
            //     // here other side
            //     var x_bar = i * barwidth;
            //     var fillStyle = 'black';
            //     if (recording) {
            //       var r = Math.round(100 + (ratio) * 255 * 2.5);
            //       var g = 24;
            //       var b = 24;
            //       fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
            //     }
            //     context.fillStyle = fillStyle;
            //     context.fillRect(x_bar, total,
            //       barwidth, height);
            //     context.fillStyle = 'white';
            //     context.fillRect(x_bar+25, total,
            //       barwidth, height);
            //     context.fillStyle = fillStyle;
            //     context.fillRect(x_bar, inverso,
            //       barwidth, height);
            //     context.fillStyle = 'white';
            //     context.fillRect(x_bar+25, inverso,
            //       barwidth, height+20);
            //   }
            //   // If we are currently recording, then test to see if the user has
            //   // been silent for long enough that we should stop recording
            //   if (recording) {
            //     var now = audioContext.currentTime;
            //     if (maxValue < SILENCE_THRESHOLD) {
            //       if (now - lastSoundTime > SILENCE_DURATION) {
            //         stopRecording();
            //       }
            //     }
            //     else {
            //       lastSoundTime = now;
            //     }
            //   }
            //   // Update visualization faster when recording.
            //   /*
            // if (recording) {
            //   requestAnimationFrame(visualize);
            // } else {
            //   setTimeout(visualize, 70)
            // }
            // */
            //   setTimeout(visualize, 50);
            // }
            var visualizer = new viz_2.LinearAnalyzerNodeView(analyzerNode, levels, 384, 300);
            var radialVisualizer = new viz_2.RadialAnalyzerNodeView(analyzerNode, radialLevels, 300, 300);
            var spectrogramVisualizer = new viz_2.SpectogramAnalyzerNodeView(analyzerNode, spectrogram, 500, 300);
            // The button responds to clicks to start and stop recording
            recordButton.addEventListener('click', function () {
                // Don't respond if we're disabled
                if (playing || recordButton.className === 'disabled') {
                    return;
                }
                if (recording) {
                    stopRecording();
                }
                else {
                    startRecording();
                }
            });
            uploadButton.addEventListener('click', function () {
                if (!canuploadandplay) {
                    setMessage(ERR_NO_RECORDING);
                    return;
                }
                else if (playing) {
                    setMessage(ERR_NO_PLAYBACK);
                    return;
                }
                $('#upload-progress').className = 'progress small active';
                element.dispatchEvent(new CustomEvent('upload', { detail: this.recording }));
            }.bind(this));
            playButton.addEventListener('click', function () {
                if (!canuploadandplay) {
                    return;
                }
                this.player.play();
            }.bind(this));
        }
        // Once the async initialization is complete, this is where the
        // program really starts. It initializes the recording and playback
        // screens, and sets up event handlers to switch back and forth between
        // those screens until the user gets tired of making recordings.
        function initializeAndRun() {
            var m = $('#message');
            m.className = 'panel disabled';
            document.querySelector('#record-screen').classList.remove('disabled');
            // Get the DOM elements for the recording and playback screens
            var recordingScreenElement = document.querySelector('#record-screen');
            // Create objects that encapsulate their functionality
            // Then set up event handlers to coordinate the two screens
            var recordingScreen = new RecordingScreen(recordingScreenElement, microphone);
            // Upload a recording using the fetch API to do an HTTP POST
            function upload(recording) {
                if (!recording.type) {
                    // Chrome doesn't give the blob a type
                    recording = new Blob([recording], { type: 'audio/webm;codecs=opus' });
                }
                return new Promise(function (resolve, reject) {
                    var query = getQuery();
                    var req = new XMLHttpRequest();
                    req.upload.addEventListener('load', resolve);
                    req.open('POST', SOUNDCLIP_URL);
                    req.setRequestHeader('uid', getUserId());
                    req.setRequestHeader('sentence', encodeURIComponent(currentSentence));
                    req.send(recording);
                });
            }
            // When a recording is complete, pass it to the playback screen
            recordingScreenElement.addEventListener('record', function (event) {
                recordingScreen.play(event.detail);
            });
            // If the user clicks 'Upload' on the playback screen, do the upload
            // and submit the form.
            recordingScreenElement.addEventListener('upload', function (event) {
                upload(event.detail).then(function () {
                    setMessage('FUCK YEAH!');
                }).catch(function (e) {
                    console.error('upload error', e);
                    displayErrorMessage(ERR_UPLOAD_FAILED);
                });
            });
            // Finally, start the app by showing the recording screen
            $('#title').textContent = 'Say the following out loud:';
            recordingScreen.show();
        }
        // The RecordingScreen object has show() and hide() methods and fires
        // a 'record' event on its DOM element when a recording has been made.
        checkPlatformSupport()
            .then(setupPage)
            .then(getMicrophone)
            .then(initializeAndRun)
            .catch(displayErrorMessage);
    }
    exports.default = start;
});
define("pages", ["require", "exports", "pages/record"], function (require, exports, record_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Pages = (function () {
        function Pages() {
            this.record = record_2.default;
        }
        return Pages;
    }());
    exports.default = Pages;
});
define("pages/page", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Page = (function () {
        function Page() {
        }
        return Page;
    }());
    exports.default = Page;
});
