const path = require("path");
const merge = require('webpack-merge');
const Config = require('webpack-chain');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const debug = require('debug');
const chalk = require('chalk');
const dev = require('./config/dev')
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

    } else {
      this.webpackChainFns.push(dev);
      const options = {
        contentBase: './dist',
        hot: true,
        host: 'localhost',
        overlay: true,
        stats: "errors-only",
        clientLogLevel: "none",
        open: true,
        progress: true,
        // useLocalIp: true
      };
      const r = this.resolveWebpackConfig()
      this.devServer(r, options)
    }

  }

  //  webpack 服务启动
  devServer(config, options) {
    const compiler = webpack(config);
    const server = new webpackDevServer(compiler, options);
    server.listen(8000, '127.0.0.1', () => {
      console.log("Starting server on:")
      console.log(chalk.greenBright('local: http://localhost:8000'));
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

    load(basePath)



  }

  async run(name, args = {}, rawArgy = []) {
    const mode = args.mode || (name === 'build' && args.watch ? 'development' : this.modes[name])
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
      console.log(fileConfig)
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