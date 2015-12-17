import _ from 'lodash'

export function addCORSHeaders(res, origins) {
  if (origins) res.set('Access-Control-Allow-Origin', origins)
  res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Disposition,Content-Type,Content-Description,Content-Range,X-CSRF-Token,Authorization')
  res.set('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, DELETE, OPTIONS')
  res.set('Access-Control-Allow-Credentials', 'true')
  return res
}

export function allowOrigins(app, paths_, origins) {
  const paths = _.isArray(paths) ? paths_ : [paths_]
  paths.forEach(path => app.all(path, allowOrigins(origins)))
}

export default function allow(origins) {
  return (req, res, next) => {
    addCORSHeaders(res, origins)
    if (req.method.toLowerCase() === 'options') return res.status(200).end()
    next()
  }
}
