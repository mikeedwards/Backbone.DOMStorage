# Backbone localStorage and sessionStorage Adapter v1.0

[![Build Status](https://secure.travis-ci.org/mikeedwards/Backbone.DOMStorage.png?branch=master)](http://travis-ci.org/mikeedwards/Backbone.DOMStorage)

Quite simply a localStorage and sessionStorage adapter for Backbone. It's a drop-in replacement for Backbone.Sync() to handle saving to a localStorage or sessionStorage databases.

This is a *rough* fork of jeromegn's excellent Backbone.localStorage module.

## Usage

Include Backbone.domStorage after having included Backbone.js:

```html
<script type="text/javascript" src="backbone.js"></script>
<script type="text/javascript" src="backbone.domStorage.js"></script>
```

Create your collections like so:

```javascript
window.SomeCollection = Backbone.Collection.extend({
  
  localStorage: new Backbone.LocalStorage("SomeLocalCollection"), // Unique name within your app.
  
  // ... everything else is normal.
  
});
```

*or*

```javascript
window.SomeCollection = Backbone.Collection.extend({
  
  sessionStorage: new Backbone.SessionStorage("SomeSessionCollection"), // Unique name within your app.
  
  // ... everything else is normal.
  
});
```

Feel free to use Backbone as you usually would, this is a drop-in replacement.

## Contributing

You'll need node and to `npm install` before being able to run the minification script.

1. Fork;
2. Write code;
3. Write tests (or vice et versa);
4. `make test`;
5. `make minified`;
6. Create a pull request.

Have fun!

## Credits

Thanks to [Jerome Gravel-Niquet](https://github.com/jeromegn) for all the actual hard work.  If you see anything bad here, it's my fault, not his.
Thanks to [Mark Woodall](https://github.com/llad) for the QUnit tests.
Thanks to [Martin Häcker](https://github.com/dwt) for the many fixes and the test isolation.

## Licensed

Licensed under MIT license

Copyright (c) 2010 Jerome Gravel-Niquet

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.