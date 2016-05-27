import _ from 'lodash'
import expect from 'expect'
import {smartSync} from '../src'

const MONGO_DATABASE_URL = 'mongodb://localhost:27017/fl-test'
const PG_DATABASE_URL = 'postgres://localhost:5432/fl-test'

describe('smartSync', () => {

  it('Requires the correct sync ', () => {
    expect(null).toEqual(null)
  })

})
