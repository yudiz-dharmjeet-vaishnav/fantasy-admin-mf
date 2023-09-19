import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import Login from 'ui/pages/Login'

import { login, loginOtp, verifyLoginOtp } from '../../../actions/auth'
import { verifyEmail, verifyPassword, verifyLength, isNumber, modalMessageFunc } from '../../../helper'

// Login form

function LoginPage () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const [errEmail, setErrEmail] = useState('')
  const [errOtp, setErrOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(false)
  const [modalMessage, setModalMessage] = useState(true)
  const [close, setClose] = useState(false)
  const [tab, setTab] = useState(1)
  const [inputValue1, setinputValue1] = useState('')
  const [inputValue2, setinputValue2] = useState('')
  const [inputValue3, setinputValue3] = useState('')
  const [inputValue4, setinputValue4] = useState('')
  const [position, setPosition] = useState(null)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const resStatus = useSelector((state) => state.auth.resStatus)
  const resMessage = useSelector((state) => state.auth.resMessage)
  const authFlow = 'otp'

  useEffect(() => {
    if (localStorage.getItem('email')) {
      setEmail(JSON.parse(localStorage.getItem('email')))
    }
    if (location.state) {
      setModalMessage(true)
      navigate(location.pathname)
    }
  }, [])

  useEffect(() => {
    if (resMessage) {
      setLoading(false)
      setStatus(resStatus)
      setModalMessage(true)
    }
    if (resStatus) {
      setTab(2)
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    // Function to get the geolocation
    const getGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setPosition(position.coords)
          },
          (error) => {
            console.error('Error getting geolocation:', error)
          }
        )
      } else {
        console.error('Geolocation is not supported by this browser.')
      }
    }

    getGeolocation()
  }, [])

  function handleChange (event, type) {
    switch (type) {
      case 'Email':
        if (
          verifyLength(event.target.value, 1) &&
          verifyEmail(event.target.value)
        ) {
          setErrEmail('')
        } else if (!verifyLength(event.target.value, 1)) {
          setErrEmail('Required field')
        } else {
          setErrEmail('Invalid email')
        }
        setEmail(event.target.value)
        break
      case 'Password':
        if (verifyPassword(event.target.value)) {
          setErrPassword('')
        } else {
          setErrPassword(
            'Must contain minimum 5 characters and maximum 14 characters'
          )
        }
        setPassword(event.target.value)
        break
      default:
        break
    }
  }

  function logIn (e) {
    e.preventDefault()
    if (
      verifyLength(email, 1) &&
      verifyLength(password, 1) &&
      verifyEmail(email) &&
      verifyPassword(password)
    ) {
      setLoading(true)
      dispatch(login(email, password))
    } else {
      if (!verifyLength(email, 1)) {
        setErrEmail('Required field')
      }
      if (!verifyLength(password, 1)) {
        setErrPassword('Required field')
      }
    }
  }

  function sendOtp (e) {
    e.preventDefault()
    if (
      verifyLength(email, 1) &&
      verifyEmail(email)
    ) {
      dispatch(loginOtp(email))
    } else {
      if (!verifyLength(email, 1)) {
        setErrEmail('Required field')
      }
    }
  }

  function verifyOtp (e) {
    e.preventDefault()
    const otpvalue = inputValue1 + inputValue2 + inputValue3 + inputValue4
    const latitude = position?.latitude
    const longitude = position?.longitude
    if (otpvalue && verifyLength(otpvalue, 4)) {
      setLoading(true)
      dispatch(verifyLoginOtp(email, 'L', 'E', otpvalue, longitude, latitude))
    } else {
      if (!verifyLength(otpvalue, 4)) {
        setErrOtp('Required field')
      }
    }
  }

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength)
    }
  }

  function handleKeyUp (event) {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      const next = event.target.tabIndex - 2
      if (next > -1) {
        if ((next === 0 && inputValue2 === '') || (next === 1 && inputValue3 === '') || (next === 2 && inputValue4 === '')) {
          next === 0 && setinputValue1('')
          next === 1 && setinputValue2('')
          next === 2 && setinputValue3('')
          next === 3 && setinputValue4('')
          event.target.form.elements[next].focus()
        }
      }
    } else {
      const next = event.target.tabIndex
      if (next < 4) {
        if ((next === 1 && inputValue1 !== '') || (next === 2 && inputValue2 !== '') || (next === 3 && inputValue3 !== '') || (next === 4 && inputValue4 !== '')) {
          event.target.form.elements[next].focus()
        }
      }
    }
  }

  return (
    <>
    <Login
      loading={loading}
      close={close}
      resMessage={resMessage}
      modalMessage={modalMessage}
      status={status}
      tab={tab}
      authFlow={authFlow}
      logIn={logIn}
      sendOtp={sendOtp}
      errEmail={errEmail}
      errOtp={errOtp}
      handleChange={handleChange}
      email={email}
      errPassword={errPassword}
      password={password}
      verifyOtp={verifyOtp}
      isNumber={isNumber}
      setinputValue1={setinputValue1}
      inputValue1={inputValue1}
      maxLengthCheck={maxLengthCheck}
      handleKeyUp={handleKeyUp}
      inputValue2={inputValue2}
      setinputValue2={setinputValue2}
      inputValue3={inputValue3}
      setinputValue3={setinputValue3}
      inputValue4={inputValue4}
      setinputValue4={setinputValue4}
    />
    </>
  )
}

LoginPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
}

export default LoginPage
