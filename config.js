const site = {
//configure and place a copy of this config file in your app/site root directory
name: "First Last",
title: "organization|app|site title",
owner: "First Last",
email: "",
description: "",
baseurl: "", //the subpath of your site, e.g. /_site
url: "https://yoursite.com", // the base hostname & protocol for your site
twitter_username: "",
github_username:  "",
data_path: "https://cdn.yoursite.com/assets",
local_url: "https://yoursite.com/local.html", //url entry point for the 'local' type category
css: "https://cdn.yoursite.com/css/main.css",
//permalink: "/:categories/:year-:month-:day-:title.html",
pages: [
  {title: "about", url: "about.html", author: "sola", date: "2017-07-13 23:13:21", content: "hello universe", layout: "post", categories: ["public"]},
  {title: "people", url: "people.html", author: "woola", date: "2017-07-13 23:14:01", content: "foobar", layout: "page", categories: ["local", "draft"]}
  ],
options: {
  srcPath: 'src', 
  dstPath: 'dist', 
  overwrite: true, 
  extFilter: ['*.md','*.txt','*.mmd','*.markdown','*.html'],
  matchBase: false, 
  ignore: ['.DS_Store', '.git', '.gitignore', 'node_modules'],
  buildAssets: [], //things to copy into the dist dir on build, e.g. ['error.png', 'favicon.png', 'feed.xml', 'css', 'assets', 'lib' ]
  filterCategories: ['local', 'pri'], //category names that you want to use as filters and sub directory names for grouping posts together
  categories: {
    local: {
      icon: 'bananaslug'
    }
  },
  defaults: {
    build: 'master',
    categories: ['public'],
    layout: 'post'
    }
  },
pdfconfig: {
  default: { 
    format: "Letter",
    border: {
      top: "0.5in",
      right: "0.5in",
      bottom: "0.5in",
      left: "0.5in"
    },
    header: {
      height: "0"
    },
    footer: {
      height: "2mm",
      contents: {
        first: " ",
        default: "<div style='text-align:right;color:#333333;font-size:0.875em'>{{page}}/{{pages}}</div>"
        }
      }
    },
  cover: { 
    format: "Letter",
    border: {
      top: "0.5in",
      right: "0.5in",
      bottom: "0.5in",
      left: "0.5in"
      },
    header: {
      height: "1.25in"
      },
    footer: {
      height: "2mm",
      contents: {
        first: " ",
        default: "<div style='text-align:right;color:#adadad;font-size:0.875em'>{{page}}/{{pages}}</div>"
        }
      }
    }
  },
  use: "default"
}
//TODO: switch to collection based logic below (in options.filterCategories) and add permalinks
//permalink: "/:categories/:year-:month-:day-:title.html",
// collections: {
//   posts: {
//     output: true,
//     permalink: "/:categories/:year-:month-:day-:title.html"
//     }
//   },

// TODO:
// - uuid hash meta, origin vs revision hashes, doi meta
// - config multiple possible entry and destination points for data_path, categories (local_url, post, pri), and css types
// - add config.js into a separate site/app skeleton build repo with local custom branch

module.exports = site;
