#!/usr/bin/env node

const Server = require("../lib/server")

const rawArgv = process.argv.slice(2);

const service = new Server(process.cwd())

const mode = rawArgv.indexOf('--mode') > 0;

const args = mode && rawArgv[mode + 1] ? rawArgv[mode + 1] : null;

service.run(rawArgv[0], {
  mode: args
})