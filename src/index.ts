import {
  ThemesObject,
  GlobalConfig,
  TargetConfig,
  TargetElement,
  CustomKeyboardEvent
} from './interfaces';
import {
  DEFAULT_THEME,
  DEFAULT_HOTKEY,
  DEFAULT_ENABLED,
  DEFAULT_CONFIG
} from './defaults';

import AbstractTheme from './themes/abstract';
import DefaultTheme from './themes/default';
import handleKeypressEvent from './keypress';

class GeoKBD {
  private static themes: ThemesObject = {};
  private static config: GlobalConfig = DEFAULT_CONFIG;
  private static shadowConfig: Object = {};
  private static activeTheme?: AbstractTheme;
  private static initialized = false;

  public static initialize(config: Object = {}): void {
    this.createReactiveConfig(mergeWithDefaultConfig(config));
    this.registerDefaultThemeIfRequired();
    this.initializeTheme();

    this.onKeydownHandler = this.onKeydownHandler.bind(this);
    this.onKeyupHandler = this.onKeyupHandler.bind(this);
    this.initialized = true;
  }

  public static attach(target: TargetElement, config: TargetConfig) {
    if (!this.initialized) {
      warn("attach() can't be called until initialize().");
      return;
    }

    if (
      !(target instanceof HTMLInputElement) &&
      !(target instanceof HTMLTextAreaElement)
    ) {
      warn('only works for <input> and <textarea> elements.');
      return;
    }

    target.GeoKBD = config;
    target.addEventListener('keydown', this.onKeydownHandler);
    target.addEventListener('keyup', this.onKeyupHandler);

    if (GeoKBD.activeTheme) {
      GeoKBD.activeTheme.onAttach(target);
    }
  }

  public static detach(target: TargetElement) {
    delete target.GeoKBD;
    target.removeEventListener('keydown', this.onKeydownHandler);
    target.removeEventListener('keyup', this.onKeyupHandler);

    if (GeoKBD.activeTheme) {
      GeoKBD.activeTheme.onDetach(target);
    }
  }

  private static createReactiveConfig(config: GlobalConfig): void {
    this.shadowConfig = config;

    Object.keys(DEFAULT_CONFIG).forEach((propName: string) => {
      Object.defineProperty(this.config, propName, {
        get: function() {
          return GeoKBD.shadowConfig[propName];
        },
        set: function(newValue) {
          GeoKBD.shadowConfig[propName] = newValue;
          if (GeoKBD.activeTheme instanceof AbstractTheme) {
            GeoKBD.activeTheme.onConfigurationChange(GeoKBD.config);
          }
        }
      });
    });
  }

  private static registerDefaultThemeIfRequired(): void {
    if (this.config.theme === 'default') {
      this.registerTheme('default', DefaultTheme);
    }
  }

  private static onKeydownHandler(evt: KeyboardEvent) {
    if (isSpecialKeyPressed(evt)) {
      return;
    }

    if (this.config.enabled && isInEnglishAlphabetRange(evt.keyCode)) {
      stopEvent(evt);
    } else if (this.config.hotkey === evt.key) {
      this.config.enabled = !this.config.enabled;
      stopEvent(evt);
    }
  }

  private static onKeyupHandler(evt: CustomKeyboardEvent) {
    if (isSpecialKeyPressed(evt) || !isInEnglishAlphabetRange(evt.keyCode)) {
      return;
    }

    // Call beforeChange callback
    const beforeChange = evt.target.GeoKBD
      ? evt.target.GeoKBD.beforeChange
      : null;
    const afterChange = evt.target.GeoKBD
      ? evt.target.GeoKBD.afterChange
      : null;

    if (!toCallOrNotToCall(beforeChange, evt)) {
      return;
    }

    // Return if not enabled
    if (!this.config.enabled) {
      return;
    }

    stopEvent(evt);
    handleKeypressEvent(evt);

    // Call afterChange callback
    toCallOrNotToCall(afterChange, evt);
  }

  public static registerTheme(name: string, theme: any) {
    this.themes[name] = theme;
  }

  public static import(module: string): any {
    switch (module) {
      case 'themes/abstract': {
        return AbstractTheme;
      }

      case 'themes/default': {
        return DefaultTheme;
      }
    }

    return undefined;
  }

  private static initializeTheme(): void {
    const themeClass = this.themes[this.config.theme];

    if (typeof themeClass !== 'function') {
      warn("Can't instantiate theme.");
      return;
    }
    let theme = new themeClass(this.config);

    if (!(theme instanceof AbstractTheme)) {
      warn("Theme doesn't extend AbstractTheme");
      return;
    } else {
      this.activeTheme = theme;
    }
  }
}

function warn(message: string): void {
  console.warn('[geokbd] - ' + message);
}

function toCallOrNotToCall(fn: any, ...args: any[]): boolean {
  if (typeof fn === 'function') {
    return fn.apply(null, args) === false ? false : true;
  }

  return true;
}

function isSpecialKeyPressed(evt: KeyboardEvent) {
  return evt.metaKey || evt.ctrlKey || evt.altKey;
}

function isInEnglishAlphabetRange(charCode: number) {
  return (
    (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)
  );
}

function stopEvent(evt: Event) {
  evt.preventDefault();
}

function mergeWithDefaultConfig(mergeFrom: Object): GlobalConfig {
  const merged = Object.keys(
    DEFAULT_CONFIG
  ).reduce((mergedConfig: Object, propName: string): Object => {
    mergedConfig[propName] = mergeFrom.hasOwnProperty(propName)
      ? mergeFrom[propName]
      : DEFAULT_CONFIG[propName];

    return mergedConfig;
  }, {});

  return merged as GlobalConfig;
}

export = GeoKBD;
