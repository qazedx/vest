// var express = require('express');
// var app = express();

var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000


app.use(express.static(__dirname + "/public/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

var  data = {
   // A labels array that can contain any sort of values
   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
   // Our series array that contains series objects or in this case series data arrays
   series: [
     [12, 9, 7, 8, 5],
     [2, 1, 3.5, 7, 3],
     [1, 3, 4, 5, 6]
   ]
  };

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('somethinffg');
  var minutes = 2,

    the_interval = minutes * 1 * 1000;
  setInterval(function () {
    console.log("I am doing my 5 minutes check");
    var objDate = new Date();
    var hours = objDate.getHours();
    var minutes = objDate.getMinutes();
  //  if (minutes > 26){
      console.log("success");
      var   data = {
           labels: [Math.random()*2],
           series: [
             [Math.random()*1],
             [Math.random()*8],
             [Math.random()*5]
           ]
          }

  var data1 = buidlArr(data1);
  console.log(data1);
    //  data.series[0].push(9);
      ws.send(JSON.stringify(data) );
    //}
    console.log(hours);
  }, the_interval);

});
function buidlArr(data){
if (data == null){
  data = {
     labels: [],
     series: [
       [],
       [],
       []
     ]
    }
}
  data.series[0].push(Math.random()*2);
  data.series[1].push(Math.random()*4);
  data.series[2].push(Math.random()*5);
  data.labels.push("ttt");
 return data
}
