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
    bodyParser = require('body-parser'),
    multer  = require('multer');

//Neural network definition
var net = new brain.NeuralNetwork({
  hiddenLayers: [5, 5],
  momentum:0.7
});
var _error=0;
var _iterations=0;

app.engine('html', ejs.renderFile);
app.set('views', __dirname);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser({limit:'50mb'}));
app.use(multer({ dest: './uploads/'}))

app.get('/', function (req, res) {
  res.render('app.html');
});

app.post('/train', function(req, res){
  var trainData = req.body.entrenamiento;
  var epochs = req.body.epochs;
  _error = 0;
  _iterations = 0;
  net.train(trainData, {
    iterations:epochs,
    callbackPeriod:1,
    callback:function(m){
      console.log(m);
      _error = m.error;
      _iterations = m.iterations;
      res.end('OK');
    }
  });
});

app.get('/checkNet', function(req, res){
  res.end(JSON.stringify({'error':_error, 'iterations':_iterations}));
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
  var fileNumber = Math.round(Math.random()*14) + 1;
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

app.post('/file-upload', function(req, res, next) {
  var neural_network;
  // First I want to read the file
  fs.readFile(req.files.jsonFile.path, function read(err, data) {
    if (err) {
      throw err;
    }
    //neural_network = data;
    if (Buffer.isBuffer( data)){
      neural_network = data.toString('utf8');
      net.fromJSON(JSON.parse(neural_network));
      res.end(JSON.stringify({'status':'success','message':'Red interpretada.'}));
    }else{
      res.end(JSON.stringify({'status':'error','message':'Archivo de formato no permitido.'}));
    }
  });
});

app.listen(3000)
