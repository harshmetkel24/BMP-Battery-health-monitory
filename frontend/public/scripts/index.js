let gauges = [];
let adcTime = [];
let adcTimeToShow = [];
let timeCurrentVoltage = [];
let reportData = ``;

function getRandomADC(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
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

function getMappedValue(value) {
  const inMin = 0.9;
  const inMax = 1.2;
  const outMin = 0;
  const outMax = 100;

  // ensure value is in range
  value = Math.min(Math.max(value, inMin), inMax);

  const mappedValue = ((value - inMin) * (outMax - outMin)) / (inMax - inMin);

  return mappedValue;
}

function updateGauge() {
  // const adc = GetADC();
  const adc = getRandomADC(9, 13);
  const now = new Date();
  const formattedDate = `${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${now.getDate().toString().padStart(2, "0")}/${now
    .getFullYear()
    .toString()
    .slice(2)}`;
  const time = new Date(updateTimer()).toLocaleTimeString();

  // google.charts.load("current", { packages: ["corechart", "line"] });
  // google.charts.setOnLoadCallback(drawGoogleChart);
  adcTime.push([time, adc, formattedDate]);
  adcTimeToShow.push([time, adc, formattedDate]);
  gauges.forEach(function (gauge) {
    gauge.write(adc);
  });

  document.querySelector("table tbody").innerHTML = adcTimeToShow
    .map((item, index) => {
      const timeInLocale = item[0];
      return `<tr>
      <td>${index + 1}</td>
      <td>${timeInLocale}</td>
      <td>${item[2]}</td>
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

function reset() {
  saveDataToFile();
  window.location.reload();
}

updateGauge();
// drawGoogleChart();
// drawChart();

// auto reset after every 5 minutes
setInterval(() => {
  saveDataToFile();
  // reset();
}, 30 * 1000);

// also save data when user closes the tab or refreshes the page
window.addEventListener("beforeunload", function (e) {
  saveDataToFile();
});

// timer should be updated every 1 second

setInterval(function () {
  updateGauge();
  updateTimer();
  // drawChart();
}, 1000);

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

function createGauge(opts) {
  var el = document.querySelector(".gauge-container");
  var g = d3Gauge(el, opts);
  // console.log(g);
  g.currentValue = g._range / 2;
  gauges.push(g);
}

createGauge({ clazz: "simple", label: "Battery Voltage" });

// downloading a csv file

function downloadCSV() {
  const filename = "ADC_Dataset.csv";

  const storedData = JSON.parse(localStorage.getItem("adc_data")) || [];
  const csvContent = storedData
    .map((item) => {
      const row = item.join(",");
      return row;
    })
    .join("\n");

  console.log(csvContent);

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.querySelector(".download-btn");
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  // Add click event listener
  link.addEventListener("click", () => {
    // Clean up the Blob URL after download
    URL.revokeObjectURL(link.href);
  });
}

function saveDataToFile() {
  // make a post request to save data to file
  fetch("http://localhost:3000/save", {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(adcTime),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Data saved successfully");
      } else {
        console.log("Data could not be saved, please refresh page");
      }
    })
    .catch((err) => {
      console.log("Data could not be saved, please refresh page");
    });
}

// commented code may be required in future

// function generateReport() {
//   let adcTableBody = ``;

//   adcTime.forEach((ele, index) => {
//     const date = new Date(ele[0]);
//     const time = date.toLocaleTimeString();
//     adcTableBody += `<tr>
//                     <td>${index + 1}</td>
//                     <td>${time}</td>
//                     <td>${ele[1]}</td>
//                   </tr>`;
//   });

//   reportData += `
//     <h2>Voltage Data</h2>
//     <table class="table table-striped">
//         <thead>
//           <tr>
//             <th>Sr. No</th>
//             <th>Time</th>
//             <th>Voltage</th>
//           </tr>
//         </thead>
//           ${adcTableBody}
//       </table>

//   `;

//   // console.log(reportData);

//   const html = `<body>${reportData}</body>`;
//   var val = htmlToPdfmake(html);
//   var dd = {
//     content: val,
//     pagebreakBefore: function (currentNode, followingNodesOnPage) {
//       return (
//         currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
//       );
//     },
//   };
//   pdfMake.createPdf(dd).download();
// }

// function drawGoogleChart() {
//   let dataAdcChart = new google.visualization.DataTable();
//   dataAdcChart.addColumn("string", "Time");
//   dataAdcChart.addColumn("number", "Voltage");

//   dataAdcChart.addRows(adcTime);

//   let adcChartOptions = {
//     chart: {
//       title: "Voltage Data",
//       subtitle: "Measured values by Time",
//     },
//     legend: { position: "none" },
//     hAxis: {
//       title: "Time",
//     },
//     vAxis: {
//       title: "Voltage",
//       DataView: {
//         min: 0,
//         max: 100,
//       },
//     },
//   };

//   let adcChart = new google.visualization.LineChart(
//     document.getElementById("adc_chart")
//   );

//   adcChart.draw(dataAdcChart, adcChartOptions);
// }

// function drawChart() {
//   const data = adcTime.map((ele) => {
//     const time = new Date(ele[0]).toLocaleTimeString();
//     return { x: time, y: ele[1] };
//   });

//   const canvas = document.getElementById("adc-canvas");
//   const ctx = canvas.getContext("2d");

//   // Calculate the maximum data value to scale the chart
//   const maxValue = Math.max(...data.map((point) => point.y));

//   const stepX =
//     data.length <= 1 ? canvas.width / 2 : canvas.width / (data.length - 1);
//   const stepY = data.length === 1 ? 50 : canvas.height / (maxValue * 2);

//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.beginPath();
//   ctx.strokeStyle = "#007bff";

//   // console.log(ctx);

//   for (let i = 0; i < data.length; i++) {
//     const x = i * stepX;
//     const y = canvas.height - data[i].y * stepY;

//     // Draw the lines connecting data points
//     if (i === 0) {
//       ctx.moveTo(x, y);
//     } else {
//       ctx.lineTo(x, y);
//       ctx.stroke();
//       ctx.beginPath();
//       ctx.moveTo(x, y);
//     }

//     // Draw the data points
//     ctx.beginPath();
//     ctx.arc(x, y, 2, 0, Math.PI * 2);
//     ctx.fillStyle = "#007bff";
//     ctx.fill();

//     // Draw the labels
//     ctx.fillStyle = "#000";
//     ctx.font = "8px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText(`(${data[i].x}, ${data[i].y})`, x, y - 10);
//   }

//   ctx.stroke();
// }
