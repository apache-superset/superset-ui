import Translator from './Translator';

let singleton;

function hasInstance() {
  if (!singleton) {
    throw new Error('You must call configure(...) before calling other methods');
  }
  return true;
}

function configure(config) {
  if (singleton) {
    throw new Error('Translator has already been configured.');
  }
  singleton = new Translator(config);
  return singleton;
};

function t(...args) {
  return hasInstance() && singleton.translate(...args);
}

export { configure, t };
