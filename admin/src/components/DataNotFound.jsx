import React from 'react'
import PropTypes from 'prop-types'

import notFound from '../assets/images/empty.svg'
function DataNotFound (props) {
  const { message, obj, notFoundClass } = props
  return (
    <>
      <div className={notFoundClass ? 'combination-bot-log' : 'data-not-found'}>
        <img alt="" src={notFound} />
        <p className='not-found-message'>{ Object.keys(obj)?.length > 0 ? 'No Result Found' : message + ' not available'}</p>
      </div>
    </>
  )
}

DataNotFound.propTypes = {
  message: PropTypes.string,
  obj: PropTypes.object,
  notFoundClass: PropTypes.string
}
export default DataNotFound
