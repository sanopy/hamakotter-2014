$(function() {
  var socket = io.connect();

  var id   = $.cookie("ID");
  var icon = $.cookie("icon");
  var name = $.cookie("name");

  if(!id || !name)
    window.location.href = "/index.html";

  $('#name').val(name);

  $('#name-button').click(function() {
    var newName = $('#name').val();

    socket.json.emit('rename user name', {
      id: id,
      name: newName
    });

    $.removeCookie("name");
    $.cookie("name", newName, { expires: 7 });
    dialog('Success', 'ユーザー名が変更されました', '/user.html');
  });

  $('#icon-button').click(function() {
    
  });

  $('#remove-button').click(function() {
    inputDialog();
  });

});

function dialog(title, mes, url) {
  bootbox.hideAll();
  bootbox.dialog({
    title: title,
    message: mes,
    buttons: {
      OK: { 
	label: 'OK',
	callback: function() {
	  window.location.href = url;
	}
      }
    }
  });
}

function inputDialog() {
  bootbox.hideAll();
  bootbox.dialog({
    title: '確認のため、パスワードを入力してください',
    message: '<input id="pass" name="name" type="password" placeholder="パスワード" class="form-control input-md">',
    buttons: {
      OK: { 
	label: 'OK',
	callback: function() {
	  var socket = io.connect();

	  var id = $.cookie("ID");

	  socket.json.emit('login', {
	    id: id,
	    password: $('#pass').val()
	  });

	  socket.on('reply login', function(data) {
	    if(data){
	      socket.emit('remove user', id);
	      $.removeCookie("ID");
	      $.removeCookie("name");
	      dialog('Success', 'アカウントの削除に成功しました', '/index.html');
	    }
	    else{
	      dialog('Error', 'パスワードが一致しませんでした', '');
	    }
	  });
	  
	}
      }
    }
  });

}