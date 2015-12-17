import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import request from 'superagent'

const EXCLUDED_FILES = ['.DS_Store']

export function removeDirectoryAndExtension(file, directory) {
  const filename = file.replace(`${directory}/`, '')
  return filename.replace(path.extname(filename), '')
}

export function directoryFiles(directory) {
  const results = []

  function processDirectory(directory) {
    if (!fs.existsSync(directory)) return
    fs.readdirSync(directory).forEach(file => {
      if (file in EXCLUDED_FILES) return

      const pathed_file = path.join(directory, file)
      const stat = fs.statSync(pathed_file)
      // a directory, process
      if (stat.isDirectory()) {
        processDirectory(pathed_file)
      }
      else {
         // a file, add to results
        results.push(pathed_file)
      }
    })
  }

  processDirectory(directory)
  return results
}

export function directoryModules(directory) {
  const results = {}
  files(directory).forEach(file => {
    try {
      results[removeDirectoryAndExtension(file, directory)] = require(file)
    }
    catch (err) {
      console.log(err)
    }
  })
  return results
}

// Find all modules in a directory that have a class or function as their default export
export function directoryFunctionModules(directory) {
  const results = modules(directory)
  _.keys(results).forEach(file => {
    if (!_.isFunction(results[file])) delete results[file]
  })
  return results
}

// Implement ajax requests with superagent so that models using backbone-http can get their data when
// rendering on the server
export default function basicAjax(config) {
  return function basicAjax(options) {
    if (options.url.match(/^\//)) options.url = config.url + options.url

    const req = request(options.type, options.url)
    if (options.query) req.query(options.query)

    req.query({$auth_secret: config.secret})

    req.end((err, res) => {
      if ((err || !res.ok) && options.error) options.error(res || err)
      options.success(res.body)
    })
  }
}
