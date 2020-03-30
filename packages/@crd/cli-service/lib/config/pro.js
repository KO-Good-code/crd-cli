const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = (webpackConfig) => {
  const op = {
    uglifyOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'] // 移除console
      },
      output: {
        // 最紧凑的输出
        beautify: false,
        // 删除所有的注释
        comments: false,
      }
    }
  }
  webpackConfig
    .mode('production')
    .output
      .path(path.resolve(process.cwd() ,'./dist'))
      .filename('js/[name].bundle.[hash].js')
      .end()
    .plugin('Console')
      .use(UglifyJSPlugin, [op])
      .end()
    .plugin('clean')
      .use(CleanWebpackPlugin, [{
        cleanAfterEveryBuildPatterns: ['dist']
      }])
    
}