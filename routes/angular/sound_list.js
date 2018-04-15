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
  res.render('mainpage', {'testValue' : "sound_detail"})
});



router.post('/', function(req,res){

	//토큰(비로그인 상태이면 0)
	token = req.body.token;
	console.log(token);

	//토큰을 이용하여 user_pk를 찾는다
	if(token==0){
		sound_list(0, res);
	}
	else{

		var sql = 'SELECT * FROM `user` WHERE token=?';
		var factor = [token];
		var query = connection.query(sql, factor, function(err, rows){
			if(err) throw err;

			var user_pk = 0;
			user_pk=rows[0].pk;
			sound_list(user_pk, res);

		});//sql
	}
});//post

function sound_list(usre_pk, res){

	//음원리스트
	var sql = 'SELECT sound_data.pk AS sound_pk, sound_data.sound_name, sound_data.sound_path, sound_data.bpm, user.nickname AS beatmaker_nickname, sound_data.img_path, sound_data.like_count, user_like.user_pk AS like_my FROM sound_data INNER JOIN user ON sound_data.user_pk = user.pk LEFT JOIN user_like ON sound_data.pk = user_like.sound_pk AND user_like.user_pk = ? ORDER BY sound_data.pk DESC';
	var factor = [usre_pk];
	var query = connection.query(sql, factor, function(err, rows){
		if(err) throw err;

		var responseData = {};

		//추천리스트(5개)
		//==================================================
		// user_pk에 해당하는 추천목록을 선정하는 알고리즘추가
		//==================================================
		responseData.sound_recommend_list = [];
		for(var i=0; i<5; i++){

			//랜덤추출
			var j =Math.floor(Math.random() * rows.length) + 0;
			// console.log("test: " + j + " / " + rows[j].sound_name);

			var my_heart=0;
			// console.log(rows[j].sound_pk + " / "+ rows[j].like_my)
			if(rows[j].like_my != null){
				my_heart=1;
			}

			var obj = {
				sound_pk: rows[j].sound_pk,
				sound_name: rows[j].sound_name,
				sound_path: rows[j].sound_path,
				sound_bpm: rows[j].bpm,
				beatmaker_nickname: rows[j].beatmaker_nickname,
				img_path: rows[j].img_path,
				like_count: rows[i].like_count,
				like_my: my_heart
			};
			responseData.sound_recommend_list.push(obj);
		}; //for




		//전체리스트
		responseData.sound_list = [];
		for(var i=0; i<rows.length; i++){

			var my_heart=0;
			// console.log(rows[i].sound_pk + " / "+ rows[i].like_my)
			if(rows[i].like_my != null){
				my_heart=1;
			}

			var obj = {
				sound_pk: rows[i].sound_pk,
				sound_name: rows[i].sound_name,
				sound_path: rows[i].sound_path,
				sound_bpm: rows[i].bpm,
				beatmaker_nickname: rows[i].beatmaker_nickname,
				img_path: rows[i].img_path,
				like_count: rows[i].like_count,
				like_my: my_heart
			};
			responseData.sound_list.push(obj);
		}; //for

		// shuffle(responseData.sound_list); //리스트를 한번 섞어준다

		res.json( responseData );

	});//sql-1
}


//행렬순서를 섞는 함수
function shuffle(arr){
 if(arr instanceof Array){
	  var len = arr.length;
	  if(len == 1) return arr;
	  var i = len * 2;

		while(i > 0){
		   var idx1 = Math.floor(Math.random()* len);
		   var idx2 = Math.floor(Math.random()* len);

			 // var idx1 = Math.floor(0.5* len);
		   // var idx2 = Math.floor(0.3* len);

		   if(idx1 == idx2) continue;
		   var temp = arr[idx1];
		   arr[idx1] = arr[idx2];
		   arr[idx2] = temp;
		   i--;
	  }
	}
	else{
	  alert("No Array Object");
	}
	return arr;
}

module.exports = router;
