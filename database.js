const mysql = require('mysql2');

// create the connection to database
module.exports = mysql.createConnection({
  host: '3.120.172.22',
  user: 'gdansk_uczen',
  password: '123456',
  database: 'projekt_gdynia'
});