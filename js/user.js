$(function() {
  var socket = io.connect();

  var id   = $('#userID').text().substr(1);
  var name = $('#userName').text();

  $('#config').click(function() {
    window.location.href = "/config.html";
  });

  socket.on('connect', function() {
    socket.emit('user tweet', id);
  });

  $('#tweetNum').click(function() {
    socket.emit('user tweet', id);
    
    $('#tweetNum').parent().addClass('selected');
    $('#tweetNum').parent().removeClass('unselected');
    $('#favoNum').parent().removeClass('selected');
    $('#favoNum').parent().addClass('unselected');

  });

  $('#favoNum').click(function() {
    socket.emit('user favo', id);

    $('#favoNum').parent().addClass('selected');
    $('#favoNum').parent().removeClass('unselected');
    $('#tweetNum').parent().removeClass('selected');
    $('#tweetNum').parent().addClass('unselected');
  });

  socket.on('reply user tweet', function(data) {
    $('#logs').empty();

    if(data[0].id != id) return; // もし自分のついーとではなければreturn
    $.each(data, function(key, value) {
<<<<<<< HEAD
      value.msg  = $("<div/>").text(value.msg).html();
      value.name = $("<div/>").text(value.name).html();
      value.msg  = value.msg.replace(/\n/g, '<br>');
=======
      value.msg = $("<div/>").text(value.msg).html();
      value.msg = value.msg.replace(/\n/g, '<br>');
>>>>>>> 5e75e5bb4fb168f17ca71e68c9fd4a46e1de56b1
      $('#logs').prepend(formatTweet(value));
    });
  });

  socket.on('reply user favo', function(data) {
    $('#logs').empty();
    $.each(data, function(key, value) {
<<<<<<< HEAD
      value.msg  = $("<div/>").text(value.msg).html();
      value.name = $("<div/>").text(value.name).html();
      value.msg  = value.msg.replace(/\n/g, '<br>');
=======
      value.msg = $("<div/>").text(value.msg).html();
      value.msg = value.msg.replace(/\n/g, '<br>');
>>>>>>> 5e75e5bb4fb168f17ca71e68c9fd4a46e1de56b1
      $('#logs').prepend(formatTweet(value));
    });
  });

  socket.on('push msg', function(data) {
    if(data.id == id){ // もし自分のついーとならprepend()
<<<<<<< HEAD
      data.msg  = $("<div/>").text(data.msg).html();
      data.name = $("<div/>").text(data.name).html();
      data.msg  = data.msg.replace(/\n/g, '<br>');
=======
      data.msg = $("<div/>").text(data.msg).html();
      data.msg = data.msg.replace(/\n/g, '<br>');
>>>>>>> 5e75e5bb4fb168f17ca71e68c9fd4a46e1de56b1
      $('#logs').prepend(formatTweet(data));
    }
  });
});
