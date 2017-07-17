const site = require('./config.js');
// const templates = require('thetawaves').templates;
// const mdbatch = require('thetawaves').mdbatch;

const templates = require('./lib/templates.js')
// const mdbatch = require('./lib/mdbatch.js');
const mdbatch = require('./lib/mdbatch-obj.js');

// const htmlpage = templates.build.default(site, templates.includes, templates.layouts["post"], templates.helpers, 0);
// console.log(htmlpage)

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


site.options.handleFile = (data, file) => {
  try {
    // console.log(file);
    const content = fm(data);
    // let yamlObject = content.attributes; //yaml header as json
    // console.log(yamlObject);
    const html = md.render(content.body);
    // return md.render(content.body);
    return ({
      content: html,
      file: file
    });
  } 
  catch (err) {
    console.log(`Warning: ${err.name} file: ${file}\n  ${err.reason}, continuing with entire file...\n`);
     const html = md.render(data);
    // return md.render(data);
    return ({
      content: html,
      file: file
    });    
  };

};


mdbatch(site.srcPath,site.dstPath,true,site.extFilter,site.options)