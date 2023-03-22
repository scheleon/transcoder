// function setPlayer() {
//     document.getElementById('playspace').innerHTML = ''
//     var x = document.createElement('video');
//     console.log(this.innerHTML)
//     x.setAttribute("src", '/videos/' + this.innerHTML);
  
//     x.setAttribute("width", "320");
//     x.setAttribute("height", "240");
//     x.setAttribute("controls", "controls");
//     document.getElementById('playspace').appendChild(x);
// }

function setplay(){
    var elements = document.querySelectorAll(".video");

    for (var i = 0; i < elements.length; i++) {
        console.log(elements[i].innerHTML)
        elements[i].addEventListener('click', initPlayer);
    }
}

document.getElementById("start").addEventListener("click", function(){

fetch(document.URL + 'files').then((response) => {
    response.json().then((data) => {
        cnt = 0
        document.getElementById("list").innerHTML = ''
            data.files.forEach(file => {
                g = document.createElement('button');
                g.setAttribute("class", "video");
                g.setAttribute('id', 'video-' + cnt)
                g.innerHTML=file
                document.getElementById("list").appendChild(g)
                // document.getElementById('video-' + cnt).innerHTML=file
                cnt++
            });
            setplay();
        })
    })
}); 

function initApp() {
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (shaka.Player.isBrowserSupported()) {
    // Everything looks good!
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!');
  }
}

function initPlayer() {
  // Create a Player instance.
  var video = document.getElementById('video');
  video.hidden = false
  var player = new shaka.Player(video);

  // Attach player to the window to make it easy to access in the JS console.
  window.player = player;

  // Listen for error events.
  player.addEventListener('error', onErrorEvent);

  player.getNetworkingEngine().registerRequestFilter(function(type, request) {
    // if (type != shaka.net.NetworkingEngine.RequestType.MANIFEST) {
    //   return;
    // }
    
    request.uris.forEach(function (uri, index) {
      console.log(this[index])
      if(uri.endsWith('5163.mp4')){
        console.log('MP4 video')
      }
      else if(!uri.endsWith('.mpd')){
          this[index] = uri.replace(/mpd_files\//g, '')
          console.log(this[index])
      }
    }, request.uris);
  });

  manifestUri = document.URL + 'mpd_files/' + this.innerHTML

  player.load(manifestUri).then(function() {
    console.log('The video has now been loaded!');
  }).catch(onError); 
}

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error) {
  // Log the error.
  console.error('Error code', error.code, 'object', error);
}

document.addEventListener('DOMContentLoaded', initApp);