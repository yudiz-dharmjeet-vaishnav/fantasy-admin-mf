import React, { useEffect, useState } from 'react'
import { Col, Row, CustomInput } from 'reactstrap'
import UserDetails from './UserDetails'
import DepositDetails from './DepositDetails'
import UserContestData from './UserContestData'
import { version } from '../../../package.json'
import SportDetails from './SportDetails'
import RevenueChart from './RevenueChart'
import { useQuery } from '@tanstack/react-query'
import getCurrencyData from '../../api/AddSetting/getCurrencyData'
import getDashBoardDetails from '../../api/dashBoard/getDashBoardDetails'

function dashboard () {
  const [dashBoardData, setDashBoardData] = useState('')
  const [dayFilter, setDayFilter] = useState('month')

  function onFiltering (event) {
    setDayFilter(event.target.value)
  }

  const { data: getCurrencyLogo } = useQuery({
    queryKey: ['getCurrencyData'],
    queryFn: () => getCurrencyData(),
    select: (response) => response?.data?.data
  })

  const { data: dashboardDetails } = useQuery({
    queryKey: ['getDashboardDetails'],
    queryFn: () => getDashBoardDetails(),
    select: (response) => response?.data?.data,
    enabled: !!getCurrencyLogo
  })

  useEffect(() => {
    if (dashboardDetails) {
      setDashBoardData(dashboardDetails[0])
    }
  }, [dashboardDetails])

  return (
    <>

      <Row className='dashboard-main-row'>
        <Col md={12} xl={8}>
          <div className='dashboard-details'>
            <UserDetails dashBoardData={dashBoardData} />
            <SportDetails dashBoardData={dashBoardData}/>
            <DepositDetails dashBoardData={dashBoardData} />
            <UserContestData dashBoardData={dashBoardData} />
          </div>
        </Col>
        <Col className='pt-3 pl-0' md={12} xl={4}>
          <div className='revenue-details'>
            <Row >
              <Col className='px-0 ' md={12} xl={12}>
                <div className='revenue-data'>
                  <RevenueChart chartData={dashBoardData} getCurrencyLogo={getCurrencyLogo} className="line-graph"/>
                </div>
                <div className='d-flex justify-content-between align-items-center py-3'>
                  <h2 className='other-details-heading'>Other Details</h2>
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
              </Col>

              <Col className='mb-3 play-return-col' md={6} xl={6}>
                <div className='play-return'>
                  <h3>Play Return</h3>
                  <h2>{dayFilter === 'today' ? dashBoardData?.oPlayReturn?.nToday : dayFilter === 'week' ? dashBoardData?.oPlayReturn?.nWeek : dashBoardData?.oPlayReturn?.nMonth}</h2>
                  <p>Total Play Return</p>
                </div>
              </Col>
              <Col className='mb-3 cancel-league-col' md={6} xl={6}>
                <div className='cancel-league'>
                  <h3>Cancelled Leagues</h3>
                  <h2>{dayFilter === 'today' ? dashBoardData?.oCanceled?.nToday : dayFilter === 'week' ? dashBoardData?.oCanceled?.nWeek : dashBoardData?.oCanceled?.nMonth}</h2>
                  <p>Total Cancelled Leagues</p>
                </div>
              </Col>
              <Col className='bot-winner-col' md={6} xl={6}>
                <div className='bot-winner'>
                  <h3>BOT Winners</h3>
                  <h2>{dayFilter === 'today' ? dashBoardData?.oBotWinners?.nToday : dayFilter === 'week' ? dashBoardData?.oBotWinners?.nWeek : dashBoardData?.oBotWinners?.nMonth }</h2>
                  <p>BOT User winners</p>
                </div>
              </Col>
              <Col className='cancel-league-col' md={6} xl={6}>
                <div className='real-winner'>
                  <h3>Real Winners</h3>
                  <h2>{dayFilter === 'today' ? dashBoardData?.oRealWinners?.nToday : dayFilter === 'week' ? dashBoardData?.oRealWinners?.nWeek : dashBoardData?.oRealWinners?.nMonth}</h2>
                  <p>Actual User Winners</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <div className='w-100 versioning'>
        <h2 className='version-label'>
          {' '}
          version
          {' '}
          {version}
        </h2>
      </div>
    </>
  )
}

export default dashboard
