var Slides = {
	Elements: {
		links: $('a', '#navigation'),
		pages: $('div.page', '#content'),
		previous: $('#previous'),
		next: $('#next'),
		loader: $('#loader'),
		wrapper: $('#content-wrapper')
	},
	Utils: {
		doSlide: function(params) {
			params = $.extend({
				container: Slides.Elements.wrapper,
				a: Slides.Elements.links,
				spinner: Slides.Elements.loader,
				pages: Slides.Elements.pages,
				button: 'next'
			}, params);
			params.pages.eq(Slides.fn.index).
			animate({
				opacity: 0.5
			}, 600, function() {
				params.spinner.show();
				setTimeout(function() {
					params.spinner.hide();
					if (params.button == 'next') {
						Slides.fn.index++;
					} else {
						Slides.fn.index--;
					}
					params.container.animate({
						left: -params.pages.eq(Slides.fn.index).position().left
					}, 1000, 'linear', function() {
						params.a.eq(Slides.fn.index).addClass('current').
						parents('ul').find('a').not(params.a.eq(Slides.fn.index)).
						removeClass('current');
					});
				}, 1000);
			});
		},
		positionButtons: function() {
			var prev = Slides.Elements.previous;
			var next = Slides.Elements.next;
			var totalHeight = $(window).height();
			prev.css({
				top: (totalHeight / 2) - (prev.height() / 2)
			});
			next.css({
				top: (totalHeight / 2) - (next.height() / 2)
			});
		}
	},
	fn: {
		index: 0,
		setWidths: function() {
			var totalHeight = Math.max(Slides.Elements.pages.outerHeight());
			var totalWidth = Slides.Elements.pages.eq(0).width() * Slides.Elements.pages.length;
			$('#content').css({
				height: totalHeight
			});
			Slides.Elements.wrapper.css({
				width: totalWidth,
				height: totalHeight
			});
		},
		setButtonPositions: function() {
			Slides.Utils.positionButtons();
		},
		nextBtn: function() {
			var btn = Slides.Elements.next;
			var slides = Slides.Elements.pages;
			btn.click(function(evt) {
				evt.preventDefault();
				slides.css('opacity', 1);
				if (Slides.fn.index >= 0) {
					if (Slides.fn.index == (slides.length - 1)) {
						Slides.fn.index = slides.length - 1;
						Slides.Elements.previous.click();
						return;
					}
					Slides.Utils.doSlide();
				}
			});
		},
		prevBtn: function() {
			var btn = Slides.Elements.previous;
			var slides = Slides.Elements.pages;
			btn.click(function(evt) {
				evt.preventDefault();
				slides.css('opacity', 1);
				if (Slides.fn.index >= 0) {
					if (Slides.fn.index < 0 || Slides.fn.index == 0) {
						Slides.fn.index = 0;
						Slides.Elements.next.click();
						return;
					}
					Slides.Utils.doSlide({
						button: 'previous'
					});
				}
			});
		},
		navigationMenu: function() {
			var links = Slides.Elements.links;
			var wrapper = Slides.Elements.wrapper;
			var slides = Slides.Elements.pages;
			links.each(function() {
				var $a = $(this);
				var slide = $($a.attr('href'));
				var $index = $a.attr('data-rel');
				$a.click(function(evt) {
					slides.css('opacity', 1);
					evt.preventDefault();
					Slides.fn.index = $index;
					wrapper.animate({
						left: -slide.position().left
					}, 1000, 'linear', function() {
						$a.addClass('current').parents('ul').
						find('a').not($a).removeClass('current');
					});
				});
			});
		}
	},
	init: function() {
		for (var property in this.fn) {
			if (typeof this.fn[property] === 'function') {
				this.fn[property]();
			}
		}
	}
};
$(function() {
	Slides.init();
	if (window.orientation) {
		$(window).bind('orientationchange', function() {
			Slides.Utils.positionButtons();
		});
	}
});