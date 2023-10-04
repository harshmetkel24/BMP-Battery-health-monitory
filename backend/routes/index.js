const express = require("express");
const router = express.Router();

const { HomeController } = require("../controllers/index.js");

router.get("/", HomeController);

module.exports = router;
