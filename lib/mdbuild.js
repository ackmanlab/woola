// const site = require('../config.js')
const path = require('path')
const site = require(path.resolve(process.cwd(),'./config.js'))
site.time = new Date()

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

// TODO: make logic for separate template.build["masters"] here in handleStack
// TODO: make category type directory builds across site.pages here in handleStack
// TODO: implement search db functionality across site.pages here in handleStack and templates.js
// TODO: implement tag cloud and blob obj db functionality across site.pages should here in handleStack and templates.js
site.options.handleStack = (resultsArray) => {  
  try {
    site.pages = resultsArray;
    for (var i = 0; i < site.pages.length; i++) {
      // console.log(site.pages[i].file + " " + site.pages[i].date + " " + typeof(site.pages[i].date))
      site.pages[i].content = templates.build.default(site, templates.includes, templates.layouts[site.pages[i].layout], templates.helpers, i)
    }
    return site.pages
  } catch (err) {
    console.log(err)
  }
}

// mdbatch(site.srcPath,site.dstPath,true,site.extFilter,site.options)
mdbatch(site.options)
