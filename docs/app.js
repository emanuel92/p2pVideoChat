//Speichern der Einstiegsseite
window.onload = settingHomepage();

function settingHomepage() {
  if (sessionStorage.getItem("HomeURL") == null) {
    sessionStorage.setItem("HomeURL", location.href)
  }
}

//Auf Kamera und Mikrofon zugreifen
var getUserMedia = require('getusermedia')

getUserMedia({ video: true, audio: false }, function (err, stream) {
  if (err) return console.error(err)

  //neue Instanz von Simple-Peer erstellen
  var Peer = require('simple-peer')
  var peer = new Peer({
    initiator: location.hash === '#init',
    trickle: false,
    stream: stream
  })

  //Erstellen des eigenen ID-Strings
  peer.on('signal', function (data) {
    document.getElementById('yourId').value = JSON.stringify(data)
  })


  //Funktion des Verbinden-Buttons
  document.getElementById('connect').addEventListener('click', function () {
    var otherId = JSON.parse(document.getElementById('otherId').value)
    peer.signal(otherId)
  })

  window.onload = hashCheck();

  function hashCheck() {
    if (sessionStorage.getItem("state") == null) {
      if (window.location.href == "#init") {
        sessionStorage.setItem("state", "init");
        document.getElementById("state").innerHTML = "Ich bin Client";
      } else {
        sessionStorage.setItem("state", "client");
        document.getElementById("state").innerHTML = "Ich bin Initiator";
        console.log("storage item set");
      }
    } else if (sessionStorage.getItem("state") == "client") {
      console.log("Its client");
      document.getElementById("state").innerHTML = "Ich bin Initiator"
    } else {
      document.getElementById("state").innerHTML = "Ich bin Client"
      console.log("else");
    }
  }         
       
  document.getElementById('state').addEventListener('click', function () {
    if (sessionStorage.getItem("state") == "client") {
      window.location.href = "#init";
      sessionStorage.setItem("state", "init");
      window.location.reload();
      hashCheck();
    } else {
      console.log(sessionStorage.getItem("HomeURL"));
      window.location.href = sessionStorage.getItem("HomeURL");
      sessionStorage.setItem("state", "client");
      hashCheck();
    };
  })

  //Meine ID in Zwischenablage kopieren
  document.getElementById('copyMyId').addEventListener('click', function () {
    document.getElementById("yourId").select();
    document.execCommand("copy");
  })

  //Partner ID in Zwischenablage kopieren
  document.getElementById('copyOtherId').addEventListener('click', function () {
    document.getElementById("otherId").select();
    document.execCommand("copy");
  })

  //Nachrichten senden
  document.getElementById('send').addEventListener('click', function () {
    var yourMessage = document.getElementById('yourMessage').value
    peer.send(yourMessage)

    //eigene Nachrichten anzeigen und nach Senden aus Textarea löschen
    document.getElementById('messages').textContent += 'Du: ' + yourMessage + '\n'
    document.getElementById('yourMessage').value = "";
  })

  //Nachrichten anzeigen
  peer.on('data', function (data) {
    document.getElementById('messages').textContent += 'Partner: ' + data + '\n'
  })

  //Videostream des Partners anzeigen
  peer.on('stream', function (stream) {
    var video = document.createElement('video')
    document.body.appendChild(video)
    video.srcObject = stream
    video.play()
  })
})

//ServiceWorker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .catch(console.error);
}