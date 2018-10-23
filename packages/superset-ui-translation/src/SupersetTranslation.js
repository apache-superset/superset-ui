import Jed from 'jed';
import { format } from './utils';

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

class SupersetTranslation {
  constructor({ languagePack = DEFAULT_LANGUAGE_PACK } = {}) {
    this.i18n = new Jed(languagePack);
  }

  translate(string, ...args) {
    if (string === null || string === undefined) {
      return string;
    }
    const rv = this.i18n.gettext(string);
    return args.length > 0 ? format(rv, args) : rv;
  }
}

let singleton;

function hasInstance() {
  if (!singleton) {
    throw new Error('You must call SupersetTranslation.configure(...) before calling other methods');
  }
  return true;
}

const PublicAPI = {
  configure: config => {
    singleton = new SupersetTranslation(config);
    return singleton;
  },
  t: (...args) => hasInstance() && singleton.translate(...args),
};

export { SupersetTranslation };

export default PublicAPI;
