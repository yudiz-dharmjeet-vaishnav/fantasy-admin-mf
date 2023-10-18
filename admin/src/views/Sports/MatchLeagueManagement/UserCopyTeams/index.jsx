import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import SportsHeader from '../../SportsHeader'
import UserCopyTeamList from './UserCopyTeams'
import NavbarComponent from '../../../../components/Navbar'

import { getUserCopyTeams } from '../../../../actions/matchleague'

function IndexUserCopyTeams (props) {
  const { match, location } = props
  const { matchid, matchleagueid } = useParams()
  const content = useRef()
  const token = useSelector(state => state.auth.token)
  const userCopyTeamList = useSelector(state => state.matchleague.userCopyTeamList)
  const dispatch = useDispatch()
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''

  function getList () {
    dispatch(getUserCopyTeams(match?.params?.userteamid, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <SportsHeader
            heading={`User Copy Teams ${userCopyTeamList ? '(' + userCopyTeamList?.nTotalCopyBotTeams + ')' : ''}`}
            hidden
            matchLeaguePage={`/${sportsType}/match-management/match-league-management/user-league/${matchid}/${matchleagueid}`}
            onRefresh={onRefreshFun}
            refresh
          />
          <UserCopyTeamList
            {...props}
            ref={content}
            getList={getList}
            token={token}
            userCopyTeamList={userCopyTeamList}
          />
        </section>
      </main>
    </div>
  )
}

IndexUserCopyTeams.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default IndexUserCopyTeams
