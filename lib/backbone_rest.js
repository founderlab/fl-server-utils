'use strict';

exports.__esModule = true;
exports['default'] = render;

var _backboneOrm = require('backbone-orm');

function render(req, json, callback) {
  var _context2,
      _this = this;

  var template_name = req.query.$render || req.query.$template || this.default_template;
  if (!template_name) return callback(null, json);
  try {
    template_name = JSON.parse(template_name);
  } catch (e) {} // eslint-disable-line

  var template = this.templates[template_name];
  if (!template) return callback(new Error('Unrecognized template: ' + template_name));

  var options = this.renderOptions ? this.renderOptions(req, template_name) : {};

  if (template.$raw) return template(json, options, callback);

  models = _.isArray(json) ? _.map(json, function (model_json) {
    var _context;

    return new _this.model_type((_context = _this.model_type, parse).call(_context, model_json));
  }) : new this.model_type((_context2 = this.model_type, parse).call(_context2, json));
  _backboneOrm.JSONUtils.renderTemplate(models, template, options, callback);
}

module.exports = exports['default'];