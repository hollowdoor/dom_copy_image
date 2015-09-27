Install
-------

`npm install --save dom-copy-image`

Usage
-----

```html
<!DOCTYPE html>
<html>
    <head>
    <title>dom copy!</title>
    </head>
<body>
    <button>Copy Image</button>
    <button id="make-thumb">Make thumbnail</button>
    <p></p>
    <script>
    var copyImage = require('dom-copy-image'),
        path = require('path');

    document.querySelector('button').addEventListener('click', function(e){
        copyImage('original.jpg', 'new.png').then(function(data){
            console.log(data.file+' was copied.');
            document.querySelector('p').innerHTML = data.file+' was copied.';
        });
    });

    document.querySelector('#make-thumb').addEventListener('click', function(e){
        //Make a small image copy
        copyImage('original.jpg', 'thumb.png', {width: 100}).then(function(data){
            var img = document.createElement('img');
            img.src = 'thumb.png';
            document.querySelector('body').appendChild(img);
        });
    });

    </script>
  </body>
</html>

```

copyImage(source, destination, options) -> Promise
--------------------------------------------------

The **destination**, and **options** arguments are optional.

Resolved value from the promise is an object
--------------------------------------------

value.file = String;

value.dataURL = String;

value.destination = String;

options
-------

### options.width / options.height = Integer

Sets the output dimensions. These should be integers in **pixels**. Only one needs to be set.

### options.ratio = Boolean

The default is true. Should the output preserve it's dimension ratio?

### options.type = String

The default is image/png. What image type should the output be?

### options.quality = Integer

An integer between 0, and 1. What quality should the output image have?

About
-----

This module only works in a client DOM environment that can use node/iojs modules. For instance it will work well with [electron](http://electron.atom.io/).

It can copy images, but if you don't specify a destination you can just use it as a resize function getting back a dataURL from the resolved promise to use as a `img` tag `src`.
