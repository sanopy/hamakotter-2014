var fs       = require('fs');
var http     = require('http');
var crypto   = require('crypto');
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
  var uri = '.' + req.url;
  if(uri == './')
    uri = './index.html';

  console.log(uri);

  /* 拡張子の取得 */
  var splits = uri.split('.');
  var extension = splits[splits.length - 1];

  if(extension == 'jpeg' || extension == 'jpg'){
    fs.readFile(uri, function(err, data) {
      res.writeHead(200);
      res.write(data);
      res.end();
    });
  } else {
    fs.readFile(uri, 'utf-8', function(err, data) {
      if(err){
        fs.readFile('./notfound.html', 'utf-8', function(err, data) {
          res.writeHead(404);
          res.write(data);
          res.end();
        });
      } else {
        res.writeHead(200);
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
    Tweet.find(function(err, docs){
      socket.emit('msg open', docs);
    });
  });

  socket.on('send msg', function(data) {
    io.sockets.json.emit('push msg', data);

    var tweet  = new Tweet();
    tweet.id   = data.id;
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
});
