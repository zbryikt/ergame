require! <[fs zlib]>

ret = []
find = (path) ->
  files = fs.readdir-sync path .map -> "#path/#it"
  for file in files =>
    if fs.stat-sync(file).is-directory! => find file
    else if /\.(png|jpg)$/.exec file => 
      size = fs.stat-sync(file).size
      ret.push [file, size]
find \img
ret.sort((a,b) -> a.1 - b.1)
console.log ret.map(-> "#{it.1} #{it.0}").join(\\n)
console.log "total size:", ret.reduce(((a,b)-> a + b.1),0)
files = ret.map(-> it.0)
fs.write-file-sync \img-files.json, JSON.stringify(files)
console.log "image file list stored in img-files.json."
console.log "pack image files..."
pack = {}
for file in files =>
  buf = fs.read-file-sync file
  b64 = buf.toString \base64
  pack[file] = b64

(e,b) <- zlib.gzip JSON.stringify(pack), _
console.log "hashed images compressed ( #{b.length} bytes )"
fs.write-file-sync \imgs.gz, b
console.log "image files packed in imgs.gz"
