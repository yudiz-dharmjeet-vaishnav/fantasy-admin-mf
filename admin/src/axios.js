import axios from 'axios'
import { CLEAR_ERROR_MSG, ERROR_MSG } from './actions/constants'
import { unAuthorized } from './helper'
import { store } from './Store'

function returnUrl (environment) {
  // if (environment === 'development' || environment === 'staging') {
  //   return `${environment === 'development' ? process.env.REACT_APP_AXIOS_BASE_URL_DEV : process.env.REACT_APP_AXIOS_BASE_URL_STAG}`
  // }
  return 'https://nodeback-dev.fantasywl.in/api'
}

const instance = axios.create({
  baseURL: returnUrl('development')
})

instance.interceptors.request.use((req) => {
  const token = localStorage.getItem('Token')
  if (!req.headers.Authorization && token && !req.headers.noAuth) {
    req.headers.Authorization = token
    return req
  }
  return req
}, (err) => Promise.reject(err))

instance.interceptors.response.use(response => response, (error) => {
  if ((error.response && error.response.status === 401) && (error?.response?.data?.message === 'Authentication failed. Please login again!')) {
    unAuthorized()
  } else if (error.response && error.response.status === 401) {
    store.dispatch({ type: CLEAR_ERROR_MSG })
    store.dispatch({
      type: ERROR_MSG,
      payload: {
        error: error?.response?.data?.message
      }
    })
  }
  return Promise.reject(error)
})

export default instance
