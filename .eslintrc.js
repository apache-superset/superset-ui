module.exports = {
  "extends": [
    "./node_modules/@airbnb/config-eslint/lib/presets/base.js",
    "./node_modules/@airbnb/config-eslint/lib/presets/next.js",
    "./node_modules/@airbnb/config-eslint/lib/presets/typescript.js",
    "./node_modules/@airbnb/config-eslint/lib/presets/prettier.js",
    "prettier/@typescript-eslint",
    "prettier/unicorn"
  ],
  "settings": {
    "import/resolver": {
      "babel-module": {}
    }
  },
  "rules": {
    "arrow-parens": [
      "warn",
      "as-needed"
    ]
  },
  "overrides": [
    {
      "files": "./packages/generator-superset/**/*.test.{js,jsx,ts,tsx}",
      "rules": {
        "jest/expect-expect": "off"
      }
    },
    {
      "files": "**/test/**/*",
      "rules": {
        "import/no-extraneous-dependencies": "off",
        "promise/param-names": "off",
        "jest/require-to-throw-message": "off",
        "jest/no-test-return-statement": "off",
        "jest/no-expect-resolves": "off",
        "@typescript-eslint/no-require-imports": "off",
        "global-require": "off"
      }
    },
    {
      "files": "*.{js,jsx,ts,tsx}",
      "rules": {
        "import/extensions": "off",
        "no-plusplus": "off",
        "react/jsx-no-literals": "off",
        "@typescript-eslint/no-explicit-any": [
          "warn",
          {
            "fixToUnknown": false
          }
        ]
      }
    },
    {
      "files": "./scripts/*",
      "env": {
        "node": true
      }
    }
  ]
};