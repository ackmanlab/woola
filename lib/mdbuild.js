module.exports = function (site=null) {
const path = require('path')
const fs = require('fs')

if (!site) { site = require('./appconfig.js')() }

const mdparse = require('./mdparse.js')
const templates = require('./templates.js')
const mdbatch = require('./mdbatch-stack.js')

// const mdbatch = require('./lib/mdbatch.js')
// const htmlpage = templates.build.default(site, templates.includes, templates.layouts["post"], templates.helpers, 0)
// console.log(htmlpage)

// implement options for default category types here and config.js
site.options.handleFile = (data, file, options) => {
  return mdparse(data, file, options)
}


function mkdirpaths (targetDir) {
  const sep = path.sep
  const initDir = path.isAbsolute(targetDir) ? sep : ''
  targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(parentDir, childDir)
    if (!fs.existsSync(curDir)) {
      fs.mkdirSync(curDir)
    }
    return curDir
  }, initDir)
}

// TODO: make logic for separate template.build["masters"] here in handleStack
// [x] make category type directory builds across site.pages here in handleStack 2017-08-29 16:09:16
// TODO: implement search db functionality across site.pages here in handleStack and templates.js
// TODO: implement tag cloud and blob obj db functionality across site.pages should here in handleStack and templates.js
site.options.handleStack = (resultsArray) => {  
  let subCategories = new Set()
  try {
    site.pages = resultsArray;
    for (var i = 0; i < site.pages.length; i++) {
      // console.log(site.pages[i].file + " " + site.pages[i].date + " " + typeof(site.pages[i].date))
      site.pages[i].categories.forEach(category => { subCategories.add(category) })
      site.pages[i].content = templates.build.default(site, templates.includes, templates.layouts[site.pages[i].layout], templates.helpers, i)
    }
    subCategories.forEach( (category) => {
      //site.pages.push categories index listing page including
      site.pages.push({title: site.title, url: '/'+category+'/index.html', author: site.author, date: site.time, content: '', layout: 'page', file: path.join(category, 'index.html')})

      page.file = path.join(subDir, page.file)

      if (category !== 'public') {
        mkdirpaths(path.join(site.options.dstPath, category))
      }
    })
    return site.pages
  } catch (err) {
    console.log(err)
  }
}

// mdbatch(site.srcPath,site.dstPath,true,site.extFilter,site.options)
mdbatch(site.options)

// TESTING: make temporary css dir symlink. TODO: overwrite handling for symlinks (gives error)
// if (!site.cssURI.startsWith('http')) {
//   const cssDir = path.parse(site.cssURI).dir.split('/')[1] // dir.split gives [ '', 'css', 'build' ]
//   fs.symlinkSync(fs.realpathSync(cssDir), path.join(site.options.dstPath, cssDir))
// }

}