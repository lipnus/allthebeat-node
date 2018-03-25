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

	var user_pk = req.body.user_pk;
	var sound_pk = req.body.sound_pk;

	//음원리스트
	var sql = 'select sound_data.pk AS sound_pk, sound_data.user_pk AS beatmaker_pk, user.nickname AS beatmaker_nickname, sound_data.sound_name, sound_data.bpm, sound_data.sound_path, sound_data.sound_path, sound_data.img_path, sound_data.genre1, sound_data.genre2, sound_data.mood1, sound_data.mood2, sound_data.mood3, sound_data.type1, sound_data.type2, sound_data.type3, sound_data.like_count from sound_data, user where sound_data.pk=? AND sound_data.user_pk = user.pk';
	var factor = [sound_pk];
	var query = connection.query(sql, factor, function(err, rows){
		if(err) throw err;

		var responseData = {};
				responseData.sound_pk= rows[0].sound_pk;
				responseData.beatmaker_pk= rows[0].beatmaker_pk;
				responseData.beatmaker_nickname= rows[0].beatmaker_nickname;
				responseData.sound_path= rows[0].sound_path;
				responseData.sound_name= rows[0].sound_name;
				responseData.sound_bpm= rows[0].bpm;
				responseData.img_path= rows[0].img_path;
				responseData.genre1= rows[0].genre1;
				responseData.genre2= rows[0].genre2;
				responseData.mood1= rows[0].mood1;
				responseData.mood2= rows[0].mood2;
				responseData.mood3= rows[0].mood3;
				responseData.type1= rows[0].type1;
				responseData.type2= rows[0].type2;
				responseData.type3= rows[0].type3;
				responseData.like_count= rows[0].like_count;
				responseData.like_my= 0;
		res.json( responseData );

	});//sql-1
});//post


module.exports = router;
