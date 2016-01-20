import _ from 'lodash'
import {JSONUtils} from 'backbone-orm'

function stripRev(obj) {
  const final_obj = {}
  _.forEach(obj, (value, key) => {
    if (key !== '_rev') {
      final_obj[key] = _.isObject(value) ? stripRev(value) : value
    }
  })
  return final_obj
}

export default function render(req, json, callback) {
  let template_name = req.query.$render || req.query.$template || this.default_template
  if (!template_name) return callback(null, json)
  try {template_name = JSON.parse(template_name)}
  catch (e) {} // eslint-disable-line

  const template = this.templates[template_name]
  if (!template) return callback(new Error(`Unrecognized template: ${template_name}`))

  const options = this.renderOptions ? this.renderOptions(req, template_name) : {}

  if (template.$raw) {
    return template(json, options, (err, rendered_json) => {
      if (err) return callback(err)
      callback(null, stripRev(rendered_json))
    })
  }

  const models = _.isArray(json) ? _.map(json, (model_json) => new this.model_type(this.model_type.prototype.parse(model_json))) : new this.model_type(this.model_type.prototype.parse(json))
  JSONUtils.renderTemplate(models, template, options, callback)
}
