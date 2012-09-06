test:
	open tests/test.html
	open tests/test2.html

minified:
	uglifyjs -o backbone.domStorage-min.js backbone.domStorage.js
