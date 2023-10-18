import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

// Private Route Component

export const PrivateRoute = ({ children }) => {
  const location = useLocation()
  const token = useSelector((state) => state.auth.token)
  return (
    <>
      {
        token ? children : <Navigate to={`/auth/login?redirectTo=${location?.pathname}`} />
      }
    </>
  )
}

PrivateRoute.propTypes = {
  children: PropTypes.elementType
}

export default PrivateRoute
