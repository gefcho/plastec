$( document ).ready(function() {
  "use strict";

/* ------------------------------------- */
/* Page Loading    ................... */
/* ------------------------------------- */

  $(".animsition").animsition({
    inClass: 'fade-in',
    outClass: 'fade-out',
    inDuration: 1500,
    outDuration: 800,
    linkElement: '.a-link',
    // e.g. linkElement: 'a:not([target="_blank"]):not([href^="#"])'
    loading: true,
    loadingParentElement: 'body', //animsition wrapper element
    loadingClass: 'animsition-loading',
    loadingInner: '', // e.g '<img src="loading.svg" />'
    timeout: false,
    timeoutCountdown: 5000,
    onLoadEvent: true,
    browser: [ 'animation-duration', '-webkit-animation-duration'],
    // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
    // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
    overlay : false,
    overlayClass : 'animsition-overlay-slide',
    overlayParentElement : 'body',
    transition: function(url){ window.location.href = url; }
  });

  /* ------------------------------------- */
  /* Masonry Grid    ................... */
  /* ------------------------------------- */
    $(function() {
      var $grid = $('.gallery').imagesLoaded( function() {
        $grid.masonry({
          itemSelector: '.item',
        });
      });
    });


 /* ------------------------------------- */
 /* Detail Content slide form right   ... */
 /* ------------------------------------- */
  $(function() {

    /* Enable img for details */
//    function showContent(e, element, navigation, info, img, close) {
    function showContent(e, element, navigation, info, close) {
      var eventTarget = e.target.hash;
//      var imgSrc = $(e.target).parents('figure').children('img').attr('src');

      e.preventDefault();
      $(element).addClass('show');
      $('body').css('overflow', 'hidden');

      $(info).find('li').removeClass('is-visible');
      $(info).find("li"+eventTarget).addClass('is-visible');

//      $(navigation).siblings(".item_info").children('li'+eventTarget).find('img').attr('src', imgSrc);
      $(navigation).siblings(".item_info").children('li'+eventTarget);
    }

    var itemContainerList = document.getElementsByClassName('items');

    $(itemContainerList).each(function() {
   //  for (var i = 0; i < itemContainerList.length; i++) {
      var item = $(this);
      var itemNavigation = $(item).children(".item_navigation");
      var itemInfo = $(itemNavigation).siblings(".item_info");
//      var itemImg = $('<img>');
      var closeButton = $('<a href="#close" class="close"><i class="ion-android-close"></i></a>');

//      function appendAndPrepend(info, img, close) {
      function appendAndPrepend(info, close) {
        var infoTab = $(info).children('li');
        $(infoTab).append(close);
//        $(infoTab).prepend(img);
//    }  appendAndPrepend(itemInfo, itemImg, closeButton);
      }  appendAndPrepend(itemInfo, closeButton);

      $(itemNavigation).on('click', function(event) {
        if ( event.target.tagName.toLowerCase() === 'a' ) {
//          showContent(event, item, itemNavigation, itemInfo, itemImg, closeButton);
          showContent(event, item, itemNavigation, itemInfo, closeButton);
        }
      });

      $('.close').on('click', function(e) {
        e.preventDefault();
        $(item).removeClass('show');
        $('body').removeAttr('style');
      });

      $(document).mouseup(function(e) {
        e.preventDefault();
        if (!$('.item_info').is(e.target) && $('.item_info').has(e.target).length === 0) {
          $('.item_info').scrollTop(0);
          $(item).removeClass('show');
          $('body').removeAttr('style');
        }
      });

    });

  });

/* ------------------------------------- */
/* MagnificPopup    ................... */
/* ------------------------------------- */

  $('.portfolio').magnificPopup({
    delegate: 'a', // child items selector, by clicking on it popup will open
    type: 'image',
    gallery:{enabled:true},
    mainClass: 'mfp-with-zoom', // this class is for CSS animation below
    titleSrc: 'title',
    zoom: {
      enabled: true, // By default it's false, so don't forget to enable it
      duration: 300, // duration of the effect, in milliseconds
      easing: 'ease-in-out', // CSS transition easing function

      // The "opener" function should return the element from which popup will be zoomed in
      // and to which popup will be scaled down
      // By defailt it looks for an image tag:
      opener: function(openerElement) {
        // openerElement is the element on which popup was initialized, in this case its <a> tag
        // you don't need to add "opener" option if this code matches your needs, it's defailt one.
        return openerElement.is('img') ? openerElement : openerElement.find('img');
      }
    }
  });


/* ------------------------------------- */
/* PhotoSwipe   ................... */
/* ------------------------------------- */
  var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) {
                continue;
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if(pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};

// execute above function
initPhotoSwipeFromDOM('.my-gallery');

/* ------------------------------------- */
/* Contact Form    ................... */
/* ------------------------------------- */

  $(function() {
  	// Get the form.
  	var form = $('#contact_form');

  	// Get the messages div.
  	var formMessages = $('#form-messages');
    var formMessageSuccess = $('#form-messages .success');
    var formMessageError = $('#form-messages .error');

  	// Set up an event listener for the contact form.
  	$(form).submit(function(e) {
  		// Stop the browser from submitting the form.
  		e.preventDefault();

  		// Serialize the form data.
  		var formData = $(form).serialize();

  		// Submit the form using AJAX.
  		$.ajax({
  			type: 'POST',
  			url: $(form).attr('action'),
  			data: formData
  		})
  		.done(function(response) {
  			// Make sure that the formMessages span or div has the 'success' class.
        $('.success').fadeIn();
        setTimeout(function(){
          $('.success').fadeToggle(200,0);
        },5000);
        $('.error').fadeOut();
  			// Set the message text.
  			$(formMessageSuccess).text(response);

  			// Clear the form.
  			$('.input-name').val('');
        $('.input-email').val('');
        $('.input-tel').val('');
  			$('.input-message').val('');
  		})
  		.fail(function(data) {
  			// Make sure that the formMessages span or div has the 'error' class.
        $('.error').fadeIn();
        setTimeout(function(){
          $('.error').fadeToggle(200,0);
        },5000);
        $('.success').fadeOut();

  			// Set the message text.
  			if (data.responseText !== '') {
  				$(formMessageError).text(data.responseText);
  			} else {
  				$(formMessageError).text('К сожалению возникла проблема с отправкой сообщения. Пожалуйста, заполните форму и попробуйте снова.');
  			}
  		});
  	});
  });

  /* ------------------------------------- */
  /* ScrollToTop   ................... */
  /* ------------------------------------- */

    $('.up').on('click', function() {
      $('html, body').animate({
          scrollTop: 0
      }, 500);
      return false;
    });

  /* ------------------------------------- */
  /* Menu   ................... */
  /* ------------------------------------- */

    $('.menu-btn').on('click', function(e) {
      e.preventDefault();
      $('.menu').toggleClass('menu_active');
    })
    $('.menu-list').on('click', 'a', function(e) {
      if($(e.target).is('a')) {
        $('.menu').removeClass('menu_active');
      }
      e.preventDefault();
      $('html, body').animate({
          scrollTop: $($(this).attr('href')).offset().top
      }, 500);
    });
    $(document).mouseup(function(e) {
      e.preventDefault();
      if (!$('.menu').is(e.target) && $('.menu').has(e.target).length === 0) {
        $('.menu').removeClass('menu_active');
      }
    });
     
});
