var express = require('express')
var app = express()
var router = express.Router(); // 라우터처리
var path = require('path') // 상대경로
var mysql = require('mysql') //express에 가면 mysql연동 정보가 있음

// AWS RDS연결
var connection = mysql.createConnection({
	host : 'allthebeat.csygoyq4caou.ap-northeast-2.rds.amazonaws.com',
	port : 3306,
	user : 'allthebeat',
	password : '1q2w3e4r!',
	database : 'allthebeat'
})

connection.connect();



router.get('/', function(req, res){
  console.log("test.js GET")
  res.render('mainpage', {'testValue' : "sound_list"})
});


router.post('/', function(req,res){

	var token = req.body.token; //토큰(비로그인 상태이면 0이 온다)
	var type = req.body.type; //request면 리턴만 answer이면 등록까지

	recommendMusic(req, res);
})


//추천곡 정보를 반환
function recommendMusic(req, res){

	var recommend_pk = req.body.recommend_pk;
	var bpm = req.body.bpm;
	var genre1 = req.body.genre1;
	var genre2 = req.body.genre2;
	var mood1 = req.body.mood1;
	var mood2 = req.body.mood2;
	var mood3 = req.body.mood3;


	var sql = 'SELECT * FROM `sound_recommend` WHERE 1';
	var factor = [];
	var query = connection.query(sql, factor, function(err, rows){
		if(err) throw err;

 		var n = Math.floor(Math.random() * rows.length) + 0;

		var responseData = {};
		responseData.recommend_pk = rows[n].pk;
		responseData.youtube = rows[n].youtube;
		responseData.bpm = rows[n].bpm;
		responseData.genre1 = rows[n].genore1;
		responseData.genre2 = rows[n].genore2;
		responseData.mood1 = rows[n].mood1;
		responseData.mood2 = rows[n].mood2;
		responseData.mood3 = rows[n].moood3;
		res.json( responseData );
})//sql

}



module.exports = router;
