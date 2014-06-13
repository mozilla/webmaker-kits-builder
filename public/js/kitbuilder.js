/* global jQuery */
(function( window, document, $, undef ) {
  'use strict';

  // setup markdown parser
  var mdParser = new window.Showdown.converter();

  // something to store kit components in
  var components = {
    tags: []
  };

  /*
    Utility Functions / Filters
   */

  /**
   * Removes the `<p>` tags from the a string.
   *
   * @param  {String} str Input string.
   * @return {String}     Output string.
   */
  function removePTags( str ) {
    return str.replace(/(<p>|<\/p>)/, '');
  }

  /**
   * Splits a comma sperated list into an Array
   *
   * @param  {String} str Input string.
   * @return {Array}      Output array.
   */
  function splitCommaSeparatedList( str ) {
    var rtn = str.split( /, ?/ );
    rtn.forEach(function( el, idx, ary ) {
      el = el.trim();
      ary[ idx ] = el;
      if ( el === '' ) {
        ary.splice( idx, 1 );
      }
    });
    return rtn;
  }

  /**
   * Convert authors into links to their makes.org profile links
   *
   * @param  {String} str Input string containing "@user"s
   * @return {String}     HTML containing links in place of @user
   */
  function makeAuthorHTML( str ) {
    var rtn = 'Made by ';
    if ( !str ) {
      return rtn;
    }

    var arry = splitCommaSeparatedList( str );

    arry.filter( function( author ) {
      if ( author.match( /^@[a-zA-Z0-9_]+$/ ) ) {
        rtn += '['+ author + '](https://webmaker.org/u/' + author.substr(1) + '), ';
      }
      else if ( author.match( /\w+/ ) ) {
        rtn += author + ', ';
      }
    });

    rtn = rtn.substr( 0, rtn.length -2 );

    return mdParser.makeHtml( removePTags( rtn.trim() ) );
  }

  /**
   * Returns a function, that, as long as it continues to be invoked, will not be triggered.
   *
   * The function will be called after it stops being called for N milliseconds. If `immediate`
   * is passed, trigger the function on the leading edge, instead of the trailing.
   *
   * Function taken from underscore.js
   * @see {@link http://underscorejs.org/#debounce}
   *
   * @param  {Function} fn        The function to debounce
   * @param  {Integer}  wait      How many milliseconds to wait for
   * @param  {Boolean}  immediate Trigger function on the leading edge?
   * @return {Function}           The debounced function
   */
  function debounce( fn, wait, immediate ) {
    var timeout;
    return function() {
      var context = this, args = arguments;

      function later() {
        timeout = null;

        if( !immediate ) {
          fn.apply( context, args );
        }
      }

      var callNow = ( immediate && !timeout );

      clearTimeout( timeout );
      timeout = setTimeout( later, wait );

      if( callNow ) {
        fn.apply( context, args );
      }
    };
  }

  $( '#previewFrame' ).load( function(){
    var frame = this.contentWindow;

    /**
     * Sends an overwrite command to the preview window
     *
     * @param  {Object} object The components to send
     */
    function _sendOverwrite( object ) {
      object = object || components;

      var message = {
        type: 'overwrite',
        components: object
      };

      frame.postMessage( JSON.stringify( message ), '*' );
    }
    var sendOverwrite = debounce( _sendOverwrite, 500 );

    // udpate on keypress
    $( '#kitName' ).keyup( function() {
      $.extend( components, {
        title: $( '#kitName' ).val().trim() || $( '#kitName' ).attr( 'placeholder' )
      });

      sendOverwrite();
    });

    $( '#kitAuthor' ).keyup( function() {
      var authors = $( '#kitAuthor' ).val() || $( '#kitAuthor' ).attr( 'placeholder' );

      $.extend( components, {
        authors: makeAuthorHTML( authors.trim() )
      });

      sendOverwrite();
    });

    $( '#kitShortDescription' ).keyup( function() {
      var summary = $( '#kitShortDescription' ).val().trim();
      summary = mdParser.makeHtml( summary );

      $.extend( components, {
        summary: removePTags( summary )
      });

      sendOverwrite();
    });

    $( '#kitThumbnail' ).keyup( function() {
      $.extend( components, {
        headerImage: $( '#kitThumbnail' ).val().trim() || $( '#kitThumbnail' ).attr( 'placeholder' )
      });

      sendOverwrite();
    });

    $( '#kitTags' ).change( function() {
      var tagList = $( this ).val() || $( this ).attr( 'placeholder' );
      tagList = splitCommaSeparatedList( tagList );

      tagList.filter( function( tag ) {
        if ( components.tags.indexOf( tag ) === -1 ) {
          components.tags.push( tag );
        }
      });

      components.tags.forEach( function( tag, idx ) {
        if( tagList.indexOf( tag ) === -1 ) {
          components.tags.splice( idx, 1 );
        }
      });

      sendOverwrite();
    });

    // inject initial state
    (function() {
      var summary = $( '#kitShortDescription' ).val().trim();
      summary = mdParser.makeHtml( summary );
      var authors = $( '#kitAuthor' ).val() || $( '#kitAuthor' ).attr( 'placeholder' );

      var tagList = $( '#kitTags' ).val() || $( '#kitTags' ).attr( 'placeholder' );
      tagList = splitCommaSeparatedList( tagList );

      tagList.filter( function( tag ) {
        if ( components.tags.indexOf( tag ) === -1 ) {
          components.tags.push( tag );
        }
      });

      $.extend( components, {
        headerImage: $( '#kitThumbnail' ).val().trim() || $( '#kitThumbnail' ).attr( 'placeholder' ),
        summary: removePTags( summary ),
        authors: makeAuthorHTML( authors.trim() ),
        title: $( '#kitName' ).val().trim() || $( '#kitName' ).attr( 'placeholder' )
      });

      sendOverwrite();
    }());

    // build kit!
    $( '#kit-builder-form' ).submit( function( e ) {
      $.extend( components, {
        webmakerKitsJS: 'https://stuff.webmaker.org/webmaker-kits/v2/js/main.js',
        webmakerKitsCSS: 'https://stuff.webmaker.org/webmaker-kits/v2/css/style.css'
      });

      var kitHTML = window.nunjucks.render( 'templates/kit.html', components );

      window.open( 'data:text/plain;' + ( window.btoa ? 'base64,' + btoa( kitHTML ) : kitHTML ) );
      e.preventDefault();
      return false;
    });
  });
})( this, document, jQuery );
