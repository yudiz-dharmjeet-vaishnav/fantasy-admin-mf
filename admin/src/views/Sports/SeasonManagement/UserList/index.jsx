import React, { Fragment, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import UsersList from './UsersList'
import Layout from '../../../../components/Layout'
import SportsMainHeader from '../../SportsMainHeader'
import { getSeasonDetails, getUsersListInSeason, seasonDataExport } from '../../../../actions/season'

const UserListManagement = props => {
  const location = useLocation()
  const { id } = useParams()
  const content = useRef()
  const dispatch = useDispatch()
  const usersListInSeason = useSelector(state => state.season.usersListInSeason)
  const seasonDetails = useSelector(state => state.season.seasonDetails)
  const fullSeasonList = useSelector(state => state.season.fullSeasonList)
  const token = useSelector(state => state.auth.token)
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('baseball') ? 'baseball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''

  // dispatch action to get users list of particular season
  function getList (start, limit) {
    const data = { start, limit, seasonId: id, token }
    dispatch(getUsersListInSeason(data))
  }

  function getSeasonDetailsFunc () {
    dispatch(getSeasonDetails(id, token))
  }

  function getSeasonDataFunc () {
    dispatch(seasonDataExport(id, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function onExport () {
    content.current.onExport()
  }

  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <Fragment>
              <SportsMainHeader
                heading='User List'
                list={usersListInSeason?.results}
                onExportReport={onExport}
                onRefresh={onRefreshFun}
                refresh = 'Refresh User list'
                seasonListPage={`/${sportsType}/season-management`}
                seasonName = {`(${seasonDetails && seasonDetails.sName})`}
              />

              <div className={fullSeasonList || fullSeasonList === undefined ? 'without-pagination' : 'setting-component'}>
                <UsersList
                  {...props}
                  ref={content}
                  fullSeasonList={fullSeasonList}
                  getList={getList}
                  getSeasonDataFunc={getSeasonDataFunc}
                  getSeasonDetailsFunc={getSeasonDetailsFunc}
                  sportsType={sportsType}
                  systemUserDetailsPage='/users/system-user/system-user-details'
                  userDetailsPage='/users/user-management/user-details'
                  usersList={usersListInSeason}
                />
              </div>
            </Fragment>
          </section>
        </main>
      </Layout>
    </div>
  )
}

UserListManagement.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default UserListManagement
