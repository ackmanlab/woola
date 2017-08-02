---
author: James Ackman  
title: woola  
date: 2017-07-13 16:59:58  
tags: markdown, parser, render, file watcher, pandoc, commonmark, html, pdf, latex, citeproc, word, manuscript, lab notebook, citation, bibliography  
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

If npm is not installed locally see [Installing node, npm](https://docs.npmjs.com/getting-started/installing-node)

## Usage

If you have project directory (web app/site, personal/lab notebook repo) containing markdown files (e.g. [CommonMark](http://commonmark.org/) format with .md, .mmd, or .txt file extensions) then simply:  

    cd path/to/myproject/
    mdwatcher

A css file should be present in the project directory-- try [ackmanlab/libcss](https://github.com/ackmanlab/libcss) for combined screen/print css configured for use with woola.
