$(function() {
  var socket = io.connect();

  if($.cookie("ID") && $.cookie("name"))
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
	$.cookie(  "ID",        id, { expires: 7 });
	$.cookie("name", data.name, { expires: 7 });
	$.cookie("icon", data.icon, { expires: 7 });
	window.location.href = "index.html";
      }
      else{
	bootbox.hideAll();
	bootbox.dialog({
	  title: "Wrong ID or Password",
	  message: "IDまたはパスワードが間違っています",
	  buttons: {
	    OK: {
	      label: 'OK',
	      callback: function(){ }
	    }
	  }
	});
      }
    });
  });
});
