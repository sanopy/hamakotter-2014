$(function(){
  var socket = io.connect();
  $(document).on('click', '.btn.btn-default', function() {
    var time = new Date();
    var str  = $(this).parent().parent().children('.modal-body').children('.form-control').val();

    if(0 < str.length){
      socket.json.emit('send msg', {
        msg:  str,
        time: time
      });
    }

    $(this).parent().parent().children('.modal-body').children('.form-control').val('');
    $(this).parent().parent().slideToggle();
  });

  socket.on('msg open', function(data) {
    $('#logs').empty();
    $.each(data, function(key, value) {
      value.msg = $("<div/>").text(value.msg).html();
      value.msg = value.msg.replace(/\n/g, '<br>');
      $('#logs').prepend(formatTweet(value));
    });
  });

  socket.on('push msg', function(data) {
    data.msg = $("<div/>").text(data.msg).html();
    data.msg = data.msg.replace(/\n/g, '<br>');
    $('#logs').prepend(formatTweet(data));
  });
});

function formatDate(date) {
  var date = new Date(date);
  var mon = date.getMonth() + 1;
  var hour = date.getHours() < 10? '0' + date.getHours() : date.getHours();
  var minute = date.getMinutes() < 10? '0' + date.getMinutes() : date.getMinutes();
  var ret = date.getFullYear() + '綛￿' + mon + '￿' + date.getDate() + '￿￿' + ' - ' + hour + ':' + minute;
  return ret;
}

function formatTweet(data) {

  var link = '/users/' + data.id;

  var html = '    <div class="tweet">\n   <div class="tweet-body">\n        <div class="media">\n             <a class="pull-left">\n               <img class="media-object" src="img/' + data.id + '.jpeg" alt="" width="75">\n             </a>\n          <div class="media-body">\n                    <h4 class="media-heading"><a href="'+ link + '"><strong>' + data.name + '</strong>@' + data.id + '</a></h4>\n                   <p>' + data.msg + '</p>\n               <p class="tweetinfo">' + data.time + '</p>\n                    <div class="tweet-footer">\      <div class="left">' + formatDate(data.time) +       '</div>\n      <div class="right">\n                  <a class="favo" ' + color(data) + '</a>\n                   <a class="reply">菴篆￿</a>\n' + replyURL(data.id) + '      </div>\n             <div class="message">\n                       <div class="modal-body" method="get">\n                   <textarea class="form-control" rows="5" name="content" style="resize:none"></textarea>\n </div>\n                        <div class="modal-footer">\n   <span class="char-count">140</span>\n                   <button type="button" class="btn btn-default" data-dismiss="modal">菴篆￿</button>\n </div>\n                      </div>\n           </div>\n             </div>\n    </div>\n       </div>\n    </div>\n';

  return html;
}

});