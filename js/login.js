$(function() {
  var socket = io.connect();

  $('#login-button').click(function() {
    var id   = $('#id').val();
    var pass = $('#pass').val();

    socket.json.emit('login', {
      id: id,
      password: pass
    });

    socket.on('reply login', function(data) {
      if(data)
        alert("ログインに成功しました");
      else
        alert("IDまたはパスワードが間違っています");
    });
  });
});
