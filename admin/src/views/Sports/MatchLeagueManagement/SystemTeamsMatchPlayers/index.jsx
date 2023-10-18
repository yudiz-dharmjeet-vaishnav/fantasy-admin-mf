import React, { Fragment, useEffect, useState } from 'react'
import { useQueryState } from 'react-router-use-location-state'
import { useLocation, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import qs from 'query-string'

import SportsHeader from '../../SportsHeader'
import Layout from '../../../../components/Layout'
import SportsMainHeader from '../../SportsMainHeader'
import SystemTeamMatchPlayers from './SystemTeamMatchPlayers'

import { getMatchLeagueList } from '../../../../actions/matchleague'

function SystemTeamIndex (props) {
  const { id1 } = useParams()
  const location = useLocation()
  const [isModalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [teams, setTeams] = useState([])
  const [teamName, setTeamName] = useQueryState('sTeamName', '')
  const [AutoSelect, setAutoSelect] = useState(false)
  const obj = qs.parse(location?.search)

  const dispatch = useDispatch()
  const MatchDetails = useSelector(state => state.match.matchDetails)
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''

  const combinationBot = location.pathname.includes('edit-combination-bot-teams')
  const matchLeagueList = useSelector(state => state.matchleague.matchLeagueList)
  const token = useSelector(state => state.auth.token)

  function getList (start, limit, sort, order, search, leagueType, isFullList) {
    const matchLeagueData = {
      start, limit, sort, order, searchText: search, leagueType, isFullList, ID: id1, sportsType, token
    }
    dispatch(getMatchLeagueList(matchLeagueData))
  }
  useEffect(() => {
    if (obj) {
      setTeamName(obj.sTeamName)
    }
  }, [])
  function onFiltering (event, type) {
    if (type === 'TeamName') {
      setTeamName(event.target.value)
    }
    setLoading(true)
  }

  function autoSelectFunc () {
    setAutoSelect(!AutoSelect)
  }
  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section">
            <SportsMainHeader
              heading={combinationBot ? 'Edit Combination Bot Teams' : 'Match Players For Bot'}
              matchLeaguePage={`/${sportsType}/match-management/match-league-management/${id1}`}
            />
            <div className='without-pagination'>
              <SportsHeader
                AutoSelect = {AutoSelect}
                SystemTeamMatchPlayers
                autoSelectFunc={autoSelectFunc}
                combinationBot={combinationBot}
                hidden
                matchManagement
                onFilteringFunction={onFiltering}
                setTeamName={setTeamName}
                teamName={teamName}
                teams={teams}
              />
              <SystemTeamMatchPlayers
                {...props}
                combinationBot={combinationBot}
                getList={getList}
                isModalOpen={isModalOpen}
                loading={loading}
                matchDetails={MatchDetails}
                matchId={id1}
                matchLeagueList={matchLeagueList}
                matchLeaguePage={`/${sportsType}/match-management/match-league-management/${id1}`}
                setLoading={setLoading}
                setModalOpen={setModalOpen}
                setTeams= {setTeams}
                sportsType={sportsType}
                teamName={teamName}
                teams={teams}
                AutoSelect={AutoSelect}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

SystemTeamIndex.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default SystemTeamIndex
