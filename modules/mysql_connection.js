const mysql = require("mysql");
const DB = require("../configs/db.js");

const connection = mysql.createConnection({
  host: DB.HOST,
  user: DB.USER,
  password: DB.PASSWORD,
  database: DB.DBNAME,
});

connection.connect((e) => {
  if (e) console.log(e);
  console.log("Connected to mysql server.");
});

module.exports = connection;
