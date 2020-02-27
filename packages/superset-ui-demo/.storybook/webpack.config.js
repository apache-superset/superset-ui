module.exports = async ({ config }) => {
  config.module.rules[0].use[0].options.presets = [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: 3,
      loose: true,
      modules: false,
      shippedProposals: true,
      targets: false
    }],
    '@babel/preset-react',
  ];
  config.module.rules[0].use[0].options.plugins = [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    ["@babel/plugin-transform-runtime", { "corejs": 3 }]
  ];

  config.module.rules.push({
    use: {
      loader: require.resolve('babel-loader'),
      options: {
        presets: [
          ['@babel/preset-env', {
            useBuiltIns: 'usage',
            corejs: 3,
            loose: true,
            modules: false,
            shippedProposals: true,
            targets: false
          }],
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
        plugins: [
          '@babel/plugin-proposal-object-rest-spread',
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-syntax-dynamic-import',
          ["@babel/plugin-transform-runtime", { "corejs": 3 }]
        ],
      }
    },
    test: /\.tsx?$/,
    exclude: /node_modules/,
  });

  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
