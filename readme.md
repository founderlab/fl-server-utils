# Helper functions for the server side of FounderLab apps

Changes: 

- 0.1.1: Added render, an ovveride for backbone-rest's render method. Use in controllers to enable raw templates
- 0.1.0: Yoinked things from fl-base-webapp


Render example:
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
