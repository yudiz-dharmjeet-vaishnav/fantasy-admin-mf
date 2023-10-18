import React, { Fragment } from 'react'
import { UncontrolledAlert } from 'reactstrap'
import PropTypes from 'prop-types'

import successIcon from '../assets/images/success-icon.svg'
import alertIcon from '../assets/images/alert-icon.svg'

import { alertClass } from '../helpers/helper'

function AlertMessage (props) {
  const {
    message,
    modalMessage,
    status,
    close
  } = props
  return (
    <Fragment>
      {modalMessage && message && (
        <UncontrolledAlert className={alertClass(status, close)} color="primary">
          <div className='success-toast-div'>
            <div className={status ? 'success-box' : 'img-box'}>
              <img alt='alert' className='alert-icon' height="20px" src={status ? successIcon : alertIcon} width='20px' />
            </div>
            <div className='message'>
              <p className='m-0'>{message}</p>
            </div>
          </div>
        </UncontrolledAlert>
      )}
    </Fragment>
  )
}

AlertMessage.propTypes = {
  message: PropTypes.string,
  modalMessage: PropTypes.bool,
  status: PropTypes.bool,
  close: PropTypes.bool
}
export default AlertMessage
