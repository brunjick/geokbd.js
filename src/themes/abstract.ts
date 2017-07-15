import { GlobalConfig, TargetElement } from '../interfaces';

abstract class AbstractTheme {
  constructor(config: GlobalConfig) {}
  public abstract onAttach(target: TargetElement): void;
  public abstract onConfigurationChange(config: GlobalConfig): void;
  public abstract onDetach(target: TargetElement): void;
  public abstract onDestroy(): void;
}

export default AbstractTheme;
