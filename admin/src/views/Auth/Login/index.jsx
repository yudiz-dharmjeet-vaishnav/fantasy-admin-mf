import React from 'react'

import LoginBG from '../../../assets/images/login-bg.jpg'

import LoginHeader from '../../../components/LoginHeader'
import LoginForm from './Login'

function Login (props) {
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
              <LoginForm {...props} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Login
