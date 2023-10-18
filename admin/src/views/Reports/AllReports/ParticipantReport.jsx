import React, { useEffect } from 'react'
import { Button, UncontrolledTooltip } from 'reactstrap'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import infoIcon from '../../../assets/images/info-icon.svg'
import refreshIcon from '../../../assets/images/refresh-icon-1.svg'

import DataNotFound from '../../../components/DataNotFound'
import Info from '../../../helpers/info'
import { dateFormate, fixDigit } from '../../../helpers/helper'
import { updateParticipants } from '../../../actions/reports'

function ParticipantReport (props) {
  const { dateWiseReports, isOpen, Participants, sports, permission, token, setLoading, userType, updatedParticipantsData, previousProps, setParticipants } = props
  const dispatch = useDispatch()

  // to set updated participants data
  useEffect(() => {
    if (updatedParticipantsData) {
      if (previousProps?.updatedParticipantsData !== updatedParticipantsData) {
        const categoryIndex = Participants?.findIndex((participants) => participants?.eCategory === updatedParticipantsData?.eCategory)
        const newArray = [...Participants]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotal: updatedParticipantsData?.nTotal,
          nToday: updatedParticipantsData?.nToday,
          nYesterday: updatedParticipantsData?.nYesterday,
          nLastWeek: updatedParticipantsData?.nLastWeek,
          nLastMonth: updatedParticipantsData?.nLastMonth,
          nLastYear: updatedParticipantsData?.nLastYear,
          dUpdatedAt: updatedParticipantsData?.dUpdatedAt
        }
        setParticipants(newArray)
      }
    }
    return () => {
      previousProps.updatedParticipantsData = updatedParticipantsData
    }
  }, [updatedParticipantsData])

  // dispatch action to update the participants data
  function updateParticipantsFunc (id, sportsType) {
    if (token) {
      const updateParticipantData = {
        id, sportsType, userType, token
      }
      dispatch(updateParticipants(updateParticipantData))
      setLoading(true)
    }
  }
  return (
    <>
      {isOpen === 'PARTICIPANT_REPORT' && dateWiseReports && dateWiseReports.length !== 0 && (
      <section className='user-section'>
        <div className='table-represent-two'>
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr align='center'>
                  <th>
                    Category
                    <img className='custom-info' id='PARTICIPANTS' src={infoIcon} />
                    <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='PARTICIPANTS'>
                      <p>{Info?.participants}</p>
                    </UncontrolledTooltip>
                  </th>
                  <th>Total</th>
                  <th>Last Update</th>
                </tr>
              </thead>
              <tbody>
                {dateWiseReports?.aParticipants && dateWiseReports?.aParticipants?.filter(participants => sports?.includes(participants?.eCategory))?.map((data, index) => (
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
      {isOpen === 'PARTICIPANT_REPORT' && dateWiseReports?.length === 0
        ? (Participants && Participants?.length > 0)
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
                          <th>
                            <img className='custom-info' id='PARTICIPANTS' src={infoIcon} />
                            <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='PARTICIPANTS'>
                              <p>{Info?.participants}</p>
                            </UncontrolledTooltip>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Participants?.filter(participantsData => sports?.includes(participantsData?.eCategory))?.map((data, index) => (
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
                              <Button color='link' onClick={() => updateParticipantsFunc(data?._id, data?.eCategory)}>
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
ParticipantReport.propTypes = {
  dateWiseReports: PropTypes?.string,
  isOpen: PropTypes?.bool,
  sports: PropTypes?.array,
  permission: PropTypes?.string,
  Participants: PropTypes?.array,
  userType: PropTypes?.string,
  token: PropTypes?.string,
  setLoading: PropTypes?.bool,
  previousProps: PropTypes?.object,
  setParticipants: PropTypes?.func,
  updatedParticipantsData: PropTypes?.object

}

export default ParticipantReport
