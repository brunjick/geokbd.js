import { OffsetRange } from './interfaces';

const ALPHABET = 'abgdevzTiklmnopJrstufqRySCcZwWxjh';
const BASE_INDEX = 4304;

function convertChar(charIndex: number) {
  const char = String.fromCharCode(charIndex);

  if (ALPHABET.indexOf(char) >= 0) {
    return BASE_INDEX + ALPHABET.indexOf(char);
  }

  return charIndex;
}

function isSelectionSupported(el: HTMLInputElement): boolean {
  return (
    typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number'
  );
}

function getInputSelection(el: HTMLInputElement): OffsetRange {
  let start = 0;
  let end = 0;

  if (isSelectionSupported(el)) {
    start = el.selectionStart;
    end = el.selectionEnd;
  }

  return { start, end };
}

function setInputSelection(el: HTMLInputElement, offset: OffsetRange): void {
  if (isSelectionSupported(el)) {
    el.selectionStart = offset.start;
    el.selectionEnd = offset.end;
  }

  // A little 'hack' to keep natural browser behavior while typing
  el.blur();
  el.focus();
}

function dispatchCustomKeypressEvent(evt: KeyboardEvent, charCode: number) {
  const customEvent: KeyboardEvent = new KeyboardEvent('keypress', {
    key: String.fromCharCode(charCode),
    // keyCode: charCode,
    // charCode: charCode,
    code: evt.code,
    location: evt.location,
    repeat: evt.repeat
  });

  evt.target.dispatchEvent(customEvent);
}

export default function handleKeypress(evt: KeyboardEvent): void {
  const el = evt.target as HTMLInputElement;
  const charCode = evt.key.charCodeAt(0);
  const mappedCharCode = convertChar(charCode);

  // Don't take any action if conversion didn't happen
  if (charCode === mappedCharCode) {
    return;
  }

  // Insert converted char
  const sel = getInputSelection(el);
  const val = el.value;

  el.value =
    val.slice(0, sel.start) +
    String.fromCharCode(mappedCharCode) +
    val.slice(sel.end);

  // Move caret to correct position
  setInputSelection(el, { start: sel.start + 1, end: sel.start + 1 });
  dispatchCustomKeypressEvent(evt, mappedCharCode);
}
