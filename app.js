var firebase = require("firebase-admin"),
    serviceAccount = require("./voymeshFirebaseKey.json"),
    EventSource = require('eventsource');



firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://voymesh.firebaseio.com"
});

var refS = firebase.database().ref('samples/');

function writeSampleData(sensors, published_at) {
    refS.push({"sensors": sensors, "published_at": published_at});
  }
  
  
function connectToParticle(deviceID, accessToken) {
    console.log('Conectando a Particle ..')

    const API_URL = 'https://api.spark.io/v1/devices/'

    var eventSource = new EventSource(API_URL + deviceID + "/events/?access_token=" + accessToken);

    eventSource.addEventListener('open', (e) => {
        console.log("Opened!"); },false)

    eventSource.addEventListener('error', (e) => {
        console.log("Errored!"); },false)

    eventSource.addEventListener('onData', (e) => {
        var rawData = JSON.parse(e.data);
        var parsedData = JSON.parse(rawData.data);
        console.log('Nueva muestra', parsedData);
        writeSampleData(parsedData, rawData.published_at);
    }, false)

    return eventSource
}
  
  
  // Conectarse a el API de particle, obtener Token en https://build.particle.io
connectToParticle('31002b001951353338363036', '9c479135e1256931e2a3fce5f28918de2019d2b3');