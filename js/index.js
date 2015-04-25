$(function() {
  var socket = io.connect();

<<<<<<< HEAD
  var pos;
  var tweets;

  $(window).on("load scroll resize", function() {
    var barPos = $(window).scrollTop() / ($(document).height() - $(window).height());

    if(barPos >= 0.8){
      var target = pos - 15;
      for( ;pos >= target && pos >= 0; pos--){
	tweets[pos].msg = $("<div/>").text(tweets[pos].msg).html();
	tweets[pos].msg = tweets[pos].msg.replace(/\n/g, '<br>');
	$('#logs').append(formatTweet(tweets[pos]));
      }
    }
  });
=======
  /*
  if(!$.cookie("ID") || !$.cookie("name"))
    window.location.href = "login.html";
   */
>>>>>>> 5e75e5bb4fb168f17ca71e68c9fd4a46e1de56b1

  socket.on('connect', function() {
    socket.emit('msg update');
  });

  socket.on('msg open', function(data) {
<<<<<<< HEAD
    if(pos == undefined){
      tweets = data;
      $('#logs').empty();
      for(pos = data.length - 1;pos >= data.length - 15 && pos >= 0; pos--){
	data[pos].msg  = $("<div/>").text(data[pos].msg).html();
	data[pos].name = $("<div/>").text(data[pos].name).html();
	data[pos].msg  = data[pos].msg.replace(/\n/g, '<br>');
	$('#logs').append(formatTweet(data[pos]));
      }
    }
    else{
      if(pos < 0) pos = 0;
      var targetTime = tweets[pos].time;
      tweets = data;
      $('#logs').empty();
      for(pos = data.length - 1;pos >= 0; pos--){
	data[pos].msg = $("<div/>").text(data[pos].msg).html();
	data[pos].name = $("<div/>").text(data[pos].name).html();
	data[pos].msg = data[pos].msg.replace(/\n/g, '<br>');
	$('#logs').append(formatTweet(data[pos]));
	if(data[pos].time == targetTime) break;
      }
    }
  });
  
  socket.on('push msg', function(data) {
    data.msg  = $("<div/>").text(data.msg).html();
    data.name = $("<div/>").text(data.name).html();
    data.msg  = data.msg.replace(/\n/g, '<br>');
=======
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
>>>>>>> 5e75e5bb4fb168f17ca71e68c9fd4a46e1de56b1
    $('#logs').prepend(formatTweet(data));
  });
});
