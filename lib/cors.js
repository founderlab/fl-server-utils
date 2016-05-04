'use strict';

exports.__esModule = true;
exports.addCORSHeaders = addCORSHeaders;
exports.allowOrigins = allowOrigins;
exports['default'] = allow;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function addCORSHeaders(res, origins) {
  if (origins) res.set('Access-Control-Allow-Origin', origins);
  res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Disposition,Content-Type,Content-Description,Content-Range,X-CSRF-Token,Authorization');
  res.set('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Credentials', 'true');
  return res;
}

function allowOrigins(app, paths_, origins) {
  var paths = _lodash2['default'].isArray(paths) ? paths_ : [paths_];
  paths.forEach(function (path) {
    return app.all(path, allowOrigins(origins));
  });
}

function allow(origins) {
  return function (req, res, next) {
    addCORSHeaders(res, origins);
    if (req.method.toLowerCase() === 'options') return res.status(200).end();
    next();
  };
}