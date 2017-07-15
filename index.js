// Batch convert markdown files to html
// const mdbatch = require('markdown-batch')
// mdbatch(srcPath, dstPath, overwrite, extFilter, options)
// mdbatch('_posts', '_site', true)

// const srcPath = '_posts';
// const dstPath = '_site';
// const overwrite = true;
// const extFilter = ['*.md','*.txt','*.mmd','*.markdown'];

const fs = require('fs');
const path = require('path');
const mm = require('micromatch');
const fm = require('front-matter');
const md = require('markdown-it')({ 
  html: true,
  linkify: true,
  typographer: false
})
.use(require('markdown-it-anchor'))
.use(require('markdown-it-sub'))
.use(require('markdown-it-sup'))
.use(require('markdown-it-footnote'))
.use(require('markdown-it-deflist'))
.use(require('markdown-it-katex'));

const readFile = fileName => new Promise((resolve, reject) => {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

const writeFile = (fileName, datain) => new Promise((resolve, reject) => {
  fs.writeFile(fileName, datain, 'utf8', (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

const readdir = srcPath => new Promise((resolve, reject) => {
    fs.readdir(srcPath, (err, files) => {
        if (err) reject(err);
        else resolve(files);
    });
});

const handleFile = (data,file) => {
  try {
    // console.log(file);
    let content = fm(data);
    // let yamlObject = content.attributes; //yaml header as json
    // console.log(yamlObject);
    return content.body;
  } 
  catch (err) {
    console.log(`Warning: ${err.name} file: ${file}\n  ${err.reason}, continuing with entire file...\n`);
    return data;
  };
};


const processFiles = (srcPath, dstPath, extFilter, options) => {
  //async process chain begin
  readdir(srcPath)
  .then(allfiles => { return mm(allfiles,extFilter,options) })
  .then(files => {
    files.forEach(file => {
      readFile(path.join(srcPath,file))
      .then(data => { return handleFile(data,file) })
      .then(text => { return md.render(text) })
      .then(html => {
          writeFile(path.join(dstPath,path.parse(file).name + '.html'), html);
          // console.log( file + ': ' + data.substr(0,20))
      });
    });
  })
  .catch (err =>{ console.log(err) });
};

function markdownBatch(
  srcPath='.', 
  dstPath='_site', 
  overwrite=false, 
  extFilter=['*.md','*.txt','*.mmd','*.markdown'],
  options={matchBase: false, ignore: ['.git', 'node_modules', 'README.md', 'test', 'lib', 'css']}
  ) {
  //app start
  fs.mkdir(dstPath, (err, undefined) => {
      if (err && !overwrite) {
        console.log(`Error: ${err.message}. No files processed since overwrite: ${overwrite}`);
      } else if (err && overwrite) {
        console.log(`Warning: ${err.message}. Overwriting files since overwrite: ${overwrite}`);
        processFiles(srcPath, dstPath, extFilter, options);
      } else {
        processFiles(srcPath, dstPath, extFilter, options);
      }
  });
}

module.exports = markdownBatch;
