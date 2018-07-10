//Express 기본 모듈 불러오기.
var express = require('express');
var http = require('http');
var static = require('serve-static');
var bodyParser = require('body-parser');
var path = require('path');
//Express 객체 생성
var app = express();

//기본포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000);


//body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: true }));

//body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

//app.use(static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade')
app.set('views', './views')
//app.set('views', __dirname + '/views');
//app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'html');

//미들웨어에서 파라미터 확인
/*
app.use(function(req, res, next){
  console.log('첫번째 미들웨어에서 요청을 처리함.');

  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;

  res.writeHead('200',{'Content-type':'text/html;charset=utf8'});
  res.write('<h1>express 서버에서 응답한 결과입니다.</h1>');
  res.write('<div><p>param id: '+paramId+'</p></div>');
  res.write('<div><p>param password: '+paramPassword+'</p></div>');
  res.end();
});
*/
app.get('/', function (req, res) {
  res.render('index.jade');
});

app.get('/menu', function (req, res) {
  res.render('menu.jade');
});

app.get('/location', function (req, res) {
  res.render('location.jade');
});

app.get('/chain', function (req, res) {
  res.render('chain.jade');
});

app.get('/question', function (req, res) {
  res.render('question.jade');
});


//Express 서버 시작
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express 서버를 시작했습니다. : ' + app.get('port'));
});