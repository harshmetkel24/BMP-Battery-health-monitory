const HomeController = (req, res) => {
  res.render("home");
};

const MonitorController = (req, res) => {
  res.render("index");
};

let batteries = [];

const GetBatteries = (req, res) => {
  res.render("batteries", { batteries });
};

const PostBatteries = (req, res) => {
  batteries = req.body;
  res.redirect("batteries");
};

let dataArray = [];

const SaveDataToFile = (req, res) => {
  const fs = require("fs");
  const data = JSON.stringify(req.body);
  dataArray = [...dataArray, req.body];
  console.log(data, dataArray);
  // return;
  let csvData = "";

  // Iterate through batteryData and batteryNames arrays
  for (let i = 0; i < dataArray.length; i++) {
    // Add battery name as a comment line before the data
    csvData += `# Battery ${[i]}\n`;

    // Convert the battery data array to a CSV string
    const batteryCsv = dataArray[i].map((row) => row.join(",")).join("\n");

    // Append the battery CSV data to the main CSV data
    csvData += batteryCsv;

    // Add a newline separator between battery data sets
    if (i < dataArray.length - 1) {
      csvData += "\n";
    }
  }

  console.log(csvData);

  fs.appendFile("ADC_DATASET.csv", csvData, "utf8", (error) => {
    if (error) {
      console.error("Error appending data to CSV file:", error);
      res.sendStatus(500); // Respond with an error status
    } else {
      console.log("Data appended to ADC_DATASET.csv");
      res.sendStatus(200); // Respond with a success status
    }
  });

};

module.exports = {
  HomeController,
  MonitorController,
  PostBatteries,
  GetBatteries,
  SaveDataToFile,
};
