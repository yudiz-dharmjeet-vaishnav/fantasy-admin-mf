import React from 'react'
import PropTypes from 'prop-types'

const LoginHeader = (props) => {
  const { data } = props
  return (
    <div className="login-header d-flex justify-content-between align-items-center">
      <div>
        <h2 className='login-h2'>{data.title}</h2>
        <p className="login-p mb-0 mt-2">{data.description}</p>
      </div>
    </div>
  )
}

LoginHeader.propTypes = {
  data: PropTypes.object
}

export default LoginHeader
