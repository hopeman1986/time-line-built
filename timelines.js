var __extends = this && this.__extends || function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var webglext;
(function(webglext2) {
  webglext2.GL = WebGLRenderingContext;
  function isNotEmpty(value) {
    return value != null;
  }
  webglext2.isNotEmpty = isNotEmpty;
  function isNumber(value) {
    return typeof value === "number";
  }
  webglext2.isNumber = isNumber;
  function isString(value) {
    return typeof value === "string";
  }
  webglext2.isString = isString;
  function isEmpty(array) {
    return array.length === 0;
  }
  webglext2.isEmpty = isEmpty;
  function notEmpty(array) {
    return array.length > 0;
  }
  webglext2.notEmpty = notEmpty;
  function alwaysTrue() {
    return true;
  }
  webglext2.alwaysTrue = alwaysTrue;
  function alwaysFalse() {
    return false;
  }
  webglext2.alwaysFalse = alwaysFalse;
  function constantFn(value) {
    return function() {
      return value;
    };
  }
  webglext2.constantFn = constantFn;
  function log10(x) {
    return Math.log(x) * (1 / Math.LN10);
  }
  webglext2.log10 = log10;
  function order(x) {
    return Math.floor(log10(x) + 1e-12);
  }
  webglext2.order = order;
  function clamp(xMin, xMax, x) {
    return Math.max(xMin, Math.min(xMax, x));
  }
  webglext2.clamp = clamp;
  function copyArray(values) {
    return values.slice(0);
  }
  webglext2.copyArray = copyArray;
  function ensureCapacityFloat32(buffer, minNewCapacity) {
    if (!minNewCapacity || buffer.length >= minNewCapacity) {
      return buffer;
    } else {
      var newCapacity = Math.max(minNewCapacity, 2 * buffer.length);
      return new Float32Array(newCapacity);
    }
  }
  webglext2.ensureCapacityFloat32 = ensureCapacityFloat32;
  function ensureCapacityUint32(buffer, minNewCapacity) {
    if (!minNewCapacity || buffer.length >= minNewCapacity) {
      return buffer;
    } else {
      var newCapacity = Math.max(minNewCapacity, 2 * buffer.length);
      return new Uint32Array(newCapacity);
    }
  }
  webglext2.ensureCapacityUint32 = ensureCapacityUint32;
  function ensureCapacityUint16(buffer, minNewCapacity) {
    if (!minNewCapacity || buffer.length >= minNewCapacity) {
      return buffer;
    } else {
      var newCapacity = Math.max(minNewCapacity, 2 * buffer.length);
      return new Uint16Array(newCapacity);
    }
  }
  webglext2.ensureCapacityUint16 = ensureCapacityUint16;
  webglext2.getObjectId = function() {
    var keyName = "webglext_ObjectId";
    var nextValue = 0;
    return function(obj) {
      var value = obj[keyName];
      if (!isNotEmpty(value)) {
        value = (nextValue++).toString();
        obj[keyName] = value;
      }
      return value;
    };
  }();
  function concatLines() {
    var lines = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      lines[_i] = arguments[_i];
    }
    return lines.join("\n");
  }
  webglext2.concatLines = concatLines;
  function parseTime_PMILLIS(time_ISO8601) {
    var m = moment(time_ISO8601, "HH:mm:ssZZ", true);
    if (m.isValid())
      return m.valueOf();
    var m = moment(time_ISO8601, "HH:mm:ss.SSSZZ", true);
    if (m.isValid())
      return m.valueOf();
    var m = moment(time_ISO8601, "HH:mm:ss.SSZZ", true);
    if (m.isValid())
      return m.valueOf();
    var m = moment(time_ISO8601, "HH:mm:ss.SZZ", true);
    if (m.isValid())
      return m.valueOf();
    throw new Error("Failed to parse time-string: '" + time_ISO8601 + "'");
  }
  webglext2.parseTime_PMILLIS = parseTime_PMILLIS;
  function formatTime_ISO8601(time_PMILLIS) {
    return moment(time_PMILLIS).toISOString();
  }
  webglext2.formatTime_ISO8601 = formatTime_ISO8601;
  function getCurrentTimMillis() {
    var date = new Date();
    return moment(date).valueOf();
  }
  webglext2.getCurrentTimMillis = getCurrentTimMillis;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var CacheEntry = function() {
    function CacheEntry2(value) {
      this.touched = false;
      this.value = value;
    }
    return CacheEntry2;
  }();
  var Cache = function() {
    function Cache2(helper) {
      this.helper = helper;
      this.map = {};
    }
    Cache2.prototype.value = function(key) {
      if (!this.map.hasOwnProperty(key)) {
        this.map[key] = new CacheEntry(this.helper.create(key));
      }
      var en = this.map[key];
      en.touched = true;
      return en.value;
    };
    Cache2.prototype.clear = function() {
      for (var k in this.map) {
        if (this.map.hasOwnProperty(k)) {
          this.helper.dispose(this.map[k].value, k);
        }
      }
      this.map = {};
    };
    Cache2.prototype.remove = function(key) {
      if (this.map.hasOwnProperty(key)) {
        this.helper.dispose(this.map[key].value, key);
        delete this.map[key];
      }
    };
    Cache2.prototype.removeAll = function(keys) {
      for (var i = 0; i < keys.length; i++) {
        this.remove(keys[i]);
      }
    };
    Cache2.prototype.retain = function(key) {
      var newMap = {};
      if (this.map.hasOwnProperty(key)) {
        newMap[key] = this.map[key];
        delete this.map[key];
      }
      for (var k in this.map) {
        if (this.map.hasOwnProperty(k)) {
          this.helper.dispose(this.map[k].value, k);
        }
      }
      this.map = newMap;
    };
    Cache2.prototype.retainAll = function(keys) {
      var newMap = {};
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (this.map.hasOwnProperty(k)) {
          newMap[k] = this.map[k];
          delete this.map[k];
        }
      }
      for (var k2 in this.map) {
        if (this.map.hasOwnProperty(k2)) {
          this.helper.dispose(this.map[k2].value, k2);
        }
      }
      this.map = newMap;
    };
    Cache2.prototype.resetTouches = function() {
      for (var k in this.map) {
        if (this.map.hasOwnProperty(k)) {
          this.map[k].touched = false;
        }
      }
    };
    Cache2.prototype.retainTouched = function() {
      var newMap = {};
      for (var k in this.map) {
        if (this.map.hasOwnProperty(k)) {
          var en = this.map[k];
          if (en.touched) {
            newMap[k] = this.map[k];
          } else {
            this.helper.dispose(en.value, k);
          }
        }
      }
      this.map = newMap;
    };
    return Cache2;
  }();
  webglext2.Cache = Cache;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var MultiKeyCacheEntry = function() {
    function MultiKeyCacheEntry2(keyParts, value) {
      this.touched = false;
      this.keyParts = keyParts;
      this.value = value;
    }
    return MultiKeyCacheEntry2;
  }();
  var MultiKeyCache = function() {
    function MultiKeyCache2(helper) {
      this.helper = helper;
      this.map = {};
    }
    MultiKeyCache2.prototype.combineKeyParts = function(keyParts) {
      var esc = "\\";
      var sep = ";";
      var escapedEsc = esc + esc;
      var escapedSep = esc + sep;
      var escapedParts = [];
      for (var n = 0; n < keyParts.length; n++) {
        escapedParts[n] = keyParts[n].replace(esc, escapedEsc).replace(sep, escapedSep);
      }
      return escapedParts.join(sep);
    };
    MultiKeyCache2.prototype.value = function() {
      var keyParts = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        keyParts[_i] = arguments[_i];
      }
      var key = this.combineKeyParts(keyParts);
      if (!this.map.hasOwnProperty(key)) {
        this.map[key] = new MultiKeyCacheEntry(keyParts, this.helper.create(keyParts));
      }
      var en = this.map[key];
      en.touched = true;
      return en.value;
    };
    MultiKeyCache2.prototype.remove = function() {
      var keyParts = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        keyParts[_i] = arguments[_i];
      }
      var key = this.combineKeyParts(keyParts);
      if (this.map.hasOwnProperty(key)) {
        var en = this.map[key];
        this.helper.dispose(en.value, en.keyParts);
        delete this.map[key];
      }
    };
    MultiKeyCache2.prototype.retain = function() {
      var keyParts = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        keyParts[_i] = arguments[_i];
      }
      var newMap = {};
      var retainKey = this.combineKeyParts(keyParts);
      if (this.map.hasOwnProperty(retainKey)) {
        newMap[retainKey] = this.map[retainKey];
        delete this.map[retainKey];
      }
      for (var key in this.map) {
        if (this.map.hasOwnProperty(key)) {
          var en = this.map[key];
          this.helper.dispose(en.value, en.keyParts);
        }
      }
      this.map = newMap;
    };
    MultiKeyCache2.prototype.resetTouches = function() {
      for (var key in this.map) {
        if (this.map.hasOwnProperty(key)) {
          this.map[key].touched = false;
        }
      }
    };
    MultiKeyCache2.prototype.retainTouched = function() {
      var newMap = {};
      for (var key in this.map) {
        if (this.map.hasOwnProperty(key)) {
          var en = this.map[key];
          if (en.touched) {
            newMap[key] = this.map[key];
          } else {
            this.helper.dispose(en.value, en.keyParts);
          }
        }
      }
      this.map = newMap;
    };
    MultiKeyCache2.prototype.clear = function() {
      for (var key in this.map) {
        if (this.map.hasOwnProperty(key)) {
          var en = this.map[key];
          this.helper.dispose(en.value, en.keyParts);
        }
      }
      this.map = {};
    };
    return MultiKeyCache2;
  }();
  webglext2.MultiKeyCache = MultiKeyCache;
  var TwoKeyCache = function() {
    function TwoKeyCache2(helper) {
      this.cache = new MultiKeyCache({
        create: function(keyParts) {
          return helper.create(keyParts[0], keyParts[1]);
        },
        dispose: function(value, keyParts) {
          helper.dispose(value, keyParts[0], keyParts[1]);
        }
      });
    }
    TwoKeyCache2.prototype.value = function(keyPart1, keyPart2) {
      return this.cache.value(keyPart1, keyPart2);
    };
    TwoKeyCache2.prototype.remove = function(keyPart1, keyPart2) {
      this.cache.remove(keyPart1, keyPart2);
    };
    TwoKeyCache2.prototype.retain = function(keyPart1, keyPart2) {
      this.cache.retain(keyPart1, keyPart2);
    };
    TwoKeyCache2.prototype.resetTouches = function() {
      this.cache.resetTouches();
    };
    TwoKeyCache2.prototype.retainTouched = function() {
      this.cache.retainTouched();
    };
    TwoKeyCache2.prototype.clear = function() {
      this.cache.clear();
    };
    return TwoKeyCache2;
  }();
  webglext2.TwoKeyCache = TwoKeyCache;
  var ThreeKeyCache = function() {
    function ThreeKeyCache2(helper) {
      this.cache = new MultiKeyCache({
        create: function(keyParts) {
          return helper.create(keyParts[0], keyParts[1], keyParts[2]);
        },
        dispose: function(value, keyParts) {
          helper.dispose(value, keyParts[0], keyParts[1], keyParts[2]);
        }
      });
    }
    ThreeKeyCache2.prototype.value = function(keyPart1, keyPart2, keyPart3) {
      return this.cache.value(keyPart1, keyPart2, keyPart3);
    };
    ThreeKeyCache2.prototype.remove = function(keyPart1, keyPart2, keyPart3) {
      this.cache.remove(keyPart1, keyPart2, keyPart3);
    };
    ThreeKeyCache2.prototype.retain = function(keyPart1, keyPart2, keyPart3) {
      this.cache.retain(keyPart1, keyPart2, keyPart3);
    };
    ThreeKeyCache2.prototype.resetTouches = function() {
      this.cache.resetTouches();
    };
    ThreeKeyCache2.prototype.retainTouched = function() {
      this.cache.retainTouched();
    };
    ThreeKeyCache2.prototype.clear = function() {
      this.cache.clear();
    };
    return ThreeKeyCache2;
  }();
  webglext2.ThreeKeyCache = ThreeKeyCache;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var BoundsUnmodifiable = function() {
    function BoundsUnmodifiable2(bounds) {
      this.bounds = bounds;
    }
    Object.defineProperty(BoundsUnmodifiable2.prototype, "iStart", {
      get: function() {
        return this.bounds.iStart;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BoundsUnmodifiable2.prototype, "jStart", {
      get: function() {
        return this.bounds.jStart;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BoundsUnmodifiable2.prototype, "iEnd", {
      get: function() {
        return this.bounds.iEnd;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BoundsUnmodifiable2.prototype, "jEnd", {
      get: function() {
        return this.bounds.jEnd;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BoundsUnmodifiable2.prototype, "i", {
      get: function() {
        return this.bounds.i;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BoundsUnmodifiable2.prototype, "j", {
      get: function() {
        return this.bounds.j;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BoundsUnmodifiable2.prototype, "w", {
      get: function() {
        return this.bounds.w;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BoundsUnmodifiable2.prototype, "h", {
      get: function() {
        return this.bounds.h;
      },
      enumerable: false,
      configurable: true
    });
    BoundsUnmodifiable2.prototype.xFrac = function(i) {
      return this.bounds.xFrac(i);
    };
    BoundsUnmodifiable2.prototype.yFrac = function(j) {
      return this.bounds.yFrac(j);
    };
    BoundsUnmodifiable2.prototype.contains = function(i, j) {
      return this.bounds.contains(i, j);
    };
    return BoundsUnmodifiable2;
  }();
  webglext2.BoundsUnmodifiable = BoundsUnmodifiable;
  var Bounds = function() {
    function Bounds2() {
      this._iStart = 0;
      this._jStart = 0;
      this._iEnd = 0;
      this._jEnd = 0;
      this._unmod = new BoundsUnmodifiable(this);
    }
    Object.defineProperty(Bounds2.prototype, "iStart", {
      get: function() {
        return this._iStart;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Bounds2.prototype, "jStart", {
      get: function() {
        return this._jStart;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Bounds2.prototype, "iEnd", {
      get: function() {
        return this._iEnd;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Bounds2.prototype, "jEnd", {
      get: function() {
        return this._jEnd;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Bounds2.prototype, "i", {
      get: function() {
        return this._iStart;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Bounds2.prototype, "j", {
      get: function() {
        return this._jStart;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Bounds2.prototype, "w", {
      get: function() {
        return this._iEnd - this._iStart;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Bounds2.prototype, "h", {
      get: function() {
        return this._jEnd - this._jStart;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Bounds2.prototype, "unmod", {
      get: function() {
        return this._unmod;
      },
      enumerable: false,
      configurable: true
    });
    Bounds2.prototype.xFrac = function(i) {
      return (i - this._iStart) / (this._iEnd - this._iStart);
    };
    Bounds2.prototype.yFrac = function(j) {
      return (j - this._jStart) / (this._jEnd - this._jStart);
    };
    Bounds2.prototype.contains = function(i, j) {
      return this._iStart <= i && i < this._iEnd && this._jStart <= j && j < this._jEnd;
    };
    Bounds2.prototype.setEdges = function(iStart, iEnd, jStart, jEnd) {
      this._iStart = iStart;
      this._jStart = jStart;
      this._iEnd = iEnd;
      this._jEnd = jEnd;
    };
    Bounds2.prototype.setRect = function(i, j, w, h) {
      this.setEdges(i, i + w, j, j + h);
    };
    Bounds2.prototype.setBounds = function(bounds) {
      this.setEdges(bounds.iStart, bounds.iEnd, bounds.jStart, bounds.jEnd);
    };
    Bounds2.prototype.cropToEdges = function(iCropStart, iCropEnd, jCropStart, jCropEnd) {
      this._iStart = webglext2.clamp(iCropStart, iCropEnd, this._iStart);
      this._jStart = webglext2.clamp(jCropStart, jCropEnd, this._jStart);
      this._iEnd = webglext2.clamp(iCropStart, iCropEnd, this._iEnd);
      this._jEnd = webglext2.clamp(jCropStart, jCropEnd, this._jEnd);
    };
    Bounds2.prototype.cropToRect = function(iCrop, jCrop, wCrop, hCrop) {
      this.cropToEdges(iCrop, iCrop + wCrop, jCrop, jCrop + hCrop);
    };
    Bounds2.prototype.cropToBounds = function(cropBounds) {
      this.cropToEdges(cropBounds.iStart, cropBounds.iEnd, cropBounds.jStart, cropBounds.jEnd);
    };
    return Bounds2;
  }();
  webglext2.Bounds = Bounds;
  function newBoundsFromRect(i, j, w, h) {
    var b = new Bounds();
    b.setRect(i, j, w, h);
    return b;
  }
  webglext2.newBoundsFromRect = newBoundsFromRect;
  function newBoundsFromEdges(iStart, iEnd, jStart, jEnd) {
    var b = new Bounds();
    b.setEdges(iStart, iEnd, jStart, jEnd);
    return b;
  }
  webglext2.newBoundsFromEdges = newBoundsFromEdges;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var Color = function() {
    function Color2(r, g, b, a) {
      if (a === void 0) {
        a = 1;
      }
      this._r = r;
      this._g = g;
      this._b = b;
      this._a = a;
    }
    Object.defineProperty(Color2.prototype, "r", {
      get: function() {
        return this._r;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Color2.prototype, "g", {
      get: function() {
        return this._g;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Color2.prototype, "b", {
      get: function() {
        return this._b;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Color2.prototype, "a", {
      get: function() {
        return this._a;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Color2.prototype, "cssString", {
      get: function() {
        return "rgba(" + Math.round(255 * this._r) + "," + Math.round(255 * this._g) + "," + Math.round(255 * this._b) + "," + this._a + ")";
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Color2.prototype, "rgbaString", {
      get: function() {
        return "" + Math.round(255 * this._r) + "," + Math.round(255 * this._g) + "," + Math.round(255 * this._b) + "," + Math.round(255 * this._a);
      },
      enumerable: false,
      configurable: true
    });
    Color2.prototype.withAlphaTimes = function(aFactor) {
      return new Color2(this._r, this._g, this._b, aFactor * this._a);
    };
    return Color2;
  }();
  webglext2.Color = Color;
  function darker(color, factor) {
    return new Color(color.r * factor, color.g * factor, color.b * factor, color.a);
  }
  webglext2.darker = darker;
  function rgba(r, g, b, a) {
    return new Color(r, g, b, a);
  }
  webglext2.rgba = rgba;
  function rgb(r, g, b) {
    return new Color(r, g, b, 1);
  }
  webglext2.rgb = rgb;
  function sameColor(c1, c2) {
    if (c1 === c2)
      return true;
    if (!webglext2.isNotEmpty(c1) || !webglext2.isNotEmpty(c2))
      return false;
    return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b && c1.a === c2.a;
  }
  webglext2.sameColor = sameColor;
  webglext2.parseCssColor = function() {
    var canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    var g = canvas.getContext("2d");
    return function(cssColorString) {
      g.clearRect(0, 0, 1, 1);
      g.fillStyle = cssColorString;
      g.fillRect(0, 0, 1, 1);
      var rgbaData = g.getImageData(0, 0, 1, 1).data;
      var R = rgbaData[0] / 255;
      var G = rgbaData[1] / 255;
      var B = rgbaData[2] / 255;
      var A = rgbaData[3] / 255;
      return rgba(R, G, B, A);
    };
  }();
  function parseRgba(rgbaString) {
    var tokens = rgbaString.split(",", 4);
    return new Color(parseInt(tokens[0]) / 255, parseInt(tokens[1]) / 255, parseInt(tokens[2]) / 255, parseInt(tokens[3]) / 255);
  }
  webglext2.parseRgba = parseRgba;
  function gray(brightness) {
    return new Color(brightness, brightness, brightness, 1);
  }
  webglext2.gray = gray;
  webglext2.black = rgb(0, 0, 0);
  webglext2.white = rgb(1, 1, 1);
  webglext2.red = rgb(1, 0, 0);
  webglext2.green = rgb(0, 1, 0);
  webglext2.blue = rgb(0, 0, 1);
  webglext2.periwinkle = rgb(0.561, 0.561, 0.961);
  webglext2.cyan = rgb(0, 1, 1);
  webglext2.magenta = rgb(1, 0, 1);
  webglext2.yellow = rgb(1, 1, 0);
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function glOrtho(left, right, bottom, top, near, far) {
    var tx = (right + left) / (right - left);
    var ty = (top + bottom) / (top - bottom);
    var tz = (far + near) / (far - near);
    return new Float32Array([
      2 / (right - left),
      0,
      0,
      0,
      0,
      2 / (top - bottom),
      0,
      0,
      0,
      0,
      -2 / (far - near),
      0,
      -tx,
      -ty,
      -tz,
      1
    ]);
  }
  webglext2.glOrtho = glOrtho;
  function glOrthoViewport(viewport) {
    return glOrtho(-0.5, viewport.w - 0.5, -0.5, viewport.h - 0.5, -1, 1);
  }
  webglext2.glOrthoViewport = glOrthoViewport;
  function glOrthoAxis(axis) {
    return glOrtho(axis.xAxis.vMin, axis.xAxis.vMax, axis.yAxis.vMin, axis.yAxis.vMax, -1, 1);
  }
  webglext2.glOrthoAxis = glOrthoAxis;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function requireString(s) {
    if (webglext2.isString(s)) {
      return s;
    } else {
      throw new Error("Expected a string, but value is " + s);
    }
  }
  var OrderedSet = function() {
    function OrderedSet2(values, idFn, useNotifications) {
      if (values === void 0) {
        values = [];
      }
      if (idFn === void 0) {
        idFn = webglext2.getObjectId;
      }
      if (useNotifications === void 0) {
        useNotifications = true;
      }
      this._idOf = idFn;
      this._valuesArray = webglext2.copyArray(values);
      this._ids = [];
      this._indexes = {};
      this._valuesMap = {};
      for (var n = 0; n < this._valuesArray.length; n++) {
        var value = this._valuesArray[n];
        var id = requireString(this._idOf(value));
        this._ids[n] = id;
        this._indexes[id] = n;
        this._valuesMap[id] = value;
      }
      if (useNotifications) {
        this._valueAdded = new webglext2.Notification2();
        this._valueMoved = new webglext2.Notification3();
        this._valueRemoved = new webglext2.Notification2();
      }
    }
    Object.defineProperty(OrderedSet2.prototype, "valueAdded", {
      get: function() {
        return this._valueAdded;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(OrderedSet2.prototype, "valueMoved", {
      get: function() {
        return this._valueMoved;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(OrderedSet2.prototype, "valueRemoved", {
      get: function() {
        return this._valueRemoved;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(OrderedSet2.prototype, "length", {
      get: function() {
        return this._valuesArray.length;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(OrderedSet2.prototype, "isEmpty", {
      get: function() {
        return this._valuesArray.length === 0;
      },
      enumerable: false,
      configurable: true
    });
    OrderedSet2.prototype.toArray = function() {
      return webglext2.copyArray(this._valuesArray);
    };
    OrderedSet2.prototype.every = function(callbackFn, thisArg) {
      return this._valuesArray.every(callbackFn, thisArg);
    };
    OrderedSet2.prototype.some = function(callbackFn, thisArg) {
      return this._valuesArray.some(callbackFn, thisArg);
    };
    OrderedSet2.prototype.forEach = function(callbackFn, thisArg) {
      this._valuesArray.forEach(callbackFn, thisArg);
    };
    OrderedSet2.prototype.map = function(callbackFn, thisArg) {
      return this._valuesArray.map(callbackFn, thisArg);
    };
    OrderedSet2.prototype.filter = function(callbackFn, thisArg) {
      return this._valuesArray.filter(callbackFn, thisArg);
    };
    OrderedSet2.prototype.reduce = function(callbackFn, initialValue) {
      return this._valuesArray.reduce(callbackFn, initialValue);
    };
    OrderedSet2.prototype.reduceRight = function(callbackFn, initialValue) {
      return this._valuesArray.reduceRight(callbackFn, initialValue);
    };
    OrderedSet2.prototype.idAt = function(index) {
      return this._ids[index];
    };
    OrderedSet2.prototype.valueAt = function(index) {
      return this._valuesArray[index];
    };
    OrderedSet2.prototype.indexFor = function(id) {
      return webglext2.isString(id) ? this._indexes[id] : void 0;
    };
    OrderedSet2.prototype.valueFor = function(id) {
      return webglext2.isString(id) ? this._valuesMap[id] : void 0;
    };
    OrderedSet2.prototype.idOf = function(value) {
      return requireString(this._idOf(value));
    };
    OrderedSet2.prototype.indexOf = function(value) {
      return this._indexes[requireString(this._idOf(value))];
    };
    OrderedSet2.prototype.hasValue = function(value) {
      return this.hasId(requireString(this._idOf(value)));
    };
    OrderedSet2.prototype.hasValues = function(values) {
      for (var n = 0; n < values.length; n++) {
        if (!this.hasValue(values[n])) {
          return false;
        }
      }
      return true;
    };
    OrderedSet2.prototype.hasId = function(id) {
      return webglext2.isString(id) && webglext2.isNotEmpty(this._valuesMap[id]);
    };
    OrderedSet2.prototype.hasIds = function(ids) {
      for (var n = 0; n < ids.length; n++) {
        if (!this.hasId(ids[n])) {
          return false;
        }
      }
      return true;
    };
    OrderedSet2.prototype.add = function(value, index, moveIfExists) {
      var index = webglext2.isNotEmpty(index) ? index : this._valuesArray.length;
      if (!webglext2.isNotEmpty(moveIfExists))
        moveIfExists = false;
      this._add(value, index, moveIfExists);
    };
    OrderedSet2.prototype.addAll = function(values, index, moveIfExists) {
      var index = webglext2.isNotEmpty(index) ? index : this._valuesArray.length;
      if (!webglext2.isNotEmpty(moveIfExists))
        moveIfExists = false;
      for (var n = 0; n < values.length; n++) {
        var actualIndex = this._add(values[n], index, moveIfExists);
        index = actualIndex + 1;
      }
    };
    OrderedSet2.prototype._add = function(value, newIndex, moveIfExists) {
      var id = requireString(this._idOf(value));
      var oldIndex = this._indexes[id];
      if (!webglext2.isNotEmpty(oldIndex)) {
        this._ids.splice(newIndex, 0, id);
        this._valuesArray.splice(newIndex, 0, value);
        this._valuesMap[id] = value;
        for (var n = newIndex; n < this._ids.length; n++) {
          this._indexes[this._ids[n]] = n;
        }
        if (this._valueAdded) {
          this._valueAdded.fire(value, newIndex);
        }
      } else if (newIndex !== oldIndex && moveIfExists) {
        this._ids.splice(oldIndex, 1);
        this._valuesArray.splice(oldIndex, 1);
        if (newIndex > oldIndex) {
          newIndex--;
          this._ids.splice(newIndex, 0, id);
          this._valuesArray.splice(newIndex, 0, value);
          for (var n = oldIndex; n <= newIndex; n++) {
            this._indexes[this._ids[n]] = n;
          }
        } else {
          this._ids.splice(newIndex, 0, id);
          this._valuesArray.splice(newIndex, 0, value);
          for (var n = newIndex; n <= oldIndex; n++) {
            this._indexes[this._ids[n]] = n;
          }
        }
        if (this._valueMoved) {
          this._valueMoved.fire(value, oldIndex, newIndex);
        }
      } else {
        newIndex = oldIndex;
      }
      return newIndex;
    };
    OrderedSet2.prototype.removeValue = function(value) {
      this.removeId(requireString(this._idOf(value)));
    };
    OrderedSet2.prototype.removeId = function(id) {
      if (webglext2.isString(id)) {
        var index = this._indexes[id];
        if (webglext2.isNotEmpty(index)) {
          this._remove(id, index);
        }
      }
    };
    OrderedSet2.prototype.removeIndex = function(index) {
      var id = this._ids[index];
      if (webglext2.isString(id)) {
        this._remove(id, index);
      }
    };
    OrderedSet2.prototype.removeAll = function() {
      for (var n = this._valuesArray.length - 1; n >= 0; n--) {
        var id = this._ids[n];
        this._remove(id, n);
      }
    };
    OrderedSet2.prototype.retainValues = function(values) {
      var idsToRetain = {};
      for (var n = 0; n < values.length; n++) {
        var id = this._idOf(values[n]);
        if (webglext2.isString(id)) {
          idsToRetain[id] = true;
        }
      }
      this._retain(idsToRetain);
    };
    OrderedSet2.prototype.retainIds = function(ids) {
      var idsToRetain = {};
      for (var n = 0; n < ids.length; n++) {
        var id = ids[n];
        if (webglext2.isString(id)) {
          idsToRetain[id] = true;
        }
      }
      this._retain(idsToRetain);
    };
    OrderedSet2.prototype.retainIndices = function(indices) {
      var idsToRetain = {};
      for (var n = 0; n < indices.length; n++) {
        var id = this._ids[indices[n]];
        idsToRetain[id] = true;
      }
      this._retain(idsToRetain);
    };
    OrderedSet2.prototype._retain = function(ids) {
      for (var n = this._valuesArray.length - 1; n >= 0; n--) {
        var id = this._ids[n];
        if (!ids.hasOwnProperty(id)) {
          this._remove(id, n);
        }
      }
    };
    OrderedSet2.prototype._remove = function(id, index) {
      var value = this._valuesArray[index];
      this._ids.splice(index, 1);
      this._valuesArray.splice(index, 1);
      delete this._indexes[id];
      delete this._valuesMap[id];
      for (var n = index; n < this._ids.length; n++) {
        this._indexes[this._ids[n]] = n;
      }
      if (this._valueRemoved) {
        this._valueRemoved.fire(value, index);
      }
    };
    return OrderedSet2;
  }();
  webglext2.OrderedSet = OrderedSet;
  var OrderedStringSet = function() {
    function OrderedStringSet2(values, useNotifications) {
      if (values === void 0) {
        values = [];
      }
      if (useNotifications === void 0) {
        useNotifications = true;
      }
      this._valuesArray = [];
      this._indexes = {};
      for (var n = 0; n < values.length; n++) {
        var value = requireString(values[n]);
        this._valuesArray[n] = value;
        this._indexes[value] = n;
      }
      if (useNotifications) {
        this._valueAdded = new webglext2.Notification2();
        this._valueMoved = new webglext2.Notification3();
        this._valueRemoved = new webglext2.Notification2();
      }
    }
    Object.defineProperty(OrderedStringSet2.prototype, "valueAdded", {
      get: function() {
        return this._valueAdded;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(OrderedStringSet2.prototype, "valueMoved", {
      get: function() {
        return this._valueMoved;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(OrderedStringSet2.prototype, "valueRemoved", {
      get: function() {
        return this._valueRemoved;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(OrderedStringSet2.prototype, "length", {
      get: function() {
        return this._valuesArray.length;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(OrderedStringSet2.prototype, "isEmpty", {
      get: function() {
        return this._valuesArray.length === 0;
      },
      enumerable: false,
      configurable: true
    });
    OrderedStringSet2.prototype.toArray = function() {
      return webglext2.copyArray(this._valuesArray);
    };
    OrderedStringSet2.prototype.every = function(callbackFn, thisArg) {
      return this._valuesArray.every(callbackFn, thisArg);
    };
    OrderedStringSet2.prototype.some = function(callbackFn, thisArg) {
      return this._valuesArray.some(callbackFn, thisArg);
    };
    OrderedStringSet2.prototype.forEach = function(callbackFn, thisArg) {
      this._valuesArray.forEach(callbackFn, thisArg);
    };
    OrderedStringSet2.prototype.map = function(callbackFn, thisArg) {
      return this._valuesArray.map(callbackFn, thisArg);
    };
    OrderedStringSet2.prototype.filter = function(callbackFn, thisArg) {
      return this._valuesArray.filter(callbackFn, thisArg);
    };
    OrderedStringSet2.prototype.reduce = function(callbackFn, initialValue) {
      return this._valuesArray.reduce(callbackFn, initialValue);
    };
    OrderedStringSet2.prototype.reduceRight = function(callbackFn, initialValue) {
      return this._valuesArray.reduceRight(callbackFn, initialValue);
    };
    OrderedStringSet2.prototype.valueAt = function(index) {
      return this._valuesArray[index];
    };
    OrderedStringSet2.prototype.indexOf = function(value) {
      return webglext2.isString(value) ? this._indexes[value] : void 0;
    };
    OrderedStringSet2.prototype.hasValue = function(value) {
      return webglext2.isString(value) && webglext2.isNotEmpty(this._indexes[value]);
    };
    OrderedStringSet2.prototype.hasValues = function(values) {
      for (var n = 0; n < values.length; n++) {
        if (!this.hasValue(values[n])) {
          return false;
        }
      }
      return true;
    };
    OrderedStringSet2.prototype.add = function(value, index, moveIfExists) {
      var index = webglext2.isNotEmpty(index) ? index : this._valuesArray.length;
      if (!webglext2.isNotEmpty(moveIfExists))
        moveIfExists = false;
      this._add(value, index, moveIfExists);
    };
    OrderedStringSet2.prototype.addAll = function(values, index, moveIfExists) {
      var index = webglext2.isNotEmpty(index) ? index : this._valuesArray.length;
      if (!webglext2.isNotEmpty(moveIfExists))
        moveIfExists = false;
      for (var n = 0; n < values.length; n++) {
        var actualIndex = this._add(values[n], index, moveIfExists);
        index = actualIndex + 1;
      }
    };
    OrderedStringSet2.prototype._add = function(value, newIndex, moveIfExists) {
      requireString(value);
      var oldIndex = this._indexes[value];
      if (!webglext2.isNotEmpty(oldIndex)) {
        this._valuesArray.splice(newIndex, 0, value);
        for (var n = newIndex; n < this._valuesArray.length; n++) {
          this._indexes[this._valuesArray[n]] = n;
        }
        if (this._valueAdded) {
          this._valueAdded.fire(value, newIndex);
        }
      } else if (newIndex !== oldIndex && moveIfExists) {
        this._valuesArray.splice(oldIndex, 1);
        if (newIndex > oldIndex) {
          newIndex--;
          this._valuesArray.splice(newIndex, 0, value);
          for (var n = oldIndex; n <= newIndex; n++) {
            this._indexes[this._valuesArray[n]] = n;
          }
        } else {
          this._valuesArray.splice(newIndex, 0, value);
          for (var n = newIndex; n <= oldIndex; n++) {
            this._indexes[this._valuesArray[n]] = n;
          }
        }
        if (this._valueMoved) {
          this._valueMoved.fire(value, oldIndex, newIndex);
        }
      } else {
        newIndex = oldIndex;
      }
      return newIndex;
    };
    OrderedStringSet2.prototype.removeValue = function(value) {
      if (webglext2.isString(value)) {
        var index = this._indexes[value];
        if (webglext2.isNotEmpty(index)) {
          this._remove(value, index);
        }
      }
    };
    OrderedStringSet2.prototype.removeIndex = function(index) {
      var value = this._valuesArray[index];
      if (webglext2.isString(value)) {
        this._remove(value, index);
      }
    };
    OrderedStringSet2.prototype.removeAll = function() {
      for (var n = this._valuesArray.length - 1; n >= 0; n--) {
        var value = this._valuesArray[n];
        this._remove(value, n);
      }
    };
    OrderedStringSet2.prototype.retainValues = function(values) {
      var valuesToRetain = {};
      for (var n = 0; n < values.length; n++) {
        var value = values[n];
        if (webglext2.isString(value)) {
          valuesToRetain[value] = true;
        }
      }
      this._retain(valuesToRetain);
    };
    OrderedStringSet2.prototype.retainIndices = function(indices) {
      var valuesToRetain = {};
      for (var n = 0; n < indices.length; n++) {
        var value = this._valuesArray[indices[n]];
        valuesToRetain[value] = true;
      }
      this._retain(valuesToRetain);
    };
    OrderedStringSet2.prototype._retain = function(values) {
      for (var n = this._valuesArray.length - 1; n >= 0; n--) {
        var value = this._valuesArray[n];
        if (!values.hasOwnProperty(value)) {
          this._remove(value, n);
        }
      }
    };
    OrderedStringSet2.prototype._remove = function(value, index) {
      this._valuesArray.splice(index, 1);
      delete this._indexes[value];
      for (var n = index; n < this._valuesArray.length; n++) {
        this._indexes[this._valuesArray[n]] = n;
      }
      if (this._valueRemoved) {
        this._valueRemoved.fire(value, index);
      }
    };
    return OrderedStringSet2;
  }();
  webglext2.OrderedStringSet = OrderedStringSet;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var Notification = function() {
    function Notification4() {
      this._listeners = new webglext2.OrderedSet([], webglext2.getObjectId, false);
      this._deferring = false;
      this._deferred = [];
    }
    Notification4.prototype.on = function(listener) {
      if (this._deferring) {
        var self = this;
        this._deferred.push(function() {
          self._listeners.add(listener);
        });
      } else {
        this._listeners.add(listener);
      }
    };
    Notification4.prototype.off = function(listener) {
      if (this._deferring) {
        var self = this;
        this._deferred.push(function() {
          self._listeners.removeValue(listener);
        });
      } else {
        this._listeners.removeValue(listener);
      }
    };
    Notification4.prototype.dispose = function() {
      this._listeners.removeAll();
    };
    Notification4.prototype.fire = function() {
      this._deferring = true;
      try {
        for (var n = 0; n < this._listeners.length; n++) {
          var consumed = this._listeners.valueAt(n)();
          if (consumed)
            return consumed;
        }
        return false;
      } finally {
        if (this._deferred.length > 0) {
          for (var n = 0; n < this._deferred.length; n++) {
            this._deferred[n]();
          }
          this._deferred = [];
        }
        this._deferring = false;
      }
    };
    return Notification4;
  }();
  webglext2.Notification = Notification;
  var Notification1 = function() {
    function Notification12() {
      this._listeners = new webglext2.OrderedSet([], webglext2.getObjectId, false);
      this._deferring = false;
      this._deferred = [];
    }
    Notification12.prototype.on = function(listener) {
      if (this._deferring) {
        var self = this;
        this._deferred.push(function() {
          self._listeners.add(listener);
        });
      } else {
        this._listeners.add(listener);
      }
    };
    Notification12.prototype.off = function(listener) {
      if (this._deferring) {
        var self = this;
        this._deferred.push(function() {
          self._listeners.removeValue(listener);
        });
      } else {
        this._listeners.removeValue(listener);
      }
    };
    Notification12.prototype.dispose = function() {
      this._listeners.removeAll();
    };
    Notification12.prototype.fire = function(a) {
      this._deferring = true;
      try {
        for (var n = 0; n < this._listeners.length; n++) {
          var consumed = this._listeners.valueAt(n)(a);
          if (consumed)
            return consumed;
        }
        return false;
      } finally {
        if (this._deferred.length > 0) {
          for (var n = 0; n < this._deferred.length; n++) {
            this._deferred[n]();
          }
          this._deferred = [];
        }
        this._deferring = false;
      }
    };
    return Notification12;
  }();
  webglext2.Notification1 = Notification1;
  var Notification2 = function() {
    function Notification22() {
      this._listeners = new webglext2.OrderedSet([], webglext2.getObjectId, false);
      this._deferring = false;
      this._deferred = [];
    }
    Notification22.prototype.on = function(listener) {
      if (this._deferring) {
        var self = this;
        this._deferred.push(function() {
          self._listeners.add(listener);
        });
      } else {
        this._listeners.add(listener);
      }
    };
    Notification22.prototype.off = function(listener) {
      if (this._deferring) {
        var self = this;
        this._deferred.push(function() {
          self._listeners.removeValue(listener);
        });
      } else {
        this._listeners.removeValue(listener);
      }
    };
    Notification22.prototype.dispose = function() {
      this._listeners.removeAll();
    };
    Notification22.prototype.fire = function(a, b) {
      this._deferring = true;
      try {
        for (var n = 0; n < this._listeners.length; n++) {
          var consumed = this._listeners.valueAt(n)(a, b);
          if (consumed)
            return consumed;
        }
        return false;
      } finally {
        if (this._deferred.length > 0) {
          for (var n = 0; n < this._deferred.length; n++) {
            this._deferred[n]();
          }
          this._deferred = [];
        }
        this._deferring = false;
      }
    };
    return Notification22;
  }();
  webglext2.Notification2 = Notification2;
  var Notification3 = function() {
    function Notification32() {
      this._listeners = new webglext2.OrderedSet([], webglext2.getObjectId, false);
      this._deferring = false;
      this._deferred = [];
    }
    Notification32.prototype.on = function(listener) {
      if (this._deferring) {
        var self = this;
        this._deferred.push(function() {
          self._listeners.add(listener);
        });
      } else {
        this._listeners.add(listener);
      }
    };
    Notification32.prototype.off = function(listener) {
      if (this._deferring) {
        var self = this;
        this._deferred.push(function() {
          self._listeners.removeValue(listener);
        });
      } else {
        this._listeners.removeValue(listener);
      }
    };
    Notification32.prototype.dispose = function() {
      this._listeners.removeAll();
    };
    Notification32.prototype.fire = function(a, b, c) {
      this._deferring = true;
      try {
        for (var n = 0; n < this._listeners.length; n++) {
          var consumed = this._listeners.valueAt(n)(a, b, c);
          if (consumed)
            return consumed;
        }
        return false;
      } finally {
        if (this._deferred.length > 0) {
          for (var n = 0; n < this._deferred.length; n++) {
            this._deferred[n]();
          }
          this._deferred = [];
        }
        this._deferring = false;
      }
    };
    return Notification32;
  }();
  webglext2.Notification3 = Notification3;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function indexOf(vs, x) {
    var a = 0;
    var b = vs.length - 1;
    while (a <= b) {
      var pivot = (a + b) / 2 | 0;
      var vPivot = vs[pivot];
      if (vPivot < x) {
        a = pivot + 1;
      } else if (vPivot > x) {
        b = pivot - 1;
      } else {
        return pivot;
      }
    }
    return -(a + 1);
  }
  webglext2.indexOf = indexOf;
  function indexNearest(vs, x) {
    var i = indexOf(vs, x);
    if (i >= 0)
      return i;
    var iAfter = -i - 1;
    var iBefore = iAfter - 1;
    if (iAfter >= vs.length)
      return iBefore;
    if (iBefore < 0)
      return iAfter;
    var diffAfter = vs[iAfter] - x;
    var diffBefore = x - vs[iBefore];
    return diffAfter <= diffBefore ? iAfter : iBefore;
  }
  webglext2.indexNearest = indexNearest;
  function indexAfter(vs, x) {
    var i = indexOf(vs, x);
    if (i < 0)
      return -i - 1;
    var n = vs.length;
    for (var j = i + 1; j < n; j++) {
      if (vs[j] > x)
        return j;
    }
    return n;
  }
  webglext2.indexAfter = indexAfter;
  function indexAtOrAfter(vs, x) {
    var i = indexOf(vs, x);
    if (i < 0)
      return -i - 1;
    var n = vs.length;
    for (var j = i; j > 0; j--) {
      if (vs[j - 1] < x)
        return j;
    }
    return 0;
  }
  webglext2.indexAtOrAfter = indexAtOrAfter;
  function indexBefore(vs, x) {
    return indexAtOrAfter(vs, x) - 1;
  }
  webglext2.indexBefore = indexBefore;
  function indexAtOrBefore(vs, x) {
    return indexAfter(vs, x) - 1;
  }
  webglext2.indexAtOrBefore = indexAtOrBefore;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var BinaryTree = function() {
    function BinaryTree2(comparator) {
      this._root = null;
      this._comp = comparator;
      this._size = 0;
    }
    BinaryTree2.prototype.insert = function(value) {
      this._root = this.insert0(value, this._root);
    };
    BinaryTree2.prototype.remove = function(value) {
      this._root = this.remove0(value, this._root);
    };
    BinaryTree2.prototype.removeAll = function() {
      this._root = null;
      this._size = 0;
    };
    BinaryTree2.prototype.contains = function(value) {
      return this.contains0(value, this._root) !== null;
    };
    BinaryTree2.prototype.getValue = function(value) {
      return this.contains0(value, this._root);
    };
    Object.defineProperty(BinaryTree2.prototype, "size", {
      get: function() {
        return this._size;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BinaryTree2.prototype, "isEmpty", {
      get: function() {
        return this._size === 0;
      },
      enumerable: false,
      configurable: true
    });
    BinaryTree2.prototype.ceiling = function(value) {
      return this.higher0(value, this._root, true);
    };
    BinaryTree2.prototype.floor = function(value) {
      return this.lower0(value, this._root, true);
    };
    BinaryTree2.prototype.lower = function(value) {
      return this.lower0(value, this._root, false);
    };
    BinaryTree2.prototype.higher = function(value) {
      return this.higher0(value, this._root, false);
    };
    BinaryTree2.prototype.headSet = function(value, inclusive) {
      if (inclusive === void 0) {
        inclusive = true;
      }
      var results = new Array();
      this.head0(value, inclusive, this._root, results);
      return results;
    };
    BinaryTree2.prototype.tailSet = function(value, inclusive) {
      if (inclusive === void 0) {
        inclusive = false;
      }
      var results = new Array();
      this.tail0(value, inclusive, this._root, results);
      return results;
    };
    BinaryTree2.prototype.subSet = function(low, high, lowInclusive, highInclusive) {
      if (lowInclusive === void 0) {
        lowInclusive = true;
      }
      if (highInclusive === void 0) {
        highInclusive = false;
      }
      var results = new Array();
      this.sub0(low, high, lowInclusive, highInclusive, this._root, results);
      return results;
    };
    BinaryTree2.prototype.toArray = function() {
      var results = new Array();
      this.addAll0(this._root, results);
      return results;
    };
    BinaryTree2.prototype.iterator = function() {
      var node = this._root;
      var down;
      var stack = new Array();
      while (node != null && node.left != null) {
        stack.push(node);
        node = node.left;
      }
      down = node.right != null;
      return {
        next: function() {
          var value = node.value;
          if (down && node != null && node.right != null) {
            node = node.right;
            while (node != null && node.left != null) {
              stack.push(node);
              node = node.left;
            }
            down = node.right != null;
          } else {
            node = stack.pop();
            down = true;
          }
          return value;
        },
        hasNext: function() {
          return node != null;
        }
      };
    };
    BinaryTree2.prototype.compare = function(node1, node2) {
      return this._comp.compare(node1, node2);
    };
    BinaryTree2.prototype.contains0 = function(value, node) {
      if (node == null) {
        return null;
      }
      var comp = this.compare(value, node.value);
      if (comp > 0) {
        return this.contains0(value, node.right);
      } else if (comp < 0) {
        return this.contains0(value, node.left);
      } else {
        return node.value;
      }
    };
    BinaryTree2.prototype.lower0 = function(value, node, inclusive) {
      if (node == null) {
        return null;
      }
      var comp = this.compare(value, node.value);
      var candidate;
      if (comp > 0) {
        candidate = this.lower0(value, node.right, inclusive);
        return candidate != null ? candidate : node.value;
      } else if (comp < 0 || !inclusive && comp == 0) {
        candidate = this.lower0(value, node.left, inclusive);
        if (candidate == null)
          candidate = node.value;
        comp = this.compare(value, candidate);
        return comp > 0 || inclusive && comp == 0 ? candidate : null;
      } else {
        return node.value;
      }
    };
    BinaryTree2.prototype.higher0 = function(value, node, inclusive) {
      if (node == null) {
        return null;
      }
      var comp = this.compare(value, node.value);
      var candidate;
      if (comp < 0) {
        candidate = this.higher0(value, node.left, inclusive);
        return candidate != null ? candidate : node.value;
      } else if (comp > 0 || !inclusive && comp == 0) {
        candidate = this.higher0(value, node.right, inclusive);
        if (candidate == null)
          candidate = node.value;
        comp = this.compare(value, candidate);
        return comp < 0 || inclusive && comp == 0 ? candidate : null;
      } else {
        return node.value;
      }
    };
    BinaryTree2.prototype.sub0 = function(low, high, lowInclusive, highInclusive, node, results) {
      if (node == null) {
        return;
      }
      var compLow = this.compare(low, node.value);
      if (compLow > 0 || compLow == 0 && !lowInclusive) {
        return this.sub0(low, high, lowInclusive, highInclusive, node.right, results);
      }
      var compHigh = this.compare(high, node.value);
      if (compHigh < 0 || compHigh == 0 && !highInclusive) {
        return this.sub0(low, high, lowInclusive, highInclusive, node.left, results);
      }
      this.sub0(low, high, lowInclusive, highInclusive, node.left, results);
      results.push(node.value);
      this.sub0(low, high, lowInclusive, highInclusive, node.right, results);
    };
    BinaryTree2.prototype.head0 = function(value, inclusive, node, results) {
      if (node == null) {
        return;
      }
      var comp = this.compare(value, node.value);
      if (comp < 0 || comp == 0 && inclusive) {
        this.head0(value, inclusive, node.left, results);
        results.push(node.value);
        this.addAll0(node.right, results);
      } else if (comp > 0) {
        this.head0(value, inclusive, node.right, results);
      }
    };
    BinaryTree2.prototype.tail0 = function(value, inclusive, node, results) {
      if (node == null) {
        return;
      }
      var comp = this.compare(value, node.value);
      if (comp > 0 || comp == 0 && inclusive) {
        this.addAll0(node.left, results);
        results.push(node.value);
        this.tail0(value, inclusive, node.right, results);
      } else if (comp < 0) {
        this.tail0(value, inclusive, node.left, results);
      }
    };
    BinaryTree2.prototype.addAll0 = function(node, results) {
      if (node == null) {
        return;
      }
      this.addAll0(node.left, results);
      results.push(node.value);
      this.addAll0(node.right, results);
    };
    BinaryTree2.prototype.remove0 = function(value, node) {
      if (node == null) {
        return node;
      }
      var comp = this.compare(value, node.value);
      if (comp < 0) {
        node.left = this.remove0(value, node.left);
      } else if (comp > 0) {
        node.right = this.remove0(value, node.right);
      } else {
        if (node.isLeaf()) {
          return null;
        } else if (node.left == null) {
          var lower = node.getSuccessor();
          node.right = this.remove0(lower.value, node.right);
          node.value = lower.value;
        } else {
          var lower = node.getPredecessor();
          node.left = this.remove0(lower.value, node.left);
          node.value = lower.value;
        }
        this._size -= 1;
      }
      node = this.decreaseLevel0(node);
      node = this.skew0(node);
      node.right = this.skew0(node.right);
      if (node.right != null) {
        node.right.right = this.skew0(node.right.right);
      }
      node = this.split0(node);
      node.right = this.split0(node.right);
      return node;
    };
    BinaryTree2.prototype.level0 = function(node) {
      if (node == null) {
        return 0;
      } else {
        return node.level;
      }
    };
    BinaryTree2.prototype.decreaseLevel0 = function(node) {
      var correctLevel = Math.min(this.level0(node.left), this.level0(node.right)) + 1;
      if (correctLevel < node.level) {
        node.level = correctLevel;
        if (node.right != null && correctLevel < node.right.level) {
          node.right.level = correctLevel;
        }
      }
      return node;
    };
    BinaryTree2.prototype.insert0 = function(value, node) {
      if (node == null) {
        this._size += 1;
        return this.newTreeNode0(value);
      }
      var comp = this.compare(value, node.value);
      if (comp < 0) {
        node.left = this.insert0(value, node.left);
      } else if (comp > 0) {
        node.right = this.insert0(value, node.right);
      }
      node = this.skew0(node);
      node = this.split0(node);
      return node;
    };
    BinaryTree2.prototype.newTreeNode0 = function(value) {
      return new TreeNode(value);
    };
    BinaryTree2.prototype.skew0 = function(node) {
      if (node == null) {
        return null;
      } else if (node.left == null) {
        return node;
      } else if (node.left.level == node.level) {
        var left = node.left;
        node.left = left.right;
        left.right = node;
        return left;
      } else {
        return node;
      }
    };
    BinaryTree2.prototype.split0 = function(node) {
      if (node == null) {
        return null;
      } else if (node.right == null || node.right.right == null) {
        return node;
      } else if (node.level == node.right.right.level) {
        var right = node.right;
        node.right = right.left;
        right.left = node;
        right.level = right.level + 1;
        return right;
      } else {
        return node;
      }
    };
    return BinaryTree2;
  }();
  webglext2.BinaryTree = BinaryTree;
  var TreeNode = function() {
    function TreeNode2(value, level, left, right) {
      if (level === void 0) {
        level = 1;
      }
      if (left === void 0) {
        left = null;
      }
      if (right === void 0) {
        right = null;
      }
      this._level = level;
      this._right = right;
      this._left = left;
      this._value = value;
    }
    Object.defineProperty(TreeNode2.prototype, "level", {
      get: function() {
        return this._level;
      },
      set: function(level) {
        this._level = level;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TreeNode2.prototype, "right", {
      get: function() {
        return this._right;
      },
      set: function(node) {
        this._right = node;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TreeNode2.prototype, "left", {
      get: function() {
        return this._left;
      },
      set: function(node) {
        this._left = node;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TreeNode2.prototype, "value", {
      get: function() {
        return this._value;
      },
      set: function(value) {
        this._value = value;
      },
      enumerable: false,
      configurable: true
    });
    TreeNode2.prototype.isLeaf = function() {
      return this.right == null && this.left == null;
    };
    TreeNode2.prototype.getSuccessor = function() {
      var node = this.right;
      while (node != null && node.left != null) {
        node = node.left;
      }
      return node;
    };
    TreeNode2.prototype.getPredecessor = function() {
      var node = this.left;
      while (node != null && node.right != null) {
        node = node.right;
      }
      return node;
    };
    TreeNode2.prototype.toString = function() {
      return this.value.toString() + ":" + this.level.toString();
    };
    return TreeNode2;
  }();
  webglext2.TreeNode = TreeNode;
  var StringComparator = function() {
    function StringComparator2() {
    }
    StringComparator2.prototype.compare = function(value1, value2) {
      return value1.toLocaleLowerCase().localeCompare(value2.toLocaleLowerCase());
    };
    return StringComparator2;
  }();
  webglext2.StringComparator = StringComparator;
  var NumberComparator = function() {
    function NumberComparator2() {
    }
    NumberComparator2.prototype.compare = function(value1, value2) {
      return value1 - value2;
    };
    return NumberComparator2;
  }();
  webglext2.NumberComparator = NumberComparator;
  function createStringTree() {
    return new BinaryTree(new StringComparator());
  }
  webglext2.createStringTree = createStringTree;
  function createNumberTree() {
    return new BinaryTree(new NumberComparator());
  }
  webglext2.createNumberTree = createNumberTree;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var SortedMultimap = function() {
    function SortedMultimap2(comparator, idFn) {
      if (idFn === void 0) {
        idFn = webglext2.getObjectId;
      }
      this._tree = new webglext2.BinaryTree(this.createContainerComparator(comparator));
      this._idFn = idFn;
    }
    SortedMultimap2.prototype.createContainerComparator = function(comparator) {
      return {
        compare: function(container1, container2) {
          return comparator.compare(container1.key, container2.key);
        }
      };
    };
    SortedMultimap2.prototype.insert = function(key, value) {
      var wrappedKey = new Container(key);
      var values = this._tree.getValue(wrappedKey);
      if (values === null) {
        values = wrappedKey;
        this._tree.insert(values);
      }
      values.add(value, this._idFn);
    };
    SortedMultimap2.prototype.remove = function(key, value) {
      var wrappedKey = new Container(key);
      var values = this._tree.getValue(wrappedKey);
      if (values === null)
        return;
      values.remove(value, this._idFn);
      if (values.size === 0) {
        this._tree.remove(values);
      }
    };
    SortedMultimap2.prototype.contains = function(key, value) {
      var wrappedKey = new Container(key);
      var values = this._tree.getValue(wrappedKey);
      if (values === null) {
        return false;
      } else {
        return values.contains(value, this._idFn);
      }
    };
    SortedMultimap2.prototype.ceiling = function(key) {
      return this.unwrap(this._tree.ceiling(this.wrap(key)));
    };
    SortedMultimap2.prototype.floor = function(key) {
      return this.unwrap(this._tree.floor(this.wrap(key)));
    };
    SortedMultimap2.prototype.lower = function(key) {
      return this.unwrap(this._tree.lower(this.wrap(key)));
    };
    SortedMultimap2.prototype.higher = function(key) {
      return this.unwrap(this._tree.higher(this.wrap(key)));
    };
    SortedMultimap2.prototype.headSet = function(key, inclusive) {
      if (inclusive === void 0) {
        inclusive = true;
      }
      return this.unwrapArray(this._tree.headSet(this.wrap(key), inclusive));
    };
    SortedMultimap2.prototype.tailSet = function(key, inclusive) {
      if (inclusive === void 0) {
        inclusive = false;
      }
      return this.unwrapArray(this._tree.tailSet(this.wrap(key), inclusive));
    };
    SortedMultimap2.prototype.subSet = function(low, high, lowInclusive, highInclusive) {
      if (lowInclusive === void 0) {
        lowInclusive = true;
      }
      if (highInclusive === void 0) {
        highInclusive = false;
      }
      var wrappedLow = new Container(low);
      var wrappedHigh = new Container(high);
      var values = this._tree.subSet(wrappedLow, wrappedHigh, lowInclusive, highInclusive);
      return this.unwrapArray(values);
    };
    SortedMultimap2.prototype.toArray = function() {
      return this.unwrapArray(this._tree.toArray());
    };
    SortedMultimap2.prototype.iterator = function() {
      var iter = this._tree.iterator();
      var currentArray = null;
      var currentIndex = 0;
      return {
        next: function() {
          var value;
          if (currentArray == null || currentIndex >= currentArray.length) {
            currentArray = iter.next().toArray();
            currentIndex = 0;
            value = currentArray[currentIndex];
          } else {
            value = currentArray[currentIndex];
          }
          currentIndex += 1;
          return value;
        },
        hasNext: function() {
          return iter.hasNext() || currentArray != null && currentIndex < currentArray.length;
        }
      };
    };
    SortedMultimap2.prototype.wrap = function(key) {
      return new Container(key);
    };
    SortedMultimap2.prototype.unwrap = function(values) {
      if (values === null) {
        return [];
      } else {
        return values.toArray();
      }
    };
    SortedMultimap2.prototype.unwrapArray = function(values) {
      var unwrappedValues = new Array();
      values.forEach(function(value) {
        value.toArray().forEach(function(value2) {
          unwrappedValues.push(value2);
        });
      });
      return unwrappedValues;
    };
    return SortedMultimap2;
  }();
  webglext2.SortedMultimap = SortedMultimap;
  var SortedStringMultimap = function(_super) {
    __extends(SortedStringMultimap2, _super);
    function SortedStringMultimap2(comparator) {
      return _super.call(this, comparator, function(value) {
        return value;
      }) || this;
    }
    return SortedStringMultimap2;
  }(SortedMultimap);
  webglext2.SortedStringMultimap = SortedStringMultimap;
  var Container = function() {
    function Container2(key) {
      this._key = key;
      this._values = {};
    }
    Object.defineProperty(Container2.prototype, "size", {
      get: function() {
        return this.toArray().length;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Container2.prototype, "key", {
      get: function() {
        return this._key;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Container2.prototype, "values", {
      get: function() {
        return this._values;
      },
      enumerable: false,
      configurable: true
    });
    Container2.prototype.toArray = function() {
      var _this = this;
      return Object.keys(this._values).map(function(key) {
        return _this._values[key];
      });
    };
    Container2.prototype.contains = function(value, idFn) {
      return Object.prototype.hasOwnProperty.call(this._values, idFn(value));
    };
    Container2.prototype.add = function(value, idFn) {
      this._values[idFn(value)] = value;
    };
    Container2.prototype.remove = function(value, idFn) {
      delete this._values[idFn(value)];
    };
    return Container2;
  }();
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function initSplitContainer(container) {
    var tilesResized = new webglext2.Notification();
    _initSplitContainer(container, tilesResized);
    window.addEventListener("resize", function() {
      tilesResized.fire();
    });
    tilesResized.fire();
    return tilesResized;
  }
  webglext2.initSplitContainer = initSplitContainer;
  function _initSplitContainer(container, tilesResized) {
    var tileA = null;
    var tileB = null;
    var sep = null;
    var children = container.childNodes;
    for (var n = 0; n < children.length; n++) {
      var child = children[n];
      if (child.nodeType === 1 && child.classList) {
        var element = child;
        if (tileA == null) {
          if (element.classList.contains("splitContainerNS") || element.classList.contains("splitContainerEW") || element.classList.contains("splitTile")) {
            tileA = element;
          }
        } else if (sep == null) {
          if (element.classList.contains("splitSep")) {
            sep = element;
          }
        } else if (tileB == null) {
          if (element.classList.contains("splitContainerNS") || element.classList.contains("splitContainerEW") || element.classList.contains("splitTile")) {
            tileB = element;
          }
        } else {
          break;
        }
      }
    }
    if (tileA == null)
      throw new Error("Failed to init split-container: could not find first tile");
    if (sep == null)
      throw new Error("Failed to init split-container: could not find separator");
    if (tileB == null)
      throw new Error("Failed to init split-container: could not find second tile");
    if (container.classList.contains("splitContainerNS")) {
      _initSplitNS(container, tileA, sep, tileB, tilesResized);
    } else if (container.classList.contains("splitContainerEW")) {
      _initSplitEW(container, tileA, sep, tileB, tilesResized);
    }
    if (tileA.classList.contains("splitContainerNS") || tileA.classList.contains("splitContainerEW")) {
      _initSplitContainer(tileA, tilesResized);
    }
    if (tileB.classList.contains("splitContainerNS") || tileB.classList.contains("splitContainerEW")) {
      _initSplitContainer(tileB, tilesResized);
    }
  }
  function _initSplitNS(container, tileA, sep, tileB, tilesResized) {
    sep.classList.add("splitSepNS");
    sep.style.left = "0px";
    sep.style.right = "0px";
    tileA.style.left = "0px";
    tileA.style.right = "0px";
    tileB.style.left = "0px";
    tileB.style.right = "0px";
    var minHeightA = 1;
    var minHeightB = 1;
    var recentFracA = null;
    function layoutTiles(prelimHeightA) {
      var heightSep = sep.getBoundingClientRect().height;
      var heightContainer = container.getBoundingClientRect().height;
      var heightContent = heightContainer - heightSep;
      if (recentFracA == null) {
        recentFracA = tileA.getBoundingClientRect().height / heightContent;
      }
      var keepFracA = prelimHeightA == null;
      if (keepFracA) {
        prelimHeightA = Math.round(recentFracA * heightContent);
      }
      var maxHeightA = heightContainer - heightSep - minHeightB;
      var topA = 0;
      var heightA = Math.max(minHeightA, Math.min(maxHeightA, prelimHeightA));
      tileA.style.top = topA + "px";
      tileA.style.height = heightA + "px";
      var topSep = topA + heightA;
      sep.style.top = topSep + "px";
      sep.style.height = heightSep + "px";
      var topB = topSep + heightSep;
      var heightB = Math.max(minHeightB, heightContainer - topB);
      tileB.style.top = topB + "px";
      tileB.style.height = heightB + "px";
      if (!keepFracA && heightContent >= heightA && heightContent >= minHeightA + minHeightB) {
        recentFracA = heightA / heightContent;
      }
    }
    var sepGrab = null;
    sep.addEventListener("mousedown", function(ev) {
      if (ev.button === 0) {
        sepGrab = ev.clientY - tileA.getBoundingClientRect().top - tileA.getBoundingClientRect().height;
        ev.preventDefault();
      }
    });
    window.addEventListener("mousemove", function(ev) {
      if (sepGrab != null) {
        layoutTiles(ev.clientY - tileA.getBoundingClientRect().top - sepGrab);
        tilesResized.fire();
      }
    });
    window.addEventListener("mouseup", function(ev) {
      if (sepGrab != null && ev.button === 0) {
        layoutTiles(ev.clientY - tileA.getBoundingClientRect().top - sepGrab);
        tilesResized.fire();
        sepGrab = null;
      }
    });
    tilesResized.on(layoutTiles);
  }
  function _initSplitEW(container, tileA, sep, tileB, tilesResized) {
    sep.classList.add("splitSepEW");
    sep.style.top = "0px";
    sep.style.bottom = "0px";
    tileA.style.top = "0px";
    tileA.style.bottom = "0px";
    tileB.style.top = "0px";
    tileB.style.bottom = "0px";
    var minWidthA = 1;
    var minWidthB = 1;
    var recentFracA = null;
    function layoutTiles(prelimWidthA) {
      var widthSep = sep.getBoundingClientRect().width;
      var widthContainer = container.getBoundingClientRect().width;
      var widthContent = widthContainer - widthSep;
      if (recentFracA == null) {
        recentFracA = tileA.getBoundingClientRect().width / widthContent;
      }
      var keepFracA = prelimWidthA == null;
      if (keepFracA) {
        prelimWidthA = Math.round(recentFracA * widthContent);
      }
      var maxWidthA = widthContainer - widthSep - minWidthB;
      var leftA = 0;
      var widthA = Math.max(minWidthA, Math.min(maxWidthA, prelimWidthA));
      tileA.style.left = leftA + "px";
      tileA.style.width = widthA + "px";
      var leftSep = leftA + widthA;
      sep.style.left = leftSep + "px";
      sep.style.width = widthSep + "px";
      var leftB = leftSep + widthSep;
      var widthB = Math.max(minWidthB, widthContainer - leftB);
      tileB.style.left = leftB + "px";
      tileB.style.width = widthB + "px";
      if (!keepFracA && widthContent >= widthA && widthContent >= minWidthA + minWidthB) {
        recentFracA = widthA / widthContent;
      }
    }
    var sepGrab = null;
    sep.addEventListener("mousedown", function(ev) {
      if (ev.button === 0) {
        sepGrab = ev.clientX - tileA.getBoundingClientRect().left - tileA.getBoundingClientRect().width;
        ev.preventDefault();
      }
    });
    window.addEventListener("mousemove", function(ev) {
      if (sepGrab != null) {
        layoutTiles(ev.clientX - tileA.getBoundingClientRect().left - sepGrab);
        tilesResized.fire();
      }
    });
    window.addEventListener("mouseup", function(ev) {
      if (sepGrab != null && ev.button === 0) {
        layoutTiles(ev.clientX - tileA.getBoundingClientRect().left - sepGrab);
        tilesResized.fire();
        sepGrab = null;
      }
    });
    tilesResized.on(layoutTiles);
  }
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function newStaticBuffer(data) {
    return new StaticBufferImpl(data);
  }
  webglext2.newStaticBuffer = newStaticBuffer;
  function newDynamicBuffer(data) {
    if (data === void 0) {
      data = new Float32Array(0);
    }
    return new DynamicBufferImpl(data);
  }
  webglext2.newDynamicBuffer = newDynamicBuffer;
  var BufferEntry = function() {
    function BufferEntry2(gl, buffer) {
      this.capacity = 0;
      this.marker = null;
      this.gl = gl;
      this.buffer = buffer;
    }
    return BufferEntry2;
  }();
  var AbstractBuffer = function() {
    function AbstractBuffer2() {
      this.buffers = {};
      this.currentMarker = 0;
    }
    AbstractBuffer2.prototype.init = function(gl, target) {
      throw new Error("Method is abstract");
    };
    AbstractBuffer2.prototype.update = function(gl, target, capacity) {
      throw new Error("Method is abstract");
    };
    AbstractBuffer2.prototype.setDirty = function() {
      this.currentMarker++;
    };
    AbstractBuffer2.prototype.bind = function(gl, target) {
      var glId = webglext2.getObjectId(gl);
      if (this.buffers[glId] === void 0) {
        var buffer = gl.createBuffer();
        if (!webglext2.isNotEmpty(buffer))
          throw new Error("Failed to create buffer");
        this.buffers[glId] = new BufferEntry(gl, buffer);
        gl.bindBuffer(target, this.buffers[glId].buffer);
        this.buffers[glId].capacity = this.init(gl, target);
        this.buffers[glId].marker = this.currentMarker;
      } else if (this.buffers[glId].marker !== this.currentMarker) {
        gl.bindBuffer(target, this.buffers[glId].buffer);
        this.buffers[glId].capacity = this.update(gl, target, this.buffers[glId].capacity);
        this.buffers[glId].marker = this.currentMarker;
      } else {
        gl.bindBuffer(target, this.buffers[glId].buffer);
      }
    };
    AbstractBuffer2.prototype.unbind = function(gl, target) {
      gl.bindBuffer(target, null);
    };
    AbstractBuffer2.prototype.dispose = function() {
      for (var glid in this.buffers) {
        if (this.buffers.hasOwnProperty(glid)) {
          var en = this.buffers[glid];
          en.gl.deleteBuffer(en.buffer);
        }
      }
      this.buffers = {};
    };
    return AbstractBuffer2;
  }();
  var StaticBufferImpl = function(_super) {
    __extends(StaticBufferImpl2, _super);
    function StaticBufferImpl2(data) {
      var _this = _super.call(this) || this;
      _this._data = data;
      return _this;
    }
    StaticBufferImpl2.prototype.init = function(gl, target) {
      gl.bufferData(target, this._data, webglext2.GL.STATIC_DRAW);
      return this._data.byteLength;
    };
    StaticBufferImpl2.prototype.update = function(gl, target, capacity) {
      throw new Error("This buffer need not to update because it is STATIC_ROW");
    };
    return StaticBufferImpl2;
  }(AbstractBuffer);
  var DynamicBufferImpl = function(_super) {
    __extends(DynamicBufferImpl2, _super);
    function DynamicBufferImpl2(data) {
      var _this = _super.call(this) || this;
      _this._data = data;
      return _this;
    }
    DynamicBufferImpl2.prototype.setData = function(data) {
      this._data = data;
      this.setDirty();
    };
    DynamicBufferImpl2.prototype.init = function(gl, target) {
      gl.bufferData(target, this._data, webglext2.GL.DYNAMIC_DRAW);
      return this._data.byteLength;
    };
    DynamicBufferImpl2.prototype.update = function(gl, target, capacity) {
      if (this._data.byteLength <= capacity) {
        gl.bufferSubData(target, 0, this._data);
        return capacity;
      } else {
        gl.bufferData(target, this._data, webglext2.GL.DYNAMIC_DRAW);
        return this._data.byteLength;
      }
    };
    return DynamicBufferImpl2;
  }(AbstractBuffer);
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function compileShader(gl, shaderType, glsl) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, glsl);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, webglext2.GL.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }
  function linkProgram(gl, shaders) {
    var program = gl.createProgram();
    for (var i = 0; i < shaders.length; i++) {
      gl.attachShader(program, shaders[i]);
    }
    try {
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, webglext2.GL.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(program));
      return program;
    } finally {
    }
  }
  function createProgram(gl, vertShaderSource, fragShaderSource) {
    var shaders = [];
    try {
      shaders.push(compileShader(gl, webglext2.GL.VERTEX_SHADER, vertShaderSource));
      shaders.push(compileShader(gl, webglext2.GL.FRAGMENT_SHADER, fragShaderSource));
      return linkProgram(gl, shaders);
    } finally {
    }
  }
  var ProgramEntry = function() {
    function ProgramEntry2(gl, program) {
      this.gl = gl;
      this.program = program;
    }
    return ProgramEntry2;
  }();
  var Program = function() {
    function Program2(vertShaderSource, fragShaderSource) {
      this.programs = {};
      this.vertShaderSource = vertShaderSource;
      this.fragShaderSource = fragShaderSource;
    }
    Program2.prototype._program = function(gl) {
      var glId = webglext2.getObjectId(gl);
      if (this.programs[glId] === void 0) {
        var program = createProgram(gl, this.vertShaderSource, this.fragShaderSource);
        this.programs[glId] = new ProgramEntry(gl, program);
      }
      return this.programs[glId].program;
    };
    Program2.prototype.use = function(gl) {
      gl.useProgram(this._program(gl));
    };
    Program2.prototype.endUse = function(gl) {
      gl.useProgram(null);
    };
    Program2.prototype.dispose = function() {
      for (var glid in this.programs) {
        if (this.programs.hasOwnProperty(glid)) {
          var en = this.programs[glid];
          en.gl.deleteProgram(en.program);
        }
      }
      this.programs = {};
    };
    return Program2;
  }();
  webglext2.Program = Program;
  var Uniform = function() {
    function Uniform2(program, name, optional) {
      this.locations = {};
      this.program = program;
      this.name = name;
      this.optional = optional;
    }
    Uniform2.prototype._location = function(gl) {
      var glId = webglext2.getObjectId(gl);
      if (this.locations[glId] === void 0) {
        var location = gl.getUniformLocation(this.program._program(gl), this.name);
        if (!this.optional && !webglext2.isNotEmpty(location))
          throw new Error("Uniform '" + this.name + "' not found");
        this.locations[glId] = location;
      }
      return this.locations[glId];
    };
    return Uniform2;
  }();
  webglext2.Uniform = Uniform;
  var Uniform1f = function(_super) {
    __extends(Uniform1f2, _super);
    function Uniform1f2(program, name, optional) {
      if (optional === void 0) {
        optional = false;
      }
      return _super.call(this, program, name, optional) || this;
    }
    Uniform1f2.prototype.setData = function(gl, x) {
      var location = this._location(gl);
      if (webglext2.isNotEmpty(location))
        gl.uniform1f(location, x);
    };
    return Uniform1f2;
  }(Uniform);
  webglext2.Uniform1f = Uniform1f;
  var Uniform2f = function(_super) {
    __extends(Uniform2f2, _super);
    function Uniform2f2(program, name, optional) {
      if (optional === void 0) {
        optional = false;
      }
      return _super.call(this, program, name, optional) || this;
    }
    Uniform2f2.prototype.setData = function(gl, x, y) {
      var location = this._location(gl);
      if (webglext2.isNotEmpty(location))
        gl.uniform2f(location, x, y);
    };
    return Uniform2f2;
  }(Uniform);
  webglext2.Uniform2f = Uniform2f;
  var Uniform3f = function(_super) {
    __extends(Uniform3f2, _super);
    function Uniform3f2(program, name, optional) {
      if (optional === void 0) {
        optional = false;
      }
      return _super.call(this, program, name, optional) || this;
    }
    Uniform3f2.prototype.setData = function(gl, x, y, z) {
      var location = this._location(gl);
      if (webglext2.isNotEmpty(location))
        gl.uniform3f(location, x, y, z);
    };
    return Uniform3f2;
  }(Uniform);
  webglext2.Uniform3f = Uniform3f;
  var Uniform4f = function(_super) {
    __extends(Uniform4f2, _super);
    function Uniform4f2(program, name, optional) {
      if (optional === void 0) {
        optional = false;
      }
      return _super.call(this, program, name, optional) || this;
    }
    Uniform4f2.prototype.setData = function(gl, x, y, z, w) {
      var location = this._location(gl);
      if (webglext2.isNotEmpty(location))
        gl.uniform4f(location, x, y, z, w);
    };
    return Uniform4f2;
  }(Uniform);
  webglext2.Uniform4f = Uniform4f;
  var UniformMatrix4f = function(_super) {
    __extends(UniformMatrix4f2, _super);
    function UniformMatrix4f2(program, name, optional) {
      if (optional === void 0) {
        optional = false;
      }
      return _super.call(this, program, name, optional) || this;
    }
    UniformMatrix4f2.prototype.setData = function(gl, value, transpose) {
      if (transpose === void 0) {
        transpose = false;
      }
      var location = this._location(gl);
      if (webglext2.isNotEmpty(location))
        gl.uniformMatrix4fv(location, transpose, value);
    };
    return UniformMatrix4f2;
  }(Uniform);
  webglext2.UniformMatrix4f = UniformMatrix4f;
  var Uniform1i = function(_super) {
    __extends(Uniform1i2, _super);
    function Uniform1i2(program, name, optional) {
      if (optional === void 0) {
        optional = false;
      }
      return _super.call(this, program, name, optional) || this;
    }
    Uniform1i2.prototype.setData = function(gl, x) {
      var location = this._location(gl);
      if (webglext2.isNotEmpty(location))
        gl.uniform1i(location, x);
    };
    return Uniform1i2;
  }(Uniform);
  webglext2.Uniform1i = Uniform1i;
  var Uniform2i = function(_super) {
    __extends(Uniform2i2, _super);
    function Uniform2i2(program, name, optional) {
      if (optional === void 0) {
        optional = false;
      }
      return _super.call(this, program, name, optional) || this;
    }
    Uniform2i2.prototype.setData = function(gl, x, y) {
      var location = this._location(gl);
      if (webglext2.isNotEmpty(location))
        gl.uniform2i(location, x, y);
    };
    return Uniform2i2;
  }(Uniform);
  webglext2.Uniform2i = Uniform2i;
  var Uniform3i = function(_super) {
    __extends(Uniform3i2, _super);
    function Uniform3i2(program, name, optional) {
      if (optional === void 0) {
        optional = false;
      }
      return _super.call(this, program, name, optional) || this;
    }
    Uniform3i2.prototype.setData = function(gl, x, y, z) {
      var location = this._location(gl);
      if (webglext2.isNotEmpty(location))
        gl.uniform3i(location, x, y, z);
    };
    return Uniform3i2;
  }(Uniform);
  webglext2.Uniform3i = Uniform3i;
  var Uniform4i = function(_super) {
    __extends(Uniform4i2, _super);
    function Uniform4i2(program, name, optional) {
      if (optional === void 0) {
        optional = false;
      }
      return _super.call(this, program, name, optional) || this;
    }
    Uniform4i2.prototype.setData = function(gl, x, y, z, w) {
      var location = this._location(gl);
      if (webglext2.isNotEmpty(location))
        gl.uniform4i(location, x, y, z, w);
    };
    return Uniform4i2;
  }(Uniform);
  webglext2.Uniform4i = Uniform4i;
  var UniformColor = function(_super) {
    __extends(UniformColor2, _super);
    function UniformColor2(program, name, optional) {
      if (optional === void 0) {
        optional = false;
      }
      return _super.call(this, program, name, optional) || this;
    }
    UniformColor2.prototype.setData = function(gl, color) {
      var location = this._location(gl);
      if (webglext2.isNotEmpty(location))
        gl.uniform4f(location, color.r, color.g, color.b, color.a);
    };
    return UniformColor2;
  }(Uniform);
  webglext2.UniformColor = UniformColor;
  var UniformSampler2D = function(_super) {
    __extends(UniformSampler2D2, _super);
    function UniformSampler2D2(program, name, optional) {
      if (optional === void 0) {
        optional = false;
      }
      return _super.call(this, program, name, optional) || this;
    }
    UniformSampler2D2.prototype.setDataAndBind = function(gl, textureUnit, texture) {
      var location = this._location(gl);
      if (webglext2.isNotEmpty(location)) {
        texture.bind(gl, textureUnit);
        gl.uniform1i(location, textureUnit);
        this.currentTexture = texture;
      }
    };
    UniformSampler2D2.prototype.unbind = function(gl) {
      if (webglext2.isNotEmpty(this.currentTexture)) {
        this.currentTexture.unbind(gl);
        this.currentTexture = null;
      }
    };
    return UniformSampler2D2;
  }(Uniform);
  webglext2.UniformSampler2D = UniformSampler2D;
  var Attribute = function() {
    function Attribute2(program, name) {
      this.locations = {};
      this.program = program;
      this.name = name;
    }
    Attribute2.prototype._location = function(gl) {
      var glId = webglext2.getObjectId(gl);
      if (this.locations[glId] === void 0) {
        var location = gl.getAttribLocation(this.program._program(gl), this.name);
        if (location === -1)
          throw new Error('Attribute "' + this.name + '" not found');
        this.locations[glId] = location;
      }
      return this.locations[glId];
    };
    Attribute2.prototype.setDataAndEnable = function(gl, buffer, size, type, normalized, stride, offset) {
      if (normalized === void 0) {
        normalized = false;
      }
      if (stride === void 0) {
        stride = 0;
      }
      if (offset === void 0) {
        offset = 0;
      }
      var location = this._location(gl);
      gl.enableVertexAttribArray(location);
      buffer.bind(gl, webglext2.GL.ARRAY_BUFFER);
      gl.vertexAttribPointer(location, size, type, normalized, stride, offset);
      buffer.unbind(gl, webglext2.GL.ARRAY_BUFFER);
    };
    Attribute2.prototype.disable = function(gl) {
      gl.disableVertexAttribArray(this._location(gl));
    };
    return Attribute2;
  }();
  webglext2.Attribute = Attribute;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var TextureEntry = function() {
    function TextureEntry2(gl, target, texture) {
      this.gl = gl;
      this.target = target;
      this.texture = texture;
      this.textureUnit = -1;
    }
    return TextureEntry2;
  }();
  var Texture = function() {
    function Texture2(helper) {
      this.helper = helper;
      this.textures = {};
    }
    Texture2.prototype.bind = function(gl, textureUnit) {
      var glId = webglext2.getObjectId(gl);
      if (webglext2.isNotEmpty(this.textures[glId])) {
        var en = this.textures[glId];
        gl.activeTexture(webglext2.GL.TEXTURE0 + textureUnit);
        gl.bindTexture(en.target, en.texture);
        en.textureUnit = textureUnit;
      } else {
        var target = this.helper.target(gl);
        var texture = gl.createTexture();
        if (!webglext2.isNotEmpty(texture))
          throw new Error("Failed to create texture");
        this.textures[glId] = new TextureEntry(gl, target, texture);
        var en = this.textures[glId];
        gl.activeTexture(webglext2.GL.TEXTURE0 + textureUnit);
        gl.bindTexture(en.target, en.texture);
        en.textureUnit = textureUnit;
        this.helper.init(gl, target);
      }
    };
    Texture2.prototype.unbind = function(gl) {
      var glId = webglext2.getObjectId(gl);
      if (webglext2.isNotEmpty(this.textures[glId])) {
        var en = this.textures[glId];
        gl.activeTexture(webglext2.GL.TEXTURE0 + en.textureUnit);
        gl.bindTexture(en.target, null);
        en.textureUnit = -1;
      }
    };
    Texture2.prototype.dispose = function() {
      for (var glid in this.textures) {
        if (this.textures.hasOwnProperty(glid)) {
          var en = this.textures[glid];
          en.gl.deleteTexture(en.texture);
        }
      }
      this.textures = {};
    };
    return Texture2;
  }();
  webglext2.Texture = Texture;
  var FloatDataTexture2D = function(_super) {
    __extends(FloatDataTexture2D2, _super);
    function FloatDataTexture2D2(w, h, array) {
      var _this = _super.call(this, {
        target: function(gl) {
          return webglext2.GL.TEXTURE_2D;
        },
        init: function(gl, target) {
          if (!gl.getExtension("OES_texture_float")) {
            throw new Error("OES_texture_float extension is required");
          }
          gl.texParameteri(target, webglext2.GL.TEXTURE_MAG_FILTER, webglext2.GL.NEAREST);
          gl.texParameteri(target, webglext2.GL.TEXTURE_MIN_FILTER, webglext2.GL.NEAREST);
          gl.texParameteri(target, webglext2.GL.TEXTURE_WRAP_S, webglext2.GL.CLAMP_TO_EDGE);
          gl.texParameteri(target, webglext2.GL.TEXTURE_WRAP_T, webglext2.GL.CLAMP_TO_EDGE);
          gl.texImage2D(target, 0, webglext2.GL.RGBA, w, h, 0, webglext2.GL.RGBA, webglext2.GL.FLOAT, array);
        }
      }) || this;
      _this._w = w;
      _this._h = h;
      return _this;
    }
    Object.defineProperty(FloatDataTexture2D2.prototype, "w", {
      get: function() {
        return this._w;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(FloatDataTexture2D2.prototype, "h", {
      get: function() {
        return this._h;
      },
      enumerable: false,
      configurable: true
    });
    return FloatDataTexture2D2;
  }(Texture);
  webglext2.FloatDataTexture2D = FloatDataTexture2D;
  var Texture2D = function(_super) {
    __extends(Texture2D2, _super);
    function Texture2D2(w, h, minFilter, magFilter, draw) {
      var _this = this;
      var canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      draw(canvas.getContext("2d"));
      _this = _super.call(this, {
        target: function(gl) {
          return webglext2.GL.TEXTURE_2D;
        },
        init: function(gl, target) {
          gl.texParameteri(target, webglext2.GL.TEXTURE_MAG_FILTER, magFilter);
          gl.texParameteri(target, webglext2.GL.TEXTURE_MIN_FILTER, minFilter);
          gl.texParameteri(target, webglext2.GL.TEXTURE_WRAP_S, webglext2.GL.CLAMP_TO_EDGE);
          gl.texParameteri(target, webglext2.GL.TEXTURE_WRAP_T, webglext2.GL.CLAMP_TO_EDGE);
          gl.texImage2D(target, 0, webglext2.GL.RGBA, webglext2.GL.RGBA, webglext2.GL.UNSIGNED_BYTE, canvas);
        }
      }) || this;
      _this._w = w;
      _this._h = h;
      return _this;
    }
    Object.defineProperty(Texture2D2.prototype, "w", {
      get: function() {
        return this._w;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Texture2D2.prototype, "h", {
      get: function() {
        return this._h;
      },
      enumerable: false,
      configurable: true
    });
    return Texture2D2;
  }(Texture);
  webglext2.Texture2D = Texture2D;
  var TextureRenderer = function() {
    function TextureRenderer2() {
      this.textureRenderer_VERTSHADER = webglext2.concatLines("                                                                                                                 ", "  uniform vec2 u_XyFrac;                                                                                         ", "  uniform vec2 u_Anchor;                                                                                         ", "  uniform float u_Rotation_CCWRAD;                                                                               ", "  uniform vec2 u_ImageSize;                                                                                      ", "  uniform vec2 u_ViewportSize;                                                                                   ", "                                                                                                                 ", "  attribute vec2 a_ImageFrac;                                                                                    ", "                                                                                                                 ", "  varying vec2 v_StCoord;                                                                                        ", "                                                                                                                 ", "  void main( ) {                                                                                                 ", "      float cosRot = cos( u_Rotation_CCWRAD );                                                                   ", "      float sinRot = sin( u_Rotation_CCWRAD );                                                                   ", "                                                                                                                 ", "      // Column major                                                                                            ", "      mat2 rotation = mat2( cosRot, sinRot,                                                                      ", "                           -sinRot, cosRot );                                                                    ", "                                                                                                                 ", "      vec2 xy = -1.0 + 2.0*( u_XyFrac + rotation*( u_ImageSize*( a_ImageFrac - u_Anchor ) ) / u_ViewportSize );  ", "      gl_Position = vec4( xy, 0.0, 1.0 );                                                                        ", "                                                                                                                 ", "      v_StCoord = vec2( a_ImageFrac.x, 1.0 - a_ImageFrac.y );                                                    ", "  }                                                                                                              ", "                                                                                                                 ");
      this.textureRenderer_FRAGSHADER = webglext2.concatLines("                                                         ", "  precision mediump float;                               ", "                                                         ", "  uniform sampler2D u_Sampler;                           ", "                                                         ", "  varying vec2 v_StCoord;                                ", "                                                         ", "  void main( ) {                                         ", "      gl_FragColor = texture2D( u_Sampler, v_StCoord );  ", "  }                                                      ", "                                                         ");
      this.program = new webglext2.Program(this.textureRenderer_VERTSHADER, this.textureRenderer_FRAGSHADER);
      this.u_XyFrac = new webglext2.Uniform2f(this.program, "u_XyFrac");
      this.u_Anchor = new webglext2.Uniform2f(this.program, "u_Anchor");
      this.u_Rotation_CCWRAD = new webglext2.Uniform1f(this.program, "u_Rotation_CCWRAD");
      this.u_ImageSize = new webglext2.Uniform2f(this.program, "u_ImageSize");
      this.u_ViewportSize = new webglext2.Uniform2f(this.program, "u_ViewportSize");
      this.u_Sampler = new webglext2.UniformSampler2D(this.program, "u_Sampler");
      this.a_ImageFrac = new webglext2.Attribute(this.program, "a_ImageFrac");
      this.imageFracData = webglext2.newStaticBuffer(new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]));
      this.wViewport = 0;
      this.hViewport = 0;
    }
    TextureRenderer2.prototype.begin = function(gl, viewport) {
      gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
      gl.enable(webglext2.GL.BLEND);
      this.program.use(gl);
      this.u_ViewportSize.setData(gl, viewport.w, viewport.h);
      this.a_ImageFrac.setDataAndEnable(gl, this.imageFracData, 2, webglext2.GL.FLOAT);
      this.wViewport = viewport.w;
      this.hViewport = viewport.h;
    };
    TextureRenderer2.prototype.draw = function(gl, texture, xFrac, yFrac, options) {
      var xAnchor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.xAnchor) ? options.xAnchor : 0.5;
      var yAnchor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.yAnchor) ? options.yAnchor : 0.5;
      var rotation_CCWRAD = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.rotation_CCWRAD) ? options.rotation_CCWRAD : 0;
      var width = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.width) ? options.width : texture.w;
      var height = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.height) ? options.height : texture.h;
      this.u_XyFrac.setData(gl, webglext2.nearestPixel(xFrac, this.wViewport, xAnchor, texture.w), webglext2.nearestPixel(yFrac, this.hViewport, yAnchor, texture.h));
      this.u_Anchor.setData(gl, xAnchor, yAnchor);
      this.u_Rotation_CCWRAD.setData(gl, rotation_CCWRAD);
      this.u_ImageSize.setData(gl, width, height);
      this.u_Sampler.setDataAndBind(gl, 0, texture);
      gl.drawArrays(webglext2.GL.TRIANGLE_STRIP, 0, 4);
    };
    TextureRenderer2.prototype.end = function(gl) {
      this.a_ImageFrac.disable(gl);
      this.u_Sampler.unbind(gl);
      this.program.endUse(gl);
    };
    return TextureRenderer2;
  }();
  webglext2.TextureRenderer = TextureRenderer;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var textDim = function() {
    var div = document.createElement("div");
    div.style.setProperty("position", "absolute");
    div.style.setProperty("padding", "0");
    div.style.setProperty("margin", "0");
    div.style.setProperty("width", "auto");
    div.style.setProperty("height", "auto");
    div.style.setProperty("visibility", "hidden");
    return function(s, font) {
      div.style.setProperty("font", font);
      div.textContent = s;
      document.body.appendChild(div);
      var width = div.clientWidth;
      var height = div.clientHeight;
      document.body.removeChild(div);
      return { w: width, h: height };
    };
  }();
  function newFontMetricsCache() {
    return new webglext2.Cache({
      create: function(font) {
        var dim = textDim("fMgyj", font);
        var w = dim.w;
        var h = dim.h;
        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        var g = canvas.getContext("2d");
        g.font = font;
        g.textAlign = "left";
        g.textBaseline = "top";
        g.fillStyle = "black";
        g.clearRect(0, 0, w, h);
        g.fillText("fM", 0, 0);
        var rgbaData = g.getImageData(0, 0, w, h).data;
        var jTop = -1;
        for (var j = 0; j < h && jTop < 0; j++) {
          for (var i = 0; i < w && jTop < 0; i++) {
            var alpha = rgbaData[(j * w + i) * 4 + 3];
            if (alpha !== 0)
              jTop = j;
          }
        }
        var jBaseline = -1;
        for (var j = h - 1; j >= 0 && jBaseline < 0; j--) {
          for (var i = 0; i < w && jBaseline < 0; i++) {
            var alpha = rgbaData[(j * w + i) * 4 + 3];
            if (alpha !== 0)
              jBaseline = j;
          }
        }
        g.clearRect(0, 0, w, h);
        g.fillText("gyj", 0, 0);
        var rgbaData = g.getImageData(0, 0, w, h).data;
        var jBottom = -1;
        for (var j = h - 1; j >= 0 && jBottom < 0; j--) {
          for (var i = 0; i < w && jBottom < 0; i++) {
            var alpha = rgbaData[(j * w + i) * 4 + 3];
            if (alpha !== 0)
              jBottom = j;
          }
        }
        return { jTop, jBaseline, jBottom };
      },
      dispose: function() {
      }
    });
  }
  var getRawFontMetrics = function() {
    var cache = newFontMetricsCache();
    return function(font) {
      return cache.value(font);
    };
  }();
  var getTextWidth = function() {
    var canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    var g = canvas.getContext("2d");
    g.textAlign = "left";
    g.textBaseline = "top";
    return function(font, text) {
      g.font = font;
      return g.measureText(text).width;
    };
  }();
  var TextTexture2D = function(_super) {
    __extends(TextTexture2D2, _super);
    function TextTexture2D2(w, h, jBaseline, minFilter, magFilter, draw) {
      var _this = _super.call(this, w, h, minFilter, magFilter, draw) || this;
      _this._jBaseline = jBaseline;
      return _this;
    }
    Object.defineProperty(TextTexture2D2.prototype, "jBaseline", {
      get: function() {
        return this._jBaseline;
      },
      enumerable: false,
      configurable: true
    });
    TextTexture2D2.prototype.yAnchor = function(textFrac) {
      var bottom = this.jBaseline + 1;
      var h = this.h;
      return 1 - (1 - textFrac) * bottom / h;
    };
    return TextTexture2D2;
  }(webglext2.Texture2D);
  webglext2.TextTexture2D = TextTexture2D;
  function newTextTextureCache(font, color) {
    var createTextTexture = createTextTextureFactory(font);
    return new webglext2.Cache({
      create: function(text) {
        return createTextTexture(color, text);
      },
      dispose: function(texture) {
        texture.dispose();
      }
    });
  }
  webglext2.newTextTextureCache = newTextTextureCache;
  function newTextTextureCache2(font) {
    var createTextTexture = createTextTextureFactory(font);
    return new webglext2.TwoKeyCache({
      create: function(rgbaString, text) {
        var color = webglext2.parseRgba(rgbaString);
        return createTextTexture(color, text);
      },
      dispose: function(texture) {
        texture.dispose();
      }
    });
  }
  webglext2.newTextTextureCache2 = newTextTextureCache2;
  function newTextTextureCache3() {
    return new webglext2.ThreeKeyCache({
      create: function(font, rgbaString, text) {
        var createTextTexture = createTextTextureFactory(font);
        var color = webglext2.parseRgba(rgbaString);
        return createTextTexture(color, text);
      },
      dispose: function(texture) {
        texture.dispose();
      }
    });
  }
  webglext2.newTextTextureCache3 = newTextTextureCache3;
  function createTextTextureFactory(font) {
    var rawFontMetrics = getRawFontMetrics(font);
    var jBaseline = rawFontMetrics.jBaseline - rawFontMetrics.jTop;
    var h = rawFontMetrics.jBottom - rawFontMetrics.jTop + 1;
    return function(color, text) {
      var w = getTextWidth(font, text);
      return new TextTexture2D(w, h, jBaseline, webglext2.GL.NEAREST, webglext2.GL.NEAREST, function(g) {
        g.fillStyle = "black";
        g.fillRect(0, 0, w, h);
        g.font = font;
        g.textAlign = "left";
        g.textBaseline = "top";
        g.fillStyle = "white";
        g.save();
        g.translate(0, -rawFontMetrics.jTop);
        g.fillText(text, 0, 0);
        g.restore();
        var r255 = 255 * color.r;
        var g255 = 255 * color.g;
        var b255 = 255 * color.b;
        var aFactor = color.a / 3;
        var pixels = g.getImageData(0, 0, w, h);
        for (var j = 0; j < pixels.height; j++) {
          for (var i = 0; i < pixels.width; i++) {
            var pixelOffset = (j * pixels.width + i) * 4;
            var a255 = aFactor * (pixels.data[pixelOffset + 0] + pixels.data[pixelOffset + 1] + pixels.data[pixelOffset + 2]);
            pixels.data[pixelOffset + 0] = r255;
            pixels.data[pixelOffset + 1] = g255;
            pixels.data[pixelOffset + 2] = b255;
            pixels.data[pixelOffset + 3] = a255;
          }
        }
        g.putImageData(pixels, 0, 0);
      });
    };
  }
  webglext2.createTextTextureFactory = createTextTextureFactory;
  function newTextHintsCache(font) {
    var rawFontMetrics = getRawFontMetrics(font);
    var jBaseline = rawFontMetrics.jBaseline - rawFontMetrics.jTop;
    var h = rawFontMetrics.jBottom - rawFontMetrics.jTop + 1;
    return new webglext2.Cache({
      create: function(text) {
        var w = getTextWidth(font, text);
        var canvas3 = document.createElement("canvas");
        canvas3.width = 3 * w;
        canvas3.height = h;
        var g3 = canvas3.getContext("2d");
        g3.fillStyle = "black";
        g3.fillRect(0, 0, canvas3.width, canvas3.height);
        g3.save();
        g3.translate(0, -rawFontMetrics.jTop);
        g3.scale(3, 1);
        g3.font = font;
        g3.textAlign = "left";
        g3.textBaseline = "top";
        g3.fillStyle = "white";
        g3.fillText(text, 0, 0);
        g3.restore();
        var srcRgba = g3.getImageData(0, 0, canvas3.width, canvas3.height).data;
        return new webglext2.Texture2D(w, h, webglext2.GL.NEAREST, webglext2.GL.NEAREST, function(g) {
          var destImage = g.createImageData(w, h);
          var destRgba = destImage.data;
          var weightLeft = 1;
          var weightCenter = 2;
          var weightRight = 1;
          var weightNorm = 1 / (weightLeft + weightCenter + weightRight);
          for (var j = 0; j < h; j++) {
            for (var i = 0; i < w; i++) {
              var srcPixelIndex = (j * 3 * w + 3 * i) * 4;
              var srcAlphaL = i > 0 ? (srcRgba[srcPixelIndex - 4] + srcRgba[srcPixelIndex - 3] + srcRgba[srcPixelIndex - 2]) / (3 * 255) : 0;
              var srcAlpha0 = (srcRgba[srcPixelIndex + 0] + srcRgba[srcPixelIndex + 1] + srcRgba[srcPixelIndex + 2]) / (3 * 255);
              var srcAlpha1 = (srcRgba[srcPixelIndex + 4] + srcRgba[srcPixelIndex + 5] + srcRgba[srcPixelIndex + 6]) / (3 * 255);
              var srcAlpha2 = (srcRgba[srcPixelIndex + 8] + srcRgba[srcPixelIndex + 9] + srcRgba[srcPixelIndex + 10]) / (3 * 255);
              var srcAlphaR = i < w - 1 ? (srcRgba[srcPixelIndex + 12] + srcRgba[srcPixelIndex + 13] + srcRgba[srcPixelIndex + 14]) / (3 * 255) : 0;
              var alphaLeft = weightNorm * (weightLeft * srcAlphaL + weightCenter * srcAlpha0 + weightRight * srcAlpha1);
              var alphaCenter = weightNorm * (weightLeft * srcAlpha0 + weightCenter * srcAlpha1 + weightRight * srcAlpha2);
              var alphaRight = weightNorm * (weightLeft * srcAlpha1 + weightCenter * srcAlpha2 + weightRight * srcAlphaR);
              var destPixelIndex = (j * w + i) * 4;
              destRgba[destPixelIndex + 0] = Math.round(255 * alphaLeft);
              destRgba[destPixelIndex + 1] = Math.round(255 * alphaCenter);
              destRgba[destPixelIndex + 2] = Math.round(255 * alphaRight);
              var alphaAvg = Math.round(255 * (alphaLeft + alphaCenter + alphaRight) / 3);
              destRgba[destPixelIndex + 3] = alphaAvg === 1 ? 0 : alphaAvg;
            }
          }
          g.putImageData(destImage, 0, 0);
        });
      },
      dispose: function(texture) {
        texture.dispose();
      }
    });
  }
  webglext2.newTextHintsCache = newTextHintsCache;
  var HintedTextRenderer = function() {
    function HintedTextRenderer2() {
      this.textRenderer_VERTSHADER = webglext2.concatLines("                                                                                                  ", "  uniform vec2 u_XyFrac;                                                                          ", "  uniform vec2 u_Anchor;                                                                          ", "  uniform vec2 u_ImageSize;                                                                       ", "  uniform vec2 u_ViewportSize;                                                                    ", "                                                                                                  ", "  attribute vec2 a_ImageFrac;                                                                     ", "                                                                                                  ", "  varying vec2 v_StCoord;                                                                         ", "                                                                                                  ", "  void main( ) {                                                                                  ", "      vec2 xy = -1.0 + 2.0*( u_XyFrac + u_ImageSize*( a_ImageFrac - u_Anchor )/u_ViewportSize );  ", "      gl_Position = vec4( xy, 0.0, 1.0 );                                                         ", "                                                                                                  ", "      v_StCoord = vec2( a_ImageFrac.x, 1.0 - a_ImageFrac.y );                                     ", "  }                                                                                               ", "                                                                                                  ");
      this.textRenderer_FRAGSHADER = webglext2.concatLines("                                                                 ", "  precision mediump float;                                       ", "                                                                 ", "  uniform sampler2D u_Hints;                                     ", "  uniform float u_Alpha;                                         ", "                                                                 ", "  varying vec2 v_StCoord;                                        ", "                                                                 ", "  void main( ) {                                                 ", "      gl_FragColor = u_Alpha * texture2D( u_Hints, v_StCoord );  ", "  }                                                              ", "                                                                 ");
      this.program = new webglext2.Program(this.textRenderer_VERTSHADER, this.textRenderer_FRAGSHADER);
      this.u_XyFrac = new webglext2.Uniform2f(this.program, "u_XyFrac");
      this.u_Anchor = new webglext2.Uniform2f(this.program, "u_Anchor");
      this.u_ImageSize = new webglext2.Uniform2f(this.program, "u_ImageSize");
      this.u_ViewportSize = new webglext2.Uniform2f(this.program, "u_ViewportSize");
      this.u_Alpha = new webglext2.Uniform1f(this.program, "u_Alpha");
      this.u_Hints = new webglext2.UniformSampler2D(this.program, "u_Hints");
      this.a_ImageFrac = new webglext2.Attribute(this.program, "a_ImageFrac");
      this.imageFracData = webglext2.newStaticBuffer(new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]));
      this.wViewport = 0;
      this.hViewport = 0;
    }
    HintedTextRenderer2.prototype.begin = function(gl, viewport) {
      this.program.use(gl);
      this.u_ViewportSize.setData(gl, viewport.w, viewport.h);
      this.a_ImageFrac.setDataAndEnable(gl, this.imageFracData, 2, webglext2.GL.FLOAT);
      this.wViewport = viewport.w;
      this.hViewport = viewport.h;
    };
    HintedTextRenderer2.prototype.draw = function(gl, hints, xFrac, yFrac, options) {
      var xAnchor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.xAnchor) ? options.xAnchor : 0.5;
      var yAnchor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.yAnchor) ? options.yAnchor : 0.5;
      var color = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.color) ? options.color : webglext2.black;
      this.u_XyFrac.setData(gl, webglext2.nearestPixel(xFrac, this.wViewport, xAnchor, hints.w), webglext2.nearestPixel(yFrac, this.hViewport, yAnchor, hints.h));
      this.u_Anchor.setData(gl, xAnchor, yAnchor);
      this.u_ImageSize.setData(gl, hints.w, hints.h);
      this.u_Alpha.setData(gl, color.a);
      this.u_Hints.setDataAndBind(gl, 0, hints);
      gl.enable(webglext2.GL.BLEND);
      gl.blendColor(color.r, color.g, color.b, 1);
      gl.blendFunc(webglext2.GL.CONSTANT_COLOR, webglext2.GL.ONE_MINUS_SRC_COLOR);
      gl.drawArrays(webglext2.GL.TRIANGLE_STRIP, 0, 4);
    };
    HintedTextRenderer2.prototype.end = function(gl) {
      this.a_ImageFrac.disable(gl);
      this.u_Hints.unbind(gl);
      this.program.endUse(gl);
    };
    return HintedTextRenderer2;
  }();
  webglext2.HintedTextRenderer = HintedTextRenderer;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function xFrac(ev) {
    return ev.paneViewport.xFrac(ev.i);
  }
  webglext2.xFrac = xFrac;
  function yFrac(ev) {
    return ev.paneViewport.yFrac(ev.j);
  }
  webglext2.yFrac = yFrac;
  var PaneChild = function() {
    function PaneChild2(pane, layoutArg, layoutOptions) {
      this.pane = pane;
      this.layoutArg = layoutArg;
      this.layoutOptions = layoutOptions;
      this.viewport = webglext2.newBoundsFromRect(0, 0, 0, 0);
      this.scissor = webglext2.newBoundsFromRect(0, 0, 0, 0);
      this.prefSize = { w: 0, h: 0 };
    }
    return PaneChild2;
  }();
  var Pane = function() {
    function Pane2(layout, consumesInputEvents, isInside) {
      if (consumesInputEvents === void 0) {
        consumesInputEvents = true;
      }
      if (isInside === void 0) {
        isInside = webglext2.alwaysTrue;
      }
      var _this = this;
      this._mouseUp = new webglext2.Notification1();
      this._mouseDown = new webglext2.Notification1();
      this._mouseMove = new webglext2.Notification1();
      this._mouseWheel = new webglext2.Notification1();
      this._mouseEnter = new webglext2.Notification1();
      this._mouseExit = new webglext2.Notification1();
      this._contextMenu = new webglext2.Notification1();
      this.painters = [];
      this.consumesInputEvents = consumesInputEvents;
      this.isInside = isInside;
      this._mouseCursor = consumesInputEvents ? "default" : null;
      this._mouseCursorChanged = new webglext2.Notification();
      this._childMouseCursorListener = function() {
        return _this._mouseCursorChanged.fire();
      };
      this.children = new webglext2.OrderedSet([], function(paneChild) {
        return webglext2.getObjectId(paneChild.pane);
      }, false);
      this._layout = layout;
      this._viewport = webglext2.newBoundsFromRect(0, 0, 0, 0);
      this._scissor = webglext2.newBoundsFromRect(0, 0, 0, 0);
      this._viewportChanged = new webglext2.Notification();
      this._dispose = new webglext2.Notification();
      this._dispose.on(function() {
        _this._mouseUp.dispose();
        _this._mouseDown.dispose();
        _this._mouseMove.dispose();
        _this._mouseWheel.dispose();
        _this._mouseEnter.dispose();
        _this._mouseExit.dispose();
        _this._contextMenu.dispose();
        for (var i = 0; i < _this.children.length; i++) {
          _this.children.valueAt(i).pane.dispose.fire();
        }
      });
    }
    Object.defineProperty(Pane2.prototype, "layout", {
      get: function() {
        return this.layout;
      },
      set: function(layout) {
        this._layout = layout;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Pane2.prototype, "mouseCursor", {
      get: function() {
        return this._mouseCursor;
      },
      set: function(mouseCursor) {
        if (mouseCursor !== this._mouseCursor) {
          this._mouseCursor = mouseCursor;
          this._mouseCursorChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Pane2.prototype, "mouseCursorChanged", {
      get: function() {
        return this._mouseCursorChanged;
      },
      enumerable: false,
      configurable: true
    });
    Pane2.prototype.addPainter = function(painter) {
      this.painters.push(painter);
    };
    Pane2.prototype.addPane = function(pane, layoutArg, layoutOptions) {
      if (layoutArg === void 0) {
        layoutArg = null;
      }
      if (layoutOptions === void 0) {
        layoutOptions = {};
      }
      this.children.add(new PaneChild(pane, layoutArg, layoutOptions));
      pane.mouseCursorChanged.on(this._childMouseCursorListener);
    };
    Pane2.prototype.removePane = function(pane) {
      this.children.removeValue(this._childFor(pane));
      pane.mouseCursorChanged.off(this._childMouseCursorListener);
    };
    Pane2.prototype.layoutArg = function(pane) {
      return this._childFor(pane).layoutArg;
    };
    Pane2.prototype.setLayoutArg = function(pane, layoutArg) {
      this._childFor(pane).layoutArg = layoutArg;
    };
    Pane2.prototype.updateLayoutArgs = function(updateFn) {
      for (var c = 0; c < this.children.length; c++) {
        var child = this.children.valueAt(c);
        child.layoutArg = updateFn(child.layoutArg, child.layoutOptions);
      }
    };
    Pane2.prototype.layoutOptions = function(pane) {
      return this._childFor(pane).layoutOptions;
    };
    Pane2.prototype._childFor = function(pane) {
      return this.children.valueFor(webglext2.getObjectId(pane));
    };
    Pane2.prototype.updatePrefSizes = function(result) {
      for (var c = 0; c < this.children.length; c++) {
        var child = this.children.valueAt(c);
        child.pane.updatePrefSizes(child.prefSize);
      }
      if (webglext2.isNotEmpty(this._layout) && webglext2.isNotEmpty(this._layout.updatePrefSize)) {
        this._layout.updatePrefSize(result, this.children.toArray());
      } else {
        result.w = null;
        result.h = null;
      }
    };
    Pane2.prototype.updateBounds = function(viewport, scissor) {
      var viewportChanged = viewport.iStart !== this._viewport.iStart || viewport.iEnd !== this._viewport.iEnd || viewport.jStart !== this._viewport.jStart || viewport.jEnd !== this._viewport.jEnd;
      this._viewport.setBounds(viewport);
      this._scissor.setBounds(scissor);
      if (webglext2.isNotEmpty(this._layout) && webglext2.isNotEmpty(this._layout.updateChildViewports)) {
        this._layout.updateChildViewports(this.children.toArray(), viewport);
        for (var c = 0; c < this.children.length; c++) {
          var child = this.children.valueAt(c);
          child.scissor.setBounds(child.viewport.unmod);
          child.scissor.cropToBounds(scissor);
          child.pane.updateBounds(child.viewport.unmod, child.scissor.unmod);
        }
      } else if (this.children.length > 0) {
        throw new Error("Pane has " + this.children.length + " " + (this.children.length === 1 ? "child" : "children") + ", but its layout is " + this.layout);
      }
      if (viewportChanged) {
        this._viewportChanged.fire();
      }
    };
    Pane2.prototype.paint = function(gl) {
      var viewport = this._viewport.unmod;
      var scissor = this._scissor.unmod;
      if (scissor.w > 0 && scissor.h > 0) {
        gl.viewport(viewport.i, viewport.j, viewport.w, viewport.h);
        gl.enable(webglext2.GL.SCISSOR_TEST);
        gl.scissor(scissor.i, scissor.j, scissor.w, scissor.h);
        for (var p = 0; p < this.painters.length; p++) {
          this.painters[p](gl, viewport);
        }
        for (var c = 0; c < this.children.length; c++) {
          this.children.valueAt(c).pane.paint(gl);
        }
      }
    };
    Object.defineProperty(Pane2.prototype, "viewport", {
      get: function() {
        return this._viewport.unmod;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Pane2.prototype, "scissor", {
      get: function() {
        return this._scissor.unmod;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Pane2.prototype, "viewportChanged", {
      get: function() {
        return this._viewportChanged;
      },
      enumerable: false,
      configurable: true
    });
    Pane2.prototype.panesAt = function(i, j) {
      var result = [];
      this._panesAt(i, j, result);
      return result;
    };
    Pane2.prototype._panesAt = function(i, j, result) {
      if (this._scissor.contains(i, j)) {
        for (var c = this.children.length - 1; c >= 0; c--) {
          var consumed = this.children.valueAt(c).pane._panesAt(i, j, result);
          if (consumed)
            return true;
        }
        if (this.isInside(this._viewport.unmod, i, j)) {
          result.push(this);
          return this.consumesInputEvents;
        }
      }
      return false;
    };
    Object.defineProperty(Pane2.prototype, "mouseUp", {
      get: function() {
        return this._mouseUp;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Pane2.prototype, "mouseDown", {
      get: function() {
        return this._mouseDown;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Pane2.prototype, "mouseMove", {
      get: function() {
        return this._mouseMove;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Pane2.prototype, "mouseWheel", {
      get: function() {
        return this._mouseWheel;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Pane2.prototype, "mouseEnter", {
      get: function() {
        return this._mouseEnter;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Pane2.prototype, "mouseExit", {
      get: function() {
        return this._mouseExit;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Pane2.prototype, "contextMenu", {
      get: function() {
        return this._contextMenu;
      },
      enumerable: false,
      configurable: true
    });
    Pane2.prototype.fireMouseUp = function(i, j, clickCount, mouseEvent) {
      return this._mouseUp.fire({ paneViewport: this._viewport.unmod, i, j, clickCount, mouseEvent });
    };
    Pane2.prototype.fireMouseDown = function(i, j, clickCount, mouseEvent) {
      return this._mouseDown.fire({ paneViewport: this._viewport.unmod, i, j, clickCount, mouseEvent });
    };
    Pane2.prototype.fireMouseMove = function(i, j, mouseEvent) {
      return this._mouseMove.fire({ paneViewport: this._viewport.unmod, i, j, mouseEvent });
    };
    Pane2.prototype.fireMouseWheel = function(i, j, wheelSteps, mouseEvent) {
      return this._mouseWheel.fire({ paneViewport: this._viewport.unmod, i, j, wheelSteps, mouseEvent });
    };
    Pane2.prototype.fireMouseEnter = function(i, j, mouseEvent) {
      return this._mouseEnter.fire({ paneViewport: this._viewport.unmod, i, j, mouseEvent });
    };
    Pane2.prototype.fireMouseExit = function(i, j, mouseEvent) {
      return this._mouseExit.fire({ paneViewport: this._viewport.unmod, i, j, mouseEvent });
    };
    Pane2.prototype.fireContextMenu = function(i, j, mouseEvent) {
      return this._contextMenu.fire({ paneViewport: this._viewport.unmod, i, j, mouseEvent });
    };
    Object.defineProperty(Pane2.prototype, "dispose", {
      get: function() {
        return this._dispose;
      },
      enumerable: false,
      configurable: true
    });
    return Pane2;
  }();
  webglext2.Pane = Pane;
  function requireGL(canvasElement) {
    try {
      var glA = canvasElement.getContext("webgl");
      if (glA)
        return glA;
    } catch (e) {
    }
    try {
      var glB = canvasElement.getContext("webgl2");
      if (glB)
        return glB;
    } catch (e) {
    }
    throw new Error("WebGLContextCreationError");
  }
  webglext2.requireGL = requireGL;
  function iMouse(element, ev) {
    return ev.clientX - element.getBoundingClientRect().left;
  }
  function jMouse(element, ev) {
    return element.clientHeight - (ev.clientY - element.getBoundingClientRect().top);
  }
  function mouseWheelSteps(ev) {
    var raw = ev.deltaY !== void 0 ? ev.deltaY : -ev.detail;
    if (raw > 0) {
      return -1;
    }
    if (raw < 0) {
      return 1;
    }
    return 0;
  }
  function isLeftMouseDown(ev) {
    if (ev.buttons !== void 0) {
      return ev.buttons === 1;
    } else {
      return ev.which === 1;
    }
  }
  webglext2.isLeftMouseDown = isLeftMouseDown;
  function isMouseDown(ev) {
    return ev.buttons !== 0;
  }
  webglext2.isMouseDown = isMouseDown;
  function attachEventListeners(element, contentPane) {
    function detectEntersAndExits(oldPanes, newPanes, i, j, mouseEvent) {
      for (var n = 0; n < oldPanes.length; n++) {
        oldPanes[n]["isHovered"] = false;
      }
      for (var n = 0; n < newPanes.length; n++) {
        newPanes[n]["isHovered"] = true;
      }
      for (var n = 0; n < oldPanes.length; n++) {
        var oldPane = oldPanes[n];
        if (!oldPane["isHovered"]) {
          oldPane.fireMouseExit(i, j, mouseEvent);
        }
      }
      for (var n = 0; n < newPanes.length; n++) {
        newPanes[n]["wasHovered"] = false;
      }
      for (var n = 0; n < oldPanes.length; n++) {
        oldPanes[n]["wasHovered"] = true;
      }
      for (var n = 0; n < newPanes.length; n++) {
        var newPane = newPanes[n];
        if (!newPane["wasHovered"]) {
          newPane.fireMouseEnter(i, j, mouseEvent);
        }
      }
    }
    var multiPressTimeout_MILLIS = 250;
    var prevPress_PMILLIS = 0;
    var clickCount = 1;
    var currentPanes = [];
    var currentMouseCursor = null;
    var dragging = false;
    var pendingExit = false;
    function refreshMouseCursor() {
      var newMouseCursor = null;
      for (var n = 0; n < currentPanes.length; n++) {
        newMouseCursor = currentPanes[n].mouseCursor;
        if (webglext2.isNotEmpty(newMouseCursor))
          break;
      }
      if (!webglext2.isNotEmpty(newMouseCursor)) {
        newMouseCursor = "default";
      }
      if (newMouseCursor !== currentMouseCursor) {
        element.style.cursor = newMouseCursor;
        currentMouseCursor = newMouseCursor;
      }
    }
    refreshMouseCursor();
    contentPane.mouseCursorChanged.on(refreshMouseCursor);
    element.addEventListener("mousedown", function(ev) {
      var press_PMILLIS = new Date().getTime();
      var i = iMouse(element, ev);
      var j = jMouse(element, ev);
      if (press_PMILLIS - prevPress_PMILLIS < multiPressTimeout_MILLIS) {
        clickCount++;
      } else {
        clickCount = 1;
      }
      prevPress_PMILLIS = press_PMILLIS;
      var newPanes = contentPane.panesAt(i, j);
      detectEntersAndExits(currentPanes, newPanes, i, j, ev);
      currentPanes = newPanes;
      for (var n = 0; n < currentPanes.length; n++) {
        currentPanes[n].fireMouseDown(i, j, clickCount, ev);
      }
      refreshMouseCursor();
      dragging = true;
      ev.preventDefault();
    });
    element.addEventListener("mousemove", function(ev) {
      if (!dragging) {
        var i = iMouse(element, ev);
        var j = jMouse(element, ev);
        var newPanes = contentPane.panesAt(i, j);
        detectEntersAndExits(currentPanes, newPanes, i, j, ev);
        currentPanes = newPanes;
        for (var n = 0; n < currentPanes.length; n++) {
          currentPanes[n].fireMouseMove(i, j, ev);
        }
        refreshMouseCursor();
      }
    });
    window.addEventListener("mousemove", function(ev) {
      if (dragging) {
        var i = iMouse(element, ev);
        var j = jMouse(element, ev);
        for (var n = 0; n < currentPanes.length; n++) {
          currentPanes[n].fireMouseMove(i, j, ev);
        }
      }
    });
    element.addEventListener("mouseout", function(ev) {
      var i = iMouse(element, ev);
      var j = jMouse(element, ev);
      if (dragging) {
        for (var n = 0; n < currentPanes.length; n++) {
          currentPanes[n].fireMouseMove(i, j, ev);
        }
        pendingExit = true;
      } else {
        detectEntersAndExits(currentPanes, [], i, j, ev);
        currentPanes = [];
        refreshMouseCursor();
      }
    });
    element.addEventListener("mouseover", function(ev) {
      var i = iMouse(element, ev);
      var j = jMouse(element, ev);
      if (dragging) {
        pendingExit = false;
      } else {
        var newPanes = contentPane.panesAt(i, j);
        detectEntersAndExits(currentPanes, newPanes, i, j, ev);
        currentPanes = newPanes;
        for (var n = 0; n < currentPanes.length; n++) {
          currentPanes[n].fireMouseMove(i, j, ev);
        }
        refreshMouseCursor();
      }
    });
    var endDrag = function(ev) {
      var i = iMouse(element, ev);
      var j = jMouse(element, ev);
      for (var n = 0; n < currentPanes.length; n++) {
        currentPanes[n].fireMouseUp(i, j, clickCount, ev);
      }
      dragging = false;
      if (pendingExit) {
        detectEntersAndExits(currentPanes, [], i, j, ev);
        currentPanes = [];
        pendingExit = false;
        refreshMouseCursor();
      } else {
        var newPanes = contentPane.panesAt(i, j);
        detectEntersAndExits(currentPanes, newPanes, i, j, ev);
        currentPanes = newPanes;
        for (var n = 0; n < currentPanes.length; n++) {
          currentPanes[n].fireMouseMove(i, j, ev);
        }
        refreshMouseCursor();
      }
    };
    window.addEventListener("mouseup", function(ev) {
      if (dragging) {
        endDrag(ev);
      }
    });
    var recentDrag = null;
    var handleMissedMouseUp = function(ev) {
      if (dragging) {
        if (!isMouseDown(ev) && recentDrag) {
          var mouseUp = document.createEvent("MouseEvents");
          mouseUp.initMouseEvent("mouseup", true, true, window, 0, recentDrag.screenX, recentDrag.screenY, ev.screenX - window.screenX, ev.screenY - window.screenY, recentDrag.ctrlKey, recentDrag.altKey, recentDrag.shiftKey, recentDrag.metaKey, 0, null);
          endDrag(mouseUp);
        }
        recentDrag = ev;
      }
    };
    window.addEventListener("mousemove", handleMissedMouseUp);
    var w = window;
    while (w.parent !== w) {
      try {
        w.parent.addEventListener("mousemove", handleMissedMouseUp);
      } catch (e) {
        w.addEventListener("mouseout", function(ev) {
          if (dragging) {
            var mouseUp = document.createEvent("MouseEvents");
            mouseUp.initMouseEvent("mouseup", true, true, window, 0, ev.screenX, ev.screenY, ev.screenX - window.screenX, ev.screenY - window.screenY, ev.ctrlKey, ev.altKey, ev.shiftKey, ev.metaKey, 0, null);
            endDrag(mouseUp);
          }
        });
        break;
      }
    }
    var handleMouseWheel = function(ev) {
      var i = iMouse(element, ev);
      var j = jMouse(element, ev);
      if (dragging) {
        for (var n = 0; n < currentPanes.length; n++) {
          currentPanes[n].fireMouseMove(i, j, ev);
        }
      } else {
        var newPanes = contentPane.panesAt(i, j);
        detectEntersAndExits(currentPanes, newPanes, i, j, ev);
        currentPanes = newPanes;
        for (var n = 0; n < currentPanes.length; n++) {
          currentPanes[n].fireMouseMove(i, j, ev);
        }
      }
      var wheelSteps = mouseWheelSteps(ev);
      for (var n = 0; n < currentPanes.length; n++) {
        currentPanes[n].fireMouseWheel(i, j, wheelSteps, ev);
      }
    };
    element.addEventListener("mousewheel", handleMouseWheel);
    element.addEventListener("DOMMouseScroll", handleMouseWheel, false);
    element.addEventListener("contextmenu", function(ev) {
      var i = iMouse(element, ev);
      var j = jMouse(element, ev);
      if (dragging) {
        for (var n = 0; n < currentPanes.length; n++) {
          currentPanes[n].fireMouseMove(i, j, ev);
        }
      } else {
        var newPanes = contentPane.panesAt(i, j);
        detectEntersAndExits(currentPanes, newPanes, i, j, ev);
        currentPanes = newPanes;
        for (var n = 0; n < currentPanes.length; n++) {
          currentPanes[n].fireMouseMove(i, j, ev);
        }
        refreshMouseCursor();
      }
      for (var n = 0; n < currentPanes.length; n++) {
        currentPanes[n].fireContextMenu(i, j, ev);
      }
      ev.preventDefault();
    });
  }
  function newDrawable(canvas) {
    var contentPane = null;
    var contentPrefSizeNotification = new webglext2.Notification1();
    var contentPrefSize = { w: null, h: null };
    var contentViewport = webglext2.newBoundsFromRect(0, 0, 0, 0);
    var gl = requireGL(canvas);
    var pendingRequestId = null;
    return {
      setContentPane: function(pane) {
        if (webglext2.isNotEmpty(contentPane)) {
        }
        contentPane = pane;
        attachEventListeners(canvas, contentPane);
      },
      redraw: function() {
        if (!webglext2.isNotEmpty(pendingRequestId)) {
          pendingRequestId = window.requestAnimationFrame(function() {
            if (webglext2.isNotEmpty(contentPane)) {
              var oldPrefSize = { w: contentPrefSize.w, h: contentPrefSize.h };
              contentPane.updatePrefSizes(contentPrefSize);
              contentViewport.setRect(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
              contentPane.updateBounds(contentViewport.unmod, contentViewport.unmod);
              contentPane.paint(gl);
            }
            pendingRequestId = null;
            if (oldPrefSize.w !== contentPrefSize.w || oldPrefSize.h !== contentPrefSize.h) {
              contentPrefSizeNotification.fire({ w: contentPrefSize.w, h: contentPrefSize.h });
            }
          });
        }
      },
      getPrefSize: function() {
        return { w: contentPrefSize.w, h: contentPrefSize.h };
      },
      prefSizeChanged: function() {
        return contentPrefSizeNotification;
      }
    };
  }
  webglext2.newDrawable = newDrawable;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function newGroupPainter() {
    var painters = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      painters[_i] = arguments[_i];
    }
    return function(gl, viewport) {
      for (var n = 0; n < painters.length; n++) {
        painters[n](gl, viewport);
      }
    };
  }
  webglext2.newGroupPainter = newGroupPainter;
  function newBlendingBackgroundPainter(color) {
    var program = new webglext2.Program(webglext2.xyNdc_VERTSHADER, webglext2.solid_FRAGSHADER);
    var u_Color = new webglext2.UniformColor(program, "u_Color");
    var a_XyNdc = new webglext2.Attribute(program, "a_XyNdc");
    var numVertices = 4;
    var xy_NDC = new Float32Array(2 * numVertices);
    var xyBuffer_NDC = webglext2.newDynamicBuffer();
    return function(gl) {
      if (color.a >= 1) {
        gl.disable(webglext2.GL.BLEND);
      } else {
        gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
        gl.enable(webglext2.GL.BLEND);
      }
      program.use(gl);
      u_Color.setData(gl, color);
      xy_NDC[0] = -1;
      xy_NDC[1] = 1;
      xy_NDC[2] = -1;
      xy_NDC[3] = -1;
      xy_NDC[4] = 1;
      xy_NDC[5] = 1;
      xy_NDC[6] = 1;
      xy_NDC[7] = -1;
      xyBuffer_NDC.setData(xy_NDC);
      a_XyNdc.setDataAndEnable(gl, xyBuffer_NDC, 2, webglext2.GL.FLOAT);
      gl.drawArrays(webglext2.GL.TRIANGLE_STRIP, 0, numVertices);
      a_XyNdc.disable(gl);
      program.endUse(gl);
    };
  }
  webglext2.newBlendingBackgroundPainter = newBlendingBackgroundPainter;
  var Background = function() {
    function Background2(color) {
      this._color = color;
    }
    Object.defineProperty(Background2.prototype, "color", {
      get: function() {
        return this._color;
      },
      set: function(color) {
        if (!webglext2.sameColor(this._color, color)) {
          this._color = color;
        }
      },
      enumerable: false,
      configurable: true
    });
    Background2.prototype.newPainter = function() {
      var background = this;
      return function(gl, viewport) {
        if (webglext2.isNotEmpty(background.color)) {
          gl.clearColor(background.color.r, background.color.g, background.color.b, background.color.a);
          gl.clear(webglext2.GL.COLOR_BUFFER_BIT);
        }
      };
    };
    return Background2;
  }();
  webglext2.Background = Background;
  function newBackgroundPainter(color) {
    return function(gl) {
      gl.clearColor(color.r, color.g, color.b, color.a);
      gl.clear(webglext2.GL.COLOR_BUFFER_BIT);
    };
  }
  webglext2.newBackgroundPainter = newBackgroundPainter;
  function newTexturePainter(texture, xFrac, yFrac, options) {
    var textureRenderer = new webglext2.TextureRenderer();
    return function(gl, viewport) {
      textureRenderer.begin(gl, viewport);
      textureRenderer.draw(gl, texture, xFrac, yFrac, options);
      textureRenderer.end(gl);
    };
  }
  webglext2.newTexturePainter = newTexturePainter;
  function newSolidPane(color) {
    var pane = new webglext2.Pane(null);
    pane.addPainter(newBackgroundPainter(color));
    return pane;
  }
  webglext2.newSolidPane = newSolidPane;
  function fitToTexture(texture) {
    return function(parentPrefSize) {
      parentPrefSize.w = texture.w;
      parentPrefSize.h = texture.h;
    };
  }
  webglext2.fitToTexture = fitToTexture;
  function fixedSize(w, h) {
    return function(parentPrefSize) {
      parentPrefSize.w = w;
      parentPrefSize.h = h;
    };
  }
  webglext2.fixedSize = fixedSize;
  webglext2.xyNdc_VERTSHADER = webglext2.concatLines("                                                ", "  attribute vec2 a_XyNdc;                       ", "                                                ", "  void main( ) {                                ", "      gl_Position = vec4( a_XyNdc, 0.0, 1.0 );  ", "  }                                             ", "                                                ");
  webglext2.xyFrac_VERTSHADER = webglext2.concatLines("                                                                ", "  attribute vec2 a_XyFrac;                                      ", "                                                                ", "  void main( ) {                                                ", "      gl_Position = vec4( ( -1.0 + 2.0*a_XyFrac ), 0.0, 1.0 );  ", "  }                                                             ", "                                                                ");
  webglext2.solid_FRAGSHADER = webglext2.concatLines("                               ", "  precision lowp float;        ", "  uniform vec4 u_Color;        ", "                               ", "  void main( ) {               ", "      gl_FragColor = u_Color;  ", "  }                            ", "                               ");
  webglext2.varyingColor_FRAGSHADER = webglext2.concatLines("                               ", "  precision lowp float;        ", "  varying vec4 v_Color;        ", "                               ", "  void main( ) {               ", "      gl_FragColor = v_Color;  ", "  }                            ", "                               ");
  webglext2.modelview_VERTSHADER = webglext2.concatLines("    uniform mat4 u_modelViewMatrix;                       ", "    attribute vec4 a_Position;                            ", "                                                          ", "    void main( ) {                                        ", "        gl_Position = u_modelViewMatrix * a_Position ;    ", "    }                                                     ", "                                                          ");
  webglext2.nearestPixelCenter_GLSLFUNC = webglext2.concatLines("                                                                    ", "  float nearestPixelCenter( float frac, float pixelSize ) {         ", "      return ( floor( frac*pixelSize + 1e-4 ) + 0.5 ) / pixelSize;  ", "  }                                                                 ", "                                                                    ");
  var Side;
  (function(Side2) {
    Side2[Side2["TOP"] = 0] = "TOP";
    Side2[Side2["BOTTOM"] = 1] = "BOTTOM";
    Side2[Side2["RIGHT"] = 2] = "RIGHT";
    Side2[Side2["LEFT"] = 3] = "LEFT";
  })(Side = webglext2.Side || (webglext2.Side = {}));
  function fracToNdc(frac) {
    return -1 + 2 * frac;
  }
  webglext2.fracToNdc = fracToNdc;
  function nearestPixel(viewportFrac, viewportSize, imageAnchor, imageSize) {
    var anchor = imageAnchor * imageSize % 1;
    return (Math.floor(viewportFrac * viewportSize - anchor + 0.5 + 1e-4) + anchor) / viewportSize;
  }
  webglext2.nearestPixel = nearestPixel;
  function putQuadXys(xys, index, xLeft, xRight, yTop, yBottom) {
    var n = index;
    n = putUpperLeftTriangleXys(xys, n, xLeft, xRight, yTop, yBottom);
    n = putLowerRightTriangleXys(xys, n, xLeft, xRight, yTop, yBottom);
    return n;
  }
  webglext2.putQuadXys = putQuadXys;
  function putUpperLeftTriangleXys(xys, index, xLeft, xRight, yTop, yBottom) {
    var n = index;
    xys[n++] = xLeft;
    xys[n++] = yTop;
    xys[n++] = xRight;
    xys[n++] = yTop;
    xys[n++] = xLeft;
    xys[n++] = yBottom;
    return n;
  }
  webglext2.putUpperLeftTriangleXys = putUpperLeftTriangleXys;
  function putLowerRightTriangleXys(xys, index, xLeft, xRight, yTop, yBottom) {
    var n = index;
    xys[n++] = xLeft;
    xys[n++] = yBottom;
    xys[n++] = xRight;
    xys[n++] = yTop;
    xys[n++] = xRight;
    xys[n++] = yBottom;
    return n;
  }
  webglext2.putLowerRightTriangleXys = putLowerRightTriangleXys;
  function putUpperRightTriangleXys(xys, index, xLeft, xRight, yTop, yBottom) {
    var n = index;
    xys[n++] = xLeft;
    xys[n++] = yTop;
    xys[n++] = xRight;
    xys[n++] = yTop;
    xys[n++] = xRight;
    xys[n++] = yBottom;
    return n;
  }
  webglext2.putUpperRightTriangleXys = putUpperRightTriangleXys;
  function putLowerLeftTriangleXys(xys, index, xLeft, xRight, yTop, yBottom) {
    var n = index;
    xys[n++] = xLeft;
    xys[n++] = yBottom;
    xys[n++] = xLeft;
    xys[n++] = yTop;
    xys[n++] = xRight;
    xys[n++] = yBottom;
    return n;
  }
  webglext2.putLowerLeftTriangleXys = putLowerLeftTriangleXys;
  function putQuadRgbas(rgbas, index, color) {
    return putRgbas(rgbas, index, color, 6);
  }
  webglext2.putQuadRgbas = putQuadRgbas;
  function putRgbas(rgbas, index, color, count) {
    var n = index;
    for (var v = 0; v < count; v++) {
      rgbas[n++] = color.r;
      rgbas[n++] = color.g;
      rgbas[n++] = color.b;
      rgbas[n++] = color.a;
    }
    return n;
  }
  webglext2.putRgbas = putRgbas;
  function clearSelection() {
    var selection = window.getSelection();
    if (selection) {
      if (selection["removeAllRanges"]) {
        selection["removeAllRanges"]();
      } else if (selection["empty"]) {
        selection["empty"]();
      }
    }
  }
  webglext2.clearSelection = clearSelection;
  var SimpleModel = function() {
    function SimpleModel2(value) {
      if (value === void 0) {
        value = null;
      }
      this._value = value;
      this._changed = new webglext2.Notification();
    }
    Object.defineProperty(SimpleModel2.prototype, "value", {
      get: function() {
        return this._value;
      },
      set: function(value) {
        if (value !== this._value) {
          this._value = value;
          this._changed.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(SimpleModel2.prototype, "changed", {
      get: function() {
        return this._changed;
      },
      enumerable: false,
      configurable: true
    });
    return SimpleModel2;
  }();
  webglext2.SimpleModel = SimpleModel;
  var XyModel = function() {
    function XyModel2(x, y) {
      this._x = x;
      this._y = y;
      this._changed = new webglext2.Notification();
    }
    Object.defineProperty(XyModel2.prototype, "x", {
      get: function() {
        return this._x;
      },
      set: function(x) {
        if (x !== this._x) {
          this._x = x;
          this._changed.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(XyModel2.prototype, "y", {
      get: function() {
        return this._y;
      },
      set: function(y) {
        if (y !== this._y) {
          this._y = y;
          this._changed.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(XyModel2.prototype, "changed", {
      get: function() {
        return this._changed;
      },
      enumerable: false,
      configurable: true
    });
    XyModel2.prototype.setXy = function(x, y) {
      if (x !== this._x || y !== this._y) {
        this._x = x;
        this._y = y;
        this._changed.fire();
      }
    };
    return XyModel2;
  }();
  webglext2.XyModel = XyModel;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var Label = function() {
    function Label2(text, url, font, fgColor, bgColor) {
      this._icontexture = {};
      this._font = font;
      this._text = text;
      this._url = url;
      this._fgColor = fgColor;
      this._bgColor = bgColor;
      this._icontexture = {};
    }
    Object.defineProperty(Label2.prototype, "font", {
      get: function() {
        return this._font;
      },
      set: function(font) {
        if (this._font !== font) {
          this._font = font;
          this._textureFactory = null;
          if (this._texture) {
            this._texture.dispose();
            this._texture = null;
          }
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Label2.prototype, "color", {
      get: function() {
        return this._fgColor;
      },
      set: function(fgColor) {
        if (!webglext2.sameColor(this._fgColor, fgColor)) {
          this._fgColor = fgColor;
          if (this._texture) {
            this._texture.dispose();
            this._texture = null;
          }
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Label2.prototype, "fgColor", {
      get: function() {
        return this._fgColor;
      },
      set: function(fgColor) {
        if (!webglext2.sameColor(this._fgColor, fgColor)) {
          this._fgColor = fgColor;
          if (this._texture) {
            this._texture.dispose();
            this._texture = null;
          }
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Label2.prototype, "bgColor", {
      get: function() {
        return this._bgColor;
      },
      set: function(bgColor) {
        if (!webglext2.sameColor(this._bgColor, bgColor)) {
          this._bgColor = bgColor;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Label2.prototype, "url", {
      get: function() {
        return this._url;
      },
      set: function(url) {
        if (this._url !== url) {
          this._url = url;
          if (this._texture) {
            this._texture.dispose();
            this._texture = null;
          }
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Label2.prototype, "text", {
      get: function() {
        return this._text;
      },
      set: function(text) {
        if (this._text !== text) {
          this._text = text;
          if (this._texture) {
            this._texture.dispose();
            this._texture = null;
          }
        }
      },
      enumerable: false,
      configurable: true
    });
    Label2.prototype.loadImage = function(url, onLoaded) {
      if (!webglext2.isNotEmpty(this._icontexture[url])) {
        var imageCache = this._icontexture;
        var image = new Image();
        image.onload = function() {
          var w = image.naturalWidth;
          var h = image.naturalHeight;
          imageCache[url] = new webglext2.Texture2D(w, h, webglext2.GL.LINEAR, webglext2.GL.LINEAR, function(g) {
            g.drawImage(image, 0, 0);
          });
          if (onLoaded)
            onLoaded();
        };
        image.src = url;
      }
      return this._icontexture[url];
    };
    Object.defineProperty(Label2.prototype, "texture", {
      get: function() {
        if (!this._textureFactory) {
          this._textureFactory = this._font ? webglext2.createTextTextureFactory(this._font) : null;
        }
        if (!this._texture) {
          this._texture = this._fgColor && this._text ? this._textureFactory(this._fgColor, this._text) : null;
        }
        return this._texture;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Label2.prototype, "icontexture", {
      get: function() {
        var imageCache = this._icontexture;
        var url = this._url;
        if (this._url) {
          if (imageCache !== null) {
            imageCache[this._url] = null;
            var image = new Image();
            image.onload = function() {
              var w = image.naturalWidth;
              var h = image.naturalHeight;
              imageCache[url] = new webglext2.Texture2D(w, h, webglext2.GL.LINEAR, webglext2.GL.LINEAR, function(g) {
                g.drawImage(image, 0, 0);
              });
            };
            image.src = this._url;
          }
        }
        return imageCache[url];
      },
      enumerable: false,
      configurable: true
    });
    return Label2;
  }();
  webglext2.Label = Label;
  function fitToLabel(label) {
    return function(parentPrefSize) {
      var texture = label.texture;
      parentPrefSize.w = texture ? texture.w : 0;
      parentPrefSize.h = texture ? texture.h : 0;
    };
  }
  webglext2.fitToLabel = fitToLabel;
  function newLabelPainter(label, drawable, xFrac, yFrac, xAnchor, yAnchor, rotation_CCWRAD) {
    var textureRenderer = new webglext2.TextureRenderer();
    return function(gl, viewport) {
      if (webglext2.isNotEmpty(label.bgColor)) {
        gl.clearColor(label.bgColor.r, label.bgColor.g, label.bgColor.b, label.bgColor.a);
        gl.clear(webglext2.GL.COLOR_BUFFER_BIT);
      }
      if (!label.url) {
        var texture = label.texture;
        if (texture) {
          textureRenderer.begin(gl, viewport);
          textureRenderer.draw(gl, texture, xFrac, yFrac, { xAnchor, yAnchor: texture.yAnchor(yAnchor), rotation_CCWRAD });
          textureRenderer.end(gl);
        }
      } else {
        textureRenderer.begin(gl, viewport);
        var icontexture = label.loadImage(label.url, function() {
          drawable.redraw();
        });
        if (icontexture) {
          var width = Math.min(viewport.w, viewport.h) - 15;
          textureRenderer.draw(gl, icontexture, xFrac, yFrac, {
            xAnchor,
            yAnchor,
            rotation_CCWRAD,
            width,
            height: width
          });
        }
        textureRenderer.end(gl);
      }
    };
  }
  webglext2.newLabelPainter = newLabelPainter;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function newVerticalScrollLayout() {
    var layout = {
      updatePrefSize: function(parentPrefSize, children) {
        if (children.length === 1) {
          var childPrefSize = children[0].prefSize;
          if (!webglext2.isNotEmpty(childPrefSize.h)) {
            throw new Error("Vertical-scroll layout requires child to have a defined pref-height, but its pref-height is " + childPrefSize.h);
          }
          parentPrefSize.w = childPrefSize.w;
          parentPrefSize.h = childPrefSize.h;
        } else if (children.length > 1) {
          throw new Error("Vertical-scroll layout only works with 1 child, but pane has " + this.children.length + " children");
        }
      },
      jOffset: 0,
      hContent: 0,
      hVisible: 0,
      updateChildViewports: function(children, parentViewport) {
        if (children.length === 1) {
          var child = children[0];
          var j;
          var h = child.prefSize.h;
          if (h <= parentViewport.h) {
            j = parentViewport.jEnd - h;
          } else {
            j = Math.min(parentViewport.j, parentViewport.jEnd - h + Math.max(0, Math.round(layout.jOffset)));
          }
          child.viewport.setRect(parentViewport.i, j, parentViewport.w, h);
          layout.jOffset = j + h - parentViewport.jEnd;
          layout.hContent = h;
          layout.hVisible = parentViewport.h;
        } else if (children.length > 1) {
          throw new Error("Vertical-scroll layout only works with 1 child, but pane has " + this.children.length + " children");
        }
      }
    };
    return layout;
  }
  webglext2.newVerticalScrollLayout = newVerticalScrollLayout;
  function newVerticalScrollbar(scrollLayout, drawable, options) {
    var bgColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.bgColor) ? options.bgColor : webglext2.gray(0.9);
    var scrollbar = new webglext2.Pane(null);
    scrollbar.addPainter(webglext2.newBackgroundPainter(bgColor));
    scrollbar.addPainter(newVerticalScrollbarPainter(scrollLayout, options));
    attachVerticalScrollMouseListeners(scrollbar, scrollLayout, drawable);
    return scrollbar;
  }
  webglext2.newVerticalScrollbar = newVerticalScrollbar;
  function newVerticalScrollbarPainter(scrollLayout, options) {
    var fgColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.fgColor) ? options.fgColor : webglext2.gray(0.56);
    var borderColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.borderColor) ? options.borderColor : webglext2.gray(0.42);
    var borderThickness = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.borderThickness) ? options.borderThickness : 1;
    var borderTop = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.borderTop) ? options.borderTop : true;
    var borderLeft = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.borderLeft) ? options.borderLeft : false;
    var borderRight = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.borderRight) ? options.borderRight : false;
    var borderBottom = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.borderBottom) ? options.borderBottom : true;
    var program = new webglext2.Program(webglext2.xyFrac_VERTSHADER, webglext2.solid_FRAGSHADER);
    var u_Color = new webglext2.UniformColor(program, "u_Color");
    var a_XyFrac = new webglext2.Attribute(program, "a_XyFrac");
    var numFillVertices = 6;
    var numBorderVertices = (borderTop ? 6 : 0) + (borderLeft ? 6 : 0) + (borderRight ? 6 : 0) + (borderBottom ? 6 : 0);
    var xyFrac = new Float32Array(2 * Math.max(numFillVertices, numBorderVertices));
    var xyFracBuffer = webglext2.newDynamicBuffer();
    return function(gl, viewport) {
      var hFrac = scrollLayout.hVisible / scrollLayout.hContent;
      if (hFrac < 1) {
        var yTop = Math.round((scrollLayout.hContent - scrollLayout.jOffset) / scrollLayout.hContent * viewport.h + 1e-4);
        var yBottom = Math.round((scrollLayout.hContent - (scrollLayout.jOffset + scrollLayout.hVisible)) / scrollLayout.hContent * viewport.h + 1e-4);
        var yFracTop = yTop / viewport.h;
        var yFracBottom = yBottom / viewport.h;
        var wBorderFrac = borderThickness / viewport.w;
        var hBorderFrac = borderThickness / viewport.h;
        gl.disable(webglext2.GL.BLEND);
        program.use(gl);
        webglext2.putQuadXys(xyFrac, 0, 0 + (borderLeft ? wBorderFrac : 0), 1 - (borderRight ? wBorderFrac : 0), yFracTop - (borderTop ? hBorderFrac : 0), yFracBottom + (borderBottom ? hBorderFrac : 0));
        xyFracBuffer.setData(xyFrac.subarray(0, 2 * numFillVertices));
        a_XyFrac.setDataAndEnable(gl, xyFracBuffer, 2, webglext2.GL.FLOAT);
        u_Color.setData(gl, fgColor);
        gl.drawArrays(webglext2.GL.TRIANGLES, 0, numFillVertices);
        var index = 0;
        if (borderTop)
          index = webglext2.putQuadXys(xyFrac, index, 0, 1 - (borderRight ? wBorderFrac : 0), yFracTop, yFracTop - hBorderFrac);
        if (borderBottom)
          index = webglext2.putQuadXys(xyFrac, index, 0 + (borderLeft ? wBorderFrac : 0), 1, yFracBottom + hBorderFrac, yFracBottom);
        if (borderRight)
          index = webglext2.putQuadXys(xyFrac, index, 1 - wBorderFrac, 1, yFracTop, yFracBottom + (borderBottom ? hBorderFrac : 0));
        if (borderLeft)
          index = webglext2.putQuadXys(xyFrac, index, 0, 0 + wBorderFrac, yFracTop - (borderTop ? hBorderFrac : 0), yFracBottom);
        xyFracBuffer.setData(xyFrac.subarray(0, 2 * numBorderVertices));
        a_XyFrac.setDataAndEnable(gl, xyFracBuffer, 2, webglext2.GL.FLOAT);
        u_Color.setData(gl, borderColor);
        gl.drawArrays(webglext2.GL.TRIANGLES, 0, numBorderVertices);
        a_XyFrac.disable(gl);
        program.endUse(gl);
      }
    };
  }
  webglext2.newVerticalScrollbarPainter = newVerticalScrollbarPainter;
  function attachTimelineVerticalScrollMouseListeners(pane, scrollLayout, drawable) {
    var grab = null;
    var jOffset = null;
    pane.mouseDown.on(function(ev) {
      if (webglext2.isLeftMouseDown(ev.mouseEvent)) {
        grab = ev.j;
        jOffset = scrollLayout.jOffset;
      }
    });
    pane.mouseMove.on(function(ev) {
      if (webglext2.isNotEmpty(grab)) {
        scrollLayout.jOffset = jOffset - (grab - ev.j);
        drawable.redraw();
      }
    });
    pane.mouseUp.on(function(ev) {
      grab = null;
    });
  }
  webglext2.attachTimelineVerticalScrollMouseListeners = attachTimelineVerticalScrollMouseListeners;
  function attachVerticalScrollMouseListeners(scrollbar, scrollLayout, drawable) {
    var grab = null;
    var pageScrollTimer = null;
    var recentPointerFrac = null;
    scrollbar.mouseDown.on(function(ev) {
      if (webglext2.isLeftMouseDown(ev.mouseEvent) && !webglext2.isNotEmpty(grab)) {
        var topFrac = (scrollLayout.hContent - scrollLayout.jOffset) / scrollLayout.hContent;
        var fracExtent = scrollLayout.hVisible / scrollLayout.hContent;
        var pointerFrac = webglext2.yFrac(ev);
        if (topFrac - fracExtent <= pointerFrac && pointerFrac <= topFrac) {
          grab = (topFrac - pointerFrac) / fracExtent;
        } else {
          var direction = 0;
          if (pointerFrac < topFrac - fracExtent)
            direction = 1;
          else if (pointerFrac > topFrac)
            direction = -1;
          scrollLayout.jOffset += direction * Math.max(1, 0.875 * scrollLayout.hVisible);
          drawable.redraw();
          recentPointerFrac = pointerFrac;
          var pageScroll = function() {
            var topFrac2 = (scrollLayout.hContent - scrollLayout.jOffset) / scrollLayout.hContent;
            var fracExtent2 = scrollLayout.hVisible / scrollLayout.hContent;
            var pointerFrac2 = recentPointerFrac;
            var direction2 = 0;
            if (pointerFrac2 < topFrac2 - fracExtent2)
              direction2 = 1;
            else if (pointerFrac2 > topFrac2)
              direction2 = -1;
            scrollLayout.jOffset += direction2 * Math.max(1, 0.875 * scrollLayout.hVisible);
            drawable.redraw();
            pageScrollTimer = setTimeout(pageScroll, 50);
          };
          pageScrollTimer = setTimeout(pageScroll, 500);
        }
      }
    });
    scrollbar.mouseMove.on(function(ev) {
      var pointerFrac = webglext2.yFrac(ev);
      if (webglext2.isNotEmpty(grab)) {
        var fracExtent = scrollLayout.hVisible / scrollLayout.hContent;
        var topFrac = pointerFrac + grab * fracExtent;
        scrollLayout.jOffset = scrollLayout.hContent - topFrac * scrollLayout.hContent;
        drawable.redraw();
      }
      if (webglext2.isNotEmpty(pageScrollTimer)) {
        recentPointerFrac = pointerFrac;
      }
    });
    scrollbar.mouseUp.on(function(ev) {
      grab = null;
      if (webglext2.isNotEmpty(pageScrollTimer)) {
        clearTimeout(pageScrollTimer);
        pageScrollTimer = null;
        recentPointerFrac = null;
      }
    });
  }
  webglext2.attachVerticalScrollMouseListeners = attachVerticalScrollMouseListeners;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function newInsets() {
    var insets = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      insets[_i] = arguments[_i];
    }
    switch (insets.length) {
      case 1:
        return {
          top: insets[0],
          right: insets[0],
          bottom: insets[0],
          left: insets[0]
        };
      case 2:
        return {
          top: insets[0],
          right: insets[1],
          bottom: insets[0],
          left: insets[1]
        };
      case 3:
        return {
          top: insets[0],
          right: insets[1],
          bottom: insets[2],
          left: insets[1]
        };
      case 4:
        return {
          top: insets[0],
          right: insets[1],
          bottom: insets[2],
          left: insets[3]
        };
      default:
        throw new Error("Expected 1, 2, 3, or 4 args, but found " + insets.length);
    }
  }
  webglext2.newInsets = newInsets;
  function newInsetLayout(insets) {
    return {
      updatePrefSize: function(parentPrefSize, children) {
        if (children.length === 0) {
          parentPrefSize.w = insets.left + insets.right;
          parentPrefSize.h = insets.top + insets.bottom;
        } else if (children.length === 1) {
          var childPrefSize = children[0].prefSize;
          parentPrefSize.w = webglext2.isNotEmpty(childPrefSize.w) ? childPrefSize.w + insets.left + insets.right : null;
          parentPrefSize.h = webglext2.isNotEmpty(childPrefSize.h) ? childPrefSize.h + insets.top + insets.bottom : null;
        } else if (children.length > 1) {
          throw new Error("Inset layout works with at most 1 child, but pane has " + this.children.length + " children");
        }
      },
      updateChildViewports: function(children, parentViewport) {
        if (children.length === 1) {
          var childViewport = children[0].viewport;
          childViewport.setEdges(parentViewport.iStart + insets.left, parentViewport.iEnd - insets.right, parentViewport.jStart + insets.bottom, parentViewport.jEnd - insets.top);
        } else if (children.length > 1) {
          throw new Error("Inset layout works with at most 1 child, but pane has " + this.children.length + " children");
        }
      }
    };
  }
  webglext2.newInsetLayout = newInsetLayout;
  function newInsetPane(pane, insets, bgColor, consumeInputEvents) {
    if (bgColor === void 0) {
      bgColor = null;
    }
    if (consumeInputEvents === void 0) {
      consumeInputEvents = true;
    }
    var insetPane = new webglext2.Pane(newInsetLayout(insets), consumeInputEvents);
    if (webglext2.isNotEmpty(bgColor)) {
      insetPane.addPainter(webglext2.newBackgroundPainter(bgColor));
    }
    insetPane.addPane(pane);
    return insetPane;
  }
  webglext2.newInsetPane = newInsetPane;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function newCornerLayout(hSide, vSide) {
    return {
      updatePrefSize: function(parentPrefSize, children) {
        if (children.length === 1) {
          var childPrefSize = children[0].prefSize;
          parentPrefSize.w = childPrefSize.w;
          parentPrefSize.h = childPrefSize.h;
        } else if (children.length > 1) {
          throw new Error("Corner layout only works with 1 child, but pane has " + this.children.length + " children");
        }
      },
      updateChildViewports: function(children, parentViewport) {
        if (children.length === 1) {
          var child = children[0];
          var iStart;
          var iEnd;
          var w = child.prefSize.w;
          if (hSide === webglext2.Side.RIGHT) {
            iEnd = parentViewport.iEnd;
            iStart = webglext2.isNotEmpty(w) ? Math.max(iEnd - w, parentViewport.iStart) : parentViewport.iStart;
          } else {
            iStart = parentViewport.iStart;
            iEnd = webglext2.isNotEmpty(w) ? Math.min(iStart + w, parentViewport.iEnd) : parentViewport.iEnd;
          }
          var jStart;
          var jEnd;
          var h = child.prefSize.h;
          if (vSide === webglext2.Side.BOTTOM) {
            jStart = parentViewport.jStart;
            jEnd = webglext2.isNotEmpty(h) ? Math.min(jStart + h, parentViewport.jEnd) : parentViewport.jEnd;
          } else {
            jEnd = parentViewport.jEnd;
            jStart = webglext2.isNotEmpty(h) ? Math.max(jEnd - h, parentViewport.jStart) : parentViewport.jStart;
          }
          child.viewport.setEdges(iStart, iEnd, jStart, jEnd);
        } else if (children.length > 1) {
          throw new Error("Corner layout only works with 1 child, but pane has " + this.children.length + " children");
        }
      }
    };
  }
  webglext2.newCornerLayout = newCornerLayout;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function childHeight(child) {
    var usePrefHeight = !webglext2.isNotEmpty(child.layoutOptions) || child.layoutOptions.height === void 0 || child.layoutOptions.height === "pref" || child.layoutOptions.height === "pref-max";
    return usePrefHeight ? child.prefSize.h : child.layoutOptions.height;
  }
  function childHeightOverfull(child) {
    var usePrefHeight = !webglext2.isNotEmpty(child.layoutOptions) || child.layoutOptions.height === void 0 || child.layoutOptions.height === "pref";
    if (usePrefHeight) {
      return child.prefSize.h;
    } else if (child.layoutOptions.height == "pref-max") {
      return null;
    } else {
      return child.layoutOptions.height;
    }
  }
  function calculateFlexData(childrenToPlace, parentViewport, childHeight2) {
    var numFlexible = 0;
    var totalHeight = 0;
    for (var c = 0; c < childrenToPlace.length; c++) {
      var h = childHeight2(childrenToPlace[c]);
      if (webglext2.isNotEmpty(h)) {
        totalHeight += h;
      } else {
        numFlexible++;
      }
    }
    var totalFlexHeight = parentViewport.h - totalHeight;
    var flexHeight = totalFlexHeight / numFlexible;
    return { numFlexible, totalHeight, flexHeight, totalFlexHeight, childHeight: childHeight2 };
  }
  function newRowLayout(topToBottom) {
    if (topToBottom === void 0) {
      topToBottom = true;
    }
    return {
      updatePrefSize: function(parentPrefSize, children) {
        var childrenToPlace = [];
        for (var c = 0; c < children.length; c++) {
          var child = children[c];
          if (webglext2.isNumber(child.layoutArg) && !(child.layoutOptions && child.layoutOptions.hide)) {
            childrenToPlace.push(child);
          }
        }
        var wMax = 0;
        var hSum = 0;
        for (var c = 0; c < childrenToPlace.length; c++) {
          var child = childrenToPlace[c];
          var honorChildWidth = !(child.layoutOptions && child.layoutOptions.ignoreWidth);
          if (honorChildWidth) {
            var w = child.prefSize.w;
            if (webglext2.isNotEmpty(wMax) && webglext2.isNotEmpty(w)) {
              wMax = Math.max(wMax, w);
            } else {
              wMax = null;
            }
          }
          var h = childHeight(child);
          if (webglext2.isNotEmpty(hSum) && webglext2.isNotEmpty(h)) {
            hSum += h;
          } else {
            hSum = null;
          }
        }
        parentPrefSize.w = wMax;
        parentPrefSize.h = hSum;
      },
      updateChildViewports: function(children, parentViewport) {
        var childrenToPlace = [];
        var childrenToHide = [];
        for (var c = 0; c < children.length; c++) {
          var child = children[c];
          if (webglext2.isNumber(child.layoutArg) && !(child.layoutOptions && child.layoutOptions.hide)) {
            childrenToPlace.push(child);
          } else {
            childrenToHide.push(child);
          }
        }
        var indexProp = "webglext_rowLayout_index";
        for (var c = 0; c < childrenToPlace.length; c++) {
          var child = childrenToPlace[c];
          child[indexProp] = c;
        }
        childrenToPlace.sort(function(a, b) {
          var orderDiff = a.layoutArg - b.layoutArg;
          return orderDiff !== 0 ? orderDiff : a[indexProp] - b[indexProp];
        });
        var flexData = calculateFlexData(children, parentViewport, childHeight);
        if (flexData.totalHeight > parentViewport.h) {
          flexData = calculateFlexData(children, parentViewport, childHeightOverfull);
        }
        if (topToBottom) {
          var iStart = parentViewport.iStart;
          var iEnd = parentViewport.iEnd;
          var jEnd = parentViewport.jEnd;
          var jRemainder = 0;
          for (var c = 0; c < childrenToPlace.length; c++) {
            var child = childrenToPlace[c];
            var jStart;
            var h = flexData.childHeight(child);
            if (webglext2.isNotEmpty(h)) {
              jStart = jEnd - h;
            } else {
              var jStart0 = jEnd - flexData.flexHeight - jRemainder;
              jStart = Math.round(jStart0);
              jRemainder = jStart - jStart0;
            }
            child.viewport.setEdges(iStart, iEnd, jStart, jEnd);
            jEnd = jStart;
          }
        } else {
          var iStart = parentViewport.iStart;
          var iEnd = parentViewport.iEnd;
          var jStart = parentViewport.jStart;
          var jRemainder = 0;
          for (var c = 0; c < childrenToPlace.length; c++) {
            var child = childrenToPlace[c];
            var jEnd;
            var h = flexData.childHeight(child);
            if (webglext2.isNotEmpty(h)) {
              jEnd = jStart + h;
            } else {
              var jEnd0 = jStart + flexData.flexHeight + jRemainder;
              jEnd = Math.round(jEnd0);
              jRemainder = jEnd0 - jEnd;
            }
            child.viewport.setEdges(iStart, iEnd, jStart, jEnd);
            jStart = jEnd;
          }
        }
        for (var c = 0; c < childrenToHide.length; c++) {
          childrenToHide[c].viewport.setEdges(0, 0, 0, 0);
        }
      }
    };
  }
  webglext2.newRowLayout = newRowLayout;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function childWidth(child) {
    var usePrefWidth = !webglext2.isNotEmpty(child.layoutOptions) || child.layoutOptions.width === void 0 || child.layoutOptions.width === "pref";
    return usePrefWidth ? child.prefSize.w : child.layoutOptions.width;
  }
  function newColumnLayout(leftToRight) {
    if (leftToRight === void 0) {
      leftToRight = true;
    }
    return {
      updatePrefSize: function(parentPrefSize, children) {
        var childrenToPlace = [];
        for (var c = 0; c < children.length; c++) {
          var child = children[c];
          if (webglext2.isNumber(child.layoutArg) && !(child.layoutOptions && child.layoutOptions.hide)) {
            childrenToPlace.push(child);
          }
        }
        var hMax = 0;
        var wSum = 0;
        for (var c = 0; c < childrenToPlace.length; c++) {
          var child = childrenToPlace[c];
          var honorChildHeight = !(child.layoutOptions && child.layoutOptions.ignoreHeight);
          if (honorChildHeight) {
            var h = child.prefSize.h;
            if (webglext2.isNotEmpty(hMax) && webglext2.isNotEmpty(h)) {
              hMax = Math.max(hMax, h);
            } else {
              hMax = null;
            }
          }
          var w = childWidth(child);
          if (webglext2.isNotEmpty(wSum) && webglext2.isNotEmpty(w)) {
            wSum += w;
          } else {
            wSum = null;
          }
        }
        parentPrefSize.w = wSum;
        parentPrefSize.h = hMax;
      },
      updateChildViewports: function(children, parentViewport) {
        var childrenToPlace = [];
        var childrenToHide = [];
        for (var c = 0; c < children.length; c++) {
          var child = children[c];
          if (webglext2.isNumber(child.layoutArg) && !(child.layoutOptions && child.layoutOptions.hide)) {
            childrenToPlace.push(child);
          } else {
            childrenToHide.push(child);
          }
        }
        var indexProp = "webglext_columnLayout_index";
        for (var c = 0; c < childrenToPlace.length; c++) {
          var child = childrenToPlace[c];
          child[indexProp] = c;
        }
        childrenToPlace.sort(function(a, b) {
          var orderDiff = a.layoutArg - b.layoutArg;
          return orderDiff !== 0 ? orderDiff : a[indexProp] - b[indexProp];
        });
        var numFlexible = 0;
        var totalFlexWidth = parentViewport.w;
        for (var c = 0; c < childrenToPlace.length; c++) {
          var w = childWidth(childrenToPlace[c]);
          if (webglext2.isNotEmpty(w)) {
            totalFlexWidth -= w;
          } else {
            numFlexible++;
          }
        }
        var flexWidth = totalFlexWidth / numFlexible;
        if (leftToRight) {
          var jStart = parentViewport.jStart;
          var jEnd = parentViewport.jEnd;
          var iStart = parentViewport.iStart;
          var iRemainder = 0;
          for (var c = 0; c < childrenToPlace.length; c++) {
            var child = childrenToPlace[c];
            var iEnd;
            var w = childWidth(child);
            if (webglext2.isNotEmpty(w)) {
              iEnd = iStart + w;
            } else {
              var iEnd0 = iStart + flexWidth + iRemainder;
              iEnd = Math.round(iEnd0);
              iRemainder = iEnd0 - iEnd;
            }
            child.viewport.setEdges(iStart, iEnd, jStart, jEnd);
            iStart = iEnd;
          }
        } else {
          var jStart = parentViewport.jStart;
          var jEnd = parentViewport.jEnd;
          var iEnd = parentViewport.iEnd;
          var iRemainder = 0;
          for (var c = 0; c < childrenToPlace.length; c++) {
            var child = childrenToPlace[c];
            var iStart;
            var w = childWidth(child);
            if (webglext2.isNotEmpty(w)) {
              iStart = iEnd - w;
            } else {
              var iStart0 = iEnd - flexWidth - iRemainder;
              iStart = Math.round(iStart0);
              iRemainder = iStart - iStart0;
            }
            child.viewport.setEdges(iStart, iEnd, jStart, jEnd);
            iEnd = iStart;
          }
        }
        for (var c = 0; c < childrenToHide.length; c++) {
          childrenToHide[c].viewport.setEdges(0, 0, 0, 0);
        }
      }
    };
  }
  webglext2.newColumnLayout = newColumnLayout;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function newOverlayLayout() {
    return {
      updatePrefSize: function(parentPrefSize, children) {
        var underlays = [];
        for (var c = 0; c < children.length; c++) {
          var child = children[c];
          var isUnderlay = child.layoutArg;
          if (isUnderlay) {
            underlays.push(child);
          }
        }
        if (!webglext2.isEmpty(underlays)) {
          var maxChildPrefWidth = 0;
          var maxChildPrefHeight = 0;
          for (var c = 0; c < underlays.length; c++) {
            var childPrefSize = underlays[c].prefSize;
            var childPrefWidth = childPrefSize.w;
            if (webglext2.isNotEmpty(maxChildPrefWidth) && webglext2.isNotEmpty(childPrefWidth)) {
              maxChildPrefWidth = Math.max(maxChildPrefWidth, childPrefWidth);
            } else {
              maxChildPrefWidth = null;
            }
            var childPrefHeight = childPrefSize.h;
            if (webglext2.isNotEmpty(maxChildPrefHeight) && webglext2.isNotEmpty(childPrefHeight)) {
              maxChildPrefHeight = Math.max(maxChildPrefHeight, childPrefHeight);
            } else {
              maxChildPrefHeight = null;
            }
          }
          parentPrefSize.w = maxChildPrefWidth;
          parentPrefSize.h = maxChildPrefHeight;
        } else {
          parentPrefSize.w = 0;
          parentPrefSize.h = 0;
        }
      },
      updateChildViewports: function(children, parentViewport) {
        for (var c = 0; c < children.length; c++) {
          children[c].viewport.setBounds(parentViewport);
        }
      }
    };
  }
  webglext2.newOverlayLayout = newOverlayLayout;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function newCardLayout() {
    return {
      updatePrefSize: function(parentPrefSize, children) {
        var activeChild;
        for (var c = 0; c < children.length; c++) {
          var child = children[c];
          var isActive = child.layoutArg;
          if (isActive) {
            activeChild = child;
          }
        }
        if (webglext2.isNotEmpty(activeChild)) {
          var childPrefSize = activeChild.prefSize;
          var childPrefWidth = childPrefSize.w;
          if (webglext2.isNotEmpty(childPrefWidth)) {
            parentPrefSize.w = childPrefWidth;
          } else {
            parentPrefSize.w = null;
          }
          var childPrefHeight = childPrefSize.h;
          if (webglext2.isNotEmpty(childPrefHeight)) {
            parentPrefSize.h = childPrefHeight;
          } else {
            parentPrefSize.h = null;
          }
        } else {
          parentPrefSize.w = 0;
          parentPrefSize.h = 0;
        }
      },
      updateChildViewports: function(children, parentViewport) {
        var activeChildIndex;
        for (var c = 0; c < children.length; c++) {
          var child = children[c];
          var isActive = child.layoutArg;
          if (isActive) {
            activeChildIndex = c;
          }
        }
        for (var c = 0; c < children.length; c++) {
          if (c === activeChildIndex) {
            children[c].viewport.setBounds(parentViewport);
          } else {
            children[c].viewport.setEdges(0, 0, 0, 0);
          }
        }
      }
    };
  }
  webglext2.newCardLayout = newCardLayout;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function newBorderPainter(color, options) {
    if (!webglext2.isNotEmpty(options))
      options = {};
    if (!webglext2.isNotEmpty(options.drawTop))
      options.drawTop = true;
    if (!webglext2.isNotEmpty(options.drawLeft))
      options.drawLeft = true;
    if (!webglext2.isNotEmpty(options.drawRight))
      options.drawRight = true;
    if (!webglext2.isNotEmpty(options.drawBottom))
      options.drawBottom = true;
    if (!webglext2.isNotEmpty(options.thickness))
      options.thickness = 1;
    var simple = options.thickness === 1 && color.a >= 1;
    return simple ? newSimpleBorderPainter(color, options) : newFullBorderPainter(color, options);
  }
  webglext2.newBorderPainter = newBorderPainter;
  function newFullBorderPainter(color, options) {
    var drawTop = options.drawTop;
    var drawLeft = options.drawLeft;
    var drawRight = options.drawRight;
    var drawBottom = options.drawBottom;
    var thickness = options.thickness;
    var program = new webglext2.Program(webglext2.xyNdc_VERTSHADER, webglext2.solid_FRAGSHADER);
    var u_Color = new webglext2.UniformColor(program, "u_Color");
    var a_XyNdc = new webglext2.Attribute(program, "a_XyNdc");
    var numVertices = (drawTop ? 6 : 0) + (drawLeft ? 6 : 0) + (drawRight ? 6 : 0) + (drawBottom ? 6 : 0);
    var xy_NDC = new Float32Array(2 * numVertices);
    var xyBuffer_NDC = webglext2.newDynamicBuffer();
    return function(gl, viewport) {
      if (color.a >= 1) {
        gl.disable(webglext2.GL.BLEND);
      } else {
        gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
        gl.enable(webglext2.GL.BLEND);
      }
      program.use(gl);
      u_Color.setData(gl, color);
      var w_NDC = 2 * thickness / viewport.w;
      var h_NDC = 2 * thickness / viewport.h;
      var index = 0;
      if (drawTop)
        index = webglext2.putQuadXys(xy_NDC, index, -1, drawRight ? 1 - w_NDC : 1, 1, 1 - h_NDC);
      if (drawRight)
        index = webglext2.putQuadXys(xy_NDC, index, 1 - w_NDC, 1, 1, drawBottom ? -1 + h_NDC : -1);
      if (drawBottom)
        index = webglext2.putQuadXys(xy_NDC, index, drawLeft ? -1 + w_NDC : -1, 1, -1 + h_NDC, -1);
      if (drawLeft)
        index = webglext2.putQuadXys(xy_NDC, index, -1, -1 + w_NDC, drawTop ? 1 - h_NDC : 1, -1);
      xyBuffer_NDC.setData(xy_NDC);
      a_XyNdc.setDataAndEnable(gl, xyBuffer_NDC, 2, webglext2.GL.FLOAT);
      gl.drawArrays(webglext2.GL.TRIANGLES, 0, numVertices);
      a_XyNdc.disable(gl);
      program.endUse(gl);
    };
  }
  function newSimpleBorderPainter(color, options) {
    var drawTop = options.drawTop;
    var drawLeft = options.drawLeft;
    var drawRight = options.drawRight;
    var drawBottom = options.drawBottom;
    var program = new webglext2.Program(webglext2.xyNdc_VERTSHADER, webglext2.solid_FRAGSHADER);
    var u_Color = new webglext2.UniformColor(program, "u_Color");
    var a_XyNdc = new webglext2.Attribute(program, "a_XyNdc");
    var numVertices = (drawTop ? 2 : 0) + (drawLeft ? 2 : 0) + (drawRight ? 2 : 0) + (drawBottom ? 2 : 0);
    var xy_NDC = new Float32Array(2 * numVertices);
    var xyBuffer_NDC = webglext2.newDynamicBuffer();
    return function(gl, viewport) {
      gl.disable(webglext2.GL.BLEND);
      program.use(gl);
      u_Color.setData(gl, color);
      var left_NDC = webglext2.fracToNdc(0.5 / viewport.w);
      var bottom_NDC = webglext2.fracToNdc(0.5 / viewport.h);
      var right_NDC = webglext2.fracToNdc((viewport.w - 0.5) / viewport.w);
      var top_NDC = webglext2.fracToNdc((viewport.h - 0.5) / viewport.h);
      var n = 0;
      if (drawTop) {
        xy_NDC[n++] = -1;
        xy_NDC[n++] = top_NDC;
        xy_NDC[n++] = 1;
        xy_NDC[n++] = top_NDC;
      }
      if (drawRight) {
        xy_NDC[n++] = right_NDC;
        xy_NDC[n++] = 1;
        xy_NDC[n++] = right_NDC;
        xy_NDC[n++] = -1;
      }
      if (drawBottom) {
        xy_NDC[n++] = 1;
        xy_NDC[n++] = bottom_NDC;
        xy_NDC[n++] = -1;
        xy_NDC[n++] = bottom_NDC;
      }
      if (drawLeft) {
        xy_NDC[n++] = left_NDC;
        xy_NDC[n++] = -1;
        xy_NDC[n++] = left_NDC;
        xy_NDC[n++] = 1;
      }
      xyBuffer_NDC.setData(xy_NDC);
      a_XyNdc.setDataAndEnable(gl, xyBuffer_NDC, 2, webglext2.GL.FLOAT);
      gl.lineWidth(1);
      gl.drawArrays(webglext2.GL.LINES, 0, numVertices);
      a_XyNdc.disable(gl);
      program.endUse(gl);
    };
  }
  function newRowBorderPainter(color, ui, row, options) {
    var thickness = options.thickness;
    var selection = ui.selection;
    var rowmodel = row;
    if (!webglext2.isNotEmpty(options.thickness))
      thickness = 1;
    var program = new webglext2.Program(webglext2.xyNdc_VERTSHADER, webglext2.solid_FRAGSHADER);
    var u_Color = new webglext2.UniformColor(program, "u_Color");
    var a_XyNdc = new webglext2.Attribute(program, "a_XyNdc");
    var xyBuffer_NDC = webglext2.newDynamicBuffer();
    var numVertices = 24;
    var xy_NDC = new Float32Array(2 * numVertices);
    var borderColor = null;
    return function(gl, viewport) {
      gl.disable(webglext2.GL.BLEND);
      if (selection.selectedRow.hasValue(rowmodel)) {
        borderColor = color;
      } else {
        borderColor = webglext2.rgba(255, 255, 255, 1);
      }
      program.use(gl);
      u_Color.setData(gl, borderColor);
      var w_NDC = 2 * thickness / viewport.w;
      var h_NDC = 2 * thickness / viewport.h;
      var index = 0;
      if (borderColor)
        index = webglext2.putQuadXys(xy_NDC, index, -1, 1 - w_NDC, 1, 1 - h_NDC);
      if (borderColor)
        index = webglext2.putQuadXys(xy_NDC, index, 1 - w_NDC, 1, 1, -1 + h_NDC);
      if (borderColor)
        index = webglext2.putQuadXys(xy_NDC, index, -1 + w_NDC, 1, -1 + h_NDC, -1);
      if (borderColor)
        index = webglext2.putQuadXys(xy_NDC, index, -1, -1 + w_NDC, 1 - h_NDC, -1);
      xyBuffer_NDC.setData(xy_NDC);
      a_XyNdc.setDataAndEnable(gl, xyBuffer_NDC, 2, webglext2.GL.FLOAT);
      gl.drawArrays(webglext2.GL.TRIANGLES, 0, numVertices);
      a_XyNdc.disable(gl);
      program.endUse(gl);
    };
  }
  webglext2.newRowBorderPainter = newRowBorderPainter;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var Axis1D = function() {
    function Axis1D2(vMin, vMax) {
      this._limitsChanged = new webglext2.Notification();
      this._vMin = vMin;
      this._vMax = vMax;
    }
    Object.defineProperty(Axis1D2.prototype, "vMin", {
      get: function() {
        return this._vMin;
      },
      set: function(vMin) {
        this._vMin = vMin;
        this._limitsChanged.fire();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Axis1D2.prototype, "vMax", {
      get: function() {
        return this._vMax;
      },
      set: function(vMax) {
        this._vMax = vMax;
        this._limitsChanged.fire();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Axis1D2.prototype, "limitsChanged", {
      get: function() {
        return this._limitsChanged;
      },
      enumerable: false,
      configurable: true
    });
    Axis1D2.prototype.setVRange = function(vMin, vMax) {
      this._vMin = vMin;
      this._vMax = vMax;
      this._limitsChanged.fire();
    };
    Object.defineProperty(Axis1D2.prototype, "vSize", {
      get: function() {
        return this._vMax - this._vMin;
      },
      enumerable: false,
      configurable: true
    });
    Axis1D2.prototype.vAtFrac = function(vFrac) {
      return this._vMin + vFrac * (this._vMax - this._vMin);
    };
    Axis1D2.prototype.vFrac = function(v) {
      return (v - this._vMin) / (this._vMax - this._vMin);
    };
    Axis1D2.prototype.pan = function(vAmount) {
      this._vMin += vAmount;
      this._vMax += vAmount;
      this._limitsChanged.fire();
    };
    Axis1D2.prototype.zoom = function(factor, vAnchor) {
      this._vMin = vAnchor - factor * (vAnchor - this._vMin);
      this._vMax = vAnchor + factor * (this._vMax - vAnchor);
      this._limitsChanged.fire();
    };
    return Axis1D2;
  }();
  webglext2.Axis1D = Axis1D;
  function getTickInterval(axis, approxNumTicks) {
    var vMin = Math.min(axis.vMin, axis.vMax);
    var vMax = Math.max(axis.vMin, axis.vMax);
    var approxTickInterval = (vMax - vMin) / approxNumTicks;
    var prelimTickInterval = Math.pow(10, Math.round(webglext2.log10(approxTickInterval)));
    var prelimNumTicks = (vMax - vMin) / prelimTickInterval;
    if (prelimNumTicks >= 5 * approxNumTicks)
      return prelimTickInterval * 5;
    if (prelimNumTicks >= 2 * approxNumTicks)
      return prelimTickInterval * 2;
    if (5 * prelimNumTicks <= approxNumTicks)
      return prelimTickInterval / 5;
    if (2 * prelimNumTicks <= approxNumTicks)
      return prelimTickInterval / 2;
    return prelimTickInterval;
  }
  webglext2.getTickInterval = getTickInterval;
  function getTickCount(axis, tickInterval) {
    return Math.ceil(Math.abs(axis.vSize) / tickInterval) + 1;
  }
  webglext2.getTickCount = getTickCount;
  function getTickPositions(axis, tickInterval, tickCount, result) {
    var vMin = Math.min(axis.vMin, axis.vMax);
    var vMax = Math.max(axis.vMin, axis.vMax);
    var minTickNumber = Math.floor(vMin / tickInterval);
    for (var i = 0; i < tickCount; i++) {
      result[i] = (minTickNumber + i) * tickInterval;
    }
    if (axis.vMin > axis.vMax) {
      for (var i = 0; i < tickCount / 2; i++) {
        var temp = result[i];
        result[i] = result[tickCount - 1 - i];
        result[tickCount - 1 - i] = temp;
      }
    }
  }
  webglext2.getTickPositions = getTickPositions;
  var Axis2D = function() {
    function Axis2D2(xAxis, yAxis) {
      this._xAxis = xAxis;
      this._yAxis = yAxis;
    }
    Object.defineProperty(Axis2D2.prototype, "xAxis", {
      get: function() {
        return this._xAxis;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Axis2D2.prototype, "xMin", {
      get: function() {
        return this._xAxis.vMin;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Axis2D2.prototype, "xMax", {
      get: function() {
        return this._xAxis.vMax;
      },
      enumerable: false,
      configurable: true
    });
    Axis2D2.prototype.xAtFrac = function(xFrac) {
      return this._xAxis.vAtFrac(xFrac);
    };
    Object.defineProperty(Axis2D2.prototype, "yAxis", {
      get: function() {
        return this._yAxis;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Axis2D2.prototype, "yMin", {
      get: function() {
        return this._yAxis.vMin;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Axis2D2.prototype, "yMax", {
      get: function() {
        return this._yAxis.vMax;
      },
      enumerable: false,
      configurable: true
    });
    Axis2D2.prototype.yAtFrac = function(yFrac) {
      return this._yAxis.vAtFrac(yFrac);
    };
    Axis2D2.prototype.onLimitsChanged = function(listener) {
      this._xAxis.limitsChanged.on(listener);
      this._yAxis.limitsChanged.on(listener);
    };
    Axis2D2.prototype.pan = function(xAmount, yAmount) {
      this._xAxis.pan(xAmount);
      this._yAxis.pan(yAmount);
    };
    Axis2D2.prototype.zoom = function(factor, xAnchor, yAnchor) {
      this._xAxis.zoom(factor, xAnchor);
      this._yAxis.zoom(factor, yAnchor);
    };
    return Axis2D2;
  }();
  webglext2.Axis2D = Axis2D;
  function newAxis2D(xMin, xMax, yMin, yMax) {
    return new Axis2D(new Axis1D(xMin, xMax), new Axis1D(yMin, yMax));
  }
  webglext2.newAxis2D = newAxis2D;
  webglext2.axisZoomStep = 1.12;
  function attachAxisMouseListeners1D(pane, axis, isVertical) {
    var vGrab = null;
    pane.mouseDown.on(function(ev) {
      if (webglext2.isLeftMouseDown(ev.mouseEvent) && !webglext2.isNotEmpty(vGrab)) {
        vGrab = axis.vAtFrac(isVertical ? webglext2.yFrac(ev) : webglext2.xFrac(ev));
      }
    });
    pane.mouseMove.on(function(ev) {
      if (webglext2.isLeftMouseDown(ev.mouseEvent) && webglext2.isNotEmpty(vGrab)) {
        axis.pan(vGrab - axis.vAtFrac(isVertical ? webglext2.yFrac(ev) : webglext2.xFrac(ev)));
      }
    });
    pane.mouseUp.on(function(ev) {
      vGrab = null;
    });
    pane.mouseWheel.on(function(ev) {
      var zoomFactor = Math.pow(webglext2.axisZoomStep, ev.wheelSteps);
      axis.zoom(zoomFactor, axis.vAtFrac(isVertical ? webglext2.yFrac(ev) : webglext2.xFrac(ev)));
    });
  }
  webglext2.attachAxisMouseListeners1D = attachAxisMouseListeners1D;
  function attachAxisMouseListeners2D(pane, axis) {
    var xGrab = null;
    var yGrab = null;
    pane.mouseDown.on(function(ev) {
      if (webglext2.isLeftMouseDown(ev.mouseEvent) && !webglext2.isNotEmpty(xGrab)) {
        xGrab = axis.xAtFrac(webglext2.xFrac(ev));
        yGrab = axis.yAtFrac(webglext2.yFrac(ev));
      }
    });
    pane.mouseMove.on(function(ev) {
      if (webglext2.isLeftMouseDown(ev.mouseEvent) && webglext2.isNotEmpty(xGrab)) {
        axis.pan(xGrab - axis.xAtFrac(webglext2.xFrac(ev)), yGrab - axis.yAtFrac(webglext2.yFrac(ev)));
      }
    });
    pane.mouseUp.on(function(ev) {
      xGrab = null;
      yGrab = null;
    });
    pane.mouseWheel.on(function(ev) {
      var zoomFactor = Math.pow(webglext2.axisZoomStep, ev.wheelSteps);
      axis.zoom(zoomFactor, axis.xAtFrac(webglext2.xFrac(ev)), axis.yAtFrac(webglext2.yFrac(ev)));
    });
  }
  webglext2.attachAxisMouseListeners2D = attachAxisMouseListeners2D;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function newPlotLayout(options) {
    var horizAxisHeight = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.horizAxisHeight) ? options.horizAxisHeight : 60;
    var vertAxisWidth = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.vertAxisWidth) ? options.vertAxisWidth : 70;
    return {
      updateChildViewports: function(children, parentViewport) {
        var topAxes = [];
        var leftAxes = [];
        var rightAxes = [];
        var bottomAxes = [];
        var centers = [];
        var others = [];
        for (var c = 0; c < children.length; c++) {
          var child = children[c];
          switch (child.layoutArg) {
            case webglext2.Side.TOP:
              topAxes.push(child);
              break;
            case webglext2.Side.LEFT:
              leftAxes.push(child);
              break;
            case webglext2.Side.RIGHT:
              rightAxes.push(child);
              break;
            case webglext2.Side.BOTTOM:
              bottomAxes.push(child);
              break;
            case null:
              centers.push(child);
              break;
            default:
              others.push(child);
              break;
          }
        }
        var numVertAxes = leftAxes.length + rightAxes.length;
        var numHorizAxes = topAxes.length + bottomAxes.length;
        var centerWidth = Math.max(vertAxisWidth, parentViewport.w - numVertAxes * vertAxisWidth);
        var centerHeight = Math.max(horizAxisHeight, parentViewport.h - numHorizAxes * horizAxisHeight);
        var vertAxisWidth2 = numVertAxes === 0 ? 0 : (parentViewport.w - centerWidth) / numVertAxes;
        var horizAxisHeight2 = numHorizAxes === 0 ? 0 : (parentViewport.h - centerHeight) / numHorizAxes;
        var iCenterStart = parentViewport.iStart + leftAxes.length * vertAxisWidth2;
        var iCenterEnd = parentViewport.iEnd - rightAxes.length * vertAxisWidth2;
        var jCenterStart = parentViewport.jStart + bottomAxes.length * horizAxisHeight2;
        var jCenterEnd = parentViewport.jEnd - topAxes.length * horizAxisHeight2;
        for (var c = 0; c < topAxes.length; c++) {
          var jStart = Math.round(jCenterEnd + c * horizAxisHeight2);
          var jEnd = c === topAxes.length - 1 ? parentViewport.jEnd : Math.round(jCenterEnd + (c + 1) * horizAxisHeight2);
          topAxes[c].viewport.setEdges(iCenterStart, iCenterEnd, jStart, jEnd);
        }
        for (var c = 0; c < bottomAxes.length; c++) {
          var jStart = c === bottomAxes.length - 1 ? parentViewport.jStart : Math.round(jCenterStart - (c + 1) * horizAxisHeight2);
          var jEnd = Math.round(jCenterStart - c * horizAxisHeight2);
          bottomAxes[c].viewport.setEdges(iCenterStart, iCenterEnd, jStart, jEnd);
        }
        for (var c = 0; c < leftAxes.length; c++) {
          var iStart = c === leftAxes.length - 1 ? parentViewport.iStart : Math.round(iCenterStart - (c + 1) * vertAxisWidth2);
          var iEnd = Math.round(iCenterStart - c * vertAxisWidth2);
          leftAxes[c].viewport.setEdges(iStart, iEnd, jCenterStart, jCenterEnd);
        }
        for (var c = 0; c < rightAxes.length; c++) {
          var iStart = Math.round(iCenterEnd + c * vertAxisWidth2);
          var iEnd = c === rightAxes.length - 1 ? parentViewport.iEnd : Math.round(iCenterEnd + (c + 1) * vertAxisWidth2);
          rightAxes[c].viewport.setEdges(iStart, iEnd, jCenterStart, jCenterEnd);
        }
        for (var c = 0; c < centers.length; c++) {
          centers[c].viewport.setEdges(iCenterStart, iCenterEnd, jCenterStart, jCenterEnd);
        }
        for (var c = 0; c < others.length; c++) {
          others[c].viewport.setEdges(0, 0, 0, 0);
        }
      }
    };
  }
  webglext2.newPlotLayout = newPlotLayout;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function edgeMarks_VERTSHADER(labelSide) {
    var horizontal = labelSide === webglext2.Side.TOP || labelSide === webglext2.Side.BOTTOM;
    var bFlip = labelSide === webglext2.Side.LEFT || labelSide === webglext2.Side.BOTTOM;
    return webglext2.concatLines(webglext2.nearestPixelCenter_GLSLFUNC, "                                                                                               ", "  uniform float u_VMin;                                                                        ", "  uniform float u_VSize;                                                                       ", "  uniform vec2 u_ViewportSize;                                                                 ", "  uniform float u_MarkSize;                                                                    ", "                                                                                               ", "  attribute vec2 a_VCoord;                                                                     ", "                                                                                               ", "  void main( ) {                                                                               ", "      float aViewportSize = " + (horizontal ? "u_ViewportSize.x" : "u_ViewportSize.y") + ";  ", "      float aFrac = nearestPixelCenter( ( a_VCoord.x - u_VMin ) / u_VSize, aViewportSize );    ", "      float a = -1.0 + 2.0*( aFrac );                                                          ", "                                                                                               ", "      float bViewportSize = " + (horizontal ? "u_ViewportSize.y" : "u_ViewportSize.x") + ";  ", "      float bFrac = ( a_VCoord.y * u_MarkSize ) / bViewportSize;                               ", "      float b = " + (bFlip ? "-" : "") + "( -1.0 + 2.0*( bFrac ) );                         ", "                                                                                               ", "      gl_Position = vec4( " + (horizontal ? "a,b" : "b,a") + ", 0.0, 1.0 );                  ", "  }                                                                                            ", "                                                                                               ");
  }
  webglext2.edgeMarks_VERTSHADER = edgeMarks_VERTSHADER;
  webglext2.gradient_FRAGSHADER = webglext2.concatLines("                                 ", "  precision highp float;         ", "  uniform sampler2D u_colorTex;  ", "                                 ", "  varying vec2 v_texCoord;       ", "                                                                                   ", "  void main( ) {                                                                   ", "     vec4 color = texture2D( u_colorTex, v_texCoord );                             ", "     gl_FragColor = color;                                                         ", "     gl_FragColor.a = 1.0;                                                         ", "  }                                                                                ");
  function newEdgeAxisPainter(axis, labelSide, options) {
    var tickSpacings = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.tickSpacings) ? options.tickSpacings : 100;
    var label = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.label) ? options.label : "";
    var units = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.units) ? options.units : "";
    var shortenLabels = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.shortenLabels) ? options.shortenLabels : true;
    var font = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.font) ? options.font : "11px verdana,sans-serif";
    var textColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.textColor) ? options.textColor : webglext2.black;
    var tickColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.tickColor) ? options.tickColor : webglext2.black;
    var tickSize = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.tickSize) ? options.tickSize : 6;
    var showLabel = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.showLabel) ? options.showLabel : true;
    var showBorder = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.showBorder) ? options.showBorder : false;
    var tickLabeler = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.tickLabeler) ? options.tickLabeler : void 0;
    var tickPositions = new Float32Array(0);
    var borderProgram = new webglext2.Program(webglext2.modelview_VERTSHADER, webglext2.solid_FRAGSHADER);
    var borderProgram_a_Position = new webglext2.Attribute(borderProgram, "a_Position");
    var borderProgram_u_modelViewMatrix = new webglext2.UniformMatrix4f(borderProgram, "u_modelViewMatrix");
    var borderProgram_u_Color = new webglext2.UniformColor(borderProgram, "u_Color");
    var borderCoords = new Float32Array(0);
    var borderCoordsBuffer = webglext2.newDynamicBuffer();
    var marksProgram = new webglext2.Program(edgeMarks_VERTSHADER(labelSide), webglext2.solid_FRAGSHADER);
    var marksProgram_u_VMin = new webglext2.Uniform1f(marksProgram, "u_VMin");
    var marksProgram_u_VSize = new webglext2.Uniform1f(marksProgram, "u_VSize");
    var marksProgram_u_ViewportSize = new webglext2.Uniform2f(marksProgram, "u_ViewportSize");
    var marksProgram_u_MarkSize = new webglext2.Uniform1f(marksProgram, "u_MarkSize");
    var marksProgram_u_Color = new webglext2.UniformColor(marksProgram, "u_Color");
    var marksProgram_a_VCoord = new webglext2.Attribute(marksProgram, "a_VCoord");
    var markCoords = new Float32Array(0);
    var markCoordsBuffer = webglext2.newDynamicBuffer();
    var textTextures = webglext2.newTextTextureCache(font, textColor);
    var textureRenderer = new webglext2.TextureRenderer();
    var hTickLabels = textTextures.value("-0.123456789").h;
    var isVerticalAxis = labelSide === webglext2.Side.LEFT || labelSide === webglext2.Side.RIGHT;
    return function(gl, viewport) {
      var sizePixels = isVerticalAxis ? viewport.h : viewport.w;
      if (sizePixels === 0)
        return;
      var approxNumTicks = sizePixels / tickSpacings;
      var tickInterval = webglext2.getTickInterval(axis, approxNumTicks);
      var tickCount = webglext2.getTickCount(axis, tickInterval);
      tickPositions = webglext2.ensureCapacityFloat32(tickPositions, tickCount);
      webglext2.getTickPositions(axis, tickInterval, tickCount, tickPositions);
      if (showBorder) {
        borderCoords = webglext2.ensureCapacityFloat32(borderCoords, 10);
        var horizontal = labelSide === webglext2.Side.TOP || labelSide === webglext2.Side.BOTTOM;
        var bFlip = labelSide === webglext2.Side.LEFT || labelSide === webglext2.Side.BOTTOM;
        var width = viewport.w - 1;
        var height = viewport.h - 1;
        borderCoords[0] = horizontal ? 0 : bFlip ? width - tickSize : 0;
        borderCoords[1] = !horizontal ? 0 : bFlip ? height - tickSize : 0;
        borderCoords[2] = horizontal ? 0 : bFlip ? width : tickSize;
        borderCoords[3] = !horizontal ? 0 : bFlip ? height : tickSize;
        borderCoords[4] = horizontal ? width : bFlip ? width : tickSize;
        borderCoords[5] = !horizontal ? height : bFlip ? height : tickSize;
        borderCoords[6] = horizontal ? width : bFlip ? width - tickSize : 0;
        borderCoords[7] = !horizontal ? height : bFlip ? height - tickSize : 0;
        borderCoords[8] = horizontal ? 0 : bFlip ? width - tickSize : 0;
        borderCoords[9] = !horizontal ? 0 : bFlip ? height - tickSize : 0;
      }
      if (showBorder) {
        borderProgram.use(gl);
        borderProgram_u_Color.setData(gl, tickColor);
        borderProgram_u_modelViewMatrix.setData(gl, webglext2.glOrthoViewport(viewport));
        borderCoordsBuffer.setData(borderCoords.subarray(0, 10));
        borderProgram_a_Position.setDataAndEnable(gl, borderCoordsBuffer, 2, webglext2.GL.FLOAT);
        gl.lineWidth(1);
        gl.drawArrays(webglext2.GL.LINE_STRIP, 0, 5);
        borderProgram_a_Position.disable(gl);
        borderProgram.endUse(gl);
      }
      marksProgram.use(gl);
      marksProgram_u_VMin.setData(gl, axis.vMin);
      marksProgram_u_VSize.setData(gl, axis.vSize);
      marksProgram_u_ViewportSize.setData(gl, viewport.w, viewport.h);
      marksProgram_u_MarkSize.setData(gl, tickSize);
      marksProgram_u_Color.setData(gl, tickColor);
      markCoords = webglext2.ensureCapacityFloat32(markCoords, 4 * tickCount);
      for (var n = 0; n < tickCount; n++) {
        var v = tickPositions[n];
        markCoords[4 * n + 0] = v;
        markCoords[4 * n + 1] = 0;
        markCoords[4 * n + 2] = v;
        markCoords[4 * n + 3] = 1;
      }
      markCoordsBuffer.setData(markCoords.subarray(0, 4 * tickCount));
      marksProgram_a_VCoord.setDataAndEnable(gl, markCoordsBuffer, 2, webglext2.GL.FLOAT);
      gl.lineWidth(1);
      gl.drawArrays(webglext2.GL.LINES, 0, 2 * tickCount);
      marksProgram_a_VCoord.disable(gl);
      marksProgram.endUse(gl);
      gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
      gl.enable(webglext2.GL.BLEND);
      var orderAxisRaw = webglext2.order(Math.abs(axis.vSize));
      var orderAxis = 0;
      if (orderAxisRaw > 0) {
        orderAxis = Math.floor((orderAxisRaw - 1) / 3) * 3;
      } else if (orderAxisRaw < 0) {
        orderAxis = (Math.ceil(orderAxisRaw / 3) - 1) * 3;
      }
      var orderFactor = Math.pow(10, -orderAxis);
      var orderTick = webglext2.order(tickInterval);
      var precision = Math.max(0, orderAxis - orderTick);
      textTextures.resetTouches();
      textureRenderer.begin(gl, viewport);
      for (var n = 0; n < tickCount; n++) {
        var v = tickPositions[n];
        var vFrac = axis.vFrac(v);
        if (vFrac < 0 || vFrac >= 1)
          continue;
        var tickLabel;
        if (tickLabeler) {
          tickLabel = tickLabeler(v, axis, tickInterval);
        } else if (shortenLabels && showLabel) {
          tickLabel = Number(v * orderFactor).toFixed(precision);
        } else if (!shortenLabels) {
          if (orderAxisRaw >= 0) {
            tickLabel = Number(v).toFixed(0);
          } else {
            tickLabel = Number(v).toFixed(-orderAxisRaw);
          }
        } else {
          tickLabel = Number(v * orderFactor).toFixed(precision) + (orderAxis === 0 ? "" : "e" + orderAxis);
        }
        var textTexture = textTextures.value(tickLabel);
        var xFrac;
        var yFrac;
        if (labelSide === webglext2.Side.LEFT || labelSide === webglext2.Side.RIGHT) {
          var yAnchor = textTexture.yAnchor(0.43);
          var j0 = vFrac * viewport.h - yAnchor * textTexture.h;
          var j = webglext2.clamp(0, viewport.h - textTexture.h, j0);
          yFrac = j / viewport.h;
          if (labelSide === webglext2.Side.LEFT) {
            xFrac = (viewport.w - tickSize - 2 - textTexture.w) / viewport.w;
          } else {
            xFrac = (tickSize + 2) / viewport.w;
          }
        } else {
          var wMinus = 0;
          if (v < 0) {
            var absTickLabel = Number(Math.abs(v) * orderFactor).toFixed(precision);
            wMinus = textTexture.w - textTextures.value(absTickLabel).w;
          }
          var xAnchor = 0.45;
          var i0 = vFrac * viewport.w - xAnchor * (textTexture.w - wMinus) - wMinus;
          var i = webglext2.clamp(0, viewport.w - textTexture.w, i0);
          xFrac = i / viewport.w;
          if (labelSide === webglext2.Side.BOTTOM) {
            yFrac = (viewport.h - tickSize - 2 - hTickLabels) / viewport.h;
          } else {
            yFrac = (tickSize + 2) / viewport.h;
          }
        }
        textureRenderer.draw(gl, textTexture, xFrac, yFrac, { xAnchor: 0, yAnchor: 0 });
      }
      if (showLabel) {
        var unitsString = units + (!shortenLabels || orderAxis === 0 ? "" : " x 10^" + orderAxis.toFixed(0));
        var axisLabel = label + (unitsString ? " (" + unitsString + ")" : "");
        if (axisLabel !== "") {
          var textTexture = textTextures.value(axisLabel);
          var xFrac;
          var yFrac;
          var textOpts;
          if (labelSide === webglext2.Side.LEFT || labelSide === webglext2.Side.RIGHT) {
            var xFrac0 = 0.5 * (viewport.w - tickSize - 2 - hTickLabels) / viewport.w;
            xFrac = labelSide === webglext2.Side.LEFT ? xFrac0 : 1 - xFrac0;
            yFrac = 0.5;
            textOpts = {
              xAnchor: textTexture.yAnchor(0.5),
              yAnchor: 0.5,
              rotation_CCWRAD: 0.5 * Math.PI
            };
          } else {
            var yFrac0 = 0.5 * (viewport.h - tickSize - 2 - hTickLabels) / viewport.h;
            yFrac = labelSide === webglext2.Side.BOTTOM ? yFrac0 : 1 - yFrac0;
            xFrac = 0.5;
            textOpts = {
              xAnchor: 0.5,
              yAnchor: textTexture.yAnchor(0.5),
              rotation_CCWRAD: 0
            };
          }
          textureRenderer.draw(gl, textTexture, xFrac, yFrac, textOpts);
        }
      }
      textureRenderer.end(gl);
      textTextures.retainTouched();
    };
  }
  webglext2.newEdgeAxisPainter = newEdgeAxisPainter;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function newXyLinePainter(axis, xCoords, yCoords, options) {
    var thickness = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.thickness) ? options.thickness : 4;
    var color = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.color) ? options.color : webglext2.black;
    var blend = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.blend) ? options.blend : false;
    var program = new webglext2.Program(webglext2.modelview_VERTSHADER, webglext2.solid_FRAGSHADER);
    var u_Color = new webglext2.UniformColor(program, "u_Color");
    var u_modelViewMatrix = new webglext2.UniformMatrix4f(program, "u_modelViewMatrix");
    var coordArray = [];
    for (var i = 0; i < xCoords.length; i++) {
      coordArray[2 * i] = xCoords[i];
      coordArray[2 * i + 1] = yCoords[i];
    }
    var coordFloatArray = new Float32Array(coordArray);
    var coordBuffer = webglext2.newStaticBuffer(coordFloatArray);
    var dim = 2;
    var count = coordFloatArray.length / dim;
    return function(gl, viewport) {
      if (blend) {
        gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
        gl.enable(webglext2.GL.BLEND);
      }
      program.use(gl);
      u_Color.setData(gl, color);
      u_modelViewMatrix.setData(gl, webglext2.glOrthoAxis(axis));
      gl.lineWidth(thickness);
      gl.enableVertexAttribArray(0);
      coordBuffer.bind(gl, webglext2.GL.ARRAY_BUFFER);
      gl.vertexAttribPointer(0, dim, webglext2.GL.FLOAT, false, 0, 0);
      gl.drawArrays(webglext2.GL.LINE_STRIP, 0, count);
      coordBuffer.unbind(gl, webglext2.GL.ARRAY_BUFFER);
      program.endUse(gl);
    };
  }
  webglext2.newXyLinePainter = newXyLinePainter;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function jet(value) {
    var x = 4 * value;
    var r = clamp(1.5 - Math.abs(x - 3), 0, 1);
    var g = clamp(1.5 - Math.abs(x - 2), 0, 1);
    var b = clamp(1.5 - Math.abs(x - 1), 0, 1);
    return [r, g, b, 1];
  }
  webglext2.jet = jet;
  function reverseBone(value) {
    var x = 1 - 0.875 * value;
    if (value < 0.375) {
      return [x, x, x - value / 3, 1];
    } else if (value < 0.75) {
      return [x, x + 0.125 - value / 3, x - 0.125, 1];
    } else {
      return [x + 0.375 - value * 0.5, x - 0.125, x - 0.125, 1];
    }
  }
  webglext2.reverseBone = reverseBone;
  function getGradientTexture(gradient, size) {
    if (size === void 0) {
      size = 1024;
    }
    var array = new Float32Array(size * 4);
    for (var v = 0; v < size; v++) {
      var color = gradient(v / size);
      array[4 * v + 0] = color[0];
      array[4 * v + 1] = color[1];
      array[4 * v + 2] = color[2];
      array[4 * v + 3] = color[3];
    }
    return new webglext2.FloatDataTexture2D(size, 1, array);
  }
  webglext2.getGradientTexture = getGradientTexture;
  function clamp(n, min, max) {
    if (n < min) {
      return min;
    } else if (n > max) {
      return max;
    } else {
      return n;
    }
  }
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  webglext2.heatmap_VERTSHADER = webglext2.concatLines("                                                          ", "    uniform mat4 u_modelViewMatrix;                       ", "    attribute vec4 a_vertCoord;                           ", "    attribute vec2 a_texCoord;                            ", "    varying vec2 v_texCoord;                              ", "                                                          ", "    void main( ) {                                        ", "        gl_Position = u_modelViewMatrix * a_vertCoord;    ", "        v_texCoord = a_texCoord;                          ", "    }                                                     ", "                                                          ");
  webglext2.heatmap_FRAGSHADER = webglext2.concatLines("                                 ", "  precision highp float;         ", "  uniform sampler2D u_dataTex;   ", "  uniform sampler2D u_colorTex;  ", "  uniform float u_dataMin;       ", "  uniform float u_dataMax;       ", "                                 ", "  varying vec2 v_texCoord;       ", "                                                                                   ", "  void main()                                                                      ", "  {                                                                                ", "     float dataVal = texture2D( u_dataTex, v_texCoord ).r;                         ", "     float normalizedVal = ( dataVal - u_dataMin ) / ( u_dataMax - u_dataMin );    ", "     clamp( normalizedVal, 0.0, 1.0 );                                             ", "                                                                                   ", "     vec4 color = texture2D( u_colorTex, vec2( normalizedVal, 0 ) );               ", "     gl_FragColor = color;                                                         ", "     gl_FragColor.a = 1.0;                                                         ", "  }                                                                                ");
  function newHeatmapPainter(axis, colorAxis, data, colorTexture, options) {
    var blend = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.blend) ? options.blend : false;
    var array = new Float32Array(data.xSize * data.ySize * 4);
    for (var x = 0; x < data.xSize; x++) {
      for (var y = 0; y < data.ySize; y++) {
        var index = x * data.ySize + y;
        var value = data.array[index];
        array[4 * index] = value;
        array[4 * index + 1] = value;
        array[4 * index + 2] = value;
        array[4 * index + 3] = value;
      }
    }
    data.array = array;
    var program = new webglext2.Program(webglext2.heatmap_VERTSHADER, webglext2.heatmap_FRAGSHADER);
    var u_modelViewMatrix = new webglext2.UniformMatrix4f(program, "u_modelViewMatrix");
    var u_dataTexture = new webglext2.UniformSampler2D(program, "u_dataTex");
    var u_colorTexture = new webglext2.UniformSampler2D(program, "u_colorTex");
    var u_dataMin = new webglext2.Uniform1f(program, "u_dataMin");
    var u_dataMax = new webglext2.Uniform1f(program, "u_dataMax");
    var a_vertCoord = new webglext2.Attribute(program, "a_vertCoord");
    var a_texCoord = new webglext2.Attribute(program, "a_texCoord");
    var texture = new webglext2.FloatDataTexture2D(data.xSize, data.ySize, data.array);
    var vertCoordArray = [data.xMin, data.yMax, data.xMax, data.yMax, data.xMin, data.yMin, data.xMax, data.yMin];
    var vertCoordFloatArray = new Float32Array(vertCoordArray);
    var vertCoordBuffer = webglext2.newStaticBuffer(vertCoordFloatArray);
    var texCoordArray = [0, 1, 1, 1, 0, 0, 1, 0];
    var texCoordFloatArray = new Float32Array(texCoordArray);
    var texCoordBuffer = webglext2.newStaticBuffer(texCoordFloatArray);
    var dim = 2;
    var vertexCount = 4;
    return function(gl, viewport) {
      if (blend) {
        gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
        gl.enable(webglext2.GL.BLEND);
      }
      program.use(gl);
      u_dataTexture.setDataAndBind(gl, 0, texture);
      u_colorTexture.setDataAndBind(gl, 1, colorTexture);
      u_modelViewMatrix.setData(gl, webglext2.glOrthoAxis(axis));
      u_dataMin.setData(gl, colorAxis.vMin);
      u_dataMax.setData(gl, colorAxis.vMax);
      a_vertCoord.setDataAndEnable(gl, vertCoordBuffer, dim, webglext2.GL.FLOAT);
      a_texCoord.setDataAndEnable(gl, texCoordBuffer, dim, webglext2.GL.FLOAT);
      gl.drawArrays(webglext2.GL.TRIANGLE_STRIP, 0, vertexCount);
      a_vertCoord.disable(gl);
      a_texCoord.disable(gl);
      u_dataTexture.unbind(gl);
      u_colorTexture.unbind(gl);
      program.endUse(gl);
    };
  }
  webglext2.newHeatmapPainter = newHeatmapPainter;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function secondsToMillis(value_SECONDS) {
    return value_SECONDS * 1e3;
  }
  webglext2.secondsToMillis = secondsToMillis;
  function millisToSeconds(value_MILLIS) {
    return value_MILLIS / 1e3;
  }
  webglext2.millisToSeconds = millisToSeconds;
  function minutesToMillis(value_MINUTES) {
    return value_MINUTES * 6e4;
  }
  webglext2.minutesToMillis = minutesToMillis;
  function millisToMinutes(value_MILLIS) {
    return value_MILLIS / 6e4;
  }
  webglext2.millisToMinutes = millisToMinutes;
  function hoursToMillis(value_HOURS) {
    return value_HOURS * 36e5;
  }
  webglext2.hoursToMillis = hoursToMillis;
  function millisToHours(value_MILLIS) {
    return value_MILLIS / 36e5;
  }
  webglext2.millisToHours = millisToHours;
  function daysToMillis(value_DAYS) {
    return value_DAYS * 864e5;
  }
  webglext2.daysToMillis = daysToMillis;
  function millisToDays(value_MILLIS) {
    return value_MILLIS / 864e5;
  }
  webglext2.millisToDays = millisToDays;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var TimeAxis1D = function(_super) {
    __extends(TimeAxis1D2, _super);
    function TimeAxis1D2(tMin_PMILLIS, tMax_PMILLIS) {
      var _this = this;
      var w_epoch_PMILLIS = 0.5 * (tMin_PMILLIS + tMax_PMILLIS);
      _this = _super.call(this, tMin_PMILLIS - w_epoch_PMILLIS, tMax_PMILLIS - w_epoch_PMILLIS) || this;
      _this._epoch_PMILLIS = 0.5 * (tMin_PMILLIS + tMax_PMILLIS);
      return _this;
    }
    Object.defineProperty(TimeAxis1D2.prototype, "tMin_PMILLIS", {
      get: function() {
        return this._epoch_PMILLIS + this.vMin;
      },
      set: function(tMin_PMILLIS) {
        this.vMin = tMin_PMILLIS - this._epoch_PMILLIS;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimeAxis1D2.prototype, "tMax_PMILLIS", {
      get: function() {
        return this._epoch_PMILLIS + this.vMax;
      },
      set: function(tMax_PMILLIS) {
        this.vMax = tMax_PMILLIS - this._epoch_PMILLIS;
      },
      enumerable: false,
      configurable: true
    });
    TimeAxis1D2.prototype.setTRange_PMILLIS = function(tMin_PMILLIS, tMax_PMILLIS) {
      this.setVRange(tMin_PMILLIS - this._epoch_PMILLIS, tMax_PMILLIS - this._epoch_PMILLIS);
    };
    Object.defineProperty(TimeAxis1D2.prototype, "tSize_MILLIS", {
      get: function() {
        return this.vSize;
      },
      enumerable: false,
      configurable: true
    });
    TimeAxis1D2.prototype.vAtTime = function(t_PMILLIS) {
      return t_PMILLIS - this._epoch_PMILLIS;
    };
    TimeAxis1D2.prototype.tAtFrac_PMILLIS = function(tFrac) {
      return this._epoch_PMILLIS + this.vAtFrac(tFrac);
    };
    TimeAxis1D2.prototype.tFrac = function(t_PMILLIS) {
      return this.vFrac(t_PMILLIS - this._epoch_PMILLIS);
    };
    TimeAxis1D2.prototype.tPan = function(vAmount) {
      this._vMin += vAmount;
      this._vMax += vAmount;
      var delta = 0;
      if (this._vMin < -this._epoch_PMILLIS) {
        delta = this._vMin + this._epoch_PMILLIS;
        this._vMax = this._vMax - delta;
        this._vMin = this._vMin - delta;
      }
      this._limitsChanged.fire();
    };
    TimeAxis1D2.prototype.tZoom = function(factor, vAnchor) {
      this._vMin = vAnchor - factor * (vAnchor - this._vMin);
      this._vMax = vAnchor + factor * (this._vMax - vAnchor);
      if (this._vMin < -this._epoch_PMILLIS) {
        this._vMin = -this._epoch_PMILLIS - 1e-6;
      }
      this._limitsChanged.fire();
    };
    return TimeAxis1D2;
  }(webglext2.Axis1D);
  webglext2.TimeAxis1D = TimeAxis1D;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function newTimeAxisPainter(timeAxis, labelSide, options) {
    var tickSpacings = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.tickSpacings) ? options.tickSpacings : 60;
    var font = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.font) ? options.font : "14px sans-serif";
    var textColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.textColor) ? options.textColor : webglext2.black;
    var tickColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.tickColor) ? options.tickColor : webglext2.black;
    var tickSize = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.tickSize) ? options.tickSize : 6;
    var labelAlign = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.labelAlign) ? options.labelAlign : 0.5;
    var referenceDate_PMILLIS = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.referenceDate) ? webglext2.parseTime_PMILLIS(options.referenceDate) : void 0;
    var isFuturePositive = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.isFuturePositive) ? options.isFuturePositive : true;
    var marksProgram = new webglext2.Program(webglext2.edgeMarks_VERTSHADER(labelSide), webglext2.solid_FRAGSHADER);
    var marksProgram_u_VMin = new webglext2.Uniform1f(marksProgram, "u_VMin");
    var marksProgram_u_VSize = new webglext2.Uniform1f(marksProgram, "u_VSize");
    var marksProgram_u_ViewportSize = new webglext2.Uniform2f(marksProgram, "u_ViewportSize");
    var marksProgram_u_MarkSize = new webglext2.Uniform1f(marksProgram, "u_MarkSize");
    var marksProgram_u_Color = new webglext2.UniformColor(marksProgram, "u_Color");
    var marksProgram_a_VCoord = new webglext2.Attribute(marksProgram, "a_VCoord");
    var markCoords = new Float32Array(0);
    var markCoordsBuffer = webglext2.newDynamicBuffer();
    var textTextures = webglext2.newTextTextureCache(font, textColor);
    var textureRenderer = new webglext2.TextureRenderer();
    var hTickLabels = textTextures.value("-0123456789:.").h;
    var isVerticalAxis = labelSide === webglext2.Side.LEFT || labelSide === webglext2.Side.RIGHT;
    return function(gl, viewport) {
      var sizePixels = isVerticalAxis ? viewport.h : viewport.w;
      if (sizePixels === 0)
        return;
      var tickTimes_PMILLIS = getTickTimes_PMILLIS(timeAxis, sizePixels, tickSpacings, referenceDate_PMILLIS);
      var tickInterval_MILLIS = getTickInterval_MILLIS(tickTimes_PMILLIS);
      var tickCount = tickTimes_PMILLIS.length;
      marksProgram.use(gl);
      marksProgram_u_VMin.setData(gl, timeAxis.vMin);
      marksProgram_u_VSize.setData(gl, timeAxis.vSize);
      marksProgram_u_ViewportSize.setData(gl, viewport.w, viewport.h);
      marksProgram_u_MarkSize.setData(gl, tickSize);
      marksProgram_u_Color.setData(gl, tickColor);
      markCoords = webglext2.ensureCapacityFloat32(markCoords, 4 * tickCount);
      for (var n = 0; n < tickCount; n++) {
        var v = timeAxis.vAtTime(tickTimes_PMILLIS[n]);
        markCoords[4 * n + 0] = v;
        markCoords[4 * n + 1] = 0;
        markCoords[4 * n + 2] = v;
        markCoords[4 * n + 3] = 1;
      }
      markCoordsBuffer.setData(markCoords.subarray(0, 4 * tickCount));
      marksProgram_a_VCoord.setDataAndEnable(gl, markCoordsBuffer, 2, webglext2.GL.FLOAT);
      gl.lineWidth(1);
      gl.drawArrays(webglext2.GL.LINES, 0, 2 * tickCount);
      marksProgram_a_VCoord.disable(gl);
      marksProgram.endUse(gl);
      gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
      gl.enable(webglext2.GL.BLEND);
      var ticks = getTickDisplayData(tickInterval_MILLIS, referenceDate_PMILLIS, isFuturePositive);
      textTextures.resetTouches();
      textureRenderer.begin(gl, viewport);
      for (var n = 0; n < tickCount; n++) {
        var tickTime_PMILLIS = tickTimes_PMILLIS[n];
        var tFrac = timeAxis.tFrac(tickTime_PMILLIS);
        if (tFrac < 0 || tFrac >= 1)
          continue;
        var tickLabel = ticks.tickFormat(tickTime_PMILLIS);
        var textTexture = textTextures.value(tickLabel);
        var xFrac;
        var yFrac;
        if (labelSide === webglext2.Side.LEFT || labelSide === webglext2.Side.RIGHT) {
          var yAnchor = textTexture.yAnchor(0.43);
          var j0 = tFrac * viewport.h - yAnchor * textTexture.h;
          var j = webglext2.clamp(0, viewport.h - textTexture.h, j0);
          yFrac = j / viewport.h;
          if (labelSide === webglext2.Side.LEFT) {
            xFrac = (viewport.w - tickSize - 2 - textTexture.w) / viewport.w;
          } else {
            xFrac = (tickSize + 2) / viewport.w;
          }
        } else {
          var xAnchor = 0.45;
          var i0 = tFrac * viewport.w - xAnchor * textTexture.w;
          var i = webglext2.clamp(0, viewport.w - textTexture.w, i0);
          xFrac = i / viewport.w;
          if (labelSide === webglext2.Side.BOTTOM) {
            yFrac = (viewport.h - tickSize - 2 - hTickLabels) / viewport.h;
          } else {
            yFrac = (tickSize + 2) / viewport.h;
          }
        }
        textureRenderer.draw(gl, textTexture, xFrac, yFrac, { xAnchor: 0, yAnchor: 0 });
      }
      textureRenderer.end(gl);
      textTextures.retainTouched();
    };
  }
  webglext2.newTimeAxisPainter = newTimeAxisPainter;
  function getTickDisplayData(tickInterval_MILLIS, referenceDate_PMILLIS, isFuturePositive) {
    return getTickDisplayDataRelative(tickInterval_MILLIS, 0, isFuturePositive);
  }
  function getTickDisplayDataRelative(tickInterval_MILLIS, referenceDate_PMILLIS, isFuturePositive) {
    if (tickInterval_MILLIS <= webglext2.minutesToMillis(1)) {
      var tickFormat = function(tickTime_PMILLIS) {
        var elapsedTime_MILLIS = Math.abs(tickTime_PMILLIS - referenceDate_PMILLIS);
        var elapsedTime_DAYS = webglext2.millisToDays(elapsedTime_MILLIS);
        var elapsedTime_DAYS_WHOLE = Math.floor(elapsedTime_DAYS);
        var elapsedTime_HOURS = (elapsedTime_DAYS - elapsedTime_DAYS_WHOLE) * 24;
        var elapsedTime_HOURS_WHOLE = Math.floor(elapsedTime_HOURS);
        var elapsedTime_MIN = (elapsedTime_HOURS - elapsedTime_HOURS_WHOLE) * 60;
        var elapsedTime_MIN_WHOLE = Math.floor(elapsedTime_MIN);
        var elapsedTime_SEC = (elapsedTime_MIN - elapsedTime_MIN_WHOLE) * 60;
        var elapsedTime_SEC_WHOLE = Math.floor(elapsedTime_SEC);
        var elapsedTime_MILLSEC = (elapsedTime_SEC - elapsedTime_SEC_WHOLE) * 100;
        var elapsedTime_MILLSEC_WHOLE = Math.round(elapsedTime_MILLSEC);
        if (elapsedTime_SEC_WHOLE >= 60) {
          elapsedTime_SEC_WHOLE -= 60;
          elapsedTime_MIN_WHOLE += 1;
        }
        if (elapsedTime_MIN_WHOLE >= 60) {
          elapsedTime_MIN_WHOLE = 0;
        }
        var min = elapsedTime_MIN_WHOLE < 10 ? "0" + elapsedTime_MIN_WHOLE : "" + elapsedTime_MIN_WHOLE;
        var sec = elapsedTime_SEC_WHOLE < 10 ? "0" + elapsedTime_SEC_WHOLE : "" + elapsedTime_SEC_WHOLE;
        var milli = elapsedTime_MILLSEC_WHOLE < 10 ? "0" + elapsedTime_MILLSEC_WHOLE : "" + elapsedTime_MILLSEC_WHOLE;
        if (tickInterval_MILLIS <= webglext2.secondsToMillis(1)) {
          return min + ":" + sec + ":" + milli;
        } else {
          return min + ":" + sec;
        }
      };
      var prefixFormat = function(timeStruct) {
        var center_PMILLIS = (timeStruct.end_PMILLIS - timeStruct.start_PMILLIS) / 2 + timeStruct.start_PMILLIS;
        var elapsedTime_MILLIS = center_PMILLIS - referenceDate_PMILLIS;
        var negative = elapsedTime_MILLIS < 0;
        var signString = negative && isFuturePositive || !negative && !isFuturePositive ? "-" : "";
        elapsedTime_MILLIS = Math.abs(elapsedTime_MILLIS);
        var elapsedTime_DAYS = webglext2.millisToDays(elapsedTime_MILLIS);
        var elapsedTime_DAYS_WHOLE = Math.floor(elapsedTime_DAYS);
        var elapsedTime_HOURS = (elapsedTime_DAYS - elapsedTime_DAYS_WHOLE) * 24;
        var elapsedTime_HOURS_WHOLE = Math.floor(elapsedTime_HOURS);
        return "Day " + signString + elapsedTime_DAYS_WHOLE + " Hour " + signString + elapsedTime_HOURS_WHOLE;
      };
      var timeStructFactory = function() {
        return new TimeStruct();
      };
    } else if (tickInterval_MILLIS <= webglext2.hoursToMillis(12)) {
      var tickFormat = function(tickTime_PMILLIS) {
        var elapsedTime_MILLIS = Math.abs(tickTime_PMILLIS - referenceDate_PMILLIS);
        var elapsedTime_DAYS = webglext2.millisToDays(elapsedTime_MILLIS);
        var elapsedTime_DAYS_WHOLE = Math.floor(elapsedTime_DAYS);
        var elapsedTime_HOURS = (elapsedTime_DAYS - elapsedTime_DAYS_WHOLE) * 24;
        var elapsedTime_HOURS_WHOLE = Math.floor(elapsedTime_HOURS);
        var elapsedTime_MIN = (elapsedTime_HOURS - elapsedTime_HOURS_WHOLE) * 60;
        var elapsedTime_MIN_WHOLE = Math.round(elapsedTime_MIN);
        if (elapsedTime_MIN_WHOLE >= 60) {
          elapsedTime_MIN_WHOLE -= 60;
          elapsedTime_HOURS_WHOLE += 1;
        }
        if (elapsedTime_HOURS_WHOLE >= 24) {
          elapsedTime_HOURS_WHOLE = 0;
        }
        var hour = elapsedTime_HOURS_WHOLE < 10 ? "0" + elapsedTime_HOURS_WHOLE : "" + elapsedTime_HOURS_WHOLE;
        var min = elapsedTime_MIN_WHOLE < 10 ? "0" + elapsedTime_MIN_WHOLE : "" + elapsedTime_MIN_WHOLE;
        return hour + ":" + min;
      };
      var prefixFormat = function(timeStruct) {
        var center_PMILLIS = (timeStruct.end_PMILLIS - timeStruct.start_PMILLIS) / 2 + timeStruct.start_PMILLIS;
        var elapsedTime_MILLIS = center_PMILLIS - referenceDate_PMILLIS;
        var negative = elapsedTime_MILLIS < 0;
        var signString = negative && isFuturePositive || !negative && !isFuturePositive ? "-" : "";
        elapsedTime_MILLIS = Math.abs(elapsedTime_MILLIS);
        var elapsedTime_DAYS = Math.floor(webglext2.millisToDays(elapsedTime_MILLIS));
        return "Day " + signString + elapsedTime_DAYS;
      };
      var timeStructFactory = function() {
        return new TimeStruct();
      };
    } else {
      var tickFormat = function(tickTime_PMILLIS) {
        var elapsedTime_MILLIS = tickTime_PMILLIS - referenceDate_PMILLIS;
        var negative = elapsedTime_MILLIS < 0;
        var signString = negative && isFuturePositive || !negative && !isFuturePositive ? "-" : "";
        elapsedTime_MILLIS = Math.abs(elapsedTime_MILLIS);
        var elapsedTime_DAYS = Math.floor(webglext2.millisToDays(elapsedTime_MILLIS));
        return elapsedTime_DAYS === 0 ? "" + elapsedTime_DAYS : signString + elapsedTime_DAYS;
      };
    }
    return { prefixFormat, tickFormat, timeStructFactory };
  }
  function getTickDisplayDataAbsolute(tickInterval_MILLIS) {
    var defaultTickFormat = function(format) {
      return function(tickTime_PMILLIS) {
        return moment(tickTime_PMILLIS).format(format);
      };
    };
    var defaultPrefixFormat = function(format) {
      return function(timeStruct) {
        return moment(timeStruct.textCenter_PMILLIS).format(format);
      };
    };
    if (tickInterval_MILLIS > webglext2.hoursToMillis(1)) {
      var tickFormat = defaultTickFormat("hh:mm:ss");
      var prefixFormat = defaultPrefixFormat("hh:mm:ss");
      var timeStructFactory = function() {
        return new HourStruct();
      };
    }
    if (tickInterval_MILLIS > webglext2.minutesToMillis(1)) {
      var tickFormat = defaultTickFormat("mm:ss");
      var prefixFormat = defaultPrefixFormat("mm:ss");
      var timeStructFactory = function() {
        return new HourStruct();
      };
    }
    if (tickInterval_MILLIS < webglext2.minutesToMillis(1)) {
      var tickFormat = defaultTickFormat("mm:ss.SSS");
      var prefixFormat = defaultPrefixFormat("mm:ss.SSS");
      var timeStructFactory = function() {
        return new HourStruct();
      };
    } else {
      var tickFormat = defaultTickFormat("HH:mm:ss");
    }
    return { prefixFormat, tickFormat, timeStructFactory };
  }
  var TimeStruct = function() {
    function TimeStruct2() {
    }
    TimeStruct2.prototype.setTime = function(time_PMILLIS, timeZone) {
      return moment(time_PMILLIS).zone(timeZone);
    };
    TimeStruct2.prototype.incrementTime = function(m) {
    };
    return TimeStruct2;
  }();
  var DayStruct = function(_super) {
    __extends(DayStruct2, _super);
    function DayStruct2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    DayStruct2.prototype.setTime = function(time_PMILLIS) {
      var m = moment(time_PMILLIS);
      m.hours(0);
      m.minutes(0);
      m.seconds(0);
      return m;
    };
    DayStruct2.prototype.incrementTime = function(m) {
      m.add("days", 1);
    };
    return DayStruct2;
  }(TimeStruct);
  var HourStruct = function(_super) {
    __extends(HourStruct2, _super);
    function HourStruct2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    HourStruct2.prototype.setTime = function(time_PMILLIS) {
      var m = moment(time_PMILLIS);
      m.minutes(0);
      m.seconds(0);
      return m;
    };
    HourStruct2.prototype.incrementTime = function(m) {
      m.add("hours", 1);
    };
    return HourStruct2;
  }(TimeStruct);
  function getTickTimes_PMILLIS(timeAxis, sizePixels, tickSpacings, referenceDate_PMILLIS) {
    var dMin_PMILLIS = timeAxis.tMin_PMILLIS;
    var dMax_PMILLIS = timeAxis.tMax_PMILLIS;
    var approxTickInterval_MILLIS = tickSpacings * (dMax_PMILLIS - dMin_PMILLIS) / sizePixels;
    return getHourTickTimesRelative_PMILLIS(dMin_PMILLIS, dMax_PMILLIS, approxTickInterval_MILLIS, 0);
  }
  webglext2.getTickTimes_PMILLIS = getTickTimes_PMILLIS;
  function getHourTickTimesRelative_PMILLIS(dMin_PMILLIS, dMax_PMILLIS, approxTickInterval_MILLIS, referenceDate_PMILLIS) {
    var tickTimes = getHourTickTimes_PMILLIS(dMin_PMILLIS - referenceDate_PMILLIS, dMax_PMILLIS - referenceDate_PMILLIS, approxTickInterval_MILLIS);
    for (var n = 0; n < tickTimes.length; n++) {
      tickTimes[n] = tickTimes[n] + referenceDate_PMILLIS;
    }
    return tickTimes;
  }
  function getHourTickTimes_PMILLIS(dMin_PMILLIS, dMax_PMILLIS, approxTickInterval_MILLIS) {
    var tickInterval_MILLIS = calculateTickInterval_MILLIS(approxTickInterval_MILLIS);
    var ticksSince1970 = Math.floor(dMin_PMILLIS / tickInterval_MILLIS);
    var firstTick_PMILLIS = ticksSince1970 * tickInterval_MILLIS;
    var numTicks = Math.ceil(1 + (dMax_PMILLIS - firstTick_PMILLIS) / tickInterval_MILLIS);
    var tickTimes_PMILLIS = [];
    for (var n = 0; n < numTicks; n++) {
      var data = firstTick_PMILLIS + n * tickInterval_MILLIS;
      if (data < 0)
        continue;
      tickTimes_PMILLIS.push(data);
    }
    return tickTimes_PMILLIS;
  }
  var tickIntervalRungs_MILLIS = [
    10,
    20,
    50,
    100,
    200,
    300,
    400,
    500,
    webglext2.secondsToMillis(1),
    webglext2.secondsToMillis(2),
    webglext2.secondsToMillis(5),
    webglext2.secondsToMillis(10),
    webglext2.secondsToMillis(15),
    webglext2.secondsToMillis(20),
    webglext2.secondsToMillis(30),
    webglext2.minutesToMillis(1),
    webglext2.minutesToMillis(2),
    webglext2.minutesToMillis(5),
    webglext2.minutesToMillis(10),
    webglext2.minutesToMillis(15),
    webglext2.minutesToMillis(20),
    webglext2.minutesToMillis(30),
    webglext2.hoursToMillis(1)
  ];
  function calculateTickInterval_MILLIS(approxTickInterval_MILLIS) {
    for (var n = 0; n < tickIntervalRungs_MILLIS.length; n++) {
      if (approxTickInterval_MILLIS <= tickIntervalRungs_MILLIS[n]) {
        return tickIntervalRungs_MILLIS[n];
      }
    }
    return webglext2.secondsToMillis(1);
  }
  function getTickInterval_MILLIS(tickTimes_PMILLIS) {
    if (webglext2.isNotEmpty(tickTimes_PMILLIS) && tickTimes_PMILLIS.length > 1) {
      return tickTimes_PMILLIS[1] - tickTimes_PMILLIS[0];
    } else {
      return webglext2.secondsToMillis(1);
    }
  }
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var TimelineCursorModel = function() {
    function TimelineCursorModel2(cursor) {
      this._cursorGuid = cursor.cursorGuid;
      this._attrsChanged = new webglext2.Notification();
      this.setAttrs(cursor);
    }
    Object.defineProperty(TimelineCursorModel2.prototype, "labeledTimeseriesGuids", {
      get: function() {
        return this._labeledTimeseriesGuids;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineCursorModel2.prototype, "cursorGuid", {
      get: function() {
        return this._cursorGuid;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineCursorModel2.prototype, "attrsChanged", {
      get: function() {
        return this._attrsChanged;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineCursorModel2.prototype, "lineColor", {
      get: function() {
        return this._lineColor;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineCursorModel2.prototype, "textColor", {
      get: function() {
        return this._textColor;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineCursorModel2.prototype, "showVerticalLine", {
      get: function() {
        return this._showVerticalLine;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineCursorModel2.prototype, "showHorizontalLine", {
      get: function() {
        return this._showHorizontalLine;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineCursorModel2.prototype, "showCursorText", {
      get: function() {
        return this._showCursorText;
      },
      enumerable: false,
      configurable: true
    });
    TimelineCursorModel2.prototype.setAttrs = function(cursor) {
      this._labeledTimeseriesGuids = new webglext2.OrderedStringSet(cursor.labeledTimeseriesGuids || []);
      this._lineColor = webglext2.isNotEmpty(cursor.lineColor) ? webglext2.parseCssColor(cursor.lineColor) : null;
      this._textColor = webglext2.isNotEmpty(cursor.textColor) ? webglext2.parseCssColor(cursor.textColor) : null;
      this._showVerticalLine = cursor.showVerticalLine;
      this._showHorizontalLine = cursor.showHorizontalLine;
      this._showCursorText = cursor.showCursorText;
      this._attrsChanged.fire();
    };
    TimelineCursorModel2.prototype.snapshot = function() {
      return {
        cursorGuid: this._cursorGuid,
        labeledTimeseriesGuids: this._labeledTimeseriesGuids.toArray(),
        lineColor: webglext2.isNotEmpty(this._lineColor) ? this._lineColor.cssString : null,
        textColor: webglext2.isNotEmpty(this._textColor) ? this._textColor.cssString : null,
        showVerticalLine: this._showVerticalLine,
        showHorizontalLine: this._showHorizontalLine,
        showCursorText: this._showCursorText
      };
    };
    return TimelineCursorModel2;
  }();
  webglext2.TimelineCursorModel = TimelineCursorModel;
  var TimelineAnnotationModel = function() {
    function TimelineAnnotationModel2(annotation) {
      this._annotationGuid = annotation.annotationGuid;
      this._attrsChanged = new webglext2.Notification();
      this.setAttrs(annotation);
    }
    Object.defineProperty(TimelineAnnotationModel2.prototype, "annotationGuid", {
      get: function() {
        return this._annotationGuid;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationModel2.prototype, "attrsChanged", {
      get: function() {
        return this._attrsChanged;
      },
      enumerable: false,
      configurable: true
    });
    TimelineAnnotationModel2.prototype.setLocation = function(time_PMILLIS, y) {
      if (time_PMILLIS !== this._time_PMILLIS || y !== this.y) {
        this._y = y;
        this._time_PMILLIS = time_PMILLIS;
        this._attrsChanged.fire();
      }
    };
    Object.defineProperty(TimelineAnnotationModel2.prototype, "time_PMILLIS", {
      get: function() {
        return this._time_PMILLIS;
      },
      set: function(time_PMILLIS) {
        if (time_PMILLIS !== this._time_PMILLIS) {
          this._time_PMILLIS = time_PMILLIS;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationModel2.prototype, "y", {
      get: function() {
        return this._y;
      },
      set: function(y) {
        if (y !== this.y) {
          this._y = y;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationModel2.prototype, "label", {
      get: function() {
        return this._label;
      },
      set: function(label) {
        if (label !== this.label) {
          this._label = label;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationModel2.prototype, "styleGuid", {
      get: function() {
        return this._styleGuid;
      },
      set: function(styleGuid) {
        if (styleGuid !== this.styleGuid) {
          this._styleGuid = styleGuid;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    TimelineAnnotationModel2.prototype.setAttrs = function(annotation) {
      this._time_PMILLIS = webglext2.isNotEmpty(annotation.time_ISO8601) ? webglext2.parseTime_PMILLIS(annotation.time_ISO8601) : void 0;
      this._y = annotation.y;
      this._label = annotation.label;
      this._styleGuid = annotation.styleGuid;
      this._attrsChanged.fire();
    };
    TimelineAnnotationModel2.prototype.snapshot = function() {
      return {
        annotationGuid: this._annotationGuid,
        label: this._label,
        styleGuid: this._styleGuid,
        time_ISO8601: webglext2.formatTime_ISO8601(this._time_PMILLIS),
        y: this._y
      };
    };
    return TimelineAnnotationModel2;
  }();
  webglext2.TimelineAnnotationModel = TimelineAnnotationModel;
  var TimelineTrackModel = function() {
    function TimelineTrackModel2(event) {
      this._eventGuid = event.eventGuid;
      this._attrsChanged = new webglext2.Notification();
      this.setAttrs(event);
    }
    Object.defineProperty(TimelineTrackModel2.prototype, "eventGuid", {
      get: function() {
        return this._eventGuid;
      },
      set: function(strGuid) {
        this._eventGuid = strGuid;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "attrsChanged", {
      get: function() {
        return this._attrsChanged;
      },
      enumerable: false,
      configurable: true
    });
    TimelineTrackModel2.prototype.setAttrs = function(event) {
      this._startLimit_PMILLIS = event.startLimit_ISO8601;
      this._endLimit_PMILLIS = event.endLimit_ISO8601;
      this._start_PMILLIS = event.start_time;
      this._end_PMILLIS = event.end_time;
      this._label = event.label;
      this._labelIcon = event.labelIcon;
      this._userEditable = webglext2.isNotEmpty(event.userEditable) ? event.userEditable : false;
      this._styleGuid = event.styleGuid;
      this._order = event.order;
      this._topMargin = event.topMargin;
      this._bottomMargin = event.bottomMargin;
      this._fgColor = webglext2.isNotEmpty(event.fgColor) ? webglext2.parseCssColor(event.fgColor) : null;
      this._bgColor = webglext2.isNotEmpty(event.bgColor) ? webglext2.parseCssColor(event.bgColor) : null;
      this._bgSecondaryColor = webglext2.isNotEmpty(event.bgSecondaryColor) ? webglext2.parseCssColor(event.bgSecondaryColor) : null;
      this._borderColor = webglext2.isNotEmpty(event.borderColor) ? webglext2.parseCssColor(event.borderColor) : null;
      this._borderSecondaryColor = webglext2.isNotEmpty(event.borderSecondaryColor) ? webglext2.parseCssColor(event.borderSecondaryColor) : null;
      this._labelTopMargin = event.labelTopMargin;
      this._labelBottomMargin = event.labelBottomMargin;
      this._labelVAlign = event.labelVAlign;
      this._labelVPos = event.labelVPos;
      this._labelHAlign = event.labelHAlign;
      this._labelHPos = event.labelHPos;
      this._isBorderDashed = webglext2.isNotEmpty(event.isBorderDashed) ? event.isBorderDashed : false;
      this._fillPattern = webglext2.isNotEmpty(event.fillPattern) ? webglext2.FillPattern[event.fillPattern] : webglext2.FillPattern.solid;
      this._attrsChanged.fire();
    };
    TimelineTrackModel2.prototype.setInterval = function(start_PMILLIS, end_PMILLIS) {
      if (start_PMILLIS !== this._start_PMILLIS || end_PMILLIS !== this._end_PMILLIS) {
        var initial_start_PMILLIS = this._start_PMILLIS;
        var initial_end_PMILLIS = this._end_PMILLIS;
        var underStartLimit = webglext2.isNotEmpty(this._startLimit_PMILLIS) && start_PMILLIS < this._startLimit_PMILLIS;
        var overEndLimit = webglext2.isNotEmpty(this._endLimit_PMILLIS) && end_PMILLIS > this._endLimit_PMILLIS;
        var duration_PMILLIS = end_PMILLIS - start_PMILLIS;
        var durationLimit_PMILLIS = this._endLimit_PMILLIS - this._startLimit_PMILLIS;
        if (webglext2.isNotEmpty(this._startLimit_PMILLIS) && webglext2.isNotEmpty(this._endLimit_PMILLIS) && durationLimit_PMILLIS < duration_PMILLIS) {
          this._start_PMILLIS = this._startLimit_PMILLIS;
          this._end_PMILLIS = this._endLimit_PMILLIS;
        } else if (underStartLimit) {
          this._start_PMILLIS = this._startLimit_PMILLIS;
          this._end_PMILLIS = this._start_PMILLIS + duration_PMILLIS;
        } else if (overEndLimit) {
          this._end_PMILLIS = this._endLimit_PMILLIS;
          this._start_PMILLIS = this._end_PMILLIS - duration_PMILLIS;
        } else {
          this._end_PMILLIS = end_PMILLIS;
          this._start_PMILLIS = start_PMILLIS;
        }
        if (initial_start_PMILLIS !== this._start_PMILLIS || initial_end_PMILLIS !== this._end_PMILLIS) {
          this._attrsChanged.fire();
        }
      }
    };
    TimelineTrackModel2.prototype.limit_start_PMILLIS = function(start_PMILLIS) {
      return webglext2.isNotEmpty(this._startLimit_PMILLIS) ? Math.max(start_PMILLIS, this._startLimit_PMILLIS) : start_PMILLIS;
    };
    TimelineTrackModel2.prototype.limit_end_PMILLIS = function(end_PMILLIS) {
      return webglext2.isNotEmpty(this._endLimit_PMILLIS) ? Math.min(end_PMILLIS, this._endLimit_PMILLIS) : end_PMILLIS;
    };
    Object.defineProperty(TimelineTrackModel2.prototype, "start_PMILLIS", {
      get: function() {
        return this._start_PMILLIS;
      },
      set: function(start_PMILLIS) {
        if (start_PMILLIS !== this._start_PMILLIS) {
          this._start_PMILLIS = this.limit_start_PMILLIS(start_PMILLIS);
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "end_PMILLIS", {
      get: function() {
        return this._end_PMILLIS;
      },
      set: function(end_PMILLIS) {
        if (end_PMILLIS !== this._end_PMILLIS) {
          this._end_PMILLIS = this.limit_end_PMILLIS(end_PMILLIS);
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "startLimit_PMILLIS", {
      get: function() {
        return this._startLimit_PMILLIS;
      },
      set: function(startLimit_PMILLIS) {
        if (startLimit_PMILLIS !== this._startLimit_PMILLIS) {
          this._startLimit_PMILLIS = startLimit_PMILLIS;
          this._start_PMILLIS = this.limit_start_PMILLIS(this._start_PMILLIS);
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "endLimit_PMILLIS", {
      get: function() {
        return this._endLimit_PMILLIS;
      },
      set: function(endLimit_PMILLIS) {
        if (endLimit_PMILLIS !== this._endLimit_PMILLIS) {
          this._endLimit_PMILLIS = endLimit_PMILLIS;
          this._end_PMILLIS = this.limit_end_PMILLIS(this._end_PMILLIS);
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "label", {
      get: function() {
        return this._label;
      },
      set: function(label) {
        if (label !== this._label) {
          this._label = label;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "labelIcon", {
      get: function() {
        return this._labelIcon;
      },
      set: function(labelIcon) {
        if (labelIcon !== this._labelIcon) {
          this._labelIcon = labelIcon;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "userEditable", {
      get: function() {
        return this._userEditable;
      },
      set: function(userEditable) {
        if (userEditable !== this._userEditable) {
          this._userEditable = userEditable;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "styleGuid", {
      get: function() {
        return this._styleGuid;
      },
      set: function(styleGuid) {
        if (styleGuid !== this._styleGuid) {
          this._styleGuid = styleGuid;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "order", {
      get: function() {
        return this._order;
      },
      set: function(order) {
        if (order !== this._order) {
          this._order = order;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "topMargin", {
      get: function() {
        return this._topMargin;
      },
      set: function(topMargin) {
        if (topMargin !== this._topMargin) {
          this._topMargin = topMargin;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "bottomMargin", {
      get: function() {
        return this._bottomMargin;
      },
      set: function(bottomMargin) {
        if (bottomMargin !== this._bottomMargin) {
          this._bottomMargin = bottomMargin;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "fgColor", {
      get: function() {
        return this._fgColor;
      },
      set: function(fgColor) {
        if (fgColor !== this._fgColor) {
          this._fgColor = fgColor;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "bgColor", {
      get: function() {
        return this._bgColor;
      },
      set: function(bgColor) {
        if (bgColor !== this._bgColor) {
          this._bgColor = bgColor;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "bgSecondaryColor", {
      get: function() {
        return this._bgSecondaryColor;
      },
      set: function(bgSecondaryColor) {
        if (bgSecondaryColor !== this._bgSecondaryColor) {
          this._bgSecondaryColor = bgSecondaryColor;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "borderColor", {
      get: function() {
        return this._borderColor;
      },
      set: function(borderColor) {
        if (borderColor !== this._borderColor) {
          this._borderColor = borderColor;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "borderSecondaryColor", {
      get: function() {
        return this._borderSecondaryColor;
      },
      set: function(borderSecondaryColor) {
        if (borderSecondaryColor !== this._borderSecondaryColor) {
          this._borderSecondaryColor = borderSecondaryColor;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "labelTopMargin", {
      get: function() {
        return this._labelTopMargin;
      },
      set: function(labelTopMargin) {
        if (labelTopMargin !== this._labelTopMargin) {
          this._labelTopMargin = labelTopMargin;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "labelBottomMargin", {
      get: function() {
        return this._labelBottomMargin;
      },
      set: function(labelBottomMargin) {
        if (labelBottomMargin !== this._labelBottomMargin) {
          this._labelBottomMargin = labelBottomMargin;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "labelVAlign", {
      get: function() {
        return this._labelVAlign;
      },
      set: function(labelVAlign) {
        if (labelVAlign !== this._labelVAlign) {
          this._labelVAlign = labelVAlign;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "labelVPos", {
      get: function() {
        return this._labelVPos;
      },
      set: function(labelVPos) {
        if (labelVPos !== this._labelVPos) {
          this._labelVPos = labelVPos;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "labelHAlign", {
      get: function() {
        return this._labelHAlign;
      },
      set: function(labelHAlign) {
        if (labelHAlign !== this._labelHAlign) {
          this._labelHAlign = labelHAlign;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "labelHPos", {
      get: function() {
        return this._labelHPos;
      },
      set: function(labelHPos) {
        if (labelHPos !== this._labelHPos) {
          this._labelHPos = labelHPos;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "isBorderDashed", {
      get: function() {
        return this._isBorderDashed;
      },
      set: function(isBorderDashed) {
        if (isBorderDashed !== this._isBorderDashed) {
          this._isBorderDashed = isBorderDashed;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineTrackModel2.prototype, "fillPattern", {
      get: function() {
        return this._fillPattern;
      },
      set: function(fillPattern) {
        if (fillPattern !== this._fillPattern) {
          this._fillPattern = fillPattern;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    TimelineTrackModel2.prototype.snapshot = function() {
      return {
        eventGuid: this._eventGuid,
        startLimit_ISO8601: this._startLimit_PMILLIS,
        endLimit_ISO8601: this._endLimit_PMILLIS,
        start_time: this._start_PMILLIS,
        end_time: this._end_PMILLIS,
        label: this._label,
        labelIcon: this._labelIcon,
        userEditable: this._userEditable,
        styleGuid: this._styleGuid,
        order: this._order,
        topMargin: this._topMargin,
        bottomMargin: this._bottomMargin,
        bgColor: webglext2.isNotEmpty(this._bgColor) ? this._bgColor.cssString : null,
        bgSecondaryColor: webglext2.isNotEmpty(this._bgSecondaryColor) ? this._bgSecondaryColor.cssString : null,
        fgColor: webglext2.isNotEmpty(this._fgColor) ? this._fgColor.cssString : null,
        borderColor: webglext2.isNotEmpty(this._borderColor) ? this._borderColor.cssString : null,
        borderSecondaryColor: webglext2.isNotEmpty(this._borderSecondaryColor) ? this.borderSecondaryColor.cssString : null,
        labelTopMargin: this._labelTopMargin,
        labelBottomMargin: this._labelBottomMargin,
        labelVAlign: this._labelVAlign,
        labelVPos: this._labelVPos,
        labelHAlign: this._labelHAlign,
        labelHPos: this._labelHPos,
        isBorderDashed: this._isBorderDashed,
        fillPattern: webglext2.FillPattern[this._fillPattern]
      };
    };
    return TimelineTrackModel2;
  }();
  webglext2.TimelineTrackModel = TimelineTrackModel;
  var TimelineRowModel = function() {
    function TimelineRowModel2(row) {
      this._rowGuid = row.rowGuid;
      this._attrsChanged = new webglext2.Notification();
      var min = webglext2.isNotEmpty(row.yMin) ? row.yMin : 0;
      var max = webglext2.isNotEmpty(row.yMax) ? row.yMax : 1;
      this._dataAxis = new webglext2.Axis1D(min, max);
      this.setAttrs(row);
      this._eventGuids = new webglext2.OrderedStringSet(row.eventGuids || []);
      this._timeseriesGuids = new webglext2.OrderedStringSet(row.timeseriesGuids || []);
      this._annotationGuids = new webglext2.OrderedStringSet(row.annotationGuids || []);
    }
    Object.defineProperty(TimelineRowModel2.prototype, "rowGuid", {
      get: function() {
        return this._rowGuid;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowModel2.prototype, "attrsChanged", {
      get: function() {
        return this._attrsChanged;
      },
      enumerable: false,
      configurable: true
    });
    TimelineRowModel2.prototype.setAttrs = function(row) {
      this._label = row.label;
      this._labelIcon = row.labelIcon;
      this._uiHint = row.uiHint;
      this._hidden = row.hidden;
      this._rowHeight = row.rowHeight;
      this._cursorGuid = row.cursorGuid;
      this._bgColor = webglext2.isNotEmpty(row.bgColor) ? webglext2.parseCssColor(row.bgColor) : null;
      this._fgLabelColor = webglext2.isNotEmpty(row.fgLabelColor) ? webglext2.parseCssColor(row.fgLabelColor) : null;
      this._bgLabelColor = webglext2.isNotEmpty(row.bgLabelColor) ? webglext2.parseCssColor(row.bgLabelColor) : null;
      this._labelFont = row.labelFont;
      this._attrsChanged.fire();
    };
    Object.defineProperty(TimelineRowModel2.prototype, "cursorGuid", {
      get: function() {
        return this._cursorGuid;
      },
      set: function(cursorGuid) {
        this._cursorGuid = cursorGuid;
        this._attrsChanged.fire();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowModel2.prototype, "rowHeight", {
      get: function() {
        return this._rowHeight;
      },
      set: function(rowHeight) {
        this._rowHeight = rowHeight;
        this._attrsChanged.fire();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowModel2.prototype, "hidden", {
      get: function() {
        return this._hidden;
      },
      set: function(hidden) {
        this._hidden = hidden;
        this._attrsChanged.fire();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowModel2.prototype, "dataAxis", {
      get: function() {
        return this._dataAxis;
      },
      set: function(dataAxis) {
        this._dataAxis = dataAxis;
        this._attrsChanged.fire();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowModel2.prototype, "label", {
      get: function() {
        return this._label;
      },
      set: function(label) {
        if (label !== this._label) {
          this._label = label;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowModel2.prototype, "labelIcon", {
      get: function() {
        return this._labelIcon;
      },
      set: function(labelIcon) {
        if (labelIcon !== this._labelIcon) {
          this._labelIcon = labelIcon;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowModel2.prototype, "uiHint", {
      get: function() {
        return this._uiHint;
      },
      set: function(uiHint) {
        if (uiHint !== this._uiHint) {
          this._uiHint = uiHint;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowModel2.prototype, "bgColor", {
      get: function() {
        return this._bgColor;
      },
      set: function(bgColor) {
        if (bgColor !== this._bgColor) {
          this._bgColor = bgColor;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowModel2.prototype, "bgLabelColor", {
      get: function() {
        return this._bgLabelColor;
      },
      set: function(bgLabelColor) {
        if (bgLabelColor !== this._bgLabelColor) {
          this._bgLabelColor = bgLabelColor;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowModel2.prototype, "fgLabelColor", {
      get: function() {
        return this._fgLabelColor;
      },
      set: function(fgLabelColor) {
        if (fgLabelColor !== this._fgLabelColor) {
          this._fgLabelColor = fgLabelColor;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowModel2.prototype, "labelFont", {
      get: function() {
        return this._labelFont;
      },
      set: function(labelFont) {
        if (labelFont !== this._labelFont) {
          this._labelFont = labelFont;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowModel2.prototype, "eventGuids", {
      get: function() {
        return this._eventGuids;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowModel2.prototype, "timeseriesGuids", {
      get: function() {
        return this._timeseriesGuids;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowModel2.prototype, "annotationGuids", {
      get: function() {
        return this._annotationGuids;
      },
      enumerable: false,
      configurable: true
    });
    TimelineRowModel2.prototype.snapshot = function() {
      return {
        rowGuid: this._rowGuid,
        label: this._label,
        labelIcon: this._labelIcon,
        rowHeight: this._rowHeight,
        hidden: this._hidden,
        uiHint: this._uiHint,
        eventGuids: this._eventGuids.toArray(),
        timeseriesGuids: this._timeseriesGuids.toArray(),
        annotationGuids: this._annotationGuids.toArray(),
        cursorGuid: this._cursorGuid,
        bgColor: webglext2.isNotEmpty(this._bgColor) ? this._bgColor.cssString : null,
        bgLabelColor: webglext2.isNotEmpty(this._bgLabelColor) ? this._bgLabelColor.cssString : null,
        fgLabelColor: webglext2.isNotEmpty(this._fgLabelColor) ? this._fgLabelColor.cssString : null,
        labelFont: this._labelFont
      };
    };
    return TimelineRowModel2;
  }();
  webglext2.TimelineRowModel = TimelineRowModel;
  var TimelineGroupModel = function() {
    function TimelineGroupModel2(group) {
      this._groupGuid = group.groupGuid;
      this._attrsChanged = new webglext2.Notification();
      this.setAttrs(group);
      this._rowGuids = new webglext2.OrderedStringSet(group.rowGuids);
    }
    Object.defineProperty(TimelineGroupModel2.prototype, "groupGuid", {
      get: function() {
        return this._groupGuid;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineGroupModel2.prototype, "rollupGuid", {
      get: function() {
        return this._rollupGuid;
      },
      set: function(rollupGuid) {
        this._rollupGuid = rollupGuid;
        this._attrsChanged.fire();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineGroupModel2.prototype, "attrsChanged", {
      get: function() {
        return this._attrsChanged;
      },
      enumerable: false,
      configurable: true
    });
    TimelineGroupModel2.prototype.setAttrs = function(group) {
      this._rollupGuid = group.rollupGuid;
      this._hidden = group.hidden;
      this._label = group.label;
      this._collapsed = group.collapsed;
      this._attrsChanged.fire();
    };
    Object.defineProperty(TimelineGroupModel2.prototype, "hidden", {
      get: function() {
        return this._hidden;
      },
      set: function(hidden) {
        this._hidden = hidden;
        this._attrsChanged.fire();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineGroupModel2.prototype, "label", {
      get: function() {
        return this._label;
      },
      set: function(label) {
        if (label !== this._label) {
          this._label = label;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineGroupModel2.prototype, "collapsed", {
      get: function() {
        return this._collapsed;
      },
      set: function(collapsed) {
        if (collapsed !== this._collapsed) {
          this._collapsed = collapsed;
          this._attrsChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineGroupModel2.prototype, "rowGuids", {
      get: function() {
        return this._rowGuids;
      },
      enumerable: false,
      configurable: true
    });
    TimelineGroupModel2.prototype.snapshot = function() {
      return {
        groupGuid: this._groupGuid,
        rollupGuid: this._rollupGuid,
        label: this._label,
        hidden: this._hidden,
        collapsed: webglext2.isNotEmpty(this._collapsed) ? this._collapsed : false,
        rowGuids: this._rowGuids.toArray()
      };
    };
    return TimelineGroupModel2;
  }();
  webglext2.TimelineGroupModel = TimelineGroupModel;
  var TimelineRootModel = function() {
    function TimelineRootModel2(root) {
      this._attrsChanged = new webglext2.Notification();
      this.setAttrs(root);
      this._groupGuids = new webglext2.OrderedStringSet(root.groupGuids);
      this._rowGuids = new webglext2.OrderedStringSet();
      this._topPinnedRowGuids = new webglext2.OrderedStringSet(root.topPinnedRowGuids || []);
      this._bottomPinnedRowGuids = new webglext2.OrderedStringSet(root.bottomPinnedRowGuids || []);
      this._maximizedRowGuids = new webglext2.OrderedStringSet(root.maximizedRowGuids || []);
    }
    Object.defineProperty(TimelineRootModel2.prototype, "attrsChanged", {
      get: function() {
        return this._attrsChanged;
      },
      enumerable: false,
      configurable: true
    });
    TimelineRootModel2.prototype.setAttrs = function(root) {
      this._attrsChanged.fire();
    };
    Object.defineProperty(TimelineRootModel2.prototype, "groupGuids", {
      get: function() {
        return this._groupGuids;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRootModel2.prototype, "rowGuids", {
      get: function() {
        return this._rowGuids;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRootModel2.prototype, "topPinnedRowGuids", {
      get: function() {
        return this._topPinnedRowGuids;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRootModel2.prototype, "bottomPinnedRowGuids", {
      get: function() {
        return this._bottomPinnedRowGuids;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRootModel2.prototype, "maximizedRowGuids", {
      get: function() {
        return this._maximizedRowGuids;
      },
      enumerable: false,
      configurable: true
    });
    TimelineRootModel2.prototype.snapshot = function() {
      return {
        groupGuids: this._groupGuids.toArray(),
        rowGuids: this._rowGuids.toArray(),
        topPinnedRowGuids: this._topPinnedRowGuids.toArray(),
        bottomPinnedRowGuids: this._bottomPinnedRowGuids.toArray(),
        maximizedRowGuids: this._maximizedRowGuids.toArray()
      };
    };
    return TimelineRootModel2;
  }();
  webglext2.TimelineRootModel = TimelineRootModel;
  var TimelineModel = function() {
    function TimelineModel2(timeline) {
      var cursors = webglext2.isNotEmpty(timeline) && webglext2.isNotEmpty(timeline.cursors) ? timeline.cursors : [];
      this._cursors = new webglext2.OrderedSet([], function(g) {
        return g.cursorGuid;
      });
      for (var n = 0; n < cursors.length; n++) {
        this._cursors.add(new TimelineCursorModel(cursors[n]));
      }
      var annotations = webglext2.isNotEmpty(timeline) && webglext2.isNotEmpty(timeline.annotations) ? timeline.annotations : [];
      this._annotations = new webglext2.OrderedSet([], function(g) {
        return g.annotationGuid;
      });
      for (var n = 0; n < annotations.length; n++) {
        this._annotations.add(new TimelineAnnotationModel(annotations[n]));
      }
      var events = webglext2.isNotEmpty(timeline) && webglext2.isNotEmpty(timeline.events) ? timeline.events : [];
      this._events = new webglext2.OrderedSet([], function(e) {
        return e.eventGuid;
      });
      for (var n = 0; n < events.length; n++) {
        this._events.add(new TimelineTrackModel(events[n]));
      }
      var rows = webglext2.isNotEmpty(timeline) && webglext2.isNotEmpty(timeline.rows) ? timeline.rows : [];
      this._rows = new webglext2.OrderedSet([], function(r) {
        return r.rowGuid;
      });
      for (var n = 0; n < rows.length; n++) {
        this._rows.add(new TimelineRowModel(rows[n]));
      }
      var groups = webglext2.isNotEmpty(timeline) && webglext2.isNotEmpty(timeline.groups) ? timeline.groups : [];
      this._groups = new webglext2.OrderedSet([], function(g) {
        return g.groupGuid;
      });
      for (var n = 0; n < groups.length; n++) {
        this._groups.add(new TimelineGroupModel(groups[n]));
      }
      var root = webglext2.isNotEmpty(timeline) && webglext2.isNotEmpty(timeline.root) ? timeline.root : newEmptyTimelineRoot();
      this._root = new TimelineRootModel(root);
    }
    Object.defineProperty(TimelineModel2.prototype, "cursors", {
      get: function() {
        return this._cursors;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineModel2.prototype, "annotations", {
      get: function() {
        return this._annotations;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineModel2.prototype, "events", {
      get: function() {
        return this._events;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineModel2.prototype, "rows", {
      get: function() {
        return this._rows;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineModel2.prototype, "groups", {
      get: function() {
        return this._groups;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineModel2.prototype, "root", {
      get: function() {
        return this._root;
      },
      enumerable: false,
      configurable: true
    });
    TimelineModel2.prototype.cursor = function(cursorGuid) {
      return this._cursors.valueFor(cursorGuid);
    };
    TimelineModel2.prototype.annotation = function(annotationGuid) {
      return this._annotations.valueFor(annotationGuid);
    };
    TimelineModel2.prototype.event = function(eventGuid) {
      return this._events.valueFor(eventGuid);
    };
    TimelineModel2.prototype.row = function(rowGuid) {
      return this._rows.valueFor(rowGuid);
    };
    TimelineModel2.prototype.group = function(groupGuid) {
      return this._groups.valueFor(groupGuid);
    };
    TimelineModel2.prototype.replace = function(newTimeline) {
      var freshRoot = newTimeline.root;
      this._root.groupGuids.retainValues(freshRoot.groupGuids);
      this._root.topPinnedRowGuids.retainValues(freshRoot.topPinnedRowGuids);
      this._root.bottomPinnedRowGuids.retainValues(freshRoot.bottomPinnedRowGuids);
      this._root.maximizedRowGuids.retainValues(freshRoot.maximizedRowGuids);
      var freshGroups = newTimeline.groups;
      var retainedGroupGuids = [];
      for (var n = 0; n < freshGroups.length; n++) {
        var freshGroup = freshGroups[n];
        var groupGuid = freshGroup.groupGuid;
        var oldGroup = this._groups.valueFor(groupGuid);
        if (webglext2.isNotEmpty(oldGroup)) {
          oldGroup.rowGuids.retainValues(freshGroup.rowGuids);
          retainedGroupGuids.push(groupGuid);
        }
      }
      this._groups.retainIds(retainedGroupGuids);
      var freshRows = newTimeline.rows;
      var retainedRowGuids = [];
      for (var n = 0; n < freshRows.length; n++) {
        var freshRow = freshRows[n];
        var rowGuid = freshRow.rowGuid;
        var oldRow = this._rows.valueFor(rowGuid);
        if (webglext2.isNotEmpty(oldRow)) {
          oldRow.eventGuids.retainValues(freshRow.eventGuids || []);
          retainedRowGuids.push(rowGuid);
        }
      }
      this._rows.retainIds(retainedRowGuids);
      var freshEvents = newTimeline.events;
      var retainedEventGuids = [];
      for (var n = 0; n < freshEvents.length; n++) {
        var freshEvent = freshEvents[n];
        var eventGuid = freshEvent.eventGuid;
        var oldEvent = this._events.valueFor(eventGuid);
        if (webglext2.isNotEmpty(oldEvent)) {
          retainedEventGuids.push(eventGuid);
        }
      }
      this._events.retainIds(retainedEventGuids);
      var freshAnnotations = newTimeline.annotations;
      var retainedAnnotationGuids = [];
      for (var n = 0; n < freshAnnotations.length; n++) {
        var freshAnnotation = freshAnnotations[n];
        var annotationGuid = freshAnnotation.annotationGuid;
        var oldAnnotation = this._annotations.valueFor(annotationGuid);
        if (webglext2.isNotEmpty(oldAnnotation)) {
          retainedAnnotationGuids.push(annotationGuid);
        }
      }
      this._annotations.retainIds(retainedAnnotationGuids);
      var freshCursors = newTimeline.cursors;
      var retainedCursorGuids = [];
      for (var n = 0; n < freshCursors.length; n++) {
        var freshCursor = freshCursors[n];
        var cursorGuid = freshCursor.cursorGuid;
        var oldCursor = this._cursors.valueFor(cursorGuid);
        if (webglext2.isNotEmpty(oldCursor)) {
          retainedCursorGuids.push(cursorGuid);
        }
      }
      this._cursors.retainIds(retainedCursorGuids);
      for (var n = 0; n < freshCursors.length; n++) {
        var freshCursor = freshCursors[n];
        var oldCursor = this._cursors.valueFor(freshCursor.cursorGuid);
        if (webglext2.isNotEmpty(oldCursor)) {
          oldCursor.setAttrs(freshCursor);
        } else {
          this._cursors.add(new TimelineCursorModel(freshCursor));
        }
      }
      for (var n = 0; n < freshAnnotations.length; n++) {
        var freshAnnotation = freshAnnotations[n];
        var oldAnnotation = this._annotations.valueFor(freshAnnotation.annotationGuid);
        if (webglext2.isNotEmpty(oldAnnotation)) {
          oldAnnotation.setAttrs(freshAnnotation);
        } else {
          this._annotations.add(new TimelineAnnotationModel(freshAnnotation));
        }
      }
      for (var n = 0; n < freshEvents.length; n++) {
        var freshEvent = freshEvents[n];
        var oldEvent = this._events.valueFor(freshEvent.eventGuid);
        if (webglext2.isNotEmpty(oldEvent)) {
          oldEvent.setAttrs(freshEvent);
        } else {
          this._events.add(new TimelineTrackModel(freshEvent));
        }
      }
      for (var n = 0; n < freshRows.length; n++) {
        var freshRow = freshRows[n];
        var oldRow = this._rows.valueFor(freshRow.rowGuid);
        if (webglext2.isNotEmpty(oldRow)) {
          oldRow.setAttrs(freshRow);
          oldRow.eventGuids.addAll(freshRow.eventGuids || [], 0, true);
        } else {
          this._rows.add(new TimelineRowModel(freshRow));
        }
      }
      for (var n = 0; n < freshGroups.length; n++) {
        var freshGroup = freshGroups[n];
        var oldGroup = this._groups.valueFor(freshGroup.groupGuid);
        if (webglext2.isNotEmpty(oldGroup)) {
          oldGroup.setAttrs(freshGroup);
          oldGroup.rowGuids.addAll(freshGroup.rowGuids, 0, true);
        } else {
          this._groups.add(new TimelineGroupModel(freshGroup));
        }
      }
      this._root.groupGuids.addAll(freshRoot.groupGuids, 0, true);
      this._root.topPinnedRowGuids.addAll(freshRoot.topPinnedRowGuids, 0, true);
      this._root.bottomPinnedRowGuids.addAll(freshRoot.bottomPinnedRowGuids, 0, true);
      this._root.maximizedRowGuids.addAll(freshRoot.maximizedRowGuids, 0, true);
    };
    TimelineModel2.prototype.merge = function(newData, strategy) {
      var newEvents = webglext2.isNotEmpty(newData.events) ? newData.events : [];
      for (var n = 0; n < newEvents.length; n++) {
        var newEvent = newEvents[n];
        var eventModel = this._events.valueFor(newEvent.eventGuid);
        if (webglext2.isNotEmpty(eventModel)) {
          strategy.updateEventModel(eventModel, newEvent);
        } else {
          this._events.add(new TimelineTrackModel(newEvent));
        }
      }
      var newRows = webglext2.isNotEmpty(newData.rows) ? newData.rows : [];
      for (var n = 0; n < newRows.length; n++) {
        var newRow = newRows[n];
        var rowModel = this._rows.valueFor(newRow.rowGuid);
        if (webglext2.isNotEmpty(rowModel)) {
          strategy.updateRowModel(rowModel, newRow);
        } else {
          this._rows.add(new TimelineRowModel(newRow));
        }
      }
      var newGroups = webglext2.isNotEmpty(newData.groups) ? newData.groups : [];
      for (var n = 0; n < newGroups.length; n++) {
        var newGroup = newGroups[n];
        var groupModel = this._groups.valueFor(newGroup.groupGuid);
        if (webglext2.isNotEmpty(groupModel)) {
          strategy.updateGroupModel(groupModel, newGroup);
        } else {
          this._groups.add(new TimelineGroupModel(newGroup));
        }
      }
      var newRoot = newData.root;
      strategy.updateRootModel(this._root, newRoot);
    };
    TimelineModel2.prototype.snapshot = function() {
      return {
        cursors: this._cursors.map(function(e) {
          return e.snapshot();
        }),
        annotations: this._annotations.map(function(e) {
          return e.snapshot();
        }),
        events: this._events.map(function(e) {
          return e.snapshot();
        }),
        rows: this._rows.map(function(r) {
          return r.snapshot();
        }),
        groups: this._groups.map(function(g) {
          return g.snapshot();
        }),
        root: this._root.snapshot()
      };
    };
    return TimelineModel2;
  }();
  webglext2.TimelineModel = TimelineModel;
  function newEmptyTimelineRoot() {
    return {
      groupGuids: [],
      rowGuids: [],
      bottomPinnedRowGuids: [],
      topPinnedRowGuids: [],
      maximizedRowGuids: []
    };
  }
  webglext2.newEmptyTimelineRoot = newEmptyTimelineRoot;
  webglext2.timelineMergeNewBeforeOld = {
    updateCursorModel: function(cursorModel, newCursor) {
      cursorModel.setAttrs(newCursor);
    },
    updateAnnotationModel: function(annotationModel, newAnnotation) {
      annotationModel.setAttrs(newAnnotation);
    },
    updateEventModel: function(eventModel, newEvent) {
      eventModel.setAttrs(newEvent);
    },
    updateRowModel: function(rowModel, newRow) {
      rowModel.setAttrs(newRow);
      rowModel.eventGuids.addAll(newRow.eventGuids || [], 0, true);
    },
    updateGroupModel: function(groupModel, newGroup) {
      groupModel.setAttrs(newGroup);
      groupModel.rowGuids.addAll(newGroup.rowGuids, 0, true);
    },
    updateRootModel: function(rootModel, newRoot) {
      rootModel.setAttrs(newRoot);
      rootModel.groupGuids.addAll(newRoot.groupGuids, 0, true);
      rootModel.topPinnedRowGuids.addAll(newRoot.topPinnedRowGuids || [], 0, true);
      rootModel.bottomPinnedRowGuids.addAll(newRoot.bottomPinnedRowGuids || [], 0, true);
      rootModel.maximizedRowGuids.addAll(newRoot.maximizedRowGuids || [], 0, true);
    }
  };
  webglext2.timelineMergeNewAfterOld = {
    updateCursorModel: function(cursorModel, newCursor) {
      cursorModel.setAttrs(newCursor);
    },
    updateAnnotationModel: function(annotationModel, newAnnotation) {
      annotationModel.setAttrs(newAnnotation);
    },
    updateEventModel: function(eventModel, newEvent) {
      eventModel.setAttrs(newEvent);
    },
    updateRowModel: function(rowModel, newRow) {
      rowModel.setAttrs(newRow);
      rowModel.eventGuids.addAll(newRow.eventGuids || []);
      rowModel.timeseriesGuids.addAll(newRow.timeseriesGuids || []);
      rowModel.annotationGuids.addAll(newRow.annotationGuids || []);
    },
    updateGroupModel: function(groupModel, newGroup) {
      groupModel.setAttrs(newGroup);
      groupModel.rowGuids.addAll(newGroup.rowGuids);
    },
    updateRootModel: function(rootModel, newRoot) {
      rootModel.setAttrs(newRoot);
      rootModel.groupGuids.addAll(newRoot.groupGuids);
      rootModel.topPinnedRowGuids.addAll(newRoot.topPinnedRowGuids || []);
      rootModel.bottomPinnedRowGuids.addAll(newRoot.bottomPinnedRowGuids || []);
      rootModel.maximizedRowGuids.addAll(newRoot.maximizedRowGuids || []);
    }
  };
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function newTimelineLayout(axisHeight) {
    return {
      updatePrefSize: function(parentPrefSize, children) {
        var topAxis = null;
        var bottomAxis = null;
        var center = null;
        for (var c = 0; c < children.length; c++) {
          var child = children[c];
          switch (child.layoutArg) {
            case webglext2.Side.TOP:
              if (webglext2.isNotEmpty(topAxis))
                throw new Error("Timeline-layout can have at most one top-axis pane");
              topAxis = child;
              break;
            case webglext2.Side.BOTTOM:
              if (webglext2.isNotEmpty(bottomAxis))
                throw new Error("Timeline-layout can have at most one bottom-axis pane");
              bottomAxis = child;
              break;
            default:
              if (webglext2.isNotEmpty(center))
                throw new Error("Timeline-layout can have at most one center pane");
              center = child;
              break;
          }
        }
        var hSum = 0;
        if (webglext2.isNotEmpty(topAxis)) {
          hSum += axisHeight;
        }
        if (webglext2.isNotEmpty(bottomAxis)) {
          hSum += axisHeight;
        }
        if (webglext2.isNotEmpty(center)) {
          if (webglext2.isNotEmpty(center.prefSize.h)) {
            hSum += center.prefSize.h;
          } else {
            hSum = null;
          }
        }
        parentPrefSize.w = null;
        parentPrefSize.h = hSum;
      },
      updateChildViewports: function(children, parentViewport) {
        var topAxis = null;
        var bottomAxis = null;
        var center = null;
        for (var c = 0; c < children.length; c++) {
          var child = children[c];
          switch (child.layoutArg) {
            case webglext2.Side.TOP:
              if (webglext2.isNotEmpty(topAxis))
                throw new Error("Timeline-layout can have at most one top-axis pane");
              topAxis = child;
              break;
            case webglext2.Side.BOTTOM:
              if (webglext2.isNotEmpty(bottomAxis))
                throw new Error("Timeline-layout can have at most one bottom-axis pane");
              bottomAxis = child;
              break;
            default:
              if (webglext2.isNotEmpty(center))
                throw new Error("Timeline-layout can have at most one center pane");
              center = child;
              break;
          }
        }
        if (webglext2.isNotEmpty(topAxis)) {
          topAxis.viewport.setRect(parentViewport.i, parentViewport.jEnd - axisHeight, parentViewport.w, axisHeight);
        }
        if (webglext2.isNotEmpty(bottomAxis)) {
          var jBottomMax = (webglext2.isNotEmpty(topAxis) ? topAxis.viewport.j : parentViewport.jEnd) - axisHeight;
          bottomAxis.viewport.setRect(parentViewport.i, Math.min(jBottomMax, parentViewport.j), parentViewport.w, axisHeight);
        }
        if (webglext2.isNotEmpty(center)) {
          var jCenterEnd = webglext2.isNotEmpty(topAxis) ? topAxis.viewport.jStart : parentViewport.jEnd;
          var jCenterStart = webglext2.isNotEmpty(bottomAxis) ? bottomAxis.viewport.jEnd : parentViewport.jStart;
          center.viewport.setEdges(parentViewport.iStart, parentViewport.iEnd, jCenterStart, jCenterEnd);
        }
      }
    };
  }
  webglext2.newTimelineLayout = newTimelineLayout;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var TimelineAnnotationIconUi = function() {
    function TimelineAnnotationIconUi2(icon) {
      this._setAttrs(icon);
    }
    TimelineAnnotationIconUi2.prototype._setAttrs = function(icon) {
      this._url = icon.url;
      this._displayWidth = icon.displayWidth;
      this._displayHeight = icon.displayHeight;
      this._hAlign = icon.hAlign;
      this._vAlign = icon.vAlign;
      this._hOffset = icon.hOffset;
      this._vOffset = icon.vOffset;
    };
    Object.defineProperty(TimelineAnnotationIconUi2.prototype, "url", {
      get: function() {
        return this._url;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationIconUi2.prototype, "displayWidth", {
      get: function() {
        return this._displayWidth;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationIconUi2.prototype, "displayHeight", {
      get: function() {
        return this._displayHeight;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationIconUi2.prototype, "hAlign", {
      get: function() {
        return this._hAlign;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationIconUi2.prototype, "vAlign", {
      get: function() {
        return this._vAlign;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationIconUi2.prototype, "hOffset", {
      get: function() {
        return this._hOffset;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationIconUi2.prototype, "vOffset", {
      get: function() {
        return this._vOffset;
      },
      enumerable: false,
      configurable: true
    });
    TimelineAnnotationIconUi2.prototype.snapshot = function() {
      return {
        url: this._url,
        displayWidth: this._displayWidth,
        displayHeight: this._displayHeight,
        hAlign: this._hAlign,
        vAlign: this._vAlign,
        hOffset: this._hOffset,
        vOffset: this._vOffset
      };
    };
    return TimelineAnnotationIconUi2;
  }();
  webglext2.TimelineAnnotationIconUi = TimelineAnnotationIconUi;
  var TimelineAnnotationStyleUi = function() {
    function TimelineAnnotationStyleUi2(style) {
      this._styleGuid = style.styleGuid;
      this._setAttrs(style);
    }
    Object.defineProperty(TimelineAnnotationStyleUi2.prototype, "styleGuid", {
      get: function() {
        return this._styleGuid;
      },
      enumerable: false,
      configurable: true
    });
    TimelineAnnotationStyleUi2.prototype._setAttrs = function(style) {
      this._color = webglext2.isNotEmpty(style.color) ? webglext2.parseCssColor(style.color) : void 0;
      this._font = style.font;
      this._hTextOffset = style.hTextOffset;
      this._vTextOffset = style.vTextOffset;
      this._hTextAlign = style.hTextAlign;
      this._vTextAlign = style.vTextAlign;
      this._align = style.align;
      this._uiHint = style.uiHint;
      this._icons = webglext2.isNotEmpty(style.color) ? style.icons.map(function(icon) {
        return new TimelineAnnotationIconUi(icon);
      }) : [];
    };
    Object.defineProperty(TimelineAnnotationStyleUi2.prototype, "numIcons", {
      get: function() {
        return this._icons.length;
      },
      enumerable: false,
      configurable: true
    });
    TimelineAnnotationStyleUi2.prototype.icon = function(index) {
      return this._icons[index];
    };
    Object.defineProperty(TimelineAnnotationStyleUi2.prototype, "color", {
      get: function() {
        return this._color;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationStyleUi2.prototype, "font", {
      get: function() {
        return this._font;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationStyleUi2.prototype, "hTextOffset", {
      get: function() {
        return this._hTextOffset;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationStyleUi2.prototype, "vTextOffset", {
      get: function() {
        return this._vTextOffset;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationStyleUi2.prototype, "hTextAlign", {
      get: function() {
        return this._hTextAlign;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationStyleUi2.prototype, "vTextAlign", {
      get: function() {
        return this._vTextAlign;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationStyleUi2.prototype, "align", {
      get: function() {
        return this._align;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineAnnotationStyleUi2.prototype, "uiHint", {
      get: function() {
        return this._uiHint;
      },
      enumerable: false,
      configurable: true
    });
    TimelineAnnotationStyleUi2.prototype.snapshot = function() {
      return {
        styleGuid: this._styleGuid,
        color: this._color.cssString,
        font: this._font,
        vTextOffset: this._hTextOffset,
        hTextOffset: this._vTextOffset,
        vTextAlign: this._hTextAlign,
        hTextAlign: this._vTextAlign,
        align: this._align,
        uiHint: this._uiHint,
        icons: this._icons.map(function(ui) {
          return ui.snapshot();
        })
      };
    };
    return TimelineAnnotationStyleUi2;
  }();
  webglext2.TimelineAnnotationStyleUi = TimelineAnnotationStyleUi;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var TimelineEventIconUi = function() {
    function TimelineEventIconUi2(icon) {
      this._setAttrs(icon);
    }
    TimelineEventIconUi2.prototype._setAttrs = function(icon) {
      this._url = icon.url;
      this._displayWidth = icon.displayWidth;
      this._displayHeight = icon.displayHeight;
      this._hAlign = icon.hAlign;
      this._hPos = icon.hPos;
    };
    Object.defineProperty(TimelineEventIconUi2.prototype, "url", {
      get: function() {
        return this._url;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineEventIconUi2.prototype, "displayWidth", {
      get: function() {
        return this._displayWidth;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineEventIconUi2.prototype, "displayHeight", {
      get: function() {
        return this._displayHeight;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineEventIconUi2.prototype, "hAlign", {
      get: function() {
        return this._hAlign;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineEventIconUi2.prototype, "hPos", {
      get: function() {
        return this._hPos;
      },
      enumerable: false,
      configurable: true
    });
    TimelineEventIconUi2.prototype.snapshot = function() {
      return {
        url: this._url,
        displayWidth: this._displayWidth,
        displayHeight: this._displayHeight,
        hAlign: this._hAlign,
        hPos: this._hPos
      };
    };
    return TimelineEventIconUi2;
  }();
  webglext2.TimelineEventIconUi = TimelineEventIconUi;
  var TimelineEventStyleUi = function() {
    function TimelineEventStyleUi2(style) {
      this._styleGuid = style.styleGuid;
      this._setAttrs(style);
    }
    Object.defineProperty(TimelineEventStyleUi2.prototype, "styleGuid", {
      get: function() {
        return this._styleGuid;
      },
      enumerable: false,
      configurable: true
    });
    TimelineEventStyleUi2.prototype._setAttrs = function(style) {
      this._icons = style.icons.map(function(icon) {
        return new TimelineEventIconUi(icon);
      });
    };
    Object.defineProperty(TimelineEventStyleUi2.prototype, "numIcons", {
      get: function() {
        return this._icons.length;
      },
      enumerable: false,
      configurable: true
    });
    TimelineEventStyleUi2.prototype.icon = function(index) {
      return this._icons[index];
    };
    TimelineEventStyleUi2.prototype.snapshot = function() {
      return {
        styleGuid: this._styleGuid,
        icons: this._icons.map(function(ui) {
          return ui.snapshot();
        })
      };
    };
    return TimelineEventStyleUi2;
  }();
  webglext2.TimelineEventStyleUi = TimelineEventStyleUi;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var TimelineUi = function() {
    function TimelineUi2(model, options) {
      if (options === void 0) {
        options = {};
      }
      this._dispose = new webglext2.Notification();
      this._input = new TimelineInput();
      var getPaneId = function(pane) {
        var paneId = pane["webglext_PaneId"];
        return webglext2.isNotEmpty(paneId) ? paneId : webglext2.getObjectId(pane);
      };
      this._panes = new webglext2.OrderedSet([], getPaneId);
      this._selection = new TimelineSelectionModel();
      attachTimelineInputToSelection(this._input, this._selection, options);
      this._groupUis = new webglext2.OrderedSet([], function(g) {
        return g.groupGuid;
      });
      var groupUis = this._groupUis;
      var addGroupUi = function(group) {
        groupUis.add(new TimelineGroupUi(group.groupGuid));
      };
      var removeGroupUi = function(group) {
        groupUis.removeId(group.groupGuid);
      };
      model.groups.forEach(addGroupUi);
      model.groups.valueAdded.on(addGroupUi);
      model.groups.valueRemoved.on(removeGroupUi);
      this._rowUis = new webglext2.OrderedSet([], function(r) {
        return r.rowGuid;
      });
      var rowUis = this._rowUis;
      var addRowUi = function(row) {
        rowUis.add(new TimelineRowUi(row.rowGuid));
      };
      var removeRowUi = function(row) {
        rowUis.removeId(row.rowGuid);
      };
      model.rows.forEach(addRowUi);
      model.rows.valueAdded.on(addRowUi);
      model.rows.valueRemoved.on(removeRowUi);
      this._eventStyles = new webglext2.OrderedSet([], function(s) {
        return s.styleGuid;
      });
      this._annotationStyles = new webglext2.OrderedSet([], function(s) {
        return s.styleGuid;
      });
      this._millisPerPx = new webglext2.SimpleModel(1e3);
      this._imageStatus = {};
      this._imageCache = {};
      this._dispose.on(function() {
        model.groups.valueAdded.off(addGroupUi);
        model.groups.valueRemoved.off(removeGroupUi);
        model.rows.valueAdded.off(addRowUi);
        model.rows.valueRemoved.off(removeRowUi);
      });
    }
    Object.defineProperty(TimelineUi2.prototype, "input", {
      get: function() {
        return this._input;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineUi2.prototype, "selection", {
      get: function() {
        return this._selection;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineUi2.prototype, "groupUis", {
      get: function() {
        return this._groupUis;
      },
      enumerable: false,
      configurable: true
    });
    TimelineUi2.prototype.groupUi = function(groupGuid) {
      return this._groupUis.valueFor(groupGuid);
    };
    Object.defineProperty(TimelineUi2.prototype, "rowUis", {
      get: function() {
        return this._rowUis;
      },
      enumerable: false,
      configurable: true
    });
    TimelineUi2.prototype.rowUi = function(rowGuid) {
      return this._rowUis.valueFor(rowGuid);
    };
    Object.defineProperty(TimelineUi2.prototype, "eventStyles", {
      get: function() {
        return this._eventStyles;
      },
      enumerable: false,
      configurable: true
    });
    TimelineUi2.prototype.eventStyle = function(styleGuid) {
      return webglext2.isNotEmpty(styleGuid) && this._eventStyles.valueFor(styleGuid) || timelineEventStyle_DEFAULT;
    };
    Object.defineProperty(TimelineUi2.prototype, "annotationStyles", {
      get: function() {
        return this._annotationStyles;
      },
      enumerable: false,
      configurable: true
    });
    TimelineUi2.prototype.annotationStyle = function(styleGuid) {
      return webglext2.isNotEmpty(styleGuid) && this._annotationStyles.valueFor(styleGuid) || timelineAnnotationStyle_DEFAULT;
    };
    Object.defineProperty(TimelineUi2.prototype, "millisPerPx", {
      get: function() {
        return this._millisPerPx;
      },
      enumerable: false,
      configurable: true
    });
    TimelineUi2.prototype.loadImage = function(url, onLoaded) {
      if (!webglext2.isNotEmpty(this._imageStatus[url])) {
        this._imageStatus[url] = true;
        var imageCache = this._imageCache;
        var image = new Image();
        image.onload = function() {
          var w = image.naturalWidth;
          var h = image.naturalHeight;
          imageCache[url] = new webglext2.Texture2D(w, h, webglext2.GL.LINEAR, webglext2.GL.LINEAR, function(g) {
            g.drawImage(image, 0, 0);
          });
          if (onLoaded)
            onLoaded();
        };
        image.src = url;
      }
      return this._imageCache[url];
    };
    Object.defineProperty(TimelineUi2.prototype, "panes", {
      get: function() {
        return this._panes;
      },
      enumerable: false,
      configurable: true
    });
    TimelineUi2.prototype.addPane = function(paneId, pane) {
      pane["webglext_PaneId"] = paneId;
      this._panes.removeId(paneId);
      this._panes.add(pane);
    };
    TimelineUi2.prototype.removePane = function(paneId) {
      this._panes.removeId(paneId);
    };
    TimelineUi2.prototype.getPane = function(paneId) {
      return this._panes.valueFor(paneId);
    };
    Object.defineProperty(TimelineUi2.prototype, "dispose", {
      get: function() {
        return this._dispose;
      },
      enumerable: false,
      configurable: true
    });
    return TimelineUi2;
  }();
  webglext2.TimelineUi = TimelineUi;
  var TimelineGroupUi = function() {
    function TimelineGroupUi2(groupGuid) {
      this._groupGuid = groupGuid;
    }
    Object.defineProperty(TimelineGroupUi2.prototype, "groupGuid", {
      get: function() {
        return this._groupGuid;
      },
      enumerable: false,
      configurable: true
    });
    return TimelineGroupUi2;
  }();
  webglext2.TimelineGroupUi = TimelineGroupUi;
  var TimelineRowUi = function() {
    function TimelineRowUi2(rowGuid) {
      this._rowGuid = rowGuid;
      this._paneFactoryChanged = new webglext2.Notification();
      this._paneFactory = null;
      var getPaneId = function(pane) {
        var paneId = pane["webglext_PaneId"];
        return webglext2.isNotEmpty(paneId) ? paneId : webglext2.getObjectId(pane);
      };
      this._panes = new webglext2.OrderedSet([], getPaneId);
    }
    Object.defineProperty(TimelineRowUi2.prototype, "rowGuid", {
      get: function() {
        return this._rowGuid;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowUi2.prototype, "paneFactoryChanged", {
      get: function() {
        return this._paneFactoryChanged;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowUi2.prototype, "paneFactory", {
      get: function() {
        return this._paneFactory;
      },
      set: function(paneFactory) {
        if (paneFactory !== this._paneFactory) {
          this._paneFactory = paneFactory;
          this._paneFactoryChanged.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineRowUi2.prototype, "panes", {
      get: function() {
        return this._panes;
      },
      enumerable: false,
      configurable: true
    });
    TimelineRowUi2.prototype.addPane = function(paneId, pane) {
      pane["webglext_PaneId"] = paneId;
      this._panes.removeId(paneId);
      this._panes.add(pane);
    };
    TimelineRowUi2.prototype.removePane = function(paneId) {
      this._panes.removeId(paneId);
    };
    TimelineRowUi2.prototype.getPane = function(paneId) {
      return this._panes.valueFor(paneId);
    };
    return TimelineRowUi2;
  }();
  webglext2.TimelineRowUi = TimelineRowUi;
  var timelineAnnotationStyle_DEFAULT = new webglext2.TimelineAnnotationStyleUi({
    styleGuid: "DEFAULT",
    color: "white",
    icons: []
  });
  var timelineEventStyle_DEFAULT = new webglext2.TimelineEventStyleUi({
    styleGuid: "DEFAULT",
    icons: []
  });
  var TimelineInput = function() {
    function TimelineInput2() {
      this._mouseMove = new webglext2.Notification1();
      this._mouseExit = new webglext2.Notification1();
      this._timeHover = new webglext2.Notification2();
      this._rowHover = new webglext2.Notification2();
      this._eventHover = new webglext2.Notification2();
      this._mouseDown = new webglext2.Notification1();
      this._mouseUp = new webglext2.Notification1();
      this._contextMenu = new webglext2.Notification1();
    }
    Object.defineProperty(TimelineInput2.prototype, "mouseMove", {
      get: function() {
        return this._mouseMove;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineInput2.prototype, "mouseExit", {
      get: function() {
        return this._mouseExit;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineInput2.prototype, "timeHover", {
      get: function() {
        return this._timeHover;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineInput2.prototype, "rowHover", {
      get: function() {
        return this._rowHover;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineInput2.prototype, "eventHover", {
      get: function() {
        return this._eventHover;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineInput2.prototype, "mouseDown", {
      get: function() {
        return this._mouseDown;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineInput2.prototype, "mouseUp", {
      get: function() {
        return this._mouseUp;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineInput2.prototype, "contextMenu", {
      get: function() {
        return this._contextMenu;
      },
      enumerable: false,
      configurable: true
    });
    return TimelineInput2;
  }();
  webglext2.TimelineInput = TimelineInput;
  var TimelineSelectionModel = function() {
    function TimelineSelectionModel2() {
      this._mousePos = new webglext2.XyModel();
      this._hoveredY = new webglext2.SimpleModel();
      this._hoveredTime_PMILLIS = new webglext2.SimpleModel();
      this._selectedInterval = new TimeIntervalModel(0, 0);
      this._hoveredRow = new webglext2.SimpleModel();
      this._selectedRow = new webglext2.OrderedSet([], function(e) {
        return e.rowGuid;
      });
      this._hoveredEvent = new webglext2.SimpleModel();
      this._selectedEvents = new webglext2.OrderedSet([], function(e) {
        return e.eventGuid;
      });
      this._hoveredAnnotation = new webglext2.SimpleModel();
    }
    Object.defineProperty(TimelineSelectionModel2.prototype, "mousePos", {
      get: function() {
        return this._mousePos;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineSelectionModel2.prototype, "hoveredY", {
      get: function() {
        return this._hoveredY;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineSelectionModel2.prototype, "hoveredTime_PMILLIS", {
      get: function() {
        return this._hoveredTime_PMILLIS;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineSelectionModel2.prototype, "selectedInterval", {
      get: function() {
        return this._selectedInterval;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineSelectionModel2.prototype, "hoveredRow", {
      get: function() {
        return this._hoveredRow;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineSelectionModel2.prototype, "selectedRow", {
      get: function() {
        return this._selectedRow;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineSelectionModel2.prototype, "hoveredEvent", {
      get: function() {
        return this._hoveredEvent;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineSelectionModel2.prototype, "selectedEvents", {
      get: function() {
        return this._selectedEvents;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelineSelectionModel2.prototype, "hoveredAnnotation", {
      get: function() {
        return this._hoveredAnnotation;
      },
      enumerable: false,
      configurable: true
    });
    return TimelineSelectionModel2;
  }();
  webglext2.TimelineSelectionModel = TimelineSelectionModel;
  var TimeIntervalModel = function() {
    function TimeIntervalModel2(start_PMILLIS, end_PMILLIS, cursor_PMILLIS) {
      this._start_PMILLIS = start_PMILLIS;
      this._end_PMILLIS = end_PMILLIS;
      this._cursor_PMILLIS = cursor_PMILLIS ? cursor_PMILLIS : end_PMILLIS;
      this._changed = new webglext2.Notification();
    }
    Object.defineProperty(TimeIntervalModel2.prototype, "start_PMILLIS", {
      get: function() {
        return this._start_PMILLIS;
      },
      set: function(start_PMILLIS) {
        if (start_PMILLIS !== this._start_PMILLIS) {
          this._start_PMILLIS = start_PMILLIS;
          this._changed.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimeIntervalModel2.prototype, "end_PMILLIS", {
      get: function() {
        return this._end_PMILLIS;
      },
      set: function(end_PMILLIS) {
        if (end_PMILLIS !== this._end_PMILLIS) {
          this._end_PMILLIS = end_PMILLIS;
          this._changed.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimeIntervalModel2.prototype, "cursor_PMILLIS", {
      get: function() {
        return this._cursor_PMILLIS;
      },
      set: function(cursor_PMILLIS) {
        if (cursor_PMILLIS !== this._cursor_PMILLIS) {
          this._cursor_PMILLIS = cursor_PMILLIS;
          this._changed.fire();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimeIntervalModel2.prototype, "duration_MILLIS", {
      get: function() {
        return this._end_PMILLIS - this._start_PMILLIS;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimeIntervalModel2.prototype, "changed", {
      get: function() {
        return this._changed;
      },
      enumerable: false,
      configurable: true
    });
    TimeIntervalModel2.prototype.setInterval = function(start_PMILLIS, end_PMILLIS, cursor_PMILLIS) {
      if (start_PMILLIS !== this._start_PMILLIS || end_PMILLIS !== this._end_PMILLIS || cursor_PMILLIS && cursor_PMILLIS != this._cursor_PMILLIS) {
        this._start_PMILLIS = start_PMILLIS;
        this._end_PMILLIS = end_PMILLIS;
        this._cursor_PMILLIS = cursor_PMILLIS ? cursor_PMILLIS : end_PMILLIS;
        this._changed.fire();
      }
    };
    TimeIntervalModel2.prototype.overlaps = function(start_PMILLIS, end_PMILLIS) {
      return this._start_PMILLIS <= end_PMILLIS && start_PMILLIS <= this._end_PMILLIS;
    };
    TimeIntervalModel2.prototype.contains = function(time_PMILLIS) {
      return this._start_PMILLIS <= time_PMILLIS && time_PMILLIS <= this._end_PMILLIS;
    };
    TimeIntervalModel2.prototype.pan = function(amount_MILLIS) {
      if (amount_MILLIS !== 0) {
        this._start_PMILLIS += amount_MILLIS;
        this._end_PMILLIS += amount_MILLIS;
        this._cursor_PMILLIS += amount_MILLIS;
        this._changed.fire();
      }
    };
    TimeIntervalModel2.prototype.scale = function(factor, anchor_PMILLIS) {
      if (anchor_PMILLIS !== 1) {
        this._start_PMILLIS = anchor_PMILLIS + factor * (this._start_PMILLIS - anchor_PMILLIS);
        this._end_PMILLIS = anchor_PMILLIS + factor * (this._end_PMILLIS - anchor_PMILLIS);
        this._cursor_PMILLIS = anchor_PMILLIS + factor * (this._cursor_PMILLIS - anchor_PMILLIS);
        this._changed.fire();
      }
    };
    return TimeIntervalModel2;
  }();
  webglext2.TimeIntervalModel = TimeIntervalModel;
  function attachTimelineInputToSelection(input, selection, options) {
    var allowEventMultiSelection = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.allowEventMultiSelection) ? options.allowEventMultiSelection : true;
    input.mouseMove.on(function(ev) {
      selection.mousePos.setXy(ev.i, ev.j);
    });
    input.mouseExit.on(function(ev) {
      selection.mousePos.setXy(null, null);
    });
    input.rowHover.on(function(row, ev) {
      selection.hoveredRow.value = row;
    });
    input.timeHover.on(function(time_PMILLIS, ev) {
      selection.hoveredTime_PMILLIS.value = time_PMILLIS;
    });
    input.eventHover.on(function(event) {
      selection.hoveredEvent.value = event;
    });
    options.allowEventMultiSelection = false;
    if (options.allowEventMultiSelection) {
      input.mouseDown.on(function(ev) {
        if (webglext2.isLeftMouseDown(ev.mouseEvent)) {
          var event = selection.hoveredEvent.value;
          if (webglext2.isNotEmpty(event)) {
            var multiSelectMode = ev.mouseEvent && (ev.mouseEvent.ctrlKey || ev.mouseEvent.shiftKey);
            var unselectedEventClicked = !selection.selectedEvents.hasValue(event);
            if (multiSelectMode) {
              if (selection.selectedEvents.hasValue(event)) {
                selection.selectedEvents.removeValue(event);
              } else {
                selection.selectedEvents.add(event);
              }
            } else if (unselectedEventClicked) {
              selection.selectedEvents.retainValues([event]);
              selection.selectedEvents.add(event);
            } else {
            }
          }
        }
      });
    } else {
      input.mouseDown.on(function(ev) {
        if (webglext2.isLeftMouseDown(ev.mouseEvent)) {
          var event = selection.hoveredEvent.value;
          if (webglext2.isNotEmpty(event)) {
            selection.selectedEvents.retainValues([event]);
            selection.selectedEvents.add(event);
          }
          var row = selection.hoveredRow.value;
          if (webglext2.isNotEmpty(row)) {
            selection.selectedRow.retainValues([row]);
            selection.selectedRow.add(row);
          }
        }
      });
    }
  }
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var TimelineLaneArray = function() {
    function TimelineLaneArray2(model, row, ui, allowMultipleLanes) {
      this._model = model;
      this._row = row;
      this._ui = ui;
      this._lanes = [];
      this._laneNums = {};
      this._eventAttrsListeners = {};
      var self = this;
      function findAvailableLaneNum(event, startLaneNum, endLaneNum) {
        for (var n = startLaneNum; n < endLaneNum; n++) {
          if (self._lanes[n].couldFitEvent(event)) {
            return n;
          }
        }
        return null;
      }
      function firstAvailableLaneNum(event) {
        var laneNum = findAvailableLaneNum(event, 0, self._lanes.length);
        return webglext2.isNotEmpty(laneNum) ? laneNum : self._lanes.length;
      }
      function addEventToLane(event, laneNum) {
        if (!self._lanes[laneNum]) {
          self._lanes[laneNum] = allowMultipleLanes ? new TimelineLaneStack(ui) : new TimelineLaneSimple(ui);
        }
        self._lanes[laneNum].add(event);
        self._laneNums[event.eventGuid] = laneNum;
      }
      function fillVacancy(vacancyLaneNum, vacancyEdges_PMILLIS) {
        var vacancyLane = self._lanes[vacancyLaneNum];
        for (var n = vacancyLaneNum + 1; n < self._lanes.length; n++) {
          var lane = self._lanes[n];
          var possibleTenants = lane.collisionsWithInterval(vacancyEdges_PMILLIS[0], vacancyEdges_PMILLIS[1]);
          for (var p = 0; p < possibleTenants.length; p++) {
            var event = possibleTenants[p];
            if (vacancyLane.couldFitEvent(event)) {
              lane.remove(event);
              addEventToLane(event, vacancyLaneNum);
              fillVacancy(n, effectiveEdges_PMILLIS(ui, event));
            }
          }
        }
      }
      function trimEmptyLanes() {
        for (var n = self._lanes.length - 1; n >= 0; n--) {
          if (self._lanes[n].isEmpty()) {
            self._lanes.splice(n, 1);
          } else {
            break;
          }
        }
      }
      this._addEvent = function(eventGuid) {
        if (webglext2.isNotEmpty(self._laneNums[eventGuid])) {
          throw new Error("Lanes-array already contains this event: row-guid = " + row.rowGuid + ", lane = " + self._laneNums[eventGuid] + ", event-guid = " + eventGuid);
        }
        var event = model.event(eventGuid);
        var laneNum = firstAvailableLaneNum(event);
        addEventToLane(event, laneNum);
      };
      row.eventGuids.forEach(this._addEvent);
      row.eventGuids.valueAdded.on(this._addEvent);
      this._newEvent = function(eventGuid) {
        var event = model.event(eventGuid);
        var oldEdges_PMILLIS = effectiveEdges_PMILLIS(ui, event);
        var updateLaneAssignment = function() {
          var newEdges_PMILLIS = effectiveEdges_PMILLIS(ui, event);
          if (newEdges_PMILLIS[0] !== oldEdges_PMILLIS[0] || newEdges_PMILLIS[1] !== oldEdges_PMILLIS[1]) {
            var oldLaneNum = self._laneNums[event.eventGuid];
            var oldLane = self._lanes[oldLaneNum];
            var betterLaneNum = findAvailableLaneNum(event, 0, oldLaneNum);
            if (webglext2.isNotEmpty(betterLaneNum)) {
              oldLane.remove(event);
              addEventToLane(event, betterLaneNum);
            } else if (oldLane.eventStillFits(event)) {
              oldLane.update(event);
            } else {
              var newLaneNum = findAvailableLaneNum(event, oldLaneNum + 1, self._lanes.length);
              if (!webglext2.isNotEmpty(newLaneNum))
                newLaneNum = self._lanes.length;
              oldLane.remove(event);
              addEventToLane(event, newLaneNum);
            }
            fillVacancy(oldLaneNum, oldEdges_PMILLIS);
            trimEmptyLanes();
            oldEdges_PMILLIS = newEdges_PMILLIS;
          }
        };
        event.attrsChanged.on(updateLaneAssignment);
        self._eventAttrsListeners[eventGuid] = updateLaneAssignment;
      };
      row.eventGuids.forEach(this._newEvent);
      row.eventGuids.valueAdded.on(this._newEvent);
      this._removeEvent = function(eventGuid) {
        var event = model.event(eventGuid);
        var oldLaneNum = self._laneNums[eventGuid];
        delete self._laneNums[eventGuid];
        self._lanes[oldLaneNum].remove(event);
        fillVacancy(oldLaneNum, effectiveEdges_PMILLIS(ui, event));
        trimEmptyLanes();
        event.attrsChanged.off(self._eventAttrsListeners[eventGuid]);
        delete self._eventAttrsListeners[eventGuid];
      };
      row.eventGuids.valueRemoved.on(this._removeEvent);
      self._rebuildLanes = function() {
        var oldLanes = self._lanes;
        self._lanes = [];
        self._laneNums = {};
        for (var l = 0; l < oldLanes.length; l++) {
          var lane = oldLanes[l];
          for (var e = 0; e < lane.length; e++) {
            var event = lane.event(e);
            self._addEvent(event.eventGuid);
          }
        }
      };
      var hasIcons = function() {
        var oldLanes = self._lanes;
        for (var l = 0; l < oldLanes.length; l++) {
          var lane = oldLanes[l];
          for (var e = 0; e < lane.length; e++) {
            var event = lane.event(e);
            var style = ui.eventStyle(event.styleGuid);
            if (event.labelIcon || style.numIcons > 0)
              return true;
          }
        }
        return false;
      };
      self._rebuildLanesMouseWheel = function() {
        if (hasIcons()) {
          self._rebuildLanes();
        }
      };
      ui.millisPerPx.changed.on(self._rebuildLanesMouseWheel);
      ui.eventStyles.valueAdded.on(self._rebuildLanes);
      ui.eventStyles.valueRemoved.on(self._rebuildLanes);
    }
    Object.defineProperty(TimelineLaneArray2.prototype, "length", {
      get: function() {
        return this._lanes.length;
      },
      enumerable: false,
      configurable: true
    });
    TimelineLaneArray2.prototype.lane = function(index) {
      return this._lanes[index];
    };
    Object.defineProperty(TimelineLaneArray2.prototype, "numEvents", {
      get: function() {
        return this._row.eventGuids.length;
      },
      enumerable: false,
      configurable: true
    });
    TimelineLaneArray2.prototype.eventAt = function(laneNum, time_PMILLIS) {
      var lane = this._lanes[laneNum];
      return lane && lane.eventAtTime(time_PMILLIS);
    };
    TimelineLaneArray2.prototype.dispose = function() {
      this._row.eventGuids.valueAdded.off(this._addEvent);
      this._row.eventGuids.valueRemoved.off(this._removeEvent);
      this._row.eventGuids.valueAdded.off(this._newEvent);
      this._ui.millisPerPx.changed.off(this._rebuildLanesMouseWheel);
      this._ui.eventStyles.valueAdded.off(this._rebuildLanes);
      this._ui.eventStyles.valueRemoved.off(this._rebuildLanes);
      for (var eventGuid in this._eventAttrsListeners) {
        if (this._eventAttrsListeners.hasOwnProperty(eventGuid)) {
          var listener = this._eventAttrsListeners[eventGuid];
          var event = this._model.event(eventGuid);
          if (listener && event)
            event.attrsChanged.off(listener);
        }
      }
    };
    return TimelineLaneArray2;
  }();
  webglext2.TimelineLaneArray = TimelineLaneArray;
  function effectiveEdges_PMILLIS(ui, event) {
    var start_PMILLIS = event.start_PMILLIS;
    var end_PMILLIS = event.end_PMILLIS;
    var millisPerPx = ui.millisPerPx.value;
    var eventStyle = ui.eventStyle(event.styleGuid);
    for (var n = 0; n < eventStyle.numIcons; n++) {
      var icon = eventStyle.icon(n);
      var iconTime_PMILLIS = event.start_PMILLIS + icon.hPos * (event.end_PMILLIS - event.start_PMILLIS);
      var iconStart_PMILLIS = iconTime_PMILLIS - millisPerPx * icon.hAlign * icon.displayWidth;
      var iconEnd_PMILLIS = iconTime_PMILLIS + millisPerPx * (1 - icon.hAlign) * icon.displayWidth;
      start_PMILLIS = Math.min(start_PMILLIS, iconStart_PMILLIS);
      end_PMILLIS = Math.max(end_PMILLIS, iconEnd_PMILLIS);
    }
    return [start_PMILLIS, end_PMILLIS];
  }
  webglext2.effectiveEdges_PMILLIS = effectiveEdges_PMILLIS;
  var TimelineLaneStack = function() {
    function TimelineLaneStack2(ui) {
      this._events = [];
      this._starts_PMILLIS = [];
      this._ends_PMILLIS = [];
      this._indices = {};
      this._ui = ui;
    }
    Object.defineProperty(TimelineLaneStack2.prototype, "length", {
      get: function() {
        return this._events.length;
      },
      enumerable: false,
      configurable: true
    });
    TimelineLaneStack2.prototype.event = function(index) {
      return this._events[index];
    };
    TimelineLaneStack2.prototype.isEmpty = function() {
      return this._events.length === 0;
    };
    TimelineLaneStack2.prototype.eventAtTime = function(time_PMILLIS) {
      if (webglext2.isNotEmpty(time_PMILLIS)) {
        var iFirst = webglext2.indexAfter(this._ends_PMILLIS, time_PMILLIS);
        if (iFirst < this._events.length) {
          var eventFirst = this._events[iFirst];
          var startFirst_PMILLIS = effectiveEdges_PMILLIS(this._ui, eventFirst)[0];
          if (time_PMILLIS >= startFirst_PMILLIS) {
            return eventFirst;
          }
        }
        var iPrev = iFirst - 1;
        if (iPrev >= 0) {
          var eventPrev = this._events[iPrev];
          var endPrev_PMILLIS = effectiveEdges_PMILLIS(this._ui, eventPrev)[1];
          if (time_PMILLIS < endPrev_PMILLIS) {
            return eventPrev;
          }
        }
      }
      return null;
    };
    TimelineLaneStack2.prototype.add = function(event) {
      var eventGuid = event.eventGuid;
      if (webglext2.isNotEmpty(this._indices[eventGuid]))
        throw new Error("Lane already contains this event: event = " + formatEvent(event));
      var i = webglext2.indexAfter(this._starts_PMILLIS, event.start_PMILLIS);
      if (!this._eventFitsBetween(event, i - 1, i))
        throw new Error("New event does not fit between existing events: new = " + formatEvent(event) + ", before = " + formatEvent(this._events[i - 1]) + ", after = " + formatEvent(this._events[i]));
      this._events.splice(i, 0, event);
      this._starts_PMILLIS.splice(i, 0, event.start_PMILLIS);
      this._ends_PMILLIS.splice(i, 0, event.end_PMILLIS);
      this._indices[eventGuid] = i;
      for (var n = i; n < this._events.length; n++) {
        this._indices[this._events[n].eventGuid] = n;
      }
    };
    TimelineLaneStack2.prototype.remove = function(event) {
      var eventGuid = event.eventGuid;
      var i = this._indices[eventGuid];
      if (!webglext2.isNotEmpty(i))
        throw new Error("Event not found in this lane: event = " + formatEvent(event));
      this._events.splice(i, 1);
      this._starts_PMILLIS.splice(i, 1);
      this._ends_PMILLIS.splice(i, 1);
      delete this._indices[eventGuid];
      for (var n = i; n < this._events.length; n++) {
        this._indices[this._events[n].eventGuid] = n;
      }
    };
    TimelineLaneStack2.prototype.eventStillFits = function(event) {
      var i = this._indices[event.eventGuid];
      if (!webglext2.isNotEmpty(i))
        throw new Error("Event not found in this lane: event = " + formatEvent(event));
      return this._eventFitsBetween(event, i - 1, i + 1);
    };
    TimelineLaneStack2.prototype.update = function(event) {
      var i = this._indices[event.eventGuid];
      if (!webglext2.isNotEmpty(i))
        throw new Error("Event not found in this lane: event = " + formatEvent(event));
      this._starts_PMILLIS[i] = event.start_PMILLIS;
      this._ends_PMILLIS[i] = event.end_PMILLIS;
    };
    TimelineLaneStack2.prototype.collisionsWithInterval = function(start_PMILLIS, end_PMILLIS) {
      var iFirst = webglext2.indexAfter(this._ends_PMILLIS, start_PMILLIS);
      var iPrev = iFirst - 1;
      if (iPrev >= 0) {
        var endPrev_PMILLIS = effectiveEdges_PMILLIS(this._ui, this._events[iPrev])[1];
        if (start_PMILLIS < endPrev_PMILLIS) {
          iFirst = iPrev;
        }
      }
      var iLast = webglext2.indexBefore(this._starts_PMILLIS, end_PMILLIS);
      var iPost = iLast + 1;
      if (iPost < this._events.length) {
        var startPost_PMILLIS = effectiveEdges_PMILLIS(this._ui, this._events[iPost])[0];
        if (end_PMILLIS > startPost_PMILLIS) {
          iLast = iPost;
        }
      }
      return this._events.slice(iFirst, iLast + 1);
    };
    TimelineLaneStack2.prototype.couldFitEvent = function(event) {
      var iAfter = webglext2.indexAfter(this._starts_PMILLIS, event.start_PMILLIS);
      var iBefore = iAfter - 1;
      return this._eventFitsBetween(event, iBefore, iAfter);
    };
    TimelineLaneStack2.prototype._eventFitsBetween = function(event, iBefore, iAfter) {
      var edges_PMILLIS = effectiveEdges_PMILLIS(this._ui, event);
      if (iBefore >= 0) {
        var edgesBefore_PMILLIS = effectiveEdges_PMILLIS(this._ui, this._events[iBefore]);
        if (edges_PMILLIS[0] < edgesBefore_PMILLIS[1]) {
          return false;
        }
      }
      if (iAfter < this._events.length) {
        var edgesAfter_PMILLIS = effectiveEdges_PMILLIS(this._ui, this._events[iAfter]);
        if (edges_PMILLIS[1] > edgesAfter_PMILLIS[0]) {
          return false;
        }
      }
      return true;
    };
    return TimelineLaneStack2;
  }();
  webglext2.TimelineLaneStack = TimelineLaneStack;
  var TimelineLaneSimple = function() {
    function TimelineLaneSimple2(ui) {
      this._events = [];
      this._orders = [];
      this._ids = {};
      this._ui = ui;
    }
    Object.defineProperty(TimelineLaneSimple2.prototype, "length", {
      get: function() {
        return this._events.length;
      },
      enumerable: false,
      configurable: true
    });
    TimelineLaneSimple2.prototype.event = function(index) {
      return this._events[index];
    };
    TimelineLaneSimple2.prototype.isEmpty = function() {
      return this._events.length === 0;
    };
    TimelineLaneSimple2.prototype.eventAtTime = function(time_PMILLIS) {
      var bestEvent;
      for (var n = this._events.length - 1; n >= 0; n--) {
        var event = this._events[n];
        var eventEdges_PMILLIS = effectiveEdges_PMILLIS(this._ui, event);
        if (time_PMILLIS > eventEdges_PMILLIS[0] && time_PMILLIS < eventEdges_PMILLIS[1] && (bestEvent === void 0 || bestEvent.order < event.order)) {
          bestEvent = event;
        }
      }
      return bestEvent;
    };
    TimelineLaneSimple2.prototype.add = function(event) {
      var eventGuid = event.eventGuid;
      if (webglext2.isNotEmpty(this._ids[eventGuid]))
        throw new Error("Lane already contains this event: event = " + formatEvent(event));
      var order = webglext2.isNotEmpty(event.order) ? event.order : Number.NEGATIVE_INFINITY;
      var i = webglext2.indexAtOrAfter(this._orders, order);
      this._ids[eventGuid] = eventGuid;
      this._orders.splice(i, 0, order);
      this._events.splice(i, 0, event);
    };
    TimelineLaneSimple2.prototype.remove = function(event) {
      var eventGuid = event.eventGuid;
      if (!webglext2.isNotEmpty(this._ids[eventGuid]))
        throw new Error("Event not found in this lane: event = " + formatEvent(event));
      delete this._ids[eventGuid];
      var i = this._getIndex(event);
      this._orders.splice(i, 1);
      this._events.splice(i, 1);
    };
    TimelineLaneSimple2.prototype.update = function(event) {
      this.remove(event);
      this.add(event);
    };
    TimelineLaneSimple2.prototype.collisionsWithInterval = function(start_PMILLIS, end_PMILLIS) {
      var results = [];
      for (var n = 0; n < this._events.length; n++) {
        var event = this._events[n];
        if (!(start_PMILLIS > event.end_PMILLIS || end_PMILLIS < event.start_PMILLIS)) {
          results.push(event);
        }
      }
      return results;
    };
    TimelineLaneSimple2.prototype.eventStillFits = function(event) {
      return true;
    };
    TimelineLaneSimple2.prototype.couldFitEvent = function(event) {
      return true;
    };
    TimelineLaneSimple2.prototype._getIndex = function(queryEvent) {
      for (var n = 0; n < this._events.length; n++) {
        var event = this._events[n];
        if (queryEvent.eventGuid === event.eventGuid) {
          return n;
        }
      }
      throw new Error("Event not found in this lane: event = " + formatEvent(queryEvent));
    };
    return TimelineLaneSimple2;
  }();
  webglext2.TimelineLaneSimple = TimelineLaneSimple;
  function formatEvent(event) {
    if (!webglext2.isNotEmpty(event)) {
      return "" + event;
    } else {
      return event.label + " [ " + webglext2.formatTime_ISO8601(event.start_PMILLIS) + " ... " + webglext2.formatTime_ISO8601(event.end_PMILLIS) + " ]";
    }
  }
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function newEventsRowPaneFactory(eventsRowOpts) {
    return function(drawable, timeAxis, dataAxis, model, row, ui, options) {
      var rowTopPadding = webglext2.isNotEmpty(eventsRowOpts) && webglext2.isNotEmpty(eventsRowOpts.rowTopPadding) ? eventsRowOpts.rowTopPadding : 6;
      var rowBottomPadding = webglext2.isNotEmpty(eventsRowOpts) && webglext2.isNotEmpty(eventsRowOpts.rowBottomPadding) ? eventsRowOpts.rowBottomPadding : 6;
      var laneHeight = webglext2.isNotEmpty(eventsRowOpts) && webglext2.isNotEmpty(eventsRowOpts.laneHeight) ? eventsRowOpts.laneHeight : 33;
      var painterFactories = webglext2.isNotEmpty(eventsRowOpts) && webglext2.isNotEmpty(eventsRowOpts.painterFactories) ? eventsRowOpts.painterFactories : [];
      var allowMultipleLanes = webglext2.isNotEmpty(eventsRowOpts) && webglext2.isNotEmpty(eventsRowOpts.allowMultipleLanes) ? eventsRowOpts.allowMultipleLanes : true;
      var timelineFont = options.timelineFont;
      var timelineFgColor = options.timelineFgColor;
      var draggableEdgeWidth = options.draggableEdgeWidth;
      var snapToDistance = options.snapToDistance;
      var rowUi = ui.rowUi(row.rowGuid);
      var input = ui.input;
      var selection = ui.selection;
      var lanes = new webglext2.TimelineLaneArray(model, row, ui, allowMultipleLanes);
      var timeAtCoords_PMILLIS = function(viewport, i) {
        return timeAxis.tAtFrac_PMILLIS(viewport.xFrac(i));
      };
      var timeAtPointer_PMILLIS = function(ev) {
        return timeAtCoords_PMILLIS(ev.paneViewport, ev.i);
      };
      var eventAtCoords = function(viewport, i, j) {
        var laneNum = Math.floor((viewport.jEnd - j - rowTopPadding) / laneHeight);
        var time_PMILLIS = timeAtCoords_PMILLIS(viewport, i);
        return lanes.eventAt(laneNum, time_PMILLIS);
      };
      var eventAtPointer = function(ev) {
        return eventAtCoords(ev.paneViewport, ev.i, ev.j);
      };
      var isInsideAnEvent = function(viewport, i, j) {
        return webglext2.isNotEmpty(eventAtCoords(viewport, i, j));
      };
      var layout = {
        updatePrefSize: function(parentPrefSize) {
          parentPrefSize.h = rowTopPadding + rowBottomPadding + Math.max(1, lanes.length) * laneHeight;
          parentPrefSize.w = null;
        }
      };
      var rowContentPane = new webglext2.Pane(layout, true, isInsideAnEvent);
      rowUi.addPane("content", rowContentPane);
      var painterOptions = { timelineFont, timelineFgColor, rowTopPadding, rowBottomPadding, laneHeight };
      for (var n = 0; n < painterFactories.length; n++) {
        var createPainter = painterFactories[n];
        rowContentPane.addPainter(createPainter(drawable, timeAxis, lanes, ui, painterOptions));
      }
      var redraw = function() {
        drawable.redraw();
      };
      row.eventGuids.valueAdded.on(redraw);
      row.eventGuids.valueMoved.on(redraw);
      row.eventGuids.valueRemoved.on(redraw);
      var watchEventAttrs = function(eventGuid) {
        model.event(eventGuid).attrsChanged.on(redraw);
      };
      row.eventGuids.forEach(watchEventAttrs);
      row.eventGuids.valueAdded.on(watchEventAttrs);
      var removeRedraw = function(eventGuid) {
        model.event(eventGuid).attrsChanged.off(redraw);
      };
      row.eventGuids.valueRemoved.on(removeRedraw);
      var eventDragMode = null;
      var recentMouseMove = null;
      rowContentPane.mouseMove.on(function(ev) {
        input.mouseMove.fire(ev);
        if (!eventDragMode) {
          input.timeHover.fire(timeAtPointer_PMILLIS(ev), ev);
          input.rowHover.fire(row, ev);
          input.eventHover.fire(eventAtPointer(ev), ev);
        }
        recentMouseMove = ev;
      });
      rowContentPane.mouseExit.on(function(ev) {
        input.mouseExit.fire(ev);
        if (!eventDragMode) {
          input.timeHover.fire(null, ev);
          input.rowHover.fire(null, ev);
          input.eventHover.fire(null, ev);
        }
        recentMouseMove = null;
      });
      var uiMillisPerPxChanged = function() {
        if (!eventDragMode && recentMouseMove != null) {
          var ev = recentMouseMove;
          input.timeHover.fire(timeAtPointer_PMILLIS(ev), ev);
          input.eventHover.fire(eventAtPointer(ev), ev);
        }
      };
      ui.millisPerPx.changed.on(uiMillisPerPxChanged);
      rowContentPane.mouseUp.on(function(ev) {
        input.mouseUp.fire(ev);
      });
      rowContentPane.mouseDown.on(function(ev) {
        input.mouseDown.fire(ev);
      });
      rowContentPane.mouseWheel.on(options.mouseWheelListener);
      rowContentPane.contextMenu.on(function(ev) {
        input.contextMenu.fire(ev);
      });
      var eventDragEvents = [];
      var eventDragOffsets_MILLIS = {};
      var eventDragSnapTimes_PMILLIS = [];
      var minEventWidthForEdgeDraggability = 3 * draggableEdgeWidth;
      var minEventWidthWhenDraggingEdge = minEventWidthForEdgeDraggability + 1;
      function allUserEditable(events) {
        for (var n2 = 0; n2 < events.length; n2++) {
          if (!events[n2].userEditable) {
            return false;
          }
        }
        return true;
      }
      function chooseEventDragMode(ui2, mouseTime_PMILLIS, eventDragEvents2) {
        if (eventDragEvents2.length === 0) {
          return null;
        } else if (!allUserEditable(eventDragEvents2)) {
          return "undraggable";
        } else if (eventDragEvents2.length > 1) {
          return "center";
        } else if (eventDragEvents2.length === 1) {
          var event = eventDragEvents2[0];
          var pxPerMilli = 1 / ui2.millisPerPx.value;
          var eventWidth = (event.end_PMILLIS - event.start_PMILLIS) * pxPerMilli;
          if (eventWidth < minEventWidthForEdgeDraggability) {
            return "center";
          } else {
            var mouseOffset = (mouseTime_PMILLIS - event.start_PMILLIS) * pxPerMilli;
            if (mouseOffset < draggableEdgeWidth) {
              return "start";
            } else if (mouseOffset < eventWidth - draggableEdgeWidth) {
              return "center";
            } else {
              return "end";
            }
          }
        } else {
          return null;
        }
      }
      var updateCursor = function() {
        if (!eventDragMode) {
          var mouseCursors = { "center": "default", "start": "w-resize", "end": "e-resize", "undraggable": "default" };
          var hoveredTime_PMILLIS = selection.hoveredTime_PMILLIS.value;
          if (selection.selectedEvents.length > 1) {
            rowContentPane.mouseCursor = mouseCursors[chooseEventDragMode(ui, hoveredTime_PMILLIS, selection.selectedEvents.toArray())];
          } else {
            var hoveredEvent = selection.hoveredEvent.value;
            var hoveredEvents = webglext2.isNotEmpty(hoveredEvent) ? [hoveredEvent] : [];
            rowContentPane.mouseCursor = mouseCursors[chooseEventDragMode(ui, hoveredTime_PMILLIS, hoveredEvents)];
          }
        }
      };
      ui.millisPerPx.changed.on(updateCursor);
      selection.hoveredTime_PMILLIS.changed.on(updateCursor);
      selection.hoveredEvent.changed.on(updateCursor);
      rowContentPane.mouseDown.on(function(ev) {
        if (webglext2.isLeftMouseDown(ev.mouseEvent)) {
          var eventDragEventsSet = selection.selectedEvents;
          eventDragEvents = eventDragEventsSet.toArray();
          eventDragMode = chooseEventDragMode(ui, timeAtPointer_PMILLIS(ev), eventDragEvents);
          eventDragSnapTimes_PMILLIS = new Array();
          var numSnapTimes = 0;
          var allEventGuids = row.eventGuids;
          for (var n2 = 0; n2 < allEventGuids.length; n2++) {
            var eventGuid = allEventGuids.valueAt(n2);
            if (!eventDragEventsSet.hasId(eventGuid)) {
              var event = model.event(eventGuid);
              eventDragSnapTimes_PMILLIS.push(event.start_PMILLIS);
              eventDragSnapTimes_PMILLIS.push(event.end_PMILLIS);
            }
          }
          eventDragSnapTimes_PMILLIS.sort();
        }
      });
      function findSnapShift_MILLIS(t_PMILLIS, maxShift_MILLIS) {
        var i = webglext2.indexNearest(eventDragSnapTimes_PMILLIS, t_PMILLIS);
        if (i >= 0) {
          var shift_MILLIS = eventDragSnapTimes_PMILLIS[i] - t_PMILLIS;
          if (Math.abs(shift_MILLIS) <= maxShift_MILLIS) {
            return shift_MILLIS;
          }
        }
        return null;
      }
      var eventDragPointer_PMILLIS = null;
      var updateEventDragPointer = function(ev) {
        if (webglext2.isLeftMouseDown(ev.mouseEvent) && eventDragMode) {
          eventDragPointer_PMILLIS = timeAtPointer_PMILLIS(ev);
        }
      };
      rowContentPane.mouseDown.on(updateEventDragPointer);
      rowContentPane.mouseMove.on(updateEventDragPointer);
      var grabEventCenter = function() {
        if (eventDragMode === "center") {
          for (var n2 = 0; n2 < eventDragEvents.length; n2++) {
            var event = eventDragEvents[n2];
            eventDragOffsets_MILLIS[event.eventGuid] = eventDragPointer_PMILLIS - event.start_PMILLIS;
          }
          var beginDrag = function() {
            rowContentPane.mouseCursor = "move";
          };
          rowContentPane.mouseMove.on(beginDrag);
          var pendingBeginDrag = setTimeout(beginDrag, 300);
          var endDrag = function() {
            clearTimeout(pendingBeginDrag);
            rowContentPane.mouseMove.off(beginDrag);
            rowContentPane.mouseUp.off(endDrag);
          };
          rowContentPane.mouseUp.on(endDrag);
        }
      };
      rowContentPane.mouseDown.on(grabEventCenter);
      var dragEventCenter = function() {
        if (eventDragMode === "center") {
          var maxSnapShift_MILLIS = snapToDistance * (timeAxis.tSize_MILLIS / rowContentPane.viewport.w);
          var snapShift_MILLIS = null;
          for (var n2 = 0; n2 < eventDragEvents.length; n2++) {
            var event = eventDragEvents[n2];
            var newStart_PMILLIS = eventDragPointer_PMILLIS - eventDragOffsets_MILLIS[event.eventGuid];
            var newEnd_PMILLIS = event.end_PMILLIS + (newStart_PMILLIS - event.start_PMILLIS);
            var eventStartSnapShift_MILLIS = findSnapShift_MILLIS(newStart_PMILLIS, maxSnapShift_MILLIS);
            if (webglext2.isNotEmpty(eventStartSnapShift_MILLIS)) {
              if (!webglext2.isNotEmpty(snapShift_MILLIS) || Math.abs(eventStartSnapShift_MILLIS) < Math.abs(snapShift_MILLIS)) {
                snapShift_MILLIS = eventStartSnapShift_MILLIS;
              }
            }
            var eventEndSnapShift_MILLIS = findSnapShift_MILLIS(newEnd_PMILLIS, maxSnapShift_MILLIS);
            if (webglext2.isNotEmpty(eventEndSnapShift_MILLIS)) {
              if (!webglext2.isNotEmpty(snapShift_MILLIS) || Math.abs(eventEndSnapShift_MILLIS) < Math.abs(snapShift_MILLIS)) {
                snapShift_MILLIS = eventEndSnapShift_MILLIS;
              }
            }
          }
          if (!webglext2.isNotEmpty(snapShift_MILLIS)) {
            snapShift_MILLIS = 0;
          }
          for (var n2 = 0; n2 < eventDragEvents.length; n2++) {
            var event = eventDragEvents[n2];
            var newStart_PMILLIS = eventDragPointer_PMILLIS - eventDragOffsets_MILLIS[event.eventGuid] + snapShift_MILLIS;
            var newEnd_PMILLIS = event.end_PMILLIS + (newStart_PMILLIS - event.start_PMILLIS);
            event.setInterval(newStart_PMILLIS, newEnd_PMILLIS);
          }
        }
      };
      rowContentPane.mouseMove.on(dragEventCenter);
      var grabEventStart = function() {
        if (eventDragMode === "start") {
          for (var n2 = 0; n2 < eventDragEvents.length; n2++) {
            var event = eventDragEvents[n2];
            eventDragOffsets_MILLIS[event.eventGuid] = eventDragPointer_PMILLIS - event.start_PMILLIS;
          }
        }
      };
      rowContentPane.mouseDown.on(grabEventStart);
      var dragEventStart = function() {
        if (eventDragMode === "start") {
          var wMin_MILLIS = minEventWidthWhenDraggingEdge * timeAxis.vSize / rowContentPane.viewport.w;
          var maxSnapShift_MILLIS = snapToDistance * (timeAxis.tSize_MILLIS / rowContentPane.viewport.w);
          var snapShift_MILLIS = null;
          for (var n2 = 0; n2 < eventDragEvents.length; n2++) {
            var event = eventDragEvents[n2];
            var newStart_PMILLIS = eventDragPointer_PMILLIS - eventDragOffsets_MILLIS[event.eventGuid];
            var eventSnapShift_MILLIS = findSnapShift_MILLIS(newStart_PMILLIS, maxSnapShift_MILLIS);
            if (webglext2.isNotEmpty(eventSnapShift_MILLIS)) {
              if (!webglext2.isNotEmpty(snapShift_MILLIS) || Math.abs(eventSnapShift_MILLIS) < Math.abs(snapShift_MILLIS)) {
                snapShift_MILLIS = eventSnapShift_MILLIS;
              }
            }
          }
          if (!webglext2.isNotEmpty(snapShift_MILLIS)) {
            snapShift_MILLIS = 0;
          }
          for (var n2 = 0; n2 < eventDragEvents.length; n2++) {
            var event = eventDragEvents[n2];
            var newStart_PMILLIS = eventDragPointer_PMILLIS - eventDragOffsets_MILLIS[event.eventGuid] + snapShift_MILLIS;
            event.start_PMILLIS = Math.min(event.end_PMILLIS - wMin_MILLIS, newStart_PMILLIS);
          }
        }
      };
      rowContentPane.mouseMove.on(dragEventStart);
      timeAxis.limitsChanged.on(dragEventStart);
      var grabEventEnd = function() {
        if (eventDragMode === "end") {
          for (var n2 = 0; n2 < eventDragEvents.length; n2++) {
            var event = eventDragEvents[n2];
            eventDragOffsets_MILLIS[event.eventGuid] = eventDragPointer_PMILLIS - event.end_PMILLIS;
          }
        }
      };
      rowContentPane.mouseDown.on(grabEventEnd);
      var dragEventEnd = function() {
        if (eventDragMode === "end") {
          var wMin_MILLIS = minEventWidthWhenDraggingEdge * timeAxis.vSize / rowContentPane.viewport.w;
          var maxSnapShift_MILLIS = snapToDistance * (timeAxis.tSize_MILLIS / rowContentPane.viewport.w);
          var snapShift_MILLIS = null;
          for (var n2 = 0; n2 < eventDragEvents.length; n2++) {
            var event = eventDragEvents[n2];
            var newEnd_PMILLIS = eventDragPointer_PMILLIS - eventDragOffsets_MILLIS[event.eventGuid];
            var eventSnapShift_MILLIS = findSnapShift_MILLIS(newEnd_PMILLIS, maxSnapShift_MILLIS);
            if (webglext2.isNotEmpty(eventSnapShift_MILLIS)) {
              if (!webglext2.isNotEmpty(snapShift_MILLIS) || Math.abs(eventSnapShift_MILLIS) < Math.abs(snapShift_MILLIS)) {
                snapShift_MILLIS = eventSnapShift_MILLIS;
              }
            }
          }
          if (!webglext2.isNotEmpty(snapShift_MILLIS)) {
            snapShift_MILLIS = 0;
          }
          for (var n2 = 0; n2 < eventDragEvents.length; n2++) {
            var event = eventDragEvents[n2];
            var newEnd_PMILLIS = eventDragPointer_PMILLIS - eventDragOffsets_MILLIS[event.eventGuid] + snapShift_MILLIS;
            event.end_PMILLIS = Math.max(event.start_PMILLIS + wMin_MILLIS, newEnd_PMILLIS);
          }
        }
      };
      rowContentPane.mouseMove.on(dragEventEnd);
      timeAxis.limitsChanged.on(dragEventEnd);
      rowContentPane.mouseUp.on(function(ev) {
        eventDragEvents = [];
        eventDragOffsets_MILLIS = {};
        eventDragSnapTimes_PMILLIS = [];
        eventDragPointer_PMILLIS = null;
        eventDragMode = null;
      });
      rowContentPane.dispose.on(function() {
        lanes.dispose();
        timeAxis.limitsChanged.off(dragEventEnd);
        timeAxis.limitsChanged.off(dragEventStart);
        ui.millisPerPx.changed.off(uiMillisPerPxChanged);
        ui.millisPerPx.changed.off(updateCursor);
        selection.hoveredTime_PMILLIS.changed.off(updateCursor);
        selection.hoveredEvent.changed.off(updateCursor);
        row.eventGuids.valueAdded.off(redraw);
        row.eventGuids.valueMoved.off(redraw);
        row.eventGuids.valueRemoved.off(redraw);
        row.eventGuids.valueRemoved.off(removeRedraw);
        row.eventGuids.valueAdded.off(watchEventAttrs);
        row.eventGuids.forEach(function(eventGuid) {
          model.event(eventGuid).attrsChanged.off(redraw);
        });
      });
      return rowContentPane;
    };
  }
  webglext2.newEventsRowPaneFactory = newEventsRowPaneFactory;
  function eventLimitsPainterHelper(limitsOpts, drawable, timeAxis, lanes, ui, options) {
    var rowTopPadding = options.rowTopPadding;
    var rowBottomPadding = options.rowBottomPadding;
    var laneHeight = options.laneHeight;
    var lineColor = webglext2.isNotEmpty(limitsOpts) && webglext2.isNotEmpty(limitsOpts.lineColor) ? limitsOpts.lineColor : new webglext2.Color(1, 0, 0, 1);
    var lineThickness = webglext2.isNotEmpty(limitsOpts) && webglext2.isNotEmpty(limitsOpts.lineThickness) ? limitsOpts.lineThickness : 2.5;
    var xyFrac_vColor_VERTSHADER = webglext2.concatLines("                                                                ", "  attribute vec2 a_XyFrac;                                      ", "  attribute vec4 a_Color;                                       ", "                                                                ", "  varying vec4 v_Color;                                         ", "                                                                ", "  void main( ) {                                                ", "      gl_Position = vec4( ( -1.0 + 2.0*a_XyFrac ), 0.0, 1.0 );  ", "      v_Color = a_Color;                                        ", "  }                                                             ", "                                                                ");
    var program = new webglext2.Program(xyFrac_vColor_VERTSHADER, webglext2.varyingColor_FRAGSHADER);
    var a_XyFrac = new webglext2.Attribute(program, "a_XyFrac");
    var a_Color = new webglext2.Attribute(program, "a_Color");
    var xys = new Float32Array(0);
    var xysBuffer = webglext2.newDynamicBuffer();
    var rgbas = new Float32Array(0);
    var rgbasBuffer = webglext2.newDynamicBuffer();
    return {
      paint: function(indexXys, indexRgbas, gl, viewport) {
        if (indexXys > 0) {
          gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
          gl.enable(webglext2.GL.BLEND);
          program.use(gl);
          xysBuffer.setData(xys.subarray(0, indexXys));
          a_XyFrac.setDataAndEnable(gl, xysBuffer, 2, webglext2.GL.FLOAT);
          rgbasBuffer.setData(rgbas.subarray(0, indexRgbas));
          a_Color.setDataAndEnable(gl, rgbasBuffer, 4, webglext2.GL.FLOAT);
          gl.drawArrays(webglext2.GL.TRIANGLES, 0, Math.floor(indexXys / 2));
          a_Color.disable(gl);
          a_XyFrac.disable(gl);
          program.endUse(gl);
        }
      },
      ensureCapacity: function(eventCount) {
        var numVertices = 6 * 3 * eventCount;
        xys = webglext2.ensureCapacityFloat32(xys, 2 * numVertices);
        rgbas = webglext2.ensureCapacityFloat32(rgbas, 4 * numVertices);
      },
      fillEvent: function(laneIndex, eventIndex, indexXys, indexRgbas, viewport) {
        var lane = lanes.lane(laneIndex);
        var event = lane.event(eventIndex);
        var wLine = lineThickness / viewport.w;
        var hLine = lineThickness / viewport.h;
        var jTop = rowTopPadding + laneIndex * laneHeight;
        var yTop = (viewport.h - jTop) / viewport.h;
        var jBottom = rowTopPadding + (laneIndex + 1) * laneHeight;
        var yBottom = (viewport.h - jBottom) / viewport.h;
        var yMid = (yTop + yBottom) / 2;
        var xLeft = webglext2.isNotEmpty(event.startLimit_PMILLIS) ? timeAxis.tFrac(event.startLimit_PMILLIS) : 0;
        var xRight = webglext2.isNotEmpty(event.endLimit_PMILLIS) ? timeAxis.tFrac(event.endLimit_PMILLIS) : 1;
        indexXys = webglext2.putQuadXys(xys, indexXys, xLeft, xRight, yMid - hLine / 2, yMid + hLine / 2);
        indexXys = webglext2.putQuadXys(xys, indexXys, xLeft, xLeft - wLine, yTop, yBottom);
        indexXys = webglext2.putQuadXys(xys, indexXys, xRight, xRight + wLine, yTop, yBottom);
        indexRgbas = webglext2.putRgbas(rgbas, indexRgbas, lineColor, 18);
        return { indexXys, indexRgbas };
      }
    };
  }
  function newEventLimitsPainterFactory(limitOpts) {
    return function(drawable, timeAxis, lanes, ui, options) {
      var helper = eventLimitsPainterHelper(limitOpts, drawable, timeAxis, lanes, ui, options);
      return function(gl, viewport) {
        var selectedEvents = ui.selection.selectedEvents;
        helper.ensureCapacity(lanes.numEvents);
        var indexXys = 0;
        var indexRgbas = 0;
        for (var l = 0; l < lanes.length; l++) {
          var lane = lanes.lane(l);
          for (var e = 0; e < lane.length; e++) {
            var event = lane.event(e);
            if (selectedEvents.hasId(event.eventGuid) && (webglext2.isNotEmpty(event.startLimit_PMILLIS) || webglext2.isNotEmpty(event.endLimit_PMILLIS))) {
              var indexes = helper.fillEvent(l, e, indexXys, indexRgbas, viewport);
              indexXys = indexes.indexXys;
              indexRgbas = indexes.indexRgbas;
            }
          }
        }
        helper.paint(indexXys, indexRgbas, gl, viewport);
      };
    };
  }
  webglext2.newEventLimitsPainterFactory = newEventLimitsPainterFactory;
  var JointType;
  (function(JointType2) {
    JointType2[JointType2["BEVEL"] = 0] = "BEVEL";
    JointType2[JointType2["MITER"] = 1] = "MITER";
  })(JointType = webglext2.JointType || (webglext2.JointType = {}));
  var FillPattern;
  (function(FillPattern2) {
    FillPattern2[FillPattern2["solid"] = 0] = "solid";
    FillPattern2[FillPattern2["stripe"] = 1] = "stripe";
    FillPattern2[FillPattern2["gradient"] = 2] = "gradient";
  })(FillPattern = webglext2.FillPattern || (webglext2.FillPattern = {}));
  function eventStripedBarPainterHelper(barOpts, drawable, timeAxis, lanes, ui, options) {
    var rowTopPadding = options.rowTopPadding;
    var rowBottomPadding = options.rowBottomPadding;
    var laneHeight = options.laneHeight;
    var topMargin = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.topMargin) ? barOpts.topMargin : 1.2;
    var bottomMargin = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.bottomMargin) ? barOpts.bottomMargin : 1.2;
    var borderThickness = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.borderThickness) ? barOpts.borderThickness : 2;
    var cornerType = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.cornerType) ? barOpts.cornerType : JointType.BEVEL;
    var defaultColor = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.defaultColor) ? barOpts.defaultColor : options.timelineFgColor.withAlphaTimes(0.4);
    var defaultColorSecondary = new webglext2.Color(1, 1, 1, 1);
    var minimumVisibleWidth = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.minimumVisibleWidth) ? barOpts.minimumVisibleWidth : 0;
    var stripeWidth = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.stripeWidth) ? barOpts.stripeWidth : 5;
    var stripeSecondaryWidth = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.stripeSecondaryWidth) ? barOpts.stripeSecondaryWidth : 5;
    var stripeSlant = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.stripeSlant) ? barOpts.stripeSlant : 1;
    var featherWidth = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.featherWidth) ? barOpts.featherWidth : 2;
    var selection = ui.selection;
    var xyFrac_vColor_VERTSHADER = webglext2.concatLines("                                                                ", "  attribute vec2 a_XyFrac;                                      ", "  attribute vec4 a_Color;                                       ", "  attribute vec4 a_ColorSecondary;                              ", "  attribute vec2 a_relativeXy;                                  ", "  attribute float a_fillPattern;                                ", "                                                                ", "  varying vec4 v_Color;                                         ", "  varying vec4 v_ColorSecondary;                                ", "  varying vec2 v_relativeXy;                                    ", "  varying float v_fillPattern;                                  ", "                                                                ", "  void main( ) {                                                ", "      gl_Position = vec4( ( -1.0 + 2.0*a_XyFrac ), 0.0, 1.0 );  ", "      v_Color = a_Color;                                        ", "      v_ColorSecondary = a_ColorSecondary;                      ", "      v_relativeXy = a_relativeXy;                              ", "      v_fillPattern = a_fillPattern;                            ", "  }                                                             ", "                                                                ");
    var fillPattern_FRAGSHADER = webglext2.concatLines(" #define PI 3.1415926535897932384626433832795                                                  ", "                                                                                               ", " precision lowp float;                                                                         ", " // the width in pixels of the first color stripe                                              ", " uniform float u_stripeWidth;                                                                  ", " // the width in pixels of the second color stripe                                             ", " uniform float u_stripeSecondaryWidth;                                                         ", " // the slant of the stipes: 0 = horizontal, 1 = 45 degrees                                    ", " uniform float u_slant;                                                                        ", " // width in pixels of the antialiasing of the slant                                           ", " uniform float u_featherWidth;                                                                 ", "                                                                                               ", " varying vec4 v_Color;                                                                         ", " varying vec4 v_ColorSecondary;                                                                ", " varying vec2 v_relativeXy;                                                                    ", " varying float v_fillPattern;                                                                  ", "                                                                                               ", " void pattern_stripe( ) {                                                                      ", "     float stripeWidthTotal = u_stripeWidth + u_stripeSecondaryWidth;                          ", "                                                                                               ", "     // calculate the value indicating where we are in the stripe pattern                      ", "     float stripeCoord = mod( v_relativeXy.x + u_slant * v_relativeXy.y , stripeWidthTotal );  ", "                                                                                               ", "     // we are in the feather region beween the two stripes                                    ", "     if ( stripeCoord < u_featherWidth ) {                                                     ", "         float diff = stripeCoord / u_featherWidth;                                            ", "         gl_FragColor = vec4 ( v_Color.xyz * diff + (1.0-diff) * v_ColorSecondary.xyz, 1.0 );  ", "     }                                                                                         ", "     // we are in the color 1 stripe                                                           ", "     else if ( stripeCoord < u_stripeWidth ) {                                                 ", "         gl_FragColor = v_Color;                                                               ", "     }                                                                                         ", "     // we are the feather region between the two stripes                                      ", "     else if ( stripeCoord  < u_stripeWidth + u_featherWidth ) {                               ", "         float diff = ( stripeCoord - u_stripeWidth ) / u_featherWidth;                        ", "         gl_FragColor = vec4 ( v_Color.xyz * (1.0-diff) + diff * v_ColorSecondary.xyz, 1.0 );  ", "     }                                                                                         ", "     // we are in the color 2 stripe                                                           ", "     else {                                                                                    ", "         gl_FragColor = v_ColorSecondary;                                                      ", "     }                                                                                         ", " }                                                                                             ", "                                                                                               ", " void pattern_gradient( ) {                                                                    ", "     float stripeWidthTotal = u_stripeWidth + u_stripeSecondaryWidth;                          ", "                                                                                               ", "     // calculate the value indicating where we are in the stripe pattern                      ", "     float stripeCoord = mod( v_relativeXy.x + u_slant * v_relativeXy.y , stripeWidthTotal );  ", "                                                                                               ", "     float weightedCoord;                                                                      ", "     if ( stripeCoord < u_stripeWidth ) {                                                      ", "         float slope =  PI / u_stripeWidth;                                                    ", "         weightedCoord = slope * stripeCoord;                                                  ", "     }                                                                                         ", "     else {                                                                                    ", "         float slope = PI / u_stripeSecondaryWidth;                                            ", "         weightedCoord = PI + slope * ( stripeCoord - u_stripeWidth );                         ", "     }                                                                                         ", "                                                                                               ", "     // sin wave domain: [0, stripeWidthTotal ] range: [0, 1]                                  ", "     float frac = sin( weightedCoord ) * 2.0 - 1.0;                                            ", "                                                                                               ", "     // mix primary and secondary colors based on gradient fraction                            ", "     gl_FragColor = mix( v_Color, v_ColorSecondary, frac );                                    ", " }                                                                                             ", "                                                                                               ", " void pattern_solid( ) {                                                                       ", "     gl_FragColor = v_Color;                                                                   ", " }                                                                                             ", "                                                                                               ", " void main( ) {                                                                                ", "     if ( v_fillPattern == 1.0 ) {                                                             ", "         pattern_stripe( );                                                                    ", "     }                                                                                         ", "     else if ( v_fillPattern == 2.0 ) {                                                        ", "         pattern_gradient( );                                                                  ", "     }                                                                                         ", "     else {                                                                                    ", "         pattern_solid( );                                                                     ", "     }                                                                                         ", " }                                                                                             ", "                                                                                               ", "                                                                                               ", "                                                                                               ");
    var program = new webglext2.Program(xyFrac_vColor_VERTSHADER, fillPattern_FRAGSHADER);
    var a_XyFrac = new webglext2.Attribute(program, "a_XyFrac");
    var a_Color = new webglext2.Attribute(program, "a_Color");
    var a_ColorSecondary = new webglext2.Attribute(program, "a_ColorSecondary");
    var a_relativeXy = new webglext2.Attribute(program, "a_relativeXy");
    var a_fillPattern = new webglext2.Attribute(program, "a_fillPattern");
    var u_stripeWidth = new webglext2.Uniform1f(program, "u_stripeWidth");
    var u_stripeSecondaryWidth = new webglext2.Uniform1f(program, "u_stripeSecondaryWidth");
    var u_slant = new webglext2.Uniform1f(program, "u_slant");
    var u_featherWidth = new webglext2.Uniform1f(program, "u_featherWidth");
    var xys = new Float32Array(0);
    var xysBuffer = webglext2.newDynamicBuffer();
    var rgbas = new Float32Array(0);
    var rgbasBuffer = webglext2.newDynamicBuffer();
    var rgbasSecondary = new Float32Array(0);
    var rgbasSecondaryBuffer = webglext2.newDynamicBuffer();
    var relativeXys = new Float32Array(0);
    var relativeXysBuffer = webglext2.newDynamicBuffer();
    var fillPattern = new Float32Array(0);
    var fillPatternBuffer = webglext2.newDynamicBuffer();
    return {
      paint: function(indexXys, indexRgbas, gl, viewport, indexRelativeXys, indexFillPattern) {
        if (indexXys == 0 || indexRgbas == 0)
          return;
        gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
        gl.enable(webglext2.GL.BLEND);
        program.use(gl);
        u_slant.setData(gl, stripeSlant);
        u_stripeWidth.setData(gl, stripeWidth);
        u_stripeSecondaryWidth.setData(gl, stripeSecondaryWidth);
        u_featherWidth.setData(gl, featherWidth);
        xysBuffer.setData(xys.subarray(0, indexXys));
        a_XyFrac.setDataAndEnable(gl, xysBuffer, 2, webglext2.GL.FLOAT);
        rgbasBuffer.setData(rgbas.subarray(0, indexRgbas));
        a_Color.setDataAndEnable(gl, rgbasBuffer, 4, webglext2.GL.FLOAT);
        rgbasSecondaryBuffer.setData(rgbasSecondary.subarray(0, indexRgbas));
        a_ColorSecondary.setDataAndEnable(gl, rgbasSecondaryBuffer, 4, webglext2.GL.FLOAT);
        relativeXysBuffer.setData(relativeXys.subarray(0, indexRelativeXys));
        a_relativeXy.setDataAndEnable(gl, relativeXysBuffer, 2, webglext2.GL.FLOAT);
        fillPatternBuffer.setData(fillPattern.subarray(0, indexFillPattern));
        a_fillPattern.setDataAndEnable(gl, fillPatternBuffer, 1, webglext2.GL.FLOAT);
        gl.drawArrays(webglext2.GL.TRIANGLES, 0, Math.floor(indexXys / 2));
        a_Color.disable(gl);
        a_XyFrac.disable(gl);
        a_ColorSecondary.disable(gl);
        a_fillPattern.disable(gl);
        a_relativeXy.disable(gl);
        program.endUse(gl);
      },
      ensureCapacity: function(eventCount) {
        var numVertices = 6 * 1 * eventCount;
        xys = webglext2.ensureCapacityFloat32(xys, 2 * numVertices);
        rgbas = webglext2.ensureCapacityFloat32(rgbas, 4 * numVertices);
        rgbasSecondary = webglext2.ensureCapacityFloat32(rgbasSecondary, 4 * numVertices);
        relativeXys = webglext2.ensureCapacityFloat32(relativeXys, 2 * numVertices);
        fillPattern = webglext2.ensureCapacityFloat32(fillPattern, numVertices);
      },
      fillEvent: function(laneIndex, eventIndex, indexXys, indexRgbas, viewport, indexRelativeXys, indexFillPattern) {
        var lane = lanes.lane(laneIndex);
        var event = lane.event(eventIndex);
        var wBorder = borderThickness / viewport.w;
        var hBorder = borderThickness / viewport.h;
        var _topMargin = webglext2.isNotEmpty(event.topMargin) ? event.topMargin : topMargin;
        var _bottomMargin = webglext2.isNotEmpty(event.bottomMargin) ? event.bottomMargin : bottomMargin;
        var jTop = rowTopPadding + laneIndex * laneHeight + _topMargin;
        var yTop = (viewport.h - jTop) / viewport.h;
        var jBottom = rowTopPadding + (laneIndex + 1) * laneHeight - _bottomMargin;
        var yBottom = (viewport.h - jBottom) / viewport.h;
        var xLeft = timeAxis.tFrac(event.start_PMILLIS);
        var xRight = timeAxis.tFrac(event.end_PMILLIS);
        var xWidthPixels = viewport.w * (xRight - xLeft);
        var yHeightPixels = jTop - jBottom;
        if (!(xRight < 0 || xLeft > 1) && xWidthPixels > minimumVisibleWidth) {
          var fillColor = event.bgColor || defaultColor;
          var fillColorSecondary = event.bgSecondaryColor || defaultColorSecondary;
          if (event === selection.hoveredEvent.value) {
            fillColor = webglext2.darker(fillColor, 0.8);
            fillColorSecondary = webglext2.darker(fillColorSecondary, 0.8);
          }
          indexXys = webglext2.putQuadXys(xys, indexXys, xLeft + wBorder, xRight - wBorder, yTop - hBorder, yBottom + hBorder);
          var startIndex = indexRgbas;
          webglext2.putQuadRgbas(rgbas, startIndex, fillColor);
          indexRgbas = webglext2.putQuadRgbas(rgbasSecondary, startIndex, fillColorSecondary);
          indexRelativeXys = webglext2.putQuadXys(relativeXys, indexRelativeXys, 0, xWidthPixels, 0, yHeightPixels);
          var fillPatternValue = event.fillPattern;
          fillPattern[indexFillPattern++] = fillPatternValue;
          fillPattern[indexFillPattern++] = fillPatternValue;
          fillPattern[indexFillPattern++] = fillPatternValue;
          fillPattern[indexFillPattern++] = fillPatternValue;
          fillPattern[indexFillPattern++] = fillPatternValue;
          fillPattern[indexFillPattern++] = fillPatternValue;
        }
        return { indexXys, indexRgbas, indexRelativeXys, indexFillPattern };
      }
    };
  }
  function eventDashedBorderPainterHelper(barOpts, drawable, timeAxis, lanes, ui, options) {
    var rowTopPadding = options.rowTopPadding;
    var rowBottomPadding = options.rowBottomPadding;
    var laneHeight = options.laneHeight;
    var topMargin = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.topMargin) ? barOpts.topMargin : 1.2;
    var bottomMargin = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.bottomMargin) ? barOpts.bottomMargin : 1.2;
    var borderThickness = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.borderThickness) ? barOpts.borderThickness : 2;
    var cornerType = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.cornerType) ? barOpts.cornerType : JointType.BEVEL;
    var defaultColor = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.defaultColor) ? barOpts.defaultColor : options.timelineFgColor.withAlphaTimes(0.4);
    var defaultBorderColor = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.defaultBorderColor) ? barOpts.defaultBorderColor : null;
    var selectedBorderColor = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.selectedBorderColor) ? barOpts.selectedBorderColor : options.timelineFgColor;
    var minimumVisibleWidth = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.minimumVisibleWidth) ? barOpts.minimumVisibleWidth : 0;
    var dashLength = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.dashLength) ? barOpts.dashLength : 5;
    var defaultSecondaryColor = new webglext2.Color(0, 0, 0, 0);
    var selection = ui.selection;
    var dashedBorder_VERTSHADER = webglext2.concatLines("                                                                ", "  attribute vec2 a_XyFrac;                                      ", "  attribute vec4 a_Color;                                       ", "  attribute vec4 a_SecondaryColor;                              ", "  attribute float a_LengthSoFar;                                ", "                                                                ", "  varying vec4 v_Color;                                         ", "  varying vec4 v_SecondaryColor;                                ", "  varying float f_LengthSoFar;                                  ", "                                                                ", "  void main( ) {                                                ", "      gl_Position = vec4( ( -1.0 + 2.0*a_XyFrac ), 0.0, 1.0 );  ", "      v_Color = a_Color;                                        ", "      v_SecondaryColor = a_SecondaryColor;                      ", "      f_LengthSoFar = a_LengthSoFar;                            ", "  }                                                             ", "                                                                ");
    var varyingBorder_FRAGSHADER = webglext2.concatLines("                                                                            ", "  precision lowp float;                                                     ", "  varying vec4 v_Color;                                                     ", "  varying vec4 v_SecondaryColor;                                            ", "  varying float f_LengthSoFar;                                              ", "  //dashes are u_DashLength_PX pixels long                                  ", "  uniform float u_DashLength_PX;                                            ", "                                                                            ", "  void main( ) {                                                            ", "      gl_FragColor = v_Color;                                               ", "                                                                            ", "      if (f_LengthSoFar > 0.0) {                                            ", "         float mod = mod(f_LengthSoFar, u_DashLength_PX * 2.0);             ", "         float alpha = 1.0;                                                 ", "         if ( mod < u_DashLength_PX ) {                                     ", "            gl_FragColor = v_SecondaryColor;                                ", "         }                                                                  ", "         else {                                                             ", "            gl_FragColor = v_Color;                                         ", "         }                                                                  ", "      }                                                                     ", "      else {                                                                ", "         gl_FragColor = v_Color;                                            ", "      }                                                                     ", "  }                                                                         ", "                                                                            ");
    var program = new webglext2.Program(dashedBorder_VERTSHADER, varyingBorder_FRAGSHADER);
    var a_XyFrac = new webglext2.Attribute(program, "a_XyFrac");
    var a_Color = new webglext2.Attribute(program, "a_Color");
    var a_SecondaryColor = new webglext2.Attribute(program, "a_SecondaryColor");
    var a_LengthSoFar = new webglext2.Attribute(program, "a_LengthSoFar");
    var u_DashLength_PX = new webglext2.Uniform1f(program, "u_DashLength_PX");
    var xys = new Float32Array(0);
    var xysBuffer = webglext2.newDynamicBuffer();
    var rgbas = new Float32Array(0);
    var rgbasBuffer = webglext2.newDynamicBuffer();
    var rgbasSecondary = new Float32Array(0);
    var rgbasSecondaryBuffer = webglext2.newDynamicBuffer();
    var lengths = new Float32Array(0);
    var lengthsBuffer = webglext2.newDynamicBuffer();
    return {
      paint: function(indexXys, indexRgbas, gl, viewport, indexLengthSoFar) {
        if (indexXys == 0 || indexRgbas == 0)
          return;
        gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
        gl.enable(webglext2.GL.BLEND);
        program.use(gl);
        u_DashLength_PX.setData(gl, dashLength);
        xysBuffer.setData(xys.subarray(0, indexXys));
        a_XyFrac.setDataAndEnable(gl, xysBuffer, 2, webglext2.GL.FLOAT);
        rgbasBuffer.setData(rgbas.subarray(0, indexRgbas));
        a_Color.setDataAndEnable(gl, rgbasBuffer, 4, webglext2.GL.FLOAT);
        rgbasSecondaryBuffer.setData(rgbasSecondary.subarray(0, indexRgbas));
        a_SecondaryColor.setDataAndEnable(gl, rgbasSecondaryBuffer, 4, webglext2.GL.FLOAT);
        lengthsBuffer.setData(lengths.subarray(0, indexLengthSoFar));
        a_LengthSoFar.setDataAndEnable(gl, lengthsBuffer, 1, webglext2.GL.FLOAT);
        gl.drawArrays(webglext2.GL.TRIANGLES, 0, Math.floor(indexXys / 2));
        a_Color.disable(gl);
        a_SecondaryColor.disable(gl);
        a_XyFrac.disable(gl);
        a_LengthSoFar.disable(gl);
        program.endUse(gl);
      },
      ensureCapacity: function(eventCount) {
        var numVertices;
        switch (cornerType) {
          case JointType.BEVEL:
            numVertices = (6 * 4 + 3 * 4) * eventCount;
            break;
          default:
            numVertices = 6 * 4 * eventCount;
            break;
        }
        xys = webglext2.ensureCapacityFloat32(xys, 2 * numVertices);
        rgbas = webglext2.ensureCapacityFloat32(rgbas, 4 * numVertices);
        rgbasSecondary = webglext2.ensureCapacityFloat32(rgbasSecondary, 4 * numVertices);
        lengths = webglext2.ensureCapacityFloat32(lengths, numVertices);
      },
      fillEvent: function(laneIndex, eventIndex, indexXys, indexRgbas, viewport, indexLengthSoFar) {
        var lane = lanes.lane(laneIndex);
        var event = lane.event(eventIndex);
        var wBorder = borderThickness / viewport.w;
        var hBorder = borderThickness / viewport.h;
        var _topMargin = webglext2.isNotEmpty(event.topMargin) ? event.topMargin : topMargin;
        var _bottomMargin = webglext2.isNotEmpty(event.bottomMargin) ? event.bottomMargin : bottomMargin;
        var jTop = rowTopPadding + laneIndex * laneHeight + _topMargin;
        var yTop = (viewport.h - jTop) / viewport.h;
        var jBottom = rowTopPadding + (laneIndex + 1) * laneHeight - _bottomMargin;
        var yBottom = (viewport.h - jBottom) / viewport.h;
        var xLeft = timeAxis.tFrac(event.start_PMILLIS);
        var xRight = timeAxis.tFrac(event.end_PMILLIS);
        var widthPixels = viewport.w * (xRight - xLeft);
        var heightPixels = jBottom - jTop;
        var setLengthsVertical = function(bottomEdge, topEdge) {
          lengths[indexLengthSoFar++] = topEdge;
          lengths[indexLengthSoFar++] = topEdge;
          lengths[indexLengthSoFar++] = bottomEdge;
          lengths[indexLengthSoFar++] = bottomEdge;
          lengths[indexLengthSoFar++] = topEdge;
          lengths[indexLengthSoFar++] = bottomEdge;
          return Math.abs(bottomEdge - topEdge);
        };
        var setLengthsHorizontal = function(leftEdge, rightEdge) {
          lengths[indexLengthSoFar++] = leftEdge;
          lengths[indexLengthSoFar++] = rightEdge;
          lengths[indexLengthSoFar++] = leftEdge;
          lengths[indexLengthSoFar++] = leftEdge;
          lengths[indexLengthSoFar++] = rightEdge;
          lengths[indexLengthSoFar++] = rightEdge;
          return Math.abs(leftEdge - rightEdge);
        };
        var setLengthsTriangle = function(length) {
          lengths[indexLengthSoFar++] = length;
          lengths[indexLengthSoFar++] = length;
          lengths[indexLengthSoFar++] = length;
        };
        if (!(xRight < 0 || xLeft > 1) && widthPixels > minimumVisibleWidth) {
          var borderColor = event.borderColor || event.bgColor || defaultBorderColor;
          var borderSecondaryColor = event.borderSecondaryColor || defaultSecondaryColor;
          if (selection.selectedEvents.hasValue(event)) {
            borderColor = selectedBorderColor;
          }
          if (borderColor) {
            switch (cornerType) {
              case JointType.BEVEL:
                indexXys = webglext2.putQuadXys(xys, indexXys, xLeft + wBorder, xRight - wBorder, yTop, yTop - hBorder);
                indexXys = webglext2.putUpperRightTriangleXys(xys, indexXys, xLeft, xLeft + wBorder, yBottom + hBorder, yBottom);
                indexXys = webglext2.putQuadXys(xys, indexXys, xRight - wBorder, xRight, yTop - hBorder, yBottom + hBorder);
                indexXys = webglext2.putLowerRightTriangleXys(xys, indexXys, xLeft, xLeft + wBorder, yTop, yTop - hBorder);
                indexXys = webglext2.putQuadXys(xys, indexXys, xLeft + wBorder, xRight - wBorder, yBottom + hBorder, yBottom);
                indexXys = webglext2.putLowerLeftTriangleXys(xys, indexXys, xRight - wBorder, xRight, yTop, yTop - hBorder);
                indexXys = webglext2.putQuadXys(xys, indexXys, xLeft, xLeft + wBorder, yTop - hBorder, yBottom + hBorder);
                indexXys = webglext2.putUpperLeftTriangleXys(xys, indexXys, xRight - wBorder, xRight, yBottom + hBorder, yBottom);
                var startIndex = indexRgbas;
                webglext2.putRgbas(rgbas, startIndex, borderColor, 24);
                indexRgbas = webglext2.putRgbas(rgbasSecondary, startIndex, borderSecondaryColor, 24);
                startIndex = indexRgbas;
                webglext2.putRgbas(rgbas, startIndex, borderColor, 12);
                indexRgbas = webglext2.putRgbas(rgbasSecondary, startIndex, borderSecondaryColor, 12);
                if (!event.isBorderDashed) {
                  setLengthsHorizontal(-1, -1);
                  setLengthsTriangle(-1);
                  setLengthsVertical(-1, -1);
                  setLengthsTriangle(-1);
                  setLengthsHorizontal(-1, -1);
                  setLengthsTriangle(-1);
                  setLengthsVertical(-1, -1);
                  setLengthsTriangle(-1);
                } else {
                  var cumulativeLength = 0;
                  cumulativeLength += setLengthsHorizontal(cumulativeLength, cumulativeLength + widthPixels);
                  setLengthsTriangle(cumulativeLength);
                  cumulativeLength += setLengthsVertical(cumulativeLength + heightPixels, cumulativeLength);
                  setLengthsTriangle(cumulativeLength);
                  cumulativeLength += setLengthsHorizontal(cumulativeLength, cumulativeLength + widthPixels);
                  setLengthsTriangle(cumulativeLength);
                  cumulativeLength += setLengthsVertical(cumulativeLength + heightPixels, cumulativeLength);
                  setLengthsTriangle(cumulativeLength);
                }
                break;
              default:
                indexXys = webglext2.putQuadXys(xys, indexXys, xLeft, xRight - wBorder, yTop, yTop - hBorder);
                indexXys = webglext2.putQuadXys(xys, indexXys, xRight - wBorder, xRight, yTop, yBottom + hBorder);
                indexXys = webglext2.putQuadXys(xys, indexXys, xLeft + wBorder, xRight, yBottom + hBorder, yBottom);
                indexXys = webglext2.putQuadXys(xys, indexXys, xLeft, xLeft + wBorder, yTop - hBorder, yBottom);
                var startIndex = indexRgbas;
                webglext2.putRgbas(rgbas, startIndex, borderColor, 24);
                indexRgbas = webglext2.putRgbas(rgbasSecondary, startIndex, borderSecondaryColor, 24);
                if (!event.isBorderDashed) {
                  setLengthsHorizontal(-1, -1);
                  setLengthsVertical(-1, -1);
                  setLengthsHorizontal(-1, -1);
                  setLengthsVertical(-1, -1);
                } else {
                  var cumulativeLength = 0;
                  cumulativeLength += setLengthsHorizontal(cumulativeLength, cumulativeLength + widthPixels);
                  cumulativeLength += setLengthsVertical(cumulativeLength + heightPixels, cumulativeLength);
                  cumulativeLength += setLengthsHorizontal(cumulativeLength, cumulativeLength + widthPixels);
                  cumulativeLength += setLengthsVertical(cumulativeLength + heightPixels, cumulativeLength);
                }
                break;
            }
          }
        }
        return { indexXys, indexRgbas, indexLengthSoFar };
      }
    };
  }
  function newEventStripedBarsPainterFactory(barOpts) {
    return function(drawable, timeAxis, lanes, ui, options) {
      var helper = eventStripedBarPainterHelper(barOpts, drawable, timeAxis, lanes, ui, options);
      return function(gl, viewport) {
        helper.ensureCapacity(lanes.numEvents);
        var indexXys = 0;
        var indexRgbas = 0;
        var indexRelativeXys = 0;
        var indexFillPattern = 0;
        for (var l = 0; l < lanes.length; l++) {
          var lane = lanes.lane(l);
          for (var e = 0; e < lane.length; e++) {
            var event = lane.event(e);
            var indexes = helper.fillEvent(l, e, indexXys, indexRgbas, viewport, indexRelativeXys, indexFillPattern);
            indexXys = indexes.indexXys;
            indexRgbas = indexes.indexRgbas;
            indexRelativeXys = indexes.indexRelativeXys;
            indexFillPattern = indexes.indexFillPattern;
          }
        }
        helper.paint(indexXys, indexRgbas, gl, viewport, indexRelativeXys, indexFillPattern);
      };
    };
  }
  webglext2.newEventStripedBarsPainterFactory = newEventStripedBarsPainterFactory;
  function newEventDashedBordersPainterFactory(barOpts) {
    return function(drawable, timeAxis, lanes, ui, options) {
      var helper = eventDashedBorderPainterHelper(barOpts, drawable, timeAxis, lanes, ui, options);
      return function(gl, viewport) {
        helper.ensureCapacity(lanes.numEvents);
        var indexXys = 0;
        var indexRgbas = 0;
        var indexLengthSoFar = 0;
        for (var l = 0; l < lanes.length; l++) {
          var lane = lanes.lane(l);
          for (var e = 0; e < lane.length; e++) {
            var event = lane.event(e);
            var indexes = helper.fillEvent(l, e, indexXys, indexRgbas, viewport, indexLengthSoFar);
            indexXys = indexes.indexXys;
            indexRgbas = indexes.indexRgbas;
            indexLengthSoFar = indexes.indexLengthSoFar;
          }
        }
        helper.paint(indexXys, indexRgbas, gl, viewport, indexLengthSoFar);
      };
    };
  }
  webglext2.newEventDashedBordersPainterFactory = newEventDashedBordersPainterFactory;
  function eventIconsPainterHelper(iconOpts, drawable, timeAxis, lanes, ui, options) {
    var rowTopPadding = options.rowTopPadding;
    var rowBottomPadding = options.rowBottomPadding;
    var laneHeight = options.laneHeight;
    var topMargin = webglext2.isNotEmpty(iconOpts) && webglext2.isNotEmpty(iconOpts.topMargin) ? iconOpts.topMargin : 1.2;
    var bottomMargin = webglext2.isNotEmpty(iconOpts) && webglext2.isNotEmpty(iconOpts.bottomMargin) ? iconOpts.bottomMargin : 1.2;
    var vAlign = webglext2.isNotEmpty(iconOpts) && webglext2.isNotEmpty(iconOpts.vAlign) ? iconOpts.vAlign : 0.5;
    var textureRenderer = new webglext2.TextureRenderer();
    return {
      textureRenderer,
      paintEvent: function(laneIndex, eventIndex, gl, viewport) {
        var lane = lanes.lane(laneIndex);
        var event = lane.event(eventIndex);
        var eventStyle = ui.eventStyle(event.styleGuid);
        var jTop = rowTopPadding + laneIndex * laneHeight + topMargin;
        var yFrac = (viewport.h - jTop - (1 - vAlign) * (laneHeight - topMargin - bottomMargin)) / viewport.h;
        for (var n = 0; n < eventStyle.numIcons; n++) {
          var icon = eventStyle.icon(n);
          var iconTime_PMILLIS = event.start_PMILLIS + icon.hPos * (event.end_PMILLIS - event.start_PMILLIS);
          var xFrac = timeAxis.tFrac(iconTime_PMILLIS);
          var w = icon.displayWidth / viewport.w;
          if (-w <= xFrac && xFrac <= 1 + w) {
            var iconTexture = ui.loadImage(icon.url, function() {
              drawable.redraw();
            });
            if (iconTexture) {
              textureRenderer.draw(gl, iconTexture, xFrac, yFrac, { xAnchor: icon.hAlign, yAnchor: vAlign, width: icon.displayWidth, height: icon.displayHeight });
            }
          }
        }
      }
    };
  }
  function newEventIconsPainterFactory(iconOpts) {
    return function(drawable, timeAxis, lanes, ui, options) {
      var helper = eventIconsPainterHelper(iconOpts, drawable, timeAxis, lanes, ui, options);
      return function(gl, viewport) {
        gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
        gl.enable(webglext2.GL.BLEND);
        helper.textureRenderer.begin(gl, viewport);
        for (var l = 0; l < lanes.length; l++) {
          var lane = lanes.lane(l);
          for (var e = 0; e < lane.length; e++) {
            helper.paintEvent(l, e, gl, viewport);
          }
        }
        helper.textureRenderer.end(gl);
      };
    };
  }
  webglext2.newEventIconsPainterFactory = newEventIconsPainterFactory;
  function calculateTextWidth(textEnabled, labelText, fgColor, textDefaultColor, textTextures, viewport) {
    var wText = 0;
    var textTexture;
    if (textEnabled && labelText) {
      var textColor = webglext2.isNotEmpty(fgColor) ? fgColor : textDefaultColor;
      textTexture = textTextures.value(textColor.rgbaString, labelText);
      wText = textTexture.w / viewport.w;
    }
    return {
      wText,
      textTexture
    };
  }
  function eventLabelsPainterHelper(labelOpts, drawable, timeAxis, lanes, ui, options) {
    var rowTopPadding = options.rowTopPadding;
    var rowBottomPadding = options.rowBottomPadding;
    var laneHeight = options.laneHeight;
    var topMargin = webglext2.isNotEmpty(labelOpts) && webglext2.isNotEmpty(labelOpts.topMargin) ? labelOpts.topMargin : 1.2;
    var bottomMargin = webglext2.isNotEmpty(labelOpts) && webglext2.isNotEmpty(labelOpts.bottomMargin) ? labelOpts.bottomMargin : 1.2;
    var leftMargin = webglext2.isNotEmpty(labelOpts) && webglext2.isNotEmpty(labelOpts.leftMargin) ? labelOpts.leftMargin : 4;
    var rightMargin = webglext2.isNotEmpty(labelOpts) && webglext2.isNotEmpty(labelOpts.rightMargin) ? labelOpts.rightMargin : 4;
    var vAlign = webglext2.isNotEmpty(labelOpts) && webglext2.isNotEmpty(labelOpts.vAlign) ? labelOpts.vAlign : 0.5;
    var spacing = webglext2.isNotEmpty(labelOpts) && webglext2.isNotEmpty(labelOpts.spacing) ? labelOpts.spacing : 3;
    var extendBeyondBar = webglext2.isNotEmpty(labelOpts) && webglext2.isNotEmpty(labelOpts.extendBeyondBar) ? labelOpts.extendBeyondBar : false;
    var textMode = webglext2.isNotEmpty(labelOpts) && webglext2.isNotEmpty(labelOpts.textMode) ? labelOpts.textMode : "force";
    var iconsEnabled = webglext2.isNotEmpty(labelOpts) && webglext2.isNotEmpty(labelOpts.iconsEnabled) ? labelOpts.iconsEnabled : true;
    var iconsForceWidth = webglext2.isNotEmpty(labelOpts) && webglext2.isNotEmpty(labelOpts.iconsForceWidth) ? labelOpts.iconsForceWidth : "auto";
    var iconsForceHeight = webglext2.isNotEmpty(labelOpts) && webglext2.isNotEmpty(labelOpts.iconsForceHeight) ? labelOpts.iconsForceHeight : "auto";
    var iconsSizeFactor = webglext2.isNotEmpty(labelOpts) && webglext2.isNotEmpty(labelOpts.iconsSizeFactor) ? labelOpts.iconsSizeFactor : 1;
    var textEnabled = webglext2.isNotEmpty(labelOpts) && webglext2.isNotEmpty(labelOpts.textEnabled) ? labelOpts.textEnabled : true;
    var textDefaultColor = webglext2.isNotEmpty(labelOpts) && webglext2.isNotEmpty(labelOpts.textDefaultColor) ? labelOpts.textDefaultColor : options.timelineFgColor;
    var textFont = webglext2.isNotEmpty(labelOpts) && webglext2.isNotEmpty(labelOpts.textFont) ? labelOpts.textFont : options.timelineFont;
    var iconTextures = {};
    var textTextures = webglext2.newTextTextureCache2(textFont);
    var textureRenderer = new webglext2.TextureRenderer();
    return {
      textTextures,
      textureRenderer,
      paintEvent: function(laneIndex, eventIndex, gl, viewport) {
        var lane = lanes.lane(laneIndex);
        var event = lane.event(eventIndex);
        var labelTopMargin = webglext2.isNotEmpty(event.labelTopMargin) ? event.labelTopMargin : topMargin;
        var labelBottomMargin = webglext2.isNotEmpty(event.labelBottomMargin) ? event.labelBottomMargin : bottomMargin;
        var labelVAlign = webglext2.isNotEmpty(event.labelVAlign) ? event.labelVAlign : vAlign;
        var labelVPos = webglext2.isNotEmpty(event.labelVPos) ? event.labelVPos : labelVAlign;
        var labelHAlign = webglext2.isNotEmpty(event.labelHAlign) ? event.labelHAlign : 0;
        var labelHPos = webglext2.isNotEmpty(event.labelHPos) ? event.labelHPos : labelHAlign;
        var jTop = rowTopPadding + laneIndex * laneHeight + labelTopMargin;
        var yFrac = (viewport.h - jTop - (1 - labelVAlign) * (laneHeight - labelTopMargin - labelBottomMargin)) / viewport.h;
        var xLeftMin = 2 / viewport.w;
        var xRightMax = (viewport.w - 2) / viewport.w;
        var wLeftIndent = leftMargin / viewport.w;
        var wRightIndent = rightMargin / viewport.w;
        var xStart = timeAxis.tFrac(event.start_PMILLIS);
        var xEnd = timeAxis.tFrac(event.end_PMILLIS);
        var wTotal = xEnd - wRightIndent - (xStart + wLeftIndent);
        var wSpacing = spacing / viewport.w;
        if (!(xEnd <= 0 || xStart > 1)) {
          var xLeft;
          var xRight;
          if (extendBeyondBar) {
            if (eventIndex + 1 < lane.length) {
              var nextEvent = lane.event(eventIndex + 1);
              var nextStart_PMILLIS = webglext2.effectiveEdges_PMILLIS(ui, nextEvent)[0];
              xRight = timeAxis.tFrac(nextStart_PMILLIS);
            } else {
              xRight = xRightMax;
            }
            if (eventIndex - 1 >= 0) {
              var previousEvent = lane.event(eventIndex - 1);
              var previousEnd_PMILLIS = webglext2.effectiveEdges_PMILLIS(ui, previousEvent)[1];
              xLeft = timeAxis.tFrac(previousEnd_PMILLIS);
            } else {
              xLeft = xLeftMin;
            }
          } else {
            xRight = xEnd;
            xLeft = xStart;
          }
          var calculatedTextWidth = calculateTextWidth(textEnabled, event.label, event.fgColor, textDefaultColor, textTextures, viewport);
          var wText = calculatedTextWidth.wText;
          var textTexture = calculatedTextWidth.textTexture;
          var wIcon = 0;
          var wIconPlusSpacing = 0;
          var iconWidth;
          var iconHeight;
          var iconTexture;
          if (iconsEnabled && event.labelIcon) {
            iconTexture = iconTextures[event.labelIcon];
            if (webglext2.isNotEmpty(iconTexture)) {
              iconWidth = webglext2.isNumber(iconsForceWidth) ? iconsForceWidth : iconsForceWidth === "imageSize" ? iconTexture.w : null;
              iconHeight = webglext2.isNumber(iconsForceHeight) ? iconsForceHeight : iconsForceHeight === "imageSize" ? iconTexture.h : null;
              var wIconKnown = webglext2.isNotEmpty(iconWidth);
              var hIconKnown = webglext2.isNotEmpty(iconHeight);
              if (!wIconKnown && !hIconKnown) {
                iconHeight = Math.round(iconsSizeFactor * (laneHeight - labelTopMargin - labelBottomMargin));
                iconWidth = iconTexture.w * iconHeight / iconTexture.h;
              } else if (!wIconKnown) {
                iconHeight = Math.round(iconsSizeFactor * iconHeight);
                iconWidth = iconTexture.w * iconHeight / iconTexture.h;
              } else if (!hIconKnown) {
                iconWidth = Math.round(iconsSizeFactor * iconWidth);
                iconHeight = iconTexture.h * iconWidth / iconTexture.w;
              } else {
                iconWidth = Math.round(iconsSizeFactor * iconWidth);
                iconHeight = Math.round(iconsSizeFactor * iconHeight);
              }
              wIcon = iconWidth / viewport.w;
              wIconPlusSpacing = wIcon + wSpacing;
            } else if (iconTexture !== null) {
              iconTextures[event.labelIcon] = null;
              var image = new Image();
              image.onload = function(url, img) {
                return function() {
                  var wImage = img.naturalWidth;
                  var hImage = img.naturalHeight;
                  iconTextures[url] = new webglext2.Texture2D(wImage, hImage, webglext2.GL.LINEAR, webglext2.GL.LINEAR, function(g) {
                    g.drawImage(img, 0, 0);
                  });
                  drawable.redraw();
                };
              }(event.labelIcon, image);
              image.src = event.labelIcon;
            }
          }
          var xStartLabel = xStart + wLeftIndent - (wSpacing + wIcon + wText) * labelHPos + wTotal * labelHAlign;
          var xEndLabel = xStartLabel + (wSpacing + wIcon + wText);
          if (xStartLabel < xLeftMin) {
            xStartLabel = xLeftMin;
            xEndLabel = xStartLabel + (wSpacing + wIcon + wText);
          } else if (xEndLabel > xRightMax) {
            xEndLabel = xRightMax;
            xStartLabel = xEndLabel - (wSpacing + wIcon + wText);
          }
          if (textMode === "truncate") {
            var labelText = event.label;
            while (!!labelText && labelText !== "...") {
              if (xEndLabel > xRight || xStartLabel < xLeft) {
                labelText = labelText.substring(0, labelText.length - 4).concat("...");
                var calculatedTextWidth = calculateTextWidth(textEnabled, labelText, event.fgColor, textDefaultColor, textTextures, viewport);
                wText = calculatedTextWidth.wText;
                textTexture = calculatedTextWidth.textTexture;
                xStartLabel = xStart + wLeftIndent - (wSpacing + wIcon + wText) * labelHPos + wTotal * labelHAlign;
                xEndLabel = xStartLabel + (wSpacing + wIcon + wText);
                if (xStartLabel < xLeftMin) {
                  xStartLabel = xLeftMin;
                  xEndLabel = xStartLabel + (wSpacing + wIcon + wText);
                } else if (xEndLabel > xRightMax) {
                  xEndLabel = xRightMax;
                  xStartLabel = xEndLabel - (wSpacing + wIcon + wText);
                }
              } else {
                break;
              }
            }
            if (!labelText || labelText === "...") {
              wText = 0;
              textTexture = null;
            }
          } else if (textMode === "show") {
            if (xEndLabel > xRight || xStartLabel < xLeft) {
              wText = 0;
              textTexture = null;
              var xStartLabel = xStart + wLeftIndent - wIcon * labelHPos + wTotal * labelHAlign;
              var xEndLabel = xStartLabel + wIcon;
              if (xStartLabel < xLeftMin) {
                xStartLabel = xLeftMin;
                xEndLabel = xStartLabel + wIcon;
              } else if (xEndLabel > xRightMax) {
                xEndLabel = xRightMax;
                xStartLabel = xEndLabel - wIcon;
              }
              if (xEndLabel > xRight || xStartLabel < xLeft) {
                wIcon = 0;
                iconTexture = null;
              }
            }
          }
          if (webglext2.isNotEmpty(iconTexture)) {
            var xStartLabel = xStart + wLeftIndent - (wSpacing + wIcon + wText) * labelHPos + wTotal * labelHAlign;
            var xEndLabel = xStartLabel + (wSpacing + wIcon + wText);
            if (xStartLabel < xLeftMin) {
              textureRenderer.draw(gl, iconTexture, xLeftMin, yFrac, { xAnchor: 0, yAnchor: labelVPos, width: iconWidth, height: iconHeight });
            } else if (xEndLabel > xRightMax) {
              textureRenderer.draw(gl, iconTexture, xRightMax - wSpacing - wText, yFrac, { xAnchor: 1, yAnchor: labelVPos, width: iconWidth, height: iconHeight });
            } else {
              var xFrac = xStart + wLeftIndent - (wSpacing + wText) * labelHPos + wTotal * labelHAlign;
              textureRenderer.draw(gl, iconTexture, xFrac, yFrac, { xAnchor: labelHPos, yAnchor: labelVPos, width: iconWidth, height: iconHeight });
            }
          }
          if (webglext2.isNotEmpty(textTexture)) {
            var xStartLabel = xStart + wLeftIndent - (wSpacing + wIcon + wText) * labelHPos + wTotal * labelHAlign;
            var xEndLabel = xStartLabel + (wSpacing + wIcon + wText);
            if (xStartLabel < xLeftMin) {
              textureRenderer.draw(gl, textTexture, xLeftMin + wSpacing + wIcon, yFrac, { xAnchor: 0, yAnchor: textTexture.yAnchor(labelVPos) });
            } else if (xEndLabel > xRightMax) {
              textureRenderer.draw(gl, textTexture, xRightMax, yFrac, { xAnchor: 1, yAnchor: textTexture.yAnchor(labelVPos) });
            } else {
              var xFrac = xStart + wLeftIndent + wIconPlusSpacing * (1 - labelHPos) + wTotal * labelHAlign;
              textureRenderer.draw(gl, textTexture, xFrac, yFrac, { xAnchor: labelHPos, yAnchor: textTexture.yAnchor(labelVPos) });
            }
          }
        }
      }
    };
  }
  function newEventLabelsPainterFactory(labelOpts) {
    return function(drawable, timeAxis, lanes, ui, options) {
      var helper = eventLabelsPainterHelper(labelOpts, drawable, timeAxis, lanes, ui, options);
      return function(gl, viewport) {
        gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
        gl.enable(webglext2.GL.BLEND);
        helper.textTextures.resetTouches();
        helper.textureRenderer.begin(gl, viewport);
        for (var l = 0; l < lanes.length; l++) {
          var lane = lanes.lane(l);
          for (var e = 0; e < lane.length; e++) {
            helper.paintEvent(l, e, gl, viewport);
          }
        }
        helper.textureRenderer.end(gl);
        helper.textTextures.retainTouched();
      };
    };
  }
  webglext2.newEventLabelsPainterFactory = newEventLabelsPainterFactory;
  function eventBarPainterHelper(barOpts, drawable, timeAxis, lanes, ui, options) {
    var rowTopPadding = options.rowTopPadding;
    var rowBottomPadding = options.rowBottomPadding;
    var laneHeight = options.laneHeight;
    var topMargin = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.topMargin) ? barOpts.topMargin : 1.2;
    var bottomMargin = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.bottomMargin) ? barOpts.bottomMargin : 1.2;
    var borderThickness = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.borderThickness) ? barOpts.borderThickness : 4;
    var cornerType = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.cornerType) ? barOpts.cornerType : JointType.BEVEL;
    var defaultColor = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.defaultColor) ? barOpts.defaultColor : options.timelineFgColor.withAlphaTimes(0.4);
    var defaultBorderColor = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.defaultBorderColor) ? barOpts.defaultBorderColor : null;
    var selectedBorderColor = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.selectedBorderColor) ? barOpts.selectedBorderColor : options.timelineFgColor;
    var minimumVisibleWidth = webglext2.isNotEmpty(barOpts) && webglext2.isNotEmpty(barOpts.minimumVisibleWidth) ? barOpts.minimumVisibleWidth : 0;
    var selection = ui.selection;
    var xyFrac_vColor_VERTSHADER = webglext2.concatLines("                                                                ", "  attribute vec2 a_XyFrac;                                      ", "  attribute vec4 a_Color;                                       ", "                                                                ", "  varying vec4 v_Color;                                         ", "                                                                ", "  void main( ) {                                                ", "      gl_Position = vec4( ( -1.0 + 2.0*a_XyFrac ), 0.0, 1.0 );  ", "      v_Color = a_Color;                                        ", "  }                                                             ", "                                                                ");
    var program = new webglext2.Program(xyFrac_vColor_VERTSHADER, webglext2.varyingColor_FRAGSHADER);
    var a_XyFrac = new webglext2.Attribute(program, "a_XyFrac");
    var a_Color = new webglext2.Attribute(program, "a_Color");
    var xys = new Float32Array(0);
    var xysBuffer = webglext2.newDynamicBuffer();
    var rgbas = new Float32Array(0);
    var rgbasBuffer = webglext2.newDynamicBuffer();
    return {
      paint: function(indexXys, indexRgbas, gl, viewport) {
        if (indexXys == 0 || indexRgbas == 0)
          return;
        gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
        gl.enable(webglext2.GL.BLEND);
        program.use(gl);
        xysBuffer.setData(xys.subarray(0, indexXys));
        a_XyFrac.setDataAndEnable(gl, xysBuffer, 2, webglext2.GL.FLOAT);
        rgbasBuffer.setData(rgbas.subarray(0, indexRgbas));
        a_Color.setDataAndEnable(gl, rgbasBuffer, 4, webglext2.GL.FLOAT);
        gl.drawArrays(webglext2.GL.TRIANGLES, 0, Math.floor(indexXys / 2));
        a_Color.disable(gl);
        a_XyFrac.disable(gl);
        program.endUse(gl);
      },
      ensureCapacity: function(eventCount) {
        var numVertices;
        switch (cornerType) {
          case JointType.BEVEL:
            numVertices = (6 * 5 + 3 * 4) * eventCount;
            break;
          default:
            numVertices = 6 * 5 * eventCount;
            break;
        }
        xys = webglext2.ensureCapacityFloat32(xys, 2 * numVertices);
        rgbas = webglext2.ensureCapacityFloat32(rgbas, 4 * numVertices);
      },
      fillEvent: function(laneIndex, eventIndex, indexXys, indexRgbas, viewport) {
        var lane = lanes.lane(laneIndex);
        var event = lane.event(eventIndex);
        var wBorder = borderThickness / viewport.w;
        var hBorder = borderThickness / viewport.h;
        var _topMargin = webglext2.isNotEmpty(event.topMargin) ? event.topMargin : topMargin;
        var _bottomMargin = webglext2.isNotEmpty(event.bottomMargin) ? event.bottomMargin : bottomMargin;
        var jTop = rowTopPadding + laneIndex * laneHeight + _topMargin;
        var yTop = (viewport.h - jTop) / viewport.h;
        var jBottom = rowTopPadding + (laneIndex + 1) * laneHeight - _bottomMargin;
        var yBottom = (viewport.h - jBottom) / viewport.h;
        var xLeft = timeAxis.tFrac(event.start_PMILLIS);
        var xRight = timeAxis.tFrac(event.end_PMILLIS);
        var xWidthPixels = viewport.w * (xRight - xLeft);
        if (!(xRight < 0 || xLeft > 1) && xWidthPixels > minimumVisibleWidth) {
          var fillColor = event.bgColor || defaultColor;
          if (event === selection.hoveredEvent.value) {
            fillColor = webglext2.darker(fillColor, 0.8);
          }
          indexXys = webglext2.putQuadXys(xys, indexXys, xLeft + wBorder, xRight - wBorder, yTop - hBorder, yBottom + hBorder);
          indexRgbas = webglext2.putQuadRgbas(rgbas, indexRgbas, fillColor);
          var borderColor = event.borderColor || (event.bgColor ? fillColor : null) || defaultBorderColor || fillColor;
          if (selection.selectedEvents.hasValue(event)) {
            borderColor = selectedBorderColor;
          }
          if (borderColor) {
            switch (cornerType) {
              case JointType.BEVEL:
                indexXys = webglext2.putQuadXys(xys, indexXys, xLeft, xLeft + wBorder, yTop - hBorder, yBottom + hBorder);
                indexXys = webglext2.putQuadXys(xys, indexXys, xRight - wBorder, xRight, yTop - hBorder, yBottom + hBorder);
                indexXys = webglext2.putQuadXys(xys, indexXys, xLeft + wBorder, xRight - wBorder, yTop, yTop - hBorder);
                indexXys = webglext2.putQuadXys(xys, indexXys, xLeft + wBorder, xRight - wBorder, yBottom + hBorder, yBottom);
                indexRgbas = webglext2.putRgbas(rgbas, indexRgbas, borderColor, 24);
                indexXys = webglext2.putLowerLeftTriangleXys(xys, indexXys, xRight - wBorder, xRight, yTop, yTop - hBorder);
                indexXys = webglext2.putUpperLeftTriangleXys(xys, indexXys, xRight - wBorder, xRight, yBottom + hBorder, yBottom);
                indexXys = webglext2.putUpperRightTriangleXys(xys, indexXys, xLeft, xLeft + wBorder, yBottom + hBorder, yBottom);
                indexXys = webglext2.putLowerRightTriangleXys(xys, indexXys, xLeft, xLeft + wBorder, yTop, yTop - hBorder);
                indexRgbas = webglext2.putRgbas(rgbas, indexRgbas, borderColor, 12);
                break;
              default:
                indexXys = webglext2.putQuadXys(xys, indexXys, xLeft, xRight - wBorder, yTop, yTop - hBorder);
                indexXys = webglext2.putQuadXys(xys, indexXys, xRight - wBorder, xRight, yTop, yBottom + hBorder);
                indexXys = webglext2.putQuadXys(xys, indexXys, xLeft + wBorder, xRight, yBottom + hBorder, yBottom);
                indexXys = webglext2.putQuadXys(xys, indexXys, xLeft, xLeft + wBorder, yTop - hBorder, yBottom);
                indexRgbas = webglext2.putRgbas(rgbas, indexRgbas, borderColor, 24);
                break;
            }
          }
        }
        return { indexXys, indexRgbas };
      }
    };
  }
  function newEventBarsPainterFactory(barOpts) {
    return function(drawable, timeAxis, lanes, ui, options) {
      var helper = eventBarPainterHelper(barOpts, drawable, timeAxis, lanes, ui, options);
      return function(gl, viewport) {
        helper.ensureCapacity(lanes.numEvents);
        var indexXys = 0;
        var indexRgbas = 0;
        for (var l = 0; l < lanes.length; l++) {
          var lane = lanes.lane(l);
          for (var e = 0; e < lane.length; e++) {
            var event = lane.event(e);
            var indexes = helper.fillEvent(l, e, indexXys, indexRgbas, viewport);
            indexXys = indexes.indexXys;
            indexRgbas = indexes.indexRgbas;
          }
        }
        helper.paint(indexXys, indexRgbas, gl, viewport);
      };
    };
  }
  webglext2.newEventBarsPainterFactory = newEventBarsPainterFactory;
  function newCombinedEventPainterFactory(barOpts, labelOpts, iconOpts) {
    return function(drawable, timeAxis, lanes, ui, options) {
      var labelHelper = eventLabelsPainterHelper(labelOpts, drawable, timeAxis, lanes, ui, options);
      var iconHelper = eventIconsPainterHelper(iconOpts, drawable, timeAxis, lanes, ui, options);
      var barHelper = eventStripedBarPainterHelper(barOpts, drawable, timeAxis, lanes, ui, options);
      var dashedHelper = eventDashedBorderPainterHelper(barOpts, drawable, timeAxis, lanes, ui, options);
      return function(gl, viewport) {
        gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
        gl.enable(webglext2.GL.BLEND);
        for (var l = 0; l < lanes.length; l++) {
          var lane = lanes.lane(l);
          for (var e = 0; e < lane.length; e++) {
            barHelper.ensureCapacity(1);
            var indexes = barHelper.fillEvent(l, e, 0, 0, viewport, 0, 0);
            var dashedIndexes = dashedHelper.fillEvent(l, e, 0, 0, viewport, 0);
            barHelper.paint(indexes.indexXys, indexes.indexRgbas, gl, viewport, indexes.indexRelativeXys, indexes.indexFillPattern);
            dashedHelper.paint(dashedIndexes.indexXys, dashedIndexes.indexRgbas, gl, viewport, dashedIndexes.indexLengthSoFar);
            labelHelper.textTextures.resetTouches();
            labelHelper.textureRenderer.begin(gl, viewport);
            labelHelper.paintEvent(l, e, gl, viewport);
            labelHelper.textureRenderer.end(gl);
            labelHelper.textTextures.retainTouched();
            iconHelper.textureRenderer.begin(gl, viewport);
            iconHelper.paintEvent(l, e, gl, viewport);
            iconHelper.textureRenderer.end(gl);
          }
        }
      };
    };
  }
  webglext2.newCombinedEventPainterFactory = newCombinedEventPainterFactory;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function newTimeseriesRowPaneFactory(rowOptions) {
    return function(drawable, timeAxis, dataAxis, model, row, ui, options) {
      var rowTopPadding = webglext2.isNotEmpty(rowOptions) && webglext2.isNotEmpty(rowOptions.rowTopPadding) ? rowOptions.rowTopPadding : 6;
      var rowBottomPadding = webglext2.isNotEmpty(rowOptions) && webglext2.isNotEmpty(rowOptions.rowBottomPadding) ? rowOptions.rowBottomPadding : 6;
      var axisWidth = webglext2.isNotEmpty(rowOptions) && webglext2.isNotEmpty(rowOptions.axisWidth) ? rowOptions.axisWidth : 60;
      var painterFactories = webglext2.isNotEmpty(rowOptions) && webglext2.isNotEmpty(rowOptions.painterFactories) ? rowOptions.painterFactories : [];
      var axisOptions = webglext2.isNotEmpty(rowOptions) && webglext2.isNotEmpty(rowOptions.axisOptions) ? rowOptions.axisOptions : {};
      var keyPrefix = options.isMaximized ? "maximized-" : "";
      var getRowHeight = function() {
        if (options.isMaximized) {
          return null;
        } else if (webglext2.isNotEmpty(row.rowHeight)) {
          return row.rowHeight;
        } else if (webglext2.isNotEmpty(rowOptions) && webglext2.isNotEmpty(rowOptions.rowHeight)) {
          return rowOptions.rowHeight;
        } else {
          return 135;
        }
      };
      var rowHeight = getRowHeight();
      var timelineFont = options.timelineFont;
      var timelineFgColor = options.timelineFgColor;
      var draggableEdgeWidth = options.draggableEdgeWidth;
      var snapToDistance = options.snapToDistance;
      var rowUi = ui.rowUi(row.rowGuid);
      var input = ui.input;
      var selection = ui.selection;
      if (!webglext2.isNotEmpty(axisOptions.font))
        axisOptions.font = timelineFont;
      if (!webglext2.isNotEmpty(axisOptions.tickColor))
        axisOptions.tickColor = timelineFgColor;
      if (!webglext2.isNotEmpty(axisOptions.textColor))
        axisOptions.textColor = timelineFgColor;
      if (!webglext2.isNotEmpty(axisOptions.showLabel))
        axisOptions.showLabel = true;
      if (!webglext2.isNotEmpty(axisOptions.shortenLabels))
        axisOptions.shortenLabels = false;
      var redraw = function() {
        drawable.redraw();
      };
      var yAxisPane = new webglext2.Pane({ updatePrefSize: webglext2.fixedSize(axisWidth, rowHeight) });
      dataAxis.limitsChanged.on(redraw);
      webglext2.attachAxisMouseListeners1D(yAxisPane, dataAxis, true);
      var updateRowHeight = function() {
        yAxisPane.layout = { updatePrefSize: webglext2.fixedSize(axisWidth, getRowHeight()) };
      };
      row.attrsChanged.on(updateRowHeight);
      var underlayPane = new webglext2.Pane(webglext2.newOverlayLayout(), false);
      var overlayPane = new webglext2.Pane(null, false);
      var painterOptions = { timelineFont, timelineFgColor, timelineThickness: 1, rowTopPadding, rowBottomPadding };
      yAxisPane.addPainter(webglext2.newEdgeAxisPainter(dataAxis, webglext2.Side.RIGHT, axisOptions));
      rowUi.addPane(keyPrefix + "overlay", overlayPane);
      rowUi.addPane(keyPrefix + "underlay", underlayPane);
      rowUi.addPane(keyPrefix + "y-axis", yAxisPane);
      row.timeseriesGuids.valueAdded.on(redraw);
      row.timeseriesGuids.valueMoved.on(redraw);
      row.timeseriesGuids.valueRemoved.on(redraw);
      var timeAtCoords_PMILLIS = function(viewport, i) {
        return timeAxis.tAtFrac_PMILLIS(viewport.xFrac(i));
      };
      var timeAtPointer_PMILLIS = function(ev) {
        return timeAtCoords_PMILLIS(ev.paneViewport, ev.i);
      };
      var timeseriesDragMode = null;
      var recentMouseMove = null;
      var uiMillisPerPxChanged = function() {
        if (!webglext2.isNotEmpty(timeseriesDragMode) && recentMouseMove != null) {
          var ev = recentMouseMove;
          input.timeHover.fire(timeAtPointer_PMILLIS(ev), ev);
        }
      };
      ui.millisPerPx.changed.on(uiMillisPerPxChanged);
      selection.hoveredAnnotation.changed.on(redraw);
      overlayPane.mouseExit.on(function() {
        selection.hoveredY.value = void 0;
        selection.hoveredAnnotation.value = null;
      });
      return underlayPane;
    };
  }
  webglext2.newTimeseriesRowPaneFactory = newTimeseriesRowPaneFactory;
  function newTimeseriesPainterFactory(options) {
    return function(drawable, timeAxis, dataAxis, model, rowModel, ui) {
      var selection = ui.selection;
      var defaultColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.timelineFgColor) ? options.timelineFgColor : webglext2.white;
      var defaultThickness = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.timelineThickness) ? options.timelineThickness : 1;
      var modelview_pointsize_VERTSHADER = webglext2.concatLines("    uniform mat4 u_modelViewMatrix;                       ", "    attribute vec4 a_Position;                            ", "    uniform float u_PointSize;                            ", "                                                          ", "    void main( ) {                                        ", "        gl_PointSize = u_PointSize ;                      ", "        gl_Position = u_modelViewMatrix * a_Position ;    ", "    }                                                     ", "                                                          ");
      var program = new webglext2.Program(modelview_pointsize_VERTSHADER, webglext2.solid_FRAGSHADER);
      var u_Color = new webglext2.UniformColor(program, "u_Color");
      var u_modelViewMatrix = new webglext2.UniformMatrix4f(program, "u_modelViewMatrix");
      var a_Position = new webglext2.Attribute(program, "a_Position");
      var u_PointSize = new webglext2.Uniform1f(program, "u_PointSize");
      var axis = new webglext2.Axis2D(timeAxis, dataAxis);
      var xys = new Float32Array(0);
      var xysBuffer = webglext2.newDynamicBuffer();
      return function(gl, viewport) {
        gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
        gl.enable(webglext2.GL.BLEND);
        program.use(gl);
        u_modelViewMatrix.setData(gl, webglext2.glOrthoAxis(axis));
        a_Position.disable(gl);
        program.endUse(gl);
      };
    };
  }
  webglext2.newTimeseriesPainterFactory = newTimeseriesPainterFactory;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  webglext2.timeseriesRowPainterFactories_DEFAULT = [
    webglext2.newTimeseriesPainterFactory()
  ];
  webglext2.eventsRowPaneFactory_DEFAULT = webglext2.newEventsRowPaneFactory({
    laneHeight: 40,
    painterFactories: [
      webglext2.newEventLimitsPainterFactory(),
      webglext2.newEventBarsPainterFactory(),
      webglext2.newEventIconsPainterFactory(),
      webglext2.newEventLabelsPainterFactory({
        iconsSizeFactor: 0.7
      })
    ]
  });
  webglext2.timeseriesRowPaneFactory_DEFAULT = webglext2.newTimeseriesRowPaneFactory({
    painterFactories: webglext2.timeseriesRowPainterFactories_DEFAULT,
    axisOptions: { tickSpacings: 34 }
  });
  function rowPaneFactoryChooser_DEFAULT(row) {
    if (!row.eventGuids.isEmpty) {
      return webglext2.eventsRowPaneFactory_DEFAULT;
    } else if (!row.timeseriesGuids.isEmpty) {
      return webglext2.timeseriesRowPaneFactory_DEFAULT;
    } else {
      return webglext2.eventsRowPaneFactory_DEFAULT;
    }
  }
  webglext2.rowPaneFactoryChooser_DEFAULT = rowPaneFactoryChooser_DEFAULT;
  webglext2.eventsRowPaneFactory_THIN = webglext2.newEventsRowPaneFactory({
    rowTopPadding: 0,
    rowBottomPadding: 0,
    laneHeight: 23,
    allowMultipleLanes: true,
    painterFactories: [
      webglext2.newEventLimitsPainterFactory({
        lineColor: new webglext2.Color(1, 0, 0, 1),
        lineThickness: 2
      }),
      webglext2.newEventStripedBarsPainterFactory({
        bottomMargin: 0,
        topMargin: 13,
        minimumVisibleWidth: 0,
        stripeSlant: -1,
        stripeSecondaryWidth: 10,
        stripeWidth: 10
      }),
      webglext2.newEventDashedBordersPainterFactory({
        bottomMargin: 0,
        topMargin: 13,
        minimumVisibleWidth: 0,
        cornerType: webglext2.JointType.MITER,
        dashLength: 5
      }),
      webglext2.newEventIconsPainterFactory({
        bottomMargin: 0,
        topMargin: 13,
        vAlign: 0
      }),
      webglext2.newEventLabelsPainterFactory({
        bottomMargin: 12,
        topMargin: 0,
        leftMargin: 2,
        rightMargin: 2,
        vAlign: 0,
        spacing: 2,
        extendBeyondBar: false,
        textMode: "truncate"
      })
    ]
  });
  function rowPaneFactoryChooser_THIN(row) {
    if (!row.eventGuids.isEmpty) {
      return webglext2.eventsRowPaneFactory_THIN;
    } else if (!row.timeseriesGuids.isEmpty) {
      return webglext2.timeseriesRowPaneFactory_DEFAULT;
    } else {
      return null;
    }
  }
  webglext2.rowPaneFactoryChooser_THIN = rowPaneFactoryChooser_THIN;
  webglext2.eventsRowPaneFactory_SINGLE = webglext2.newEventsRowPaneFactory({
    rowTopPadding: 0,
    rowBottomPadding: 0,
    laneHeight: 23,
    allowMultipleLanes: false,
    painterFactories: [
      webglext2.newEventLimitsPainterFactory({
        lineColor: new webglext2.Color(1, 0, 0, 1),
        lineThickness: 2
      }),
      webglext2.newCombinedEventPainterFactory({
        bottomMargin: 0,
        topMargin: 13,
        minimumVisibleWidth: 0,
        cornerType: webglext2.JointType.MITER
      }, {
        bottomMargin: 12,
        topMargin: 0,
        leftMargin: 2,
        rightMargin: 2,
        vAlign: 0,
        spacing: 2,
        extendBeyondBar: false,
        textMode: "show"
      }, {
        bottomMargin: 0,
        topMargin: 13,
        vAlign: 0
      })
    ]
  });
  function rowPaneFactoryChooser_SINGLE(row) {
    if (!row.eventGuids.isEmpty) {
      return webglext2.eventsRowPaneFactory_SINGLE;
    } else if (!row.timeseriesGuids.isEmpty) {
      return webglext2.timeseriesRowPaneFactory_DEFAULT;
    } else {
      return null;
    }
  }
  webglext2.rowPaneFactoryChooser_SINGLE = rowPaneFactoryChooser_SINGLE;
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  var TimelinePane = function(_super) {
    __extends(TimelinePane2, _super);
    function TimelinePane2(layout, model, ui) {
      var _this = _super.call(this, layout, true) || this;
      _this._model = model;
      _this._ui = ui;
      return _this;
    }
    Object.defineProperty(TimelinePane2.prototype, "model", {
      get: function() {
        return this._model;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(TimelinePane2.prototype, "ui", {
      get: function() {
        return this._ui;
      },
      enumerable: false,
      configurable: true
    });
    return TimelinePane2;
  }(webglext2.Pane);
  webglext2.TimelinePane = TimelinePane;
  function newTimelinePane(drawable, timeAxis, model, options, ui) {
    var font = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.font) ? options.font : "12px sans-serif";
    var rowPaneFactoryChooser = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.rowPaneFactoryChooser) ? options.rowPaneFactoryChooser : webglext2.rowPaneFactoryChooser_DEFAULT;
    var showScrollbar = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.showScrollbar) ? options.showScrollbar : true;
    var scrollbarOptions = webglext2.isNotEmpty(options) ? options.scrollbarOptions : null;
    var fgColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.fgColor) ? options.fgColor : webglext2.white;
    var bgColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.bgColor) ? options.bgColor : webglext2.rgb(0.098, 0.165, 0.243);
    var rowLabelColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.rowLabelColor) ? options.rowLabelColor : fgColor;
    var rowLabelBgColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.rowLabelBgColor) ? options.rowLabelBgColor : bgColor;
    var groupLabelColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.groupLabelColor) ? options.groupLabelColor : fgColor;
    var axisLabelColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.axisLabelColor) ? options.axisLabelColor : fgColor;
    var rowBgColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.rowBgColor) ? options.rowBgColor : webglext2.rgb(0.02, 0.086, 0.165);
    var rowAltBgColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.rowAltBgColor) ? options.rowAltBgColor : webglext2.rgb(0.02, 0.086, 0.165);
    var rowBorderColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.rowBorderColor) ? options.rowBorderColor : webglext2.rgb(0.12, 0.46, 0.165);
    var gridColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.gridColor) ? options.gridColor : webglext2.gray(0.5);
    var selectedIntervalFillColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.selectedIntervalFillColor) ? options.selectedIntervalFillColor : webglext2.rgba(0, 0.6, 0.8, 0.157);
    var selectedIntervalBorderColor = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.selectedIntervalBorderColor) ? options.selectedIntervalBorderColor : webglext2.rgb(0, 0.2, 1);
    var showTopAxis = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.showTopAxis) ? options.showTopAxis : true;
    var showBottomAxis = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.showBottomAxis) ? options.showBottomAxis : true;
    var tickSpacings = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.tickSpacings) ? options.tickSpacings : 60;
    var axisLabelAlign = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.axisLabelAlign) ? options.axisLabelAlign : 0.5;
    showTopAxis = true;
    var groupLabelInsets = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.groupLabelInsets) ? options.groupLabelInsets : webglext2.newInsets(6, 10);
    var rowLabelInsets = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.rowLabelInsets) ? options.rowLabelInsets : webglext2.newInsets(0, 0, 0, 20);
    var rowLabelPaneWidth = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.rowLabelPaneWidth) ? options.rowLabelPaneWidth : 70;
    var rowSeparatorHeight = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.rowSeparatorHeight) ? options.rowSeparatorHeight : 2;
    var scrollbarWidth = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.scrollbarWidth) ? options.scrollbarWidth : 16;
    scrollbarWidth = showScrollbar ? scrollbarWidth : 0;
    var axisPaneHeight = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.axisPaneHeight) ? options.axisPaneHeight : 40;
    var draggableEdgeWidth = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.draggableEdgeWidth) ? options.draggableEdgeWidth : 6;
    var snapToDistance = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.snapToDistance) ? options.snapToDistance : 10;
    var allowEventMultiSelection = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.allowEventMultiSelection) ? options.allowEventMultiSelection : true;
    var selectedIntervalMode = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.selectedIntervalMode) ? options.selectedIntervalMode : "range";
    var centerSelectedIntervalOnDoubleClick = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.centerSelectedIntervalOnDoubleClick) ? options.centerSelectedIntervalOnDoubleClick : true;
    var defaultMouseWheelListener = function(ev) {
      var zoomFactor = Math.pow(webglext2.axisZoomStep, ev.wheelSteps);
      timeAxis.tZoom(zoomFactor, timeAxis.vAtFrac(webglext2.xFrac(ev)));
    };
    var mouseWheelListener = webglext2.isNotEmpty(options) && webglext2.isNotEmpty(options.mouseWheelListener) ? options.mouseWheelListener : defaultMouseWheelListener;
    if (!ui) {
      var outsideManagedUi = false;
      ui = new webglext2.TimelineUi(model, { allowEventMultiSelection });
    } else {
      var outsideManagedUi = true;
      ui.panes.removeAll();
    }
    var selection = ui.selection;
    var redraw = function() {
      drawable.redraw();
    };
    selection.selectedInterval.changed.on(redraw);
    selection.hoveredEvent.changed.on(redraw);
    selection.selectedEvents.valueAdded.on(redraw);
    selection.selectedEvents.valueRemoved.on(redraw);
    selection.selectedRow.valueAdded.on(redraw);
    selection.selectedRow.valueRemoved.on(redraw);
    var redrawCursor = function() {
      if (!model.cursors.isEmpty) {
        drawable.redraw();
      }
    };
    selection.hoveredY.changed.on(redrawCursor);
    selection.hoveredTime_PMILLIS.changed.on(redrawCursor);
    var contentPaneOpts = {
      selectedIntervalMode,
      rowPaneFactoryChooser,
      font,
      fgColor,
      rowLabelColor,
      rowLabelBgColor,
      groupLabelColor,
      axisLabelColor,
      bgColor,
      rowBgColor,
      rowAltBgColor,
      gridColor,
      gridtickSpacings: tickSpacings,
      referenceDate: options.referenceDate,
      groupLabelInsets,
      rowLabelInsets,
      rowLabelPaneWidth,
      rowSeparatorHeight,
      draggableEdgeWidth,
      snapToDistance,
      rowBorderColor,
      mouseWheelListener
    };
    var contentPaneArgs;
    contentPaneArgs = { drawable, scrollLayout: null, timeAxis, model, ui, options: contentPaneOpts };
    var contentPane = newTimelineContentPane(contentPaneArgs);
    ui.addPane("content-pane", contentPane);
    var timelineCardPane = new webglext2.Pane(webglext2.newCardLayout());
    timelineCardPane.addPane(contentPane, true);
    var capsulelayPane = new webglext2.Pane(webglext2.newRowLayout());
    ui.addPane("main-pane", capsulelayPane);
    var axisInsets = webglext2.newInsets(0, scrollbarWidth, 0, rowLabelPaneWidth);
    var axisOpts = {
      tickSpacings,
      font,
      textColor: axisLabelColor,
      tickColor: axisLabelColor,
      labelAlign: axisLabelAlign,
      referenceDate: options.referenceDate,
      isFuturePositive: options.isFuturePositive
    };
    if (showTopAxis) {
      var topAxisPane = newTimeAxisPane(contentPaneArgs, null);
      ui.addPane("top-axis-pane", topAxisPane);
      topAxisPane.addPainter(webglext2.newTimeAxisPainter(timeAxis, webglext2.Side.TOP, axisOpts));
      capsulelayPane.addPane(webglext2.newInsetPane(topAxisPane, axisInsets), 0, { height: axisPaneHeight, width: null });
    }
    capsulelayPane.addPane(timelineCardPane, 1, { height: "pref-max", width: null });
    if (showBottomAxis) {
      var bottomAxisPane = newTimeAxisPane(contentPaneArgs, null);
      ui.addPane("bottom-axis-pane", bottomAxisPane);
      bottomAxisPane.addPainter(webglext2.newTimeAxisPainter(timeAxis, webglext2.Side.BOTTOM, axisOpts));
      capsulelayPane.addPane(webglext2.newInsetPane(bottomAxisPane, axisInsets), 2, { height: axisPaneHeight, width: null });
    }
    var updateMillisPerPx = function() {
      var w = capsulelayPane.viewport.w - axisInsets.left - axisInsets.right;
      ui.millisPerPx.value = timeAxis.tSize_MILLIS / w;
    };
    capsulelayPane.viewportChanged.on(updateMillisPerPx);
    timeAxis.limitsChanged.on(updateMillisPerPx);
    var timelinePane = new TimelinePane(webglext2.newOverlayLayout(), model, ui);
    ui.addPane("timeline-pane", timelinePane);
    timelinePane.addPainter(webglext2.newBackgroundPainter(bgColor));
    timelinePane.addPane(capsulelayPane, true);
    var overlayPane = new webglext2.Pane(null, false, webglext2.alwaysTrue);
    ui.addPane("overlay-pane", overlayPane);
    overlayPane.addPainter(newTimelineSingleSelectionPainter(timeAxis, selection.selectedInterval, selectedIntervalBorderColor, selectedIntervalFillColor));
    timelinePane.addPane(webglext2.newInsetPane(overlayPane, axisInsets, null, false));
    if (centerSelectedIntervalOnDoubleClick) {
      var doubleClick = function(ev) {
        if (ev.clickCount > 1) {
          var time_PMILLIS = timeAtPointer_PMILLIS(timeAxis, ev);
          selection.selectedInterval.setInterval(time_PMILLIS, time_PMILLIS);
        }
      };
      ui.input.mouseDown.on(doubleClick);
    }
    timelinePane.dispose.on(function() {
      if (!outsideManagedUi)
        ui.dispose.fire();
      selection.selectedInterval.changed.off(redraw);
      selection.hoveredEvent.changed.off(redraw);
      selection.hoveredY.changed.off(redrawCursor);
      selection.hoveredTime_PMILLIS.changed.off(redrawCursor);
      selection.selectedEvents.valueAdded.off(redraw);
      selection.selectedEvents.valueRemoved.off(redraw);
      capsulelayPane.viewportChanged.off(updateMillisPerPx);
      timeAxis.limitsChanged.off(updateMillisPerPx);
    });
    return timelinePane;
  }
  webglext2.newTimelinePane = newTimelinePane;
  function newTimeIntervalMask(timeAxis, interval, selectedIntervalMode) {
    if (selectedIntervalMode === "range") {
      return function(viewport, i, j) {
        var time_PMILLIS = timeAxis.tAtFrac_PMILLIS(viewport.xFrac(i));
        var buffer_MILLIS = timeAxis.tSize_MILLIS / viewport.w * 10;
        return interval.overlaps(time_PMILLIS - buffer_MILLIS, time_PMILLIS + buffer_MILLIS);
      };
    } else if (selectedIntervalMode === "single") {
      return function(viewport, i, j) {
        var time_PMILLIS = timeAxis.tAtFrac_PMILLIS(viewport.xFrac(i));
        var buffer_MILLIS = timeAxis.tSize_MILLIS / viewport.w * 10;
        return time_PMILLIS < interval.cursor_PMILLIS + buffer_MILLIS && time_PMILLIS > interval.cursor_PMILLIS - buffer_MILLIS;
      };
    }
  }
  function attachTimeAxisMouseListeners(pane, axis, args) {
    var vGrab = null;
    pane.mouseDown.on(function(ev) {
      if (webglext2.isLeftMouseDown(ev.mouseEvent) && !webglext2.isNotEmpty(vGrab)) {
        vGrab = axis.vAtFrac(webglext2.xFrac(ev));
      }
    });
    pane.mouseMove.on(function(ev) {
      if (webglext2.isLeftMouseDown(ev.mouseEvent) && webglext2.isNotEmpty(vGrab)) {
        axis.tPan(vGrab - axis.vAtFrac(webglext2.xFrac(ev)));
      }
    });
    pane.mouseUp.on(function(ev) {
      vGrab = null;
    });
    pane.mouseWheel.on(args.options.mouseWheelListener);
  }
  function newTimeAxisPane(args, row) {
    var timeAxis = args.timeAxis;
    var ui = args.ui;
    var draggableEdgeWidth = args.options.draggableEdgeWidth;
    var scrollLayout = args.scrollLayout;
    var drawable = args.drawable;
    var selectedIntervalMode = args.options.selectedIntervalMode;
    var input = ui.input;
    var axisPane = new webglext2.Pane(webglext2.newOverlayLayout());
    if (scrollLayout)
      webglext2.attachTimelineVerticalScrollMouseListeners(axisPane, scrollLayout, drawable);
    attachTimeAxisMouseListeners(axisPane, timeAxis, args);
    var onMouseMove = function(ev) {
      var time_PMILLIS = timeAxis.tAtFrac_PMILLIS(webglext2.xFrac(ev));
      input.mouseMove.fire(ev);
      input.timeHover.fire(time_PMILLIS, ev);
      if (row)
        input.rowHover.fire(row, ev);
    };
    axisPane.mouseMove.on(onMouseMove);
    var onMouseExit = function(ev) {
      input.mouseExit.fire(ev);
      input.timeHover.fire(null, ev);
      if (row)
        input.rowHover.fire(null, ev);
    };
    axisPane.mouseExit.on(onMouseExit);
    var onMouseDown = function(ev) {
      input.mouseDown.fire(ev);
    };
    axisPane.mouseDown.on(onMouseDown);
    var onMouseUp = function(ev) {
      input.mouseUp.fire(ev);
    };
    axisPane.mouseUp.on(onMouseUp);
    var onContextMenu = function(ev) {
      input.contextMenu.fire(ev);
    };
    axisPane.contextMenu.on(onContextMenu);
    if (selectedIntervalMode === "single") {
      var selection = ui.selection;
      var selectedIntervalPane = new webglext2.Pane(null, true, newTimeIntervalMask(timeAxis, selection.selectedInterval, selectedIntervalMode));
      attachTimeSelectionMouseListeners(selectedIntervalPane, timeAxis, selection.selectedInterval, input, draggableEdgeWidth, selectedIntervalMode);
      axisPane.addPane(selectedIntervalPane, false);
      selectedIntervalPane.mouseMove.on(onMouseMove);
      selectedIntervalPane.mouseExit.on(onMouseExit);
      selectedIntervalPane.mouseDown.on(onMouseDown);
      selectedIntervalPane.mouseUp.on(onMouseUp);
      selectedIntervalPane.contextMenu.on(onContextMenu);
    }
    return axisPane;
  }
  function timeAtPointer_PMILLIS(timeAxis, ev) {
    return timeAxis.tAtFrac_PMILLIS(ev.paneViewport.xFrac(ev.i));
  }
  function attachTimeSelectionMouseListeners(pane, timeAxis, interval, input, draggableEdgeWidth, selectedIntervalMode) {
    if (selectedIntervalMode === "single") {
      var chooseDragMode = function chooseDragMode2(ev) {
        return "center";
      };
      attachTimeIntervalSelectionMouseListeners(pane, timeAxis, interval, input, draggableEdgeWidth, selectedIntervalMode, chooseDragMode);
    } else if (selectedIntervalMode === "range") {
      var minIntervalWidthForEdgeDraggability = 3 * draggableEdgeWidth;
      var minIntervalWidthWhenDraggingEdge = minIntervalWidthForEdgeDraggability + 1;
      var chooseDragMode = function chooseDragMode2(ev) {
        var intervalWidth = interval.duration_MILLIS * ev.paneViewport.w / timeAxis.vSize;
        if (intervalWidth < minIntervalWidthForEdgeDraggability) {
          return "center";
        } else {
          var time_PMILLIS = timeAtPointer_PMILLIS(timeAxis, ev);
          var mouseOffset = (time_PMILLIS - interval.start_PMILLIS) * ev.paneViewport.w / timeAxis.vSize;
          if (mouseOffset < draggableEdgeWidth) {
            return "start";
          } else if (mouseOffset < intervalWidth - draggableEdgeWidth) {
            return "center";
          } else {
            return "end";
          }
        }
      };
      attachTimeIntervalSelectionMouseListeners(pane, timeAxis, interval, input, draggableEdgeWidth, selectedIntervalMode, chooseDragMode);
    }
  }
  function attachTimeIntervalSelectionMouseListeners(pane, timeAxis, interval, input, draggableEdgeWidth, selectedIntervalMode, chooseDragMode) {
    var minIntervalWidthForEdgeDraggability = 3 * draggableEdgeWidth;
    var minIntervalWidthWhenDraggingEdge = minIntervalWidthForEdgeDraggability + 1;
    pane.mouseWheel.on(function(ev) {
      var zoomFactor = Math.pow(webglext2.axisZoomStep, ev.wheelSteps);
      timeAxis.tZoom(zoomFactor, timeAxis.vAtFrac(webglext2.xFrac(ev)));
    });
    pane.contextMenu.on(function(ev) {
      input.contextMenu.fire(ev);
    });
    var dragMode = null;
    var dragOffset_MILLIS = null;
    pane.mouseMove.on(function(ev) {
      if (!dragMode) {
        var mouseCursors = { "center": "move", "start": "w-resize", "end": "e-resize" };
        pane.mouseCursor = mouseCursors[chooseDragMode(ev)];
      }
    });
    pane.mouseDown.on(function(ev) {
      dragMode = webglext2.isLeftMouseDown(ev.mouseEvent) ? chooseDragMode(ev) : null;
      if (!webglext2.isNotEmpty(dragMode)) {
        dragOffset_MILLIS = null;
      }
    });
    var dragPointer_PMILLIS = null;
    var updateDragPointer = function(ev) {
      if (webglext2.isNotEmpty(dragMode)) {
        dragPointer_PMILLIS = timeAtPointer_PMILLIS(timeAxis, ev);
      }
    };
    pane.mouseDown.on(updateDragPointer);
    pane.mouseMove.on(updateDragPointer);
    var grabCenter = function() {
      if (dragMode === "center") {
        dragOffset_MILLIS = dragPointer_PMILLIS - interval.start_PMILLIS;
      }
    };
    pane.mouseDown.on(grabCenter);
    var dragCenter = function() {
      if (dragMode === "center") {
        var newStart_PMILLIS = dragPointer_PMILLIS - dragOffset_MILLIS;
        var newEnd_PMILLIS = interval.end_PMILLIS + (newStart_PMILLIS - interval.start_PMILLIS);
        interval.setInterval(newStart_PMILLIS, newEnd_PMILLIS);
      }
    };
    pane.mouseMove.on(dragCenter);
    var grabStart = function() {
      if (dragMode === "start") {
        dragOffset_MILLIS = dragPointer_PMILLIS - interval.start_PMILLIS;
      }
    };
    pane.mouseDown.on(grabStart);
    var dragStart = function() {
      if (dragMode === "start") {
        var wMin_MILLIS = minIntervalWidthWhenDraggingEdge * timeAxis.vSize / pane.viewport.w;
        var newStart_PMILLIS = dragPointer_PMILLIS - dragOffset_MILLIS;
        interval.start_PMILLIS = Math.min(interval.end_PMILLIS - wMin_MILLIS, newStart_PMILLIS);
      }
    };
    pane.mouseMove.on(dragStart);
    var grabEnd = function() {
      if (dragMode === "end") {
        dragOffset_MILLIS = dragPointer_PMILLIS - interval.end_PMILLIS;
      }
    };
    pane.mouseDown.on(grabEnd);
    var dragEnd = function() {
      if (dragMode === "end") {
        var wMin_MILLIS = minIntervalWidthWhenDraggingEdge * timeAxis.vSize / pane.viewport.w;
        var newEnd_PMILLIS = dragPointer_PMILLIS - dragOffset_MILLIS;
        interval.end_PMILLIS = Math.max(interval.start_PMILLIS + wMin_MILLIS, newEnd_PMILLIS);
        interval.cursor_PMILLIS = interval.end_PMILLIS;
      }
    };
    pane.mouseMove.on(dragEnd);
    pane.mouseUp.on(function(ev) {
      dragOffset_MILLIS = null;
      dragPointer_PMILLIS = null;
      dragMode = null;
    });
  }
  function newTimelineSingleSelectionPainter(timeAxis, interval, borderColor, fillColor) {
    var program = new webglext2.Program(webglext2.xyFrac_VERTSHADER, webglext2.solid_FRAGSHADER);
    var a_XyFrac = new webglext2.Attribute(program, "a_XyFrac");
    var u_Color = new webglext2.UniformColor(program, "u_Color");
    var coords = new Float32Array(12 + 8);
    var coordsBuffer = webglext2.newDynamicBuffer();
    return function(gl, viewport) {
      if (webglext2.isNotEmpty(interval.cursor_PMILLIS)) {
        var fracSelection = timeAxis.tFrac(interval.cursor_PMILLIS);
        var fracWidth = 1 / viewport.w;
        var fracHeight = 1 / viewport.h;
        var thickWidth = 3 / viewport.w;
        var highlightWidth = 7 / viewport.w;
        var index = 0;
        coords[index++] = fracSelection - highlightWidth;
        coords[index++] = 1;
        coords[index++] = fracSelection + highlightWidth;
        coords[index++] = 1;
        coords[index++] = fracSelection - highlightWidth;
        coords[index++] = 0;
        coords[index++] = fracSelection + highlightWidth;
        coords[index++] = 0;
        index = webglext2.putQuadXys(coords, index, fracSelection - thickWidth / 2, fracSelection + thickWidth / 2, 1, 0 + fracHeight);
        gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
        gl.enable(webglext2.GL.BLEND);
        program.use(gl);
        coordsBuffer.setData(coords);
        a_XyFrac.setDataAndEnable(gl, coordsBuffer, 2, webglext2.GL.FLOAT);
        u_Color.setData(gl, fillColor);
        gl.drawArrays(webglext2.GL.TRIANGLE_STRIP, 0, 4);
        u_Color.setData(gl, borderColor);
        gl.drawArrays(webglext2.GL.TRIANGLES, 4, 6);
        a_XyFrac.disable(gl);
        program.endUse(gl);
      }
    };
  }
  function newTimelineRangeSelectionPainter(timeAxis, interval, borderColor, fillColor) {
    var program = new webglext2.Program(webglext2.xyFrac_VERTSHADER, webglext2.solid_FRAGSHADER);
    var a_XyFrac = new webglext2.Attribute(program, "a_XyFrac");
    var u_Color = new webglext2.UniformColor(program, "u_Color");
    var coords = new Float32Array(12 + 8 + 48);
    var coordsBuffer = webglext2.newDynamicBuffer();
    return function(gl, viewport) {
      if (webglext2.isNotEmpty(interval.start_PMILLIS) && webglext2.isNotEmpty(interval.end_PMILLIS)) {
        var fracStart = timeAxis.tFrac(interval.start_PMILLIS);
        var fracEnd = timeAxis.tFrac(interval.end_PMILLIS);
        var fracSelection = timeAxis.tFrac(interval.cursor_PMILLIS);
        var fracWidth = 1 / viewport.w;
        var fracHeight = 1 / viewport.h;
        var thickWidth = 3 / viewport.w;
        var index = 0;
        coords[index++] = fracStart;
        coords[index++] = 1;
        coords[index++] = fracEnd;
        coords[index++] = 1;
        coords[index++] = fracStart;
        coords[index++] = 0;
        coords[index++] = fracEnd;
        coords[index++] = 0;
        index = webglext2.putQuadXys(coords, index, fracStart, fracEnd - fracWidth, 1, 1 - fracHeight);
        index = webglext2.putQuadXys(coords, index, fracStart + fracWidth, fracEnd, 0 + fracHeight, 0);
        index = webglext2.putQuadXys(coords, index, fracStart, fracStart + fracWidth, 1 - fracHeight, 0);
        index = webglext2.putQuadXys(coords, index, fracEnd - fracWidth, fracEnd, 1, 0 + fracHeight);
        index = webglext2.putQuadXys(coords, index, fracSelection - thickWidth, fracSelection, 1, 0 + fracHeight);
        gl.blendFuncSeparate(webglext2.GL.SRC_ALPHA, webglext2.GL.ONE_MINUS_SRC_ALPHA, webglext2.GL.ONE, webglext2.GL.ONE_MINUS_SRC_ALPHA);
        gl.enable(webglext2.GL.BLEND);
        program.use(gl);
        coordsBuffer.setData(coords);
        a_XyFrac.setDataAndEnable(gl, coordsBuffer, 2, webglext2.GL.FLOAT);
        u_Color.setData(gl, fillColor);
        gl.drawArrays(webglext2.GL.TRIANGLE_STRIP, 0, 4);
        u_Color.setData(gl, borderColor);
        gl.drawArrays(webglext2.GL.TRIANGLES, 4, 30);
        a_XyFrac.disable(gl);
        program.endUse(gl);
      }
    };
  }
  function newGroupCollapseExpandArrowPainter(group) {
    var program = new webglext2.Program(webglext2.xyFrac_VERTSHADER, webglext2.solid_FRAGSHADER);
    var a_XyFrac = new webglext2.Attribute(program, "a_XyFrac");
    var u_Color = new webglext2.UniformColor(program, "u_Color");
    var coords = new Float32Array(6);
    var coordsBuffer = webglext2.newDynamicBuffer();
    return function(gl, viewport) {
      var sizeFracX = 0.5;
      var sizeX = sizeFracX * viewport.w;
      var sizeY = sizeX * Math.sqrt(3) / 2;
      var sizeFracY = sizeY / viewport.h;
      var bufferFracX = 0.05;
      var bufferSize = bufferFracX * viewport.w;
      var bufferFracY = bufferSize / viewport.h;
      var centerFracX = 0.5;
      var centerFracY = bufferFracY + sizeFracY / 2;
      if (group.collapsed) {
        sizeFracX = sizeY / viewport.w;
        sizeFracY = sizeX / viewport.h;
        var fracStartX = centerFracX - sizeFracX / 2;
        var fracEndX = centerFracX + sizeFracX / 2;
        var fracStartY = 1 - (centerFracY - sizeFracY / 2);
        var fracEndY = 1 - (centerFracY + sizeFracY / 2);
        var index = 0;
        coords[index++] = fracStartX;
        coords[index++] = fracStartY;
        coords[index++] = fracEndX;
        coords[index++] = (fracStartY + fracEndY) / 2;
        coords[index++] = fracStartX;
        coords[index++] = fracEndY;
      } else {
        var fracStartX = centerFracX - sizeFracX / 2;
        var fracEndX = centerFracX + sizeFracX / 2;
        var fracStartY = 1 - (centerFracY - sizeFracY / 2);
        var fracEndY = 1 - (centerFracY + sizeFracY / 2);
        var index = 0;
        coords[index++] = fracStartX;
        coords[index++] = fracStartY;
        coords[index++] = fracEndX;
        coords[index++] = fracStartY;
        coords[index++] = (fracStartX + fracEndX) / 2;
        coords[index++] = fracEndY;
      }
      program.use(gl);
      coordsBuffer.setData(coords);
      a_XyFrac.setDataAndEnable(gl, coordsBuffer, 2, webglext2.GL.FLOAT);
      u_Color.setData(gl, webglext2.white);
      gl.drawArrays(webglext2.GL.TRIANGLES, 0, 3);
      a_XyFrac.disable(gl);
      program.endUse(gl);
    };
  }
  function newTimelineContentPane(args) {
    var drawable = args.drawable;
    var scrollLayout = args.scrollLayout;
    var timeAxis = args.timeAxis;
    var model = args.model;
    var ui = args.ui;
    var options = args.options;
    var root = model.root;
    var selectedIntervalMode = options.selectedIntervalMode;
    var rowPaneFactoryChooser = options.rowPaneFactoryChooser;
    var font = options.font;
    var fgColor = options.fgColor;
    var rowLabelColor = options.rowLabelColor;
    var groupLabelColor = options.groupLabelColor;
    var axisLabelColor = options.axisLabelColor;
    var bgColor = options.bgColor;
    var rowBgColor = options.rowBgColor;
    var rowAltBgColor = options.rowAltBgColor;
    var rowBorderColor = options.rowBorderColor;
    var groupLabelInsets = options.groupLabelInsets;
    var draggableEdgeWidth = options.draggableEdgeWidth;
    var snapToDistance = options.snapToDistance;
    var timelineContentPane = new webglext2.Pane(webglext2.newRowLayout());
    var groupContentPanes = {};
    var addGroup = function(groupGuid, groupIndex) {
      var group = model.group(groupGuid);
      var groupContentPane = new webglext2.Pane(webglext2.newRowLayout());
      timelineContentPane.updateLayoutArgs(function(layoutArg) {
        var shift = webglext2.isNumber(layoutArg) && layoutArg >= 2 * groupIndex;
        return shift ? layoutArg + 2 : layoutArg;
      });
      timelineContentPane.addPane(groupContentPane, 2 * groupIndex + 1, { hide: group.collapsed });
      groupContentPanes[groupGuid] = groupContentPane;
      setupRowContainerPane(args, groupContentPane, group.rowGuids, false, group.groupGuid);
    };
    root.groupGuids.forEach(addGroup);
    root.groupGuids.valueAdded.on(addGroup);
    var moveGroup = function(groupGuid, groupOldIndex, groupNewIndex) {
      var nMin = Math.min(groupOldIndex, groupNewIndex);
      var nMax = Math.max(groupOldIndex, groupNewIndex);
      for (var n = nMin; n <= nMax; n++) {
        var groupGuid = root.groupGuids.valueAt(n);
        timelineContentPane.setLayoutArg(groupContentPanes[groupGuid], 2 * n + 1);
      }
      drawable.redraw();
    };
    root.groupGuids.valueMoved.on(moveGroup);
    var removeGroup = function(groupGuid, groupIndex) {
      var contentPane = groupContentPanes[groupGuid];
      contentPane.dispose.fire();
      timelineContentPane.removePane(contentPane);
      timelineContentPane.updateLayoutArgs(function(layoutArg) {
        var shift = webglext2.isNumber(layoutArg) && layoutArg > 2 * groupIndex + 1;
        return shift ? layoutArg - 2 : layoutArg;
      });
      delete groupContentPanes[groupGuid];
      drawable.redraw();
    };
    root.groupGuids.valueRemoved.on(removeGroup);
    var groupAttrsChangedListeners = {};
    var attachGroupAttrsChangedListener = function(groupGuid, groupIndex) {
      var group = model.group(groupGuid);
      var groupAttrsChangedListener = function() {
        if (webglext2.isNotEmpty(group.hidden) && webglext2.isNotEmpty(groupContentPanes[groupGuid])) {
          timelineContentPane.layoutOptions(groupContentPanes[groupGuid]).hide = group.hidden;
          drawable.redraw();
        }
      };
      groupAttrsChangedListeners[groupGuid] = groupAttrsChangedListener;
      group.attrsChanged.on(groupAttrsChangedListener);
    };
    var unattachGroupAttrsChangedListener = function(groupGuid, groupIndex) {
      var group = model.group(groupGuid);
      group.attrsChanged.off(groupAttrsChangedListeners[groupGuid]);
    };
    root.groupGuids.forEach(attachGroupAttrsChangedListener);
    root.groupGuids.valueAdded.on(attachGroupAttrsChangedListener);
    root.groupGuids.valueRemoved.on(unattachGroupAttrsChangedListener);
    timelineContentPane.dispose.on(function() {
      root.groupGuids.valueAdded.off(addGroup);
      root.groupGuids.valueMoved.off(moveGroup);
      root.groupGuids.valueRemoved.off(removeGroup);
    });
    return timelineContentPane;
  }
  function newRowBackgroundPainter(args, guidList, row) {
    return function(gl) {
      var color = webglext2.isNotEmpty(row.bgColor) ? row.bgColor : guidList.indexOf(row.rowGuid) % 2 ? args.options.rowBgColor : args.options.rowAltBgColor;
      gl.clearColor(color.r, color.g, color.b, color.a);
      gl.clear(webglext2.GL.COLOR_BUFFER_BIT);
    };
  }
  function newRowBackgroundPanes(args, guidList, row) {
    var rowBackgroundPane = newTimeAxisPane(args, row);
    rowBackgroundPane.addPainter(newRowBackgroundPainter(args, guidList, row));
    var rowInsetTop = args.options.rowSeparatorHeight / 2;
    var rowInsetBottom = args.options.rowSeparatorHeight - rowInsetTop;
    var rowInsetPane = new webglext2.Pane(webglext2.newInsetLayout(webglext2.newInsets(rowInsetTop, 0, rowInsetBottom, 0)), false);
    rowInsetPane.addPainter(webglext2.newBorderPainter(args.options.bgColor, { thickness: rowInsetTop, drawRight: false, drawLeft: false, drawBottom: false }));
    rowInsetPane.addPainter(webglext2.newBorderPainter(args.options.bgColor, { thickness: rowInsetBottom, drawRight: false, drawLeft: false, drawTop: false }));
    rowBackgroundPane.addPane(rowInsetPane, true);
    return { rowInsetPane, rowBackgroundPane };
  }
  function setupRowContainerPane(args, parentPane, guidList, isMaximized, keyPrefix) {
    var drawable = args.drawable;
    var scrollLayout = args.scrollLayout;
    var timeAxis = args.timeAxis;
    var model = args.model;
    var ui = args.ui;
    var options = args.options;
    var rowPanes = {};
    var addRow = function(rowGuid, rowIndex) {
      var row = model.row(rowGuid);
      var rowUi = ui.rowUi(rowGuid);
      var rowLabelColorBg = webglext2.isNotEmpty(row.bgLabelColor) ? row.bgLabelColor : options.rowLabelBgColor;
      var rowLabelColorFg = webglext2.isNotEmpty(row.fgLabelColor) ? row.fgLabelColor : options.rowLabelColor;
      var rowLabelFont = webglext2.isNotEmpty(row.labelFont) ? row.labelFont : options.font;
      var rowLabel = new webglext2.Label(row.label, row.labelIcon, rowLabelFont, rowLabelColorFg);
      var rowLabelPane = new webglext2.Pane({ updatePrefSize: webglext2.fitToLabel(rowLabel) }, false);
      rowLabelPane.addPainter(webglext2.newLabelPainter(rowLabel, drawable, 0, 0.5, 0, 0.5));
      var rowLabelBackground = new webglext2.Background(rowLabelColorBg);
      var rowHeaderPane = new webglext2.Pane(webglext2.newInsetLayout(options.rowLabelInsets), true);
      rowHeaderPane.addPainter(rowLabelBackground.newPainter());
      rowHeaderPane.addPane(rowLabelPane);
      var rowAttrsChanged = function() {
        rowLabel.text = row.label;
        rowLabel.fgColor = webglext2.isNotEmpty(row.fgLabelColor) ? row.fgLabelColor : options.rowLabelColor;
        rowLabel.font = webglext2.isNotEmpty(row.labelFont) ? row.labelFont : options.font;
        rowLabelBackground.color = webglext2.isNotEmpty(row.bgLabelColor) ? row.bgLabelColor : options.bgColor;
        drawable.redraw();
      };
      row.attrsChanged.on(rowAttrsChanged);
      var rowBackgroundPanes = newRowBackgroundPanes(args, guidList, row);
      var rowBackgroundPane = rowBackgroundPanes.rowBackgroundPane;
      var rowInsetPane = rowBackgroundPanes.rowInsetPane;
      var rowPane = new webglext2.Pane(webglext2.newColumnLayout());
      rowPane.addPane(rowHeaderPane, 0, { width: options.rowLabelPaneWidth });
      rowPane.addPane(rowBackgroundPane, 1, { width: null });
      rowUi.addPane(keyPrefix + "-background", rowBackgroundPane);
      rowUi.addPane(keyPrefix + "-inset", rowInsetPane);
      rowUi.addPane(keyPrefix + "-label", rowLabelPane);
      rowUi.addPane(keyPrefix + "-header", rowHeaderPane);
      var rowDataAxis = row.dataAxis;
      var rowContentPane = null;
      var rowPaneFactory = null;
      var rowContentOptions = { timelineFont: options.font, timelineFgColor: options.fgColor, draggableEdgeWidth: options.draggableEdgeWidth, snapToDistance: options.snapToDistance, isMaximized, mouseWheelListener: options.mouseWheelListener };
      var refreshRowContentPane = function() {
        var newRowPaneFactory = rowUi.paneFactory || options.rowPaneFactoryChooser(row);
        if (newRowPaneFactory !== rowPaneFactory) {
          if (rowContentPane) {
            rowContentPane.dispose.fire();
            rowInsetPane.removePane(rowContentPane);
          }
          rowPaneFactory = newRowPaneFactory;
          rowContentPane = rowPaneFactory && rowPaneFactory(drawable, timeAxis, rowDataAxis, model, row, ui, rowContentOptions);
          rowContentPane.addPainter(webglext2.newRowBorderPainter(options.rowBorderColor, ui, row, { thickness: 2 }));
          if (rowContentPane) {
            rowInsetPane.addPane(rowContentPane);
          }
          drawable.redraw();
        }
      };
      rowUi.paneFactoryChanged.on(refreshRowContentPane);
      row.attrsChanged.on(refreshRowContentPane);
      row.eventGuids.valueAdded.on(refreshRowContentPane);
      row.eventGuids.valueRemoved.on(refreshRowContentPane);
      row.timeseriesGuids.valueAdded.on(refreshRowContentPane);
      row.timeseriesGuids.valueRemoved.on(refreshRowContentPane);
      refreshRowContentPane();
      parentPane.updateLayoutArgs(function(layoutArg) {
        var shift = webglext2.isNumber(layoutArg) && layoutArg >= rowIndex;
        return shift ? layoutArg + 1 : layoutArg;
      });
      parentPane.addPane(rowPane, rowIndex);
      rowPanes[rowGuid] = rowPane;
      parentPane.layoutOptions(rowPane).hide = row.hidden;
      drawable.redraw();
      rowPane.dispose.on(function() {
        row.attrsChanged.off(rowAttrsChanged);
        rowUi.paneFactoryChanged.off(refreshRowContentPane);
        row.attrsChanged.off(refreshRowContentPane);
        row.eventGuids.valueAdded.off(refreshRowContentPane);
        row.eventGuids.valueRemoved.off(refreshRowContentPane);
        row.timeseriesGuids.valueAdded.off(refreshRowContentPane);
        row.timeseriesGuids.valueRemoved.off(refreshRowContentPane);
        rowUi.removePane(keyPrefix + "-background");
        rowUi.removePane(keyPrefix + "-inset");
        rowUi.removePane(keyPrefix + "-label");
        rowUi.removePane(keyPrefix + "-header");
      });
    };
    guidList.forEach(addRow);
    guidList.valueAdded.on(addRow);
    var valueMoved = function(rowGuid, rowOldIndex, rowNewIndex) {
      var nMin = Math.min(rowOldIndex, rowNewIndex);
      var nMax = Math.max(rowOldIndex, rowNewIndex);
      for (var n = nMin; n <= nMax; n++) {
        var rowGuid = guidList.valueAt(n);
        parentPane.setLayoutArg(rowPanes[rowGuid], n);
      }
      drawable.redraw();
    };
    guidList.valueMoved.on(valueMoved);
    var removeRow = function(rowGuid, rowIndex) {
      var pane = rowPanes[rowGuid];
      pane.dispose.fire();
      parentPane.removePane(pane);
      parentPane.updateLayoutArgs(function(layoutArg) {
        var shift = webglext2.isNumber(layoutArg) && layoutArg > rowIndex;
        return shift ? layoutArg - 1 : layoutArg;
      });
      delete rowPanes[rowGuid];
      drawable.redraw();
    };
    guidList.valueRemoved.on(removeRow);
    var attrsChangedListeners = {};
    var attachAttrsChangedListener = function(rowGuid, rowIndex) {
      var row = model.row(rowGuid);
      var attrsChangedListener = function() {
        if (webglext2.isNotEmpty(row.hidden && webglext2.isNotEmpty(rowPanes[rowGuid]))) {
          parentPane.layoutOptions(rowPanes[rowGuid]).hide = row.hidden;
          drawable.redraw();
        }
      };
      attrsChangedListeners[rowGuid] = attrsChangedListener;
      row.attrsChanged.on(attrsChangedListener);
    };
    var unattachAttrsChangedListener = function(rowGuid, rowIndex) {
      var row = model.row(rowGuid);
      row.attrsChanged.off(attrsChangedListeners[rowGuid]);
    };
    guidList.forEach(attachAttrsChangedListener);
    guidList.valueAdded.on(attachAttrsChangedListener);
    guidList.valueRemoved.on(unattachAttrsChangedListener);
    drawable.redraw();
    parentPane.dispose.on(function() {
      guidList.valueAdded.off(addRow);
      guidList.valueMoved.off(valueMoved);
      guidList.valueRemoved.off(removeRow);
      guidList.valueAdded.off(attachAttrsChangedListener);
      guidList.valueRemoved.off(unattachAttrsChangedListener);
    });
  }
})(webglext || (webglext = {}));
var webglext;
(function(webglext2) {
  function newToolTip() {
    var div = document.createElement("div");
    div.classList.add("exampleTooltip");
    div.style.position = "absolute";
    div.style.zIndex = "1";
    div.style.visibility = "hidden";
    document.body.appendChild(div);
    return {
      show: function(html, i, j) {
        div.innerHTML = html;
        div.style.left = i + "px";
        div.style.bottom = j - div.clientHeight + "px";
        div.style.visibility = "visible";
      },
      move: function(i, j) {
        div.style.left = i + "px";
        div.style.bottom = j - div.clientHeight + "px";
      },
      hide: function() {
        div.style.visibility = "hidden";
      }
    };
  }
  function dispTimeLines(container) {
    var canvas = document.createElement("canvas");
    canvas.id = "timeLineCanvas";
    canvas.style.padding = "0";
    container.appendChild(canvas);
    var drawable = webglext2.newDrawable(canvas);
    var updateCanvasSize = function() {
      $(canvas).height($(window).height() - canvas.getBoundingClientRect().top);
      canvas.width = $(canvas).width();
      canvas.height = $(canvas).height();
      drawable.redraw();
    };
    $(window).resize(updateCanvasSize);
    updateCanvasSize();
    var timeAxis = new webglext2.TimeAxis1D(0, 4e4);
    timeAxis.limitsChanged.on(drawable.redraw);
    var timelineOptions = {
      showTopAxis: true,
      selectedIntervalMode: "single",
      fgColor: webglext2.white,
      rowLabelColor: webglext2.black,
      groupLabelColor: webglext2.white,
      axisLabelColor: webglext2.black,
      bgColor: webglext2.white,
      rowBgColor: webglext2.white,
      rowAltBgColor: webglext2.rgb(0.05, 0.056, 0.12),
      selectedIntervalFillColor: webglext2.rgba(0.2, 0.6, 0.4, 0.1),
      selectedIntervalBorderColor: webglext2.rgb(0.4, 0.9, 0.4),
      allowEventMultiSelection: true,
      gridColor: webglext2.gray(0.3),
      tickSpacings: 60
    };
    var model = new webglext2.TimelineModel();
    var ui = new webglext2.TimelineUi(model, { allowEventMultiSelection: true });
    var timelinePane = webglext2.newTimelinePane(drawable, timeAxis, model, timelineOptions, ui);
    var selection = ui.selection;
    selection.selectedInterval.setInterval(0, 200);
    var contentPane = new webglext2.Pane(webglext2.newCornerLayout(webglext2.Side.LEFT, webglext2.Side.TOP));
    contentPane.addPane(timelinePane);
    drawable.setContentPane(webglext2.newInsetPane(contentPane, webglext2.newInsets(12, 10, 2), timelineOptions.bgColor));
    drawable.redraw();
    $.getJSON("timelineUi.json", function(uiStyles) {
      uiStyles.eventStyles.forEach(function(s) {
        ui.eventStyles.add(new webglext2.TimelineEventStyleUi(s));
      });
      uiStyles.annotationStyles.forEach(function(s) {
        ui.annotationStyles.add(new webglext2.TimelineAnnotationStyleUi(s));
      });
    });
    var timelineTrank = {
      eventGuid: "testtest",
      "start_time": 15e3,
      "end_time": 25e3,
      label: "video _track",
      userEditable: true,
      fgColor: "white",
      bgColor: "RGB(123, 250, 170)",
      bgSecondaryColor: "white",
      order: 3,
      topMargin: 0,
      bottomMargin: 0,
      labelTopMargin: 10,
      labelBottomMargin: 0,
      labelVAlign: 0.5,
      labelHAlign: 1,
      fillPattern: "stripe"
    };
    var defaultPeriod = 1e4;
    var addTrack = document.getElementById("selected-time-add");
    var strGuid = "test_pro";
    var colorArr = { "videoedit.timeline.row01a": webglext2.rgba(123 / 255, 250 / 255, 170 / 255, 1), "videoedit.timeline.row01b": webglext2.rgba(165 / 255, 227 / 255, 236 / 255, 1), "videoedit.timeline.row01c": webglext2.rgba(255 / 255, 157 / 255, 234 / 255, 1) };
    var timelineTrackModel = null;
    addTrack.onclick = function() {
      var timeLineModelArr = ui.selection.selectedRow.toArray();
      if (timeLineModelArr && timeLineModelArr.length > 0) {
        var now = new Date();
        timelineTrackModel = new webglext2.TimelineTrackModel(timelineTrank);
        timelineTrackModel.eventGuid = strGuid + webglext2.getCurrentTimMillis();
        var selectedRow = timeLineModelArr[0];
        var allEventGuids = selectedRow.eventGuids;
        var startTime = 0;
        var endTime = 0;
        var bgColor = colorArr[selectedRow.rowGuid];
        for (var n = 0; n < allEventGuids.length; n++) {
          var eventGuid = allEventGuids.valueAt(n);
          var event = model.event(eventGuid);
          startTime = event.end_PMILLIS > startTime ? event.end_PMILLIS : startTime;
        }
        startTime += 100;
        endTime = startTime + defaultPeriod;
        timelineTrackModel.start_PMILLIS = startTime;
        timelineTrackModel.end_PMILLIS = endTime;
        timelineTrackModel.bgColor = bgColor;
        model.events.add(timelineTrackModel);
        selectedRow.eventGuids.add(timelineTrackModel.eventGuid);
      }
    };
    var removeTrack = document.getElementById("selected-time-minus");
    removeTrack.onclick = function() {
      var timeLineModelArr = ui.selection.selectedRow.toArray();
      var selectionEvents = ui.selection.selectedEvents;
      if (timeLineModelArr && timeLineModelArr.length > 0 && selectionEvents && selectionEvents.length > 0) {
        var currentRow = ui.selection.selectedRow.valueAt(0);
        var selectEvent = selectionEvents.valueAt(0);
        currentRow.eventGuids.removeValue(selectEvent.eventGuid);
        model.events.removeId(selectEvent.eventGuid);
      }
    };
    var addPlay = document.getElementById("selected-time-autoplay");
    var playState = false;
    var myVar = null;
    addPlay.onclick = function() {
      if (!playState) {
        myVar = setInterval(playTimeLine, 30);
        playState = true;
        addPlay.className = "fa fa-pause";
      } else {
        clearInterval(myVar);
        addPlay.className = "fa fa-play";
        playState = false;
      }
    };
    function playTimeLine() {
      var timeStep2 = 30;
      var selectedInterval2 = selection.selectedInterval;
      selectedInterval2.pan(timeStep2);
      if (selectedInterval2.end_PMILLIS > timeAxis.tMax_PMILLIS) {
        var tSize_MILLIS = timeAxis.tSize_MILLIS;
        timeAxis.tMax_PMILLIS = selectedInterval2.end_PMILLIS;
        timeAxis.tMin_PMILLIS = timeAxis.tMax_PMILLIS - tSize_MILLIS;
      }
      drawable.redraw();
    }
    var timeStep = webglext2.secondsToMillis(1);
    var selectedInterval = selection.selectedInterval;
    var a = document.getElementById("selected-time-step-backward");
    a.onclick = function() {
      selectedInterval.pan(-timeStep);
      if (selectedInterval.start_PMILLIS < timeAxis.tMin_PMILLIS) {
        var tSize_MILLIS = timeAxis.tSize_MILLIS;
        timeAxis.tMin_PMILLIS = selectedInterval.start_PMILLIS;
        timeAxis.tMax_PMILLIS = timeAxis.tMin_PMILLIS + tSize_MILLIS;
      }
      drawable.redraw();
    };
    var a = document.getElementById("selected-time-step-forward");
    a.onclick = function() {
      selectedInterval.pan(timeStep);
      if (selectedInterval.end_PMILLIS > timeAxis.tMax_PMILLIS) {
        var tSize_MILLIS = timeAxis.tSize_MILLIS;
        timeAxis.tMax_PMILLIS = selectedInterval.end_PMILLIS;
        timeAxis.tMin_PMILLIS = timeAxis.tMax_PMILLIS - tSize_MILLIS;
      }
      drawable.redraw();
    };
    var tooltip = newToolTip();
    var iTooltipOffset = 12;
    var jTooltipOffset = -12;
    selection.hoveredEvent.changed.on(function() {
      var hoveredEvent = selection.hoveredEvent.value;
      if (hoveredEvent) {
        var iMouse = selection.mousePos.x;
        var jMouse = selection.mousePos.y;
        if (webglext2.isNumber(iMouse) && webglext2.isNumber(jMouse)) {
          var html = hoveredEvent.label;
          tooltip.show(html, iMouse + iTooltipOffset, jMouse + jTooltipOffset);
        } else {
          tooltip.hide();
        }
      } else {
        tooltip.hide();
      }
    });
    selection.mousePos.changed.on(function() {
      var iMouse = selection.mousePos.x;
      var jMouse = selection.mousePos.y;
      if (webglext2.isNumber(iMouse) && webglext2.isNumber(jMouse)) {
        tooltip.move(iMouse + iTooltipOffset, jMouse + jTooltipOffset);
      } else {
        tooltip.hide();
      }
    });
    selection.hoveredAnnotation.changed.on(function() {
      if (webglext2.isNotEmpty(selection.hoveredAnnotation.value)) {
      }
    });
    selection.mousePos.changed.on(function() {
      var iMouse = selection.mousePos.x;
      var jMouse = selection.mousePos.y;
    });
    selection.hoveredTime_PMILLIS.changed.on(function() {
      var hoveredTime_PMILLIS = selection.hoveredTime_PMILLIS.value;
    });
    selection.selectedInterval.changed.on(function() {
      var selectionStart_PMILLIS = selection.selectedInterval.start_PMILLIS;
      var selectionEnd_PMILLIS = selection.selectedInterval.end_PMILLIS;
    });
    selection.hoveredRow.changed.on(function() {
      var hoveredRow = selection.hoveredRow.value;
    });
    selection.hoveredEvent.changed.on(function() {
      var hoveredEvent = selection.hoveredEvent.value;
    });
    selection.selectedEvents.valueAdded.on(function(event) {
    });
    selection.selectedEvents.valueRemoved.on(function(event) {
    });
    $.getJSON("timelineData.json", function(newTimeline) {
      model.merge(newTimeline, webglext2.timelineMergeNewBeforeOld);
    });
  }
  webglext2.dispTimeLines = dispTimeLines;
})(webglext || (webglext = {}));
