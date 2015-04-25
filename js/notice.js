$(function() {
  var socket = io.connect();

  var id   = $.cookie('ID');
  var name = $.cookie('name');

  socket.on('connect', function() {
    socket.emit('msg update');
  });

  socket.on('msg open', function(data) {
    $('#logs').empty();
    $.each(data, function(key, value) {
      var target_id = value.msg.match(/@[A-Za-z0-9_]+/g);

      if(target_id != null && target_id.indexOf('@' + id) != -1){
<<<<<<< HEAD
	value.msg  = $("<div/>").text(value.msg).html();
	value.name = $("<div/>").text(value.name).html();
	value.msg  = value.msg.replace(/\n/g, '<br>');
=======
	value.msg = $("<div/>").text(value.msg).html();
	value.msg = value.msg.replace(/\n/g, '<br>');
>>>>>>> 5e75e5bb4fb168f17ca71e68c9fd4a46e1de56b1
	$('#logs').prepend(formatTweet(value));
      }
    });
  });

  socket.on('push msg', function(data) {
    var target_id = data.msg.match(/@[A-Za-z0-9_]+/g);
    
    if(target_id != null && target_id.indexOf('@' + id) != -1) {
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

  socket.on('notice favo', function(data) {
    /* ふぁぼ処理 */
  });

<<<<<<< HEAD
});
=======
});
>>>>>>> 5e75e5bb4fb168f17ca71e68c9fd4a46e1de56b1
