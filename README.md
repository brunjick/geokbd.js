# geokbd.js

Georgian virtual keyboard

#### Installation:

With script tag:

```html
<script src="/path/to/package/dist/js/geokbd.min.js"></script>
<script>
  var GeoKBD = window['geokbd'];
</script>
```

With package manager:

`npm install geokbd.js --save` or  `yarn add geokbd.js`

```js
import GeoKBD from 'geokbd.js';
```

If you want to use default theme, you should include `dist/css/themes/default.min.css` in your bundle however you like.

### Usage:

```js
var targetElement = document.getElementById('target-element');

GeoKBD.initialize();
GeoKBD.attach(targetElement);
```



### API:

##### ` registerTheme(name: string, theme: any)` - Register custom theme.

`name: string` - Theme name

`theme: any` - Theme class, which implements the following interface:

```ts
abstract class AbstractTheme {
  constructor(config: GlobalConfig) {}
  public abstract onAttach(target: TargetElement): void;
  public abstract onConfigurationChange(config: GlobalConfig): void;
  public abstract onDetach(target: TargetElement): void;
  public abstract onDestroy(): void;
}
```

##### `initialize(config: Object)` - Perform one time initialization

`config: Object` - Configuration object.

```js
{
  theme: 'default',
  hotkey: '`',
  enabled: 'true'
}
```



##### `attach(target: Element)` - Attach functionality to target element

`target: Element` - `HTMLInputElement | HTMLTextAreaElement`

##### `detach(target: Element)` - Detach functionality from target element

`target: Element` - `HTMLInputElement | HTMLTextAreaElement`



### Using custom themes:

WIP