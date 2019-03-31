//Express 기본 모듈 불러오기.
var express = require('express');
var http = require('http');
var static = require('serve-static');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
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
  name: String,
  age: String,
  phone: String,
  email: String,
  location: String,
  date:{type:Date, default: Date.now}
});

var Quest = mongoose.model('Quest',questSchema);



//기본포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 80);

//body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());
//body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'jade')
app.set('views', './views')

app.use(session({
  secret: '12sdfwerwersdfserwerwef',
  resave: false,
  saveUninitialized: true,
  store: require('mongoose-session')(mongoose)
}));


app.get('/', function (req, res) {
  res.render('index.jade');
});

app.get('/menu', function (req, res) {
  res.render('menu.jade');
});

app.get('/location', function (req, res) {
  res.render('location.jade');
});
/*
app.get('/chain', function (req, res) {
  res.render('chain.jade');
});
*/
app.get('/question', function (req, res) {
  var session = 0;
  if(req.session.authId)
  {
    session = 1;
  }
  Quest.find({}).sort({date:-1}).exec(function(err, rawContents){
     if(err) throw err;
     res.render('question.jade', {title: "Board", contents: rawContents, session: session});
    });
});
app.post('/login', function (req, res) {
  var id = req.body.id;
  var pw = req.body.pw;
  if (id == "dodohan" && pw == ""){
    req.session.authId = id;
    req.session.save(function(){
      res.redirect('http://dodohan.ga/question');
    });
  }
  else
    res.redirect('http://dodohan.ga/question');
});

app.post('/logout', function (req, res) {
  delete req.session.authId;
  res.redirect('http://dodohan.ga/question');
});

app.post('/question', function (req, res) {
  var name = req.body.name;
  var age = req.body.age;
  var phone = req.body.phone;
  var email = req.body.email;
  var location = req.body.location;
  var quest = new Quest({name: name, age: age, phone: phone, email: email, location: location})
  quest.save(function(err){
    if (err) console.log(err);
    res.redirect('http://dodohan.ga/question');
  });
});

app.get('/question/:id', function(req, res){
  var session = 0;
  if(req.session.authId)
  {
    session = 1;
    var contentId = req.param('id');
    Quest.findOne({_id:contentId}, function(err, rawContent){
      if(err) throw err;
      res.render('questionView.jade',{title: "BoardDetail", contents: rawContent, session: session});
    });
  }
  else
    res.render('questionView.jade',{title: "BoardDetail", session: session});
});

//Express 서버 시작
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express 서버를 시작했습니다. : ' + app.get('port'));
});