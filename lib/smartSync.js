'use strict';

exports.__esModule = true;
exports.selectModule = selectModule;
exports['default'] = smartSync;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var SQL_PROTOCOLS = ['mysql', 'mysql2', 'postgres', 'pg', 'sqlite', 'sqlite3'];
var HTTP_PROTOCOLS = ['http', 'https'];

function selectModule(dbUrl) {
  if (!dbUrl) {
    console.error('[fl-server-utils] selectModule: No dbUrl provided, got', dbUrl);
    return null;
  }

  var protocol = dbUrl.split(':')[0];
  if (protocol === 'mongodb') {
    return 'backbone-mongo';
  } else if (_lodash2['default'].includes(SQL_PROTOCOLS, protocol)) {
    return 'fl-backbone-sql';
  } else if (_lodash2['default'].includes(HTTP_PROTOCOLS, protocol) || dbUrl.match(/^\//)) {
    return 'backbone-http';
  }
  return 'backbone-orm';
}

function smartSync(dbUrl, Model) {
  if (!dbUrl) {
    console.error('[fl-server-utils] smartSync: No dbUrl provided, got', arguments);
    return null;
  }
  return require(selectModule(dbUrl)).sync(Model);
}