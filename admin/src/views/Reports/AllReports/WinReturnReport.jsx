import React, { useEffect } from 'react'
import { Button, UncontrolledTooltip } from 'reactstrap'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import infoIcon from '../../../assets/images/info-icon.svg'
import refreshIcon from '../../../assets/images/refresh-icon-1.svg'

import DataNotFound from '../../../components/DataNotFound'
import Info from '../../../helpers/info'
import { dateFormate, fixDigit } from '../../../helpers/helper'
import { updateWinReturn } from '../../../actions/reports'

function WinReturnReport (props) {
  const { isOpen, dateWiseReports, permission, WinReturn, sports, token, userType, setLoading, updatedWinReturnData, previousProps, setWinReturn } = props
  const dispatch = useDispatch()

  useEffect(() => {
    if (updatedWinReturnData) {
      if (previousProps?.updatedWinReturnData !== updatedWinReturnData) {
        const categoryIndex = WinReturn?.findIndex((winReturn) => winReturn?.eCategory === updatedWinReturnData?.eCategory)
        const newArray = [...WinReturn]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotal: updatedWinReturnData?.nTotal,
          nToday: updatedWinReturnData?.nToday,
          nYesterday: updatedWinReturnData?.nYesterday,
          nLastWeek: updatedWinReturnData?.nLastWeek,
          nLastMonth: updatedWinReturnData?.nLastMonth,
          nLastYear: updatedWinReturnData?.nLastYear,
          dUpdatedAt: updatedWinReturnData?.dUpdatedAt
        }
        setWinReturn(newArray)
      }
    }
    return () => {
      previousProps.updatedWinReturnData = updatedWinReturnData
    }
  }, [updatedWinReturnData])

  // dispatch action to update the winReturn data
  function updateWinReturnFunc (id, sportsType) {
    if (token) {
      const updateWinsData = {
        id, sportsType, userType, token
      }
      dispatch(updateWinReturn(updateWinsData))
      setLoading(true)
    }
  }

  return (
    <>
      {isOpen === 'WIN_RETURN_REPORT' && dateWiseReports?.length !== 0 && (
      <section className='user-section'>
        <div className='table-represent-two'>
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr align='center'>
                  <th rowSpan='2'>
                    Category
                    <img className='custom-info' id='WIN_RETURN' src={infoIcon} />
                    <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='WIN_RETURN'>
                      <p>{Info.winReturn}</p>
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
                {dateWiseReports?.aWinReturn && dateWiseReports?.aWinReturn?.filter(winReturn => sports?.includes(winReturn?.eCategory))?.map((data, index) => (
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
      {isOpen === 'WIN_RETURN_REPORT' && dateWiseReports?.length === 0
        ? (WinReturn && WinReturn?.length > 0)
            ? (
              <section className='user-section'>
                <div className='table-represent-two'>
                  <div className='table-responsive'>
                    <table className='table'>
                      <thead>
                        <tr align='center'>
                          <th align='center' rowSpan='2' >Category</th>
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
                              <p>{Info?.winReturn}</p>
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
                        {WinReturn?.filter(winReturnData => sports?.includes(winReturnData?.eCategory))?.map((data, index) => (
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
                              <Button color='link' onClick={() => updateWinReturnFunc(data?._id, data?.eCategory)}>
                                <img alt='WinReturn' height='20px' src={refreshIcon} width='20px'/>
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
WinReturnReport.propTypes = {
  dateWiseReports: PropTypes?.string,
  isOpen: PropTypes?.bool,
  sports: PropTypes?.array,
  permission: PropTypes?.string,
  WinReturn: PropTypes?.array,
  userType: PropTypes?.string,
  token: PropTypes?.string,
  setLoading: PropTypes?.bool,
  setWinReturn: PropTypes?.func,
  updatedWinReturnData: PropTypes?.object,
  previousProps: PropTypes?.object
}
export default WinReturnReport
