(function(window, document, $, undefined) {
  'use strict';

  // Array Remove - By John Resig (MIT Licensed)
  if ( !Array.prototype.remove ) {
    /**
     * Removes defeined range of elements from the array
     * @param  {Integer} from Begin range.
     * @param  {Integer} to   End range, else remove one elemnt.
     * @return {Array}        The modified array.
     */
    Array.prototype.remove = function( from, to ) {
      var rest = this.slice( ( to || from ) + 1 || this.length );
      this.length = from < 0 ? this.length + from : from;
      return this.push.apply( this, rest );
    };
  }

  // some repeatedly used elements
  var mdParser = new window.Showdown.converter();
  var sc = window.SC('#previewFrame');

  /*
    Utility Functions / Filters
   */

  /**
   * Removes the `<p>` tags from the a string.
   * @param  {String} str Input string.
   * @return {String}     Output string.
   */
  function removePTags( str ) {
    return str.replace(/(<p>|<\/p>)/, '');
  }

  /**
   * Splits a comma sperated list into an Array
   * @param  {String} str Input string.
   * @return {Array}      Output array.
   */
  function splitCommaSeparatedList( str ) {
    var rtn = str.split( /, ?/ );
    rtn.forEach(function( el, idx, ary ) {
      el = el.trim();
      ary[ idx ] = el;
      if ( el === '' ) {
        ary.remove( idx );
      }
    });
    return rtn;
  }

  /**
   * Convert authors into links to their makes.org profile links
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
        rtn += '['+ author + '](https://' + author.substr(1) + '.makes.org/), ';
      }
      else if ( author.match( /\w+/ ) ) {
        rtn += author + ', ';
      }
    });

    rtn = rtn.substr( 0, rtn.length -2 );

    // return mdParser.makeHtml( rtn.substr( 0, rtn.length -2 ).trim() );
    return rtn.filter( String.trim, mdParser.makeHtml, removePTags );
  }

  /**
   * Takes an array of strings, and converts it into `<meta>`
   * tags defining Webmaker Tags.
   * @param  {Array} array An array of strings/tags
   * @return {String}      HTML for the Webmaker Tags
   */
  function arrayToWMMetaTags( array ) {
    return '';
  }

  $( '#previewFrame' ).load( function(){
    var frame = this.contentWindow;
    // inject on keypress
    $( '#kitName' ).keyup( function() {
      sc.qs( 'header > hgroup > h1', $( '#kitName' ).val() || $( '#kitName' ).attr( 'placeholder' ) );
    });

    $( '#kitAuthor' ).keyup( function() {
      sc.qs( '#made-by', $( '#kitAuthor' ).val() || $( '#kitAuthor' ).attr( 'placeholder' ), String.trim, makeAuthorHTML, removePTags );
    });

    $( '#kitShortDescription' ).keyup( function() {
      sc.qs( 'header > hgroup > h2', $( '#kitShortDescription' ).val(), String.trim, mdParser.makeHtml, removePTags );
    });

    $( '#kitThumbnail' ).keyup( function() {
      frame.document.querySelector( 'header' ).style.backgroundImage = 'url(' + ($( '#kitThumbnail' ).val() || $( '#kitThumbnail' ).attr( 'placeholder' )) + ')';
    });

    $( '#kitContent' ).keyup( function() {
      sc.qs( 'main', $( '#kitContent' ).val(), mdParser.makeHtml );
    });

    $( '#kitTags' ).keyup( function() {
      var tagList = $( this ).val() || $( this ).attr( 'placeholder' ),
      tagListAside = '';

      tagList = splitCommaSeparatedList( tagList );

      tagList.filter( function( tag ) {
        console.log(tag);
        tagListAside += '<li><a href="https://webmaker.org/t/' + tag + '" target="_blank">#' + tag + '</a></li>';

        if ( !frame.document.querySelector( 'meta[name="webmaker:tags"][content="' + tag + '"]' ) ) {
          var meta = frame.document.createElement( 'meta' );
          meta.name = 'webmaker:tags';
          meta.content = tag;
          frame.document.head.appendChild( meta );
        }
    });

     var tagListMeta = frame.document.querySelectorAll( 'meta[name="webmaker:tags"]' );
     Array.prototype.forEach.call(tagListMeta, function( element ){
       if ( tagList.indexOf( element.content ) === -1 && element.content !== 'kit' && element.content !== 'kit-builder' ) {
        element.parentNode.removeChild( element );
      }
    });

     frame.document.querySelector( 'aside > .tags > ul' ).innerHTML = tagListAside;
   });

    $( '#kitBackground' ).keyup( function() {
      frame.document.querySelector( 'html' ).style.backgroundColor = $( '#kitBackground' ).val() || $( '#kitBackground' ).attr( 'placeholder' );
    });

    $( '#kitType' ).keyup( function() {
      sc.qs( '#ribbon', 'Teaching ' + ( $( '#kitType' ).val() || $( '#kitType' ).attr( 'placeholder' ) ) );
      frame.document.querySelector( 'body' ).setAttribute('class', $( '#kitType' ).val() || $( '#kitType' ).attr( 'placeholder' ));
    });

    $( '#kit-builder-form' ).submit( function( e ) {
      var kitHTML = '<!doctype html><html>' + frame.document.documentElement.innerHTML + '</html>';
      kitHTML = kitHTML.replace( '\n', '' );
      window.open( 'data:text/html;' + ( window.btoa ? 'base64,' + btoa( kitHTML ) : kitHTML ) );
      e.preventDefault();
      return false;
    });

    // inject initial state
    sc.qs( 'main', $( '#kitContent' ).val(), mdParser.makeHtml );
    sc.qs( 'header > hgroup > h2', $( '#kitShortDescription' ).val(), String.trim, mdParser.makeHtml, removePTags );
    sc.qs( '#made-by', $( '#kitAuthor' ).val() || $( '#kitAuthor' ).attr( 'placeholder' ), String.trim, makeAuthorHTML, removePTags );
    sc.qs( 'header > hgroup > h1', $( '#kitName' ).val() || $( '#kitName' ).attr( 'placeholder' ) );
    sc.qs( '#ribbon', 'Teaching ' + ( $( '#kitType' ).val() || $( '#kitType' ).attr( 'placeholder' ) ) );

    frame.document.querySelector( 'header' ).style.background = 'url(' + ($( '#kitThumbnail' ).val() || $( '#kitThumbnail' ).attr( 'placeholder' )) + ') center center / cover';
    frame.document.querySelector( 'html' ).style.background = $( '#kitBackground' ).val() || $( '#kitBackground' ).attr( 'placeholder' );
    frame.document.querySelector( 'body' ).classList.add($( '#kitType' ).val() || $( '#kitType' ).attr( 'placeholder' ));
  });
})( this, this.window, this.jQuery );
