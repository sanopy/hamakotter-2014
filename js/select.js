$(function() {
    $('.favo').click( function() {
        console.log("foo");
        if( $(this).css("color") != "rgb(255, 140, 0)" ){
          $(this).text("ふぁぼ済み");
          $(this).css( 'color' ,'#FF8C00' );
        }
        else{
          $(this).text("ふぁぼ");
          $(this).css( 'color' ,'rgb( 42, 100, 150' );
        }
      } );

    $('.reply').click( function() {
        console.log("foo!!");
        $(this).parent().parent().children(".message").slideToggle();
      } );
});
