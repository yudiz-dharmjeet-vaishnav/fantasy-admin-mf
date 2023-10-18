import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import Navbar from './Navbar'
function Layout (props) {
  const { children } = props

  const [openCollapse, setOpenCollapse] = useState(false)
  const location = useLocation()

  return (
    <>
      <div className='main'>
        <div className='navbar-component'>
          <Navbar {...props} openCollapse={openCollapse} setOpenCollapse={setOpenCollapse} />
        </div>
        <div className={openCollapse ? 'side-open-component' : 'side-component'}>
          {location.pathname.includes('/base-team/') ? children({ openCollapse }) : children}
        </div>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.any
}
export default Layout
