var express = require('express')
var app = express()
var router = express.Router()

//경로설정
var path = require('path');
var test = require('./test/test');


var android_group = require('./android/group');
var android_user = require('./android/user');
var android_chat_basicinfo = require('./android/chat_basicinfo');
var android_chat_behavior = require('./android/chat_behavior');
var android_chat_aptitude = require('./android/chat_aptitude');
var android_chat_balance = require('./android/chat_balance');
var android_serverinfo = require('./android/serverinfo');
var android_delete_aptitude = require('./android/delete_aptitude');

//[Allthebeat WEB App]
var sound_list = require('./angular/sound_list');
var sound_detail = require('./angular/sound_detail');
var sound_nextplay = require('./angular/sound_nextplay');
var purchase = require('./angular/purchase');
var authentication = require('./angular/authentication');
var auth_naver = require('./angular/auth_naver');
var user = require('./angular/user');
var user_like = require('./angular/user_like');
var user_update = require('./angular/user_update');
var recommend = require('./angular/sound_recommend');

var search = require('./angular/search');
var upload = require('./angular/upload');




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//테스트
router.use('/test', test);

//안드로이드
router.use('/android/group', android_group);
router.use('/android/user', android_user);
router.use('/android/chat_basicinfo', android_chat_basicinfo);
router.use('/android/chat_behavior', android_chat_behavior);
router.use('/android/chat_aptitude', android_chat_aptitude);
router.use('/android/chat_balance', android_chat_balance);
router.use('/android/serverinfo', android_serverinfo);
router.use('/android/delete_aptitude', android_delete_aptitude);

// All the beat angular
router.use('/sound_list', sound_list);
router.use('/sound_detail', sound_detail);
router.use('/purchase', purchase);
router.use('/authentication', authentication);
router.use('/auth_naver', auth_naver);
router.use('/user', user);
router.use('/user_like', user_like);
router.use('/user_update', user_update);
router.use('/search', search);
router.use('/sound_nextplay', sound_nextplay);
router.use('/recommend', recommend);
router.use('/upload', upload);


module.exports = router;
