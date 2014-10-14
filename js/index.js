$(function() {
  var socket = io.connect();

  /*
  if(!$.cookie("ID") || !$.cookie("name"))
    window.location.href = "login.html";
   */

  socket.on('connect', function() {
    socket.emit('msg update');
  });

  socket.on('msg open', function(data) {
    $('#logs').empty();
    $.each(data, function(key, value) {
      value.msg = $("<div/>").text(value.msg).html();
      value.msg = value.msg.replace(/\n/g, '<br>');
      $('#logs').prepend(formatTweet(value));
    });
  });
  
  socket.on('push msg', function(data) {
    data.msg = $("<div/>").text(data.msg).html();
    data.msg = data.msg.replace(/\n/g, '<br>');
    $('#logs').prepend(formatTweet(data));
  });
});
