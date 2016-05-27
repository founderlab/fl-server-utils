'use strict';

exports.__esModule = true;
exports.removeDirectoryAndExtension = removeDirectoryAndExtension;
exports.directoryFiles = directoryFiles;
exports.directoryModules = directoryModules;
exports.directoryFunctionModules = directoryFunctionModules;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cors = require('./cors');

var _cors2 = _interopRequireDefault(_cors);

var _createBasicAjax = require('./createBasicAjax');

var _createBasicAjax2 = _interopRequireDefault(_createBasicAjax);

var _render = require('./render');

var _render2 = _interopRequireDefault(_render);

var _smartSync = require('./smartSync');

var _smartSync2 = _interopRequireDefault(_smartSync);

exports.cors = _cors2['default'];
exports.createBasicAjax = _createBasicAjax2['default'];
exports.render = _render2['default'];
exports.stripRev = _render.stripRev;
exports.smartSync = _smartSync2['default'];

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

      var pathedFile = _path2['default'].join(directory, file);
      var stat = _fs2['default'].statSync(pathedFile);
      // a directory, process
      if (stat.isDirectory()) {
        processDirectory(pathedFile);
      } else {
        // a file, add to results
        results.push(pathedFile);
      }
    });
  }

  processDirectory(directory);
  return results;
}

function directoryModules(directory) {
  var results = {};
  directoryFiles(directory).forEach(function (file) {
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
  var allModules = directoryModules(directory);
  var functionModules = {};
  _lodash2['default'].keys(allModules).forEach(function (file) {
    var module = allModules[file]['default'] ? allModules[file]['default'] : allModules[file];
    if (_lodash2['default'].isFunction(module)) functionModules[file] = module;
  });
  return functionModules;
}