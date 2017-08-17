---
author: James Ackman  
title: woola  
date: 2017-07-13 16:59:58  
tags: markdown, parser, render, file watcher, livereload, pandoc, commonmark, html, pdf, latex, citeproc, word, manuscript, lab notebook, citation, bibliography  
---

     _      ____  ____  _     ____ 
    / \  /|/  _ \/  _ \/ \   /  _ \
    | |  ||| / \|| / \|| |   | / \|
    | |/\||| \_/|| \_/|| |_/\| |-||
    \_/  \|\____/\____/\____/\_/ \|
                               

woola– A friendly beast who builds and serves content for you.

## Installation

Install locally:  

    npm install https://github.com/ackmanlab/woola.git

If npm is not yet installed locally, first see [Installing node, npm](https://docs.npmjs.com/getting-started/installing-node)

## Usage

If you have project directory (web app/site, personal/lab notebook repo) containing markdown files (e.g. [CommonMark](http://commonmark.org/) format with .md, .mmd, or .txt file extensions) then simply:  

    cd path/to/myproject/
    woola


* [ ] TODO: more documentation on additional usage

<!-- 
### Note

If no local css is found in the current project directory the app will currently try to automatically access a commonly used bootstrap 3 css from maxcdn. For best usage, a combination of screen and print (pdf) styles is good. 

 -->
For optimal usage, locally installed screen/print css styles in the project directory is helpful-- try [ackmanlab/libcss](https://github.com/ackmanlab/libcss) for combined screen/print css already configured for use with woola (just clone libcss locally and add a symlink for your current project directory `ln -s path/to/libcss/build path/to/myproject/css`).

## License

MIT License
