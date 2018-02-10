import { GlobalConfig, TargetElement, CustomKeyboardEvent } from './interfaces';
import { DEFAULT_CONFIG } from './defaults';
import AbstractTheme from './themes/abstract';
import DefaultTheme from './themes/default';
import handleKeypressEvent from './keypress';

class GeoKBD {
  private static initialized = false;
  private static config: GlobalConfig;

  private static themes: Map<string, any> = new Map();
  private static activeTheme?: AbstractTheme;

  public static initialize(config: Object = {}): void {
    this.createMergedConfig(config);
    this.registerDefaultThemeIfRequired();
    this.initializeTheme();

    this.onKeydownHandler = this.onKeydownHandler.bind(this);
    this.initialized = true;
  }

  public static attach(target: TargetElement) {
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

  public static detach(target: TargetElement) {
    target.removeEventListener('keydown', this.onKeydownHandler);

    if (this.activeTheme) {
      this.activeTheme.onDetach(target);
    }
  }

  private static createMergedConfig(config: Object): void {
    this.config = Object.keys(DEFAULT_CONFIG)
      .map(configKey => {
        let defaultValue = DEFAULT_CONFIG[configKey];
        let toMergeWith = config[configKey];

        return {
          key: configKey,
          value: typesMatch(defaultValue, toMergeWith)
            ? toMergeWith
            : defaultValue
        };
      })
      .reduce((mergedConfig, keyValue) => {
        mergedConfig[keyValue.key] = keyValue.value;

        return mergedConfig;
      }, {}) as GlobalConfig;
  }

  private static setConfig(key: string, value: any) {
    if (typesMatch(this.config[key], value)) {
      this.config[key] = value;

      if (this.activeTheme) {
        this.activeTheme.onConfigurationChange(this.config);
      }
    }
  }

  private static registerDefaultThemeIfRequired(): void {
    if (this.config.theme === 'default') {
      this.registerTheme('default', DefaultTheme);
    }
  }

  private static toggleEnabled() {
    this.setConfig('enabled', !this.config.enabled);
  }

  private static onKeydownHandler(evt: CustomKeyboardEvent) {
    if (isSpecialKeyPressed(evt)) {
      return;
    }

    if (this.config.hotkey === evt.key) {
      this.toggleEnabled();
      stopEvent(evt);
      return;
    }

    if (
      !this.config.enabled ||
      !isAlphabetKeyPressed(evt) ||
      isGeorgianKeyPressed(evt)
    ) {
      return;
    }

    stopEvent(evt);
    handleKeypressEvent(evt);
  }

  public static registerTheme(name: string, theme: any) {
    this.themes.set(name, theme);
  }

  private static initializeTheme(): void {
    const ThemeClass = this.themes.get(this.config.theme);

    if (typeof ThemeClass !== 'function') {
      warn("Can't instantiate theme.");
      return;
    }

    this.activeTheme = new ThemeClass(this.config);
  }
}

function warn(message: string): void {
  console.warn('[geokbd] - ' + message);
}

function typesMatch(arg1: any, arg2: any): boolean {
  return typeof arg1 === typeof arg2;
}

function isSpecialKeyPressed(evt: KeyboardEvent) {
  return evt.metaKey || evt.ctrlKey || evt.altKey;
}

function isAlphabetKeyPressed(evt: KeyboardEvent) {
  return /^Key[A-Z]$/.test(evt.code);
}

function isGeorgianKeyPressed(evt: KeyboardEvent) {
  return /^[ა-ჰ]+$/.test(evt.key);
}

function isTextElement(el: any) {
  return /(text)(area)?/.test(el.type);
}

function stopEvent(evt: Event) {
  evt.preventDefault();
}

export = GeoKBD;
