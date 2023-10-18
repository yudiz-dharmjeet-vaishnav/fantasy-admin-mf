import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Button, UncontrolledTooltip } from 'reactstrap'
import PropTypes from 'prop-types'

import infoIcon from '../../../assets/images/info-icon.svg'
import refreshIcon from '../../../assets/images/refresh-icon-1.svg'

import DataNotFound from '../../../components/DataNotFound'
import Info from '../../../helpers/info'
import { dateFormate, fixDigit } from '../../../helpers/helper'
import { updateCreatorBonusReport } from '../../../actions/reports'

function CreatorBonusReport (props) {
  const { isOpen, dateWiseReports, sports, permission, creatorBonus, token, setLoading, updatedCreatorBonusData, previousProps, setCreatorBonus } = props
  const dispatch = useDispatch()

  // to set updated creator bonus data
  useEffect(() => {
    if (updatedCreatorBonusData) {
      if (previousProps?.updatedCreatorBonusData !== updatedCreatorBonusData) {
        const categoryIndex = creatorBonus?.findIndex((creatorBonusData) => creatorBonusData?.eCategory === updatedCreatorBonusData?.eCategory
        )
        const newArray = [...creatorBonus]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotal: updatedCreatorBonusData?.nTotal,
          nToday: updatedCreatorBonusData?.nToday,
          nYesterday: updatedCreatorBonusData?.nYesterday,
          nLastWeek: updatedCreatorBonusData?.nLastWeek,
          nLastMonth: updatedCreatorBonusData?.nLastMonth,
          nLastYear: updatedCreatorBonusData?.nLastYear,
          dUpdatedAt: updatedCreatorBonusData?.dUpdatedAt
        }
        setCreatorBonus(newArray)
      }
    }
    return () => {
      previousProps.updatedCreatorBonusData = updatedCreatorBonusData
    }
  }, [updatedCreatorBonusData])

  // dispatch action to update the creator bonus data
  function updateCreatorBonusFunc (id, key, sportsType) {
    if (token) {
      const updateCreatorBonusData = {
        id, key, sportsType, token
      }
      dispatch(updateCreatorBonusReport(updateCreatorBonusData))
      setLoading(true)
    }
  }
  return (
    <>

      {isOpen === 'CREATOR_BONUS_REPORT' && dateWiseReports && dateWiseReports?.length !== 0 && (
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
                      <p>{Info?.creatorBonus}</p>
                    </UncontrolledTooltip>
                  </th>
                  <th>Total</th>
                  <th>Last Update</th>
                </tr>
              </thead>
              <tbody>
                {dateWiseReports?.aCreatorBonus && dateWiseReports?.aCreatorBonus?.filter(creatorBonus => sports?.includes(creatorBonus?.eCategory))?.map((data, index) => (
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
      {isOpen === 'CREATOR_BONUS_REPORT' && dateWiseReports?.length === 0
        ? (creatorBonus && creatorBonus?.length > 0)
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
                            <img className='custom-info' id='CREATORBONUS' src={infoIcon} />
                            <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='CREATORBONUS'>
                              <p>{Info?.creatorBonus}</p>
                            </UncontrolledTooltip>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {creatorBonus?.filter(creatorBonusData => sports?.includes(creatorBonusData?.eCategory))?.map((data, index) => (
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
                              <Button color='link' onClick={() => updateCreatorBonusFunc(data?._id, 'CB', data?.eCategory)}>
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

CreatorBonusReport.propTypes = {
  dateWiseReports: PropTypes?.string,
  isOpen: PropTypes?.bool,
  sports: PropTypes?.array,
  permission: PropTypes?.string,
  creatorBonus: PropTypes?.array,
  token: PropTypes?.string,
  setLoading: PropTypes?.bool,
  updatedCreatorBonusData: PropTypes?.object,
  previousProps: PropTypes?.object,
  setCreatorBonus: PropTypes?.func

}

export default CreatorBonusReport
