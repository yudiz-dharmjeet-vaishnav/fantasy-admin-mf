import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import AddMatchLeague from './AddMatchLeague'
import Layout from '../../../../components/Layout'
import SportsMainHeader from '../../SportsMainHeader'
import { getLeagueName } from '../../../../actions/league'
import { AddCricketMatchLeague } from '../../../../actions/matchleague'

function IndexAddMatchLeague (props) {
  // const {
  //   match
  // } = props
  const { id1 } = useParams()
  const location = useLocation()
  const [isCreate, setIsCreate] = useState(true)
  const [matchId, setMatchId] = useState('')
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const LeagueName = useSelector(state => state.league.LeagueNameList)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''

  useEffect(() => {
    if (id1) {
      setMatchId(id1)
    }
    if ((Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'N')) {
      dispatch(getLeagueName(sportsType, token))
    }
  }, [])

  function funcAddMatchLeague (ID, LeagueID) {
    dispatch(AddCricketMatchLeague(ID, LeagueID, token))
  }

  return (
    <div>
      <Layout {...props} >
        <SportsMainHeader
          AddMatchLeague
          cancelLink={`/${sportsType}/match-management/match-league-management/${matchId}`}
          heading={isCreate ? 'Add Match League' : 'Match League Details' }
        />
        <AddMatchLeague
          {...props}
          FuncAddMatchLeague={funcAddMatchLeague}
          LeagueNames={LeagueName}
          cancelLink={`/${sportsType}/match-management/match-league-management/${matchId}`}
          isCreate={isCreate}
          setIsCreate={setIsCreate}
        />
      </Layout>
    </div>
  )
}

IndexAddMatchLeague.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default IndexAddMatchLeague
