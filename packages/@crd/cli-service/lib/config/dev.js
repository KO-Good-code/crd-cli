
module.exports = (webpackConfig) => {
  const options = {
    contentBase: './dist',
    hot: true,
    host: '0.0.0.0',
    overlay: true,
    stats: "errors-only",
    clientLogLevel: "none",
    progress: true,
    port: 8000,
  };
  webpackConfig
    .mode('development')
    .output
      .path('/dist')
      .filename('[name].bundle.js')
      .end()
    .devServer
      .hot(options.hot)
      .contentBase(options.contentBase)
      .host(options.host)
      .overlay(options.overlay)
      .stats(options.stats)
      .clientLogLevel(options.clientLogLevel)
      .progress(options.progress)
      .port(options.port)
      .end()
    .devtool('cheap-module-eval-source-map')
}