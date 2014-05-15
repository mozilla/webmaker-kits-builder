(function( window, document, undef ) {
  'use strict';

  function SC( iframe ) {
    // check to see if an iframe was given to us, and
    // utilize its document if possible
    if ( iframe !== document ) {
      this._doc = document.querySelector( iframe ).contentDocument || undef;
    }
    else {
      this._doc = document;
    }

    // check that there is a document we can select from,
    // if not return an empty function
    if ( !this._doc.querySelector ) {
      return function(){};
    }
  }

  SC.prototype = {
    _doc: document,
    /**
     * Allows for an arbitrary number of arguments (filters) to be applied to
     * a String. Each of which take a string as a single parameter and
     * return a string.
     *
     * @example
     *  SC.filter('  This is my string ', String.trim, function(str){return str + '!';}, String.bold);
     *  // returns '<b>This is my string!</b>'
     *
     * @param  {String} str the string to apply filters to.
     * @return {String}     the modified string.
     */
    filter: function( str ) {
      var args = Array.prototype.slice.call( arguments );

      // remove first arg (str) from args list.
      args.shift();

      args.forEach( function( fn ) {
        str = fn.call( str, str );
      });

      return str;
    },
    /**
     * Shortcut for document.querySelector that is applied to the
     * document used to initilize the SC object.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/document.querySelector}
     *
     * @param  {String} selector the CSS selector for the desired element
     * @return {Element}         the selected Element or undefined.
     */
    qs: function( selector ) {
      // get the DOMElement base on selector
      var selected = this._doc.querySelector( selector );
      var innerHTML = '';
      var args = Array.prototype.slice.call(arguments);

      // if no element matched return undefined
      if ( !selected ) {
        return;
      }

      // remove the first arg as its been used, and is named
      args.shift();

      // if second arg === string the use it as new innerHTML
      if ( typeof args[ 0 ] === 'string' ) {
        innerHTML = args.shift();
      }
      // if second arg === function then use
      else if ( typeof args[ 0 ] === 'function' ) {
        innerHTML = selected.innerHTML;
      }
      // this function requires 2 args...
      // if there isnt a second return the selected DOMElement
      else {
        return selected;
      }

      args = [ innerHTML ].concat( args );

      // run each function modifying the innerHTML each time.
      innerHTML = this.filter.apply( innerHTML , args );

      // once modifications made, appy to selected element
      selected.innerHTML = innerHTML;

      // return selected
      return selected;
    }
  };

  window.SC = SC;
})( this, document );
