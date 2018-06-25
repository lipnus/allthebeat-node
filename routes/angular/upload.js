var express = require('express')
var app = express()
var router = express.Router(); // 라우터처리
var path = require('path') // 상대경로
var mysql = require('mysql') //express에 가면 mysql연동 정보가 있음
var simpleFunction = require('./jsfile/simple_function'); //간단한 함수들을 모아놓음

// AWS RDS연결
var connection = mysql.createConnection({
	host : 'allthebeat.csygoyq4caou.ap-northeast-2.rds.amazonaws.com',
	port : 3306,
	user : 'allthebeat',
	password : '1q2w3e4r!',
	database : 'allthebeat'
})

connection.connect();


var multer = require('multer');
var savePath = "../../../../var/www/html/sound"; //서버에서의 경로
var savePath2 = "../../../../var/www/html/artwork"; //서버에서의 경로


// var savePath = "../../uploadTest"; //바탕화면
// var savePath2 = "../../uploadTest2"; //바탕화면


var soundStorage = multer.diskStorage({
  destination: function (req, file, cb) {//cb는 callback함수의 약자
    cb(null, savePath) //2번째 인자는 파일이 저장될 인자
  },
  filename: function (req, file, cb) {
    cb(null, simpleFunction.getTime() + "_" + file.originalname) //파일의 이름을 지정함
  }
});
var imgStorage = multer.diskStorage({
  destination: function (req, file, cb) {//cb는 callback함수의 약자
    cb(null, savePath2) //2번째 인자는 파일이 저장될 인자
  },
  filename: function (req, file, cb) {
    cb(null, simpleFunction.getTime() + "_" + file.originalname) //파일의 이름을 지정함
  }
});

var upload = multer({ storage: soundStorage });
var imgUpload = multer({ storage: imgStorage });




router.get('/', function(req, res){
  res.render('mainpage', {'testValue' : "upload"})
});






//아트워크 업로드
router.post('/artwork', imgUpload.single('artwork'), function (req, res, next) {
	let responseData = {img_path: req.file.filename};
	return res.json( responseData );
});

//mp3 업로드
router.post('/mp3', upload.single('beat-mp3'), function (req, res, next) {
	let responseData = {sound_path: "/"+req.file.filename};
	return res.json( responseData );
});

//wav 업로드
router.post('/wav', upload.single('beat-wav'), function (req, res, next) {
	let responseData = {sound_path2: "/"+req.file.filename};
	return res.json( responseData );
});

//track 업로드
router.post('/track', upload.single('beat-track'), function (req, res, next) {
	let responseData = {sound_path3: "/"+req.file.filename};
	return res.json( responseData );
});



//DB에 넣음(1차적으로 토큰 확인) [1]
router.post('/dbdata', function(req,res){

 	let token = req.body.token;
	let sql = 'SELECT * FROM `user` WHERE token=?';
	var query = connection.query(sql, [token], function(err, rows){
		if(err) throw err;

		let user_pk = 0;
		if(rows.length > 0){
				user_pk=rows[0].pk;
				enrollSound(user_pk, req, res);
		}

	});//sql
});//post


//DB에 넣음 [2]
function enrollSound(token, req, res){
	let upload = req.body.data;

	sql = 'insert into sound_data set ?';
	factor = {
		user_pk:upload.user_pk, sound_name:upload.sound_name,
		sound_path:upload.sound_path, sound_path2:upload.sound_path2, sound_path3:upload.sound_path3,
		img_path:upload.img_path, bpm:upload.bpm, genre1:upload.genre1, genre2:upload.genre2,
		mood1:upload.mood1, mood2:upload.mood2, mood3:upload.mood3, license:upload.license};

	query = connection.query(sql, factor, function(err,rows) {
		if(err) throw err;
		let responseData = {result: "ok"};
		return res.json( responseData );
	});

});//post


// //가장 예전버전
// var upload = multer({ storage: storage }).single('artwork');
// router.post('/file', function(req,res){
//
// 	var path = '';
// 	upload(req, res, function (err) {
//
// 		console.log("지금시간: " + simpleFunction.getTime() );
// 		console.log("호출: ", req.file);
//
// 	  if (err) {
// 	    // An error occurred when uploading
// 	    console.log(err);
// 	    return res.status(422).send("an Error occured")
// 	  }
// 	 // No error occured.
// 	  path = req.file.path;
// 	  return res.send("Upload Completed for "+ path);
//
// 	});//upload
// });//post
//
// var arrayUpload = upload.array('artwork', 2);
// app.post('/fuck', arrayUpload, function (req, res, next) {
//   // req.files is array of `photos` files
//   // req.body will contain the text fields, if there were any
// 	return res.send("잘 올라갔다");
// });

module.exports = router;
