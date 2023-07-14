function getRandomADC(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function updateGauge() {
  const adc = getRandomADC(0, 100);
  gauges.forEach(function (gauge) {
    gauge.write(adc);
  });
}

function updateTimer() {
    const date = new Date();
    const time = date.toLocaleTimeString();
    document.querySelector('.current-time').innerHTML = time;
}

setInterval(function () {
  // Gets ADC value at every one second
  // GetADC();
  updateGauge();
    updateTimer();
}, 1000);

function GetADC() {
  var xhttp = new XMLHttpRequest();
  var adc = 0;
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      adc = Number(this.responseText);
      gauges.forEach(function (gauge) {
        console.log(adc);
        gauge.write(adc);
      });
    }
  };
  xhttp.open("GET", "/getADC", false);
  xhttp.send();
}

var gauges = [];
var small = {
  size: 100,
  min: 0,
  max: 50,
  transitionDuration: 500,

  label: "label.text",
  minorTicks: 4,
  majorTicks: 5,
  needleWidthRatio: 0.6,
  needleContainerRadiusRatio: 0.7,

  zones: [
    { clazz: "yellow-zone", from: 0.73, to: 0.9 },
    { clazz: "red-zone", from: 0.9, to: 1.0 },
  ],
};

function createGauge(opts) {
  var el = document.querySelector(".gauge-container");
  var g = d3Gauge(el, opts);
  g.currentValue = g._range / 2;
  gauges.push(g);
}

createGauge({ clazz: "simple", label: "Battery Voltage" });
createGauge({ clazz: "grayscale", label: "Battery Current" });
