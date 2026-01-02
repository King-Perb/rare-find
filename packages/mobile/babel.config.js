module.exports = function getBabelConfig(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { routerRoot: './src/app' }]
    ],
    plugins: [
      ['transform-inline-environment-variables', {
        include: ['EXPO_ROUTER_APP_ROOT', 'EXPO_ROUTER_IMPORT_MODE', 'EXPO_ROUTER_ABS_APP_ROOT']
      }]
    ]
  };
};
