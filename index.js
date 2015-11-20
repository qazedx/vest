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
// post
var debbb;

var bodyParser     =         require("body-parser");
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.post('/',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  console.log(req.body.value +" value");
  console.log("User name = "+user_name+", password is "+password);
  debbb = req.body.value;
  debbb = user_name;
//  ws.send(req.body.value);
  res.end("yes");
});
//ws

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

// var  data = {
//    // A labels array that can contain any sort of values
//    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//    // Our series array that contains series objects or in this case series data arrays
//    series: [
//      [12, 9, 7, 8, 5],
//      [2, 1, 3.5, 7, 3],
//      [1, 3, 4, 5, 6]
//    ]
//   };

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  var minutes = 5,

    the_interval = minutes * 1 * 1000;
  setInterval(function () {
    console.log("I am doing my 5 minutes check");
    var objDate = new Date();
    var hours = objDate.getHours();
    var minutes = objDate.getMinutes();
//  if (minutes > 26){
// console.log("success");
// var   data = {
//      labels: [Math.random()*4],
//      series: [
//        [Math.random()*6],
//        [Math.random()*8],
//        [Math.random()*5]
//      ]
//     }
//}
     ws.send(JSON.stringify(debbb) );
    console.log("time: "+ hours+" " +minutes);
  }, the_interval);

});
