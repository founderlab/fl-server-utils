import expect from 'expect'
import {} from '../src'

const MONGO_DATABASE_URL = 'mongodb://localhost:27017/fl-test'
const PG_DATABASE_URL = 'postgres://localhost:5432/fl-test'

describe('index functions', () => {

  it('removeDirectoryAndExtension', () => {
    expect(null).toEqual(null)
  })

  it('directoryFiles', () => {
    expect(null).toEqual(null)
  })

  it('directoryModules', () => {
    expect(null).toEqual(null)
  })

  it('directoryFunctionModules', () => {
    expect(null).toEqual(null)
  })

  it('createBasicAjax', () => {
    expect(null).toEqual(null)
  })

  it('smartSync ', () => {
    expect(null).toEqual(null)
  })

})

// export function removeDirectoryAndExtension(file, directory) {
//   const filename = file.replace(`${directory}/`, '')
//   return filename.replace(path.extname(filename), '')
// }

// export function directoryFiles(directory) {
//   const results = []

//   function processDirectory(directory) {
//     if (!fs.existsSync(directory)) return
//     fs.readdirSync(directory).forEach(file => {
//       if (file in EXCLUDED_FILES) return

//       const pathedFile = path.join(directory, file)
//       const stat = fs.statSync(pathedFile)
//       // a directory, process
//       if (stat.isDirectory()) {
//         processDirectory(pathedFile)
//       }
//       else {
//          // a file, add to results
//         results.push(pathedFile)
//       }
//     })
//   }

//   processDirectory(directory)
//   return results
// }

// export function directoryModules(directory) {
//   const results = {}
//   directoryFiles(directory).forEach(file => {
//     try {
//       results[removeDirectoryAndExtension(file, directory)] = require(file)
//     }
//     catch (err) {
//       console.log(err)
//     }
//   })
//   return results
// }

// // Find all modules in a directory that have a class or function as their default export
// export function directoryFunctionModules(directory) {
//   const allModules = directoryModules(directory)
//   const functionModules = {}
//   _.keys(allModules).forEach(file => {
//     const module = allModules[file].default ? allModules[file].default : allModules[file]
//     if (_.isFunction(module)) functionModules[file] = module
//   })
//   return functionModules
// }

// // Implement ajax requests with superagent so that models using backbone-http can get their data when
// // rendering on the server
// export function createBasicAjax(config) {
//   return function basicAjax(options) {
//     if (options.url.match(/^\//)) options.url = (config.internalUrl || 'http://localhost') + options.url

//     const req = request(options.type, options.url)
//     if (options.query) req.query(options.query)

//     req.query({$auth_secret: config.secret})

//     req.end((err, res) => {
//       if ((err || !res.ok) && options.error) return options.error(res || err)
//       options.success(res.body)
//     })
//   }
// }

// export function smartSync(dbUrl, Model) {
//   const backend = dbUrl.split(':')[0]
//   if (backend === 'mongodb') {
//     return require('backbone-mongo').sync(Model)
//   }
//   return require('fl-backbone-sql').sync(Model)
// }
