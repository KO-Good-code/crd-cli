const fs = require('fs');
const path = require('path');
const execa = require('execa');

const hasYarn = async () => execa.sync("yarn", ['v']).then(res => true).catch( err => false)


/*
 * ! @fileName 文件路径名
 */

const inspectFileType = async (fileName) => {
  let result;
  fs.stat(fileName, (err, stats) => {
    if (err) {
      return
    }
    result = stats && stats.isDirectory()
  })
  return result
}

module.exports = {
  inspectFileType,
  hasYarn
}