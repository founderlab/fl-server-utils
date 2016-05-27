'use strict';

exports.__esModule = true;
exports['default'] = render;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _backboneOrm = require('backbone-orm');

function stripRev(obj) {
  if (_lodash2['default'].isArray(obj)) return _lodash2['default'].map(obj, function (o) {
    return stripRev(o);
  });
  if (_lodash2['default'].isObject(obj) && !(obj instanceof Date)) {
    var _ret = (function () {
      var final_obj = {};
      _lodash2['default'].forEach(obj, function (value, key) {
        if (key !== '_rev') final_obj[key] = stripRev(value);
      });
      return {
        v: final_obj
      };
    })();

    if (typeof _ret === 'object') return _ret.v;
  }
  return obj;
}

function render(req, json, callback) {
  var _this = this;

  var templateName = req.query.$render || req.query.$template || this.default_template;
  if (!templateName) return callback(null, json);
  try {
    templateName = JSON.parse(templateName);
  } catch (e) {} // eslint-disable-line

  var template = this.templates[templateName];
  if (!template) return callback(new Error('Unrecognized template: ' + templateName));

  var options = this.renderOptions ? this.renderOptions(req, templateName) : {};

  if (template.$raw) {
    return template(json, options, function (err, renderedJson) {
      if (err) return callback(err);
      callback(null, stripRev(renderedJson));
    });
  }

  var models = _lodash2['default'].isArray(json) ? _lodash2['default'].map(json, function (modelJson) {
    return new _this.model_type(_this.model_type.prototype.parse(modelJson));
  }) : new this.model_type(this.model_type.prototype.parse(json));
  _backboneOrm.JSONUtils.renderTemplate(models, template, options, callback);
}

module.exports = exports['default'];