// read and setup config.js
const path = require('path')
const fs = require('fs')

module.exports = function appconfig (flags, baseDir, rootDir) {
  let site = { 
    options: {} 
  }
  const configPath = path.resolve(rootDir,'config.js')
  try {  
    site = require(configPath)
    site.time = new Date() 
  } catch (err) {
    errormsg('warning')
      .write('./config.js not found in current dir', err)
      .reset().write('\n')
  }

  if ( !("extFilter" in site.options) ) { site.options.extFilter = ['*.md','*.txt','*.mmd','*.markdown'] }
  if ( !("ignore" in site.options) ) { site.options.ignore = ['.DS_Store', '.git', '.gitignore', 'node_modules'] }
  site.markdownExtensions = site.options.extFilter.map(x => { return path.parse(x).ext })

  let cssURI = flags.css //e.g. /css/build/main.min.css
  const cssURIalternate = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
  //https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css
  if ( cssURI && cssURI.startsWith('http') ) {
    console.log('1 using: ' + cssURI)
  } else if ( cssURI ) {
    try {
        fs.statSync(path.resolve(rootDir,cssURI)).isFile()
        cssURI = path.join('/', baseDir, cssURI)
        console.log('2 using: ' + cssURI)
      } catch (err) {
        cssURI = cssURIalternate
        console.log('3 using: ' + cssURI)
      }
  } else if ( ("css" in site) && (site["css"].startsWith('http')) ) {
        cssURI = site["css"]
        console.log('4 using: ' + cssURI)
  } else if ( ("css" in site) ) {
    try {
        fs.statSync(path.resolve(rootDir,site["css"])).isFile()
        cssURI = path.join('/', baseDir, site["css"])
        console.log('5 using: ' + cssURI)
      } catch (err) {
        cssURI = cssURIalternate
        console.log('6 using: ' + cssURI)
      }
  } else {
    cssURI = cssURIalternate
    console.log('okay using: ' + cssURI)
  }

  site.cssURI = cssURI
  return site
}
