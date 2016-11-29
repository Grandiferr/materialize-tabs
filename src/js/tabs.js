(function (factory) {
  if(typeof module === "object" && typeof module.exports === "object") {
    factory(require("jquery"), window, document);
  } else {
    factory(jQuery, window, document);
  }
}(function($, window, document, undefined) {

  /* The MIT License (MIT)

  Copyright (c) 2014-2016 Materialize

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
  */

  // code for attaching tabs to whatever jQuery was passed in goes here.

  /**
   * Escapes hash from special characters
   * @param {string} hash  String returned from this.hash
   * @returns {string}
   */
  var escapeHash = function(hash) {
    return hash.replace( /(:|\.|\[|\]|,|=)/g, "\\$1" );
  };

  var easeOutQuad = function (x, t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
  };

  $.extend($.easing, {customEasing: easeOutQuad});

  var methods = {
    init : function(options) {
      var defaults = {
        onShow: null
      };
      options = $.extend(defaults, options);

      return this.each(function() {

      // For each set of tabs, we want to keep track of
      // which tab is active and its associated content
      var $this = $(this),
          window_width = $(window).width();

      var $active, $content, $links = $this.find('li.tab a'),
          $tabs_width = $this.width(),
          $tab_width = Math.max($tabs_width, $this[0].scrollWidth) / $links.length,
          $index = 0;

      // Finds right attribute for indicator based on active tab.
      // el: jQuery Object
      var calcRightPos = function(el) {
        return $tabs_width - el.position().left - el.outerWidth() - $this.scrollLeft();
      };

      // Finds left attribute for indicator based on active tab.
      // el: jQuery Object
      var calcLeftPos = function(el) {
        return el.position().left + $this.scrollLeft();
      };

      // If the location.hash matches one of the links, use that as the active tab.
      $active = $($links.filter('[href="'+location.hash+'"]'));

      // If no match is found, use the first link or any with class 'active' as the initial active tab.
      if ($active.length === 0) {
        $active = $(this).find('li.tab a.active').first();
      }
      if ($active.length === 0) {
        $active = $(this).find('li.tab a').first();
      }

      $active.addClass('active');
      $index = $links.index($active);
      if ($index < 0) {
        $index = 0;
      }

      if ($active[0] !== undefined) {
        $content = $($active[0].hash);
      }

      // append indicator then set indicator width to tab width
      $this.append('<div class="indicator"></div>');
      var $indicator = $this.find('.indicator');
      if ($this.is(":visible")) {
        // $indicator.css({"right": $tabs_width - (($index + 1) * $tab_width)});
        // $indicator.css({"left": $index * $tab_width});
        setTimeout(function() {
          $indicator.css({"right": calcRightPos($active) });
          $indicator.css({"left": calcLeftPos($active) });
        }, 0);
      }
      $(window).resize(function () {
        $tabs_width = $this.width();
        $tab_width = Math.max($tabs_width, $this[0].scrollWidth) / $links.length;
        if ($index < 0) {
          $index = 0;
        }
        if ($tab_width !== 0 && $tabs_width !== 0) {
          $indicator.css({"right": calcRightPos($active) });
          $indicator.css({"left": calcLeftPos($active) });
        }
      });

      // Hide the remaining content
      $links.not($active).each(function () {
        $(escapeHash(this.hash)).hide();
      });


      // Bind the click event handler
      $this.on('click', 'a', function(e) {
        if ($(this).parent().hasClass('disabled')) {
          e.preventDefault();
          return;
        }

        // Act as regular link if target attribute is specified.
        if (!!$(this).attr("target")) {
          return;
        }

        $tabs_width = $this.width();
        $tab_width = Math.max($tabs_width, $this[0].scrollWidth) / $links.length;

        // Make the old tab inactive.
        $active.removeClass('active');
        if ($content !== undefined) {
          $content.hide();
        }

        // Update the variables with the new link and content
        $active = $(this);
        $content = $(escapeHash(this.hash));
        $links = $this.find('li.tab a');
        var activeRect = $active.position();

        // Make the tab active.
        $active.addClass('active');
        var $prev_index = $index;
        $index = $links.index($(this));
        if ($index < 0) {
          $index = 0;
        }
        // Change url to current tab
        // window.location.hash = $active.attr('href');

        if ($content !== undefined) {
          $content.show();
          if (typeof(options.onShow) === "function") {
            options.onShow.call(this, $content);
          }
        }

        // Update indicator

        if (($index - $prev_index) >= 0) {
          $indicator.animate({"right": calcRightPos($active) }, { duration: 300, queue: false, easing: 'customEasing'});
          $indicator.animate({"left": calcLeftPos($active) }, {duration: 300, queue: false, easing: 'customEasing', delay: 90});

        } else {
          $indicator.animate({"left": calcLeftPos($active) }, { duration: 300, queue: false, easing: 'customEasing'});
          $indicator.animate({"right": calcRightPos($active) }, {duration: 300, queue: false, easing: 'customEasing', delay: 90});
        }

        // Prevent the anchor's default click action
        e.preventDefault();
      });
    });

    },
    select_tab : function( id ) {
      this.find('a[href="#' + id + '"]').trigger('click');
    }
  };

  $.fn.tabs = function(methodOrOptions) {
    if ( methods[methodOrOptions] ) {
      return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
      // Default to "init"
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.tabs' );
    }
  };

  $(document).ready(function(){
    $('ul.tabs').tabs();
  });

}));