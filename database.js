const mysql = require("mysql2")
const Util = require("./util")

// create the connection to database
module.exports = mysql.createConnection(Util.dbConfig)
