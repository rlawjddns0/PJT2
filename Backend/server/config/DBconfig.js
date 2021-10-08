const mysql = require('mysql');
var DB = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1q2w3e4r1!',
    database : 'ssafy_app_db'
});

DB.connect()

module.exports=DB;