$(function() {
  var socket = io.connect();
  socket.on('connect', function() {
    socket.emit('msg update');
  });

  socket.on('msg open', function(msg) {
    $('#logs').empty();
    $.each(msg, function(key, value) {
      var mes  = $("<div/>").text(value.msg).html();
      var html = '<div class="tweet">	  <div class="tweet-body">	    <div class="media">	      <a class="pull-left">		<img class="media-object" src="img/ei1333.jpeg" alt="" width="75">	      </a>	      <div class="media-body">		<h4 class="media-heading"><strong>' + value.name + '</strong>@' + value.id + '</h4>		<p>' + value.msg + '</p>				<div class="tweet-footer">		  <div class="left">'                  + formatDate(value.time) +		  '</div>		  <div class="right">		    <a class="favo">ふぁぼ</a>		    <a class="reply">返信</a>		  </div>		  <div class="message">		    <div class="modal-body" method="get">		      <textarea class="form-control" rows="5" name="content" style="resize:none"></textarea>		    </div>		    <div class="modal-footer">		      <span class="char-count">			140		      </span>		      <button type="button" id="send" class="btn btn-default" data-dismiss="modal">返信</button>		    </div>		  </div>		</div>	      </div>	    </div>	  </div>	</div>';

      $('#logs').prepend($(html));
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
    var html = '<div class="tweet">	  <div class="tweet-body">	    <div class="media">	      <a class="pull-left">		<img class="media-object" src="img/ei1333.jpeg" alt="" width="75">	      </a>	      <div class="media-body">		<h4 class="media-heading"><strong>' + data.name + '</strong>@' + data.id + '</h4>		<p>' + data.msg + '</p>				<div class="tweet-footer">		  <div class="left">'                  + formatDate(data.time) +		  '</div>		  <div class="right">		    <a class="favo">ふぁぼ</a>		    <a class="reply">返信</a>		  </div>		  <div class="message">		    <div class="modal-body" method="get">		      <textarea class="form-control" rows="5" name="content" style="resize:none"></textarea>		    </div>		    <div class="modal-footer">		      <span class="char-count">			140		      </span>		      <button type="button" id="send" class="btn btn-default" data-dismiss="modal">返信</button>		    </div>		  </div>		</div>	      </div>	    </div>	  </div>	</div>';

      $('#logs').prepend($(html));

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