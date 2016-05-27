'use strict';

exports.__esModule = true;
exports.addCORSHeaders = addCORSHeaders;
exports['default'] = cors;
exports.allowOrigin = allowOrigin;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function addCORSHeaders(res, origin) {
  if (origin) res.set('Access-Control-Allow-Origin', origin);
  res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Disposition,Content-Type,Content-Description,Content-Range,X-CSRF-Token,Authorization');
  res.set('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Credentials', 'true');
  return res;
}

function cors(origin) {
  return function (req, res, next) {
    addCORSHeaders(res, origin);
    if (req.method.toLowerCase() === 'options') return res.status(200).end();
    next();
  };
}

function allowOrigin(app, paths_, origin) {
  var paths = _lodash2['default'].isArray(paths) ? paths_ : [paths_];
  paths.forEach(function (path) {
    return app.all(path, allow(origin));
  });
}