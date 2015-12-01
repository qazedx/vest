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

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.post('/linkit-data', function (req, res) {
  var data = JSON.stringify(req.body)
    // console.log(req.body.value + " value");
  console.log("body " + data);

  write2file(data);
  res.end("received");
});
var fs = require('fs');

function write2file(obj) {
  var path = "public/data/data.json";
  var dataFile = fs.readFileSync(path);
  var data = JSON.parse(dataFile);
  data.items.push(obj);
  var dataJSON = JSON.stringify(data);
  fs.writeFileSync(path, dataJSON);
}

function readFile(file) {
  var path = "public/data/" + file + ".json";
  var dataFile = fs.readFileSync(path);
  var data = JSON.parse(dataFile);
  console.log(data);
  var dataJSON = JSON.stringify(data);
  return data;
  // return dataJSON;
}


//ws

var wss = new WebSocketServer({
  server: server
})
console.log("websocket server created")


wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    message = JSON.parse(message);
    console.log('received: %s', message.type);
    if (message.type == "requestData") {
      var dataJSON = readFile("data01");
      ws.send(JSON.stringify(dataJSON));
    }
    if (message.type == "add") {
      var dataJSON = readFile("data01");
      dataJSON.type = "add";
      ws.send(JSON.stringify(dataJSON));
    }
  });
  var dataJSON = readFile("data01");
  ws.send(JSON.stringify(dataJSON));
});



//// interval thing
// var minutes = 5;
// the_interval = minutes * 1 * 1000;
// setInterval(function () {
//   console.log("I am doing my 5 minutes check");
//   var objDate = new Date();
//   var hours = objDate.getHours();
//   var minutes = objDate.getMinutes();
//   ws.send(dataJSON);
//   console.log("time: " + hours + " " + minutes);
// }, the_interval);
