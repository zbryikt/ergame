var fs, zlib, packer;
fs = require('fs');
zlib = require('zlib');
packer = function(root){
  var ret, find, files, pack, i$, len$, file, buf, b64, b;
  ret = [];
  find = function(path){
    var files, i$, len$, file, size, results$ = [];
    files = fs.readdirSync(path).map(function(it){
      return path + "/" + it;
    });
    for (i$ = 0, len$ = files.length; i$ < len$; ++i$) {
      file = files[i$];
      if (fs.statSync(file).isDirectory()) {
        results$.push(find(file));
      } else if (/\.(png|jpg|mp3)$/.exec(file)) {
        size = fs.statSync(file).size;
        results$.push(ret.push([file, size]));
      }
    }
    return results$;
  };
  find(root);
  ret.sort(function(a, b){
    return a[1] - b[1];
  });
  console.log(ret.map(function(it){
    return it[1] + " " + it[0];
  }).join('\n'));
  console.log("[" + root + "] total size:", ret.reduce(function(a, b){
    return a + b[1];
  }, 0));
  files = ret.map(function(it){
    return it[0];
  });
  fs.writeFileSync("assets/" + root + "-filelist.json", JSON.stringify(files));
  console.log("[" + root + "] file list stored in " + root + "-filelist.json.");
  console.log("[" + root + "] pack files...");
  pack = {};
  for (i$ = 0, len$ = files.length; i$ < len$; ++i$) {
    file = files[i$];
    buf = fs.readFileSync(file);
    b64 = buf.toString('base64');
    pack[file] = b64;
  }
  b = zlib.gzipSync(JSON.stringify(pack));
  console.log("hashed files compressed ( " + b.length + " bytes )");
  fs.writeFileSync("assets/" + root + ".gz", b);
  return console.log("[" + root + "] files packed in " + root + ".gz");
};
packer('img');
packer('snd');