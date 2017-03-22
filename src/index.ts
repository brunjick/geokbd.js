import {
  ThemesObject,
  GlobalConfig,
  TargetConfig,
  TargetElement,
  KeypressEvent,
} from './interfaces';
import {
  DEFAULT_THEME,
  DEFAULT_HOTKEY,
  DEFAULT_ENABLED,
  DEFAULT_CONFIG,
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
    this.initialized = true;
  }

  public static attach(target: TargetElement, config: TargetConfig) {
    target.addEventListener('keypress', this.prepareKeypressEvent.bind(this));
    target.GeoKBD = config;

    if (GeoKBD.activeTheme) {
      GeoKBD.activeTheme.hook(target);
    }
  }

  private static createReactiveConfig(config: GlobalConfig): void {
    const context = this;
    this.shadowConfig = config;

    Object.keys(DEFAULT_CONFIG).forEach((propName: string) => {
      Object.defineProperty(this.config, propName, {
        get: function () {
          return context.shadowConfig[propName];
        },
        set: function (newValue) {
          context.shadowConfig[propName] = newValue;
          (context.activeTheme as AbstractTheme).handleConfigChange(context.config);
        },
      });
    });
  }

  private static registerDefaultThemeIfRequired(): void {
    if (this.config.theme === 'default') {
      this.registerTheme('default', DefaultTheme);
    }
  }

  private static prepareKeypressEvent(evt: KeypressEvent) {
    // Don't capture Ctrl/Meta keypress
    if (evt.metaKey || evt.ctrlKey) {
      return;
    }

    // Check if hotkey was pressed
    if (this.config.hotkey === String.fromCharCode(evt.which)) {
      evt.preventDefault();
      this.config.enabled = !this.config.enabled;
      return;
    }

    if (this.config.enabled) {
      let beforeCb = evt.target.GeoKBD ? evt.target.GeoKBD.beforeCallback : null;
      let afterCb = evt.target.GeoKBD ? evt.target.GeoKBD.afterCallback : null;

      if (toCallOrNotToCall(beforeCb, evt)) {
        handleKeypressEvent(evt);
        toCallOrNotToCall(afterCb, evt);
      }
    }
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
      console.warn("Can't instantiate theme");
      return;
    }
    let theme = new themeClass(this.config);

    if (!(theme instanceof AbstractTheme)) {
      console.warn("Theme doesn't extend AbstractTheme");
      return;
    } else {
      this.activeTheme = theme;
    }
  }
}

function toCallOrNotToCall(fn: any, ...args: any[]): boolean {
  if (typeof fn === 'function') {
    return fn.apply(null, args) === false ? false : true;
  }

  return true;
}

function mergeWithDefaultConfig(mergeFrom: Object): GlobalConfig {
  const merged = Object.keys(DEFAULT_CONFIG)
    .reduce((mergedConfig: Object, propName: string): Object => {
      mergedConfig[propName] = mergeFrom.hasOwnProperty(propName)
        ? mergeFrom[propName]
        : DEFAULT_CONFIG[propName];

      return mergedConfig;
    }, {});

  return merged as GlobalConfig;
}

export = GeoKBD;
