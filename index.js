const path = require('path');
const site = require('./config.js');
const templates = require('./lib/templates.js')
// const mdbatch = require('./lib/mdbatch.js');
const mdbatch = require('./lib/mdbatch-stack.js');

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



site.options.handleFile = (data, file, options) => {
  const outputFileName = path.join(options.dstPath,path.parse(file).name + '.html');

  try {
    //parse dataObj yaml header and content into dataObj.attributes and dataObj.body
    const dataParse = fm(data);
    const page = {};
    page.file = path.parse(file).name + '.html';
    page.content = md.render(dataParse.body);

    // Hoist metadata attributes from front-matter() to parent level of page object
    Object.keys(dataParse.attributes).forEach(key => {
      return (page[key] = dataParse.attributes[key]);
    });
    
    // Check for metadata key:value presence and make defaults if needed
    if (!page['categories']) {page.categories = 'pri'};
    if (!page['layout']) {page.layout = 'post'};
    if (!page['url']) {page.url = '/'+page.file};
    if (!page['title']) {page.title = ''};
    if (!page['author']) {page.author = ''};

    // Check metadata date obj and make default if needed (parsed from filename or current date)
    if (!page['date'] && !page.file.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}[-_]/,'')) {
      page.date = new Date();
    } else if (!page['date']) {
      page.date = new Date(page.file.substr(0,10));
    };

    return page;

  } catch (err) {
    console.log(`Warning: ${err.name} file: ${file}\n  ${err.reason}, continuing with entire file...\n`);

    const page = {};
    page.file = path.parse(file).name + '.html';
    page.content = md.render(data);
    
    if (!page['categories']) {page.categories = 'pri'};
    if (!page['layout']) {page.layout = 'post'};
    if (!page['url']) {page.url = '/'+page.file};
    if (!page['title']) {page.title = ''};
    if (!page['author']) {page.author = ''};

    if (!page['date'] && !page.file.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}[-_]/,'')) {
      page.date = new Date();
    } else if (!page['date']) {
      page.date = new Date(page.file.substr(0,10));
    };
    
    return page;
  };
};


site.options.handleStack = (resultsArray) => {  
  try {
    site.pages = resultsArray;
    for (var i = 0; i < site.pages.length; i++) {
      // console.log(site.pages[i].file + " " + site.pages[i].date + " " + typeof(site.pages[i].date));
      site.pages[i].content = templates.build.default(site, templates.includes, templates.layouts[site.pages[i].layout], templates.helpers, i);
    };
    return site.pages;
  } catch (err) {
    console.log(err)
  };
};



// mdbatch(site.srcPath,site.dstPath,true,site.extFilter,site.options)
mdbatch(site.options);
