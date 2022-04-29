module.exports = function (flags,term,site) {

const http = require('http')
const open = require('open')
const connect = require('connect')
const path = require('path')
const fs = require('fs')
const micromatch = require('micromatch')
const send = require('send')
// const jsdom = require('jsdom')
const openPort = require('openport')

const mdparse = require('./mdparse.js')
const watch = require('./watch.js')
const writepdf = require('./writepdf.js')

// Setup global var definitions
let connectApp
let httpPort

// readFile: reads utf8 content from a file
const readFile = (fileName) => new Promise((resolve, reject) => {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) reject(err)
    resolve(data)
  })
})

// hasMarkdownExtension: check whether a file is Markdown type
const hasMarkdownExtension = (fileName) => {
  const fileExtension = path.extname(fileName).toLowerCase()
  let extensionMatch = false

  site.markdownExtensions.forEach(extension => {
    if (extension === fileExtension) {
      extensionMatch = true
      }
    })
  return extensionMatch
}

// markdownToHTML: turns a Markdown file into HTML content
const markdownToHTML = (data, fileName) => new Promise(resolve => {
  resolve(mdparse(data, fileName, false))
})

// linkify: converts markdown links with a 'file:///' uri to .md links
// const linkify = (page) => new Promise((resolve, reject) => {  
//   jsdom.env(page.content, (err, window) => {
//     if (err) {
//       return reject(err)
//     }

//     const links = window.document.getElementsByTagName('a')
//     const l = links.length

//     let href
//     let link
//     let markdownFile
//     let mdFileExists
//     let relativeURL
//     let isFileHref

//     links.forEach(link, () => {
//       if (path.ext(link) === '.md') {
//         isFileHref = link.href.substr(0, 8) === 'file:///'
//         markdownFile = link.href.replace(path.join('file://', __dirname), site.baseDir) + '.md'
//         mdFileExists = fs.existsSync(markdownFile)
//         // TODO: check category file locaation, requires initializing site.pages array
//         if (isFileHref && mdFileExists) {
//           relativeURL = link.href.replace(path.join('file://', __dirname), '') + '.md'
//           link.href = relativeURL
//         }
//       }
//     })
//     page.content = window.document.getElementsByTagName('body')[0].innerHTML
//     resolve(page)
//   })
// })


// ---START main build function---
const buildHTMLFromMarkDown = (fileName, query) => new Promise(resolve => {

  const stack = [
    // Article
    readFile(fileName)
      .then(data => { return markdownToHTML(data, fileName) }),
      // .then(linkify),

    // Header
    flags.header && readFile(flags.header)
      .then(data => { return markdownToHTML(data, fileName) }),
      // .then(linkify),

    // Footer
    flags.footer && readFile(flags.footer)
      .then(data => { return markdownToHTML(data, fileName) }),
      // .then(linkify),

    // Navigation
    flags.navigation && readFile(flags.navigation)
      .then(data => { return markdownToHTML(data, fileName) })
      // .then(linkify)
  ]

  Promise.all(stack).then(dataArr => {
    const page = dataArr[0]
    const dirs = fileName.split('/')
    
    console.log(
`title: ${page.title}
url: ${page.url}
tags: ${page.tags}
date: ${page.date}
author: ${page.author}`)

const head = (
// <-- template literal block
`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${page.title}</title>
  <meta name="description" content="${page.tags}">
  <meta name="author" content="${page.author}">
  <link rel="stylesheet" href="http://${flags.address}:${httpPort}/css/katex.min.css">
 
 <script src="http://${flags.address}:${httpPort}/css/highlight.pack.js"></script>
  <link rel="stylesheet" href="http://${flags.address}:${httpPort}/css/github-gist.css">
  <link rel="stylesheet" href="${site.cssURI}">
</head>`
)

const dropMenu = {
  pdf: fileName.slice(2) + '?pdf'
}

const dropMenuhtml = (

// <-- template literal block
`<script>
  function buildMenu() {
    const menuDiv = document.getElementById("dropmenu")
    if ( menuDiv != null && menuDiv.children.length > 0 && menuDiv.children.length < 3 ) {
      const list = document.querySelectorAll("h1, h2, h3, h4")
      let innerText = ''
      list.forEach(item => {
        const currLev = item.tagName.toLowerCase()
        const node = document.createElement("li")
        node.setAttribute("class","dropmenulink")
        const ref = document.createElement("a")
        ref.setAttribute("href","#" + item.id)
        if (currLev === 'h1') {
          innerText = item.textContent
        } else if (currLev === 'h2') {
          innerText = "\xA0\xA0" + item.textContent
        } else if (currLev === 'h3') {
          innerText = "\xA0\xA0\xA0\xA0" + item.textContent
        } else {
          innerText = "\xA0\xA0\xA0\xA0\xA0\xA0" + item.textContent
        }
        const textnode = document.createTextNode(innerText)
        ref.appendChild(textnode)
        node.appendChild(ref)
        document.getElementById("dropmenu").appendChild(node)
      })
      // menuDiv.addEventListener('click', menuToggle, false)
      menuDiv.addEventListener('keydown', onMenuKeyDown)
    }
    document.addEventListener('keydown', onDocumentKeyDown)
  }

  function onDocumentKeyDown(event) {
    switch(event.key){
      case 'm':
        menuToggle()
        // event.preventDefault()
      break

      case 'esc':
        menuToggle()
        // event.preventDefault()
      break
    }  
  }

  function onMenuKeyDown(event) {
    const menuDiv = document.getElementById("dropmenu")
    const menuList = menuDiv.querySelectorAll(".dropmenulink")
    if (menuList) {
      //skip between top and botttom menu items with up and down arrow keys
      switch (event.key) {
        case 'ArrowUp': //up arrow code 38
          menuList[0].firstElementChild.focus()
        break

        case 'ArrowDown': //down arrow code 40
          menuList[menuList.length-1].firstElementChild.focus()
        break
      } 
    } 
  }

  function menuToggle() {
    const menuDiv = document.getElementById("dropmenu")
    menuDiv.classList.toggle('show')
    // menuDiv.lastElementChild.firstElementChild.focus()
    const menuItem = menuDiv.querySelector(".dropmenulink")
    if (menuItem) { menuItem.firstElementChild.focus() }
    if (!menuDiv.classList.contains("show")) {
      document.getElementById("dropmenubutton").blur()
    }
  }

  window.onload = buildMenu
</script>

<div class="btn-group">
  <button type="button" onclick="menuToggle()" id="dropmenubutton" class="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" tabindex="-1">
    <span class="glyphicon glyphicon-menu-hamburger"></span>
  </button>

  <ul class="dropdown-menu" id="dropmenu" role="menu" tabindex="-1" >
    <li><a href="${dropMenu.pdf}"><span class="glyphicon glyphicon-print"></span> pdf</a></li>
    <li role="separator" class="divider"></li>
  </ul>
</div>`)

const sockethtml = (
`<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io.connect('/');
  socket.on('reload', function() { location.reload() });
</script>`)

    let header
    let footer
    let navigation
    let outputHtml

    if (flags.header) {
      header = dataArr[1]
    }

    if (flags.footer) {
      footer = dataArr[2]
    }

    if (flags.navigation) {
      navigation = dataArr[3]
    }

    //setup html and document body
    if (query === 'print') {
      outputHtml = (
`${head}
<body>
  <article class="markdown-body">
  ${page.content}
  </article>
</body>
<script>hljs.initHighlightingOnLoad()</script>
</html>`)
    } else {

      outputHtml = (
`${head}
<body>
  ${sockethtml}
  ${dropMenuhtml}
  <article class="markdown-body">
  ${page.content}
  </article>
</body>
<script>hljs.initHighlightingOnLoad()</script>
</html>`)

    }
    resolve(outputHtml)
  })
  .catch (err => { console.log(err) })
})
// ---END main build---



// Create pdf file and save locally on server
const printPDF = (fileName, res, query) => buildHTMLFromMarkDown(fileName, query)
  .then(html => {
    // res.writeHead(200)
    res.end(html)
    const localurl = 'http://' + flags.address + ':' + httpPort + '/' + path.parse(fileName).base + '?pdf'
    const outFile = path.join(path.parse(fileName).dir, path.parse(fileName).name + '.pdf')
    try {
      writepdf(localurl, outFile, site.pdfconfig[site.pdfconfig.use])
    } catch (err) {
      console.log('No default pdfconfig.use value found...')
      writepdf(localurl, outFile)
    }
  })
  .catch (err => {
    term.errmsg('error')
    .write('Can\'t print pdf: ', err)
    .reset().write('\n')
  })

// Begin markdown compilation process, then send result when done...
const compileAndSendMarkdown = (fileName, res, query) => buildHTMLFromMarkDown(fileName, query)
  .then(html => {
    res.writeHead(200)
    res.end(html)
  })
  .catch (err => {
    term.errmsg('error')
    .write('Can\'t build HTML: ', err)
    .reset().write('\n')
  })

//setup list object for initial directory index listing
const compileAndSendDirectoryListing = (fileName, res) => {
  const excludeList = site.options.ignore
  const urls = fs.readdirSync(fileName)
  let list = '\n    <ul id="files">\n'

  urls.forEach(subPath => {
    const isDir = fs.statSync(fileName + subPath).isDirectory()
    let href
    if ( isDir && !excludeList.includes(path.parse(subPath).base) ) {
      href = subPath + '/'
      list += `    <li class="dir"><a href="${href}">${href}</a></li> \n`
    } else {
      href = subPath
      if (subPath.split('.md')[1] === '') {
        list += `    <li class="md"><a href="${href}">${href}</a></li> \n`
      } else if ( !excludeList.includes(path.parse(subPath).base) ) {
        list += `    <li class="file"><a href="${href}">${href}</a></li> \n`
      }
    }
  })
  list += '    </ul>\n'

  //setup template literal for initial directory listing
  const html = (

`<!DOCTYPE html>
<html>
<head>
  <title>${fileName}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="${site.cssURI}">

  <style>
  .highlight-search {
    background: #FFFF99;
  }
  </style>

  <script>

    var timer;
    function makeDelay(ms) {
      return function(callback){
        clearTimeout (timer)
        timer = setTimeout(callback, ms)
      };
    };

    var itemIndex = 0
    function search() {
      var str = document.getElementById('searchbox').value.toLowerCase()
      var links = document.getElementById('files').querySelectorAll('a')

      links.forEach(item => {
        var text = item.textContent.toLowerCase().replace(/[-_]/g, ' ')

        if (str.length && ~text.indexOf(str)) {
          //add new class
          var classes = item.getAttribute('class')
          item.setAttribute('class', classes ? classes + ' ' + 'highlight-search' : 'highlight-search')
        } else {
          //remove new class
          var classes = (item.getAttribute('class')) ? item.getAttribute('class').split(/\s+/) : [null]
          classes.filter((curr) => {
            return curr != 'highlight-search'
          });
          item.setAttribute('class', classes.join(' '))
          itemIndex = 0
        }
      })
      if (document.querySelector('.highlight-search')) document.querySelectorAll('.highlight-search')[itemIndex].focus()
    }
  
    function onDocumentKeyUp(event) {
      switch(event.key){
        case 's':
          document.getElementById('searchbox').focus()
        break

        case 'g':
          if (document.querySelector('.highlight-search')) {
            const matchArray = document.querySelectorAll('.highlight-search')  
            matchArray[(itemIndex < matchArray.length-1) ? itemIndex+=1 : itemIndex].focus()
          }
        break

        case 'b':
          if (document.querySelector('.highlight-search')) {
            const matchArray = document.querySelectorAll('.highlight-search') 
            matchArray[(itemIndex > 0) ? itemIndex-=1 : itemIndex].focus()
          }
        break
      }
    }


    function onDocumentKeyDown(event) {
      if (event.repeat && event.key==='g') {
        if (document.querySelector('.highlight-search')) {
          const matchArray = document.querySelectorAll('.highlight-search')  
          matchArray[(itemIndex < matchArray.length-1) ? itemIndex+=1 : itemIndex].focus()
        }
      } else if (event.repeat && event.key==='b') {
        if (document.querySelector('.highlight-search')) {
          const matchArray = document.querySelectorAll('.highlight-search') 
          matchArray[(itemIndex > 0) ? itemIndex-=1 : itemIndex].focus()
        }
      }
    }

    function addListeners() {
      var delay = makeDelay(250)
      document.getElementById('searchbox').addEventListener('keyup', () => { delay(search) })
      document.getElementById('searchbox').addEventListener('keydown', () => { clearTimeout(timer) })
      document.addEventListener('keyup', onDocumentKeyUp)
      document.addEventListener('keydown', onDocumentKeyDown)
    }

    window.onload = addListeners
  </script>

</head>
<body>
<input id="searchbox" type="type" title="s: search, g: next, b: previous" placeholder="" autocomplete="off" />
  <article class="markdown-body">
    <h1>Index of ${fileName}</h1>
    ${list}
  </article>
</body>
</html>`

  )

  // Log if verbose
  if (flags.verbose) {
    term.msg('index').write(fileName).reset().write('\n')
  }

  // Send file
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.write(html)
  res.end()
}

// Remove URL params from file being fetched
const getPathFromUrl = url => {
  return url.split(/[?#]/)[0]
}


// http_request_handler: handles all the browser requests
const httpRequestHandler = (req, res) => {
  const originalUrl = getPathFromUrl(req.originalUrl)
  const query = req.originalUrl.split(/[?]/)[1]

  if (flags.verbose) {
    term.msg('request')
     .write(decodeURI(site.baseDir) + decodeURI(originalUrl))
     .reset().write('\n')
  }

  const fileName = decodeURI(site.baseDir) + decodeURI(originalUrl)

  try {
    // Test what filetype the browser is requesting
    const isDir = fs.statSync(fileName).isDirectory()
    const isMarkdown = hasMarkdownExtension(fileName)
    
    if (query === 'pdf') {
      // printPDF(fileName, res, query)
      const localurl = 'http://' + flags.address + ':' + httpPort + '/' + path.parse(fileName).base + '?print'
      const outFile = path.join(path.parse(fileName).dir, path.parse(fileName).name + '.pdf')
      writepdf(localurl, outFile, site.pdfconfig[site.pdfconfig.use])
      compileAndSendMarkdown(fileName, res, null)
    } else if ( query === 'print' ) {
      term.msg('markdown').write(fileName.slice(2)).reset().write('\n')
      compileAndSendMarkdown(fileName, res, query)
    } else if ( isMarkdown ) {
      term.msg('markdown').write(fileName.slice(2)).reset().write('\n')
      compileAndSendMarkdown(fileName, res, query)
    } else if ( isDir ) {
      // Index: Browser is requesting a Directory Index
      term.msg('dir').write(fileName).reset().write('\n')
      compileAndSendDirectoryListing(fileName, res)
    } else {
      // Other: Browser requests other MIME typed file (handled by 'send')
      term.msg('file').write(fileName.slice(2)).reset().write('\n')
      send(req, fileName).pipe(res)
      // send(req, fileName, {root: dir}).pipe(res)
    }    
  } catch (err) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    console.log(err)
    term.errmsg('404').write(fileName.slice(2)).reset().write('\n')
    res.write('404 :\'(')
    res.end()
    return
  }
}



// ---START connect app promise workflow definitions---
const startConnectApp = () => new Promise(resolve => {
  connectApp = connect()
    .use('/', httpRequestHandler)
  resolve(connectApp)
})


const findOpenPort = (range=[8000, 8100]) => new Promise((resolve, reject) => {
  const props = {
    startingPort: range[0],
    endingPort: range[1]
  }
  openPort.find(props, (err, port) => {
    if (err) { return reject(err) }
    httpPort = port
    resolve(httpPort)
  })
})


const startServer = () => new Promise(resolve => {
  const httpServer = http.createServer(connectApp)
  // httpServer = http.createServer(app)
  httpServer.listen(httpPort, flags.address, () => {
    console.log('port is: ' + httpPort)
  })
  resolve(httpServer)
})


const startLiveReloadServer = (httpServer) => new Promise(resolve => {  
  const io = require('socket.io')(httpServer)

  const watchConfig = {
    MarkconfDefaults: {
      watch: {
        ignore: site.options.ignore
      }
    }
  }
  const watcher = watch(watchConfig)
  
  const watchList = []
  const watchExtensions = site.markdownExtensions.map(x => { return ('**/*'+x) })
  watchExtensions.push('**/*.html')
  if (watchExtensions) {
    watchExtensions.forEach(filePattern => {
      watchList.push(path.join(site.rootDir, filePattern))
    })
  }

  const handleChanges = (changedFile, changeType) => {
    console.log(changedFile)
    const shortPattern = path.relative(site.rootDir, changedFile)
    // console.log(shortPattern) //debug
    const changed = micromatch(changedFile, watchList).length > 0
    // console.log(changed) //debug
    
    if (changed) {
      io.sockets.emit('reload')
    } else {
      console.log('Watch: found no rule')
    }
  }

  const watchDirs = []
  watchDirs.push(site.rootDir)
  resolve(watcher.create(watchDirs, handleChanges) )
})


const serversActivated = () => {
  const serveURL = 'http://' + flags.address + ':' + httpPort

  term.msg('start')
   .write('serving content from ')
   .fg.white().write(path.resolve(site.baseDir)).reset()
   .write(' on port: ')
   .fg.white().write(String(httpPort)).reset()
   .write('\n')

  term.msg('address')
   .underline().fg.white()
   .write(serveURL).reset()
   .write('\n')

  if (process.pid) {
    term.msg('process')
      .write('your pid is: ')
      .fg.white().write(String(process.pid)).reset()
      .write('\n')

    term.msg('info')
      .write('to stop this server, press: ')
      .fg.white().write('[Ctrl + C]').reset()
      .write(', or type: ')
      .fg.white().write('"kill ' + process.pid + '"').reset()
      .write('\n')
  }

  if (flags.file) {
    open(serveURL + '/' + flags.file)
  } else if (!flags.x) {
    open(serveURL)
  }
}



// run app
startConnectApp()
  .then(() => {
    if (flags.port === null) {
      return findOpenPort()
    } else {
      httpPort = flags.port
      return httpPort
    }
  })
  .then(startServer)
  .then(startLiveReloadServer)
  .then(serversActivated)
  .catch (err => { console.log(err) })

}
