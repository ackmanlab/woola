const templates = {
  // ---template masters---
  build: {
    default: (site, includes, layout, helpers, idx) => {return (
  `<!DOCTYPE html>
  <html>
    ${includes.head(site, helpers, idx)}
    <body>
      ${includes.header(site, helpers)}
      <div class="page-content">
        <div class="wrapper">
          ${layout(site.pages[idx], helpers)}
        </div>
      </div>
      ${includes.footer(site, helpers)}
    </body>
  </html>`
    )}
  }
}


// ---template includes---
templates.includes = {

  head: (site, helpers, idx) => {
  let data = site.pages[idx];
  return (
`<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${helpers.pushPageTitle(site, data)}</title>
  <meta name="description" content="${helpers.pushPageDesc(site, data)}">
  <link rel="stylesheet" href="${site.baseurl}/css/main.css">
  <link rel="canonical" href="${site.url + site.baseurl + data.url}">
  <link rel="alternate" type="application/rss+xml" title="${site.title}" href="${site.url + site.baseurl}/feed.xml">
</head>`
  )},

  header: (site, helpers) => {return (
`<header class="site-header">
  <div class="wrapper">
    <a class="site-title" href="${site.baseurl}/">${site.title}</a>
    <nav class="site-nav">
      <a href="#" class="menu-icon">
        <svg viewBox="0 0 18 15">
          <path fill="#424242" d="M18,1.484c0,0.82-0.665,1.484-1.484,1.484H1.484C0.665,2.969,0,2.304,0,1.484l0,0C0,0.665,0.665,0,1.484,0 h15.031C17.335,0,18,0.665,18,1.484L18,1.484z"/>
          <path fill="#424242" d="M18,7.516C18,8.335,17.335,9,16.516,9H1.484C0.665,9,0,8.335,0,7.516l0,0c0-0.82,0.665-1.484,1.484-1.484 h15.031C17.335,6.031,18,6.696,18,7.516L18,7.516z"/>
          <path fill="#424242" d="M18,13.516C18,14.335,17.335,15,16.516,15H1.484C0.665,15,0,14.335,0,13.516l0,0 c0-0.82,0.665-1.484,1.484-1.484h15.031C17.335,12.031,18,12.696,18,13.516L18,13.516z"/>
        </svg>
      </a>
      <div class="trigger">
        ${helpers.pushPageLinks(site)}
      </div>
    </nav>
  </div>
</header>`
  )},

  footer: (site, helpers) => {return (
`<footer class="site-footer">
  <div class="wrapper">
    <div class="footer-col-wrapper">
      <div class="footer-col footer-col-1">
        <ul class="contact-list">
          <li>${site.owner}</li>
          <li>${site.email}</li>
          <li>${new Date(site.time).toISOString()}</li>
        </ul>
      </div>

      <div class="footer-col footer-col-2">
        <ul class="social-media-list">
          ${helpers.pushGitHubIcon(site)}
          ${helpers.pushTwitterIcon(site)}
        </ul>
      </div>

      <div class="footer-col footer-col-3">
        <p>${site.description}</p>
      </div>
    </div>
  </div>
</footer>`
  )}

}



// ---template layouts---
templates.layouts = {

  page: (data) => {return (
`<article class="post">
  <header class="post-header">
    <h1 class="post-title">${data.title}</h1>
  </header>
  <div class="post-content">
    ${data.content}
  </div>
</article>`
  )},

  post: (data, helpers) => {return (
`<article class="post" itemscope itemtype="http://schema.org/BlogPosting">
  <header class="post-header">
    <h1 class="post-title" itemprop="name headline">${data.title}</h1>
    <p class="post-meta"><time datetime="${new Date(data.date).toISOString()}" itemprop="datePublished">${new Date(data.date).toDateString().slice(4)}</time>${helpers.pushPageAuthors(data)}</p>
  </header>
  <div class="post-content" itemprop="articleBody">
    ${data.content}
  </div>
</article>`
  )} 

}



templates.helpers = {
// ---template helper functions---
pushPageLinks: (site) => {
  // return html page link listing
  let ans = []; 
  site.pages.forEach(p => { ans.push(`<a class="page-link" href="${site.baseurl + p.url}">${p.title}</a>`) }); 
  return (ans.join('\n'));
},

pushPageTitle: (site, data) => {
  // return page or site title
  if (data.title) {
    return data.title
  } else {
    return site.title
  }
},

pushPageDesc: (site, data) => {
  // return page or site description after truncating and rm newline characters
  if (data.excerpt) {
    return data.excerpt.substr(0,160).replace(/[\r\n]/g, '')
  } else {
    return site.description.substr(0,160).replace(/[\r\n]/g, '')
  }
},

pushPageAuthors: (data) => {
  // return page authors. TODO: convert to loop for in case multiple authors
  if (data.author) {
    return (
` • <span itemprop="author" itemscope itemtype="http://schema.org/Person"><span itemprop="name">${data.author}</span></span>`
    )
  }
},

pushGitHubIcon: (site) => {
  // return social link and icon
  if (site.github_username) {
    return (`
        <li>
          <a href="https://github.com/${site.github_username}"><span class="icon icon--github">${site.icons.github}</span><span class="username">${site.github_username}</span></a>
        </li>`
    )
  }
},

pushTwitterIcon: (site) => {
  // return social link and icon
  if (site.twitter_username) {
    return (`
        <li>
          <a href="https://twitter.com/${site.twitter_username}"><span class="icon icon--twitter">${site.icons.twitter}</span><span class="username">${site.twitter_username}</span></a>
        </li>`
    )
  }
},

pushBananaSlugIcon: (site) => {
  // return social link and icon
  if (site.local_url) {
    return (
      `<a class="post-link" href="${site.local_url}"><span>Local</span><span class="coloricon">${site.icons.bananaslug}</span></a>`
    )
  }
}

}

module.exports = templates;
