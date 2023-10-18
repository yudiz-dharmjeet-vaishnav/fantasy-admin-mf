import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Layout from '../../../../components/Layout'
import SportsMainHeader from '../../SportsMainHeader'
import EditMatchPlayerDetails from './EditMatchPlayerDetails'
import { getMatchDetails } from '../../../../actions/match'
import { getPlayerRoleList } from '../../../../actions/playerRole'
import { getPlayersList, getPlayersTotalCount } from '../../../../actions/player'
import { AddMatchPlayer, getMatchPlayerDetails, resetPlayer, UpdateMatchPlayer } from '../../../../actions/matchplayer'

function IndexUpdateMatchPlayer (props) {
  const { id1, id2 } = useParams()
  const location = useLocation()
  const [matchId, setMatchId] = useState('')
  const [matchPlayerId, setMatchPlayerId] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [MatchName, setMatchName] = useState('')
  const [submitDisableButton, setSubmitDisableButton] = useState('')

  const content = useRef()
  const token = useSelector(state => state.auth.token)
  const matchPlayerDetails = useSelector(state => state.matchplayer.matchPlayerDetails)
  const matchDetails = useSelector(state => state.match.matchDetails)
  const playerRoleList = useSelector(state => state.playerRole.playerRoleList)
  const teamName = useSelector(state => state.team.teamName)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const dispatch = useDispatch()
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''

  // dispatch action to add new match player
  function AddNewMatchPlayer (aPlayers, scorePoints, seasonPoints, TeamName, show) {
    const addMatchPlayerData = {
      aPlayers, scorePoints, seasonPoints, TeamName, show, sportsType, token, matchId
    }
    dispatch(AddMatchPlayer(addMatchPlayerData))
  }

  // dispatch action to update match player
  function UpdatePlayer (playerName, playerId, playerImage, playerRole, credits, scorePoints, seasonPoints, TeamName, show, frontendStatus, playedInLastMatch, id, substitutePlayer) {
    const updateMatchPlayerData = {
      playerName, playerId, playerImage, playerRole, credits, scorePoints, seasonPoints, TeamName, show, frontendStatus, playedInLastMatch, sportsType, matchId, matchPlayerId: id, substitutePlayer, token
    }
    dispatch(UpdateMatchPlayer(updateMatchPlayerData))
  }

  function ResetMatchPlayer (id) {
    dispatch(resetPlayer(id, token))
  }

  function getList (start, limit, sort, order, searchText, provider) {
    const getPlayerList = {
      start, limit, sort, order, searchText: searchText.trim(), provider, sportsType, token
    }
    dispatch(getPlayersList(getPlayerList))
  }

  function getPlayersTotalCountFunc (searchText, provider) {
    const data = {
      searchText, provider, sportsType, token
    }
    dispatch(getPlayersTotalCount(data))
  }

  useEffect(() => {
    if (id1 && id2) {
      if ((Auth && Auth === 'SUPER') || (adminPermission?.MATCHPLAYER !== 'N')) {
        dispatch(getMatchPlayerDetails(id2, token))
      }
      setMatchId(id1)
      setMatchPlayerId(id2)
    }
    if (id1) {
      setMatchId(id1)
    }
    if ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) {
      // dispatch action to MatchDetails list
      dispatch(getMatchDetails(id1, token))
    }
    if ((Auth && Auth === 'SUPER') || (adminPermission?.ROLES !== 'N')) {
      // dispatch action to Player Role list
      dispatch(getPlayerRoleList(sportsType, token))
    }
  }, [])

  function heading () {
    if (isCreate) {
      return 'Add Match Player'
    }
    return !isEdit ? `Edit Match Player (${MatchName})` : 'View Details'
  }

  function Submit () {
    content.current.Submit()
  }

  function resetPlayer2 () {
    content?.current?.resetPlayer()
  }
  function button () {
    if (isCreate) {
      return 'Add Match Player'
    }
    return !isEdit ? 'Save Changes' : 'Edit Match Player'
  }
  return (
    <div>
      <Layout {...props} >
        <SportsMainHeader
          Submit={Submit}
          button={button()}
          cancelLink={`/${sportsType}/match-management/match-player-management/${matchId}`}
          heading={heading()}
          isCreate={isCreate}
          isEdit={isEdit}
          resetPlayer={resetPlayer2}
          submitDisableButton={submitDisableButton}
          updateMatchPlayerData
        />
        <div className='without-pagination'>
          <EditMatchPlayerDetails
            {...props}
            ref={content}
            AddNewMatchPlayer={AddNewMatchPlayer}
            MatchName={MatchName}
            ResetMatchPlayer={ResetMatchPlayer}
            UpdateMatchPlayer={UpdatePlayer}
            aScorePoint={`/${sportsType}/match-management/match-player-management/score-points/${matchId}`}
            cancelLink={`/${sportsType}/match-management/match-player-management/${matchId}`}
            eScorePoint={`/${sportsType}/match-management/match-player-management/score-points/${matchId}/${matchPlayerId}`}
            getList={getList}
            getMatchDetails={getMatchDetails}
            getPlayersTotalCountFunc={getPlayersTotalCountFunc}
            isCreate={isCreate}
            isEdit={isEdit}
            matchDetails={matchDetails}
            matchPlayerDetails={matchPlayerDetails}
            playerRoleList={playerRoleList}
            setIsCreate ={setIsCreate}
            setIsEdit={setIsEdit}
            setMatchName={setMatchName}
            setSubmitDisableButton={setSubmitDisableButton}
            teamName={teamName}
          />
        </div>
      </Layout>
    </div>
  )
}

IndexUpdateMatchPlayer.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default IndexUpdateMatchPlayer
