var fs       = require('fs');
var ejs      = require('ejs');
var http     = require('http');
var crypto   = require('crypto');
var cookie   = require('cookie');
var mongoose = require('mongoose');
var socketio = require('socket.io');
var settings = require('./settings.js');

var server = http.createServer(handler);
server.listen(settings.port);

mongoose.connect('mongodb://' + settings.host + '/' + settings.db);

/* DBに登録するデータ型の定義 */
var Schema = mongoose.Schema;
var TweetSchema = new Schema({
  id:   String,
  msg:  String,
  name: String,
  time: Date,
  favo: []
});

var UserSchema = new Schema({
  id:       String,
  name:     String,
  password: String
});

mongoose.model('Tweet', TweetSchema);
mongoose.model('User', UserSchema);

var Tweet = mongoose.model('Tweet');
var User  = mongoose.model('User');
/* ここまで */

/* ejsテンプレートの読み込み */
var userFile = fs.readFileSync('./user.ejs', 'utf8');

/* HTMLファイル 読み込み */
function handler(req, res){
  var uri = '.' + req.url;
  if(uri == './')
    uri = './index.html';

  console.log(uri);

  /* 拡張子の取得 */
  var splits = uri.split('.');
  var extension = splits[splits.length - 1];

  var paths = uri.split('/');

  var contentType;
  switch(extension){
    case 'html':
      contentType = {'Content-Type': 'text/html'};
      break;
    case 'css':
      contentType = {'Content-Type': 'text/css'};
      break;
    case 'js':
      contentType = {'Content-Type': 'text/javascript'};
    case 'jpeg':
      contentType = {'Content-Type': 'image/jpeg'};
      break;
    case 'png':
      contentType = {'Content-Type': 'image/png'};
      break;
  }
  /* ユーザーページ(自分のページ)のリクエスト処理  */
  if(uri == './user.html'){
    /* cookieが空の時のエラー処理 */
    if(req.headers.cookie == null) {
      fs.readFile('./notfound.html', 'utf-8', function(err, data) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
      return;
    }

    var cookies = cookie.parse(req.headers.cookie); // cookieが空だとここで鯖が落ちる
    var ID = cookies.ID;
    
    sendUserPage(ID, 'selected', res);
  }
  /* ユーザーページ(他人のページ)のリクエスト処理 */
  else if(paths.length == 3 && paths[1] == 'users'){
    var ID = paths[2];

    sendUserPage(ID, '', res);
  }
  /* 画像ファイルのリクエスト処理 */
  else if(extension == 'jpeg' || extension == 'jpg' || extension == 'png'){
    fs.readFile(uri, function(err, data) {
      if(err){
	fs.readFile('./img/img-notfound.png', function(err, data) {
	  res.writeHead(200, {'Content-Type': 'image/png'});
	  res.write(data);
	  res.end();
	});
      } else {
	res.writeHead(200, contentType);
	res.write(data);
	res.end();
      }
    });
  } 
  else {
    fs.readFile(uri, 'utf-8', function(err, data) {
      if(err){
        fs.readFile('./notfound.html', 'utf-8', function(err, data) {
          res.writeHead(404, {'Content-Type': 'text/html'});
          res.write(data);
          res.end();
        });
      } else {
        res.writeHead(200, contentType);
        res.write(data);
        res.end();
      }
    });
  }
}

/* サーバ・クライアント間の通信 */
var access = 0;
var io = socketio.listen(server, {'log level': 2});
io.sockets.on('connection', function(socket) {
  /* アクセスカウンター */
  io.sockets.emit('count update', ++access);
  socket.on('disconnect', function() {
    io.sockets.emit('count update', --access);
  });

  socket.on('msg update', function() {
    Tweet.where().sort({'time':'asc'}).exec(function(err, docs) {
      socket.emit('msg open', docs);
    });
  });

  socket.on('send msg', function(data) {

    var tweet  = new Tweet();
    tweet.id   = data.id;
    tweet.msg  = data.msg;
    tweet.name = data.name;
    tweet.time = data.time;
    tweet.favo = [];

    io.sockets.emit('push msg', tweet);

    tweet.save(function(err) {
      if(err)
        console.log(err);
    });
  });
  socket.on('create user', function(data) {
    User.findOne({id: data.id}, function(err, doc) {
      socket.emit('reply create user', doc);

      if(!doc){
        var md5 = crypto.createHash('md5');
        md5.update(data.password);

        var user = new User();
        user.id       = data.id;
        user.name     = data.name;
        user.password = md5.digest('hex');

        user.save(function(err) {
          if(err)
            console.log(err);
        });
      }
    });
  });

  socket.on('login', function(data) {
    var md5 = crypto.createHash('md5');
    md5.update(data.password);
    var pass = md5.digest('hex');

    var query = {'$and':[
      {id: data.id},
      {password: pass}
    ]};
    User.findOne(query, function(err, doc) {
      socket.emit('reply login', doc);
    });
  });

  socket.on('user tweet', function(data) { /* ユーザーのついーとを取得 */
    Tweet.where({id: data}).sort({'time':'asc'}).exec(function(err, docs) {
      socket.emit('reply user tweet', docs);
    });
  });

  socket.on('user favo', function(data) { /* ユーザーのふぁぼを取得 */
    Tweet.where({favo: { $in:[data] } }).sort({'time':'asc'}).exec(function(err, docs) {
      socket.emit('reply user favo', docs);
    });
  });

  socket.on('favo', function(data) { /* ふぁぼられた時の処理 */
    var query = {'$and':[
      {id: data.target},
      {time: data.date}
    ]};
    Tweet.findOne(query, function(err, doc) { /* ユーザーがそのついーとを既にふぁぼっているか */
      if(doc == null){ /* ついーと情報がない */
	console.log("err: Nothing tweet");
	return;
      }
      else if(doc.favo.indexOf(data.id) == -1) /* ふぁぼってなかった */
	doc.favo.push(data.id);
      else{ /* ふぁぼってた */
	for(var i = 0;i < doc.favo.length; i++){
	  if(doc.favo[i] == data.id){
	    doc.favo.splice(i, 1);
	    break;
	  }
	}
      }

      var tweet  = new Tweet();
      //tweet._id  = doc._id;
      tweet.id   = doc.id;
      tweet.msg  = doc.msg;
      tweet.name = doc.name;
      tweet.time = doc.time;
      tweet.favo = doc.favo;

      /* ついーと情報を更新 */
      Tweet.remove(query, function(err) {
	if(err)
	  console.log(err);
	
	tweet.save(function(err) {
	  if(err)
	    console.log(err);
	});
      });
    });
  });

  socket.on('tweetRemove', function(data) {
    var query = {'$and':[
      {id: data.id},
      {time: data.date}
    ]};

    Tweet.remove(query, function(err) {
      if(err)
	console.log(err);
    });

    Tweet.where().sort({'time':'asc'}).exec(function(err, docs) {
      socket.emit('msg open', docs);
    });

    Tweet.where({id: data}).sort({'time':'asc'}).exec(function(err, docs) {
      socket.emit('reply user tweet', docs);
    });
  });
});

function sendUserPage(ID, select, res){
    var name, tweet, favo;

  User.findOne({id: ID}, function(err, doc) {
    if(err){
      console.log(err);
      return;
    }
    else if(doc == null){
      fs.readFile('./notfound.html', 'utf-8', function(err, data) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });

      return;
    }

    /* User Name を取得 */
    name = doc.name;

    /* ツイート数を取得 */
    Tweet.find({id: ID}, function(err, docs) {
      tweet = docs.length;
      /* ふぁぼ数を取得 */
      Tweet.find({favo: { $in:[ID] } }, function(err, docs) {
	favo = docs.length;
	
	var userData = ejs.render(userFile, {
	  userIcon: '/img/' + ID + '.jpeg',
	  userName: name,
	  userID:   '@' + ID,
	  tweetNum: tweet + ' ついーと',
	  favoNum:  favo + ' ふぁぼ',
	  select: select
	});
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(userData);
	res.end();
      });
    });
  });
}
