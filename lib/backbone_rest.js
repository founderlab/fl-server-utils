'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = render;

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

  var template_name = req.query.$render || req.query.$template || this.default_template;
  if (!template_name) return callback(null, json);
  try {
    template_name = JSON.parse(template_name);
  } catch (e) {} // eslint-disable-line

  var template = this.templates[template_name];
  if (!template) return callback(new Error('Unrecognized template: ' + template_name));

  var options = this.renderOptions ? this.renderOptions(req, template_name) : {};

  if (template.$raw) {
    return template(json, options, function (err, rendered_json) {
      if (err) return callback(err);
      callback(null, stripRev(rendered_json));
    });
  }

  var models = _lodash2['default'].isArray(json) ? _lodash2['default'].map(json, function (model_json) {
    return new _this.model_type(_this.model_type.prototype.parse(model_json));
  }) : new this.model_type(this.model_type.prototype.parse(json));
  _backboneOrm.JSONUtils.renderTemplate(models, template, options, callback);
}

module.exports = exports['default'];