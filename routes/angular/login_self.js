var express = require('express')
var app = express()
var router = express.Router(); // 라우터처리
var path = require('path') // 상대경로
var mysql = require('mysql') //express에 가면 mysql연동 정보가 있음
var crypto = require('crypto');

var hash_key = 'allthebeat';
var config = require('./function/config.js'); // AWS RDS연결
var connection = config.db_connection;
// connection.connect();

var simpleFunction = require('./jsfile/simple_function.js');



//login처리
router.post('/', function(req, res){

	let email = req.body.email;
	let password = req.body.password;
	let hashPassword = encodeHash(password);

	//db와 대조
	let sql = 'SELECT * FROM `user` WHERE email=? AND password=?';
	let factor = [email, hashPassword];
	let query = connection.query(sql, factor, function(err, rows){
		if(err) throw err;

		let responseData = {};

		//아이디 비번 일치
		if( rows.length>0 ){
			//토큰 재발급. 현재시간을 해쉬화해서 토큰만듦
			let token = encodeHash( simpleFunction.getTime() );
			let user_pk = rows[0].pk;

			//DB에 발급된 토큰 업데이트
			sql = 'UPDATE user SET token=? WHERE pk=?';
			factor = [token, user_pk];
			query = connection.query(sql, factor, function(err, rows){
				if(err) throw err;
				responseData.result = "ok";
				responseData.token =  token;
				res.json( responseData ); //이후는 네이버와 동일하게 처리
			});//수정 update

		}else{
			let responseData = {result:"no"};
			res.json( responseData ); //아뒤비번 안마즐}
		}

	});//sql
});//post


//암호화
function encodeHash(input){
	console.log("encodeHash-" +input);
	let cipher = crypto.createCipher('aes192', hash_key);
	cipher.update(input, 'utf8', 'base64');
	let cipheredOutput = cipher.final('base64');
	return cipheredOutput;
}



module.exports = router;
