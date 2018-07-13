//Express 기본 모듈 불러오기.
var express = require('express');
var http = require('http');
var static = require('serve-static');
var bodyParser = require('body-parser');
var path = require('path');
//Express 객체 생성
var app = express();

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

var questSchema = mongoose.Schema({
  title: String,
  content: String,
  date:{type:Date, default: Date.now}
});

var Quest = mongoose.model('Quest',questSchema);

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
  Quest.find({}).sort({date:-1}).exec(function(err, rawContents){
    // db에서 날짜 순으로 데이터들을 가져옴
     if(err) throw err;
     res.render('question.jade', {title: "Board", contents: rawContents}); 
     // board.ejs의 title변수엔 “Board”를, contents변수엔 db 검색 결과 json 데이터를 저장해줌.
 });
});
app.post('/question', function (req, res) {
  var title = req.body.title;
  var content = req.body.content;
  var quest = new Quest({title:title, content:content})
  quest.save(function(err){
    if (err) console.log(err);
    res.redirect('http://localhost:3000/question');
  });
});

app.get('/question/:id', function(req, res){
  // 글 보는 부분. 글 내용을 출력하고 조회수를 늘려줘야함
  var contentId = req.param('id');
  Quest.findOne({_id:contentId}, function(err, rawContent){
    if(err) throw err;
       //rawContent.count += 1; // 조회수를 늘려줍니다.
       //rawContent.save(function(err){ // 변화된 조횟수 저장
           //if(err) throw err;
    res.render('questionView.jade',{title: "BoardDetail", contents:rawContent}); // db에서 가져온 내용을 뷰로 렌더링
       //});
   });
});


//Express 서버 시작
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express 서버를 시작했습니다. : ' + app.get('port'));
});