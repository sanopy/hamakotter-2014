function formatDate(date) {
  var date = new Date(date);
  var mon = date.getMonth() + 1;
  var hour = date.getHours() < 10? '0' + date.getHours() : date.getHours();
  var minute = date.getMinutes() < 10? '0' + date.getMinutes() : date.getMinutes();
  var ret = date.getFullYear() + '年' + mon + '月' + date.getDate() + '日' + ' - ' + hour + ':' + minute;
  return ret;
}

function color(data) {
  var favo = data.favo.length;

  if(data.favo.indexOf($.cookie("ID")) != -1)
    return 'style="color: rgb(255, 140, 0)">' + (favo? favo : '') + ' ふぁぼ';
  else
    return 'style="color: rgb( 42, 100, 150 )">' + (favo? favo : '') + ' ふぁぼ';
}

function replyURL(data) {
  var id = $.cookie("ID");

  if(id == data)
    return '       	        <a class="remove" onclick="">つい消し</a>\n';
  else
    return '';
}


function formatTweet(data) {

  var link = '/users/' + data.id;

  var html = '    <div class="tweet">\n	  <div class="tweet-body">\n	    <div class="media">\n	      <a class="pull-left">\n		    <img class="media-object" src="/img/' + data.id + '.jpeg" alt="" width="75">\n	      </a>\n	      <div class="media-body">\n		    <h4 class="media-heading"><a href="'+ link + '"><strong>' + data.name + '</strong>@' + data.id + '</a></h4>\n		    <p>' + data.msg + '</p>\n		    <p class="tweetinfo">' + data.time + '</p>\n		    <div class="tweet-footer">\n		      <div class="left">' + formatDate(data.time) +	 '</div>\n		      <div class="right">\n	            <a class="favo" onclick="" ' + color(data) + '</a>\n       	        <a class="reply" onclick="">返信</a>\n' + replyURL(data.id) + '		      </div>\n	    	  <div class="message">\n	  	        <div class="modal-body" method="get">\n		          <textarea class="form-control" rows="5" name="content" style="resize:none"></textarea>\n		        </div>\n  		        <div class="modal-footer">\n		          <span class="char-count">140</span>\n       	          <button type="button" class="btn btn-default" data-dismiss="modal">返信</button>\n	  	        </div>\n		      </div>\n	         </div>\n	      </div>\n	    </div>\n	  </div>\n    </div>\n';

  return html;
}
