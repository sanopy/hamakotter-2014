$(function() {
  var socket = io.connect();
  
  if(!$.cookie('ID') || !$.cookie('name'))
    $('#logout').text('ログイン');
  
  $('#logout').click(function() {
    $.removeCookie("ID");
    $.removeCookie("name");
    window.location.href = "/login.html";
  });
  
  $('#noticePage').click(function() {
    if(!jumpLogin('通知'))
      window.location.href = "/notice.html";
  });
  
  $('#userPage').click(function() {
    if(!jumpLogin('ユーザーページ'))
      window.location.href = "/user.html";
  });
  
  $(document).on('click', '.btn.btn-default', function() {
    if(!jumpLogin('ツイート')){
      
      var time = new Date();
      var str  = $(this).parent().parent().children('.modal-body').children('.form-control').val();
      var id   = $.cookie("ID");
      var name = $.cookie("name");
      var icon = $.cookie("icon");
      
      if(0 < str.length && str.length <= 140){
	socket.json.emit('send msg', {
	  id:   id,
	  msg:  str,
	  name: name,
	  icon: icon,
	  time: time
	});
	$(this).parent().parent().children('.modal-body').children('.form-control').val('');
      }
      else if(str.length == 0){
	dialog('Error', '1文字以上入力してください');
      }
      else{
	dialog('Error', '文字数オーバーです');
      }

      if($(this).attr('class').indexOf("btn-primary") == -1)
	$(this).parent().parent().slideToggle();
    }
  });

  $(document).on('click', '.favo', function() {
    if(!jumpLogin('ふぁぼ')){
      var favo = $(this).text().match(/[0-9]+/);
      if(favo == null) favo = 0;

      if( $(this).css("color") != "rgb(255, 140, 0)" ){ // ふぁぼる
	$(this).text((parseInt(favo) + 1) + " ふぁぼ");
	$(this).css( 'color' ,'#FF8C00' );
      }
      else{ // ふぁぼ解除
	favo = favo == 1? '' : parseInt(favo) - 1;
	$(this).text(favo + " ふぁぼ");
	$(this).css( 'color' ,'rgb( 42, 100, 150 )');
      }
      
      var id   = $.cookie("ID");
      var date = $(this).parent().parent().parent().children('.tweetinfo').text();
      var target = $(this).parent().parent().parent().children('.media-heading').text();
      //var _id = $(this).parent().parent().parent().children('.tweetinfo').text();

      socket.json.emit('favo', {
	id: id,
	date: date,
	target: target.substr(target.lastIndexOf('@') + 1)
      });
    }
  });

  $(document).on('click', '.reply', function() {
    if(!jumpLogin('返信')){

      var id = $(this).parent().parent().parent().children(".media-heading").text();
      id = id.substr(id.lastIndexOf("@"));

      $(this).parent().parent().children(".message").slideToggle();
      $(this).parent().parent().children(".message").children('.modal-body').children(".form-control").focus();
      $(this).parent().parent().children(".message").children(".modal-body").children(".form-control").val(id + " ");
    }
  });

  $(document).on('click', '.remove', function() {
    if(!jumpLogin('つい消し')){

      var id   = $(this).parent().parent().parent().children('.media-heading').text();
      id = id.substr(id.lastIndexOf('@') + 1);
      var date = $(this).parent().parent().parent().children('.tweetinfo').text();
      
      bootbox.confirm('本当につい消しするよ?', function(result) {
	if(result){
	  socket.json.emit('remove tweet', {
	    id: id,
	    date: date
	  });
	}
      });
    }
  });
});

function jumpLogin(s) {
  if(!$.cookie("ID") || !$.cookie("name")){
    bootbox.dialog({ 
      title: 'Sorry',
      message: s + 'を利用するにはログインが必要です<br>ログインページにジャンプしますか？',
      buttons: {
	Cancel: {
	  className: 'btn-default'
	},

	OK: {
	  label: 'OK',
	  className: 'btn-primary',
	  callback: function() { 
	    window.location.href = "/login.html";
	  }
	}
      }
    });

    return true;
  }

  return false;
}

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
