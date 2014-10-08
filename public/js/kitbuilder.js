/* global jQuery */
(function( window, document, $, undef ) {
  'use strict';

  // setup markdown parser
  var mdParser = new window.Showdown.converter();

  // something to store kit components in
  var components = {
    tags: []
  };

  $('.js-form-tab').on('click', function() {
    $(this).addClass('selected');
    $('.js-preview-tab').removeClass('selected');
    $('.js-builder-preview').hide();
    $('.js-builder-markup').show();
  });

  $('.js-preview-tab').on('click', function() {
    $(this).addClass('selected');
    $('.js-form-tab').removeClass('selected');
    $('#preview').show();
    $('.js-builder-markup').hide();
  });

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

    var componenetsMap = {
      "title": "#kitName",
      "authors": "#kitAuthors" ,
      "summary": "#kitShortDescription",
      "description": '#kitDescription',
      "objectives": '#kitObjectives',
      "outcomes": '#kitOutcomes',
      "preparation": '#kitPreparation',
      "assessment": '#kitAssessment',
      "criteria": '#kitCriteria',
      "headerImage": '#kitThumbnail',
      "resources": '#kitResources',
      "tags": "#kitTags",
      "agenda": '#kitAgenda'
    };

    function loadData() {
      var items = location.search.substr(1).split("&");

      items.forEach(function(item) {
        var object = {};
        var $output;
        var parts = item.split("=");
        var key = parts[0];
        var value = decodeURIComponent( parts[1] || "" );
        if (key === "tags") {
          if (value) {
            $output = $( '#kitTags' );
            $output.val( value );
          }
        } else if (key === "agenda") {
          if( value ) {
            $output = $( '#kitAgenda' );

            $output.val( value );
            window.dispatchEvent(new CustomEvent("kitagendaready"));
            var selectedActivities = JSON.parse( value );
            var $selected = $( '#activitySearchSelected' );

            selectedActivities.order.forEach( function( activity ) {
              var make = selectedActivities.makes[ activity ];
              var id = make.id || make.url;

              $selected.append('<li class="media activities" data-make-id="' + id + '" data-uid="' + activity + '">' +
                                        '<a href="#result-1" class="pull-left thumbnail"><img src="' + make.thumbnail + '" alt="#"></a>' +
                                        '<div class="media-body">' +
                                          '<h4 class="media-heading">' + make.title + ' <small>by ' + make.username + '</small></h4>' +
                                          '<p>' + make.description + '</p>' +
                                        '</div>' +
                                      '</li>');
            });
          }
        } else {
          object[key] = value;
          $.extend(components, object);
          $( componenetsMap[ key ] ).val( value );
        }
      });
    }
    function _writeData( object ) {
      object = object || components;

      var queryString = "";
      Object.keys(object).forEach(function(name) {
        if ( !name || !name.trim() ) {
          return;
        }
        var value = encodeURIComponent(object[name]);

        // Special case for agenda because of complex UI
        if (name === "agenda") {
          var $output = $( '#kitAgenda' );
          value = $output.val() || "";
          value = encodeURIComponent( value );
        }

        queryString += name + "=" + value + "&";
      });

      if (queryString) {
        // Add ? and remove trailing &
        queryString = "?" + queryString.slice(0, -1);
        history.pushState({}, "", location.origin + location.pathname + queryString);
      }
    }
    var writeData = debounce( _writeData, 500 );

    // udpate on keypress
    $( '#kitName' ).keyup( function() {
      $.extend( components, {
        title: $( '#kitName' ).val().trim() || $( '#kitName' ).attr( 'placeholder' )
      });

      writeData();
      sendOverwrite();
    });

    $( '#kitAuthor' ).keyup( function() {
      var authors = $( '#kitAuthor' ).val() || $( '#kitAuthor' ).attr( 'placeholder' );

      $.extend( components, {
        authors: makeAuthorHTML( authors.trim() )
      });

      writeData();
      sendOverwrite();
    });

    $( '#kitShortDescription' ).keyup( function() {
      var summary = $( '#kitShortDescription' ).val().trim();
      summary = mdParser.makeHtml( summary );

      $.extend( components, {
        summary: removePTags( summary )
      });

      writeData();
      sendOverwrite();
    });

    $( '#kitDescription' ).keyup( function() {
      var description = $( '#kitDescription' ).val().trim();
      description = mdParser.makeHtml( description );

      $.extend( components, {
        description: description
      });

      writeData();
      sendOverwrite();
    });

    $( '#kitObjectives' ).keyup( function() {
      var objectives = $( '#kitObjectives' ).val().trim();
      objectives = mdParser.makeHtml( objectives );

      $.extend( components, {
        objectives: objectives
      });

      writeData();
      sendOverwrite();
    });

    $( '#kitAgenda' ).on( 'change', function() {
      // get stringified JSON
      var agenda = JSON.parse( $( '#kitAgenda' ).val().trim() );
      var agendaMarkdown = '';

      // turn it into markdown ( easy hack to get list output )
      agenda.order.forEach( function( activity, idx ) {
        agendaMarkdown +=  idx + '. [' + agenda.makes[ activity ].title + '](' + agenda.makes[ activity ].url + ')\n';
      });

      agenda = mdParser.makeHtml( agendaMarkdown );

      // hacky method to add the agenda class to the generated <ol>
      var tmpDiv = document.createElement( 'div' );
      tmpDiv.innerHTML = agenda;
      $( tmpDiv ).children( 'ol' ).eq( 0 ).addClass( 'agenda' );

      $.extend( components, {
        agenda: tmpDiv.innerHTML
      });

      writeData();
      sendOverwrite();
    });

    $( '#kitOutcomes' ).keyup( function() {
      var outcomes = $( '#kitOutcomes' ).val().trim();
      outcomes = mdParser.makeHtml( outcomes );

      $.extend( components, {
        outcomes: outcomes
      });

      writeData();
      sendOverwrite();
    });

    $( '#kitPreparation' ).keyup( function() {
      var preparation = $( '#kitPreparation' ).val().trim();
      preparation = mdParser.makeHtml( preparation );

      $.extend( components, {
        preparation: preparation
      });

      writeData();
      sendOverwrite();
    });

    $( '#kitAssessment' ).keyup( function() {
      var assessment = $( '#kitAssessment' ).val().trim();
      assessment = mdParser.makeHtml( assessment );

      $.extend( components, {
        assessment: assessment
      });

      writeData();
      sendOverwrite();
    });

    $( '#kitCriteria' ).keyup( function() {
      var criteria = $( '#kitCriteria' ).val().trim();
      criteria = mdParser.makeHtml( criteria );

      $.extend( components, {
        criteria: criteria
      });

      writeData();
      sendOverwrite();
    });

    $( '#kitThumbnail' ).keyup( function() {
      $.extend( components, {
        headerImage: $( '#kitThumbnail' ).val().trim() || $( '#kitThumbnail' ).attr( 'placeholder' )
      });

      writeData();
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

      writeData();
      sendOverwrite();
    });

    $( '#kitResources' ).keyup( function() {
      var resources = $( '#kitResources' ).val().trim();
      resources = mdParser.makeHtml( resources );

      $.extend( components, {
        resources: resources
      });

      writeData();
      sendOverwrite();
    });

    // inject initial state
    (function() {

      loadData();

      // summary
      var summary = $( '#kitShortDescription' ).val().trim();
      summary = mdParser.makeHtml( summary );

      // authors
      var authors = $( '#kitAuthor' ).val() || $( '#kitAuthor' ).attr( 'placeholder' );

      // description
      var description = $( '#kitDescription' ).val().trim();
      description = mdParser.makeHtml( description );

      // objectives
      var objectives = $( '#kitObjectives' ).val().trim();
      objectives = mdParser.makeHtml( objectives );

      // agenda
      var agenda = $( '#kitAgenda' ).val().trim() ? $( '#kitAgenda' ).val().trim() : '{ "order": [] }';
      agenda = JSON.parse( agenda );

      var agendaMarkdown = '';
      agenda.order.forEach( function( activity, idx ) {
        agendaMarkdown +=  idx + '. [' + agenda.makes[ activity ].title + '](' + agenda.makes[ activity ].url + ')\n';
      });
      agenda = mdParser.makeHtml( agendaMarkdown );
      var tmpDiv = document.createElement( 'div' );
      tmpDiv.innerHTML = agenda;
      $( tmpDiv ).children( 'ol' ).eq( 0 ).addClass( 'agenda' );
      agenda = tmpDiv.innerHTML;

      // outcomes
      var outcomes = $( '#kitOutcomes' ).val().trim();
      outcomes = mdParser.makeHtml( outcomes );

      // preparation
      var preparation = $( '#kitPreparation' ).val().trim();
      preparation = mdParser.makeHtml( preparation );

      // assessment
      var assessment = $( '#kitAssessment' ).val().trim();
      assessment = mdParser.makeHtml( assessment );

      // criteria
      var criteria = $( '#kitCriteria' ).val().trim();
      criteria = mdParser.makeHtml( criteria );

      // resources
      var resources = $( '#kitResources' ).val().trim();
      resources = mdParser.makeHtml( resources );

      // tags
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
        title: $( '#kitName' ).val().trim() || $( '#kitName' ).attr( 'placeholder' ),
        description: description,
        objectives: objectives,
        agenda: agenda,
        outcomes: outcomes,
        preparation: preparation,
        assessment: assessment,
        criteria: criteria
      });

      writeData();
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
