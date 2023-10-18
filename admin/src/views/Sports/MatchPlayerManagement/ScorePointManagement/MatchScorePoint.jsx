import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Layout from '../../../../components/Layout'
import PlayerScorePoints from './PlayerScorePoints'
import SportsMainHeader from '../../SportsMainHeader'
import { getMatchPlayerScorePoint, updateMPScorePoint } from '../../../../actions/matchplayer'

function MatchScorePoint (props) {
  const { id1, id2 } = useParams()
  const location = useLocation()
  const [matchId, setMatchId] = useState('')
  const [matchPlayerId, setmatchPlayerId] = useState('')
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()
  const content = useRef()
  const matchPlayerScoreList = useSelector(state => state.matchplayer.matchPlayerScorePointList)
  const SportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)

  useEffect(() => {
    if (id1 && id2) {
      setmatchPlayerId(id2)
      setMatchId(id1)
    }
    if (id1) {
      setMatchId(id1)
    }
  }, [])

  // dispatch action to get player's score point
  function getList (matchPlayerid) {
    dispatch(getMatchPlayerScorePoint(token, matchPlayerid))
  }

  // dispatch action to update player's score point
  function updateMPScorePointFun (aPointBreakup, matchPlayerid) {
    dispatch(updateMPScorePoint(aPointBreakup, matchPlayerid, token))
  }

  function onEdit () {
    content.current.onEdit()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <main className='main-content'>
          <section className='management-section common-box'>
            <SportsMainHeader
              {...props}
              Auth={Auth}
              MatchScorePoint
              heading="Score Point"
              onEdit={onEdit}
            />
            <PlayerScorePoints
              {...props}
              ref={content}
              SportsType={SportsType}
              aCancelLink={`/${SportsType}/match-management/match-player-management/add-match-player/${matchId}`}
              eCancelLink={`/${SportsType}/match-management/match-player-management/update-match-player/${matchId}/${matchPlayerId}`}
              getList={getList}
              matchPlayerScoreList={matchPlayerScoreList}
              updateMPScorePoint={updateMPScorePointFun}
            />
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

MatchScorePoint.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object
}

export default MatchScorePoint
