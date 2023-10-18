import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import makeAnimated from 'react-select/animated'
import PropTypes from 'prop-types'

import MergeMatch from './MergeMatch'
import SportsHeader from '../../SportsHeader'
import Layout from '../../../../components/Layout'
import SportsMainHeader from '../../SportsMainHeader'
import { getMatchDetails } from '../../../../actions/match'
import { getMatchPlayerList } from '../../../../actions/matchplayer'

function MergeMatchIndex (props) {
  const location = useLocation()
  const { id } = useParams()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [apiGeneratedMatch, setApiGeneratedMatch] = useState('')
  const animatedComponents = makeAnimated()
  const [matchListArr, setMatchListArr] = useState([])
  const token = useSelector(state => state.auth.token)
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''
  const adminPermission = useSelector((state) => state.auth.adminPermission)

  useEffect(() => {
    if (id) {
      dispatch(getMatchDetails(id, token))
      const data = {
        start: '', limit: '', sort: 'sName', order: 'asc', searchText: '', role: '', team: '', token, Id: id, bCMBList: false
      }
      dispatch(getMatchPlayerList(data, false))
      setLoading(true)
    }
  }, [])

  function fetchMatchPlayersForNewMatch () {
    const data = {
      start: '', limit: '', sort: 'sName', order: 'asc', searchText: '', role: '', team: '', token, Id: apiGeneratedMatch?.value, bCMBList: false
    }
    dispatch(getMatchPlayerList(data, true))
    setLoading(true)
  }

  function handleChange (value) {
    setApiGeneratedMatch(value)
  }
  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <SportsMainHeader
              MatchPageLink={`/${sportsType}/match-management/view-match/${id}`}
              heading='Merge Match'
            />
            <SportsHeader
              adminPermission={adminPermission}
              animatedComponents={animatedComponents}
              apiGeneratedMatch={apiGeneratedMatch}
              fetchMatchPlayersForNewMatch={fetchMatchPlayersForNewMatch}
              handleChange={handleChange}
              hidden
              margeMatch
              matchListArr={matchListArr}
              matchManagement
            />
            <MergeMatch
              {...props}
              loading={loading}
              setApiGeneratedMatch={setApiGeneratedMatch}
              setLoading={setLoading}
              setMatchListArr={setMatchListArr}
            />
          </section>
        </main>
      </Layout>
    </div>
  )
}

MergeMatchIndex.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default MergeMatchIndex
