var express = require('express');
var router = express.Router();

var models = require('../models');
var Page = models.Page;
var User = models.User;

var mongoose = require('mongoose');

module.exports = router;

function errHandler (err) { console.log(err); }

router.get('/', function(req, res, next) {
  Page.find({}).then(function(allPages){
  	res.render('index', {pages: allPages}); //second argument of res.render must be an object
  }).then(null, errHandler);
});

router.get('/add', function(req, res, next) {
  res.render('addpage');
});

router.get('/search', function(req, res, next){
  // fetch the queries and store in array
  if(req.query.search){
    var query = req.query.search;
    var search = Page.findByTag(query);
    search.then(function(results){res.render('index', {pages: results});});
  }else res.render('index');

});

router.get('/:urlTitle/similar', function(req, res, next) {
  Page.findOne({ 'urlTitle': req.params.urlTitle })
  .exec()
  .then(function(page){
    return page.findSimilarTypes();})
    .then(function(similar){
      res.render('index', {pages: similar});
    }).then(null, errHandler);
});

router.get('/:urlTitle', function(req, res, next){
  Page.findOne({ 'urlTitle': req.params.urlTitle })
	.exec()
	.then(function(page){
		res.render('wikipage', page);
	}).then(null, errHandler);
});

// post
router.post('/', function(req, res, next) {
  var page = new Page({
    title: req.body.title,
    urlTitle: "atitle",
    content: req.body.content,
    tags: req.body.tags.split(' ')
  });

  page.save().then(function(page){ 
  	res.redirect(page.route);
  }).then(null, function(err){ console.log(err); });
});

router.post('/add', function(req, res, next) {
  res.json(req.body);
});

