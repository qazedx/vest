// debug
$(document).ready(function () {
  var postTest;
  $("#submit").click(function () {
    postTest = $("#postTest").val();
    $.post("/", {
      postTest: postTest
    }, function (data) {
      if (data === 'received') {
        console.log(data + ", post success");
      }
    });
  });

  $(".deb").click(function () {
    console.log("data_chart deb ");
    console.log(data_chart);
  })
});
// END debug


var domain = document.domain;

data_chart = {
  labels: [],
  series: [
    [],
    [],
    [],
    [],
    []
  ]
};


var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);
ws.open = function (event) {
  // ws.send('something');
};


ws.onmessage = function (event) {
  message = JSON.parse(event.data);
  console.log(event.data);
  if (message.type == "add") {
    for (var i = 0; i < message.items.length; i++) {
      data_chart.labels.unshift(message.items[i].ti);
      data_chart.series[0].unshift(message.items[i].t1);
      data_chart.series[1].unshift(message.items[i].t2);
      data_chart.series[2].unshift(message.items[i].t3);
      data_chart.series[3].unshift(message.items[i].t4);
      data_chart.series[4].unshift(message.items[i].t5);
    }
  }else{
    for (var i = 0; i < message.items.length; i++) {
      data_chart.labels.push(message.items[i].ti);
      data_chart.series[0].push(message.items[i].t1);
      data_chart.series[1].push(message.items[i].t2);
      data_chart.series[2].push(message.items[i].t3);
      data_chart.series[3].push(message.items[i].t4);
      data_chart.series[4].push(message.items[i].t5);
    }
  }


  draw(data_chart);
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
    for (var i = 0; i < data_chart.series.length; i++) {
      data_chart.series[i].shift();
    }
    data_chart.labels.shift();
  } else if (type == "out") {
    var lab_len_ini = data_chart.labels.length;
    var lab_len = data_chart.labels.length;
    var pos = lab_len_ini - lab_len;
    // for (var i = 0; i < data.series.length; i++) {
    //   data_chart.series.unshift(data.series[pos]);
    // }
    //
    // data_chart.labels.unshift(data.labels[pos]);
    ws.send(JSON.stringify({
      "type": "add",
      "range": 1,
      "range_now": data_chart.series[0].length
    }))
  } else if (type == "left") {
    console.log("left");
  } else if (type == "right") {
    console.log("right");


  }
  console.log(pos + " " + data_chart.labels.length + " " + data_chart.labels.length);
  console.log("data_chart ");
  console.log(data_chart);
  console.log("data_chart ");
  console.log(data_chart);
  draw(data_chart);
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
