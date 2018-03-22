var express = require('express')
var app = express()
var router = express.Router()



router.get('/', function(req, res){
  console.log("test.js GET")
  // res.redirect('/test');
  res.render('test0', {'testValue' : "하하하"})
});


// postTest
router.post('/', function(req,res){

	input1 = req.body.input;

  var responseData = {};
  responseData.result = "nodejs server test ok";
  responseData.input = input1;
	res.json( responseData );
})

module.exports = router;
