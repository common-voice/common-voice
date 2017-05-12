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
define("app", ["require", "exports", "api"], function (require, exports, api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        /**
         * App will handle routing to page controllers.
         */
        function App(container) {
            this.container = container;
            this.api = new api_1.default();
        }
        /**
         * Entry point for the application.
         */
        App.prototype.run = function () {
            var _this = this;
            this.container.innerHTML = 'Loading...';
            this.api.getSentence().then(function (sentence) {
                _this.container.innerHTML = sentence;
            });
        };
        return App;
    }());
    exports.default = App;
});
/// <reference path="./vendor/require.d.ts" />
require(['app'], function (module) {
    var App = module.default;
    var container = document.getElementById('content');
    var app = new App(container);
    app.run();
});
define("viz", ["require", "exports"], function (require, exports) {
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
    var AnalyzerNodeView = (function (_super) {
        __extends(AnalyzerNodeView, _super);
        function AnalyzerNodeView(analyzerNode, canvas, width, height) {
            var _this = _super.call(this, canvas, width, height) || this;
            _this.frequency = new FrequencyBins(analyzerNode);
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
            var binCount = this.frequency.bins.length;
            ctx.translate(this.width / 2, this.height / 2);
            var angle = Math.PI * 2 / binCount;
            var innerRadius = 12 * this.ratio;
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
