var mysql = require('mysql') //express에 가면 mysql연동 정보가 있음

// AWS RDS연결
var db_connection = mysql.createConnection({
	host : 'allthebeat.csygoyq4caou.ap-northeast-2.rds.amazonaws.com',
	port : 3306,
	user : 'allthebeat',
	password : '1q2w3e4r!',
	database : 'allthebeat'
})

exports.db_connection = db_connection;
