$(function() {
  var socket = io.connect();

  if($.cookie("ID"))
    window.location.href = "index.html";

  $('#login-button').click(function() {
    var id   = $('#id').val();
    var pass = $('#pass').val();

    socket.json.emit('login', {
      id: id,
      password: pass
    });

    socket.on('reply login', function(data) {
      if(data){
	$.cookie("ID", id, { expires: 7 });
	window.location.href = "index.html";
      }
      else
        alert("IDまたはパスワードが間違っています");
    });
  });
});
