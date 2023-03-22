var hello = ["https://mpd_files/hello"]

hello.forEach(function (uri, index) {
    if(!uri.endsWith('.mpd')){
        this[index] = uri.replace(/\/mpd_files/g, "")
        console.log(this[index])
        //return uri
    }
  }, hello);

console.log(hello)