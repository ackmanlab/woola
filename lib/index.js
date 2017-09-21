#!/usr/bin/env node
const flags = require('commander')
const ansi = require('ansi')
const cursor = ansi(process.stdout)
const pkg = require('../package.json')

// optional arguments
flags
  .version(pkg.version)
  .option('-b, --build', 'Build and write html to path {site.options.dstPath}')  
  .option('-c, --config [type]', 'config.js path [config]', null)  
  .option('-d, --dir [type]', 'Serve from directory [dir]', './')
  .option('-s, --css [type]', 'uri path to css styles [css]', null)  
  .option('-p, --port [type]', 'Serve on port [port]', null)
  .option('-a, --address [type]', 'Serve on ip/address [address]', 'localhost') //localhost or 127.0.0.1
  .option('-h, --header [type]', 'Header .md file', null)
  .option('-r, --footer [type]', 'Footer .md file', null)
  .option('-n, --navigation [type]', 'Navigation .md file', null)
  .option('-f, --file [type]', 'Open specific file in browser [file]')
  .option('-x, --x', 'Don\'t open browser on run.')
  .option('-v, --verbose', 'verbose output')
  .parse(process.argv)

const term = {
  // Terminal Output Messages
  msg: function(type) {
    cursor
      .bg.green()
      .fg.black()
      .write(' server ')
      .reset()
      .fg.white()
      .write(' ' + type + ': ')
      .reset()
    return cursor
  },
  errmsg: function(type) {
    cursor
      .bg.red()
      .fg.black()
      .write(' server ')
      .reset()
      .write(' ')
      .fg.black()
      .bg.red()
      .write(' ' + type + ': ')
      .reset()
      .fg.red()
      .write(' ')
    return cursor
  }
}

const site = require('./appconfig.js')(flags)

if (flags.build) {
  const mdbuild = require('./mdbuild.js')
  mdbuild(site)
} else {
  const server = require('./server.js')
  server(flags,term,site)
}
