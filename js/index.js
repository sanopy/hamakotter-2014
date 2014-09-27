$(function() {
  var socket = io.connect();

  if(!$.cookie("ID"))
    window.location.href = "login.html";

  $('#logout').click(function() {
    $.removeCookie("ID");
    window.location.href = "login.html"
  });

  socket.on('connect', function() {
    socket.emit('msg update');
  });

  socket.on('msg open', function(msg) {
    $('#logs').empty();
    $.each(msg, function(key, value) {
      //var mes  = $("<div/>").text(value.msg).html();
      value.msg = $("<div/>").text(value.msg).html();
      $('#logs').prepend(formatTweet(value));
    });
    var ele = document.createElement("script");
    ele.src = "js/select.js";
    document.body.appendChild(ele);
  });

  $('#send').click(function(e) {
    e.preventDefault();
    var time = new Date();
    var str = $(this).parent().parent().children('.modal-body').children('.form-control').val();
    var id = "ei1333";
    var name = "ししょー"

    if(str.length <= 140){
      socket.json.emit('send msg', {
	id:  id,
        msg: str,
        name: name,
        time: time
      });
    }

    $(this).parent().parent().children('.modal-body').children('.form-control').val('');
  });
  
  socket.on('push msg', function(data) {
    data.msg = $("<div/>").text(data.msg).html();
    $('#logs').prepend(formatTweet(data));

    var ele = document.createElement("script");
    ele.src = "js/select.js";
    document.body.appendChild(ele);
  });
});

function formatDate(date) {
  var date = new Date(date);
  var mon = date.getMonth() + 1;
  var hour = date.getHours() < 10? '0' + date.getHours() : date.getHours();
  var minute = date.getMinutes() < 10? '0' + date.getMinutes() : date.getMinutes();
  var ret = date.getFullYear() + '年' + mon + '月' + date.getDate() + '日' + ' - ' + hour + ':' + minute;
  return ret;
}

function formatTweet(data) {
  var html = '    <div class="tweet">\n	  <div class="tweet-body">\n	    <div class="media">\n	      <a class="pull-left">\n		    <img class="media-object" src="img/ei1333.jpeg" alt="" width="75">\n	      </a>\n	      <div class="media-body">\n		    <h4 class="media-heading"><strong>' + data.name + '</strong>@' + data.id + '</h4>\n		    <p>' + data.msg + '</p>\n		    <div class="tweet-footer">\n		      <div class="left">' + formatDate(data.time) +	 '</div>\n		        <div class="right">\n	              <a class="favo">ふぁぼ</a>\n          	      <a class="reply">返信</a>\n		        </div>\n	    	    <div class="message">\n	    	      <div class="modal-body" method="get">\n		          <textarea class="form-control" rows="5" name="content" style="resize:none"></textarea>\n		        </div>\n		        <div class="modal-footer">\n		          <span class="char-count">140</span>\n		          <button type="button" id="send" class="btn btn-default" data-dismiss="modal">返信</button>\n		        </div>\n		      </div>\n		    </div>\n	      </div>\n	    </div>\n	  </div>\n	</div>\n';

  return html;
}
