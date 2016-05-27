'use strict';

exports.__esModule = true;
exports['default'] = smartSync;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var SQL_PROTOCOLS = ['mysql', 'mysql2', 'postgres', 'pg', 'sqlite', 'sqlite3'];
var HTTP_PROTOCOLS = ['http', 'https'];

function smartSync(dbUrl, Model) {
  var protocol = dbUrl.split(':')[0];
  if (protocol === 'mongodb') {
    return require('backbone-mongo').sync(Model);
  } else if (_lodash2['default'].includes(SQL_PROTOCOLS, protocol)) {
    return require('fl-backbone-sql').sync(Model);
  } else if (_lodash2['default'].includes(HTTP_PROTOCOLS, protocol) || dbUrl.match(/^\//)) {
    return require('backbone-http').sync(Model);
  }
  return require('backbone-orm').sync(Model);
}

module.exports = exports['default'];