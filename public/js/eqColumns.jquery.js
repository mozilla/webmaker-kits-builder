$.fn.eqHeights = function(options) {

	var defaults = {
		child: false ,
		parentSelector:null
	};
	var options = $.extend(defaults, options);

	var el = $(this);
	if (el.length > 0 && !el.data('eqHeights')) {
		$(window).bind('resize.eqHeights', function() {
			el.eqHeights();
		});
		el.data('eqHeights', true);
	}

	if( options.child && options.child.length > 0 ){
		var elmtns = $(options.child, this);
	} else {
		var elmtns = $(this).children();
	}

	var prevTop = 0;
	var max_height = 0;
	var elements = [];
	var parentEl;
	elmtns.height('auto').each(function() {

		if(options.parentSelector && parentEl !== $(this).parents(options.parentSelector).get(0)){
			$(elements).height(max_height);
			max_height = 0;
			prevTop = 0;
			elements=[];
			parentEl = $(this).parents(options.parentSelector).get(0);
		}

		var thisTop = this.offsetTop;

		if (prevTop > 0 && prevTop != thisTop) {
			$(elements).height(max_height);
			max_height = $(this).height();
			elements = [];
		}
		max_height = Math.max(max_height, $(this).height());

		prevTop = this.offsetTop;
		elements.push(this);
	});

	$(elements).height(max_height);
};
