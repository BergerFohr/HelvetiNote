/*
  jquery.qlgallery v0.0.4
  https://github.com/quickleft/ql_gallery
*/
(function($){
  $.fn.qlgallery = function(options) {
    var settings = $.extend({}, $.fn.qlgallery.defaultOptions, options),

    qlgallery = function() {
      var _timer,

      $this  = $(this),
      _time  = new Date().getTime(),
      id     = ( !! $this.attr('id') ) ? $this.attr('id') : "gal_"+_time,
      _index = 0,
      images = $this.children(),
      width  = $this.width(),
      height = $this.height,
      length = images.length * width,
      viewer = $("<div>", { "id": "viewer" + _time, "class": "ql_gallery_viewer", "style": "width:2000em;" }),

      api = {

        // Public - Sets up the target element by wrapping it in the viewer
        // object, contionally setting its ID, setting css props on
        //            the viewer. Also adds controls and autoplay hooks.
        //
        // Returns a modified instance of the jQuery object, exposing the 
        init: function(){
          // Give the target a unique ID if it doesn't have one alreay
          if( $this.attr('id') !== id ) {
            $this.attr('id', id);
          }

          // Wrap the images with a container
          images.wrapAll(viewer);

          // And store a reference to the viewer
          viewer = $('#viewer'+_time);

          // Set viewer offest to account for added images
          viewer.css('left', '-'+width+'px');

          // Clone first and last elements
          images.eq(0).clone().appendTo(viewer);
          images.eq(images.length-1).clone().prependTo(viewer);

          // Set length to be cached images.length
          length = images.length;

          // Iterate over the controls object and append them to the Wrapper
          $.each( settings.controls, function(k, elem){
            if( elem.href == "#play" && !settings.play ) { return; }
            $("<a>", elem).appendTo($this);
          });

          $this.delegate('a', 'click', api.animate );
          $this.find('.play').bind('click', api.autoplay);

          $this.bind( 'advance', api.advance );

          if( !!settings.autoplay ) {
            var speed = ( typeof settings.autoplay == "number" ) ? settings.autoplay : 8e3,
                autoplay = function(){
                  if( !!_timer ) { return false; }
                  $this.find('.play').trigger('click');
                };

            setTimeout(autoplay, speed);
          }

          this.qlgallery = api;
          return this;
        },

        // Public - Event handler for gallery controls, but only expects the
        //          class `next` or `back`
        //
        // Returns a call to animate() on the viewer object
        animate: function(e) {
          if( viewer.is(':animated') === true ) {
            return false;
          }

          var el, done,
              flavor = $(this).attr('class'),

              animation_settings = {},
              callback_settings  = {},

              forward = '-='+ width +'px',
              back    = '+='+ width +'px';

          if( flavor == "next" ) {
            animation_settings.left = forward;
            callback_settings.left = back;

            // Set the global index
            _index = (_index + 1) % length;

            el = '> :first-child';

            // Add forward element to end of list
            images.eq(_index).clone().appendTo(viewer);
          }

          if( flavor == "back" ){
            animation_settings.left = back;
            callback_settings.left = forward;

            // Set the global index
            _index = _index - 1 < 0 ?
                    length + (_index - 1):
                    (_index - 1) % length;

            el = '> :last';
          }

          done = function(){
            // Remove un-needed element
            viewer.find(el).remove();

            // Add backwards element to front of list
            if( flavor == "back" ){
              images.eq(_index - 1).clone().prependTo(viewer);
            }

            // Adjust css for the added elem
            viewer.animate(callback_settings, 0);

            // If a callback is present call it with the viewer's jQuery context and some helpful arguments
            if( $.isFunction(settings.callback) ) {
              return settings.callback.apply(this, [_index, viewer.css('left')]);
            }
          };

          return viewer.animate( animation_settings, settings.speed, settings.easing, done );
        },

        advance: function(){
          if( viewer.is(':animated') === true ) {
            return false;
          }

          var el, done,

              animation_settings = {},
              callback_settings  = {},

              forward = '-='+ width +'px',
              back    = '+='+ width +'px';

          animation_settings.left = forward;
          callback_settings.left = back;

          // Set the global index
          _index = (_index + 1) % length;

          el = '> :first-child';

          // Add forward element to end of list
          images.eq(_index).clone().appendTo(viewer);

          done = function(){
            // Remove un-needed element
            viewer.find(el).remove();

            // Adjust css for the added elem
            viewer.animate(callback_settings, 0);

            // If a callback is present call it with the viewer's jQuery context and some helpful arguments
            if( $.isFunction(settings.callback) ) {
              return settings.callback.apply(this, [_index, viewer.css('left')]);
            }
          };

          return viewer.animate( animation_settings, settings.speed, settings.easing, done );
        },

        // Public - starts the autoplay
        start: function() {
          var speed = ( typeof settings.play == "number" ) ? settings.play : 8e3;
          $this.find('.next').trigger('click');
          _timer = setTimeout(api.start, speed);
        },

        // Public - Event handler for the play / pause button
        autoplay: function( e ){
          if( !!_timer ) {
            clearTimeout(_timer);
            _timer = null;
            $(e.target).text('Play');
          } else {
            api.start();
            $(e.target).text('Stop');
          }
          // stops propogation
          return false;
        }
      };

      return api.init();
    };

    return this.each( qlgallery );
  };

  $.fn.qlgallery.defaultOptions = {
    speed: 600,
    easing: false,
    slides: 1,
    play: false,
    autoplay: false,
    infinite: true,
    callback: false,
    controls: [ { 'href': "#back", 'class': 'back', 'text': "Back" },
              { 'href': "#next", 'class': 'next', 'text': "Next" },
              { 'href': "#play", 'class': 'play', 'text': "Play" } ]
  };
})(jQuery);
