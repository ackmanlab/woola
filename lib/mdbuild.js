module.exports = function (site=null,callback) {
const path = require('path')
const fs = require('fs-extra')

if (!site) { site = require('./appconfig.js')() }

const mdparse = require('./mdparse.js')
const templates = require('./templates.js')
const mdbatch = require('./mdbatch-stack.js')

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

// TODO: implement search db functionality across site.pages here in handleStack and templates.js
// TODO: implement tag cloud and blob obj db functionality across site.pages should here in handleStack and templates.js
site.options.handleStack = (resultsArray) => {  
  let subCategories = new Set()
  try {
    site.pages = resultsArray
    site.pages.forEach( (page) => {
      page.categories.forEach(category => { subCategories.add(category) })
      page.content = templates.build[page.build](site, templates.includes, templates.layouts[page.layout], templates.helpers, page)
    })

    subCategories.forEach( (category) => {
      //site.pages.push categories index listing page including
      // console.log(category)
      const subDir = (category !== 'public') ? category+'/' : ''
      const newpage = {title: site.title, url: subDir+'index.html', author: site.author, date: site.time, content: '', layout: 'home', categories: [category], file: path.join(subDir, 'index.html')}
      newpage.content = templates.build[site.options.defaults.build](site, templates.includes, templates.layouts[newpage.layout], templates.helpers, newpage)
      site.pages.push(newpage)
      mkdirpaths(path.join(site.options.dstPath, subDir))
    })
    return site.pages
  } catch (err) {
    console.log(err)
  }
}

const buildResults = mdbatch(site,callback)

function copyAssets (site) {
  if (('buildAssets' in site.options) && site.options.buildAssets && site.options.overwrite) {
    site.options.buildAssets.forEach(f => {
      // console.log (path.join(site.options.dstPath,f))
      try {
        fs.copySync(f, path.join(site.options.dstPath,f))
      } catch (err) {
        console.log(`Warning: ${err.message}`)
      }
    })
  } else {
    console.log('site: options.buildAssets not found or overwrite equals false ')
  }
}
copyAssets(site)

return buildResults
}

// const copyAssets = (site) => new Promise((resolve,reject) => {
//   const promiseStack = []
//   // create promise array
//   site.options.buildAssets.forEach(f => promiseStack.push(
//     fs.copy(f, path.join(site.options.dstPath,f), err => {
//       if (err) reject(err)
//     })
//   ))
//   Promise.all(promiseStack).then(resultObj => {
//     resolve(resultObj)})
// })

// copyAssets(site)
//   .then(console.log('finished'))
//   .catch (err => { console.log(`Warning: ${err.message}`) })


// TESTING: make temporary css dir symlink. TODO: overwrite handling for symlinks (gives error)
// if (!site.cssURI.startsWith('http')) {
//   const cssDir = path.parse(site.cssURI).dir.split('/')[1] // dir.split gives [ '', 'css', 'build' ]
//   fs.symlinkSync(fs.realpathSync(cssDir), path.join(site.options.dstPath, cssDir))
// }

// return out
