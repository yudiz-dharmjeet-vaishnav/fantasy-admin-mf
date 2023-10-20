import { combineReducers } from 'redux'
import auth from './auth'
import account from './account'
import permission from './permission'
import subadmin from './subadmin'
import feedback from './feedback'
import dashboard from './dashboard'
import role from './role'
import sidebarcollapse from './sidebarcollapse'
import url from './url'
import users from './users'

export default combineReducers({
  users,
  url,
  account,
  auth,
  permission,
  subadmin,
  feedback,
  dashboard,
  role,
  sidebarcollapse
})
