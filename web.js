// web.js
// a quick node.js server which serves up handwriting
// (c) 2013 Amit Mizrahi

var ejs = require('ejs');
var express = require('express');
var fs = require('fs');

var app = express();

app.engine('html', ejs.renderFile);
app.set('views', __dirname);

app.get('/', function (req, res) {
  res.render('app.html');
});

app.get('/random', function(req, res) {
	// get a random number between 1 and 64 (there are 64 files in the directory)
	var fileNumber = Math.round(Math.random()*63) + 1;
	fs.readFile(fileNumber+'.jpg', function(data) {
		res.contentType('image/jpeg');
		res.end(data, 'binary');
	});
});

app.listen(3000);