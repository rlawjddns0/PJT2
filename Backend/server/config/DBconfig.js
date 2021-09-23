const mysql = require('mysql');
var DB = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'ssafy_app_db'
});

DB.connect()

module.exports=DB;