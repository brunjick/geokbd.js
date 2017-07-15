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
	
	var defaults_1 = __webpack_require__(1);
	var abstract_1 = __webpack_require__(2);
	var default_1 = __webpack_require__(3);
	var keypress_1 = __webpack_require__(4);
	var GeoKBD = function () {
	    function GeoKBD() {}
	    GeoKBD.initialize = function (config) {
	        if (config === void 0) {
	            config = {};
	        }
	        this.createReactiveConfig(mergeWithDefaultConfig(config));
	        this.registerDefaultThemeIfRequired();
	        this.initializeTheme();
	        this.onKeydownHandler = this.onKeydownHandler.bind(this);
	        this.onKeyupHandler = this.onKeyupHandler.bind(this);
	        this.initialized = true;
	    };
	    GeoKBD.attach = function (target, config) {
	        if (!this.initialized) {
	            warn("attach() can't be called until initialize().");
	            return;
	        }
	        if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) {
	            warn('only works for <input> and <textarea> elements.');
	            return;
	        }
	        target.GeoKBD = config;
	        target.addEventListener('keydown', this.onKeydownHandler);
	        target.addEventListener('keyup', this.onKeyupHandler);
	        if (GeoKBD.activeTheme) {
	            GeoKBD.activeTheme.onAttach(target);
	        }
	    };
	    GeoKBD.detach = function (target) {
	        delete target.GeoKBD;
	        target.removeEventListener('keydown', this.onKeydownHandler);
	        target.removeEventListener('keyup', this.onKeyupHandler);
	        if (GeoKBD.activeTheme) {
	            GeoKBD.activeTheme.onDetach(target);
	        }
	    };
	    GeoKBD.createReactiveConfig = function (config) {
	        var _this = this;
	        this.shadowConfig = config;
	        Object.keys(defaults_1.DEFAULT_CONFIG).forEach(function (propName) {
	            Object.defineProperty(_this.config, propName, {
	                get: function get() {
	                    return GeoKBD.shadowConfig[propName];
	                },
	                set: function set(newValue) {
	                    GeoKBD.shadowConfig[propName] = newValue;
	                    if (GeoKBD.activeTheme instanceof abstract_1.default) {
	                        GeoKBD.activeTheme.onConfigurationChange(GeoKBD.config);
	                    }
	                }
	            });
	        });
	    };
	    GeoKBD.registerDefaultThemeIfRequired = function () {
	        if (this.config.theme === 'default') {
	            this.registerTheme('default', default_1.default);
	        }
	    };
	    GeoKBD.onKeydownHandler = function (evt) {
	        if (isSpecialKeyPressed(evt)) {
	            return;
	        }
	        if (this.config.enabled && isInEnglishAlphabetRange(evt.keyCode)) {
	            stopEvent(evt);
	        } else if (this.config.hotkey === evt.key) {
	            this.config.enabled = !this.config.enabled;
	            stopEvent(evt);
	        }
	    };
	    GeoKBD.onKeyupHandler = function (evt) {
	        if (isSpecialKeyPressed(evt) || !isInEnglishAlphabetRange(evt.keyCode)) {
	            return;
	        }
	        // Call beforeChange callback
	        var beforeChange = evt.target.GeoKBD ? evt.target.GeoKBD.beforeChange : null;
	        var afterChange = evt.target.GeoKBD ? evt.target.GeoKBD.afterChange : null;
	        if (!toCallOrNotToCall(beforeChange, evt)) {
	            return;
	        }
	        // Return if not enabled
	        if (!this.config.enabled) {
	            return;
	        }
	        stopEvent(evt);
	        keypress_1.default(evt);
	        // Call afterChange callback
	        toCallOrNotToCall(afterChange, evt);
	    };
	    GeoKBD.registerTheme = function (name, theme) {
	        this.themes[name] = theme;
	    };
	    GeoKBD.import = function (module) {
	        switch (module) {
	            case 'themes/abstract':
	                {
	                    return abstract_1.default;
	                }
	            case 'themes/default':
	                {
	                    return default_1.default;
	                }
	        }
	        return undefined;
	    };
	    GeoKBD.initializeTheme = function () {
	        var themeClass = this.themes[this.config.theme];
	        if (typeof themeClass !== 'function') {
	            warn("Can't instantiate theme.");
	            return;
	        }
	        var theme = new themeClass(this.config);
	        if (!(theme instanceof abstract_1.default)) {
	            warn("Theme doesn't extend AbstractTheme");
	            return;
	        } else {
	            this.activeTheme = theme;
	        }
	    };
	    return GeoKBD;
	}();
	GeoKBD.themes = {};
	GeoKBD.config = defaults_1.DEFAULT_CONFIG;
	GeoKBD.shadowConfig = {};
	GeoKBD.initialized = false;
	function warn(message) {
	    console.warn('[geokbd] - ' + message);
	}
	function toCallOrNotToCall(fn) {
	    var args = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        args[_i - 1] = arguments[_i];
	    }
	    if (typeof fn === 'function') {
	        return fn.apply(null, args) === false ? false : true;
	    }
	    return true;
	}
	function isSpecialKeyPressed(evt) {
	    return evt.metaKey || evt.ctrlKey || evt.altKey;
	}
	function isInEnglishAlphabetRange(charCode) {
	    return charCode >= 65 && charCode <= 90 || charCode >= 97 && charCode <= 122;
	}
	function stopEvent(evt) {
	    evt.preventDefault();
	}
	function mergeWithDefaultConfig(mergeFrom) {
	    var merged = Object.keys(defaults_1.DEFAULT_CONFIG).reduce(function (mergedConfig, propName) {
	        mergedConfig[propName] = mergeFrom.hasOwnProperty(propName) ? mergeFrom[propName] : defaults_1.DEFAULT_CONFIG[propName];
	        return mergedConfig;
	    }, {});
	    return merged;
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
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var AbstractTheme = function () {
	    function AbstractTheme(config) {}
	    return AbstractTheme;
	}();
	exports.default = AbstractTheme;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var __extends = undefined && undefined.__extends || function () {
	    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
	        d.__proto__ = b;
	    } || function (d, b) {
	        for (var p in b) {
	            if (b.hasOwnProperty(p)) d[p] = b[p];
	        }
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() {
	            this.constructor = d;
	        }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	var abstract_1 = __webpack_require__(2);
	var TEXT_ENABLED = 'ჩართულია';
	var TEXT_DISABLED = 'გამორთულია';
	var CLASSNAME = 'geokbd--statusMessage';
	var CLASSNAME_STATE = CLASSNAME + '-state';
	var CLASSNAME_HOTKEY = CLASSNAME + '-hotkey';
	var CLASSNAME_HIDDEN = CLASSNAME + ' geokbd--hidden';
	var CLASSNAME_VISIBLE = CLASSNAME + ' geokbd--visible';
	var TEMPLATE = ['<div class="' + CLASSNAME + '-text">', 'ქართული კლავიატურა: <u class="' + CLASSNAME_STATE + '"></u><br>', 'ჩართვა/გამორთვა კლავიშით (\'<span class="' + CLASSNAME_HOTKEY + '"></span>\')', '</div>'].join('');
	var DefaultTheme = function (_super) {
	    __extends(DefaultTheme, _super);
	    function DefaultTheme(config) {
	        var _this = _super.call(this, config) || this;
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
	    DefaultTheme.prototype.onAttach = function (target) {
	        target.addEventListener('focus', this.handleFocusEvent);
	        target.addEventListener('blur', this.handleBlurEvent);
	    };
	    DefaultTheme.prototype.onConfigurationChange = function (config) {
	        this.setHotkeyText(config.hotkey);
	        this.setEnabledText(config.enabled);
	    };
	    DefaultTheme.prototype.onDetach = function (target) {
	        target.removeEventListener('focus', this.handleFocusEvent);
	        target.removeEventListener('blur', this.handleBlurEvent);
	    };
	    DefaultTheme.prototype.onDestroy = function () {
	        if (this.root instanceof Element) {
	            this.root.remove();
	        }
	        this.root = undefined;
	        this.state = undefined;
	        this.hotkey = undefined;
	    };
	    DefaultTheme.prototype.handleFocusEvent = function () {
	        this.setVisibility(true);
	    };
	    DefaultTheme.prototype.handleBlurEvent = function () {
	        this.setVisibility(false);
	    };
	    DefaultTheme.prototype.setHotkeyText = function (hotkey) {
	        if (this.hotkey instanceof Element) {
	            this.hotkey.innerHTML = hotkey;
	        }
	    };
	    DefaultTheme.prototype.setEnabledText = function (isEnabled) {
	        if (this.state instanceof Element) {
	            this.state.innerHTML = isEnabled ? TEXT_ENABLED : TEXT_DISABLED;
	        }
	    };
	    return DefaultTheme;
	}(abstract_1.default);
	function createDivWithHtml(html) {
	    var el;
	    el = document.createElement('div');
	    el.innerHTML = html;
	    return el;
	}
	function debounce(fn, wait) {
	    var timeout;
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