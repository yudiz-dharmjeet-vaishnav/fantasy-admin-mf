import React, { useEffect } from 'react'
import { Button, UncontrolledTooltip } from 'reactstrap'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import infoIcon from '../../../assets/images/info-icon.svg'
import refreshIcon from '../../../assets/images/refresh-icon-1.svg'

import DataNotFound from '../../../components/DataNotFound'
import Info from '../../../helpers/info'
import { dateFormate, fixDigit } from '../../../helpers/helper'
import { updateCreatorBonusReturnReport } from '../../../actions/reports'

function CreatorBonusReturnReport (props) {
  const { isOpen, dateWiseReports, sports, permission, creatorBonusReturn, token, setLoading, updatedCreatorBonusReturnData, previousProps, setCreatorBonusReturn } = props
  const dispatch = useDispatch()

  useEffect(() => {
    if (updatedCreatorBonusReturnData) {
      if (previousProps?.updatedCreatorBonusReturnData !== updatedCreatorBonusReturnData) {
        const categoryIndex = creatorBonusReturn?.findIndex((creatorBonusReturnData) => creatorBonusReturnData?.eCategory === updatedCreatorBonusReturnData?.eCategory)
        const newArray = [...creatorBonusReturn]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotal: updatedCreatorBonusReturnData?.nTotal,
          nToday: updatedCreatorBonusReturnData?.nToday,
          nYesterday: updatedCreatorBonusReturnData?.nYesterday,
          nLastWeek: updatedCreatorBonusReturnData?.nLastWeek,
          nLastMonth: updatedCreatorBonusReturnData?.nLastMonth,
          nLastYear: updatedCreatorBonusReturnData?.nLastYear,
          dUpdatedAt: updatedCreatorBonusReturnData?.dUpdatedAt
        }
        setCreatorBonusReturn(newArray)
      }
    }
    return () => {
      previousProps.updatedCreatorBonusReturnData = updatedCreatorBonusReturnData
    }
  }, [updatedCreatorBonusReturnData])

  // dispatch action to update the creator bonus return data
  function updateCreatorBonusReturnFunc (id, key, sportsType) {
    if (token) {
      const updateCreatorBonusReturnData = {
        id, key, sportsType, token
      }
      dispatch(updateCreatorBonusReturnReport(updateCreatorBonusReturnData))
      setLoading(true)
    }
  }
  return (
    <>
      {isOpen === 'CREATOR_BONUS_RETURN_REPORT' && dateWiseReports && dateWiseReports?.length !== 0 && (
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
                      <p>{Info?.creatorBonusReturn}</p>
                    </UncontrolledTooltip>
                  </th>
                  <th>Total</th>
                  <th>Last Update</th>
                </tr>
              </thead>
              <tbody>
                {dateWiseReports?.aCreatorBonusReturn && dateWiseReports?.aCreatorBonusReturn?.filter(creatorBonusReturn => sports?.includes(creatorBonusReturn?.eCategory))?.map((data, index) => (
                  <tr key={index} align='center'>
                    <td><b>{data?.eCategory}</b></td>
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
      {isOpen === 'CREATOR_BONUS_RETURN_REPORT' && dateWiseReports?.length === 0
        ? (creatorBonusReturn && creatorBonusReturn?.length > 0)
            ? (
              <section className='user-section'>
                <div className='table-represent-two'>
                  <div className='table-responsive'>
                    <table className='table'>
                      <thead>
                        <tr align='center'>
                          <th>Category</th>
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
                              <p>{Info?.creatorBonusReturn}</p>
                            </UncontrolledTooltip>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {creatorBonusReturn?.filter(creatorBonusReturnData => sports?.includes(creatorBonusReturnData?.eCategory))?.map((data, index) => (
                          <tr key={index} align='center'>
                            <td><b>{data?.eCategory}</b></td>
                            <td>{fixDigit(data?.nTotal)}</td>
                            <td>{fixDigit(data?.nToday)}</td>
                            <td>{fixDigit(data?.nYesterday)}</td>
                            <td>{fixDigit(data?.nLastWeek)}</td>
                            <td>{fixDigit(data?.nLastMonth)}</td>
                            <td>{fixDigit(data?.nLastYear)}</td>
                            <td>{dateFormate(data?.dUpdatedAt)}</td>
                            <td>
                              {permission && (
                              <Button color='link' onClick={() => updateCreatorBonusReturnFunc(data?._id, 'CBR', data?.eCategory)}>
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
CreatorBonusReturnReport.propTypes = {
  dateWiseReports: PropTypes?.string,
  isOpen: PropTypes?.bool,
  sports: PropTypes?.array,
  permission: PropTypes?.string,
  creatorBonusReturn: PropTypes.array,
  token: PropTypes.string,
  setLoading: PropTypes.bool,
  updatedCreatorBonusReturnData: PropTypes?.object,
  previousProps: PropTypes?.object,
  setCreatorBonusReturn: PropTypes?.func
}

export default CreatorBonusReturnReport
