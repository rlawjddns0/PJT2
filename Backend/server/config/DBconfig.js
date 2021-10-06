const mysql = require('mysql');
var DB = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Snekers11!',
    database : 'ssafy_app_db'
});

DB.connect()

module.exports=DB;