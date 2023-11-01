import axios from 'axios'
import { CLEAR_ERROR_MSG, ERROR_MSG } from './actions/constants'
import { unAuthorized } from './helpers/helper'
import { store } from './Store'
import apiLogger from './api/apilogger'
import { getJWTToken } from './actions/auth'
import config from './config/config'

const instance = axios.create({
  baseURL: config.baseUrl
})

instance.interceptors.request.use((req) => {
  const token = localStorage.getItem('Token')
  if (!req.headers.Authorization && token && !req.headers.noAuth) {
    req.headers.Authorization = token
    return req
  }
  return req
}, (err) => Promise.reject(err))

let callAPI = true

async function fetchFailedAPIs (authData) {
  localStorage.setItem('Token', authData?.Authorization)
  localStorage.setItem('RefreshToken', authData?.RefreshToken)
  const loggedApiCalls = apiLogger.getApiCalls()
  const uniqueApiCalls = loggedApiCalls?.filter((item, index, arr) => {
    return arr.indexOf(item) === index
  })
  await Promise.all(
    uniqueApiCalls?.map(async (apiCall) => {
      const response = await instance({
        method: apiCall.method,
        url: apiCall.url,
        data: apiCall.data
      })
      return response
    })
  )
  callAPI = true
  apiLogger.clearApiCalls()
}
instance.interceptors.response.use(response => response, async (error) => {
  const apiData = error?.response?.config
  const RefreshToken = localStorage.getItem('RefreshToken')
  if ((error.response && error.response.status === 401) && (error?.response?.data?.message === 'Authentication failed. Please login again!')) {
    apiLogger.logApiCall(apiData?.method, apiData?.url, apiData?.data)
    if (apiData?.url === '/admin/auth/refresh-token/v1') {
      unAuthorized()
    } else if (callAPI) {
      callAPI = false
      const authData = await getJWTToken({ RefreshToken })
      if (authData) fetchFailedAPIs(authData)
      else unAuthorized()
    }
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
