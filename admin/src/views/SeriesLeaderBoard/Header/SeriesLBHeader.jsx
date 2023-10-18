import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'reactstrap'
import PropTypes from 'prop-types'

import backIcon from '../../../assets/images/back-icon-1.svg'
import addlIcon from '../../../assets/images/add-white-icon.svg'

// Common header for series leader board tab
function SeriesLBHeader (props) {
  const {
    heading, seriesLBCategoryLink, addPrizeBreakup
  } = props

  const navigate = useNavigate()

  return (
    <div className="seriesleader-ship">
      <div className="filter-block d-flex justify-content-between align-items-start">
        <div className='d-inline-flex align-items-center'>
          {seriesLBCategoryLink && <img className='custom-go-back ml-3' height='20' onClick={() => navigate(`${seriesLBCategoryLink}`)} src={backIcon} width='20' />}
          <h2 className='ml-3'>{heading}</h2>
        </div>
      </div>
      <div className="text-right text-align-left-480">
        <div className="btn-list">
          {props.buttonText && props.permission && props.addButton && (
          <Button className="theme-btn icon-btn ml-2" onClick={() => addPrizeBreakup()}>
            <img alt="add" src={addlIcon} />
            {props.buttonText}
          </Button>
          )}
        </div>
      </div>
    </div>
  )
}

SeriesLBHeader.propTypes = {
  heading: PropTypes.string,
  seriesLBCategoryLink: PropTypes.string,
  buttonText: PropTypes.string,
  permission: PropTypes.bool,
  addPrizeBreakup: PropTypes.func,
  addButton: PropTypes.bool
}

export default SeriesLBHeader
