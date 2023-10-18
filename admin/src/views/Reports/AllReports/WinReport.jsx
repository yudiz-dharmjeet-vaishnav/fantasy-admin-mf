import React, { useEffect } from 'react'
import { Button, UncontrolledTooltip } from 'reactstrap'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import infoIcon from '../../../assets/images/info-icon.svg'
import refreshIcon from '../../../assets/images/refresh-icon-1.svg'

import DataNotFound from '../../../components/DataNotFound'
import Info from '../../../helpers/info'
import { dateFormate, fixDigit } from '../../../helpers/helper'
import { updateWins } from '../../../actions/reports'

function WinReport (props) {
  const { isOpen, dateWiseReports, sports, permission, Wins, userType, token, setLoading, previousProps, updatedWinsData, setWins } = props
  const dispatch = useDispatch()

  useEffect(() => {
    if (updatedWinsData) {
      if (previousProps?.updatedWinsData !== updatedWinsData) {
        const categoryIndex = Wins?.findIndex((wins) => wins?.eCategory === updatedWinsData?.eCategory)
        const newArray = [...Wins]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotal: updatedWinsData?.nTotal,
          nToday: updatedWinsData?.nToday,
          nYesterday: updatedWinsData?.nYesterday,
          nLastWeek: updatedWinsData?.nLastWeek,
          nLastMonth: updatedWinsData?.nLastMonth,
          nLastYear: updatedWinsData?.nLastYear,
          dUpdatedAt: updatedWinsData?.dUpdatedAt
        }
        setWins(newArray)
      }
    }
    return () => {
      previousProps.updatedWinsData = updatedWinsData
    }
  }, [updatedWinsData])

  // dispatch action to update the wins data
  function updateWinsFunc (id, sportsType) {
    if (token) {
      const updateWinsData = {
        id, sportsType, userType, token
      }
      dispatch(updateWins(updateWinsData))
      setLoading(true)
    }
  }
  return (
    <>
      {isOpen === 'WIN_REPORT' && dateWiseReports && dateWiseReports?.length !== 0 && (
      <section className='user-section'>
        <div className='table-represent-two'>
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr align='center'>
                  <th rowSpan='2'>
                    Category
                    <img className='custom-info' id='WINS' src={infoIcon} />
                    <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='WINS'>
                      <p>{Info?.wins}</p>
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
                {dateWiseReports?.aWins && dateWiseReports?.aWins?.filter(win => sports?.includes(win?.eCategory))?.map((data, index) => (
                  <tr key={index} align='center'>
                    <td><b>{data?.eCategory}</b></td>
                    <td>{fixDigit(data?.nTotalCash)}</td>
                    <td>{fixDigit(data?.nTotalBonus) }</td>
                    <td>{dateFormate(data?.dUpdatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      )}
      {(isOpen === 'WIN_REPORT' && dateWiseReports?.length === 0)
        ? (Wins && Wins?.length > 0)
            ? (
              <section className='user-section'>
                <div className='table-represent-two'>
                  <div className='table-responsive'>
                    <table className='table'>
                      <thead>
                        <tr>
                          <th align='center' rowSpan='2'>Category</th>
                          <th align='center' className='bot-th text-center' colSpan='2'>Total</th>
                          <th align='center' className='bot-th text-center' colSpan='2'>Today</th>
                          <th align='center' className='bot-th text-center' colSpan='2'>Yesterday</th>
                          <th align='center' className='bot-th text-center' colSpan='2'>Week</th>
                          <th align='center' className='bot-th text-center' colSpan='2'>Month</th>
                          <th align='center' className='bot-th text-center' colSpan='2'>Year</th>
                          <th align='center' rowSpan='2'>Last Update</th>
                          <th rowSpan='2'>
                            <img className='custom-info' id='WINS' src={infoIcon} />
                            <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='WINS'>
                              <p>{Info?.wins}</p>
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
                        {Wins?.filter(winsData => sports?.includes(winsData?.eCategory))?.map((data, index) => (
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
                              <Button color='link' onClick={() => updateWinsFunc(data?._id, data?.eCategory)}>
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

WinReport.propTypes = {
  dateWiseReports: PropTypes?.string,
  isOpen: PropTypes?.bool,
  permission: PropTypes?.string,
  sports: PropTypes?.array,
  Wins: PropTypes?.array,
  userType: PropTypes?.string,
  token: PropTypes?.string,
  setLoading: PropTypes?.bool,
  previousProps: PropTypes?.object,
  setWins: PropTypes?.func,
  updatedWinsData: PropTypes?.object

}

export default WinReport
