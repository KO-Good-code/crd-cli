const path = require("path");
const merge = require('webpack-merge');
const Config = require('webpack-chain');
const dotenv = require('dotenv');
const {
  LOCAL_IP
} = require('./tools');
const debug = require('debug');
const chalk = require('chalk');
const dev = require('./config/dev')
const pro = require('./config/pro')
const base = require('./config/public')
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server');


module.exports = class Server {
  constructor(context) {
    this.context = context
    this.webpackChainFns = []
    this.webpackRawConfigFns = []
    this.command = {}
  }
  // 配置初始化
  init(mode = process.env.CRD_CLI_MODE) {
    this.mode = mode;

    // load mode .env
    if (mode) {
      this.loadEnv(mode)
    }
    // load base .env
    this.loadEnv()
    // load user config
    const userConfig = this.loadUserOptions();

    this.webpackChainFns.push(base)
    this.webpackRawConfigFns.push(userConfig)
    if (process.env.NODE_ENV === 'production') {
      this.webpackChainFns.push(pro);
      const config = this.resolveWebpackConfig()
      webpack(config, (err, stats) => {
        if (err || stats.hasErrors()) {
          // 构建过程出错
          console.error(err)
          return;
        }
        console.log(stats.toString({
          chunks: false,  // 使构建过程更静默无输出
          colors: true,    // 在控制台展示颜色
          modulesSort: 'size',
          modules: false,
          moduleTrace: false
        }));
      });
    } else {
      this.webpackChainFns.push(dev);
      const r = this.resolveWebpackConfig()
      this.devServer(r)
    }

  }

  //  webpack 服务启动
  devServer(config) {
    const compiler = webpack(config);
    const devServer = config.devServer;
    const server = new webpackDevServer(compiler, devServer);
    server.listen(devServer.port, devServer.host, () => {
      console.log('\t-' + "Starting server on:")
      console.log('\t\t-' + chalk.greenBright('local: http://localhost:' + devServer.port));
      console.log('\n\t\t-' + chalk.greenBright('netWork: http://' + LOCAL_IP + ':' + devServer.port));
    });
  }

  // 获取环境变量  mode  环境变量
  loadEnv(mode) {

    const logger = debug('crd:env')
    const basePath = path.resolve(this.context, `.env${mode ? `.${mode}`: ''}`);

    const load = envPath => {
      try {
        const env = dotenv.config({
          path: envPath,
          debug: process.env.DEBUG
        })
        // dotenvExpand(env)
        logger(envPath, env)
      } catch (err) {
        if (err.toString().indexOf('ENOENT') < 0) {
          console.error(err)
        }
      }
    }
    load(basePath);

    // 默认的环境
    if (mode) {
      const defaultNodeEnv = (mode === 'production' || mode === 'test') ? mode : 'development';
      process.env.NODE_ENV = defaultNodeEnv;
    }
  }

  /**
   * @param {string} name 启动模式 start 开发 模式 build 生产
   * @param {object} args mode 自定义环境配置
   */
  async run(name, args = {}) {
    const mode = args.mode || (name === 'build' ? 'production' : 'development')
    this.init(mode)

  }

  //  webpack 内置配置初始化
  resolveChainableWebpackConfig() {
    const chainableConfig = new Config()
    // apply chains
    this.webpackChainFns.forEach(fn => fn(chainableConfig))
    return chainableConfig
  }

  resolveWebpackConfig(chainableConfig = this.resolveChainableWebpackConfig()) {
    let config = chainableConfig.toConfig()
    // const original = config

    this.webpackRawConfigFns.forEach(fn => {
      if (typeof fn === 'function') {
        const res = fn(config)
        if (res) config = merge(config, res)
      } else if (fn) {
        config = merge(config, fn)
      }
    })

    return config;
  }

  // 加载合并 用户的wenpack.config,js
  loadUserOptions() {
    const configPath = path.resolve(this.context, 'crd.config.js')
    let fileConfig;
    try {
      fileConfig = require(configPath);
      
      if (typeof fileConfig === 'function') {
        fileConfig = fileConfig()
      }
      if (!fileConfig || typeof fileConfig !== 'object') {
        console.error(
          `Error loading ${chalk.bold('crd.config.js')}: should export an object or a function that returns object.`
        )
        fileConfig = null
      }
    } catch (error) {
      console.error(`Error loading ${chalk.bold('crd.config.js')}:`)
      fileConfig = null
    }
    return fileConfig;
  }
}