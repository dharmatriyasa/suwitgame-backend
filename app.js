// FSW2108KM0014

const path = require("path");
const express = require("express");
const fs = require("fs");

const USER_INFO = require("./data/user.json");

const DATA_PATH = path.join(__dirname, "data/user.json");

const getFunction = require("./function/token");

// express
const app = express();

// access token
const ACCESS_TOKEN = getFunction.generateToken();

// use parser to support JSON encoded bodies
app.use(express.json());

// use parser to support URL encoded bodies
app.use(express.urlencoded({ extended: true }));

// default view folder
app.set("views", path.join(__dirname, "views"));

// set view engine
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

// session
const session = require("express-session");
app.use(
  session({
    secret: "rahasia",
    resave: true,
    saveUninitialized: true,
  })
);

const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");

app.use(userRoutes);
app.use(adminRoutes);

// ERROR HANDLING

app.use((req, res, next) => {
  const error = new Error("404 Not Found");
  error.status = 404;
  console.log(error.status);
  next(error);
});

app.use((error, req, res, next) => {
  if ((error.status || 500) === 404) {
    res.status(error.status).json({
      status: "FAIL",
      message: "not found",
    });
    console.log("not found");
  } else {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
    console.log(error.message);
  }
});

app.listen(5000);
