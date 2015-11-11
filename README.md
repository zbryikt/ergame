template
========

a web template, for simple frontend. it contains a simple webserver, watch daemon, and a makefile for offline building. It uses jade, styl and livescript to build a web page.


Usage
========

Simply edit index.jade, index.styl and index.ls, and type 'make' to build these into index.html, index.css and index.js.

You can also watch all your changes and build them automatically. To do so, run

    npm i

once (for installing all dependencies), then run

    npm start

It will start watching all styl, jade and livescript changes, and also run a simple web server listening on localhost:9999.


Configuration
========

Options about CDN, Open Graph, Favicon, thumbnail and used libraries are available in index.jade:

    - var use = { cdn: false, og: false, favicon: true }
    - var lib = { jquery: true, d3js: false, angular: true, bootstrap: true, semantic: false }
    - var assets = "assets"
    - var thumbnail = "thumbnail.png"
    - var favicon = "thumbnail.png"
