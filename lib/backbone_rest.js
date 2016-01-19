'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = render;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _backboneOrm = require('backbone-orm');

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

  if (template.$raw) return template(json, options, callback);

  var models = _lodash2['default'].isArray(json) ? _lodash2['default'].map(json, function (model_json) {
    return new _this.model_type(_this.model_type.prototype.parse(model_json));
  }) : new this.model_type(this.model_type.prototype.parse(json));
  _backboneOrm.JSONUtils.renderTemplate(models, template, options, callback);
}

module.exports = exports['default'];