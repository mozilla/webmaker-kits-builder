/* global jQuery, wmOERSearch */


(function( window, document, $, wmOERSearch ) {
  'use strict';

  /*
    Caches
   */
  var $input = $( '#activitySearch input' );
  var $output = $( '#kitAgenda' );
  var $results = $( '#activitySearchResults' );
  var $selected = $( '#activitySearchSelected' );
  var searchResults = {};

  /*
    Utility Functions
   */

  /**
   * Returns a shuffled version of the input array.
   *
   * Uses the Fisher-Yates shuffle.
   *
   * @param  {Array} array The array to shuffle
   * @return {Array}       Shuffled array.
   */
  function shuffleArray( array ) {
    var randomIndex = 0;
    var tempValue = null;
    var length = array.length;

    if( length < 2 ) {
      return array;
    }

    while( length ) {
      randomIndex = Math.floor( Math.random() * length );
      length--;

      tempValue = array[ length ];
      array[ length ] = array[ randomIndex ];
      array[ randomIndex ] = tempValue;
    }

    return array;
  }

  /**
   * Returns the number of occurances of a `thing` in an array
   *
   * @param  {Mixed} thing  What to look for when counting
   * @param  {Array} array  The array to look through
   * @return {Number}       How many occurances were found
   */
  function countOccurances( thing, array ) {
    var count = 0;

    for( var idx = 0, len = array.length; idx < len; idx++ ) {
      if( array[ idx ] === thing ) {
        count++;
      }
    }

    return count;
  }


  /*
    Store selected activities
   */
  var selectedActivities = {
    order: [],
    makes: {}
  };

  /**
   * Adds a make to the selected, and returns a UID for it.
   * @param {Object} make The make to add.
   */
  function add( make ) {
    var id = make.id || make.url;

    if( selectedActivities.order.indexOf( id ) > -1 ) {
      var count = countOccurances( id, selectedActivities.order );
      id = id + '-' + ( count + 1 );
    }

    selectedActivities.order.push( id );
    selectedActivities.makes[ id ] = make;

    return id;
  }

  /**
   * Removes a make from the selected set using a UID provided by `add()`
   *
   * @see add()
   * @param  {String} id The UID of the make to remove
   */
  function remove( id ) {
    var idx = selectedActivities.order.indexOf( id );

    if( idx > -1 ) {
      selectedActivities.order.splice( idx, 1 );
    }

    if( id in selectedActivities.makes ) {
      delete selectedActivities.makes[ id ];
    }
  }

  /**
   * Escapes a string for use in RegExp
   *
   * Hat Tip: Mozilla Developer Network
   *
   * @param  {String} str The string to escape
   * @return {String}     Escaped string
   */
  function escapeRegExp( str ) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }

  /**
   * Runs a search for activities
   */
  function search() {
    // clear results box
    $results.empty();

    // only make a search if there is a search term
    if( $input.val() !== '' ) {
      wmOERSearch( $input.val(), {
        OERType: 'activity',
        success: function( makes ) {
          var limit = 10; // limit the number of displayed results

          // if total returned is less than limit ajust limit
          if ( makes.length < limit ) {
            limit = makes.length;
          }

          // empty the search results cache
          searchResults = {};


          for( var idx = 0; idx < limit; idx++ ) {
            var id = makes[ idx ].id || makes[ idx ].url; // get the make id OR url if none
            var regex = new RegExp( escapeRegExp( id ) ); // regex to test of id later
            var markSelected = '';

            // add result to searchResults cache
            searchResults[ id ] = makes[ idx ];

            // check to see if the make is already selected
            if( regex.test( selectedActivities.order.join( '' ) ) ) {
              // it is, so make sure to add a selected class
              markSelected = ' selected';
            }

            $results.append('<li class="media activities' + markSelected + '" data-make-id="' + id + '">' +
                                  '<a href="#result-1" class="pull-left thumbnail"><img src="' + makes[ idx ].thumbnail + '" alt="#"></a>' +
                                  '<div class="media-body">' +
                                    '<h4 class="media-heading">' + makes[ idx ].title + ' <small>by ' + makes[ idx ].username + '</small></h4>' +
                                    '<p>' + makes[ idx ].description + '</p>' +
                                  '</div>' +
                                '</li>');
          }
        },
        error: function( error ) {
          console.error( error );
        }
      });
    }
  }

  /**
   * Triggers change event for output after updating it
   */
  function updateOutput() {
    $output.val( JSON.stringify( selectedActivities ) );
    $output.trigger( 'change' );
  }

  /*
    Deal with UI
   */

  // run a search
  $input.on( 'keydown', function( event ) {
    if( event.keyCode === 13 ) {
      event.preventDefault();
      search();
      return false;
    }
  });
  $('#activitySearch button#search').on('click', function( event ) {
    event.preventDefault();

    search();

    return false;
  });

  // select an activity
  $results.on( 'click', '.media > .thumbnail', function( event ) {
    var $self = $( this ).parent( '.media' ); // get actual result in UI
    var id = $self.data( 'make-id' ); // get ID for result
    var uid = add( searchResults[ id ] ); // get selected make UID

    // add to selected activities UI
    $selected.append( $self.clone().data( 'uid', uid ) );
    $self.addClass( 'selected' );

    // update output
    updateOutput();
  });

  // remove an activity
  $selected.on( 'click', '.media > .thumbnail', function( event ) {
    var $self = $( this ).parent( '.media' ); // get actual activity in UI
    var uid = $self.data( 'uid' ); // get selection UID

    remove( uid );
    $self.remove();

    // remove selected indicator if no longer selected
    $results.find( '.media' ).each( function( idx, result ) {
      var id = $( result ).data( 'make-id' ); // get the make id
      var regex = new RegExp( escapeRegExp( id ) ); // regex to test of id later

      if( !regex.test( selectedActivities.order.join( '' ) ) ) {
        $( result ).removeClass( 'selected' );
      }
    });

    // update output
    updateOutput();
  });

  // make activities sortable
  $selected.sortable();

  // deal w/ reodering activities
  $selected.on( 'sortdeactivate', function( event, ui ) {
    var newOrder = [];

    $( this ).children( '.media' ).each( function( idx, activity ) {
      newOrder.push( $( activity ).data( 'uid' ) );
    });

    selectedActivities.order = newOrder;

    // update output
    updateOutput();
  });

  // deal w/ page reload + form input persistance (i.e. initial state)
  (function() {
    if( $output.val() ) {
      selectedActivities = JSON.parse( $output.val() );

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
  }());
})( this, document, jQuery, wmOERSearch );
