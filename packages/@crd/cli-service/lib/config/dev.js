
module.exports = (webpackConfig) => {
  webpackConfig
    .mode('development')
    .output
      .path('/dist')
      .filename('[name].bundle.js')
}