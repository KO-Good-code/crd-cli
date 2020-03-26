#! /usr/bin/env node

const commander = require('commander');

commander.version('1.0.0')
  .command('init <extensionId>')
  .description('init extension project')
  .action( (name, cmd) => {
    const options = cmd

    if(process.argv.includes('-g') || process.argv.includes('--git')) {
      options.forceGit = true
    }

    require('./lib/create')(name, options)
  })
  .parse(process.argv);
