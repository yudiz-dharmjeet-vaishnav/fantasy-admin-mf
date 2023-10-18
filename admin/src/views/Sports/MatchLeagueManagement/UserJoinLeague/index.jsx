import React, { useRef, Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import UserLeagueList from './UserLeagueList'
import Layout from '../../../../components/Layout'
import SportsMainHeader from '../../SportsMainHeader'

import { getUserLeaguesList } from '../../../../actions/league'

function UserJoinLeague (props) {
  const location = useLocation()
  const { id1, id2 } = useParams()
  const content = useRef()
  const [userName, setUserName] = useState('')
  const [matchName, setMatchName] = useState('')
  const token = useSelector(state => state.auth.token)
  const userLeaguesList = useSelector(state => state.league.userLeaguesList)
  const dispatch = useDispatch()
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''

  useEffect(() => {
    if (userLeaguesList && userLeaguesList[0]) {
      setUserName(userLeaguesList[0].sUserName)
      setMatchName(userLeaguesList[0].sMatchName)
    }
  }, [userLeaguesList])

  function getList (iMatchId, iUserId) {
    dispatch(getUserLeaguesList(iMatchId, iUserId, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function heading () {
    if (userName && matchName) {
      if (window.innerWidth <= 480) {
        return (
          <div>
            User League Management
            {' '}
            <p>{`(${userName} - ${matchName})`}</p>
          </div>
        )
      } else {
        return (
          <div>
            User League Management
            {' '}
            {`(${userName} - ${matchName})`}
          </div>
        )
      }
    }
  }

  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <Fragment>
              <SportsMainHeader
                heading={heading()}
                hidden
                onRefresh={onRefreshFun}
                permission
                refresh = "Refresh"
                userLeaguePage={`/${sportsType}/match-management/match-league-management/user-league/${id1}/${id2}`}
              />
              <UserLeagueList
                {...props}
                ref={content}
                List={userLeaguesList}
                getList={getList}
                sportsType={sportsType}
                userTeamPlayer={`/${sportsType}/match-management/match-league-management/user-league/user-team/user-team-player/${id1}`}
              />
            </Fragment>
          </section>
        </main>
      </Layout>
    </div>
  )
}

UserJoinLeague.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default UserJoinLeague
