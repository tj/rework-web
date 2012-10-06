
/**
 * Module dependencies.
 */

var rework = require('rework')
  , bytes = require('bytes')
  , fs = require('fs');

/**
 * Prefixed properties.
 */

var props = [
  'animation',
  'animation-delay',
  'animation-direction',
  'animation-duration',
  'animation-fill-mode',
  'animation-iteration-count',
  'animation-name',
  'animation-play-state',
  'animation-timing-function',
  'appearance',
  'background-visibility',
  'background-clip',
  'background-composite',
  'background-origin',
  'background-size',
  'blend-mode',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'border-fit',
  'border-image',
  'border-radius',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-vertical-spacing',
  'box-align',
  'box-direction',
  'box-flex',
  'box-flex-group',
  'box-lines',
  'box-ordinal-group',
  'box-orient',
  'box-pack',
  'box-reflect',
  'box-shadow',
  'box-sizing',
  'clip-path',
  'flex',
  'flex-basis',
  'flex-direction',
  'flex-flow',
  'flex-grow',
  'flex-shrink',
  'flex-wrap',
  'flex-flow-from',
  'flex-flow-into',
  'font-smoothing',
  'transform',
  'transform-origin',
  'transform-origin-x',
  'transform-origin-y',
  'transform-origin-z',
  'transform-style',
  'transition',
  'transition-delay',
  'transition-duration',
  'transition-property',
  'transition-timing-function',
  'user-drag',
  'user-modify',
  'user-select',
  'wrap',
  'wrap-flow',
  'wrap-margin',
  'wrap-padding',
  'wrap-through'
];

// parse list

function list(str) {
  return str.split(/ *, */);
}

// prefix names

function prefix(names) {
  return names.map(function(name){
    return '-' + name + '-';
  });
}

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

  var vendors = list(req.query.vendors || 'o,ms,moz,webkit');
  console.log('vendors %j', vendors);
  console.log('reading %s', file.path);

  fs.readFile(file.path, 'utf8', function(err, css){
    if (err) return next(err);
    console.log('processing %s', bytes(css.length));

    var style = rework(css)
      .vendors(vendors)
      .use(rework.keyframes())
      .use(rework.prefixValue('transform'))
      .use(rework.prefix(props))
      .use(rework.at2x())

    if (~vendors.indexOf('-ms-')) {
      style.use(rework.opacity());
    }

    res.type('css');
    res.send(style.toString());
  });
};