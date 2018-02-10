export type TargetElement = HTMLInputElement | HTMLTextAreaElement;

export interface GlobalConfig extends Object {
  theme: string;
  hotkey: string;
  enabled: boolean;
}

export interface CustomKeyboardEvent extends KeyboardEvent {
  target: TargetElement;
}

export interface OffsetRange {
  start: number;
  end: number;
}
