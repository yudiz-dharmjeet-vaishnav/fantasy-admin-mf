import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'

// Custom error page
const NotFound = () => {
  return (
    <div className='error-page'>
      <h2>404 | This page could not be found.</h2>
      <Button className="view" color='link' tag={Link} to='/'>Go back to dashboard</Button>
    </div>
  )
}

export default NotFound
