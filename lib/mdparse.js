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
.use(require('markdown-it-katex'))

function setMetadata (page, options) {
  // Check for metadata key:value presence and make defaults if needed
  if (!page['categories']) {page.categories = options.defaults.categories}
  if (!page['layout']) {page.layout = options.defaults.layout}
  if (!page['url']) {page.url = '/'+page.file}
  if (!page['title']) {page.title = ''}
  if (!page['author']) {page.author = ''}

  // Check metadata date obj and make default if needed (parsed from filename or current date)
  if (!page['date'] && !page.file.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}[-_]/,'')) {
    page.date = new Date()
  } else if (!page['date']) {
    page.date = new Date(page.file.substr(0,10))
  }

  return page
}

function mdparse (data, file, options) {
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
