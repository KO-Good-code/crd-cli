const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const htmlPath = path.resolve('public/index.html');
const CSSExtractPlugin = require('mini-css-extract-plugin')

module.exports = webpackConfig => {

  // 对语言样式 css 进行模块化
  function createCSSRule(lang, test, loader, options) {

    const baseRule = webpackConfig.module.rule(lang).test(test);

    // const modulesRule = baseRule.oneOf('modules').resourceQuery(/module/);
    // const normalRule = baseRule.oneOf('normal');

    applyLoaders(baseRule)
    // applyLoaders(normalRule)

    function applyLoaders (rule) {
      rule.use('extract-css-loader').loader(CSSExtractPlugin.loader)
  
      rule.use('css-loader')
        .loader(require.resolve('css-loader'))
      rule.use('postcss-loader').loader(require.resolve('postcss-loader')).options({
        plugins: [require.resolve('autoprefixer')]
      })
  
      if (loader) {
        rule.use(loader).loader(loader)
      }
    }
    
  }

  const extractOptions = {
    filename: 'css/[name].[hash:4].css',
  }

  createCSSRule('css', /\.css$/)
  createCSSRule('postcss', /\.p(ost)?css$/)
  createCSSRule('scss', /\.scss$/, 'sass-loader')
  webpackConfig
    .context(process.cwd())
    .entry('app')
      .add('./src/main.js')
      .end()
  webpackConfig.resolve
    .extensions
      .merge(['.mjs', '.js', '.jsx', '.vue', '.json', '.ts', '.tsx'])
      .end()
    .alias
      .set('@', path.resolve('src'));
  //  set module img
  webpackConfig.module
    .rule('images')
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options(
          {
            limit: 10000,    // 10Kb
            name: `/images/[hash:8].[name].[ext]`
          }
        )
        .end()
  webpackConfig.module.rule('ts')
      .test(/\.tsx?$/)
      .use('ts-loader')
         .loader('ts-loader')
  
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
      .end()
    .plugin('extract-css')
      .use(require('mini-css-extract-plugin'), [extractOptions])
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