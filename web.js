// web.js
// a quick node.js server which serves up handwriting
// (c) 2013 Amit Mizrahi

var ejs = require('ejs');
var express = require('express');
var fs = require('fs');
var http = require('http');

var app = express();

var assert = require("assert"),
    brain = require("brain"),
    bodyParser = require('body-parser');

//Neural network definition
var net = new brain.NeuralNetwork({
  hiddenLayers: [10,10],
  momentum:0.7
});

app.engine('html', ejs.renderFile);
app.set('views', __dirname);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser({limit:'50mb'}));

app.get('/', function (req, res) {
  res.render('app.html');
});

app.post('/train', function(req, res){
  var trainData = req.body.entrenamiento;
  var epochs = req.body.epochs;
  net.train(trainData, {
    iterations:epochs,
    callbackPeriod:1,
    callback:function(m){
      console.log(m);
      console.log('end training');
      res.end('OK');
    }
  });
});

app.get('/getNet', function(req, res){
  res.attachment('neural_net.json');
  res.end(JSON.stringify(net.toJSON(), null, 2), 'utf8');
});

app.post('/test', function(req, res){
  var prueba = req.body.prueba;
  var result = net.run(prueba);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
});

app.get('/random', function(req, res) {
  var fileNumber = Math.round(Math.random()*27) + 1;
  fs.readFile('/images/'+fileNumber+'.png', function(data) {
    res.contentType('image/png');
    res.end('/images/'+fileNumber+'.png', 'binary');
  });
});

app.get('/image/:fileNumber', function(req, res) {
  fileNumber = req.param('fileNumber');
  fs.readFile('/images/'+fileNumber+'.png', function(data) {
    res.contentType('image/png');
    res.end('/images/'+fileNumber+'.png', 'binary');
  });
});

app.listen(3000);
