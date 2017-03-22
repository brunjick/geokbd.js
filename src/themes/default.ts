import AbstractTheme from './abstract';
import { debounce } from '../debounce';
import { GlobalConfig, TargetElement } from '../interfaces';

const TEXT_ENABLED = 'ჩართულია';
const TEXT_DISABLED = 'გამორთულია';

const CLASSNAME = 'geokbd--statusMessage';
const CLASSNAME_STATE = CLASSNAME + '-state';
const CLASSNAME_HOTKEY = CLASSNAME + '-hotkey';
const CLASSNAME_HIDDEN = CLASSNAME + ' hidden';
const CLASSNAME_VISIBLE = CLASSNAME + ' visible';

const TEMPLATE = [
  '<div class="' + CLASSNAME + '-text">',
    'ქართული კლავიატურა: <u class="' + CLASSNAME_STATE + '"></u><br>',
    'ჩართვა/გამორთვა კლავიშით (\'<span class="' + CLASSNAME_HOTKEY + '"></span>\')',
  '</div>',
].join('');

class DefaultTheme extends AbstractTheme {
  private root?: Element | null;
  private state?: Element | null;
  private hotkey?: Element | null;

  constructor(config: GlobalConfig) {
    super(config);

    this.root = createDivWithHtml(TEMPLATE);
    this.state = this.root.querySelector('.' + CLASSNAME_STATE);
    this.hotkey = this.root.querySelector('.' + CLASSNAME_HOTKEY);
    this.setVisibility(false);
    this.setHotkeyText(config.hotkey);
    this.setEnabledText(config.enabled);

    document.body.appendChild(this.root);
  }

  public hook(target: TargetElement): void {
    target.addEventListener('focus', this.handleFocusEvent.bind(this));
    target.addEventListener('blur', this.handleBlurEvent.bind(this));
  }

  public handleConfigChange(config: GlobalConfig): void {
    this.setHotkeyText(config.hotkey);
    this.setEnabledText(config.enabled);
  }

  public destroy() {
    if (this.root instanceof Element) {
      this.root.remove();
    }

    this.root = undefined;
    this.state = undefined;
    this.hotkey = undefined;
  }

  private handleFocusEvent(): void {
    this.setVisibility(true);
  }

  private handleBlurEvent(): void {
    this.setVisibility(false);
  }

  private setHotkeyText(hotkey: string): void {
    if (this.hotkey instanceof Element) {
      this.hotkey.innerHTML = hotkey;
    }
  }

  private setEnabledText(isEnabled: boolean): void {
    if (this.state instanceof Element) {
      this.state.innerHTML = isEnabled ? TEXT_ENABLED : TEXT_DISABLED;
    }
  }

  private setVisibility = debounce(
    function (isVisible: boolean): void {
      if (this.root instanceof Element) {
        this.root.className = isVisible ? CLASSNAME_VISIBLE : CLASSNAME_HIDDEN;
      }
    },
    100,
  );
}

function createDivWithHtml(html: string): Element {
  let el: Element;
  el = document.createElement('div');
  el.innerHTML = html;

  return el;
}

export default DefaultTheme;
