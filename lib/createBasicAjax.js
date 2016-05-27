'use strict';

exports.__esModule = true;
exports['default'] = createBasicAjax;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

// Implement ajax requests with superagent so that models using backbone-http can get their data when
// rendering on the server

function createBasicAjax(config) {
  return function basicAjax(options) {
    if (options.url.match(/^\//)) options.url = (config.internalUrl || 'http://localhost') + options.url;

    var req = _superagent2['default'](options.type, options.url);
    if (options.query) req.query(options.query);

    req.query({ $auth_secret: config.secret });

    req.end(function (err, res) {
      if ((err || !res.ok) && options.error) return options.error(res || err);
      options.success(res.body);
    });
  };
}

module.exports = exports['default'];