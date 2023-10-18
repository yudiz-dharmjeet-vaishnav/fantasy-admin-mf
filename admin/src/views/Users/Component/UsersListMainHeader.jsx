import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import { useSelector } from 'react-redux'
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom'

import backIcon from '../../../assets/images/back-icon-1.svg'
import exportIcon from '../../../assets/images/export-icon.svg'

// common header for user,delete user and Kyc Details
function UsersListMainHeader (props) {
  const {
    heading,
    list,
    UserDetails,
    SystemUserDetails,
    UpdatePushNotification,
    submitDisableButton,
    onSubmit,
    cancelLink,
    UserDebugger,
    systemUser,
    userDetailsPage,
    RefferalsDetails
  } = props
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  return (
    <div className="header-block-main-user">
      <div className="d-flex justify-content-between align-items-center">
        <div className='d-flex inline-input'>
          {props.isSystemUserToPassbook && (
          <>
            <img
              className='custom-go-back'
              height='24'
              onClick={() => navigate({
                pathname: `/users/system-user/system-user-details/${props.userToPassbookId}`,
                state: { isSeriesLeaderBoardUserRank: props.isSeriesLeaderBoardUserRank, SeriesLeaderBoardUserRankLink: props.SeriesLeaderBoardUserRankLink, userList: !props.isSeriesLeaderBoardUserRank, systemUserList: !props.isSeriesLeaderBoardUserRank }
              })}
              src={backIcon}
              width='24'
            />
          </>
          )}
          {props.isUserToPassbook && (
          <>
            <img
              className='custom-go-back'
              height='24'
              onClick={() => navigate({
                pathname: `/users/user-management/user-details/${props.userToPassbookId}`,
                state: { isSeriesLeaderBoardUserRank: props.isSeriesLeaderBoardUserRank, SeriesLeaderBoardUserRankLink: props.SeriesLeaderBoardUserRankLink, userList: !props.isSeriesLeaderBoardUserRank }
              })}
              src={backIcon}
              width='24'
            />
          </>
          )}
          {props.isLeagueToPassbook && (
          <img
            className='custom-go-back'
            height='24'
            onClick={() => navigate({
              pathname: `/cricket/match-management/match-league-management/${props.leagueToPassbookId}`,
              state: { userList: true },
              search: page?.MatchLeagueManagement || ''
            })}
            src={backIcon}
            width='24'
          />
          )}
          {props.isLeagueToTds && (
          <img
            className='custom-go-back'
            height='24'
            onClick={() => navigate({
              pathname: `/cricket/match-management/match-league-management/${props.leagueToTdsId}`,
              state: { userList: true },
              search: page?.MatchLeagueManagement || ''
            })}
            src={backIcon}
            width='24'
          />
          )}
          {props.isTransactionReport && (
          <img
            className='custom-go-back'
            height='24'
            onClick={() => navigate({
              pathname: '/users/passbook',
              state: { location }
            })}
            src={backIcon}
            width='24'
          />
          )}
          {SystemUserDetails && (
          <div>
            <img
              className='custom-go-back'
              onClick={() => (location.state && location.state.systemUserList)
                ? navigate(`/users/system-users${page?.SystemUser || ''}`)
                : props?.location?.state?.isSeriesLeaderBoardUserRank
                  ? navigate(location.state.SeriesLeaderBoardUserRankLink)
                  : navigate(-1)}
              src={backIcon}
            />
          </div>
          )}
          {UserDetails && (
          <img
            className='custom-go-back ml-3'
            height='24'
            onClick={() => (location.state && location.state.userList)
              ? navigate({
                pathname: `/users/user-management${page?.UserManagement || ''}`,
                state: { ...location.state }
              })
              : props?.location?.state?.isSeriesLeaderBoardUserRank
                ? navigate(location.state.SeriesLeaderBoardUserRankLink)
                : (location.state && location.state.userList)
                    ? navigate(`/users/deleted-users${page?.UserManagement || ''}`)
                    : navigate(-1)}
            src={backIcon}
            width='24'
          />
          )}
          {UserDebugger && (
          <img
            className='custom-go-back'
            onClick={() => location?.state?.goBack === 'yes'
              ? navigate(-1)
              : systemUser
                ? navigate(`/users/system-users${page?.SystemUser || ''}`)
                : location?.state?.userList
                  ? navigate(`/users/user-management${page?.UserManagement || ''}`, { state: { ...location?.state } })
                  : location?.state?.deletedUsersList
                    ? navigate(`/users/deleted-users${page?.UserManagement || ''}`)
                    : navigate(-1)}
            src={backIcon}
          />
          )}
          {UpdatePushNotification
            ? (
              <img
                className='custom-go-back mr-2'
                height={22}
                onClick={() => navigate(`${cancelLink}`)}
                src={backIcon}
                width={22}
              />
              )
            : ''
                    }
          {
              userDetailsPage && (
              <img
                className='custom-go-back'
                height='24'
                onClick={() => navigate({
                  pathname: userDetailsPage
                })}
                src={backIcon}
                width='24'
              />
              )}
          {window.innerWidth <= 480
            ? (
              <div>
                <h3 className='mb-0 ml-3'>{heading}</h3>
                {' '}
                <p>
                  {props.leagueToTdsMatch && `(${props?.leagueToTdsMatch} - ${props.leagueToTdsLeague})`}
                  {' '}
                  {props.leagueToPassbookMatch && `(${props?.leagueToPassbookMatch} - ${props.leagueToPassbookLeague})`}
                </p>
              </div>
              )
            : (
              <h2 className='user-heading-h2 ml-3'>
                {heading}
                {' '}
                {props.leagueToTdsMatch && `(${props?.leagueToTdsMatch} - ${props.leagueToTdsLeague})`}
                {' '}
                {props.leagueToPassbookMatch && `(${props?.leagueToPassbookMatch} - ${props.leagueToPassbookLeague})`}
              </h2>
              )}

        </div>

        <div className="btn-list-user">
          {UpdatePushNotification && <Button className="theme-btn icon-btn-cancel mr-2" tag={Link} to="/users/push-notification/automated-notification">Cancel</Button>}
          {props.onExport && list && ((list.rows && list.rows.length > 0) || (list.results && list.results.length > 0) || (list.total > 0) || (list.length > 0)) && (
          <Button className="theme-btn icon-btn-export " onClick={props.onExport}>
            <img alt="add" src={exportIcon} />
            Export
          </Button>
          )}
          {RefferalsDetails && (
          <Button className="theme-btn icon-btn-export " onClick={props.onExport}>
            <img alt="add" src={exportIcon} />
            Export
          </Button>
          )}
          {props.refresh && (
          <Button className="theme-btn icon-btn-refresh  refresh" onClick={props.onRefresh}>
            {props.refresh}
          </Button>
          )}
          {UserDetails && <Button className='icon-user d-inline-flex align-items-center justify-content-center' state= {{ goBack: 'yes' } } tag={Link} to={{ pathname: '/users/user-management/user-debugger-page/' + id }}>Go To User Debugger</Button>}
          {SystemUserDetails && <Button className='icon-user d-inline-flex align-items-center justify-content-center' state= {{ goBack: 'yes' } } tag={Link} to={{ pathname: '/users/system-user/system-user-debugger-page/' + id }}>Go To System User Debugger</Button>}

          { UpdatePushNotification &&
              ((Auth && Auth === 'SUPER') || (adminPermission?.PUSHNOTIFICATION !== 'R')) &&
              (
              <Fragment>
                <Button className="theme-btn " disabled={submitDisableButton} onClick={onSubmit}>
                  Save Changes
                </Button>
              </Fragment>
              )
              }
        </div>
      </div>
    </div>
  )
}
UsersListMainHeader.propTypes = {
  onExport: PropTypes.func,
  refresh: PropTypes.bool,
  onRefresh: PropTypes.func,
  userDetailsPage: PropTypes.string,
  isUserToPassbook: PropTypes.bool,
  isSystemUserToPassbook: PropTypes.bool,
  isTdsToPassbook: PropTypes.bool,
  isLeagueToPassbook: PropTypes.bool,
  isLeagueToTds: PropTypes.bool,
  heading: PropTypes.string,
  list: PropTypes.object,
  leagueToTdsMatch: PropTypes.String,
  leagueToTdsLeague: PropTypes.string,
  leagueToPassbookMatch: PropTypes.String,
  userToPassbookId: PropTypes.string,
  leagueToPassbookId: PropTypes.string,
  leagueToTdsId: PropTypes.string,
  leagueToPassbookLeague: PropTypes.string,
  location: PropTypes.object,
  match: PropTypes.object,
  UserDetails: PropTypes.bool,
  SystemUserDetails: PropTypes.bool,
  UpdatePushNotification: PropTypes.bool,
  submitDisableButton: PropTypes.bool,
  onSubmit: PropTypes.func,
  cancelLink: PropTypes.string,
  UserDebugger: PropTypes.bool,
  systemUser: PropTypes.bool,
  isTransactionReport: PropTypes.bool,
  isSeriesLeaderBoardUserRank: PropTypes.bool,
  SeriesLeaderBoardUserRankLink: PropTypes.string,
  RefferalsDetails: PropTypes.bool

}

export default UsersListMainHeader
