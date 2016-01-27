var wikiRouter = require('./routes/wiki');
var express = require('express');

var swig = require('swig');
require('./filters/filters')(swig);

var app = express();
var bodyparser = require('body-parser');

app.set('view engine', 'html');
app.set('views', './views');
app.engine('html', swig.renderFile);

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

app.use(express.static('views'));

app.use('/wiki', wikiRouter);

app.listen(3000, function(){
	console.log("We're listening!");
});

// app.get('/', function(req, res, next) {
//   res.send('got to GET /wiki/');
// });

// app.post('/', function(req,res,next) {

// });
