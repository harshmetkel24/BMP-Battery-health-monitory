const express = require("express");
const router = express.Router();

const {
  HomeController,
  MonitorController,
  PostBatteries,
  GetBatteries,
  SaveDataToFile
} = require("../controllers/index.js");

router.get("/", HomeController);
router.post("/", PostBatteries);

router.get('/batteries', GetBatteries)

router.get("/monitor", MonitorController);

router.post("/save", SaveDataToFile);

module.exports = router;
