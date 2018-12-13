export default class Plugin {
  config: {
    [key: string]: any;
  };

  constructor() {
    this.resetConfig();
  }

  resetConfig(): Plugin {
    // The child class can set default config
    // by overriding this function.
    this.config = {};

    return this;
  }

  configure(config, replace = false): Plugin {
    if (replace) {
      this.config = config;
    } else {
      this.config = { ...this.config, ...config };
    }

    return this;
  }

  register(): Plugin {
    return this;
  }
}
