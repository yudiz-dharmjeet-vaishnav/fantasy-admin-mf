import React, { useEffect } from 'react'
import { Button, UncontrolledTooltip } from 'reactstrap'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import infoIcon from '../../../assets/images/info-icon.svg'
import refreshIcon from '../../../assets/images/refresh-icon-1.svg'

import DataNotFound from '../../../components/DataNotFound'
import Info from '../../../helpers/info'
import { dateFormate, fixDigit } from '../../../helpers/helper'
import { updateCashbackReturnReport } from '../../../actions/reports'

function CashbackReturnReport (props) {
  const { isOpen, dateWiseReports, sports, permission, cashbackReturn, userType, token, setLoading, updatedCashbackReturnData, previousProps, setCashbackReturn } = props
  const dispatch = useDispatch()

  // to set updated cashback return data
  useEffect(() => {
    if (updatedCashbackReturnData) {
      if (previousProps?.updatedCashbackReturnData !== updatedCashbackReturnData) {
        const categoryIndex = cashbackReturn?.findIndex(
          (cashbackReturnData) => cashbackReturnData?.eCategory === updatedCashbackReturnData?.eCategory
        )
        const newArray = [...cashbackReturn]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotalCash: updatedCashbackReturnData?.nTotalCash,
          nTotalBonus: updatedCashbackReturnData?.nTotalBonus,
          nTodayCash: updatedCashbackReturnData?.nTodayCash,
          nTodayBonus: updatedCashbackReturnData?.nTodayBonus,
          nYesterCash: updatedCashbackReturnData?.nYesterCash,
          nYesterBonus: updatedCashbackReturnData?.nYesterBonus,
          nWeekCash: updatedCashbackReturnData?.nWeekCash,
          nWeekBonus: updatedCashbackReturnData?.nWeekBonus,
          nMonthCash: updatedCashbackReturnData?.nMonthCash,
          nMonthBonus: updatedCashbackReturnData?.nMonthBonus,
          nYearCash: updatedCashbackReturnData?.nYearCash,
          nYearBonus: updatedCashbackReturnData?.nYearBonus,
          dUpdatedAt: updatedCashbackReturnData?.dUpdatedAt
        }
        setCashbackReturn(newArray)
      }
    }
    return () => {
      previousProps.updatedCashbackReturnData = updatedCashbackReturnData
    }
  }, [updatedCashbackReturnData])

  // dispatch action to update the cashback return data
  function updateCashbackReturnFunc (id, key, sportsType) {
    if (token) {
      const updateCashbackReturnData = {
        id, key, sportsType, userType, token
      }
      dispatch(updateCashbackReturnReport(updateCashbackReturnData))
      setLoading(true)
    }
  }
  return (
    <>
      {isOpen === 'CASHBACK_RETURN_REPORT' && dateWiseReports?.length !== 0 && (
      <section className='user-section'>
        <div className='table-represent-two'>
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr align='center'>
                  <th align='center' rowSpan='2'>
                    Category
                    <img className='custom-info' id='PLAY' src={infoIcon} />
                    <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='PLAY'>
                      <p>{Info?.cashbackReturn}</p>
                    </UncontrolledTooltip>
                  </th>
                  <th align='center' className='bot-th text-center' colSpan='2'>Total</th>
                  <th align='center' rowSpan='2'>Last Update</th>
                </tr>
                <tr align='center'>
                  <th className='bot-th-1 text-center'>Cash</th>
                  <th className='bot-th-2 text-center'>Bonus</th>
                </tr>
              </thead>
              <tbody>
                {dateWiseReports?.aCashbackReturn && dateWiseReports?.aCashbackReturn?.filter(cashbackReturnData => sports?.includes(cashbackReturnData?.eCategory))?.map((data, index) => (
                  <tr key={index} align='center'>
                    <td>
                      <b>{data?.eCategory}</b>
                    </td>
                    <td>{Number?.isInteger(data?.nTotalCash) ? Number(data?.nTotalCash) : Number(data?.nTotalCash)?.toFixed(2)}</td>
                    <td>{Number?.isInteger(data?.nTotalBonus) ? Number(data?.nTotalBonus) : Number(data?.nTotalBonus)?.toFixed(2)}</td>
                    <td>{dateFormate(data?.dUpdatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      )}
      {isOpen === 'CASHBACK_RETURN_REPORT' && dateWiseReports?.length === 0
        ? (cashbackReturn && cashbackReturn?.length > 0)
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
                            <img className='custom-info' id='CASHBACKRETURN' src={infoIcon} />
                            <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='CASHBACKRETURN'>
                              <p>{Info?.cashbackReturn}</p>
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
                        {cashbackReturn?.filter(cashbackReturnData => sports?.includes(cashbackReturnData?.eCategory))?.map((data, index) => (
                          <tr key={index} align='center'>
                            <td><b>{data?.eCategory}</b></td>
                            <td>{fixDigit(data?.nTotalCash)}</td>
                            <td>{fixDigit(data?.nTotalBonus) }</td>
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
                              <Button color='link' onClick={() => updateCashbackReturnFunc(data?._id, 'CR', data?.eCategory)}>
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
CashbackReturnReport.propTypes = {
  dateWiseReports: PropTypes?.string,
  isOpen: PropTypes?.bool,
  sports: PropTypes?.array,
  permission: PropTypes?.string,
  cashbackReturn: PropTypes?.array,
  userType: PropTypes?.string,
  token: PropTypes?.string,
  setLoading: PropTypes?.bool,
  updatedCashbackReturnData: PropTypes?.object,
  previousProps: PropTypes?.object,
  setCashbackReturn: PropTypes?.object
}

export default CashbackReturnReport
