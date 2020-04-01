const path = require('path')
const glob = require('glob')
const download = require('./download')
const inquirer = require('inquirer')
const prompt = require('./prompt')
const {
  inspectFileType
} = require('./tools')
const generator = require('./generator')
const ora = require('ora');
const chalk = require('chalk');
const rm = require('rimraf').sync;
const install = require("./installDep");


const spinner = ora({
  text: chalk.green('loading...')
})


/**
 * @param {string} name 项目名称
 * 
 * @public  判断项目是否存在
 * */
const inspectName = async name => {
  const list = glob.sync('*')
  const rootPath = process.cwd()
  let rootName = path.basename(rootPath)
  if (list.length) {
    let fileName = path.resolve(rootPath, path.join('.', name))
    const isDir = inspectFileType(fileName) && list.includes(name)
    if (isDir) {
      rm(fileName)
    }
    rootName = name
  } else if (rootName === name) {
    rootName = '.'
  } else {
    rootName = name
  }
  return rootName
}

/**
 * @param {string} projectName 项目名称
*/

module.exports = async (projectName, options) => {
  const cwd = options.cwd || process.cwd() //当前目录
  const inCurrent = projectName === '.' //是否在当前目录
  const name = inCurrent ? path.relative('../', cwd) : projectName; // 项目名称
  const rootName = await inspectName(name)
  if (rootName) {
    const answer = await inquirer.prompt(prompt);
    try {
      spinner.start(chalk.greenBright('开始下载模板！'));
      spinner.color = 'yellow';
      const url = await download(rootName);
      console.log(answer.lang)
      if(answer.lang !== "TypeScript") {
        rm(`${url}/react-template/tsconfig.json`)
      }
      spinner.succeed(chalk.green('模板下载完成！'));
      console.log(`🚀  Invoking generators...`)
      await generator({
        projectName,
        ...answer
      }, rootName, rootName);
      await install(rootName)
    } catch (error) {
      console.log(error)
      spinner.fail(chalk.redBright('项目初始化失败!'))
    }

  }
}