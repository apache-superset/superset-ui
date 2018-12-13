import Plugin from './Plugin';

export default class Preset {
  name: string;
  description: string;
  presets: Array<Preset>;
  plugins: Array<Plugin>;

  constructor({ name = '', description = '', presets = [], plugins = [] } = {}) {
    this.name = name;
    this.description = description;
    this.presets = presets;
    this.plugins = plugins;
  }

  register(): Preset {
    this.presets.forEach(preset => {
      preset.register();
    });
    this.plugins.forEach(plugin => {
      plugin.register();
    });

    return this;
  }
}
