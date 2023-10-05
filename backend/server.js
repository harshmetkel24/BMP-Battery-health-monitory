const express = require("express");
const cors = require("cors");
const app = express();

const path = require("path");

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));

app.use(express.static("../frontend/public"));

const routes = require("./routes/index.js");

app.use("/", routes);

app.listen(3000, () => {
  console.log("Server started (http://localhost:3000/) !");
});
