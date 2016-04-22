'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = createServerRenderer;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _queueAsync = require('queue-async');

var _queueAsync2 = _interopRequireDefault(_queueAsync);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDomServer = require('react-dom/server');

var _historyLibCreateMemoryHistory = require('history/lib/createMemoryHistory');

var _historyLibCreateMemoryHistory2 = _interopRequireDefault(_historyLibCreateMemoryHistory);

var _reactRedux = require('react-redux');

var _reduxRouter = require('redux-router');

var _reduxRouterServer = require('redux-router/server');

var _reactHelmet = require('react-helmet');

var _reactHelmet2 = _interopRequireDefault(_reactHelmet);

var _flReactUtils = require('fl-react-utils');

var _assets = require('./assets');

var sendError = function sendError(res, err) {
  console.log(err);
  return res.status(500).send('Error loading initial state');
};

var defaults = {
  entries: ['shared', 'app'],
  webpack_assets_path: _path2['default'].resolve(__dirname, '../../../webpack-assets.json')
};

function createServerRenderer(_options) {
  var options = _lodash2['default'].extend({}, defaults, _options);
  var createStore = options.createStore;
  var getRoutes = options.getRoutes;
  var _options$config = options.config;
  var config = _options$config === undefined ? {} : _options$config;

  var always_fetch = options.always_fetch || [];
  if (!_lodash2['default'].isArray(always_fetch)) always_fetch = [always_fetch];
  if (!createStore) throw new Error('[fl-react-utils] createServerRenderer: Missing createStore from options');
  if (!getRoutes) throw new Error('[fl-react-utils] createServerRenderer: Missing getRoutes from options');

  return function app(req, res) {
    var queue = new _queueAsync2['default'](1);

    var server_state = {
      auth: req.user ? { user: _lodash2['default'].omit(req.user.toJSON(), 'password', '_rev') } : {}
    };
    if (options.loadInitialState) {
      queue.defer(function (callback) {
        return options.loadInitialState(req, function (err, state) {
          if (err) return callback(err);
          callback(null, _lodash2['default'].merge(server_state, state));
        });
      });
    }
    if (_lodash2['default'].isFunction(config)) {
      queue.defer(function (callback) {
        return config(req, function (err, _config) {
          if (err) return callback(err);
          callback(null, server_state.config = _config);
        });
      });
    } else {
      server_state.config = config;
    }
    queue.await(function (err) {
      if (err) return sendError(res, err);

      var store = createStore(_reduxRouterServer.reduxReactRouter, getRoutes, _historyLibCreateMemoryHistory2['default'], server_state);

      store.dispatch(_reduxRouterServer.match(req.originalUrl, function (err, redirect_location, router_state) {
        if (err) return sendError(res, err);
        if (redirect_location) return res.redirect(redirect_location.pathname + redirect_location.search);
        if (!router_state) return res.status(404).send('Not found');

        var components = _lodash2['default'].uniq((always_fetch || {}).concat(router_state.components));
        _flReactUtils.fetchComponentData({ store: store, components: components }, function (err, fetch_result) {
          if (err) return sendError(res, err);
          if (fetch_result.status) res.status(fetch_result.status);

          var initial_state = store.getState();

          // temp solution to rendering admin state
          // todo: make this better. don't include admin reducers / route unless requested
          if (options.omit) initial_state = _lodash2['default'].omit(initial_state, options.omit);

          // https://github.com/rackt/redux-router/issues/106
          router_state.location.query = req.query;

          var component = _react2['default'].createElement(
            _reactRedux.Provider,
            { store: store, key: 'provider' },
            _react2['default'].createElement(_reduxRouter.ReduxRouter, null)
          );

          var js = _assets.jsAssets(options.entries, options.webpack_assets_path);
          var script_tags = js.map(function (script) {
            return '<script type="application/javascript" src="' + script + '"></script>';
          }).join('\n');

          var css = _assets.cssAssets(options.entries, options.webpack_assets_path);
          var css_tags = css.map(function (c) {
            return '<link rel="stylesheet" type="text/css" href="' + c + '">';
          }).join('\n');

          var rendered = _reactDomServer.renderToString(component);
          var head = _reactHelmet2['default'].rewind();

          var html = '\n            <!DOCTYPE html>\n            <html>\n              <head>\n                ' + head.title + '\n                ' + head.base + '\n                ' + head.meta + '\n                ' + head.link + '\n                ' + head.script + '\n\n                ' + css_tags + '\n                <script type="application/javascript">\n                  window.__INITIAL_STATE__ = ' + JSON.stringify(initial_state) + '\n                </script>\n              </head>\n              <body id="app">\n                <div id="react-view">' + rendered + '</div>\n                ' + script_tags + '\n              </body>\n            </html>\n          ';
          res.type('html').send(html);
        });
      }));
    });
  };
}

module.exports = exports['default'];