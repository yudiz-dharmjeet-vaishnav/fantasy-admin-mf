import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Button, UncontrolledTooltip } from 'reactstrap'
import PropTypes from 'prop-types'

import infoIcon from '../../../assets/images/info-icon.svg'
import refreshIcon from '../../../assets/images/refresh-icon-1.svg'

import DataNotFound from '../../../components/DataNotFound'
import Info from '../../../helpers/info'
import { dateFormate, fixDigit } from '../../../helpers/helper'
import { updateTeams } from '../../../actions/reports'

function UserTeamReports (props) {
  const { dateWiseReports, isOpen, userType, sports, Teams, permission, previousProps, token, setLoading, updatedTeamData, setTeams } = props
  const dispatch = useDispatch()

  // to set updated teams data
  useEffect(() => {
    if (updatedTeamData) {
      if (previousProps?.updatedTeamData !== updatedTeamData) {
        const categoryIndex = Teams?.findIndex((team) => team?.eCategory === updatedTeamData?.eCategory)
        const newArray = [...Teams]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotal: updatedTeamData?.nTotal,
          nToday: updatedTeamData?.nToday,
          nYesterday: updatedTeamData?.nYesterday,
          nLastWeek: updatedTeamData?.nLastWeek,
          nLastMonth: updatedTeamData?.nLastMonth,
          nLastYear: updatedTeamData?.nLastYear,
          dUpdatedAt: updatedTeamData?.dUpdatedAt
        }
        setTeams(newArray)
      }
    }
    return () => {
      previousProps.updatedTeamData = updatedTeamData
    }
  }, [updatedTeamData])

  // dispatch action to update the teams data
  function updateTeamsFunc (id, sportsType) {
    if (token) {
      const updateTeamsData = {
        id, sportsType, userType, token
      }
      dispatch(updateTeams(updateTeamsData))
      setLoading(true)
    }
  }

  return (
    <>
      {isOpen === 'USERTEAM_REPORT' && dateWiseReports && previousProps?.dateWiseReports !== dateWiseReports && dateWiseReports?.length !== 0 && (
      <section className='user-section'>
        <div className='table-represent-two'>
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr align='center'>
                  <th>
                    Category
                    <img className='custom-info' id='USERTEAM' src={infoIcon} />
                    <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='USERTEAM'>
                      <p>{userType === 'U' ? Info?.userTeams?.replace(/##/g, '') : Info?.userTeams?.replace(/##/g, 'System')}</p>
                    </UncontrolledTooltip>
                  </th>
                  <th>Total</th>
                  <th>Last Update</th>
                </tr>
              </thead>
              <tbody>
                {dateWiseReports?.aTeams && dateWiseReports?.aTeams?.filter(teamsData => sports?.includes(teamsData?.eCategory))?.map((data, index) => (
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
      {isOpen === 'USERTEAM_REPORT' && dateWiseReports?.length === 0
        ? (Teams && Teams?.length > 0)
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
                            <img className='custom-info' id='USERTEAM' src={infoIcon} />
                            <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='USERTEAM'>
                              <p>{userType === 'U' ? Info?.userTeams?.replace(/##/g, '') : Info?.userTeams?.replace(/##/g, 'System')}</p>
                            </UncontrolledTooltip>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Teams?.filter(teamsData => sports?.includes(teamsData?.eCategory))?.map((data, index) => (
                          <tr key={index} align='center'>
                            <td><b>{data?.eCategory}</b></td>
                            <td>{fixDigit(data?.nTotal)}</td>
                            <td>{fixDigit(data?.nToday)}</td>
                            <td>{fixDigit(data?.nYesterday)}</td>
                            <td>{fixDigit(data?.nLastWeek)}</td>
                            <td>{fixDigit(data?.nLastMonth)}</td>
                            <td>{fixDigit(data?.nLastYear)}</td>
                            <td>{dateFormate(data?.dUpdatedAt) }</td>
                            <td>
                              {permission && (
                              <Button color='link' onClick={() => updateTeamsFunc(data?._id, data?.eCategory)}>
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

UserTeamReports.propTypes = {
  dateWiseReports: PropTypes?.string,
  isOpen: PropTypes?.bool,
  userType: PropTypes?.string,
  sports: PropTypes?.array,
  Teams: PropTypes?.array,
  permission: PropTypes?.string,
  previousProps: PropTypes?.object,
  token: PropTypes?.string,
  setLoading: PropTypes?.bool,
  updatedTeamData: PropTypes?.object,
  setTeams: PropTypes?.func
}
export default UserTeamReports
