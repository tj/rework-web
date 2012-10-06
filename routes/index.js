
/**
 * Module dependencies.
 */

var rework = require('rework')
  , bytes = require('bytes')
  , fs = require('fs');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

/**
 * POST .file.
 */

exports.process = function(req, res, next){
  var file = req.files.style;
  if (!file) return res.send(400, '"style" required, try `curl -F style=@my.css`');
  console.log('reading %s', file.path);
  fs.readFile(file.path, 'utf8', function(err, css){
    if (err) return next(err);
    console.log('processing %s', bytes(css.length));

  });
};