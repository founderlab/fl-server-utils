import _ from 'lodash'
const SQL_PROTOCOLS = ['mysql', 'mysql2', 'postgres', 'pg', 'sqlite', 'sqlite3']
const HTTP_PROTOCOLS = ['http', 'https']

export default function smartSync(dbUrl, Model) {
  const protocol = dbUrl.split(':')[0]
  if (protocol === 'mongodb') {
    return require('backbone-mongo').sync(Model)
  }
  else if (_.includes(SQL_PROTOCOLS, protocol)) {
    return require('fl-backbone-sql').sync(Model)
  }
  else if (_.includes(HTTP_PROTOCOLS, protocol) || dbUrl.match(/^\//)) {
    return require('backbone-http').sync(Model)
  }
  return require('backbone-orm').sync(Model)
}
