import React, { Fragment, useState, useEffect } from 'react'
import { Col, Row } from 'reactstrap'
import PropTypes from 'prop-types'
import { useQuery } from '@tanstack/react-query'

import { fixDigit } from '../../../../helpers/helper'
import getSportsList from '../../../../api/sport/getSportsList'

function UserStatistics (props) {
  const { StatisticData } = props
  // const [sports, setSports] = useState([])
  const [sportsName, setSportsName] = useState([])

  const { data } = useQuery({
    queryKey: ['getSportsList'],
    queryFn: () => getSportsList(),
    select: (res) => res?.data?.data
  })

  useEffect(() => {
    const arr = []
    if (data) {
      data.forEach((sport) => {
        const sportName = `o${sport.sName.charAt(0).toUpperCase()}${sport.sName.slice(1).toLowerCase()}`
        arr.push(sportName)
      })
    }
    setSportsName(arr)
  }, [data])

  return (
    <>
      {StatisticData && !StatisticData?.oCricket && !StatisticData?.oFootball && !StatisticData?.oBasketball && !StatisticData?.oKabaddi
        ? (
          <Col className="debugger-heading my-5" md="12">
            <h1 className="h1">User Statistics</h1>
            <h2>No Data Available</h2>
          </Col>
          )
        : (
          <Col md="12">
            <Row>
              <Col className="h1 debugger-heading" md="12">User Statistics</Col>
              {sportsName.map((sport, index) => {
                if (StatisticData[sport] && Object.keys(StatisticData[sport])?.length !== 0) {
                  return (
                    <Col key={index} className='mb-3' md={6} sm={12} xl={4}>
                      <Fragment>
                        <div className="debugger-table-responsive  debugger-box">
                          <h3 className="text-h3">{sport.slice(1)}</h3>
                          <table className="debugger-table">
                            <tbody>
                              <tr>
                                <td>Create Private League</td>
                                <td>{StatisticData?.[sport]?.nCreatePLeague ? (fixDigit(StatisticData?.[sport]?.nCreatePLeague)) : 0}</td>

                              </tr>
                              <tr>
                                <td>Total Join League</td>
                                <td>{StatisticData?.[sport]?.nJoinLeague ? (fixDigit(StatisticData?.[sport]?.nJoinLeague)) : 0}</td>
                              </tr>
                              <tr>
                                <td>Total Join Private League</td>
                                <td>{StatisticData?.[sport]?.nJoinPLeague ? (fixDigit(StatisticData?.[sport]?.nJoinPLeague)) : 0}</td>
                              </tr>
                              <tr>
                                <td>Total Private League Creator Bonus</td>
                                <td>{StatisticData?.[sport]?.nCreatePLeagueSpend ? (fixDigit(StatisticData?.[sport]?.nCreatePLeagueSpend)) : 0}</td>
                              </tr>
                              <tr>
                                <td>Join Private League Spend</td>
                                <td>{StatisticData?.[sport]?.nJoinPLeagueSpend ? (fixDigit(StatisticData?.[sport]?.nJoinPLeagueSpend)) : 0}</td>
                              </tr>
                              <tr>
                                <td>Spending</td>
                                <td>{StatisticData?.[sport]?.nSpending ? (fixDigit(StatisticData?.[sport]?.nSpending)) : 0}</td>
                              </tr>
                              <tr>
                                <td>Cashback Amount</td>
                                <td>{StatisticData?.[sport]?.nCashbackAmount ? (fixDigit(StatisticData?.[sport]?.nCashbackAmount)) : 0}</td>
                              </tr>
                              <tr>
                                <td>Win Amount</td>
                                <td>{StatisticData?.[sport]?.nWinAmount ? (fixDigit(StatisticData?.[sport].nWinAmount)) : 0}</td>
                              </tr>
                              <tr>
                                <td>Win Count</td>
                                <td>{StatisticData?.[sport]?.nWinCount ? (fixDigit(StatisticData?.[sport]?.nWinCount)) : 0}</td>
                              </tr>
                              <tr>
                                <td>Play Return</td>
                                <td>{StatisticData?.[sport]?.nPlayReturn ? (fixDigit(StatisticData?.[sport]?.nPlayReturn)) : 0}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </Fragment>
                    </Col>
                  )
                } else {
                  return ''
                }
              })}
              {/* {StatisticData && StatisticData?.oCricket && (
              <Col className='mb-3' md={6} sm={12} xl={4}>
                <Fragment>
                  <div className="debugger-table-responsive  debugger-box">
                    <h3 className="text-h3">Cricket</h3>
                    <table className="debugger-table">
                      <tbody>
                        <tr>
                          <td>Create Private League</td>
                          <td>{StatisticData?.oCricket?.nCreatePLeague ? (fixDigit(StatisticData?.oCricket?.nCreatePLeague)) : 0}</td>

                        </tr>
                        <tr>
                          <td>Total Join League</td>
                          <td>{StatisticData?.oCricket?.nJoinLeague ? (fixDigit(StatisticData?.oCricket?.nJoinLeague)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Total Join Private League</td>
                          <td>{StatisticData?.oCricket?.nJoinPLeague ? (fixDigit(StatisticData?.oCricket?.nJoinPLeague)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Total Private League Creator Bonus</td>
                          <td>{StatisticData?.oCricket?.nCreatePLeagueSpend ? (fixDigit(StatisticData?.oCricket?.nCreatePLeagueSpend)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Join Private League Spend</td>
                          <td>{StatisticData?.oCricket?.nJoinPLeagueSpend ? (fixDigit(StatisticData?.oCricket?.nJoinPLeagueSpend)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Spending</td>
                          <td>{StatisticData?.oCricket?.nSpending ? (fixDigit(StatisticData?.oCricket?.nSpending)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Cashback Amount</td>
                          <td>{StatisticData?.oCricket?.nCashbackAmount ? (fixDigit(StatisticData?.oCricket?.nCashbackAmount)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Win Amount</td>
                          <td>{StatisticData?.oCricket?.nWinAmount ? (fixDigit(StatisticData?.oCricket.nWinAmount)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Win Count</td>
                          <td>{StatisticData?.oCricket?.nWinCount ? (fixDigit(StatisticData?.oCricket?.nWinCount)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Play Return</td>
                          <td>{StatisticData?.oCricket?.nPlayReturn ? (fixDigit(StatisticData?.oCricket?.nPlayReturn)) : 0}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Fragment>
              </Col>
              )}

              {StatisticData && StatisticData?.oFootball && (
              <Col className="mb-3" md={6} sm={12} xl={4}>
                <Fragment>
                  <div className="debugger-table-responsive debugger-box">
                    <h3 className="text-h3">Football</h3>
                    <table className="debugger-table">
                      <tbody>
                        <tr>
                          <td>Create Private League</td>
                          <td>{StatisticData?.oFootball?.nCreatePLeague ? (fixDigit(StatisticData?.oFootball?.nCreatePLeague)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Total Join League</td>
                          <td>{StatisticData?.oFootball?.nJoinLeague ? (fixDigit(StatisticData?.oFootball?.nJoinLeague)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Total Join Private League</td>
                          <td>{StatisticData?.oFootball?.nJoinPLeague ? (fixDigit(StatisticData?.oFootball?.nJoinPLeague)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Total Private League Creator Bonus</td>
                          <td>{StatisticData?.oFootball?.nCreatePLeagueSpend ? (fixDigit(StatisticData?.oFootball?.nCreatePLeagueSpend)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Join Private League Spend</td>
                          <td>{StatisticData?.oFootball?.nJoinPLeagueSpend ? (fixDigit(StatisticData?.oFootball?.nJoinPLeagueSpend)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Spending</td>
                          <td>{StatisticData?.oFootball?.nSpending ? (fixDigit(StatisticData?.oFootball?.nSpending)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Cashback Amount</td>
                          <td>{StatisticData?.oFootball?.nCashbackAmount ? (fixDigit(StatisticData?.oFootball?.nCashbackAmount)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Win Amount</td>
                          <td>{StatisticData?.oFootball?.nWinAmount ? (fixDigit(StatisticData?.oFootball?.nWinAmount)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Win Count</td>
                          <td>{StatisticData?.oFootball?.nWinCount ? (fixDigit(StatisticData?.oFootball?.nWinCount)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Play Return</td>
                          <td>{StatisticData?.oFootball?.nPlayReturn ? (fixDigit(StatisticData?.oFootball?.nPlayReturn)) : 0}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Fragment>
              </Col>
              )}
              {StatisticData && StatisticData?.oBasketball && (
              <Col className='mb-3' md={6} sm={12} xl={4}>
                <Fragment>
                  <div className="debugger-table-responsive debugger-box">
                    <h3 className="text-h3">Basketball</h3>
                    <table className="debugger-table">
                      <tbody>
                        <tr>
                          <td>Create Private League</td>
                          <td>{StatisticData?.oBasketball?.nCreatePLeague ? (fixDigit(StatisticData?.oBasketball?.nCreatePLeague)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Total Join League</td>
                          <td>{StatisticData?.oBasketball?.nJoinLeague ? (fixDigit(StatisticData?.oBasketball?.nJoinLeague)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Total Join Private League</td>
                          <td>{StatisticData?.oBasketball?.nJoinPLeague ? (fixDigit(StatisticData?.oBasketball?.nJoinPLeague)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Total Private League Creator Bonus</td>
                          <td>{StatisticData?.oBasketball?.nCreatePLeagueSpend ? (fixDigit(StatisticData?.oBasketball?.nCreatePLeagueSpend)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Join Private League Spend</td>
                          <td>{StatisticData?.oBasketball?.nJoinPLeagueSpend ? (fixDigit(StatisticData?.oBasketball?.nJoinPLeagueSpend)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Spending</td>
                          <td>{StatisticData?.oBasketball?.nSpending ? (fixDigit(StatisticData?.oBasketball?.nSpending)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Cashback Amount</td>
                          <td>{StatisticData?.oBasketball?.nCashbackAmount ? (fixDigit(StatisticData?.oBasketball?.nCashbackAmount)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Win Amount</td>
                          <td>{StatisticData?.oBasketball?.nWinAmount ? (fixDigit(StatisticData?.oBasketball?.nWinAmount)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Win Count</td>
                          <td>{StatisticData?.oBasketball?.nWinCount ? (fixDigit(StatisticData?.oBasketball?.nWinCount)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Play Return</td>
                          <td>{StatisticData?.oBasketball?.nPlayReturn ? (fixDigit(StatisticData?.oBasketball?.nPlayReturn)) : 0}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Fragment>
              </Col>
              )}
              {StatisticData && StatisticData?.oKabaddi && (
              <Col className='mb-3' md={6} sm={12} xl={4}>
                <Fragment>
                  <div className="debugger-table-responsive debugger-box">
                    <h3 className="text-h3">Kabaddi</h3>
                    <table className="debugger-table">
                      <tbody>
                        <tr>
                          <td>Create Private League</td>
                          <td>{StatisticData?.oKabaddi?.nCreatePLeague ? (fixDigit(StatisticData?.oKabaddi?.nCreatePLeague)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Total Join League</td>
                          <td>{StatisticData?.oKabaddi?.nJoinLeague ? (fixDigit(StatisticData?.oKabaddi?.nJoinLeague)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Total Join Private League</td>
                          <td>{StatisticData?.oKabaddi?.nJoinPLeague ? (fixDigit(StatisticData?.oKabaddi?.nJoinPLeague)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Total Private League Creator Bonus</td>
                          <td>{StatisticData?.oKabaddi?.nCreatePLeagueSpend ? (fixDigit(StatisticData?.oKabaddi?.nCreatePLeagueSpend)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Join Private League Spend</td>
                          <td>{StatisticData?.oKabaddi?.nJoinPLeagueSpend ? (fixDigit(StatisticData?.oKabaddi?.nJoinPLeagueSpend)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Spending</td>
                          <td>{StatisticData?.oKabaddi?.nSpending ? (fixDigit(StatisticData?.oKabaddi?.nSpending)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Cashback Amount</td>
                          <td>{StatisticData?.oKabaddi?.nCashbackAmount ? (fixDigit(StatisticData?.oKabaddi?.nCashbackAmount)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Win Amount</td>
                          <td>{StatisticData?.oKabaddi?.nWinAmount ? (fixDigit(StatisticData?.oKabaddi?.nWinAmount)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Win Count</td>
                          <td>{StatisticData?.oKabaddi?.nWinCount ? (fixDigit(StatisticData?.oKabaddi?.nWinCount)) : 0}</td>
                        </tr>
                        <tr>
                          <td>Play Return</td>
                          <td>{StatisticData?.oKabaddi?.nPlayReturn ? (fixDigit(StatisticData?.oKabaddi?.nPlayReturn)) : 0}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Fragment>
              </Col>
              )} */}
            </Row>
          </Col>
          )}
    </>
  )
}

UserStatistics.propTypes = {
  StatisticData: PropTypes?.object
}
export default UserStatistics
