require! <[fs zlib]>

packer = (root) ->
  ret = []
  find = (path) ->
    files = fs.readdir-sync path .map -> "#path/#it"
    for file in files =>
      if fs.stat-sync(file).is-directory! => find file
      else if /\.(png|jpg|mp3)$/.exec file => 
        size = fs.stat-sync(file).size
        ret.push [file, size]
  find root
  ret.sort((a,b) -> a.1 - b.1)
  console.log ret.map(-> "#{it.1} #{it.0}").join(\\n)
  console.log "[#root] total size:", ret.reduce(((a,b)-> a + b.1),0)
  files = ret.map(-> it.0)
  fs.write-file-sync "assets/#{root}-filelist.json", JSON.stringify(files)
  console.log "[#root] file list stored in #{root}-filelist.json."
  console.log "[#root] pack files..."
  pack = {}
  for file in files =>
    buf = fs.read-file-sync file
    b64 = buf.toString \base64
    pack[file] = b64
  #(e,b) <- zlib.gzip JSON.stringify(pack), _
  b = zlib.gzip-sync JSON.stringify(pack)
  console.log "hashed files compressed ( #{b.length} bytes )"
  fs.write-file-sync "assets/#root.gz", b
  console.log "[#root] files packed in #root.gz"

packer \img
packer \snd
