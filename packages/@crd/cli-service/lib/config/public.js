const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const htmlPath = path.resolve('public/index.html')

module.exports = webpackConfig => {
  webpackConfig
    .mode('development')
    .context(process.cwd())
    .entry('app')
      .add('./src/main.js')
      .end()
  webpackConfig.resolve
    .extensions
      .merge(['.mjs', '.js', '.jsx', '.vue', '.json', '.wasm'])
      .end()
    .alias
      .set('@', path.resolve('src'));
  //  set module img
  webpackConfig.module
    .rule('images')
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options({
          name: 'images/[name].[ext]'
        });
  
  //  set   module babel  react  vue
  webpackConfig.module
    .rule('compile')
        .test(/\.js$/)
        .exclude
          .add(/node_modules/)
          .end()
        .use('babel')
          .loader('babel-loader')
          .options({
            presets: [
              ['@babel/preset-env', { modules: false }],
              "@babel/preset-react"
            ]
          })
  //  set html temp
  const htmlOptions = {
    template: htmlPath
  }
  webpackConfig
    .plugin('html')
      .use(HTMLPlugin, [htmlOptions])
  //  代码分割
  webpackConfig
    .optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: `chunk-common`,
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    })
    
}