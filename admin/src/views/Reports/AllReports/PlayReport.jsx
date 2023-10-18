import React, { useEffect } from 'react'
import { Button, UncontrolledTooltip } from 'reactstrap'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import infoIcon from '../../../assets/images/info-icon.svg'
import refreshIcon from '../../../assets/images/refresh-icon-1.svg'

import DataNotFound from '../../../components/DataNotFound'
import Info from '../../../helpers/info'
import { dateFormate, fixDigit } from '../../../helpers/helper'
import { updatePlayedReport } from '../../../actions/reports'

function PlayReport (props) {
  const { dateWiseReports, isOpen, sports, permission, played, token, userType, setLoading, updatedPlayedData, previousProps, setPlayed } = props
  const dispatch = useDispatch()

  // to set updated played data
  useEffect(() => {
    if (updatedPlayedData) {
      if (previousProps?.updatedPlayedData !== updatedPlayedData) {
        const categoryIndex = played?.findIndex((playedData) => playedData?.eCategory === updatedPlayedData?.eCategory)
        const newArray = [...played]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotalCash: updatedPlayedData?.nTotalCash,
          nTotalBonus: updatedPlayedData?.nTotalBonus,
          nTodayCash: updatedPlayedData?.nTodayCash,
          nTodayBonus: updatedPlayedData?.nTodayBonus,
          nYesterCash: updatedPlayedData?.nYesterCash,
          nYesterBonus: updatedPlayedData?.nYesterBonus,
          nWeekCash: updatedPlayedData?.nWeekCash,
          nWeekBonus: updatedPlayedData?.nWeekBonus,
          nMonthCash: updatedPlayedData?.nMonthCash,
          nMonthBonus: updatedPlayedData?.nMonthBonus,
          nYearCash: updatedPlayedData?.nYearCash,
          nYearBonus: updatedPlayedData?.nYearBonus,
          dUpdatedAt: updatedPlayedData?.dUpdatedAt
        }
        setPlayed(newArray)
      }
    }
    return () => {
      previousProps.updatedPlayedData = updatedPlayedData
    }
  }, [updatedPlayedData])

  // dispatch action to update the played data
  function updatePlayedFunc (id, key, sportsType) {
    if (token) {
      const updatePlayedData = {
        id, key, sportsType, userType, token
      }
      dispatch(updatePlayedReport(updatePlayedData))
      setLoading(true)
    }
  }

  return (
    <>
      {isOpen === 'PLAY_REPORT' && dateWiseReports?.length !== 0 && (
      <section className='user-section'>
        <div className='table-represent-two'>
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr align='center'>
                  <th rowSpan='2'>
                    Category
                    <img className='custom-info' id='PLAY' src={infoIcon} />
                    <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='PLAY'>
                      <p>{Info?.played}</p>
                    </UncontrolledTooltip>
                  </th>
                  <th className='bot-th text-center' colSpan='2'>Total</th>
                  <th rowSpan='2'>Last Update</th>
                </tr>
                <tr align='center'>
                  <th className='bot-th-1 text-center'>Cash</th>
                  <th className='bot-th-2 text-center'>Bonus</th>
                </tr>
              </thead>
              <tbody>
                {dateWiseReports?.aPlayed && dateWiseReports?.aPlayed?.filter(played => sports?.includes(played?.eCategory))?.map((data, index) => (
                  <tr key={index} align='center'>
                    <td><b>{data?.eCategory}</b></td>
                    <td>{fixDigit(data?.nTotalCash)}</td>
                    <td>{fixDigit(data?.nTotalBonus)}</td>
                    <td>{dateFormate(data?.dUpdatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      )}
      {isOpen === 'PLAY_REPORT' && dateWiseReports?.length === 0
        ? (played && played?.length > 0)
            ? (
              <section className='user-section'>
                <div className='table-represent-two'>
                  <div className='table-responsive'>
                    <table className='table'>
                      <thead>
                        <tr align='center'>
                          <th align='center' rowSpan='2'>Category</th>
                          <th align='center' className='bot-th text-center' colSpan='2'>Total</th>
                          <th align='center' className='bot-th text-center' colSpan='2'>Today</th>
                          <th align='center' className='bot-th text-center' colSpan='2'>Yesterday</th>
                          <th align='center' className='bot-th text-center' colSpan='2'>Week</th>
                          <th align='center' className='bot-th text-center' colSpan='2'>Month</th>
                          <th align='center' className='bot-th text-center' colSpan='2'>Year</th>
                          <th align='center' rowSpan='2'>Last Update</th>
                          <th align='center' rowSpan='2'>
                            <img className='custom-info' id='PLAY' src={infoIcon} />
                            <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='PLAY'>
                              <p>{Info?.played}</p>
                            </UncontrolledTooltip>
                          </th>
                        </tr>
                        <tr align='center'>
                          <th className='bot-th-1 text-center'>Cash</th>
                          <th className='bot-th-2 text-center'>Bonus</th>
                          <th className='bot-th-1 text-center'>Cash</th>
                          <th className='bot-th-2 text-center'>Bonus</th>
                          <th className='bot-th-1 text-center'>Cash</th>
                          <th className='bot-th-2 text-center'>Bonus</th>
                          <th className='bot-th-1 text-center'>Cash</th>
                          <th className='bot-th-2 text-center'>Bonus</th>
                          <th className='bot-th-1 text-center'>Cash</th>
                          <th className='bot-th-2 text-center'>Bonus</th>
                          <th className='bot-th-1 text-center'>Cash</th>
                          <th className='bot-th-2 text-center'>Bonus</th>
                        </tr>
                      </thead>
                      <tbody>
                        {played?.filter(playedData => sports?.includes(playedData?.eCategory))?.map((data, index) => (
                          <tr key={index} align='center'>
                            <td><b>{data?.eCategory}</b></td>
                            <td>{fixDigit(data?.nTotalCash)}</td>
                            <td>{fixDigit(data?.nTotalBonus)}</td>
                            <td>{fixDigit(data?.nTodayCash)}</td>
                            <td>{fixDigit(data?.nTodayBonus)}</td>
                            <td>{fixDigit(data?.nYesterCash)}</td>
                            <td>{fixDigit(data?.nYesterBonus)}</td>
                            <td>{fixDigit(data?.nWeekCash)}</td>
                            <td>{fixDigit(data?.nWeekBonus)}</td>
                            <td>{fixDigit(data?.nMonthCash)}</td>
                            <td>{fixDigit(data?.nMonthBonus)}</td>
                            <td>{fixDigit(data?.nYearCash)}</td>
                            <td>{fixDigit(data?.nYearBonus)}</td>
                            <td>{dateFormate(data?.dUpdatedAt)}</td>
                            <td>
                              {permission && (
                              <Button color='link' onClick={() => updatePlayedFunc(data?._id, 'PL', data?.eCategory)}>
                                <img alt='Participants' height='20px' src={refreshIcon} width='20px'/>
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
PlayReport.propTypes = {
  dateWiseReports: PropTypes?.string,
  isOpen: PropTypes?.bool,
  sports: PropTypes?.array,
  permission: PropTypes?.string,
  played: PropTypes?.array,
  updatePlayedFunc: PropTypes?.func,
  userType: PropTypes?.string,
  token: PropTypes?.string,
  setLoading: PropTypes?.bool,
  updatedPlayedData: PropTypes?.object,
  previousProps: PropTypes?.object,
  setPlayed: PropTypes?.func
}
export default PlayReport
