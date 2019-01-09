import Jed, { LanguagePack } from 'jed';

const DEFAULT_LANGUAGE_PACK = {
  domain: 'superset',
  locale_data: {
    superset: {
      '': {
        domain: 'superset',
        lang: 'en',
        plural_forms: 'nplurals=1; plural=0',
      },
    },
  },
};

export { LanguagePack };

export interface TranslatorConfig {
  languagePack?: LanguagePack;
}

export default class Translator {
  i18n: Jed;

  constructor(config: TranslatorConfig = {}) {
    const { languagePack = DEFAULT_LANGUAGE_PACK } = config;
    this.i18n = new Jed(languagePack);
  }

  translate(input: string | undefined | null, ...args: any[]): string | undefined | null {
    if (input === null || input === undefined) {
      return input;
    }

    return this.i18n.translate(input).fetch(...args);
  }

  translateWithNumber(
    singular: string | undefined | null,
    plural: string | undefined | null,
    num: number = 0,
    ...args: any[]
  ): string | undefined | null {
    if (singular === null || singular === undefined) {
      return singular;
    }
    if (plural === null || plural === undefined) {
      return plural;
    }

    return this.i18n
      .translate(singular)
      .ifPlural(num, plural)
      .fetch(...args);
  }
}
