import React, { useEffect } from 'react'
import { Button, UncontrolledTooltip } from 'reactstrap'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import PropTypes from 'prop-types'

import infoIcon from '../../../assets/images/info-icon.svg'
import refreshIcon from '../../../assets/images/refresh-icon-1.svg'

import DataNotFound from '../../../components/DataNotFound'
import Info from '../../../helpers/info'
import { updatePrivateLeague } from '../../../actions/reports'
import { fixDigit } from '../../../helpers/helper'

function PrivateLeagueReport (props) {
  const { isOpen, dateWiseReports, sports, PrivateLeague, permission, token, setLoading, updatedPrivateLeagueData, previousProps, setPrivateLeague } = props
  const dispatch = useDispatch()

  // to set updated private league data
  useEffect(() => {
    if (updatedPrivateLeagueData) {
      if (previousProps?.updatedPrivateLeagueData !== updatedPrivateLeagueData) {
        const categoryIndex = PrivateLeague?.findIndex((privateLeague) => privateLeague?.eCategory === updatedPrivateLeagueData?.sSport)
        const newArray = [...PrivateLeague]
        if (updatedPrivateLeagueData?.oCancelled) {
          newArray[categoryIndex] = {
            ...newArray[categoryIndex],
            oCancelled: {
              ...newArray[categoryIndex]?.oCancelled,
              nTotal: updatedPrivateLeagueData?.oCancelled?.nTotal,
              nToday: updatedPrivateLeagueData?.oCancelled?.nToday,
              nYesterday: updatedPrivateLeagueData?.oCancelled?.nYesterday,
              nLastWeek: updatedPrivateLeagueData?.oCancelled?.nLastWeek,
              nLastMonth: updatedPrivateLeagueData?.oCancelled?.nLastMonth,
              nLastYear: updatedPrivateLeagueData?.oCancelled?.nLastYear,
              dUpdatedAt: updatedPrivateLeagueData?.oCancelled?.dUpdatedAt
            }
          }
        } else if (updatedPrivateLeagueData?.oCompleted) {
          newArray[categoryIndex] = {
            ...newArray[categoryIndex],
            oCompleted: {
              ...newArray[categoryIndex]?.oCompleted,
              nTotal: updatedPrivateLeagueData?.oCompleted?.nTotal,
              nToday: updatedPrivateLeagueData?.oCompleted?.nToday,
              nYesterday: updatedPrivateLeagueData?.oCompleted?.nYesterday,
              nLastWeek: updatedPrivateLeagueData?.oCompleted?.nLastWeek,
              nLastMonth: updatedPrivateLeagueData?.oCompleted?.nLastMonth,
              nLastYear: updatedPrivateLeagueData?.oCompleted?.nLastYear,
              dUpdatedAt: updatedPrivateLeagueData?.oCompleted?.dUpdatedAt
            }
          }
        } else if (updatedPrivateLeagueData?.oCreated) {
          newArray[categoryIndex] = {
            ...newArray[categoryIndex],
            oCreated: {
              ...newArray[categoryIndex]?.oCreated,
              nTotal: updatedPrivateLeagueData?.oCreated?.nTotal,
              nToday: updatedPrivateLeagueData?.oCreated?.nToday,
              nYesterday: updatedPrivateLeagueData?.oCreated?.nYesterday,
              nLastWeek: updatedPrivateLeagueData?.oCreated?.nLastWeek,
              nLastMonth: updatedPrivateLeagueData?.oCreated?.nLastMonth,
              nLastYear: updatedPrivateLeagueData?.oCreated?.nLastYear,
              dUpdatedAt: updatedPrivateLeagueData?.oCreated?.dUpdatedAt
            }
          }
        }
        setPrivateLeague(newArray)
      }
    }
    return () => {
      previousProps.updatedPrivateLeagueData = updatedPrivateLeagueData
    }
  }, [updatedPrivateLeagueData])

  // dispatch action to update the private league data
  function updatePrivateLeagueFunc (id, key, sportsType) {
    if (token) {
      const updatePrivateLeagueData = {
        id, key, sportsType, token
      }
      dispatch(updatePrivateLeague(updatePrivateLeagueData))
      setLoading(true)
    }
  }
  return (
    <>
      {isOpen === 'PRIVATE_LEAGUE_REPORT' && dateWiseReports && dateWiseReports?.length !== 0 && (
      <section className='user-section'>
        <div className='table-represent-two'>
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr align='center'>
                  <th>
                    Category
                    <img className='custom-info' id='PRIVATELEAGUE' src={infoIcon} />
                    <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='PRIVATELEAGUE'>
                      <p>{Info?.privateLeague}</p>
                    </UncontrolledTooltip>
                  </th>
                  <th />
                  <th>Total</th>
                  <th>Last Update</th>
                </tr>
              </thead>
              {dateWiseReports?.aPrivateLeague &&
                    dateWiseReports?.aPrivateLeague?.length !== 0 && (
                dateWiseReports?.aPrivateLeague?.filter(privateLeagueData => sports?.includes(privateLeagueData?.eCategory))?.map((data, index) => (
                  <tbody key={index}>
                    <tr key={index} align='center'>
                      <td rowSpan='3'><b>{data?.eCategory}</b></td>
                      <td>Created</td>
                      <td>{data?.oCreated && fixDigit(data?.oCreated?.nTotal)}</td>
                      <td>
                        {data?.oCreated?.dUpdatedAt
                          ? moment(data?.oCreated?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                          : 'No Data Available'}
                      </td>
                    </tr>
                    <tr align='center'>
                      <td>Completed</td>
                      <td>{data?.oCompleted && fixDigit(data?.oCompleted?.nTotal)}</td>
                      <td>
                        {data?.oCompleted?.dUpdatedAt
                          ? moment(data?.oCompleted?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                          : 'No Data Available'}
                      </td>
                    </tr>
                    <tr align='center'>
                      <td>Cancelled</td>
                      <td>{data?.oCancelled && fixDigit(data?.oCancelled?.nTotal) }</td>
                      <td>
                        {data?.oCompleted?.dUpdatedAt
                          ? moment(data?.oCompleted?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                          : 'No Data Available'}
                      </td>
                    </tr>
                  </tbody>
                )))}
            </table>
          </div>
        </div>
      </section>
      )}
      {isOpen === 'PRIVATE_LEAGUE_REPORT' && dateWiseReports?.length === 0
        ? (PrivateLeague && PrivateLeague?.length > 0)
            ? (
              <section className='user-section'>
                <div className='table-represent-two'>
                  <div className='table-responsive'>
                    <table className='table'>
                      <thead>
                        <tr align='center'>
                          <th align='left'>Category</th>
                          <th />
                          <th>Total</th>
                          <th>Today</th>
                          <th>Yesterday</th>
                          <th>Last Week</th>
                          <th>Last Month</th>
                          <th>Last Year</th>
                          <th>Last Update</th>
                          <th>
                            <img className='custom-info' id='PRIVATELEAGUE' src={infoIcon} />
                            <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='PRIVATELEAGUE'>
                              <p>{Info?.privateLeague}</p>
                            </UncontrolledTooltip>
                          </th>
                        </tr>
                      </thead>
                      {PrivateLeague?.filter(privateLeagueData => sports?.includes(privateLeagueData?.eCategory))?.map((data, index) => (
                        <tbody key={index}>
                          <tr key={index} align='center'>
                            <td rowSpan='3'>
                              <b>{data?.eCategory}</b>
                            </td>
                            <td>Create</td>
                            <td>{data?.oCreated && fixDigit(data?.oCreated?.nTotal)}</td>
                            <td>{data?.oCreated && fixDigit(data?.oCreated?.nToday)}</td>
                            <td>{data?.oCreated && fixDigit(data?.oCreated?.nYesterday)}</td>
                            <td>{data?.oCreated && fixDigit(data?.oCreated?.nLastWeek)}</td>
                            <td>{data?.oCreated && fixDigit(data?.oCreated?.nLastMonth)}</td>
                            <td>{data?.oCreated && fixDigit(data?.oCreated?.nLastYear)}</td>
                            <td>
                              {data?.oCreated?.dUpdatedAt
                                ? moment(data?.oCreated?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                                : 'No Data Available'}
                            </td>
                            <td>
                              {permission && (
                              <Button color='link' onClick={() => updatePrivateLeagueFunc(data?._id, 'CL', data?.eCategory)}>
                                <img alt='Participants' height='20px' src={refreshIcon} width='20px'/>
                              </Button>
                              )}
                            </td>
                          </tr>
                          <tr align='center'>
                            <td>Completed</td>
                            <td>{data?.oCompleted && fixDigit(data?.oCompleted?.nTotal)}</td>
                            <td>{data?.oCompleted && fixDigit(data?.oCompleted?.nToday)}</td>
                            <td>{data?.oCompleted && fixDigit(data?.oCompleted?.nYesterday)}</td>
                            <td>{data?.oCompleted && fixDigit(data?.oCompleted?.nLastWeek)}</td>
                            <td>{data?.oCompleted && fixDigit(data?.oCompleted?.nLastMonth)}</td>
                            <td>{data?.oCompleted && fixDigit(data?.oCompleted?.nLastYear)}</td>
                            <td>
                              {data?.oCompleted?.dUpdatedAt
                                ? moment(data?.oCompleted?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                                : 'No Data Available'}

                            </td>
                            <td>
                              {permission && (
                              <Button color='link' onClick={() => updatePrivateLeagueFunc(data?._id, 'CMPL', data?.eCategory)}>
                                <img alt='Participants' height='20px' src={refreshIcon} width='20px'/>
                              </Button>
                              )}
                            </td>
                          </tr>
                          <tr align='center'>
                            <td>Cancelled</td>
                            <td>{data?.oCancelled && fixDigit(data?.oCancelled?.nTotal) }</td>
                            <td>{data?.oCancelled && fixDigit(data?.oCancelled?.nToday)}</td>
                            <td>{data?.oCancelled && fixDigit(data?.oCancelled?.nYesterday)}</td>
                            <td>{data?.oCancelled && fixDigit(data?.oCancelled?.nLastWeek)}</td>
                            <td>{data?.oCancelled && fixDigit(data?.oCancelled?.nLastMonth)}</td>
                            <td>{data?.oCancelled && fixDigit(data?.oCancelled?.nLastYear)}</td>
                            <td>
                              {data?.oCancelled?.dUpdatedAt
                                ? moment(data?.oCancelled?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                                : 'No Data Available'}

                            </td>
                            <td>
                              {permission && (
                              <Button color='link' onClick={() => updatePrivateLeagueFunc(data?._id, 'CNCLL', data?.eCategory)}>
                                <img alt='Participants' height='20px' src={refreshIcon} width='20px'/>
                              </Button>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  </div>
                </div>
              </section>
              )
            : <DataNotFound message="Data" obj=""/>
        : ''}
    </>
  )
}

PrivateLeagueReport.propTypes = {
  dateWiseReports: PropTypes?.string,
  isOpen: PropTypes?.bool,
  sports: PropTypes?.array,
  permission: PropTypes?.string,
  PrivateLeague: PropTypes?.array,
  updatePrivateLeagueFunc: PropTypes?.func,
  token: PropTypes?.string,
  setLoading: PropTypes?.bool,
  updatedPrivateLeagueData: PropTypes?.object,
  previousProps: PropTypes?.object,
  setPrivateLeague: PropTypes?.func
}

export default PrivateLeagueReport
