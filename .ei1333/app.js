var fs       = require('fs');
var http     = require('http');
var crypto   = require('crypto');
var socketio = require('socket.io');
var settings = require('./settings.js');
var server   = http.createServer(handler);

server.listen(settings.port);

function handler(req, res){
  var uri = '.' + req.url;
  if(uri == './')
    uri = './index.html';

  /* 拡張子の取得 */
  var splits = uri.split('.');
  var extension = splits[splits.length - 1];

  if(extension == 'jpeg' || extension == 'jpg' || extension == 'png'){
    fs.readFile(uri, function(err, data) {
      if(err){

      } else {
	res.writeHead(200);
	res.write(data);
	res.end();
      }
    });
  } else {
    fs.readFile(uri, 'utf-8', function(err, data) {
      if(err){
        fs.readFile('./index.html', 'utf-8', function(err, data) {
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

var io = socketio.listen(server);

var user = [];
var socketsof = [];

io.sockets.on('connection', function(socket) {
    socket.json.emit('mypos', {
      pos: user.length
    });

    socket.on('mychara', function(client) { //自分の情報をセットする
        
        if(socketsof.length >= 4){ //4人以上の接続 入場制限
          socket.emit("connect_out");
          return;
        }

       socket.set('client', client, function() { //クライアントの情報をセット
            socketsof.push(socket);
        });

        user.push(client.id);
        console.log("user: " , client.id , "In");
 
        if(socketsof.length != 1){
          for(var i = 0; i < socketsof.length - 1; i++){ //自分以外にsend
            socketsof[i].json.emit('addplayer', {
              user: user[socketsof.length - 1],
                  pos: socketsof.length - 1 /* 場所 */
            });
          }
          for(var i = 0; i < socketsof.length - 1; i++){ //自分にsend
            socketsof[socketsof.length - 1].json.emit('addplayer', {
              user: user[i],
              pos: i/* 場所 */
            });
          }
        }
    });

    socket.on('playerpoint', function(msg) {
        for(var i = 0; i < socketsof.length; i++){
          if(socketsof[i] != socket){
            socketsof[i].json.emit('getplayer_point', msg);
          }
        }
    });

    socket.on('rateUp', function(msg) { //自分以外のソケットに送る
        for(var i = 0; i < socketsof.length; i++){
          if(socketsof[i] != socket){
            socketsof[i].json.emit('getrate_Up', msg);
          }
        }
    });

    socket.on('attacked', function(msg) { //自分以外のソケットに送る
        for(var i = 0; i < socketsof.length; i++){
          //          if(socketsof[i] != socket){
            socketsof[i].json.emit('getattack', msg);
            //}
        }
    });


});
