// Batch process files, e.g. markdown to html
// const mdbatch = require('mdbatch')
// mdbatch(srcPath, dstPath, overwrite, extFilter, site.options)
// mdbatch('_posts', '_site', true)

const fs = require('fs')
const path = require('path')
const mm = require('micromatch')

//TODO: replace utf8 default with config.js or arg input for batch handling of other file types (images, etc)
const readFile = (fileName) => new Promise((resolve, reject) => {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) reject(err)
    else resolve(data)
  })
})

const writeFile = (fileName, datain) => new Promise((resolve, reject) => {
  fs.writeFile(fileName, datain, 'utf8', (err, data) => {
    if (err) reject(err)
    else resolve(data)
  })
})

const readdir = (srcPath) => new Promise((resolve, reject) => {
    fs.readdir(srcPath, (err, files) => {
        if (err) reject(err)
        else resolve(files)
    })
})


// .then(datain => { try {
//   return site.options.handleFile(datain,file,dstPath)
//   } catch (err) {
//      err;
//     }
//   })

const buildDataArray = (files, options) => new Promise((resolve, reject) => {
  const promiseStack = []
  // create promise array
  files.forEach(file => promiseStack.push(
    readFile(path.join(options.srcPath,file))
    .then(datain => { return options.handleFile(datain,file,options) })
  ))
  //ext html needed in dataout.obj
  Promise.all(promiseStack).then(resultObj => {
    resolve(resultObj)})
})



const processFiles = (site,callback) => {
  //async process chain begin
  readdir(site.options.srcPath)
  .then(allfiles => { return mm(allfiles,site.options.extFilter,site.options) })
  .then(files => { return buildDataArray(files,site.options) })
  .then(resultsArray => { return site.options.handleStack(resultsArray) })
  .then(resultsArray => {
    resultsArray.forEach(f => {
      // console.log( f.file + ': ' + f.url)
      writeFile(path.join(site.options.dstPath,f.file), f.content)
    })
  })
  .then(() => {
    console.log('mdbatch is finished')
    if (typeof callback === 'function') {
      callback(site)
    }
  })
  .catch (err => { console.log(err) })
}

function batchfiles (site,callback) {
  //app start
  fs.mkdir(site.options.dstPath, (err) => {
      if (err && !site.options.overwrite) {
        console.log(`Error batchfiles: ${err.message}. No files processed since overwrite: ${site.options.overwrite}`)
      } else if (err && site.options.overwrite) {
        console.log(`Warning batchfiles: ${err.message}. Overwriting files since overwrite: ${site.options.overwrite}`)
        processFiles(site,callback)
      } else {
        processFiles(site,callback)
      }
  })
}

module.exports = batchfiles
