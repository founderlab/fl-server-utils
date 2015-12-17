'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.removeDirectoryAndExtension = removeDirectoryAndExtension;
exports.directoryFiles = directoryFiles;
exports.directoryModules = directoryModules;
exports.directoryFunctionModules = directoryFunctionModules;
exports.createBasicAjax = createBasicAjax;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var EXCLUDED_FILES = ['.DS_Store'];

function removeDirectoryAndExtension(file, directory) {
  var filename = file.replace(directory + '/', '');
  return filename.replace(_path2['default'].extname(filename), '');
}

function directoryFiles(directory) {
  var results = [];

  function processDirectory(directory) {
    if (!_fs2['default'].existsSync(directory)) return;
    _fs2['default'].readdirSync(directory).forEach(function (file) {
      if (file in EXCLUDED_FILES) return;

      var pathed_file = _path2['default'].join(directory, file);
      var stat = _fs2['default'].statSync(pathed_file);
      // a directory, process
      if (stat.isDirectory()) {
        processDirectory(pathed_file);
      } else {
        // a file, add to results
        results.push(pathed_file);
      }
    });
  }

  processDirectory(directory);
  return results;
}

function directoryModules(directory) {
  var results = {};
  files(directory).forEach(function (file) {
    try {
      results[removeDirectoryAndExtension(file, directory)] = require(file);
    } catch (err) {
      console.log(err);
    }
  });
  return results;
}

// Find all modules in a directory that have a class or function as their default export

function directoryFunctionModules(directory) {
  var results = modules(directory);
  _lodash2['default'].keys(results).forEach(function (file) {
    if (!_lodash2['default'].isFunction(results[file])) delete results[file];
  });
  return results;
}

// Implement ajax requests with superagent so that models using backbone-http can get their data when
// rendering on the server

function createBasicAjax(config) {
  return function basicAjax(options) {
    if (options.url.match(/^\//)) options.url = config.url + options.url;

    var req = (0, _superagent2['default'])(options.type, options.url);
    if (options.query) req.query(options.query);

    req.query({ $auth_secret: config.secret });

    req.end(function (err, res) {
      if ((err || !res.ok) && options.error) options.error(res || err);
      options.success(res.body);
    });
  };
}