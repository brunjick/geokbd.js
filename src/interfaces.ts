export interface ThemesObject {
  [name: string]: any;
}

export interface GlobalConfig {
  theme: string;
  hotkey: string;
  enabled: boolean;
}

export interface TargetConfig {
  beforeCallback: Function;
  afterCallback: Function;
}

export interface TargetElement extends HTMLInputElement {
  GeoKBD: TargetConfig;
}

export interface KeypressEvent extends Event {
  metaKey: boolean;
  ctrlKey: boolean;
  target: TargetElement;
  which: number;
}

export interface OffsetRange {
  start: number;
  end: number;
}
