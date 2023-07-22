let gauges = [];
let adcTime = [];
let timeCurrentVoltage = [];

function getRandomADC(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getValueFromRotation(gauge) {
  const minRotation = -120; // Needle's starting rotation for minimum value
  const maxRotation = 120; // Needle's rotation for maximum value
  const currentValue =
    ((gauge._currentRotation - minRotation) / (maxRotation - minRotation)) *
      (gauge._max - gauge._min) +
    gauge._min;

  return currentValue;
}

function updateGauge() {
  const adc = getRandomADC(0, 100);
  const time = updateTimer();
  adcTime.push([time, adc]);
  gauges.forEach(function (gauge) {
    gauge.write(adc);
  });

  if (gauges.length) {
    timeCurrentVoltage.push([
      time,
      getValueFromRotation(gauges[0]),
      getValueFromRotation(gauges[1]),
    ]);
    console.log(gauges[0], gauges[1]);
  }

  document.querySelector("table tbody").innerHTML = adcTime
    .map((item, index) => {
      const date = new Date(item[0]);
      const timeInLocale = date.toLocaleTimeString();
      return `<tr>
      <td>${index + 1}</td>
      <td>${timeInLocale}</td>
      <td>${item[1]}</td>
    </tr>`;
    })
    .join("");
}

updateGauge();

function updateTimer() {
  const date = new Date();
  const time = date.getTime();
  document.querySelector(".current-time").innerHTML = date.toLocaleTimeString();
  google.charts.load("current", { packages: ["corechart", "line"] });
  google.charts.setOnLoadCallback(drawBasic);
  return time;
}

const intervalId = setInterval(function () {
  // Gets ADC value at every one second
  // GetADC();
  updateGauge();
  updateTimer();
}, 3000);

// stop the updation after 3 minutes

setTimeout(function () {
  clearInterval(intervalId);
}, 3 * 60 * 1000);

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
  // console.log(g);
  g.currentValue = g._range / 2;
  gauges.push(g);
}

createGauge({ clazz: "simple", label: "Battery Voltage" });
createGauge({ clazz: "grayscale", label: "Battery Current" });

function drawBasic() {
  let dataAdcChart = new google.visualization.DataTable();
  dataAdcChart.addColumn("number", "Time");
  dataAdcChart.addColumn("number", "ADC Count");

  dataAdcChart.addRows(adcTime);

  let adcChartOptions = {
    chart: {
      title: "ADC Count Data",
      subtitle: "Measured values by Time",
    },
    legend: { position: "none" },
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: "ADC Count",
      DataView: {
        min: 0,
        max: 100,
      },
    },
  };

  let adcChart = new google.visualization.LineChart(
    document.getElementById("adc_chart")
  );

  let dataCurentVoltage = new google.visualization.DataTable();
  dataCurentVoltage.addColumn("number", "Time");
  dataCurentVoltage.addColumn("number", "Current");
  dataCurentVoltage.addColumn("number", "Voltage");

  dataCurentVoltage.addRows(timeCurrentVoltage);

  let currentVoltageChart = new google.visualization.LineChart(
    document.getElementById("current_voltage_chart")
  );

  let currentVoltageChartOptions = {
    chart: {
      title: "Current Voltage Data",
      subtitle: "Measured values by Time",
    },
    legend: { position: "none" },
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: "Current & Voltage",
      viewWindow: {
        min: 0,
        max: 100,
      },
    },
    series: {
      1: { curveType: "function" },
    },
  };

  adcChart.draw(dataAdcChart, adcChartOptions);
  currentVoltageChart.draw(dataCurentVoltage, currentVoltageChartOptions);
}
