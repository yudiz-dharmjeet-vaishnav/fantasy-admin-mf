import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import BaseTeamsList from './BaseTeamList'
import Layout from '../../../../components/Layout'
import SportsMainHeader from '../../SportsMainHeader'
import { getBaseTeams } from '../../../../actions/match'

function IndexBaseTeams (props) {
  const location = useLocation()
  const { matchid } = useParams()
  const content = useRef()
  const token = useSelector(state => state?.auth?.token)
  const baseTeamsList = useSelector(state => state?.match?.baseTeamsList)

  const dispatch = useDispatch()
  const sportsType = location?.pathname?.includes('cricket') ? 'cricket' : location?.pathname?.includes('football') ? 'football' : location?.pathname?.includes('basketball') ? 'basketball' : location?.pathname?.includes('kabaddi') ? 'kabaddi' : location?.pathname?.includes('hockey') ? 'hockey' : location?.pathname?.includes('csgo') ? 'csgo' : location?.pathname?.includes('dota2') ? 'dota2' : location?.pathname?.includes('lol') ? 'lol' : ''

  function getList (start, limit) {
    dispatch(getBaseTeams(start, limit, matchid, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function header () {
    if (baseTeamsList?.oUser?.sUsername && baseTeamsList?.oMatch?.sName) {
      return `Base Teams ( ${baseTeamsList?.oUser?.sUsername} - ${baseTeamsList?.oMatch?.sName})`
    } else {
      return 'Base Teams'
    }
  }
  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <SportsMainHeader
              heading= {header()}
              hidden
              matchLeaguePage={`/${sportsType}/match-management/match-league-management/${matchid}`}
              onRefresh={onRefreshFun}
              refresh="Refresh"
              baseTeam={`/${sportsType}/base-team/${matchid}`}
            />
            <div className={baseTeamsList?.length === 0 ? ' without-pagination' : 'setting-component'}>
              <BaseTeamsList
                {...props}
                ref={content}
                getList={getList}
                baseTeamsList={baseTeamsList}
                // updateBaseTeam={`/${sportsType}/match-management/base-teams/${matchid}`}
                updateBaseTeam={`/${sportsType}/base-team/${matchid}`}

              />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

IndexBaseTeams.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default IndexBaseTeams
