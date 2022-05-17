const mysql = require("mysql2")
const Util = require("./util")

// create a connection to the database
module.exports = mysql.createConnection(Util.dbConfig)
