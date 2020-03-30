const {
  hasYarn
} = require('./tools');
const exec = require('execa');
const chalk = require('chalk');

// 安装项目依赖 rootName 安装目录

module.exports = async (rootName) => {
  let cmd = "yarn"
  if (!hasYarn) {
    cmd = "npm"
  }
  
  const r =  await exec(cmd, ['install'], {
    cwd: `./${rootName}`
  }).stdout
  r.on('data', data => {
    process.stdout.write(data);
  })
  r.on("end", data => {
      console.log('\t\t' + chalk.greenBright('cd\t' + rootName));
      console.log('\n\t\t' + chalk.greenBright('yarn start or npm start'));
  })
}