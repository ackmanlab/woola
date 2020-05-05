const path = require('path')
const fm = require('front-matter')
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
.use(require('@iktakahiro/markdown-it-katex'))

const re = /(<a href=["'].+)\.md(["']>)/g;

function setMetadata (page, options=null) {
  if ( !options ) {
    options = {
      defaults: {
        categories: ['public'],
        layout: 'post'
      }
    }
  }

  // Check for metadata key:value pairs and setup defaults if needed
  // Set page build:
  if (!('build' in page) || page['build'].length < 1) {page.build = options.defaults.build}
  if (!('index' in page)) {page.index = true} //check for index key existence, used to set whether page gets added to home layout index pages

  // Set page categories:
  let defaultCategories = new Set(options.defaults.categories)
  if (!page['categories']) {
    page.categories = options.defaults.categories
  } else if (typeof(page.categories === 'string')) {
    page.categories = Array.from([page.categories])
  }
  page.categories.forEach(category => { defaultCategories.add(category) })
  
  // Set page file name, layout, and other metadata:
  const subDir = (page.categories.find(category => { return (category !== 'public') })) || ''
  page.file = path.join(subDir, page.file)
  if (!page['layout']) {page.layout = options.defaults.layout}
  if (!page['url']) {page.url = page.file}
  if (!page['title']) {page.title = ''}
  if (!page['author']) {page.author = ''}

  // Set metadata date obj and make default if needed (parsed from filename or current date):
  if (!page['date'] && !page.file.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}[-_]/,'')) {
    page.date = new Date()
  } else if (!page['date']) {
    page.date = new Date(page.file.substr(0,10))
  }

  //TODO: hoist this mdlink/internal wiki link replacement out to mdbuild.js to look for correct relative page links in among all present categories. 
  //TODO: use cherrio instead for html element find/replace (in case matching link syntax is used in pre elements for code demonstrations?
  if (("mdlink" in options) && options.mdlink) {
    page.content = page.content.replace(re, '$1.html$2')
  }

  return page
}

function mdparse (data, file, options=null) {
  try {
    //parse dataObj yaml header and content into dataObj.attributes and dataObj.body
    const dataParse = fm(data)
    const page = {}
    page.file = path.parse(file).name + '.html'
    page.content = md.render(dataParse.body)

    // Hoist metadata attributes from front-matter() to parent level of page object
    Object.keys(dataParse.attributes).forEach(key => {
      return (page[key] = dataParse.attributes[key])
    })
    
    return setMetadata(page, options)

  } catch (err) {
    console.log(`Warning: ${err.name} file: ${file}\n  ${err.reason}, continuing with entire file...\n`)

    const page = {}
    page.file = path.parse(file).name + '.html'
    page.content = md.render(data)
    
    return setMetadata(page, options)
  }

}

module.exports = mdparse
