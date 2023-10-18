import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'reactstrap'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import backIcon from '../../../../assets/images/back-icon-1.svg'

function MainHeader (props) {
  const {
    cancelLink,
    onAdd,
    updateDisableButton,
    isCreate
  } = props
  // fordisplay submit button text
  function button () {
    if (isCreate) {
      return 'Create League'
    }
    return 'Save League Changes'
  }

  // fordisplay heading text
  function heading () {
    if (isCreate) {
      return 'Add League'
    }
    return 'Edit League'
  }

  const navigate = useNavigate()
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const Auth = useSelector((state) => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector((state) => state.auth.adminPermission)

  return (
    <>
      <div className="add-leauge title d-flex justify-content-between align-items-center fdc-480 align-start-480">
        <div className="d-flex">
          <img
            className="custom-go-back"
            height="24"
            onClick={() => navigate(`${cancelLink}${page?.League || ''}`)}
            src={backIcon}
            width="24"
          />
          <h2 className="ml-2">{heading()}</h2>
        </div>
        <div className="btn-list-user text-center">
          <Button className='theme-btn-cancel' tag={Link} to={`${cancelLink}${page?.League || ''}`}>Cancel</Button>
          {((Auth && Auth === 'SUPER') || adminPermission?.LEAGUE !== 'R') && (
            <Button className="theme-btn-league" disabled={updateDisableButton} onClick={onAdd}>
              {button()}
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
MainHeader.propTypes = {
  cancelLink: PropTypes.string,
  onAdd: PropTypes.func,
  updateDisableButton: PropTypes.bool,
  isCreate: PropTypes.bool

}
export default MainHeader
