(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("geokbd", [], factory);
	else if(typeof exports === 'object')
		exports["geokbd"] = factory();
	else
		root["geokbd"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var defaults_1 = __webpack_require__(1);
	var default_1 = __webpack_require__(2);
	var keypress_1 = __webpack_require__(4);
	
	var GeoKBD = function () {
	    function GeoKBD() {
	        _classCallCheck(this, GeoKBD);
	    }
	
	    _createClass(GeoKBD, null, [{
	        key: "initialize",
	        value: function initialize() {
	            var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	            this.createMergedConfig(config);
	            this.registerDefaultThemeIfRequired();
	            this.initializeTheme();
	            this.onKeydownHandler = this.onKeydownHandler.bind(this);
	            this.initialized = true;
	        }
	    }, {
	        key: "attach",
	        value: function attach(target) {
	            if (!this.initialized) {
	                warn("attach() can't be called until initialize().");
	                return false;
	            }
	            if (!isTextElement(target)) {
	                warn('only works for <input> and <textarea> elements.');
	                return false;
	            }
	            target.addEventListener('keydown', this.onKeydownHandler);
	            if (this.activeTheme) {
	                this.activeTheme.onAttach(target);
	            }
	            return target;
	        }
	    }, {
	        key: "detach",
	        value: function detach(target) {
	            target.removeEventListener('keydown', this.onKeydownHandler);
	            if (this.activeTheme) {
	                this.activeTheme.onDetach(target);
	            }
	        }
	    }, {
	        key: "createMergedConfig",
	        value: function createMergedConfig(config) {
	            this.config = Object.keys(defaults_1.DEFAULT_CONFIG).map(function (configKey) {
	                var defaultValue = defaults_1.DEFAULT_CONFIG[configKey];
	                var toMergeWith = config[configKey];
	                return {
	                    key: configKey,
	                    value: typesMatch(defaultValue, toMergeWith) ? toMergeWith : defaultValue
	                };
	            }).reduce(function (mergedConfig, keyValue) {
	                mergedConfig[keyValue.key] = keyValue.value;
	                return mergedConfig;
	            }, {});
	        }
	    }, {
	        key: "setConfig",
	        value: function setConfig(key, value) {
	            if (typesMatch(this.config[key], value)) {
	                this.config[key] = value;
	                if (this.activeTheme) {
	                    this.activeTheme.onConfigurationChange(this.config);
	                }
	            }
	        }
	    }, {
	        key: "registerDefaultThemeIfRequired",
	        value: function registerDefaultThemeIfRequired() {
	            if (this.config.theme === 'default') {
	                this.registerTheme('default', default_1.default);
	            }
	        }
	    }, {
	        key: "toggleEnabled",
	        value: function toggleEnabled() {
	            this.setConfig('enabled', !this.config.enabled);
	        }
	    }, {
	        key: "onKeydownHandler",
	        value: function onKeydownHandler(evt) {
	            if (isSpecialKeyPressed(evt)) {
	                return;
	            }
	            if (this.config.hotkey === evt.key) {
	                this.toggleEnabled();
	                stopEvent(evt);
	                return;
	            }
	            if (!this.config.enabled || !isAlphabetKeyPressed(evt) || isGeorgianKeyPressed(evt)) {
	                return;
	            }
	            stopEvent(evt);
	            keypress_1.default(evt);
	        }
	    }, {
	        key: "registerTheme",
	        value: function registerTheme(name, theme) {
	            this.themes.set(name, theme);
	        }
	    }, {
	        key: "initializeTheme",
	        value: function initializeTheme() {
	            var ThemeClass = this.themes.get(this.config.theme);
	            if (typeof ThemeClass !== 'function') {
	                warn("Can't instantiate theme.");
	                return;
	            }
	            this.activeTheme = new ThemeClass(this.config);
	        }
	    }]);
	
	    return GeoKBD;
	}();
	
	GeoKBD.initialized = false;
	GeoKBD.themes = new Map();
	function warn(message) {
	    console.warn('[geokbd] - ' + message);
	}
	function typesMatch(arg1, arg2) {
	    return (typeof arg1 === "undefined" ? "undefined" : _typeof(arg1)) === (typeof arg2 === "undefined" ? "undefined" : _typeof(arg2));
	}
	function isSpecialKeyPressed(evt) {
	    return evt.metaKey || evt.ctrlKey || evt.altKey;
	}
	function isAlphabetKeyPressed(evt) {
	    return (/^Key[A-Z]$/.test(evt.code)
	    );
	}
	function isGeorgianKeyPressed(evt) {
	    return (/^[ა-ჰ]+$/.test(evt.key)
	    );
	}
	function isTextElement(el) {
	    return (/(text)(area)?/.test(el.type)
	    );
	}
	function stopEvent(evt) {
	    evt.preventDefault();
	}
	module.exports = GeoKBD;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DEFAULT_THEME = 'default';
	exports.DEFAULT_HOTKEY = '~';
	exports.DEFAULT_ENABLED = true;
	exports.DEFAULT_CONFIG = {
	    theme: exports.DEFAULT_THEME,
	    hotkey: exports.DEFAULT_HOTKEY,
	    enabled: exports.DEFAULT_ENABLED
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var abstract_1 = __webpack_require__(3);
	var TEXT_ENABLED = 'ჩართულია';
	var TEXT_DISABLED = 'გამორთულია';
	var CLASSNAME = 'geokbd--statusMessage';
	var CLASSNAME_STATE = CLASSNAME + '-state';
	var CLASSNAME_HOTKEY = CLASSNAME + '-hotkey';
	var CLASSNAME_HIDDEN = CLASSNAME + ' geokbd--hidden';
	var CLASSNAME_VISIBLE = CLASSNAME + ' geokbd--visible';
	var TEMPLATE = ['<div class="' + CLASSNAME + '-text">', 'ქართული კლავიატურა: <u class="' + CLASSNAME_STATE + '"></u><br>', 'ჩართვა/გამორთვა კლავიშით (\'<span class="' + CLASSNAME_HOTKEY + '"></span>\')', '</div>'].join('');
	
	var DefaultTheme = function (_abstract_1$default) {
	    _inherits(DefaultTheme, _abstract_1$default);
	
	    function DefaultTheme(config) {
	        _classCallCheck(this, DefaultTheme);
	
	        var _this = _possibleConstructorReturn(this, (DefaultTheme.__proto__ || Object.getPrototypeOf(DefaultTheme)).call(this, config));
	
	        _this.setVisibility = debounce(function (isVisible) {
	            if (this.root instanceof Element) {
	                this.root.className = isVisible ? CLASSNAME_VISIBLE : CLASSNAME_HIDDEN;
	            }
	        }, 100);
	        _this.handleFocusEvent = _this.handleFocusEvent.bind(_this);
	        _this.handleBlurEvent = _this.handleBlurEvent.bind(_this);
	        _this.root = createDivWithHtml(TEMPLATE);
	        _this.state = _this.root.querySelector('.' + CLASSNAME_STATE);
	        _this.hotkey = _this.root.querySelector('.' + CLASSNAME_HOTKEY);
	        _this.root.className = CLASSNAME;
	        _this.setHotkeyText(config.hotkey);
	        _this.setEnabledText(config.enabled);
	        document.body.appendChild(_this.root);
	        return _this;
	    }
	
	    _createClass(DefaultTheme, [{
	        key: "onAttach",
	        value: function onAttach(target) {
	            target.addEventListener('focus', this.handleFocusEvent);
	            target.addEventListener('blur', this.handleBlurEvent);
	        }
	    }, {
	        key: "onConfigurationChange",
	        value: function onConfigurationChange(config) {
	            this.setHotkeyText(config.hotkey);
	            this.setEnabledText(config.enabled);
	        }
	    }, {
	        key: "onDetach",
	        value: function onDetach(target) {
	            target.removeEventListener('focus', this.handleFocusEvent);
	            target.removeEventListener('blur', this.handleBlurEvent);
	        }
	    }, {
	        key: "onDestroy",
	        value: function onDestroy() {
	            if (this.root instanceof Element) {
	                this.root.remove();
	            }
	            this.root = undefined;
	            this.state = undefined;
	            this.hotkey = undefined;
	        }
	    }, {
	        key: "handleFocusEvent",
	        value: function handleFocusEvent() {
	            this.setVisibility(true);
	        }
	    }, {
	        key: "handleBlurEvent",
	        value: function handleBlurEvent() {
	            this.setVisibility(false);
	        }
	    }, {
	        key: "setHotkeyText",
	        value: function setHotkeyText(hotkey) {
	            if (this.hotkey instanceof Element) {
	                this.hotkey.innerHTML = hotkey;
	            }
	        }
	    }, {
	        key: "setEnabledText",
	        value: function setEnabledText(isEnabled) {
	            if (this.state instanceof Element) {
	                this.state.innerHTML = isEnabled ? TEXT_ENABLED : TEXT_DISABLED;
	            }
	        }
	    }]);
	
	    return DefaultTheme;
	}(abstract_1.default);
	
	function createDivWithHtml(html) {
	    var el = void 0;
	    el = document.createElement('div');
	    el.innerHTML = html;
	    return el;
	}
	function debounce(fn, wait) {
	    var timeout = void 0;
	    return function () {
	        var context = this;
	        var args = arguments;
	        var later = function later() {
	            fn.apply(context, args);
	        };
	        clearTimeout(timeout);
	        timeout = setTimeout(later, wait);
	    };
	}
	exports.default = DefaultTheme;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	Object.defineProperty(exports, "__esModule", { value: true });
	
	var AbstractTheme = function AbstractTheme(config) {
	    _classCallCheck(this, AbstractTheme);
	};
	
	exports.default = AbstractTheme;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var ALPHABET = 'abgdevzTiklmnopJrstufqRySCcZwWxjh';
	var BASE_INDEX = 4304;
	function convertChar(charIndex) {
	    var char = String.fromCharCode(charIndex);
	    if (ALPHABET.indexOf(char) >= 0) {
	        return BASE_INDEX + ALPHABET.indexOf(char);
	    }
	    return charIndex;
	}
	function isSelectionSupported(el) {
	    return typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number';
	}
	function getInputSelection(el) {
	    var start = 0;
	    var end = 0;
	    if (isSelectionSupported(el)) {
	        start = el.selectionStart;
	        end = el.selectionEnd;
	    }
	    return { start: start, end: end };
	}
	function setInputSelection(el, offset) {
	    if (isSelectionSupported(el)) {
	        el.selectionStart = offset.start;
	        el.selectionEnd = offset.end;
	    }
	    // A little 'hack' to keep natural browser behavior while typing
	    el.blur();
	    el.focus();
	}
	function dispatchCustomKeypressEvent(evt, charCode) {
	    var customEvent = new KeyboardEvent('keypress', {
	        key: String.fromCharCode(charCode),
	        // keyCode: charCode,
	        // charCode: charCode,
	        code: evt.code,
	        location: evt.location,
	        repeat: evt.repeat
	    });
	    evt.target.dispatchEvent(customEvent);
	}
	function handleKeypress(evt) {
	    var el = evt.target;
	    var charCode = evt.key.charCodeAt(0);
	    var mappedCharCode = convertChar(charCode);
	    // Don't take any action if conversion didn't happen
	    if (charCode === mappedCharCode) {
	        return;
	    }
	    // Insert converted char
	    var sel = getInputSelection(el);
	    var val = el.value;
	    el.value = val.slice(0, sel.start) + String.fromCharCode(mappedCharCode) + val.slice(sel.end);
	    // Move caret to correct position
	    setInputSelection(el, { start: sel.start + 1, end: sel.start + 1 });
	    dispatchCustomKeypressEvent(evt, mappedCharCode);
	}
	exports.default = handleKeypress;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=geokbd.js.map