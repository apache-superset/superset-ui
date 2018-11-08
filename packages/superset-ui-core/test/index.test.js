import {
  Plugin,
  Preset,
  Registry,
  convertKeysToCamelCase,
  createRegistryWithDefaultKey,
  isDefined,
  isRequired,
  makeSingleton,
} from '../src/index';

describe('index', () => {
  it('exports modules', () => {
    [
      Plugin,
      Preset,
      Registry,
      convertKeysToCamelCase,
      createRegistryWithDefaultKey,
      isDefined,
      isRequired,
      makeSingleton,
    ].forEach(x => expect(x).toBeDefined());
  });
});
