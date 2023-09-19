import React from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

import Loading from '../../components/Loading'
import AlertMessage from '../../components/AlertMessage'
import LoginHeader from '../../components/LoginHeader'

import LoginBG from '../../assets/images/login-bg.jpg'

function Login(props) {
  const {
    loading,

    close, resMessage, modalMessage, status,

    tab, authFlow, logIn, sendOtp,

    errEmail, errOtp, handleChange, email, errPassword, password,

    verifyOtp, isNumber, setinputValue1, inputValue1, maxLengthCheck, handleKeyUp,

    inputValue2, setinputValue2, inputValue3, setinputValue3, inputValue4, setinputValue4
  } = props

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

export default Login