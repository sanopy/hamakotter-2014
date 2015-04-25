$(function() {
  var socket = io.connect();

  socket.on('count update', function(data) {
    $('#counter').text('現在アクセスしている人数 ' + data + '人');
  });
});
