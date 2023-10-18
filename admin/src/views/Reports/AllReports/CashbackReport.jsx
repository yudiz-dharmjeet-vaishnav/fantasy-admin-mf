import React, { useEffect } from 'react'
import { Button, UncontrolledTooltip } from 'reactstrap'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import infoIcon from '../../../assets/images/info-icon.svg'
import refreshIcon from '../../../assets/images/refresh-icon-1.svg'

import DataNotFound from '../../../components/DataNotFound'
import Info from '../../../helpers/info'
import { dateFormate, fixDigit } from '../../../helpers/helper'
import { updateCashbackReport } from '../../../actions/reports'

function CashbackReport (props) {
  const { isOpen, dateWiseReports, sports, permission, cashback, userType, token, setLoading, setCashback, previousProps, updatedCashbackData } = props
  const dispatch = useDispatch()

  // to set updated cashback data
  useEffect(() => {
    if (updatedCashbackData) {
      if (previousProps?.updatedCashbackData !== updatedCashbackData) {
        const categoryIndex = cashback?.findIndex(
          (cashbackData) => cashbackData?.eCategory === updatedCashbackData?.eCategory
        )
        const newArray = [...cashback]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotalCash: updatedCashbackData?.nTotalCash,
          nTotalBonus: updatedCashbackData?.nTotalBonus,
          nTodayCash: updatedCashbackData?.nTodayCash,
          nTodayBonus: updatedCashbackData?.nTodayBonus,
          nYesterCash: updatedCashbackData?.nYesterCash,
          nYesterBonus: updatedCashbackData?.nYesterBonus,
          nWeekCash: updatedCashbackData?.nWeekCash,
          nWeekBonus: updatedCashbackData?.nWeekBonus,
          nMonthCash: updatedCashbackData?.nMonthCash,
          nMonthBonus: updatedCashbackData?.nMonthBonus,
          nYearCash: updatedCashbackData?.nYearCash,
          nYearBonus: updatedCashbackData?.nYearBonus,
          dUpdatedAt: updatedCashbackData?.dUpdatedAt
        }
        setCashback(newArray)
      }
    }
    return () => {
      previousProps.updatedCashbackData = updatedCashbackData
    }
  }, [updatedCashbackData])

  // dispatch action to update the cashback return data
  function updateCashbackFunc (id, key, sportsType) {
    if (token) {
      const updateCashbackData = {
        id, key, sportsType, userType, token
      }
      dispatch(updateCashbackReport(updateCashbackData))
      setLoading(true)
    }
  }

  return (
    <>
      {isOpen === 'CASHBACK_REPORT' && dateWiseReports?.length !== 0 && (
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
                      <p>{Info?.cashback}</p>
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
                {dateWiseReports?.aCashback && dateWiseReports?.aCashback?.filter(cashbackData => sports?.includes(cashbackData?.eCategory))?.map((data, index) => (
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

      {isOpen === 'CASHBACK_REPORT' && dateWiseReports?.length === 0
        ? (cashback && cashback?.length > 0)
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
                            <img className='custom-info' id='CASHBACK' src={infoIcon} />
                            <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='CASHBACK'>
                              <p>{Info?.cashback}</p>
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
                        {cashback?.filter(cashbackData => sports?.includes(cashbackData?.eCategory))?.map((data, index) => (
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
                            <td>{dateFormate(data.dUpdatedAt)}</td>
                            <td>
                              {permission && (
                              <Button color='link' onClick={() => updateCashbackFunc(data._id, 'CC', data?.eCategory)}>
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
CashbackReport.propTypes = {
  dateWiseReports: PropTypes?.string,
  isOpen: PropTypes?.bool,
  sports: PropTypes?.array,
  permission: PropTypes?.string,
  cashback: PropTypes?.array,
  userType: PropTypes?.string,
  token: PropTypes?.string,
  setLoading: PropTypes?.bool,
  setCashback: PropTypes?.func,
  previousProps: PropTypes?.object,
  updatedCashbackData: PropTypes?.object
}

export default CashbackReport
