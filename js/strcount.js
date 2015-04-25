$(function() {
  $(document).on("keyup keydown onblur", '.form-control', function() {
    /*"change"/*keyup', fucnction() {*/
    var len = 140 - $(this).val().length;
    $(this).parent().parent().children(".modal-footer").children(".char-count").text(len);
    if(len < 0){
      $(this).parent().parent().children(".modal-footer").children(".char-count").css("color", 'rgb( 255, 0, 0)');
    } else {
      $(this).parent().parent().children(".modal-footer").children(".char-count").css("color", 'rgb( 0, 0, 0)');
    }
  });
});
