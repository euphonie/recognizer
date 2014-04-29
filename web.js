// web.js
// a quick node.js server which serves up handwriting
// (c) 2013 Amit Mizrahi

var ejs = require('ejs');
var express = require('express');
var fs = require('fs');

var app = express();


app.engine('html', ejs.renderFile);
app.set('views', __dirname);
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('app.html');
});

app.get('/random', function(req, res) {
  //process.stdout.write(__dirname+"/1.jpg");

  var fileNumber = Math.round(Math.random()*27) + 1;
  fs.readFile('/images/'+fileNumber+'.jpg', function(data) {
    res.contentType('image/jpeg');
    res.end('/images/'+fileNumber+'.jpg', 'binary');
  });
});

app.listen(3000);
