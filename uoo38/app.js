var fs       = require('fs');
var http     = require('http');
var crypto   = require('crypto');
var socketio = require('socket.io');
var mongoose = require('mongoose');
var settings = require('./settings.js');
var server   = http.createServer(handler);

server.listen(settings.port);
mongoose.connect('mongodb://' + settings.host + '/' + settings.db);

/* DBに登録するデータ型の定義 */
var Schema = mongoose.Schema;
var TweetSchema = new Schema({
  id:   String,
  msg:  String,
  name: String,
  time: Date
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

/* HTMLファイル 読み込み */
function handler(req, res){
  switch (req.url){
    case '/':
    case '/home':
      fs.readFile('./home.html', 'utf-8', function(err, data) {
	if(err){
	  res.writeHead(500);
	  return res.end(err);
	}
	res.writeHead(200);
	res.write(data);
	res.end();
      });
      break;
    case '/register':
      fs.readFile('./register.html', 'utf-8', function(err, data) {
	if(err){
	  res.writeHead(500);
	  return res.end(err);
	}
	res.writeHead(200);
	res.write(data);
	res.end();
      });
      break;
    case '/login':
      fs.readFile('./login.html', 'utf-8', function(err, data) {
	if(err){
	  res.writeHead(500);
	  return res.end(err);
	}
	res.writeHead(200);
	res.write(data);
	res.end();
      });
      break;
    default:
      fs.readFile('./notfound.html', 'utf-8', function(err, data) {
	if(err){
	  res.writeHead(500);
	  return res.end(err);
	}
	res.writeHead(404);
	res.write(data);
	res.end();
      });
      break;      
  }
}

/* サーバ・クライアント間の通信 */
var io = socketio.listen(server);
io.sockets.on('connection', function(socket) {
  socket.on('msg update', function() {
    Tweet.find(function(err, docs){
      socket.emit('msg open', docs);
    });
  });

  socket.on('send msg', function(data) {
    io.sockets.json.emit('push msg', data);

    var tweet  = new Tweet();
    tweet.msg  = data.msg;
    tweet.name = data.name;
    tweet.time = data.time;

    tweet.save(function(err) {
      if(err)
	console.log(err);
    });
  });
  socket.on('create user', function(data) {
    User.find({id: data.id}, function(err, docs) {
      socket.emit('reply create user', docs.length);

      if(docs.length == 0){
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
    User.find(query, function(err, docs) {
      socket.emit('reply login', docs.length);
    });
  });

  socket.on('del name', function(data) {
    if(data.pass == settings.pass){
      Tweet.remove({name: data.name}, function(err) {
	if(err)
	  console.log(err);
      });
      Tweet.find(function(err, docs) {
	io.sockets.emit('msg open', docs);
      });
    }
  });
  socket.on('del time', function(data) {
    var date = new Date(data.time);
    if(data.pass == settings.pass){
      Tweet.remove({time: date}, function(err) {
	if(err)
	  console.log(err);
      });
      Tweet.find(function(err, docs) {
	io.sockets.emit('msg open', docs);
      });
    }
  });
  socket.on('del msg', function(data) {
    if(data.pass == settings.pass){
      Tweet.remove({msg: data.msg}, function(err) {
	if(err)
	  console.log(err);
      });
      Tweet.find(function(err, docs) {
	io.sockets.emit('msg open', docs);
      });
    }
  });
});
