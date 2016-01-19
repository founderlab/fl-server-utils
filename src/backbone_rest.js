import {JSONUtils} from 'backbone-orm'

export default function render(req, json, callback) {
  let template_name = req.query.$render || req.query.$template || this.default_template
  if (!template_name) return callback(null, json)
  try {template_name = JSON.parse(template_name)}
  catch (e) {} // eslint-disable-line

  const template = this.templates[template_name]
  if (!template) return callback(new Error(`Unrecognized template: ${template_name}`))

  const options = this.renderOptions ? this.renderOptions(req, template_name) : {}

  if (template.$raw) return template(json, options, callback)

  models = _.isArray(json) ? _.map(json, (model_json) => new this.model_type(this.model_type::parse(model_json))) : new this.model_type(this.model_type::parse(json))
  JSONUtils.renderTemplate(models, template, options, callback)
}
