// Batch process files, e.g. markdown to html
// const mdbatch = require('mdbatch')
// mdbatch(srcPath, dstPath, overwrite, extFilter, options)
// mdbatch('_posts', '_site', true)

const fs = require('fs')
const path = require('path')
const mm = require('micromatch')

// TODO: replace utf8 default with config.js or arg input for batch handling of other file types (images, etc)
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

//ext html needed in dataout.obj

const processFiles = (srcPath, dstPath, extFilter, options) => {
  //async process chain begin
  readdir(srcPath)
  .then(allfiles => { return mm(allfiles,extFilter,options) })
  .then(files => {
    files.forEach(file => {
      readFile(path.join(srcPath,file))
      .then(datain => { return options.handleFile(datain,file) })
      .then(result => {
          writeFile(path.join(dstPath,path.parse(file).name + '.html'), result)
          // console.log( file + ': ' + data.substr(0,20))
      })
    })
  })
  .catch (err => { console.log(err) })
}

function batchfiles (
  srcPath='.', 
  dstPath='_site', 
  overwrite=false, 
  extFilter=['*.md','*.txt','*.mmd','*.markdown'],
  options={matchBase: false, ignore: ['.git', 'node_modules', 'README.md', 'test', 'lib', 'css', 'bin']}
  ) {
  //app start
  fs.mkdir(dstPath, (err, undefined) => {
      if (err && !overwrite) {
        console.log(`Error batchfiles: ${err.message}. No files processed since overwrite: ${overwrite}`)
      } else if (err && overwrite) {
        console.log(`Warning batchfiles: ${err.message}. Overwriting files since overwrite: ${overwrite}`)
        processFiles(srcPath, dstPath, extFilter, options)
      } else {
        processFiles(srcPath, dstPath, extFilter, options)
      }
  })
}

module.exports = batchfiles
