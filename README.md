# jQuery-viewport-detection
A jQuery plugin for viewport detection.

---

## What does it do?
Detects when elements in a given container are visible in the browser, providing callback functions for manipulating said elements.

## How does it work?
On instantiation the plugin quickly determines the size of the viewport and the position of elements specified within it. A scroll event is attached to the `window` that detects when the leading edge of an element enters the detection area. Callback functions can then be used to manipulate a returned jQuery object containing the element.

## Why use it?
The plugin has many potential uses owing to it's simple, unassuming interface. Examples include lazy loading image assets and triggering CSS3 animations.

## How do I use it?
You can find the production code here:
`dist/js/jquery.viewport-detection.min.js`

Just add it to your document in a `<script>` tag.

```html
<script src="/path/to/file/jquery.viewport-detection.min.js" type="text/javascript"></script>
```

```javascript
$('.container').viewportDetection({
    visible: function(el) {
        el.addClass('visible');
    }
});
```

This is the simplest way to use the plugin.
You **must** pass in the `visible` function as a parameter. This is the simplest way of manipulating the returned element, `el`.
`el` is a jQuery Object and can be manipulated as such.

### Options
This is a list of options available to you with their default settings. They should be passed into the parameters object for `viewportDetection`.

```javascript
debug: false,
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
```

* `debug` is a flag for enabling `console.error()` messages.
* `visible` is a function that will handle the element, `el`, when it is in the viewport.
* `invisible` is a function that will handle the element, `el`, when it is *not* in the viewport.
* `debounce` is a configuration object for debouncing on the `window` scroll event. We advise [reading more about debouncing here.](https://john-dugan.com/javascript-debounce/)
* `offset` is a configuration object for altering the apparent position of the viewport. The default viewport setting for the plugin is set equal to the visible part of the browser window. This object can be used to move or resize the apparent position of the viewport by offsetting to a pixel value for any or all of the dimensions. All properties and values must be present and in integer.
* `infinite` will ensure the scroll event continues to fire even when all elements have passed through the viewport. This is particularly useful when used with both the `visible` *and* `invisible` functions.
* `target` is the default selector path passed to the jQuery selector engine. By default it will class all immediate children of a given container as elements to pass through `viewportDetection`, e.g `.container > *`. 



