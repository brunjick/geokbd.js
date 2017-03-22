import { GlobalConfig, TargetElement } from '../interfaces';

abstract class AbstractTheme {
  constructor (config: GlobalConfig) {};
  public abstract hook(target: TargetElement): void;
  public abstract handleConfigChange(config: GlobalConfig): void;
  public abstract destroy(): void;
}

export default AbstractTheme;
