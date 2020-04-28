const express = require("express");
const mysql = require("mysql");
const inquirer = require("inquirer");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "employeeTracker_db"
  });
  
  connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
  
    // Starts the server to begin listening
    // =============================================================
    app.listen(PORT, function () {
      console.log("App listening on PORT " + PORT);
    });
  });