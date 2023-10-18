import React, { useEffect } from 'react'
import { Button, UncontrolledTooltip } from 'reactstrap'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import infoIcon from '../../../assets/images/info-icon.svg'
import refreshIcon from '../../../assets/images/refresh-icon-1.svg'

import DataNotFound from '../../../components/DataNotFound'
import Info from '../../../helpers/info'
import { dateFormate, fixDigit } from '../../../helpers/helper'
import { updateAppDownloadReport } from '../../../actions/reports'

function AppDownloadReport (props) {
  const { isOpen, dateWiseReports, permission, appDownloadReturn, token, setLoading, updatedAppDownloadStatisticsData, previousProps, setAppDownloadReturn } = props
  const dispatch = useDispatch()

  useEffect(() => {
    if (updatedAppDownloadStatisticsData) {
      if (previousProps?.updatedAppDownloadStatisticsData !== updatedAppDownloadStatisticsData) {
        const platformIndex = appDownloadReturn?.findIndex((appDownloadReturn) => appDownloadReturn?.ePlatform === updatedAppDownloadStatisticsData?.ePlatform)
        const newArray = [...appDownloadReturn]
        newArray[platformIndex] = {
          ...newArray[platformIndex],
          nTotal: updatedAppDownloadStatisticsData?.nTotal,
          nToday: updatedAppDownloadStatisticsData?.nToday,
          nYesterday: updatedAppDownloadStatisticsData?.nYesterday,
          nLastWeek: updatedAppDownloadStatisticsData?.nLastWeek,
          nLastMonth: updatedAppDownloadStatisticsData?.nLastMonth,
          nLastYear: updatedAppDownloadStatisticsData?.nLastYear,
          dUpdatedAt: updatedAppDownloadStatisticsData?.dUpdatedAt
        }
        setAppDownloadReturn(newArray)
      }
    }
    return () => {
      previousProps.updatedAppDownloadStatisticsData = updatedAppDownloadStatisticsData
    }
  }, [updatedAppDownloadStatisticsData])

  function updateAppDownloadFunc (id, key, platform) {
    if (token) {
      const updateAppDownloadData = {
        id, key, platform, token
      }
      dispatch(updateAppDownloadReport(updateAppDownloadData))
      setLoading(true)
    }
  }
  return (
    <>
      {isOpen === 'APP_DOWNLOAD_REPORT' && dateWiseReports && dateWiseReports?.length !== 0 && (
      <section className='user-section'>
        <div className='table-represent-two'>
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr align='center'>
                  <th>
                    Category
                    <img className='custom-info' id='PLAY' src={infoIcon} />
                    <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='PLAY'>
                      <p>{Info?.appDownload}</p>
                    </UncontrolledTooltip>
                  </th>
                  <th>Total</th>
                  <th>Last Update</th>
                </tr>
              </thead>
              <tbody>
                {dateWiseReports?.aAppDownload && dateWiseReports?.aAppDownload?.map((data, index) => (
                  <tr key={index} align='center'>
                    <td><b>{data?.ePlatform && data?.ePlatform === 'A' ? 'Android' : 'iOS'}</b></td>
                    <td>{fixDigit(data?.nTotal)}</td>
                    <td>{dateFormate(data?.dUpdatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      )}
      {isOpen === 'APP_DOWNLOAD_REPORT' && dateWiseReports?.length === 0
        ? (appDownloadReturn && appDownloadReturn?.length > 0)
            ? (
              <section className='user-section'>
                <div className='table-represent-two'>
                  <div className='table-responsive'>
                    <table className='table'>
                      <thead>
                        <tr align='center'>
                          <th>Platform</th>
                          <th>Total</th>
                          <th>Today</th>
                          <th>Yesterday</th>
                          <th>Last Week</th>
                          <th>Last Month</th>
                          <th>Last Year</th>
                          <th>Last Update</th>
                          <th align='center'>
                            <img className='custom-info' id='CREATORBONUSRETURN' src={infoIcon} />
                            <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='CREATORBONUSRETURN'>
                              <p>{Info?.appDownload}</p>
                            </UncontrolledTooltip>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {appDownloadReturn.map((data, index) => (
                          <tr key={index} align='center'>
                            <td><b>{data?.ePlatform && data?.ePlatform === 'A' ? 'Android' : 'iOS'}</b></td>
                            <td>{fixDigit(data?.nTotal)}</td>
                            <td>{fixDigit(data?.nToday)}</td>
                            <td>{fixDigit(data?.nYesterday)}</td>
                            <td>{fixDigit(data?.nLastWeek)}</td>
                            <td>{fixDigit(data?.nLastMonth)}</td>
                            <td>{fixDigit(data?.nLastYear)}</td>
                            <td>{dateFormate(data?.dUpdatedAt)}</td>
                            <td>
                              {permission && (
                              <Button color='link' onClick={() => updateAppDownloadFunc(data?._id, 'AD', data?.ePlatform)}>
                                <img alt='Creator Bonus Return' height='20px' src={refreshIcon} width='20px'/>
                              </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
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
AppDownloadReport.propTypes = {
  dateWiseReports: PropTypes?.string,
  isOpen: PropTypes?.bool,
  permission: PropTypes?.string,
  appDownloadReturn: PropTypes?.array,
  token: PropTypes?.string,
  setLoading: PropTypes?.bool,
  updatedAppDownloadStatisticsData: PropTypes?.object,
  previousProps: PropTypes?.object,
  setAppDownloadReturn: PropTypes?.func
}

export default AppDownloadReport
