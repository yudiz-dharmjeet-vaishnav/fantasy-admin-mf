import React, { useEffect, useState } from 'react'
import { Row, Col, CustomInput } from 'reactstrap'
import PropTypes from 'prop-types'
import liveMatch from '../../../assets/images/live-match.svg'

function SportDetails ({ dashBoardData }) {
  const [dayFilter, setDayFilter] = useState('month')
  const [sportName, setSportName] = useState('CRICKET')
  const [sportDetails, setSportDetails] = useState('')
  function onFiltering (event) {
    setDayFilter(event.target.value)
  }
  function setSportNameFilter (name) {
    setSportName(name)
  }
  useEffect(() => {
    if (dashBoardData) {
      const sportInfo = dashBoardData?.aSportsData?.find((data) => data?.eCategory === sportName)
      setSportDetails(sportInfo)
    }
  }, [sportName, dashBoardData])
  return (
    <>
      <Row className='sport-details'>
        <div className='sport-details-header'>
          <h3>Sports wise Details</h3>
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
        <div className='sport-details-sport-name'>
          {dashBoardData?.aSportsData?.map((data) => (
            <>
              <li className={sportName === data?.eCategory ? 'active-sport' : ''} onClick={() => setSportNameFilter(data?.eCategory)}>{data?.eCategory}</li>
            </>
          )
          )}
        </div>
        <Col className='sport-details-col' md={12} xl={12}>
          <Row>
            <Col className='live-match-col' md={4} xl={4}>
              <div className='live-match'>
                <h2>{dayFilter === 'today' ? sportDetails?.oLiveMatches?.nToday : dayFilter === 'month' ? sportDetails?.oLiveMatches?.nMonth : sportDetails?.oLiveMatches?.nWeek}</h2>
                <p>
                  {' '}
                  <img alt="liveMatch" src={liveMatch} />
                  {' '}
                  Live Matches
                </p>
              </div>
            </Col>
            <Col className='upcoming-match-col' md={4} xl={4}>
              <div className='upcoming-match'>
                <h2>
                  {dayFilter === 'today' ? sportDetails?.oUpcomingMatches?.nToday : dayFilter === 'month' ? sportDetails?.oUpcomingMatches?.nMonth : sportDetails?.oUpcomingMatches?.nWeek}
                  {' '}
                </h2>
                <p> Upcoming Matches</p>
              </div>
            </Col>
            <Col md={4} xl={4} >
              <div className='upcoming-match'>
                <h2>
                  {' '}
                  {dayFilter === 'today' ? sportDetails?.oCompletedMatches?.nToday : dayFilter === 'month' ? sportDetails?.oCompletedMatches?.nMonth : sportDetails?.oCompletedMatches?.nWeek}
                </h2>
                <p>  Completed Matches</p>
              </div>
            </Col>

          </Row>
          <Row className='mt-2'>
            <Col className='live-match-col' md={4} xl={4}>
              <div className='live-match' >
                <h2>{dayFilter === 'today' ? sportDetails?.oLiveLeagues?.nToday : dayFilter === 'month' ? sportDetails?.oLiveLeagues?.nMonth : sportDetails?.oLiveLeagues?.nToday}</h2>
                <p>
                  {' '}
                  <img alt="liveMatch" src={liveMatch} />
                  {' '}
                  Live Leagues
                </p>
              </div>
            </Col>
            <Col className='upcoming-match-col' md={4} xl={4}>
              <div className='upcoming-match'>
                <h2>{dayFilter === 'today' ? sportDetails?.oUpcomingLeagues?.nToday : dayFilter === 'month' ? sportDetails?.oUpcomingLeagues?.nMonth : sportDetails?.oUpcomingLeagues?.nWeek}</h2>
                <p>  Upcoming Leagues</p>
              </div>
            </Col>
            <Col md={4} xl={4}>
              <div className='upcoming-match'>
                <h2>{dayFilter === 'today' ? sportDetails?.oCompletedLeagues?.nToday : dayFilter === 'month' ? sportDetails?.oCompletedLeagues?.nMonth : sportDetails?.oCompletedLeagues?.nWeek}</h2>
                <p> Completed Leagues</p>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

SportDetails.propTypes = {
  dashBoardData: PropTypes.object
}
export default SportDetails
