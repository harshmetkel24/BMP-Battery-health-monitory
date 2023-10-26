const HomeController = (req, res) => {
  res.render("home");
};

const MonitorController = (req, res) => {
  res.render("index");
};

let batteries = [];

const GetBatteries = (req, res) => {
  const validBatteries = [];
  for(const battery in batteries)
  {
    if(batteries[battery]!= "")
    {
      validBatteries.push({url: batteries[battery], fileId: Number(battery.substring(7))})
    }
  }
  res.render("batteries", { batteries: validBatteries });
};

const PostBatteries = (req, res) => {
  batteries = req.body;
  res.redirect("batteries");
};

let dataArray = [];

const SaveDataToFiles = (req, res) => {
  const fs = require("fs");
  const data = req.body;
  const adcTime = data.adcTime;
  const fileId = data.fileId;
  console.log("heelllooo", adcTime, fileId);
  const csvData = adcTime.map((row) => row.join(",")).join("\n");

  fs.appendFile(`ADC_DATASET_${fileId}.csv`, csvData, "utf8", (error) => {
    if (error) {
      console.error("Error appending data to CSV file:", error);
      res.sendStatus(500); // Respond with an error status
    } else {
      console.log(`Data appended to ADC_DATASET_${fileId}.csv`);
      res.sendStatus(200); // Respond with a success status
    }
  });
};

module.exports = {
  HomeController,
  MonitorController,
  PostBatteries,
  GetBatteries,
  SaveDataToFiles,
};
