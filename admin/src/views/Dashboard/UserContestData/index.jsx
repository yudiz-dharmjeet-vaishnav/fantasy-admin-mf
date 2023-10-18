import React, { useState } from 'react'
import { Row, Col, CustomInput } from 'reactstrap'
import PropTypes from 'prop-types'
import { formatCompactNumber } from '../../../helpers/helper'
function UserContestData ({ dashBoardData }) {
  const [dayFilter, setDayFilter] = useState('month')

  function onFiltering (event) {
    setDayFilter(event.target.value)
  }
  return (
    <>
      <div className='common-box-dashboard mb-3'>
        <div className='user-played-heading'>
          <h3 >User Played Contest Data</h3>
          <CustomInput
            className='day-filter'
            id="sPlatform"
            name="sPlatform"
            onChange={(event) => onFiltering(event)}
            type="select"
            value={dayFilter}
          >
            <option value="today">Today</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </CustomInput>
        </div>
        <div className='dashboard-contest-data'>
          <Row className='user-detail-row'>
            <Col className='total-winning-col' md={6} xl={6}>
              <div className='total-winning-box'>
                <div className='common-box-dashboard-div'>
                  <p className='text-label'><span> Total Winning </span></p>
                  <h2 className='dashboard-heading mb-0 mt-3'>
                    {' '}
                    ₹
                    {' '}
                    {dayFilter === 'today' ? formatCompactNumber(dashBoardData?.oWinning?.nToday) : dayFilter === 'week' ? formatCompactNumber(dashBoardData?.oWinning?.nWeek) : formatCompactNumber(dashBoardData?.oWinning?.nMonth)}
                    {' '}
                  </h2>
                </div>
              </div>
            </Col>
            <Col className='total-losing-col' md={6} xl={6}>
              <div className='total-losing-box'>
                <div className='common-box-dashboard-div'>
                  <p className='text-label'>
                    {' '}
                    <span>Total Loss </span>
                  </p>
                  <h2 className='dashboard-heading mb-0 mt-3'>
                    ₹
                    {' '}
                    { dayFilter === 'today' ? formatCompactNumber(dashBoardData?.oLoss?.nToday) : dayFilter === 'week' ? formatCompactNumber(dashBoardData?.oLoss?.nWeek) : formatCompactNumber(dashBoardData?.oLoss?.nMonth)}
                    {' '}
                  </h2>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}
UserContestData.propTypes = {
  dashBoardData: PropTypes.object
}
export default UserContestData
