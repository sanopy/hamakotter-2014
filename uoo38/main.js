$(function(){
  var socket = io.connect();

  socket.on('connect', function(){
    socket.emit('msg update');
  });

  socket.on('msg open', function(msg){
    if(msg.length){
      $('#logs').empty();
      $.each(msg, function(key, value){
        var info = value.name + ' ' + value.time;
	var mes  = $("<div/>").text(value.msg).html();
        $('#logs').prepend($('<dt>' + info + '</dt><dd>' + mes + '</dd>' + '<hr>'));
      });
    }
  });

  $('#btn').click(function(e){
    e.preventDefault();
    var t = new Date();
    var mon = t.getMonth() + 1;
    var tbl = new Array("日","月","火","水","木","金","土");
    var week = '(' + tbl[t.getDay()] + ')';
    var time = t.getFullYear() + '/' + mon + '/' + t.getDate() + week + ' ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds() + '.' + t.getMilliseconds();
    var str = $('#msg').val();
    var name = $('#name').val()

    if(name.length == 0)
      name = "匿名";

    if(str.length){
      socket.json.emit('emit from client', {
        msg: str,
        name: name,
        time: time
      });
      $('#msg').val('').focus();
    }
  });
  socket.on('emit from server', function(data){
    var info = data.name + ' ' + data.time;
    var mes  = $("<div/>").text(data.msg).html();
    $('#logs').prepend($('<dt>' + info + '</dt><dd>' + mes + '</dd>' + '<hr>'));
  });

  $('#name_btn').click(function(e){
    e.preventDefault();
    socket.json.emit('del name', {
      name: $('#del_name').val(),
      pass: $('#pass_name').val()
    });
  });
  $('#time_btn').click(function(e){
    e.preventDefault();
    socket.json.emit('del time', {
      time: $('#del_time').val(),
      pass: $('#pass_time').val()
    });
  });
  $('#msg_btn').click(function(e){
    e.preventDefault();
    socket.json.emit('del msg', {
      msg: $('#del_msg').val(),
      pass: $('#pass_msg').val()
    });
  });
});
