var express = require('express')
var app = express()
var router = express.Router(); // 라우터처리
var path = require('path') // 상대경로
var mysql = require('mysql') //express에 가면 mysql연동 정보가 있음

// AWS RDS연결
var config = require('./function/config.js'); // AWS RDS연결
var connection = config.db_connection;
// connection.connect();




router.post('/', function(req,res){
	token = req.body.token;
	console.log(token);

	var sql = 'SELECT * FROM `user` WHERE token=?';
	var factor = [token];
	var query = connection.query(sql, factor, function(err, rows){
		if(err) throw err;

		if(rows.length > 0){
      let user_pk=rows[0].pk;
      mybeat(user_pk, res);
		}else{
      res.json( {result:"error"} );
    }
	});//sql
})//post

function mybeat(user_pk, res){
	//음원리스트
	var sql = 'SELECT * FROM `sound_data` WHERE user_pk = ?';
	var factor = [user_pk];
	var query = connection.query(sql, factor, function(err, rows){
		if(err) throw err;

    let responseData={};
		responseData.sound_list = [];
		for(let i=0; i<rows.length; i++){

			var obj = {
				sound_pk: rows[i].pk,
				sound_name: rows[i].sound_name,
				sound_path: rows[i].sound_path,
				sound_bpm: rows[i].bpm,
				beatmaker_nickname: rows[i].beatmaker_nickname,
				img_path: rows[i].img_path,
				like_count: rows[i].like_count,
			};

			responseData.sound_list.push(obj);
		}; //for

    res.json(responseData);
	});//sql
}

router.post('/modify', function(req,res){
	let sound_pk = req.body.sound_pk;
	let sound_detail = req.body.sound_detail;

	let sound_name = sound_detail.sound_name;
	let sound_bpm = sound_detail.sound_bpm;
	let genre1 = sound_detail.genre1;
	let genre2 = sound_detail.gnere2;
	let mood1 = sound_detail.mood1;
	let mood2 = sound_detail.mood2;
	let mood3 = sound_detail.mood3;

	console.log(sound_detail);


	sql = 'UPDATE sound_data SET sound_name=?, bpm=?, genre1=?, genre2=?, mood1=?, mood2=?, mood3=? WHERE pk=?';
	factor = [sound_name, sound_bpm, genre1, genre2, mood1, mood2, mood3, sound_pk];
	query = connection.query(sql, factor, function(err, rows){

		if(err) throw err;
		let responseData = {};
		responseData.result="ok";
		res.json( responseData );
	});

})//post

router.post('/delete', function(req,res){
	let sound_pk = req.body.sound_pk;

	var sql = 'DELETE FROM `sound_data` WHERE pk=?';
	var factor = [sound_pk];
	var query = connection.query(sql, factor, function(err, rows){
		if(err) throw err;
    res.json( {result:"ok"} );
  });//sql
})//post















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
