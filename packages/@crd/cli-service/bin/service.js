#!/usr/bin/env node

const Server = require("../lib/server")

const rawArgv = process.argv.slice(2);

const service = new Server(process.cwd())

service.run(rawArgv[0], {mode: 'pc'})

