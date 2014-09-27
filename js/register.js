$(function() {
  var socket = io.connect();

  $('#register-button').click(function() {
    var name  = $('#name').val();
    var id    = $('#id').val();
    var pass1 = $('#pass1').val();
    var pass2 = $('#pass2').val();

    if(pass1 != pass2){
      $('#pass1').val("");
      $('#pass2').val("");
      alert("パスワードが一致しません!");
    } else {
      socket.json.emit('create user', {
	id: id,
	name: name,
	password: pass1
      });

      socket.on('reply create user', function(data) {
	if(data){
	  $('#name').val("");
	  $('#id').val("");
	  $('#pass1').val("");
	  $('#pass2').val("");
	  alert("既に存在するIDです");
	} else {
	  alert("アカウントの作成に成功しました");
	}
      });
    }
  });
});
