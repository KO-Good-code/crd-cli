const download = require('download-git-repo');
const path = require('path')

/**
 * @param {string} target 下载输出的目录
*/

module.exports = async (target = '.') => {
  let el = path.join(target)
  return new Promise((resolve, reject) => {
    download('direct:https://github.com/KO-Good-code/react-template.git',
        el, { clone: true }, (err) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        // 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
        resolve(el)
      }
    })
  })
}