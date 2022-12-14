const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
module.exports = function override(config, env) {
  // 参数中的 config 就是默认的 webpack config
  console.log(6666);
  // 对 config 进行任意修改
  config.plugins.push(new NodePolyfillPlugin());
  
  // 一定要把新的 config 返回
  return config;
}

const { removeModuleScopePlugin } = require('customize-cra')

module.exports = removeModuleScopePlugin()