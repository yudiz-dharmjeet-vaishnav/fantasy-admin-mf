import React, { useState } from 'react'
import { Row, Col, CustomInput } from 'reactstrap'
import PropTypes from 'prop-types'
function DepositDetails ({ dashBoardData }) {
  const [dayFilter, setDayFilter] = useState('month')

  function onFiltering (event) {
    setDayFilter(event.target.value)
  }
  return (
    <>
      <div className='dashboard-deposit'>
        <div className='deposit-heading'>
          <h3 className='mb-0 '>Deposits Details</h3>
          <CustomInput
            className='day-filter'
            id="dayFilter"
            name="dayFilter"
            onChange={(event) => onFiltering(event)}
            type="select"
            value={dayFilter}
          >
            <option value="today">Today</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </CustomInput>
        </div>
        <Row className='dashboard-row'>
          <Col className='deposit-col' md={6} xl={3}>
            <div className='common-box-dashboard'>
              <div className='common-box-dashboard-div'>
                <p className='text-label-deposit'>
                  {' '}
                  <span> Total Deposits </span>
                </p>
                <h2 className='dashboard-heading mb-0'>
                  {' '}
                  {dayFilter === 'today' ? dashBoardData?.oDeposit?.nToday.toString().includes('.') ? dashBoardData?.oDeposit?.nToday.toFixed(2) : dashBoardData?.oDeposit?.nToday : dayFilter === 'week' ? dashBoardData?.oDeposit?.nWeek.toString().includes('.') ? dashBoardData?.oDeposit?.nWeek.toFixed(2) : dashBoardData?.oDeposit?.nWeek : dashBoardData?.oDeposit?.nMonth.toString().includes('.') ? dashBoardData?.oDeposit?.nMonth.toFixed(2) : dashBoardData?.oDeposit?.nMonth}
                  {' '}
                </h2>
              </div>
            </div>
          </Col>
          <Col className='withdraw-col' md={6} xl={3}>
            <div className='common-box-dashboard'>
              <div className='common-box-dashboard-div'>
                <p className='text-label-withdraw'>
                  {' '}
                  <span> Total Withdraw </span>
                </p>
                <h2 className='dashboard-heading mb-0'>
                  {' '}
                  {dayFilter === 'today' ? dashBoardData?.oWithdraw?.nToday.toString().includes('.') ? dashBoardData?.oWithdraw?.nToday.toFixed(2) : dashBoardData?.oWithdraw?.nToday : dayFilter === 'week' ? dashBoardData?.oWithdraw?.nWeek.toString().includes('.') ? dashBoardData?.oWithdraw?.nWeek.toFixed(2) : dashBoardData?.oWithdraw?.nWeek : dashBoardData?.oWithdraw?.nMonth.toString().includes('.') ? dashBoardData?.oWithdraw?.nMonth.toFixed(2) : dashBoardData?.oWithdraw?.nMonth}
                  {' '}
                </h2>
              </div>
            </div>
          </Col>
          <Col className='free-contest-col' md={6} xl={3}>
            <div className='common-box-dashboard'>
              <div className='common-box-dashboard-div'>
                <p className='text-label-free-content'>
                  {' '}
                  <span> Free Contest </span>
                </p>
                <h2 className='dashboard-heading mb-0'>
                  {' '}
                  {dayFilter === 'today' ? dashBoardData?.oContest?.oFree?.nToday : dayFilter === 'week' ? dashBoardData?.oContest?.oFree?.nWeek : dashBoardData?.oContest?.oFree?.nMonth}
                  {' '}
                </h2>
              </div>
            </div>
          </Col>
          <Col className='paid-contest-col' md={6} xl={3}>
            <div className='common-box-dashboard '>
              <div className='common-box-dashboard-div'>
                <p className='text-label-paid-content'>
                  {' '}
                  <span> Paid Contest </span>
                </p>
                <h2 className='dashboard-heading mb-0'>
                  {' '}
                  {dayFilter === 'today' ? dashBoardData?.oContest?.oPaid?.nToday : dayFilter === 'week' ? dashBoardData?.oContest?.oPaid?.nWeek : dashBoardData?.oContest?.oPaid?.nMonth}
                  {' '}
                </h2>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}

DepositDetails.propTypes = {
  dashBoardData: PropTypes.object
}
export default DepositDetails
