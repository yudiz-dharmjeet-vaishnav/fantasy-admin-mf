import axios from '../axios'
// import { history } from '../App'
import { encryption } from '../helper'
import { CLEAR_AUTH_PROPS, CLEAR_AUTH_RESPONSE, CLEAR_MESSAGE, LOGIN, LOGIN_OTP, LOGOUT, RESET_PASSWORD, SEND_OTP } from './constants'

const errMsg = 'Server is unavailable.'

const login = (email, password) => async (dispatch) => {
  dispatch({ type: CLEAR_AUTH_RESPONSE })
  const Password = encryption(password)
  await axios.post('/admin/auth/login/v2', {
    sLogin: email,
    sPassword: Password
  }).then((response) => {
    const userData = response.data && response.data.data
    const obj = {}
    localStorage.setItem('Token', response.data.Authorization)
    localStorage.setItem('adminData', JSON.stringify(response.data.data))
    userData && userData.aRole && userData.aRole && userData.aRole.map((item) => {
      item.aPermissions.map(permission => {
        if (obj[permission.sKey]) {
          if (permission.eType === 'W' && (obj[permission.sKey] === 'R' || obj[permission.sKey] === 'N')) {
            obj[permission.sKey] = 'W'
          } else if (permission.eType === 'R' && obj[permission.sKey] === 'W') {
            obj[permission.sKey] = 'W'
          } else if (permission.eType === 'R' && obj[permission.sKey] === 'N') {
            obj[permission.sKey] = 'R'
          } else if (permission.eType === 'N' && obj[permission.sKey] === 'W') {
            obj[permission.sKey] = 'W'
          } else if (permission.eType === 'N' && obj[permission.sKey] === 'R') {
            obj[permission.sKey] = 'R'
          } else {
            obj[permission.sKey] = 'N'
          }
        } else {
          obj[permission.sKey] = permission.eType
        }
        return obj
      })
      return item
    })
    localStorage.setItem('adminPermission', JSON.stringify(obj))
    dispatch({
      type: LOGIN,
      payload: {
        token: response.data.Authorization,
        data: response.data.data,
        permission: obj,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: LOGIN,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

const loginOtp = (email) => async (dispatch) => {
  dispatch({ type: CLEAR_AUTH_RESPONSE })
  await axios.post('/admin/auth/login/v4', {
    sLogin: email
  }).then((response) => {
    dispatch({
      type: LOGIN_OTP,
      payload: {
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: LOGIN_OTP,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

const verifyLoginOtp = (email, sAuth, sType, otp, longitude, latitude) => async (dispatch) => {
  dispatch({ type: CLEAR_AUTH_RESPONSE })
  await axios.post('/admin/auth/verify-otp/v2', {
    sLogin: email,
    sAuth: sAuth,
    sType: sType,
    sCode: otp,
    sLongitude: longitude,
    sLatitude: latitude
  }).then((response) => {
    const userData = response.data && response.data.data
    const obj = {}
    localStorage.setItem('Token', response.data.Authorization)
    localStorage.setItem('adminData', JSON.stringify(response.data.data))
    userData && userData.aRole && userData.aRole && userData.aRole.map((item) => {
      item.aPermissions.map(permission => {
        if (obj[permission.sKey]) {
          if (permission.eType === 'W' && (obj[permission.sKey] === 'R' || obj[permission.sKey] === 'N')) {
            obj[permission.sKey] = 'W'
          } else if (permission.eType === 'R' && obj[permission.sKey] === 'W') {
            obj[permission.sKey] = 'W'
          } else if (permission.eType === 'R' && obj[permission.sKey] === 'N') {
            obj[permission.sKey] = 'R'
          } else if (permission.eType === 'N' && obj[permission.sKey] === 'W') {
            obj[permission.sKey] = 'W'
          } else if (permission.eType === 'N' && obj[permission.sKey] === 'R') {
            obj[permission.sKey] = 'R'
          } else {
            obj[permission.sKey] = 'N'
          }
        } else {
          obj[permission.sKey] = permission.eType
        }
        return obj
      })
      return item
    })
    localStorage.setItem('adminPermission', JSON.stringify(obj))
    dispatch({
      type: LOGIN,
      payload: {
        token: response.data.Authorization,
        data: response.data.data,
        permission: obj,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: LOGIN,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

const logout = token => async (dispatch) => {
  await axios.put('/admin/auth/logout/v1', {}, { headers: { Authorization: token } }).then(async (response) => {
    localStorage.removeItem('Token')
    localStorage.removeItem('adminData')
    localStorage.removeItem('adminPermission')
    // history.push('/admin/auth/login')
    dispatch({ type: CLEAR_AUTH_PROPS })
    dispatch({
      type: LOGOUT,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: LOGOUT,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

const sendOtp = sLogin => async (dispatch) => {
  dispatch({ type: CLEAR_MESSAGE })
  await axios.post('/admin/auth/send-otp/v1', { sLogin }).then((response) => {
    dispatch({
      type: SEND_OTP,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: SEND_OTP,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

const resetPassword = (token, password) => async (dispatch) => {
  dispatch({ type: CLEAR_MESSAGE })
  await axios.post('/admin/auth/reset-password/v1', {
    sToken: token,
    sNewPassword: password
  }).then((response) => {
    dispatch({
      type: RESET_PASSWORD,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: RESET_PASSWORD,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export { login, loginOtp, verifyLoginOtp, logout, sendOtp, resetPassword }
