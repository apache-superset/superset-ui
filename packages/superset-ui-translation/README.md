## `@superset-ui/translation`

[![Version](https://img.shields.io/npm/v/@superset-ui/translation.svg?style=flat)](https://img.shields.io/npm/v/@superset-ui/translation.svg?style=flat)

`i18n` locales and translation for Superset

### SupersetTranslation

#### Example usage

```js
import { configure, t } from '@superset-ui/translation';

configure({
  languagePack: {...},
});

console.log(t('text to be translated'));
```

#### API

`configure({ [languagePack] })`

`t(text[, args])`

### Development

`@data-ui/build-config` is used to manage the build configuration for this package including babel
builds, jest testing, eslint, and prettier.
