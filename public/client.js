$(document).ready(function () {
  var user, pass;
  $("#submit").click(function () {
    user = $("#postTest").val();
    $.post("/", {
      user: user,
      password: pass
    }, function (data) {
      if (data === 'received') {
        console.log("post success");
      }
    });
  });
});
var domain = document.domain;
// var data = {
//   labels: [],
//   series: [
//     [],
//     [],
//     [],
//     [],
//     []
//   ]
// };
// // var data_temp = {
// //   labels: [],
// //   series: [
// //     [],
// //     [],
// //     [],
// //     [],
// //     []
// //   ]
// // };
data_ini = {
  labels: [],
  series: [
    [],
    [],
    [],
    [],
    []
  ]
};
$(".deb").click(function () {
    console.log("data_ini deb ");
    console.log(data_ini);
    console.log("data_temp deb ");
    console.log(data_temp);
  })

var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);
ws.open = function (event) {
  // ws.send('something');
};


ws.onmessage = function (event) {
  message = JSON.parse(event.data);
  if (message.type == "add") {
    for (var i = 0; i < message.items.length; i++) {
      data_ini.labels.unshift(message.items[i].ti);
      data_ini.series[0].unshift(message.items[i].t1);
      data_ini.series[1].unshift(message.items[i].t2);
      data_ini.series[2].unshift(message.items[i].t3);
      data_ini.series[3].unshift(message.items[i].t4);
      data_ini.series[4].unshift(message.items[i].t5);
    }
  }

  for (var i = 0; i < message.items.length; i++) {
    data_ini.labels.push(message.items[i].ti);
    data_ini.series[0].push(message.items[i].t1);
    data_ini.series[1].push(message.items[i].t2);
    data_ini.series[2].push(message.items[i].t3);
    data_ini.series[3].push(message.items[i].t4);
    data_ini.series[4].push(message.items[i].t5);
  }
  data_temp = data_ini;
  draw(data_ini);
};
ws.onclose = function (event) {
  console.log('err');
  setTimeout(function () {
    location.reload();
  }, 100);
};
//ws end


function zoomChart(type) {

  if (type == "in") {
    for (var i = 0; i < data_temp.series.length; i++) {
      data_temp.series[i].shift();
    }
    data_temp.labels.shift();
  } else if (type == "out") {
    var lab_len_ini = data_ini.labels.length;
    var lab_len = data_temp.labels.length;
    var pos = lab_len_ini - lab_len;
    // for (var i = 0; i < data.series.length; i++) {
    //   data_temp.series.unshift(data.series[pos]);
    // }
    //
    // data_temp.labels.unshift(data.labels[pos]);
    ws.send(JSON.stringify({
      "type": "add"
    }))
  }else if (type == "left") {
    console.log("left");
  }else if (type == "right") {
    console.log("right");
  }
  console.log(pos + " " + data_temp.labels.length + " " + data_ini.labels.length);
  console.log("data_temp ");
  console.log(data_temp);
  console.log("data_ini ");
  console.log(data_ini);
  draw(data_temp);
}
function requestData(type) {
  ws.send(JSON.stringify({
    "type": "requestData"
  }))
}
function draw(data_dr) {
  var options = {
    fullWidth: true,
    chartPadding: {
      right: 5,
      left: -5
    }
  };
  new Chartist.Line('.ct-chart', data_dr, options);
}
