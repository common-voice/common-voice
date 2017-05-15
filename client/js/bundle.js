var requirejs, require, define;

(function(undef) {
  var main, req, makeMap, handlers, defined = {}, waiting = {}, config = {}, defining = {}, hasOwn = Object.prototype.hasOwnProperty, aps = [].slice, jsSuffixRegExp = /\.js$/;
  function hasProp(obj, prop) {
    return hasOwn.call(obj, prop);
  }
  function normalize(name, baseName) {
    var nameParts, nameSegment, mapValue, foundMap, lastIndex, foundI, foundStarMap, starI, i, j, part, normalizedBaseParts, baseParts = baseName && baseName.split("/"), map = config.map, starMap = map && map["*"] || {};
    if (name) {
      name = name.split("/");
      lastIndex = name.length - 1;
      if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
        name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, "");
      }
      if (name[0].charAt(0) === "." && baseParts) {
        normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
        name = normalizedBaseParts.concat(name);
      }
      for (i = 0; i < name.length; i++) {
        part = name[i];
        if (part === ".") {
          name.splice(i, 1);
          i -= 1;
        } else if (part === "..") {
          if (i === 0 || i === 1 && name[2] === ".." || name[i - 1] === "..") {
            continue;
          } else if (i > 0) {
            name.splice(i - 1, 2);
            i -= 2;
          }
        }
      }
      name = name.join("/");
    }
    if ((baseParts || starMap) && map) {
      nameParts = name.split("/");
      for (i = nameParts.length; i > 0; i -= 1) {
        nameSegment = nameParts.slice(0, i).join("/");
        if (baseParts) {
          for (j = baseParts.length; j > 0; j -= 1) {
            mapValue = map[baseParts.slice(0, j).join("/")];
            if (mapValue) {
              mapValue = mapValue[nameSegment];
              if (mapValue) {
                foundMap = mapValue;
                foundI = i;
                break;
              }
            }
          }
        }
        if (foundMap) {
          break;
        }
        if (!foundStarMap && starMap && starMap[nameSegment]) {
          foundStarMap = starMap[nameSegment];
          starI = i;
        }
      }
      if (!foundMap && foundStarMap) {
        foundMap = foundStarMap;
        foundI = starI;
      }
      if (foundMap) {
        nameParts.splice(0, foundI, foundMap);
        name = nameParts.join("/");
      }
    }
    return name;
  }
  function makeRequire(relName, forceSync) {
    return function() {
      var args = aps.call(arguments, 0);
      if (typeof args[0] !== "string" && args.length === 1) {
        args.push(null);
      }
      return req.apply(undef, args.concat([ relName, forceSync ]));
    };
  }
  function makeNormalize(relName) {
    return function(name) {
      return normalize(name, relName);
    };
  }
  function makeLoad(depName) {
    return function(value) {
      defined[depName] = value;
    };
  }
  function callDep(name) {
    if (hasProp(waiting, name)) {
      var args = waiting[name];
      delete waiting[name];
      defining[name] = true;
      main.apply(undef, args);
    }
    if (!hasProp(defined, name) && !hasProp(defining, name)) {
      throw new Error("No " + name);
    }
    return defined[name];
  }
  function splitPrefix(name) {
    var prefix, index = name ? name.indexOf("!") : -1;
    if (index > -1) {
      prefix = name.substring(0, index);
      name = name.substring(index + 1, name.length);
    }
    return [ prefix, name ];
  }
  function makeRelParts(relName) {
    return relName ? splitPrefix(relName) : [];
  }
  makeMap = function(name, relParts) {
    var plugin, parts = splitPrefix(name), prefix = parts[0], relResourceName = relParts[1];
    name = parts[1];
    if (prefix) {
      prefix = normalize(prefix, relResourceName);
      plugin = callDep(prefix);
    }
    if (prefix) {
      if (plugin && plugin.normalize) {
        name = plugin.normalize(name, makeNormalize(relResourceName));
      } else {
        name = normalize(name, relResourceName);
      }
    } else {
      name = normalize(name, relResourceName);
      parts = splitPrefix(name);
      prefix = parts[0];
      name = parts[1];
      if (prefix) {
        plugin = callDep(prefix);
      }
    }
    return {
      f: prefix ? prefix + "!" + name : name,
      n: name,
      pr: prefix,
      p: plugin
    };
  };
  function makeConfig(name) {
    return function() {
      return config && config.config && config.config[name] || {};
    };
  }
  handlers = {
    require: function(name) {
      return makeRequire(name);
    },
    exports: function(name) {
      var e = defined[name];
      if (typeof e !== "undefined") {
        return e;
      } else {
        return defined[name] = {};
      }
    },
    module: function(name) {
      return {
        id: name,
        uri: "",
        exports: defined[name],
        config: makeConfig(name)
      };
    }
  };
  main = function(name, deps, callback, relName) {
    var cjsModule, depName, ret, map, i, relParts, args = [], callbackType = typeof callback, usingExports;
    relName = relName || name;
    relParts = makeRelParts(relName);
    if (callbackType === "undefined" || callbackType === "function") {
      deps = !deps.length && callback.length ? [ "require", "exports", "module" ] : deps;
      for (i = 0; i < deps.length; i += 1) {
        map = makeMap(deps[i], relParts);
        depName = map.f;
        if (depName === "require") {
          args[i] = handlers.require(name);
        } else if (depName === "exports") {
          args[i] = handlers.exports(name);
          usingExports = true;
        } else if (depName === "module") {
          cjsModule = args[i] = handlers.module(name);
        } else if (hasProp(defined, depName) || hasProp(waiting, depName) || hasProp(defining, depName)) {
          args[i] = callDep(depName);
        } else if (map.p) {
          map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
          args[i] = defined[depName];
        } else {
          throw new Error(name + " missing " + depName);
        }
      }
      ret = callback ? callback.apply(defined[name], args) : undefined;
      if (name) {
        if (cjsModule && cjsModule.exports !== undef && cjsModule.exports !== defined[name]) {
          defined[name] = cjsModule.exports;
        } else if (ret !== undef || !usingExports) {
          defined[name] = ret;
        }
      }
    } else if (name) {
      defined[name] = callback;
    }
  };
  requirejs = require = req = function(deps, callback, relName, forceSync, alt) {
    if (typeof deps === "string") {
      if (handlers[deps]) {
        return handlers[deps](callback);
      }
      return callDep(makeMap(deps, makeRelParts(callback)).f);
    } else if (!deps.splice) {
      config = deps;
      if (config.deps) {
        req(config.deps, config.callback);
      }
      if (!callback) {
        return;
      }
      if (callback.splice) {
        deps = callback;
        callback = relName;
        relName = null;
      } else {
        deps = undef;
      }
    }
    callback = callback || function() {};
    if (typeof relName === "function") {
      relName = forceSync;
      forceSync = alt;
    }
    if (forceSync) {
      main(undef, deps, callback, relName);
    } else {
      setTimeout(function() {
        main(undef, deps, callback, relName);
      }, 4);
    }
    return req;
  };
  req.config = function(cfg) {
    return req(cfg);
  };
  requirejs._defined = defined;
  define = function(name, deps, callback) {
    if (typeof name !== "string") {
      throw new Error("See almond README: incorrect module build, no module name");
    }
    if (!deps.splice) {
      callback = deps;
      deps = [];
    }
    if (!hasProp(defined, name) && !hasProp(waiting, name)) {
      waiting[name] = [ name, deps, callback ];
    }
  };
  define.amd = {
    jQuery: true
  };
})();

var __extends = this && this.__extends || function() {
  var extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(d, b) {
    d.__proto__ = b;
  } || function(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };
  return function(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

define("error-msg", [ "require", "exports" ], function(require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var ERROR_MSG = function() {
    function ERROR_MSG() {}
    return ERROR_MSG;
  }();
  ERROR_MSG.ERR_NO_RECORDING = "Please record first.";
  ERROR_MSG.ERR_NO_PLAYBACK = "Please listen before submitting.";
  ERROR_MSG.ERR_PLATFORM = "Your browser does not support audio recording.";
  ERROR_MSG.ERR_NO_CONSENT = 'You did not consent to recording. You must click the "I Agree" button in order to use this website.';
  ERROR_MSG.ERR_NO_MIC = "You did not allow this website to use the microphone. The website needs the microphone to record your voice.";
  ERROR_MSG.ERR_UPLOAD_FAILED = "Uploading your recording to the server failed. This may be a temporary problem. Please try again.";
  ERROR_MSG.ERR_DATA_FAILED = "Submitting your profile data failed. This may be a temporary problem. Please try again.";
  exports.default = ERROR_MSG;
});

document.addEventListener("DOMContentLoaded", function() {
  var App = require("./lib/app").default;
  var app = new App();
  app.run();
});

define("lib/api", [ "require", "exports" ], function(require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var DEFAULT_BASE = "./api/";
  var API = function() {
    function API() {}
    API.prototype.request = function(resource) {
      return fetch(DEFAULT_BASE + resource).then(function(response) {
        return response.text();
      });
    };
    API.prototype.getSentence = function() {
      return this.request("sentence");
    };
    return API;
  }();
  exports.default = API;
});

define("lib/eventer", [ "require", "exports" ], function(require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Eventer = function() {
    function Eventer() {}
    Eventer.prototype.on = function(type, cb) {
      this["_on" + type] = this["_on" + type] || [];
      this["_on" + type].push(cb);
    };
    Eventer.prototype.trigger = function(type, value) {
      if (this["_on" + type]) {
        this["_on" + type].forEach(function(cb) {
          cb(value);
        });
      }
    };
    return Eventer;
  }();
  exports.default = Eventer;
});

define("lib/component", [ "require", "exports", "lib/eventer" ], function(require, exports, eventer_1) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = function(_super) {
    __extends(Component, _super);
    function Component() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.state = Object.create(null);
      return _this;
    }
    Component.prototype.setState = function(state) {
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
    Component.prototype.forceUpdate = function() {
      var _this = this;
      if (this.updateTimeout) {
        return;
      }
      this.updateTimeout = setTimeout(function() {
        _this.update();
        _this.updateTimeout = 0;
      });
    };
    Component.prototype.update = function() {};
    return Component;
  }(eventer_1.default);
  exports.default = Component;
});

define("lib/utility", [ "require", "exports" ], function(require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  function assert(c, message) {
    if (message === void 0) {
      message = "";
    }
    if (!c) {
      throw new Error(message);
    }
  }
  exports.assert = assert;
  function generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  }
  exports.generateGUID = generateGUID;
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  exports.capitalizeFirstLetter = capitalizeFirstLetter;
  function jsifyLink(link, handler) {
    link.addEventListener("click", function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      handler(link.href);
    }, true);
  }
  exports.jsifyLink = jsifyLink;
});

define("lib/user", [ "require", "exports", "lib/component", "lib/utility" ], function(require, exports, component_1, utility_1) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var USER_KEY = "__userid";
  var User = function(_super) {
    __extends(User, _super);
    function User() {
      var _this = _super.call(this) || this;
      _this.state = _this.restore();
      return _this;
    }
    User.prototype.restore = function() {
      var state = localStorage[USER_KEY];
      if (!state) {
        state = {
          userId: utility_1.generateGUID(),
          clips: 0
        };
        localStorage[USER_KEY] = state;
      }
      return state;
    };
    User.prototype.store = function() {
      localStorage[USER_KEY] = this.state;
    };
    User.prototype.getId = function() {
      return this.state.userId;
    };
    return User;
  }(component_1.default);
  exports.default = User;
});

define("lib/pages/page", [ "require", "exports", "lib/component", "lib/utility" ], function(require, exports, component_2, utility_2) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Page = function(_super) {
    __extends(Page, _super);
    function Page(user, name, noNav) {
      var _this = _super.call(this) || this;
      _this.user = user;
      _this.noNav = noNav;
      _this.container = document.getElementById("content");
      _this.content = document.createElement("div");
      if (!noNav) {
        _this.nav = document.createElement("a");
        _this.nav.className = "tab";
        _this.nav.href = "/" + name;
        _this.nav.textContent = utility_2.capitalizeFirstLetter(name);
        document.querySelector("#main-nav").appendChild(_this.nav);
        utility_2.jsifyLink(_this.nav, _this.trigger.bind(_this, "nav"));
      }
      return _this;
    }
    Page.prototype.init = function(navHandler) {
      this.on("nav", navHandler);
      return null;
    };
    Page.prototype.show = function() {
      if (!this.noNav) {
        this.nav.classList.add("active");
      }
      this.content.classList.add("active");
      if (!this.content.parentNode) {
        this.container.appendChild(this.content);
      }
    };
    Page.prototype.hide = function() {
      if (!this.noNav) {
        this.nav.classList.remove("active");
      }
      this.content.classList.remove("active");
    };
    return Page;
  }(component_2.default);
  exports.default = Page;
});

define("lib/pages/record/audio", [ "require", "exports", "error-msg" ], function(require, exports, error_msg_1) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Audio = function() {
    function Audio(microphone) {
      this.chunks = [];
      var audioContext = new AudioContext();
      var sourceNode = audioContext.createMediaStreamSource(microphone);
      var volumeNode = audioContext.createGain();
      var analyzerNode = audioContext.createAnalyser();
      var outputNode = audioContext.createMediaStreamDestination();
      sourceNode.channelCount = 1;
      volumeNode.channelCount = 1;
      analyzerNode.channelCount = 1;
      outputNode.channelCount = 1;
      sourceNode.connect(volumeNode);
      volumeNode.connect(analyzerNode);
      analyzerNode.connect(outputNode);
      this.recorder = new MediaRecorder(outputNode.stream);
      analyzerNode.fftSize = 128;
      var beeperVolume = audioContext.createGain();
      beeperVolume.connect(audioContext.destination);
      this.analyzerNode = analyzerNode;
      this.audioContext = audioContext;
    }
    Audio.prototype.start = function() {
      var _this = this;
      this.recorder.ondataavailable = function(e) {
        console.log("Recording ...");
        _this.chunks.push(e.data);
      };
      this.recorder.start(2e4);
    };
    Audio.prototype.stop = function() {
      var self = this;
      return new Promise(function(res, reject) {
        self.recorder.onstop = function(e) {
          console.log("Recorder Stopped");
          var blob = new Blob(self.chunks, {
            type: "audio/ogg; codecs=opus"
          });
          self.chunks = [];
          self.lastRecording = blob;
          res(blob);
        };
        self.recorder.stop();
      });
    };
    Audio.getMicrophone = function() {
      return new Promise(function(res, reject) {
        function resolve(stream) {
          res(stream);
        }
        function deny() {
          reject(error_msg_1.default.ERR_NO_MIC);
        }
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({
            audio: true
          }).then(resolve, deny);
        } else if (navigator.getUserMedia) {
          navigator.getUserMedia({
            audio: true
          }, resolve, deny);
        } else if (navigator.webkitGetUserMedia) {
          navigator.webkitGetUserMedia({
            audio: true
          }, resolve, deny);
        } else if (navigator.mozGetUserMedia) {
          navigator.mozGetUserMedia({
            audio: true
          }, resolve, deny);
        } else {
          reject(error_msg_1.default.ERR_PLATFORM);
        }
      });
    };
    return Audio;
  }();
  exports.default = Audio;
});

define("lib/dsp", [ "require", "exports" ], function(require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var FrequencyBins = function() {
    function FrequencyBins(analyzerNode, skip) {
      if (skip === void 0) {
        skip = 2;
      }
      this.analyzerNode = analyzerNode;
      this.skip = skip;
      var binCount = this.analyzerNode.frequencyBinCount;
      this.temp = new Float32Array(binCount);
      this.bins = new Float32Array(binCount - skip);
    }
    FrequencyBins.prototype.update = function() {
      this.analyzerNode.getFloatFrequencyData(this.temp);
      this.bins.set(this.temp.subarray(this.skip));
    };
    return FrequencyBins;
  }();
  exports.FrequencyBins = FrequencyBins;
});

define("lib/viz", [ "require", "exports", "lib/dsp" ], function(require, exports, dsp_1) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var MIN_DB_LEVEL = -85;
  var MAX_DB_LEVEL = -30;
  var DB_LEVEL_RANGE = MAX_DB_LEVEL - MIN_DB_LEVEL;
  exports.HEAT_COLORS = [];
  function generateHeatColors() {
    function color(value) {
      var h = (1 - value) * 240;
      return "hsl(" + h + ", 100%, 50%)";
    }
    for (var i = 0; i < 256; i++) {
      exports.HEAT_COLORS.push(color(i / 256));
    }
  }
  generateHeatColors();
  function clamp(v, a, b) {
    if (v < a) v = a;
    if (v > b) v = b;
    return v;
  }
  exports.clamp = clamp;
  var darkScale = chroma.scale("Spectral").domain([ 1, 0 ]);
  exports.DarkTheme = {
    backgroundColor: "#212121",
    scale: function(value) {
      return darkScale(value);
    }
  };
  var lightScale = chroma.scale("Set1");
  exports.LightTheme = {
    backgroundColor: "#F5F5F5",
    scale: function(value) {
      return lightScale(value);
    }
  };
  var hotScale = chroma.scale({
    colors: [ "#000000", "#ff0000", "#ffff00", "#ffffff" ],
    positions: [ 0, .25, .75, 1 ],
    mode: "rgb",
    limits: [ 0, 300 ]
  });
  var hotScale = chroma.scale([ "#000000", "#ff0000", "#ffff00", "#ffffff" ]);
  var CanvasView = function() {
    function CanvasView(canvas, width, height) {
      this.canvas = canvas;
      this.width = width;
      this.height = height;
      this.theme = exports.DarkTheme;
      this.reset();
    }
    CanvasView.prototype.reset = function() {
      this.ratio = window.devicePixelRatio || 1;
      this.canvas.width = this.width * this.ratio;
      this.canvas.height = this.height * this.ratio;
      this.canvas.style.width = this.width + "px";
      this.canvas.style.height = this.height + "px";
      this.ctx = this.canvas.getContext("2d");
    };
    CanvasView.prototype.start = function() {
      var self = this;
      function tick() {
        self.update();
        self.render();
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };
    CanvasView.prototype.update = function() {};
    CanvasView.prototype.render = function() {};
    return CanvasView;
  }();
  var AnalyzerNodeView = function(_super) {
    __extends(AnalyzerNodeView, _super);
    function AnalyzerNodeView(analyzerNode, canvas, width, height) {
      var _this = _super.call(this, canvas, width, height) || this;
      _this.isRecording = false;
      _this.frequency = new dsp_1.FrequencyBins(analyzerNode);
      return _this;
    }
    return AnalyzerNodeView;
  }(CanvasView);
  exports.AnalyzerNodeView = AnalyzerNodeView;
  var LinearAnalyzerNodeView = function(_super) {
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
    LinearAnalyzerNodeView.prototype.update = function() {
      this.frequency.update();
    };
    LinearAnalyzerNodeView.prototype.render = function() {
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
        for (var j = 0; j < ticks; j++) {
          ctx.globalAlpha = 1;
          ctx.fillRect(i * this.binTotalWidth, this.height / 2 - j * this.tickTotalHeight, this.binWidth, this.tickHeight);
          ctx.globalAlpha = .5;
          ctx.fillRect(i * this.binTotalWidth, this.height / 2 + j * this.tickTotalHeight, this.binWidth, this.tickHeight);
        }
        ctx.globalAlpha = .3;
        ctx.fillRect(i * this.binTotalWidth, this.height / 2, this.binWidth, this.tickHeight);
      }
      ctx.restore();
    };
    return LinearAnalyzerNodeView;
  }(AnalyzerNodeView);
  exports.LinearAnalyzerNodeView = LinearAnalyzerNodeView;
  var SpectogramAnalyzerNodeView = function(_super) {
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
    SpectogramAnalyzerNodeView.prototype.reset = function() {
      _super.prototype.reset.call(this);
      this.tmpCanvas = document.createElement("canvas");
      this.tmpCanvas.width = this.canvas.width;
      this.tmpCanvas.height = this.canvas.height;
      this.tmpCtx = this.tmpCanvas.getContext("2d");
    };
    SpectogramAnalyzerNodeView.prototype.update = function() {
      this.frequency.update();
    };
    SpectogramAnalyzerNodeView.prototype.render = function() {
      var ctx = this.ctx;
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
  }(AnalyzerNodeView);
  exports.SpectogramAnalyzerNodeView = SpectogramAnalyzerNodeView;
  var RadialAnalyzerNodeView = function(_super) {
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
    RadialAnalyzerNodeView.prototype.update = function() {
      this.frequency.update();
    };
    RadialAnalyzerNodeView.prototype.render = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.scale(this.ratio, this.ratio);
      ctx.fillStyle = this.theme.backgroundColor;
      ctx.fillRect(0, 0, this.width, this.height);
      var innerRadius = 12 * this.ratio;
      if (this.isRecording) {
        ctx.beginPath();
        var animation = Math.abs(Math.sin(performance.now() / 1e3));
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
        var ticks = Math.min(this.width, this.height) / 2 * value / this.tickTotalHeight | 0;
        ctx.fillStyle = this.theme.scale(i / binCount);
        ctx.globalAlpha = 1;
        for (var j = 0; j < ticks; j++) {
          var r = innerRadius + j * this.tickTotalHeight;
          var t_1 = Math.max(2 * r * Math.sin(angle / 2) - this.tickVPadding | 0, 1);
          ctx.fillRect(innerRadius + j * this.tickTotalHeight, -t_1 / 2, this.tickHeight, t_1);
        }
        ctx.globalAlpha = .3;
        var t = Math.max(2 * innerRadius * Math.sin(angle / 2) - this.tickVPadding | 0, 1);
        ctx.fillRect(innerRadius, -t / 2, this.tickHeight, t);
      }
      ctx.restore();
    };
    return RadialAnalyzerNodeView;
  }(AnalyzerNodeView);
  exports.RadialAnalyzerNodeView = RadialAnalyzerNodeView;
});

define("lib/pages/record", [ "require", "exports", "lib/pages/page", "lib/api", "lib/pages/record/audio", "error-msg", "lib/utility", "lib/viz" ], function(require, exports, page_1, api_1, audio_1, error_msg_2, utility_3, viz_1) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var REPLAY_TIMEOUT = 200;
  var SOUNDCLIP_URL = "/upload/";
  var PAGE_NAME = "record";
  var RecordPage = function(_super) {
    __extends(RecordPage, _super);
    function RecordPage(user) {
      var _this = _super.call(this, user, PAGE_NAME) || this;
      _this.name = PAGE_NAME;
      _this.recordingInterval = 0;
      _this.state = {
        sentence: "",
        message: "",
        recording: false,
        playing: false,
        recordingStartTime: 0
      };
      _this.api = new api_1.default();
      return _this;
    }
    RecordPage.prototype.mount = function() {
      this.content.innerHTML = '\n    <p id="message" class="panel"></p>\n    <div id="record-screen" class="screen disabled">\n      <div id="error-screen" class="screen panel" hidden>\n        <div class="panel-head">Error</div>\n        <div class="panel-content">\n          <p class="title" id="error-message"></p>\n          <h2 hidden id="error-reload">\n            Reload the page to try again\n          </h2>\n          <p id="error-supported">\n            Please check your browser\'s compatibility:\n            <table>\n              <tr><th>Platform<th>Browser</tr>\n              <tr><td>Desktop<td>Firefox, Chrome supported</tr>\n              <tr><td>Android<td>Firefox supported</tr>\n              <tr><td>iPhone, iPad<td><b>Not supported</b></tr>\n            </table>\n          </p>\n        </div>\n      </div>\n\n      <div id="sentence" class="title">Say something out loud!</div>\n      <span id="record-progress" class="progress small"></span>\n      <div id="toolbar">\n        <button id="recordButton" class="active" type="button">Record</button>\n        <button id="playButton" type="button">Play</button>\n        <button id="uploadButton" type="button">Submit</button>\n        <button id="nextButton" type="button">Next</button>\n      </div>\n      <input id="excerpt" type="hidden" name="excerpt" value="">\n      <div id="elapsedTime"></div>\n      <div id="viz">\n        <canvas id="radialLevels" width=100 height=100></canvas>\n      </div>\n      <span id="upload-progress" class="progress small"></span>\n      <input id="sensitivity" style="display: none"\n                              type="range" min="1" max="200"></input>\n      <audio id="player" controls="controls" class="disabled"></audio>\n    </div>';
      var $ = this.content.querySelector.bind(this.content);
      this.messageEl = $("#message");
      this.sentenceEl = $("#sentence");
      var el = $("#record-screen");
      this.recordButtonEl = el.querySelector("#recordButton");
      this.playButtonEl = el.querySelector("#playButton");
      this.uploadButtonEl = el.querySelector("#uploadButton");
      this.nextButtonEl = el.querySelector("#nextButton");
      this.elapsedTimeEl = el.querySelector("#elapsedTime");
      this.playerEl = el.querySelector("#player");
      this.playerEl.addEventListener("canplaythrough", this.onCanPlayThrough.bind(this));
      this.playerEl.addEventListener("play", this.onPlay.bind(this));
      this.playerEl.addEventListener("ended", this.onPlayEnded.bind(this));
      this.recordButtonEl.addEventListener("click", this.onRecordClick.bind(this));
      this.uploadButtonEl.addEventListener("click", this.onUploadClick.bind(this));
      this.playButtonEl.addEventListener("click", this.onPlayClick.bind(this));
      this.nextButtonEl.addEventListener("click", this.onNextClick.bind(this));
    };
    RecordPage.prototype.showViz = function() {
      var el = this.content.querySelector("#record-screen");
      var radialLevels = el.querySelector("#radialLevels");
      this.radialVisualizer = new viz_1.RadialAnalyzerNodeView(this.audio.analyzerNode, radialLevels, 300, 300);
    };
    RecordPage.prototype.onRecordClick = function() {
      if (this.state.recording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    };
    RecordPage.prototype.startRecording = function() {
      var _this = this;
      this.setState({
        recording: true,
        recordingStartTime: this.audio.audioContext.currentTime
      });
      this.recordingInterval = setInterval(function() {
        _this.forceUpdate();
      });
      this.audio.start();
    };
    RecordPage.prototype.stopRecording = function() {
      var _this = this;
      this.setState({
        recording: false
      });
      utility_3.assert(this.recordingInterval);
      clearInterval(this.recordingInterval);
      this.recordingInterval = 0;
      this.audio.stop().then(function() {
        _this.forceUpdate();
      });
    };
    RecordPage.prototype.onUploadClick = function() {
      var self = this;
      var upload = new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.upload.addEventListener("load", resolve);
        req.upload.addEventListener("error", reject);
        req.open("POST", SOUNDCLIP_URL);
        req.setRequestHeader("uid", this.user.getId());
        req.setRequestHeader("sentence", encodeURIComponent(self.state.sentence));
        req.send(self.audio.lastRecording);
      });
      upload.then(function() {
        console.log("Uploaded Ok.");
      }).catch(function(e) {
        console.log("Upload Error: " + error_msg_2.default.ERR_UPLOAD_FAILED);
      });
    };
    RecordPage.prototype.onPlayClick = function() {
      this.playerEl.src = URL.createObjectURL(this.audio.lastRecording);
      if (this.state.playing) {
        this.playerEl.pause();
        this.setState({
          playing: false
        });
        return;
      }
      this.playerEl.play();
      this.setState({
        playing: true
      });
    };
    RecordPage.prototype.onPlay = function() {};
    RecordPage.prototype.onCanPlayThrough = function() {};
    RecordPage.prototype.onPlayEnded = function() {
      this.setState({
        playing: false
      });
    };
    RecordPage.prototype.onNextClick = function() {
      this.newSentence();
    };
    RecordPage.prototype.newSentence = function() {
      var _this = this;
      this.setState({
        message: "Fetching Sentence"
      });
      this.api.getSentence().then(function(sentence) {
        _this.setState({
          sentence: sentence
        });
      });
    };
    RecordPage.prototype.update = function() {
      _super.prototype.update.call(this);
      this.sentenceEl.textContent = "" + this.state.sentence;
      this.messageEl.textContent = this.state.message ? "" + this.state.message : "N/A";
      if (!this.microphone) {
        return;
      }
      this.recordButtonEl.textContent = this.state.recording ? "Stop" : "Record";
      this.playButtonEl.textContent = this.state.playing ? "Stop" : "Play";
      this.radialVisualizer.isRecording = this.state.recording;
      if (this.state.recording) {
        var elapsedTime = this.audio.audioContext.currentTime - this.state.recordingStartTime;
      }
      var time = Math.ceil(this.state.sentence.length / 20);
      if (this.state.recording) {
        this.sentenceEl.style.transition = "background-position " + time + "s linear";
      } else {
        this.sentenceEl.style.transition = "none";
      }
      this.sentenceEl.classList.toggle("active", this.state.recording);
      this.recordButtonEl.classList.toggle("disabled", this.state.playing);
      this.playButtonEl.classList.toggle("disabled", this.state.recording || !this.audio.lastRecording);
      this.uploadButtonEl.classList.toggle("disabled", !this.audio.lastRecording || this.state.recording || this.state.playing);
      this.nextButtonEl.classList.toggle("disabled", this.state.recording || this.state.playing);
    };
    RecordPage.prototype.init = function(navHandler) {
      _super.prototype.init.call(this, navHandler);
      this.mount();
    };
    RecordPage.prototype.show = function() {
      var _this = this;
      _super.prototype.show.call(this);
      if (this.microphone) {
        return;
      }
      audio_1.default.getMicrophone().then(function(microphone) {
        _this.microphone = microphone;
        _this.audio = new audio_1.default(microphone);
        _this.showViz();
        _this.newSentence();
      });
    };
    return RecordPage;
  }(page_1.default);
  exports.default = RecordPage;
});

define("lib/pages/home", [ "require", "exports", "lib/pages/page" ], function(require, exports, page_2) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var PAGE_NAME = "home";
  var HomePage = function(_super) {
    __extends(HomePage, _super);
    function HomePage(user) {
      var _this = _super.call(this, user, PAGE_NAME, true) || this;
      _this.name = PAGE_NAME;
      return _this;
    }
    HomePage.prototype.init = function(navHandler) {
      _super.prototype.init.call(this, navHandler);
      this.content.innerHTML = "Welcome to Common Voice";
    };
    return HomePage;
  }(page_2.default);
  exports.default = HomePage;
});

define("lib/pages/not-found", [ "require", "exports", "lib/pages/page" ], function(require, exports, page_3) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var PAGE_NAME = "notFound";
  var NotFoundPage = function(_super) {
    __extends(NotFoundPage, _super);
    function NotFoundPage(user) {
      var _this = _super.call(this, user, PAGE_NAME, true) || this;
      _this.name = PAGE_NAME;
      return _this;
    }
    NotFoundPage.prototype.init = function(navHandler) {
      _super.prototype.init.call(this, navHandler);
      this.content.innerHTML = "Page not found.";
    };
    return NotFoundPage;
  }(page_3.default);
  exports.default = NotFoundPage;
});

define("lib/pages", [ "require", "exports", "lib/eventer", "lib/pages/record", "lib/pages/home", "lib/pages/not-found" ], function(require, exports, eventer_2, record_1, home_1, not_found_1) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Pages = function(_super) {
    __extends(Pages, _super);
    function Pages(user) {
      var _this = _super.call(this) || this;
      _this.user = user;
      _this.pages = Object.keys(Pages.PAGES).map(function(key) {
        return Pages.PAGES[key];
      });
      _this.home = new home_1.default(user);
      _this.record = new record_1.default(user);
      _this.notFound = new not_found_1.default(user);
      return _this;
    }
    Pages.prototype.init = function() {
      var _this = this;
      var navPageHandler = function(page) {
        _this.trigger("nav", page);
      };
      this.home.init(navPageHandler);
      this.record.init(navPageHandler);
      this.notFound.init(navPageHandler);
    };
    Pages.prototype.getPageController = function(pageName) {
      switch (pageName) {
       case "/":
       case "/home":
        return this.home;

       case "/record":
        return this.record;

       default:
        return this.notFound;
      }
    };
    Pages.prototype.isValidPage = function(pageName) {
      return this.pages.indexOf(pageName) !== -1;
    };
    Pages.prototype.route = function(name) {
      var previousPage = this.currentPage;
      this.currentPage = this.getPageController(name);
      if (previousPage === this.currentPage) {
        return;
      }
      if (previousPage) {
        previousPage.hide();
      }
      this.currentPage.show();
    };
    return Pages;
  }(eventer_2.default);
  Pages.PAGES = {
    ROOT: "/",
    HOME: "/home",
    RECORD: "/record",
    NOT_FOUND: "/notFound"
  };
  exports.default = Pages;
});

define("lib/app", [ "require", "exports", "lib/user", "lib/pages", "lib/utility" ], function(require, exports, user_1, pages_1, utility_4) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var App = function() {
    function App() {
      this.user = new user_1.default();
      this.pages = new pages_1.default(this.user);
    }
    App.prototype.getPageName = function(href) {
      if (!href) {
        href = window.location.href;
      }
      var url = new URL(href);
      return url.pathname;
    };
    App.prototype.handleNavigation = function(href) {
      var page = this.getPageName(href);
      if (!this.pages.isValidPage(page)) {
        console.error("Page not found", page);
        page = pages_1.default.PAGES.NOT_FOUND;
      }
      window.history.pushState(null, "", page);
      this.route();
    };
    App.prototype.run = function() {
      var handler = this.handleNavigation.bind(this);
      this.pages.on("nav", handler);
      var logo = document.getElementById("main-logo");
      utility_4.jsifyLink(logo, handler);
      this.pages.init();
      handler();
    };
    App.prototype.route = function() {
      var name = this.getPageName();
      this.pages.route(name);
    };
    return App;
  }();
  exports.default = App;
});