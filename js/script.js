/* Author: Quick Left

*/
jQuery(function( $ ){

  function afterAnim( index ) {
      $('.features .active').removeClass('active');
      $('.features .one_col').eq(index).addClass('active');
  }

  $('.gal').qlgallery({ callback: afterAnim });

  var countdown = 8000,
      timer;

  $('.gal').bind('click.stop', function(e){
    $(this).trigger('advance');
    clearTimeout( timer );
  });

  function autoplay(){
    $('.gal').trigger('advance');
    timer = setTimeout( autoplay, countdown );
  }

  timer = setTimeout( autoplay, countdown );
});

