const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars');
const rm = require('rimraf').sync

/**
 * @param {Object} metadata 模板对应的引射变量
 * @param {string} src 模板文件对应的文件夹
 * @param {string} dest 合成之后输出的文件夹
*/

module.exports = async (metadata = {}, src, dest = '.') => {
  if (!src) {
    return Promise.reject(new Error(`无效的source：${src}`))
  }

  // const url = metadata.template === 'react' ? `${src}/react-template` : `${src}/vue-template`
  const url = `${src}/react-template`

  return new Promise((resolve, reject) => {
    
    Metalsmith(process.cwd())
      .metadata(metadata)
      .clean(false)
      .source(url)
      .destination(dest)
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata()
        Object.keys(files).forEach(fileName => {
          
          const t = files[fileName].contents.toString()
          Handlebars.registerHelper("if_eq", (left, right, options) => {
            if(left === right ) {
              return options.fn(this);
            }else{
              return options.inverse(this);
            }
          })
          files[fileName].contents = new Buffer.from(Handlebars.compile(t)(meta))
        })
        done()
      }).build(err => {
        rm(url)
        err ? reject(err) : resolve()
      })
  })

}