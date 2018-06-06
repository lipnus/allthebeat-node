var express = require('express')
var app = express()
var router = express.Router(); // 라우터처리
var path = require('path') // 상대경로
var mysql = require('mysql') //express에 가면 mysql연동 정보가 있음

//간단한 함수들을 모아놓음
var simpleFunction = require('./jsfile/simple_function');

// AWS RDS연결
var connection = mysql.createConnection({
	host : 'allthebeat.csygoyq4caou.ap-northeast-2.rds.amazonaws.com',
	port : 3306,
	user : 'allthebeat',
	password : '1q2w3e4r!',
	database : 'allthebeat'
})

connection.connect();

// var savePath = "../../../../var/www/html/test";
var savePath = "../../uploadTest"; //바탕화면



//require multer for the file uploads
var multer = require('multer');
// set the directory for the uploads to the uploaded to
// var DIR = './uploads';
// //define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
// var upload = multer({dest: DIR}).single('photo');



var storage = multer.diskStorage({
  destination: function (req, file, cb) {//cb는 callback함수의 약자
    cb(null, savePath) //2번째 인자는 파일이 저장될 인자
  },
  filename: function (req, file, cb) {
    cb(null, simpleFunction.getTime() + "_" + file.originalname) //파일의 이름을 지정함
  }
});

var upload = multer({ storage: storage }).single('photo');



router.get('/', function(req, res){
  res.render('mainpage', {'testValue' : "upload"})
});



router.post('/', function(req,res){

	var path = '';
	upload(req, res, function (err) {

		console.log("지금시간: " + simpleFunction.getTime() );
		console.log("호출: ", req.file);

	  if (err) {
	    // An error occurred when uploading
	    console.log(err);
	    return res.status(422).send("an Error occured")
	  }
	 // No error occured.
	  path = req.file.path;
	  return res.send("Upload Completed for "+ path);
  });


});//post



module.exports = router;
