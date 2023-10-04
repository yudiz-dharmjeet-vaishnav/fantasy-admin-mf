import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

import Loading from '../../../components/Loading'
import AlertMessage from '../../../components/AlertMessage'
import LoginHeader from '../../../components/LoginHeader'

import LoginBG from '../../../assets/images/login-bg.jpg'

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
      <div className='d-flex justify-content-between align-items-center'>
        <div className='login-section-img'>
          <img src={LoginBG} />
        </div>
        <div className='login-form-section'>
          <div className='login-section'>
            <div className="login-block ">
              <LoginHeader data={{
                title: 'Log In',
                description: 'Welcome to Fantasy App Admin Panel'
              }}
              />
              <div className='form-section'>
                {loading && <Loading />}
                <AlertMessage
                  close={close}
                  message={resMessage}
                  modalMessage={modalMessage}
                  status={status}
                />
                {tab === 1 && (
                  <Form onSubmit={authFlow === 'password' ? logIn : sendOtp}>
                    <FormGroup>
                      <Label className='match-edit-label' for='email'>Email</Label>
                      <Input
                        autoFocus
                        className={errEmail ? 'league-placeholder-error ' : 'league-placeholder'}
                        id='email'
                        name='email'
                        onChange={(e) => { handleChange(e, 'Email') }}
                        placeholder='Enter Your Email'
                        type='email'
                        value={email}
                      />
                      <p className='error-text'>{errEmail}</p>
                    </FormGroup>

                    {authFlow === 'password' && (
                      <FormGroup>
                        <Label className='match-edit-label' for='password'>Password</Label>
                        <Input
                          className={errPassword ? 'league-placeholder-error ' : 'league-placeholder'}
                          id='password'
                          name='password'
                          onChange={(e) => { handleChange(e, 'Password') }}
                          placeholder='Enter Your Password'
                          type='password'
                          value={password}
                        />
                        <p className='error-text'>{errPassword}</p>
                      </FormGroup>
                    )}
                    {authFlow === 'password' && (
                      <Button className='theme-btn-login full-btn' disabled={loading} type='submit'>
                        Login
                      </Button>
                    )}
                    <Button className='theme-btn-login full-btn mt-2' disabled={loading} type='submit'>
                      {authFlow === 'password' ? 'login' : 'Send OTP'}
                    </Button>
                  </Form>
                )}
                {tab === 2 && (
                  <Form onSubmit={verifyOtp}>
                    <FormGroup>
                      <Label className='match-edit-label' for='otp'>OTP</Label>
                      <div className='login-otp-input'>
                        <input autoComplete="off"
                          autoFocus
                          maxLength="1"
                          name="otp-number-1"
                          onChange={(e) => {
                            if (isNumber(Number(e.target.value)) && e.target.value >= 0) {
                              setinputValue1(e.target.value)
                            } else {
                              setinputValue1('')
                            }
                          }}
                          onInput={maxLengthCheck}
                          onKeyUp={e => handleKeyUp(e)}
                          tabIndex="1"
                          value={inputValue1}
                        />

                        <input autoComplete="off"
                          maxLength="1"
                          name="otp-number-2"
                          onChange={(e) => {
                            if (isNumber(Number(e.target.value)) && e.target.value >= 0) {
                              setinputValue2(e.target.value)
                            } else {
                              setinputValue2('')
                            }
                          }}
                          onInput={maxLengthCheck}
                          onKeyUp={e => handleKeyUp(e)}
                          tabIndex="2"
                          value={inputValue2}
                        />

                        <input autoComplete="off"
                          maxLength="1"
                          name="otp-number-3"
                          onChange={(e) => {
                            if (isNumber(Number(e.target.value)) && e.target.value >= 0) {
                              setinputValue3(e.target.value)
                            } else {
                              setinputValue3('')
                            }
                          }}
                          onInput={maxLengthCheck}
                          onKeyUp={e => handleKeyUp(e)}
                          tabIndex="3"
                          value={inputValue3}
                        />

                        <input autoComplete="off"
                          maxLength="1"
                          name="otp-number-4"
                          onChange={(e) => {
                            if (isNumber(Number(e.target.value)) && e.target.value >= 0) {
                              setinputValue4(e.target.value)
                            } else {
                              setinputValue4('')
                            }
                          }}
                          onInput={maxLengthCheck}
                          onKeyUp={e => handleKeyUp(e)}
                          tabIndex="4"
                          value={inputValue4}
                        />

                      </div>
                      <p className='error-text'>{errOtp}</p>
                    </FormGroup>

                    <Button className='theme-btn-login full-btn' disabled={loading} type='submit'>
                      Login
                    </Button>
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

LoginPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
}

export default LoginPage
