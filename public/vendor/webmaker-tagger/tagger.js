/* global jQuery */
(function( window, document, $) {
	'use strict';

	// get user language
	var userLang = window.navigator.language || window.navigator.userLanguage || 'en-US';

	/**
	 * Add autocomplete to specified input combining weblit tags + context tags.
	 *
	 * options = {
	 *   input: '#tagger', // set input text field [req]
	 *   output: '#tagger-output', // set output text field [req]
	 *   display: '#tagger-display', // set wrapper for tag display
	 *   mixTags: false, // mix weblit tags w/ context tags? [defaults to false]
	 *   lang: 'en-US' // initialize the language to use for weblit tags
	 * }
	 *
	 * @param {Object}   options  initialization settings + options
	 * @param {Function} callback a callback to run once initialized
	 */
	function WMTagger( options, callback ){
		var self = this;

		// define the list of selected tags
		self._tagList = [];

		// create caches for commonly used elements
		self._input = $( options.input );
		self._output = $( options.output );
		self._display = $( options.display );

		// check that an input + output were set (required)
		if( ( self._input.length !== 1 ) || ( self._output.length !== 1 ) ) {
			return console.error( 'WMTagger requires exactly 1 input and 1 output text field. Saw ' + self._input.length + ' inputs and ' + self._output.length + ' outputs');
		}

		// check that a wrapper for displaying tags was set
		if( self._display.length === 0 ) {
			self._display = $('<div/>');
			self._input.after( self._display );
		}
		self._display.addClass('wmtagger-tags');

		// create spans for weblit + contextual tags (weblit takes priority)
		self._mixTags = options.mixTags || false;
		if( !self._mixTags ) {
			self._display.append( '<span class="wmtagger-weblit-tags"/>' );
		}

		// init WebLit Client
		self.wlc = new window.WebLiteracyClient();

		// setup l10n w/ our best guess (fallback to en-US)
		if( options.lang && self.wlc.lang( options.lang ) ) {
			self.lang = options.lang;
		}
		else if( self.wlc.lang( userLang ) ) {
			self.lang = userLang;
		}
		else {
			self.lang = 'en-US';
		}

		// get weblit tags and map them to needed format
		self._wlcTags = self.wlc.all().map( function( item ) {
			return {
				label: item.term,
				value: item.tag,
				data: item
			};
		});

		// custom autocomplete source
		// merge weblit tags + known tags from makeapi
		function autocompleteSource( request, response ) {
			// filter weblit tags w/ simple regex
			var term = $.ui.autocomplete.escapeRegex( request.term );
			var regex = new RegExp( term, 'i' );
			var weblitTags = [];

			self._wlcTags.forEach( function( wlcTag ) {
				// regex explained:
				// 1) check input against weblit compentency name
				// 2) check input starts w/ "weblit" before checking 3.
				// 3) check the standardized tag against input if 2.
				if( regex.test( wlcTag.label ) || ( /^weblit/i.test( term ) && regex.test( wlcTag.value ) ) ) {
					weblitTags.push( wlcTag );
				}
			});

			// get tags already in the make-api
			$.getJSON( 'https://makeapi.webmaker.org/api/20130724/make/tags?t=' + request.term, function( data ) {
				// format resposne as needed
				var makeapiTags = data.tags.map( function( makeTag ) {
					return {
						label: decodeURIComponent(makeTag.term),
						value: decodeURIComponent(makeTag.term),
						data: makeTag
					};
				});

				response( weblitTags.concat(  makeapiTags ) );
			}).fail( function() {
				response( weblitTags );
			});
		}

		// init the autocomplete
		self._input.autocomplete( {
			source: autocompleteSource,
			minLength: options.minLength || 1,
			focus: function() {
				self._input.off( 'blur', function( event ) {
					self.addTag( event );
				});
			},
			close: function() {
				self._input.on( 'blur', function( event ) {
					self.addTag( event );
				});
			}
		});

		// add tag on [enter] or [tab] keys
		self._input.on( 'keydown', function( event ) {
			if( event.which === 13 || event.which === 188 ) {
				event.preventDefault();
				self.addTag( event );
			}
		});

		// add tag on blur
		self._input.on( 'blur', function( event ) {
			self.addTag( event );
		});

		// remove visible tags on click
		self._display.on( 'click', '.btn', function() {
			var tag = $( this ).data( 'tag' );
			self._tagList = $.grep( self._tagList, function( item ) {
				return item !== tag;
			});

			$( this ).remove();
			self._output.val( self._tagList.join( ', ' ) ).trigger( 'change' );
		});

		var initialTags = self._output.val() || self._output.attr( 'placeholder' );
		if ( initialTags ) {
			initialTags.split( ',' ).forEach( function( tag ) {
				self.addTag({
					value: tag.trim()
				});
			});
		}

		// if set, run callback so third parties can further modify the ui
		if( typeof callback === 'function' ) {
			callback( self );
		}

		return self;
	}

	WMTagger.prototype = {
		addTag: function( tag ) {
			// check if tag is an event and ignore if so
			// replace the event w/ the value of the input field as tag
			if( tag.eventPhase ) {
				tag = {
					value: this._input.val()
				};
			}

			// check that there is actually a tag to add
			if( !tag.value ) {
				return;
			}

			// ensure that there is both a label and value
			if( !tag.label ) {
				tag.label = this.wlc.term( tag.value ) || tag.value;
			}

			// add tag to tag list, and output field
			this._tagList.push( tag.value );
			this._output.val( this._tagList.join( ', ' ) ).trigger( 'change' );

			// local cache for tag wrapper
			var tagWrapper = this._display;

			// should we be mixing tags, if not seperate out the weblit tags
			if( !this._mixTags && this.wlc.term( tag.value ) ) {
				tagWrapper = this._display.find( '.wmtagger-weblit-tags:first' );
			}

			// display the tag
			tagWrapper.append('<a class="btn btn-primary auto-tag" data-tag="' + tag.value + '">' + tag.label + ' <span class="fa fa-times"></span></a>');

			// empty the input field
			this._input.val('');
		},
		getTags: function() {
			return this._tagList.slice();
		}
	};

	window.WMTagger = WMTagger;
})(this, document, jQuery);
