import React, { useEffect } from 'react'
import { Button, UncontrolledTooltip } from 'reactstrap'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import infoIcon from '../../../assets/images/info-icon.svg'
import refreshIcon from '../../../assets/images/refresh-icon-1.svg'

import DataNotFound from '../../../components/DataNotFound'
import Info from '../../../helpers/info'
import { dateFormate, fixDigit } from '../../../helpers/helper'
import { updatePlayReturnReport } from '../../../actions/reports'

function PlayReturnReport (props) {
  const { dateWiseReports, isOpen, sports, permission, playReturn, token, userType, setLoading, updatedPlayReturnData, previousProps, setPlayReturn } = props
  const dispatch = useDispatch()

  // to set updated play return data
  useEffect(() => {
    if (updatedPlayReturnData) {
      if (previousProps?.updatedPlayReturnData !== updatedPlayReturnData) {
        const categoryIndex = playReturn?.findIndex(
          (playReturnData) => playReturnData?.eCategory === updatedPlayReturnData?.eCategory
        )
        const newArray = [...playReturn]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotalCash: updatedPlayReturnData?.nTotalCash,
          nTotalBonus: updatedPlayReturnData?.nTotalBonus,
          nTodayCash: updatedPlayReturnData?.nTodayCash,
          nTodayBonus: updatedPlayReturnData?.nTodayBonus,
          nYesterCash: updatedPlayReturnData?.nYesterCash,
          nYesterBonus: updatedPlayReturnData?.nYesterBonus,
          nWeekCash: updatedPlayReturnData?.nWeekCash,
          nWeekBonus: updatedPlayReturnData?.nWeekBonus,
          nMonthCash: updatedPlayReturnData?.nMonthCash,
          nMonthBonus: updatedPlayReturnData?.nMonthBonus,
          nYearCash: updatedPlayReturnData?.nYearCash,
          nYearBonus: updatedPlayReturnData?.nYearBonus,
          dUpdatedAt: updatedPlayReturnData?.dUpdatedAt
        }
        setPlayReturn(newArray)
      }
    }
    return () => {
      previousProps.updatedPlayReturnData = updatedPlayReturnData
    }
  }, [updatedPlayReturnData])

  // dispatch action to update the play return data
  function updatePlayReturnFunc (id, key, sportsType) {
    if (token) {
      const updatePlayReturnData = {
        id, key, sportsType, userType, token
      }
      dispatch(updatePlayReturnReport(updatePlayReturnData))
      setLoading(true)
    }
  }
  return (
    <>
      {isOpen === 'PLAY_RETURN_REPORT' && dateWiseReports?.length !== 0 && (
      <section className='user-section'>
        <div className='table-represent-two'>
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr align='center'>
                  <th rowSpan='2'>
                    Category
                    <img className='custom-info' id='PLAYRETURN' src={infoIcon} />
                    <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='PLAYRETURN'>
                      <p>{Info?.playReturn}</p>
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
                {dateWiseReports?.aPlayReturn && dateWiseReports?.aPlayReturn?.filter(playReturnData => sports?.includes(playReturnData?.eCategory))?.map((data, index) => (
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
      {isOpen === 'PLAY_RETURN_REPORT' && dateWiseReports?.length === 0
        ? (playReturn && playReturn?.length > 0)
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
                            <img className='custom-info' id='PLAYRETURN' src={infoIcon} />
                            <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='PLAYRETURN'>
                              <p>{Info?.playReturn}</p>
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
                        {playReturn?.filter(playReturnData => sports?.includes(playReturnData?.eCategory))?.map((data, index) => (
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
                              <Button color='link' onClick={() => updatePlayReturnFunc(data?._id, 'PR', data?.eCategory)}>
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
PlayReturnReport.propTypes = {
  dateWiseReports: PropTypes?.string,
  isOpen: PropTypes?.bool,
  sports: PropTypes?.array,
  permission: PropTypes?.string,
  playReturn: PropTypes?.array,
  userType: PropTypes?.string,
  token: PropTypes?.string,
  setLoading: PropTypes?.bool,
  updatedPlayReturnData: PropTypes?.object,
  setPlayReturn: PropTypes?.func,
  previousProps: PropTypes?.object
}
export default PlayReturnReport
