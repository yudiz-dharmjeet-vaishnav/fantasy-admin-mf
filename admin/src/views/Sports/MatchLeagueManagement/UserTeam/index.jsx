import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import UserTeamList from './UserTeamList'
import PropTypes from 'prop-types'

import Layout from '../../../../components/Layout'
import SportsMainHeader from '../../SportsMainHeader'

import { getUserTeamList } from '../../../../actions/matchleague'

function UserTeam (props) {
  const location = useLocation()
  const { id1, id2 } = useParams()
  const content = useRef()
  const token = useSelector(state => state.auth.token)
  const userTeamList = useSelector(state => state.matchleague.userTeamList)
  const dispatch = useDispatch()
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''

  function getList (iMatchId, iUserId) {
    dispatch(getUserTeamList(iMatchId, iUserId, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <SportsMainHeader
              heading="User Teams"
              hidden
              onRefresh={onRefreshFun}
              permission
              refresh="Refresh"
              userLeaguePage={`/${sportsType}/match-management/match-league-management/user-league/${id1}/${id2}`}
            />
            <UserTeamList
              {...props}
              ref={content}
              List={userTeamList}
              getList={getList}
              userTeam={`/${sportsType}/match-management/match-league-management/user-league/user-team/user-team-player/${id1}`}
            />
          </section>
        </main>
      </Layout>
    </div>
  )
}

UserTeam.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default UserTeam
