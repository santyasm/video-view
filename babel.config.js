const rootImportOpts = {
  root: __dirname,
  rootPathSuffix: './src',
  rootPathPrefix: '@/',
};

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }
    ],
    ['babel-plugin-root-import', rootImportOpts],
  ],
};
