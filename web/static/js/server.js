var chokidar, http, fs, path, jade, stylus, uglify, lsc, cwd, cwdRe, pad, now, _log, ignoreList, ignoreFunc, typeTable, watchPath, mkdirRecurse, stylTree, ctype, ftype, sampleCgi, routeTable, server, log, filecache, updateFile, watcher, replace$ = ''.replace;
chokidar = require('chokidar');
http = require('http');
fs = require('fs');
path = require('path');
jade = require('jade');
stylus = require('stylus');
uglify = require('uglify-js');
lsc = require('LiveScript');
RegExp.escape = function(it){
  return it.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
cwd = path.resolve(process.cwd());
cwdRe = new RegExp(RegExp.escape(cwd + "" + (cwd[cwd.length - 1] === '/' ? "" : '/')));
pad = function(it){
  if ((it + "").length < 2) {
    return "0" + it;
  } else {
    return it + "";
  }
};
now = function(){
  return function(it){
    return ("[" + pad(it.getMonth() + 1) + "/" + pad(it.getDate())) + (" " + pad(it.getHours()) + ":" + pad(it.getMinutes()) + ":" + pad(it.getSeconds()) + "]");
  }(
  new Date());
};
_log = console.log;
console.log = function(){
  var arg, res$, i$, to$;
  res$ = [];
  for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
    res$.push(arguments[i$]);
  }
  arg = res$;
  return _log.apply(null, [now()].concat(arg));
};
ignoreList = [/^build-assets.ls$/, /^server.ls$/, /^library.jade$/, /^\.[^/]+/, /^node_modules\//, /^assets\//];
ignoreFunc = function(f){
  if (f) {
    return ignoreList.filter(function(it){
      return it.exec(f.replace(cwdRe, "").replace(/^\.\/+/, ""));
    }).length;
  } else {
    return 0;
  }
};
typeTable = {
  "3gp": "video/3gpp",
  "aiff": "audio/x-aiff",
  "arj": "application/x-arj-compressed",
  "asf": "video/x-ms-asf",
  "asx": "video/x-ms-asx",
  "au": "audio/ulaw",
  "avi": "video/x-msvideo",
  "bcpio": "application/x-bcpio",
  "ccad": "application/clariscad",
  "cod": "application/vnd.rim.cod",
  "com": "application/x-msdos-program",
  "cpio": "application/x-cpio",
  "cpt": "application/mac-compactpro",
  "csh": "application/x-csh",
  "css": "text/css",
  "deb": "application/x-debian-package",
  "dl": "video/dl",
  "doc": "application/msword",
  "drw": "application/drafting",
  "dvi": "application/x-dvi",
  "dwg": "application/acad",
  "dxf": "application/dxf",
  "dxr": "application/x-director",
  "etx": "text/x-setext",
  "ez": "application/andrew-inset",
  "fli": "video/x-fli",
  "flv": "video/x-flv",
  "gif": "image/gif",
  "gl": "video/gl",
  "gtar": "application/x-gtar",
  "gz": "application/x-gzip",
  "hdf": "application/x-hdf",
  "hqx": "application/mac-binhex40",
  "html": "text/html",
  "ice": "x-conference/x-cooltalk",
  "ico": "image/x-icon",
  "ief": "image/ief",
  "igs": "model/iges",
  "ips": "application/x-ipscript",
  "ipx": "application/x-ipix",
  "jad": "text/vnd.sun.j2me.app-descriptor",
  "jar": "application/java-archive",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "latex": "application/x-latex",
  "lsp": "application/x-lisp",
  "lzh": "application/octet-stream",
  "m": "text/plain",
  "m3u": "audio/x-mpegurl",
  "m4v": "video/mp4",
  "man": "application/x-troff-man",
  "me": "application/x-troff-me",
  "midi": "audio/midi",
  "mif": "application/x-mif",
  "mime": "www/mime",
  "mkv": "  video/x-matrosk",
  "movie": "video/x-sgi-movie",
  "mp4": "video/mp4",
  "mp41": "video/mp4",
  "mp42": "video/mp4",
  "mpg": "video/mpeg",
  "mpga": "audio/mpeg",
  "ms": "application/x-troff-ms",
  "mustache": "text/plain",
  "nc": "application/x-netcdf",
  "oda": "application/oda",
  "ogm": "application/ogg",
  "pbm": "image/x-portable-bitmap",
  "pdf": "application/pdf",
  "pgm": "image/x-portable-graymap",
  "pgn": "application/x-chess-pgn",
  "pgp": "application/pgp",
  "pm": "application/x-perl",
  "png": "image/png",
  "pnm": "image/x-portable-anymap",
  "ppm": "image/x-portable-pixmap",
  "ppz": "application/vnd.ms-powerpoint",
  "pre": "application/x-freelance",
  "prt": "application/pro_eng",
  "ps": "application/postscript",
  "qt": "video/quicktime",
  "ra": "audio/x-realaudio",
  "rar": "application/x-rar-compressed",
  "ras": "image/x-cmu-raster",
  "rgb": "image/x-rgb",
  "rm": "audio/x-pn-realaudio",
  "rpm": "audio/x-pn-realaudio-plugin",
  "rtf": "text/rtf",
  "rtx": "text/richtext",
  "scm": "application/x-lotusscreencam",
  "set": "application/set",
  "sgml": "text/sgml",
  "sh": "application/x-sh",
  "shar": "application/x-shar",
  "silo": "model/mesh",
  "sit": "application/x-stuffit",
  "skt": "application/x-koan",
  "smil": "application/smil",
  "snd": "audio/basic",
  "sol": "application/solids",
  "spl": "application/x-futuresplash",
  "src": "application/x-wais-source",
  "stl": "application/SLA",
  "stp": "application/STEP",
  "sv4cpio": "application/x-sv4cpio",
  "sv4crc": "application/x-sv4crc",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tar": "application/x-tar",
  "tcl": "application/x-tcl",
  "tex": "application/x-tex",
  "texinfo": "application/x-texinfo",
  "tgz": "application/x-tar-gz",
  "tiff": "image/tiff",
  "tr": "application/x-troff",
  "tsi": "audio/TSP-audio",
  "tsp": "application/dsptype",
  "tsv": "text/tab-separated-values",
  "unv": "application/i-deas",
  "ustar": "application/x-ustar",
  "vcd": "application/x-cdlink",
  "vda": "application/vda",
  "vivo": "video/vnd.vivo",
  "vrm": "x-world/x-vrml",
  "wav": "audio/x-wav",
  "wax": "audio/x-ms-wax",
  "webm": "video/webm",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "wmx": "video/x-ms-wmx",
  "wrl": "model/vrml",
  "wvx": "video/x-ms-wvx",
  "xbm": "image/x-xbitmap",
  "xlw": "application/vnd.ms-excel",
  "xml": "text/xml",
  "xpm": "image/x-xpixmap",
  "xwd": "image/x-xwindowdump",
  "xyz": "chemical/x-pdb",
  "zip": "application/zip"
};
watchPath = '.';
mkdirRecurse = function(f){
  var parent;
  if (fs.existsSync(f)) {
    return;
  }
  parent = path.dirname(f);
  if (!fs.existsSync(parent)) {
    mkdirRecurse(parent);
  }
  return fs.mkdirSync(f);
};
stylTree = {
  downHash: {},
  upHash: {},
  parse: function(filename){
    var dir, ret, i$, len$, it, ref$, results$ = [];
    dir = path.dirname(filename);
    ret = fs.readFileSync(filename).toString().split('\n').map(function(it){
      return /^ *@import (.+)/.exec(it);
    }).filter(function(it){
      return it;
    }).map(function(it){
      return it[1];
    });
    ret = ret.map(function(it){
      return path.join(dir, it.replace(/(\.styl)?$/, ".styl"));
    });
    this.downHash[filename] = ret;
    for (i$ = 0, len$ = ret.length; i$ < len$; ++i$) {
      it = ret[i$];
      if (!in$(filename, (ref$ = this.upHash)[it] || (ref$[it] = []))) {
        results$.push(((ref$ = this.upHash)[it] || (ref$[it] = [])).push(filename));
      }
    }
    return results$;
  },
  findRoot: function(filename){
    var work, ret, f, ref$;
    work = [filename];
    ret = [];
    while (work.length > 0) {
      f = work.pop();
      if (((ref$ = this.upHash)[f] || (ref$[f] = [])).length === 0) {
        ret.push(f);
      } else {
        work = work.concat(this.upHash[f]);
      }
    }
    return ret;
  }
};
ctype = function(name){
  var ret;
  name == null && (name = null);
  ret = /\.([^.]+)$/.exec(name);
  if (!ret || !ret[1] || !typeTable[ret[1]]) {
    return 'application/octet-stream';
  }
  return typeTable[ret[1]];
};
ftype = function(it){
  switch (false) {
  case !/\.ls$/.exec(it):
    return "ls";
  case !/\.styl/.exec(it):
    return "styl";
  case !/\.jade$/.exec(it):
    return "jade";
  default:
    return "other";
  }
};
sampleCgi = function(req, res){
  res.writeHead(200, {
    "Content-type": "text/html"
  });
  return res.end("hello world!");
};
routeTable = {
  "/sample-cgi": sampleCgi
};
server = function(req, res){
  var filePath, relPath, dir, files, i$, len$, it, buf;
  req.url = replace$.call(req.url, /[?#].*$/, '');
  filePath = path.resolve(cwd, "." + req.url);
  if (filePath.indexOf(cwd) < 0) {
    res.writeHead(403, ctype());
    return res.end(req.url + " forbidden");
  }
  relPath = filePath.replace(cwd, "");
  if (relPath in routeTable) {
    return routeTable[relPath](req, res);
  }
  if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
    dir = filePath.replace(/\/$/, "");
    filePath = filePath + "/index.html";
    if (!fs.existsSync(filePath)) {
      files = fs.readdirSync(dir);
      dir = req.url.replace(/\/$/, "");
      res.writeHead(200, {
        "Content-type": 'text/html'
      });
      res.write("<h2>" + dir + "<h2>\n<ul>\n");
      for (i$ = 0, len$ = files.length; i$ < len$; ++i$) {
        it = files[i$];
        res.write("<li><a href='" + dir + "/" + it + "'>" + it + "</a></li>\n");
      }
      return res.end('</ul>\n');
    }
  }
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, ctype());
    return res.end(req.url + " not found");
  }
  console.log("[ GET ] " + filePath + " (" + ctype(filePath) + ")");
  buf = fs.readFileSync(filePath);
  res.writeHead(200, {
    "Content-Length": buf.length,
    "Content-Type": ctype(filePath)
  });
  return res.end(buf);
};
log = function(error, stdout, stderr){
  var that;
  if (that = (stdout + "\n" + stderr).trim()) {
    return console.log(that);
  }
};
filecache = {};
updateFile = function(it){
  var src, ref$, type, cmd, des, files, result, file, e, srcs, i$, len$, desdir;
  if (!it || /node_modules|\.swp$/.exec(it)) {
    return;
  }
  src = it[0] !== '/' ? path.join(cwd, it) : it;
  src = src.replace(path.join(cwd, '/'), "");
  ref$ = [ftype(src), "", ""], type = ref$[0], cmd = ref$[1], des = ref$[2];
  if (type === 'other') {
    return;
  }
  if (type === 'ls') {
    if (/src\/ls/.exec(src)) {
      try {
        files = fs.readdirSync('src/ls/').map(function(it){
          return "src/ls/" + it;
        });
        files = files.filter(function(it){
          return /\/\./.exec(it) === null;
        });
        result = (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = files).length; i$ < len$; ++i$) {
            file = ref$[i$];
            results$.push(uglify.minify(lsc.compile(fs.readFileSync(file).toString(), {
              bare: true
            }), {
              fromString: true
            }).code);
          }
          return results$;
        }()).join("");
      } catch (e$) {
        e = e$;
        console.log("[BUILD] " + src + " failed: ");
        console.log(e.message);
      }
      return;
    } else {
      des = src.replace(/\.ls$/, ".js");
      try {
        mkdirRecurse(path.dirname(des));
        fs.writeFileSync(des, uglify.minify(lsc.compile(fs.readFileSync(src).toString(), {
          bare: true
        }), {
          fromString: true
        }).code);
        console.log("[BUILD] " + src + " --> " + des);
      } catch (e$) {
        e = e$;
        console.log("[BUILD] " + src + " failed: ");
        console.log(e.message);
      }
      return;
    }
  }
  if (type === 'styl') {
    if (/(basic|vars)\.styl/.exec(it)) {
      return;
    }
    try {
      stylTree.parse(src);
      srcs = stylTree.findRoot(src);
    } catch (e$) {
      e = e$;
      console.log("[BUILD] " + src + " failed: ");
      console.log(e.message);
    }
    console.log("[BUILD] recursive from " + src + ":");
    for (i$ = 0, len$ = srcs.length; i$ < len$; ++i$) {
      src = srcs[i$];
      try {
        des = src.replace(/src\/styl/, "static/css").replace(/\.styl$/, ".css");
        stylus(fs.readFileSync(src).toString()).set('filename', src).define('index', fn$).render(fn1$);
      } catch (e$) {
        e = e$;
        console.log("[BUILD]   " + src + " failed: ");
        console.log(e.message);
      }
    }
  }
  if (type === 'jade') {
    des = src.replace(/\.jade$/, ".html");
    try {
      desdir = path.dirname(des);
      if (!fs.existsSync(desdir) || !fs.statSync(desdir).isDirectory()) {
        mkdirRecurse(desdir);
      }
      fs.writeFileSync(des, jade.render(fs.readFileSync(src).toString(), {
        filename: src,
        basedir: path.join(cwd)
      }));
      console.log("[BUILD] " + src + " --> " + des);
    } catch (e$) {
      e = e$;
      console.log("[BUILD] " + src + " failed: ");
      console.log(e.message);
    }
  }
  function fn$(a, b){
    a = (a.string || a.val).split(' ');
    return new stylus.nodes.Unit(a.indexOf(b.val));
  }
  function fn1$(e, css){
    if (e) {
      console.log("[BUILD]   " + src + " failed: ");
      console.log("  >>>", e.name);
      return console.log("  >>>", e.message);
    } else {
      mkdirRecurse(path.dirname(des));
      fs.writeFileSync(des, css);
      return console.log("[BUILD]   " + src + " --> " + des);
    }
  }
};
watcher = chokidar.watch(watchPath, {
  ignored: ignoreFunc,
  persistent: true
}).on('add', updateFile).on('change', updateFile);
http.createServer(server).listen(9997, '0.0.0.0');
console.log("running server on 0.0.0.0:9997");
function in$(x, xs){
  var i = -1, l = xs.length >>> 0;
  while (++i < l) if (x === xs[i]) return true;
  return false;
}