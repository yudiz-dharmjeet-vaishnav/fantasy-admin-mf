import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import qs from 'query-string'

// Public Route Component
export const PublicRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token)

  const querySearch = qs.parse(history?.location?.search)
  const redirectTo =
          location.pathname.includes('/auth') || location.pathname === '/'
            ? querySearch.redirectTo || '/dashboard'
            : location.pathname

  if (token && localStorage.getItem('email')) {
    localStorage.removeItem('email')
  }

  return (
    <>
      {
      token ? <Navigate to={redirectTo} /> : children
    }
    </>

  )
}

PublicRoute.propTypes = {
  children: PropTypes.elementType
}

export default PublicRoute
