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
app.post('/', function (req, res) {
  var data = JSON.stringify(req.body)
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
  // console.log(data);
  var dataJSON = JSON.stringify(data);
  return data;
  // return dataJSON;
}


//ws

var wss = new WebSocketServer({
  server: server
})
console.log("websocket server created")

var file2read = "data01"
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    message = JSON.parse(message);
    console.log('received: %s', message.type);
    var dataJSON;
    if (message.type == "requestData") {
      dataJSON = readFile(file2read);
      ws.send(JSON.stringify(dataJSON));
    } else if (message.type == "add") {

      dataJSON = readFile(file2read);
      dataJSON.type = "add";
      var dataJSON_add = {
        "type": "add",
        "items": []
      };
      var data_leng = dataJSON.items.length;
      for (var i = 0; i < message.range; i++) {
        dataJSON_add.items.push(dataJSON.items[data_leng - message.range_now - i])
      }
      ws.send(JSON.stringify(dataJSON_add));

    } else if (message.type == "add_left") {
      dataJSON = readFile(file2read);
      var dataJSON_add = {
        "items": []
      };
      var data_leng = dataJSON.items.length;
      for (var i = 0; i < message.range; i++) {
        dataJSON_add.items.push(dataJSON.items[data_leng - message.pos_left + i])
      }
      ws.send(JSON.stringify(dataJSON_add));
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
