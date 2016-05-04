import _ from 'lodash'
import Queue from 'queue-async'
import path from 'path'
import React from 'react'
import {renderToString} from 'react-dom/server'
import createHistory from 'history/lib/createMemoryHistory'
import {Provider} from 'react-redux'
import {ReduxRouter} from 'redux-router'
import {reduxReactRouter, match} from 'redux-router/server'
import Helmet from 'react-helmet'
import {fetchComponentData} from 'fl-react-utils'

import {jsAssets, cssAssets} from './assets'

const sendError = (res, err) => {
  console.log(err)
  return res.status(500).send('Error loading initial state')
}

const defaults = {
  entries: ['shared', 'app'],
  webpack_assets_path: path.resolve(__dirname, '../../../webpack-assets.json'),
}

export default function createServerRenderer(_options) {
  const options = _.extend({}, defaults, _options)
  const {createStore, getRoutes, config={}} = options
  let always_fetch = options.always_fetch || []
  if (!_.isArray(always_fetch)) always_fetch = [always_fetch]
  if (!createStore) throw new Error('[fl-react-utils] createServerRenderer: Missing createStore from options')
  if (!getRoutes) throw new Error('[fl-react-utils] createServerRenderer: Missing getRoutes from options')

  return function app(req, res) {
    const queue = new Queue(1)

    const server_state = {
      auth: req.user ? {user: _.omit(req.user.toJSON(), 'password', '_rev')} : {},
    }
    if (options.loadInitialState) {
      queue.defer(callback => options.loadInitialState(req, (err, state) => {
        if (err) return callback(err)
        callback(null, _.merge(server_state, state))
      }))
    }
    if (_.isFunction(config)) {
      queue.defer(callback => config(req, (err, _config) => {
        if (err) return callback(err)
        callback(null, server_state.config = _config)
      }))
    }
    else {
      server_state.config = config
    }
    queue.await(err => {
      if (err) return sendError(res, err)

      const store = createStore(reduxReactRouter, getRoutes, createHistory, server_state)

      store.dispatch(match(req.originalUrl, (err, redirect_location, router_state) => {
        if (err) return sendError(res, err)
        if (redirect_location) return res.redirect(redirect_location.pathname + redirect_location.search)
        if (!router_state) return res.status(404).send('Not found')

        const components = _.uniq((always_fetch || {}).concat(router_state.components))

        fetchComponentData({store, components}, (err, fetch_result) => {
          if (err) return sendError(res, err)
          if (fetch_result.status) res.status(fetch_result.status)

          let initial_state = store.getState()

          // temp solution to rendering admin state
          // todo: make this better. don't include admin reducers / route unless requested
          if (options.omit) initial_state = _.omit(initial_state, options.omit)

          // https://github.com/rackt/redux-router/issues/106
          router_state.location.query = req.query

          const component = (
            <Provider store={store} key="provider">
              <ReduxRouter />
            </Provider>
          )

          const js = jsAssets(options.entries, options.webpack_assets_path)
          const script_tags = js.map(script => `<script type="application/javascript" src="${script}"></script>`).join('\n')

          const css = cssAssets(options.entries, options.webpack_assets_path)
          const css_tags = css.map(c => `<link rel="stylesheet" type="text/css" href="${c}">`).join('\n')

          const rendered = renderToString(component)
          const head = Helmet.rewind()

          const html = `
            <!DOCTYPE html>
            <html>
              <head>
                ${head.title}
                ${head.base}
                ${head.meta}
                ${head.link}
                ${head.script}

                ${css_tags}
                <script type="application/javascript">
                  window.__INITIAL_STATE__ = ${JSON.stringify(initial_state)}
                </script>
              </head>
              <body id="app">
                <div id="react-view">${rendered}</div>
                ${script_tags}
              </body>
            </html>
          `
          res.type('html').send(html)

        })
      }))
    })
  }
}
