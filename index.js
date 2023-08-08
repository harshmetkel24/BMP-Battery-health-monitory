let gauges = [];
let adcTime = [];
let timeCurrentVoltage = [];
let reportData = ``;

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
  // const adc = GetADC();
  const adc = getRandomADC(0, 100);
  const time = new Date(updateTimer()).toLocaleTimeString();

  google.charts.load("current", { packages: ["corechart", "line"] });
  google.charts.setOnLoadCallback(drawGoogleChart);
  adcTime.push([time, adc]);
  gauges.forEach(function (gauge) {
    gauge.write(adc);
  });

  document.querySelector("table tbody").innerHTML = adcTime
    .map((item, index) => {
      const timeInLocale = item[0];
      return `<tr>
      <td>${index + 1}</td>
      <td>${timeInLocale}</td>
      <td>${item[1]}</td>
    </tr>`;
    })
    .join("");
}

function updateTimer() {
  const date = new Date();
  const time = date.getTime();
  document.querySelector(".current-time").innerHTML = date.toLocaleTimeString();
  return time;
}

function generateReport() {
  let adcTableBody = ``;

  adcTime.forEach((ele, index) => {
    const date = new Date(ele[0]);
    const time = date.toLocaleTimeString();
    adcTableBody += `<tr>
                    <td>${index + 1}</td>
                    <td>${time}</td>
                    <td>${ele[1]}</td>
                  </tr>`;
  });

  reportData += `
    <h2>ADC Count Data</h2>
    <table class="table table-striped">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Time</th>
            <th>ADC Count</th>
          </tr>
        </thead>
          ${adcTableBody}
      </table>

  `;

  // console.log(reportData);

  const html = `<body>${reportData}</body>`;
  var val = htmlToPdfmake(html);
  var dd = {
    content: val,
    pagebreakBefore: function (currentNode, followingNodesOnPage) {
      return (
        currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
      );
    },
  };
  pdfMake.createPdf(dd).download();
}

function reset() {
  window.location.reload();
}

updateGauge();
// drawGoogleChart();
// drawChart();

// auto reset after every 5 minutes
setInterval(() => {
  reset();
}, 5 * 60 * 1000);

const intervalId = setInterval(function () {
  // Gets ADC value at every one second
  // GetADC();
  updateGauge();
  updateTimer();
  // drawChart();
}, 10000);

// stop the updation after 3 minutes

function GetADC() {
  var xhttp = new XMLHttpRequest();
  var adc = 0;
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      adc = Number(this.responseText);
      gauges.forEach(function (gauge) {
        gauge.write(adc);
      });
    }
  };
  xhttp.open("GET", "/getADC", false);
  xhttp.send();
  return adc;
}

var small = {
  size: 100,
  min: 11,
  max: 14,
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

function drawGoogleChart() {
  let dataAdcChart = new google.visualization.DataTable();
  dataAdcChart.addColumn("string", "Time");
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

  adcChart.draw(dataAdcChart, adcChartOptions);
}

function drawChart() {
  const data = adcTime.map((ele) => {
    const time = new Date(ele[0]).toLocaleTimeString();
    return { x: time, y: ele[1] };
  });

  const canvas = document.getElementById("adc-canvas");
  const ctx = canvas.getContext("2d");

  // Calculate the maximum data value to scale the chart
  const maxValue = Math.max(...data.map((point) => point.y));

  const stepX =
    data.length <= 1 ? canvas.width / 2 : canvas.width / (data.length - 1);
  const stepY = data.length === 1 ? 50 : canvas.height / (maxValue * 2);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.strokeStyle = "#007bff";

  // console.log(ctx);

  for (let i = 0; i < data.length; i++) {
    const x = i * stepX;
    const y = canvas.height - data[i].y * stepY;

    // Draw the lines connecting data points
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    // Draw the data points
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#007bff";
    ctx.fill();

    // Draw the labels
    ctx.fillStyle = "#000";
    ctx.font = "8px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`(${data[i].x}, ${data[i].y})`, x, y - 10);
  }

  ctx.stroke();
}

// downloading a csv file

function downloadCSV(adcTime, filename) {
  const csvContent = adcTime.map((e) => e.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.querySelector(".download-btn");
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  // Add click event listener
  link.addEventListener("click", () => {
    // Clean up the Blob URL after download
    URL.revokeObjectURL(link.href);
  });

  // Simulate a click on the link to trigger the download
  link.click();
}

downloadCSV(adcTime, "adc_data.csv");
