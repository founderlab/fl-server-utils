# Helper functions for the server side of FounderLab apps

#####backbone-rest render example:
```javascript
...
import {render} from 'fl-server-utils'

const detail = (applications, options, callback) => {
  // applications are a list of plain objects (not backbone models)
  callback(null, _.pick(applications, 'id'))
}
detail.$raw = true // flag it as raw

export default class ApplicationsController extends RestController {
  constructor(options) {
    super(options.app, _.defaults({
      model_type: Application,
      route: '/api/applications',
      auth: [...options.auth, createAuthMiddleware({canAccess})],
      templates: {
        detail: detail,
      },
      default_template: 'detail',
    }, options))
    // Overwrite the render method, making sure to bind it to the controller
    this.render = render.bind(this)
  }
}
```

#####createServerRenderer:
Helper method that takes care of a bunch of bs boilerplate for rendering react components server side. 
Usage: 

```javascript
app.get('*', createServerRenderer({
  createStore, 
  getRoutes,
  scripts: _.map(_.pick(require('../../webpack-assets.json'), ['shared.js', 'app']), entry => entry.js),
  omit: 'admin',
  always_fetch: require('../../shared/modules/app/containers/App'),
  config: _.pick(config, config.client_configKeys),
}))
```

Changes: 

- 0.2.2: added smartSync method for picking mongo/sql based on db connection string
- 0.2.0: createServerRenderer moved here from fl-react-utils
- 0.1.1: Added render, an ovveride for backbone-rest's render method. Use in controllers to enable raw templates
- 0.1.0: Yoinked things from fl-base-webapp
