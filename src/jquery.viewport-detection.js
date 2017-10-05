/**
 * Represents an IIFE.
 * https://developer.mozilla.org/en-US/docs/Glossary/IIFE
 * @function
 * @param {Object} $ - Alias jQuery to '$'.
 * @param {Object} window - Pass in 'window' as local variable.
 * @param {Object} document - Pass in 'document' as local variable.
 * @param {string} undefined - Ensure 'undefined' is undefined by not passing in expected parameter. 
 */
;(function($, window, document, undefined){

    'use strict';

    var pluginName = 'viewportDetection',
        cache = {
            container: {},
            elements: [],
            elementCount: 0
        },
        defaults = {
            debug: false,
            container: $(window),
            visible: function(){},
            invisible: function(){},
            debounce: {
                wait: 0,
                immediate: true
            },
            offset: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            infinite: true,
            target: '> *'
        };
    
    /**
     * Creates the plugin on 'new' instantiaton.
     * @constructor
     * @param {Object} container - The 'container' DOM Object as defined by 'options' during instantiaton.
     * @param {Object} options - The plugin instantiaton configuration Object.
     */
    function Plugin(container, options) {
        this.settings = $.extend({}, defaults, options);
        this.container = $(this.settings.target, container);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function() {
            this.getContainer();
            this.setElements();
            this.elementInContainer();
            this.scrollEvent().on();
        },

        /**
         * 'debounce' function provided to aid and control performance.
         * Referenced from: https://john-dugan.com/javascript-debounce/
         * @function
         * @param {function} func - Function to be debounced.
         * @param {number} wait - Milliseconds before 'func' is called.
         * @param {boolean} immediate - 'func' is applied on leading edge if true.
         */
        debounce: function(func, wait, immediate) {
            var timeout;

            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },
        
        /**
         * Returns the position of the container.
         * @returns {Object} - The position of the container.
         */
        getContainer : function() {
            var settings = this.settings,
                $container = $(settings.container),
                offset = settings.offset;

            return {
                top : $container.scrollTop() + offset.top,
                right : $container.scrollLeft() + $container.width() + offset.right,
                bottom : $container.scrollTop() + $container.height() + offset.bottom,
                left : $container.scrollLeft() + offset.left
            }
        },

        /**
         * Cache element settings, their respective
         * DOM nodes and position.
         * @function
         * @param {Object} - 'container' node.
         */
        setElements : function() {
            $.each(this.container, function() {
                var $this = $(this);
                cache.elements.push({
                    infinite: true,
                    visible: false,
                    node: $this,
                    position: {
                        top: $this.offset().top,
                        right: $this.offset().left + $this.width(),
                        bottom: $this.offset().top + $this.height(),
                        left: $this.offset().left
                    }
                });
            });
        },

        /**
         * Determine if cached elements are visible
         * by inferring their position relative to
         * return value of getContainer
         * @function
         * @param {Array} - Array of cached elements.
         */
        elementInContainer : function() {
            var self = this,
                container = this.getContainer();

            $.each(cache.elements, function(i) {
                var element = cache.elements[i];
                
                if ((element.position.left <= container.right) &&
                    (element.position.right >= container.left) &&
                    (element.position.top <= container.bottom) &&
                    (element.position.bottom >= container.top))
                {
                    if (element.visible != true) {
                        element.visible = true;
                        self.handleCallback(self.settings.visible, i);
                                
                        if (self.settings.infinite != true && element.infinite) {
                            cache.elementCount ++;
                        }
                    }
                } else {
                    if (self.settings.infinite == true && element.visible == true) {
                        element.visible = false;
                        self.handleCallback(self.settings.invisible, i);
                    }
                }
            });

            if (self.settings.infinite != true && cache.elementCount == cache.elements.length) {
                self.scrollEvent().off();
            }
        },
        
        /**
         * Handle callbacks from plugin configuration
         * object: 'visible' and 'invisible'.
         * @function
         * @param {func} callback - Plugin configuration callback.
         * @param {number} i - Determine which cached element to 'callbac' func is applied to. 
         * @throws Will throw an error if 'callback' is not a function.
         */
        handleCallback: function(callback, i) {
            if (typeof callback === 'function') {
                callback(cache.elements[i].node);
            } else if (this.settings.debug) {
                console.error(this._name + ': \'' + callback + '\'' + ' is not a function.')
            }
        },

        /**
         * Set-up scroll event on container with option to
         * disable scroll event if respective option is enabled in
         * plugin instantiaton configuration.
         * @function
         * @returns {Object} - Methods for attaching and detaching scroll event.
         */
        scrollEvent: function() {
            var self = this,
                settings = this.settings,
                event = {},
                debouncedEvent;

            debouncedEvent = self.debounce(function() {
                self.elementInContainer();
            }, settings.debounce.wait,
               settings.debounce.immediate
            );

            return {
                on: function() {
                    $(settings.container).on('scroll', function() {
                        debouncedEvent();
                    });
                },
                off: function() {
                    $(settings.container).off('scroll', this.on());
                }
            };
        }
    });

    /**
     * Function that adds 'pluginName' to jQuery prototype
     * if it doesn't already exist in 'pluginName' namespace.
     * @function
     * @param {Object} options - Plugin instantiaton configuration object.
     * @returns {function} - Instance of 'pluginName' as jQuery prototype object.
     */
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName + this.classList.value)) {
                console.log('plugin_' + pluginName + this.classList.value);
                $.data(this, 'plugin_' +
                    pluginName + this.classList.value, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);