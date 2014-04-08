/**
 * String.prototype.filter
 *
 * Allows for an arbitrary number of arguments which take a string as a single
 * parameter, and return a string, to modify the string.
 *
 * @example
 *  '  This is my string '.filter(String.trim, function(str){return str + '!';}, String.bold);
 *  // returns '<b>This is my string!</b>'
 *
 * @author William Duyck <fuzzyfox0@gmail.com>
 */
if ( !String.prototype.filter ) {
	String.prototype.filter = function() {
		'use strict';
		var args = Array.prototype.slice.call( arguments );
		var str = this;

		args.forEach( function( fn ) {
			str = fn.call( str, str );
		});

		return str;
	};
}

(function( window, document, undefined ) {
	'use strict';

	function SC( iframe ) {
		return new SC.prototype.init( iframe || document );
	}

	SC.prototype = {
		_doc: document,
		qs: function( selector ) {
			// get the DOMElement base on selector
			var selected = this._doc.querySelector( selector );
			var innerHTML = '';
			var args = Array.prototype.slice.call(arguments);

			// if no element matched return undefined
			if ( !selected ) {
				return undefined;
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

			// run each function modifying the innerHTML each time.
			innerHTML = String.prototype.filter.apply( innerHTML , args );

			// once modifications made, appy to selected element
			selected.innerHTML = innerHTML;

			// return selected
			return selected;
		},
		init: function( iframe ) {
			// check to see if an iframe was given to us, and
			// utilize its document if possible
			if ( iframe !== document ) {
				this._doc = document.querySelector( iframe ).contentDocument || undefined;
			}
			else {
				this._doc = document;
			}

			// check that there is a document we can select from,
			// if not return an empty function
			if ( !this._doc.querySelector ) {
				return function(){};
			}

			return this;
		}
	};

	SC.prototype.init.prototype = SC.prototype;

	window.SC = SC;
})( this, this.document );
