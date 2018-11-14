## @superset-ui/number-format

[![Version](https://img.shields.io/npm/v/@superset-ui/number-format.svg?style=flat)](https://img.shields.io/npm/v/@superset-ui/number-format.svg?style=flat)
[![David (path)](https://img.shields.io/david/apache-superset/superset-ui.svg?path=packages%2Fsuperset-ui-number-format&style=flat-square)](https://david-dm.org/apache-superset/superset-ui?path=packages/superset-ui-number-format)

Description

#### Example usage

Functions `getNumberFormatter` and `formatNumber` should be used instead of calling `d3.format` directly.

```js
import { getNumberFormatter } from '@superset-ui/number-format';
const formatter = getNumberFormatter('.2f');
console.log(formatter.format(1000));
```

or

```js
import { formatNumber } from '@superset-ui/number-format';
console.log(formatNumber('.2f', 1000));
```

It has registry to support custom formatting.

```js
import { getNumberFormatterRegistry, formatNumber, NumberFormatter } from '@superset-ui/number-format';
getNumberFormatterRegistry().registerValue('my_format', new NumberFormatter({
  name: 'my_format',
  formatFn: v => `my special format of ${v}`
});

console.log(formatNumber('my_format', 1000));
// prints 'my special format of 1000'
```

#### API

`fn(args)`

- Do something

### Development

`@data-ui/build-config` is used to manage the build configuration for this package including babel
builds, jest testing, eslint, and prettier.
