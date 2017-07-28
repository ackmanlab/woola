const site = {
name: "James Ackman",
title: "ackmanlab",
owner: "James Ackman",
email: "jackman@ucsc.edu",
description: "",
baseurl: "", //the subpath of your site, e.g. /blog
url: "http://ackmanlab.com", // the base hostname & protocol for your site
twitter_username: "JamesAckman",
github_username:  "ackmanlab",
data_path: "https://s3-us-west-2.amazonaws.com/int.data.ackmanlab.com/assets",
local_url: "https://ackmanlab.com/local.html",
css: "https://ackmanlab.com/css/main.css",
//permalink: "/:categories/:year-:month-:day-:title.html",
//collections not currently used
collections: {
  posts: {
    output: true,
    permalink: "/:categories/:year-:month-:day-:title.html"
    }
  },
pages: [
{title: "about", url: "/about.html", author: "James", date: "2017-07-13 23:13:21", content: "hello universe", layout: "page"},
{title: "people", url: "/people.html", author: "Ackman", date: "2017-07-13 23:14:01", content: "foobar", layout: "page"}
],
options: {
  srcPath: '_posts', 
  dstPath: '_site', 
  overwrite: true, 
  extFilter: ['*.md','*.txt','*.mmd','*.markdown'],
  matchBase: false, 
  ignore: ['.git', 'node_modules', 'README.md', 'test', 'lib', 'css', 'bin'],
  defaults: {
    categories: 'pub',
    layout: 'post'
    }
  }
}

// TODO:
// - uuid hash meta, origin vs revision hashes, doi meta

module.exports = site;
