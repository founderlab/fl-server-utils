import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import request from 'superagent'
import render from './backbone_rest'
import createServerRenderer from './createServerRenderer'

export {render, createServerRenderer}

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
  directoryFiles(directory).forEach(file => {
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
  const all_modules = directoryModules(directory)
  const function_modules = {}
  _.keys(all_modules).forEach(file => {
    const module = all_modules[file].default ? all_modules[file].default : all_modules[file]
    if (_.isFunction(module)) function_modules[file] = module
  })
  return function_modules
}

// Implement ajax requests with superagent so that models using backbone-http can get their data when
// rendering on the server
export function createBasicAjax(config) {
  return function basicAjax(options) {
    if (options.url.match(/^\//)) options.url = (config.internal_url || 'http://localhost') + options.url

    const req = request(options.type, options.url)
    if (options.query) req.query(options.query)

    req.query({$auth_secret: config.secret})

    req.end((err, res) => {
      if ((err || !res.ok) && options.error) return options.error(res || err)
      options.success(res.body)
    })
  }
}

export function smartSync(db_url, Model) {
  const backend = db_url.split(':')[0]
  if (backend === 'mongodb') {
    return require('backbone-mongo').sync(Model)
  }
  return require('backbone-sql').sync(Model)
}
