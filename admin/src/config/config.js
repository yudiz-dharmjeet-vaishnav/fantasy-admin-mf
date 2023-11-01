import prod from './prod.js'
import stag from './stag.js'
import dev from './dev.js'

let environment
console.log('process.env.REACT_APP_ENVIRONMENT', process.env.REACT_APP_ENVIRONMENT)
if (process.env.REACT_APP_ENVIRONMENT === 'production') {
  environment = prod
} else if (process.env.REACT_APP_ENVIRONMENT === 'staging') {
  environment = stag
} else {
  environment = dev
}

export default environment
