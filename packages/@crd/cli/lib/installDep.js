const {
  hasYarn
} = require('./tools');
const exec = require('execa');

// 安装项目依赖 rootName 安装目录

module.exports = async (rootName) => {
  let cmd = "yarn"
  if (!hasYarn) {
    cmd = "npm"
  }
  await exec.sync(cmd, ['install'], {
    cwd: `./${rootName}`
  }, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}