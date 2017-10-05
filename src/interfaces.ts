export interface ThemesObject {
  [name: string]: any;
}

export interface GlobalConfig {
  theme: string;
  hotkey: string;
  enabled: boolean;
}

export interface TargetConfig {
}

export interface TargetElement extends HTMLInputElement {
  GeoKBD: TargetConfig;
}

export interface CustomKeyboardEvent extends KeyboardEvent {
  target: TargetElement;
}

export interface OffsetRange {
  start: number;
  end: number;
}
