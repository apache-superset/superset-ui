import createRegistryWithDefaultKey from '../../src/utils/createRegistryWithDefaultKey';
import Registry from '../../src/models/Registry';

describe('createRegistryWithDefaultKey(options)', () => {
  const PlainRegistrySubclass = createRegistryWithDefaultKey();

  it('returns a class that extends from Registry', () => {
    expect(PlainRegistrySubclass).toBeInstanceOf(Function);
    const registry = new PlainRegistrySubclass();
    expect(registry).toBeInstanceOf(Registry);
  });
  describe('registryWithDefaultKeyInstance', () => {
    describe('.clear()', () => {
      const registry = new PlainRegistrySubclass();
      it('also resets default key', () => {
        registry.setDefaultKey('abc');
        registry.clear();
        expect(registry.getDefaultKey()).toBeUndefined();
      });
      it('returns itself', () => {
        expect(registry.clear()).toBe(registry);
      });
    });
    describe('.get()', () => {
      const registry = new PlainRegistrySubclass()
        .registerValue('abc', 100)
        .registerValue('def', 200)
        .setDefaultKey('abc');
      it('.get() returns value from default key', () => {
        expect(registry.get()).toEqual(100);
      });
      it('.get(key) returns value from specified key', () => {
        expect(registry.get('def')).toEqual(200);
      });
    });
  });
  describe('options.defaultKey', () => {
    describe('when not set', () => {
      const registry = new PlainRegistrySubclass();
      it(`After creation, default key is undefined`, () => {
        expect(registry.defaultKey).toBeUndefined();
      });
      it('.clear() reset defaultKey to undefined', () => {
        registry.setDefaultKey('abc');
        registry.clear();
        expect(registry.getDefaultKey()).toBeUndefined();
      });
    });
    describe('when options.defaultKey is set', () => {
      const RegistrySubclass = createRegistryWithDefaultKey({
        defaultKey: 'def',
      });
      const registry = new RegistrySubclass();
      it(`After creation, default key is undefined`, () => {
        expect(registry.defaultKey).toEqual('def');
      });
      it('.clear() reset defaultKey to this options.defaultKey', () => {
        registry.setDefaultKey('abc');
        registry.clear();
        expect(registry.getDefaultKey()).toEqual('def');
      });
    });
  });
  describe('options.keyLabel', () => {
    describe('when not set', () => {
      const registry = new PlainRegistrySubclass();
      it('The subclass names functions getDefaultKey and setDefaultKey', () => {
        expect(registry.getDefaultKey).toBeInstanceOf(Function);
        expect(registry.setDefaultKey).toBeInstanceOf(Function);
      });
      describe('.getDefaultKey()', () => {
        it('returns defaultKey', () => {
          registry.setDefaultKey('abc');
          expect(registry.getDefaultKey()).toEqual('abc');
        });
      });
      describe('.setDefaultKey(key)', () => {
        it('set the default key', () => {
          registry.setDefaultKey('abc');
          expect(registry.defaultKey).toEqual('abc');
        });
        it('returns itself', () => {
          expect(registry.setDefaultKey('ghi')).toBe(registry);
        });
      });
    });
    describe('when set to "XXX"', () => {
      const RegistrySubclass = createRegistryWithDefaultKey({
        keyLabel: 'schemeName',
      });
      const registry = new RegistrySubclass();
      it('functions getDefaultKey and setDefaultKey do not exist', () => {
        expect(registry.getDefaultKey).toBeUndefined();
        expect(registry.setDefaultKey).toBeUndefined();
      });
      it('The subclass names functions getDefaultXXX and setDefaultXXX (camelCase)', () => {
        expect(registry.getDefaultSchemeName).toBeInstanceOf(Function);
        expect(registry.setDefaultSchemeName).toBeInstanceOf(Function);
      });
      describe('.getDefaultXXX()', () => {
        it('returns defaultKey', () => {
          registry.setDefaultSchemeName('abc');
          expect(registry.getDefaultSchemeName()).toEqual('abc');
        });
      });
      describe('.setDefaultXXX(key)', () => {
        it('set the default key', () => {
          registry.setDefaultSchemeName('abc');
          expect(registry.defaultKey).toEqual('abc');
        });
        it('returns itself', () => {
          expect(registry.setDefaultSchemeName('ghi')).toBe(registry);
        });
      });
    });
  });
  describe('options.setFirstItemAsDefault', () => {
    describe('when true', () => {
      const RegistrySubclass = createRegistryWithDefaultKey({
        setFirstItemAsDefault: true,
      });
      const registry = new RegistrySubclass();
      beforeEach(() => {
        registry.clear();
      });
      describe('.registerValue(key, value)', () => {
        it('sets the default key to this key if default key is not set', () => {
          registry.registerValue('abc', 100);
          expect(registry.getDefaultKey()).toEqual('abc');
        });
        it('does not modify the default key if already set', () => {
          registry.setDefaultKey('def').registerValue('abc', 100);
          expect(registry.getDefaultKey()).toEqual('def');
        });
        it('returns itself', () => {
          expect(registry.registerValue('ghi', 300)).toBe(registry);
        });
      });
      describe('.registerLoader(key, loader)', () => {
        it('sets the default key to this key if default key is not set', () => {
          registry.registerLoader('abc', () => 100);
          expect(registry.getDefaultKey()).toEqual('abc');
        });
        it('does not modify the default key if already set', () => {
          registry.setDefaultKey('def').registerLoader('abc', () => 100);
          expect(registry.getDefaultKey()).toEqual('def');
        });
        it('returns itself', () => {
          expect(registry.registerLoader('ghi', () => 300)).toBe(registry);
        });
      });
    });
    describe('when false', () => {
      const RegistrySubclass = createRegistryWithDefaultKey({
        setFirstItemAsDefault: false,
      });
      const registry = new RegistrySubclass();
      beforeEach(() => {
        registry.clear();
      });
      describe('.registerValue(key, value)', () => {
        it('does not modify default key', () => {
          registry.registerValue('abc', 100);
          expect(registry.defaultKey).toBeUndefined();
          registry.setDefaultKey('def');
          registry.registerValue('ghi', 300);
          expect(registry.defaultKey).toEqual('def');
        });
        it('returns itself', () => {
          expect(registry.registerValue('ghi', 300)).toBe(registry);
        });
      });
      describe('.registerLoader(key, loader)', () => {
        it('does not modify default key', () => {
          registry.registerValue('abc', () => 100);
          expect(registry.defaultKey).toBeUndefined();
          registry.setDefaultKey('def');
          registry.registerValue('ghi', () => 300);
          expect(registry.defaultKey).toEqual('def');
        });
        it('returns itself', () => {
          expect(registry.registerLoader('ghi', () => 300)).toBe(registry);
        });
      });
    });
  });
});
