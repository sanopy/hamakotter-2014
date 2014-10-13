$(function() {
  var socket = io.connect();

  $('#register-button').click(function() {
    var name  = $('#name').val();
    var id    = $('#id').val();
    var pass1 = $('#pass1').val();
    var pass2 = $('#pass2').val();

    if(name.length == 0)
      dialog('Error', '名前は１文字以上にしてください');
    else if(id.length == 0)
      dialog('Error', 'IDは１文字以上にしてください');
    else if(id.match(/[a-zA-Z0-9_]+/) != id){
      dialog('Error', 'IDが不正です<br>使用可能な文字は半角のアルファベット(A〜Z, a〜z)、数字(0〜9)、アンダーバー(_)です');
      $('#id').val('');
    }
    else if(pass1 != pass2) {
      $('#pass1').val('');
      $('#pass2').val('');
      dialog('Error', 'パスワードが一致しません');
    }
    else if(pass1.length == 0)
      dialog('Error', 'パスワードは１文字以上にしてください');
    else {
      socket.json.emit('create user', {
	id: id,
	name: name,
	password: pass1
      });

      socket.on('reply create user', function(data) {
	if(data){
	  $('#id').val('');
	  dialog('Sorry', '既に存在するIDです');
	} else {
	  dialog('Success', 'アカウントの作成に成功しました');
	  $.cookie(  "ID",    id, { expires: 7 });
	  $.cookie("name", pass1, { expires: 7});
	  window.location.href = "index.html";
	}
      });
    }
  });
});

function dialog(title, mes) {
  bootbox.hideAll();
  bootbox.dialog({
    title: title,
    message: mes,
    buttons: {
      OK: { label: 'OK' }
    }
  });
}
