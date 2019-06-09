var getUserMedia = require('getusermedia')

getUserMedia({ video: true, audio: false }, function (err, stream) {
  if (err) return console.error(err)

  var Peer = require('simple-peer')
  var peer = new Peer({
    initiator: location.hash === '#init',
    trickle: false,
    stream: stream
  })

  peer.on('signal', function (data) {
    document.getElementById('yourId').value = JSON.stringify(data)
  })

  document.getElementById('connect').addEventListener('click', function () {
    var otherId = JSON.parse(document.getElementById('otherId').value)
    peer.signal(otherId)
  })

  document.getElementById('copyMyId').addEventListener('click', function () {
    document.getElementById("yourId").select();
    document.execCommand("copy");
  })

  document.getElementById('copyOtherId').addEventListener('click', function () {
    document.getElementById("otherId").select();
    document.execCommand("copy");
  })

  document.getElementById('send').addEventListener('click', function () {
    var yourMessage = document.getElementById('yourMessage').value
    peer.send(yourMessage)
  })

  peer.on('data', function (data) {
    document.getElementById('messages').textContent += data + '\n'
  })

  peer.on('stream', function (stream) {
    var video = document.createElement('video')
    document.body.appendChild(video)

    //video.src = window.URL.createObjectURL(stream)
    video.srcObject = stream
    video.play()
    
  })
})


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .catch(console.error);
}