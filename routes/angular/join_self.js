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



//가입처리
router.post('/', function(req, res){

	let email = req.body.email;
	let password = req.body.password;
	let state = req.body.state;

	let user_id = state; //네이버 고유번호인데 없으니 랜덤숫자값 넣음(첫 state)
	let hashPassword = encodeHash(password);
	let token = encodeHash( simpleFunction.getTime() ); //현재시간을 토큰으로 씀

	console.log("하이: ", hashPassword);

	//이메일중복 확인
	let sql = 'SELECT * FROM `user` WHERE email=?';
	let factor = [email, hashPassword];
	let query = connection.query(sql, factor, function(err, rows){
		if(err) throw err;

		if( rows.length > 0 ){
			let responseData ={};
			responseData.result = "overlap";
			res.json( responseData );
		}else{

			//db에 등록
			sql = 'insert into user set ?';
			factor = {
				id:user_id,
				email:email,
				password:hashPassword,
				token:token,
				social_type:"self",
				naver_state:state
			};

			query = connection.query(sql, factor, function(err,rows) {
				if(err) throw err;
				let responseData ={};
				responseData.result = "ok";
				responseData.state = state;
				responseData.token =  token;
				res.json( responseData ); //이후는 네이버와 동일하게 처리
			});

		}
	});//sql1

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
