import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import AddMatch from './AddMatch'
import Layout from '../../../../components/Layout'
import MatchEditHeader from '../../MatchEditHeader'
import MatchEditMainHeader from '../../MatchEditMainHeader'
import { getTeamName } from '../../../../actions/team'
import { getFormatsList } from '../../../../actions/pointSystem'
import { getMatchLeagueList } from '../../../../actions/matchleague'
import { addMatch, getMatchDetails, updateMatch, generatePdf, loadLiveLeaderBoard, matchRefresh, liveInnings, fullScoreCard, generateDreamTeam } from '../../../../actions/match'

function IndexAddMatch (props) {
  const location = useLocation()
  const { id } = useParams()
  const [matchId, setMatchId] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCreate, setIsCreate] = useState(true)
  const [updateDisableButton, setUpdateDisableButton] = useState('')
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const teamName = useSelector((state) => state.team.teamName)
  const matchDetails = useSelector((state) => state.match.matchDetails)
  const Auth = useSelector(
    (state) => state.auth.adminData && state.auth.adminData.eType
  )
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const appView = localStorage.getItem('AppView')
  const adminPermission = useSelector((state) => state.auth.adminPermission)
  const eCategory = location.pathname.includes('cricket')
    ? 'cricket'
    : location.pathname.includes('football')
      ? 'football'
      : location.pathname.includes('basketball')
        ? 'basketball'
        : location.pathname.includes('baseball')
          ? 'baseball'
          : location.pathname.includes('kabaddi')
            ? 'kabaddi'
            : location.pathname.includes('hockey')
              ? 'hockey'
              : location.pathname.includes('csgo')
                ? 'csgo'
                : location.pathname.includes('dota2')
                  ? 'dota2'
                  : location.pathname.includes('lol')
                    ? 'lol'
                    : ''
  const FormatsList = useSelector((state) => state.pointSystem.getFormatsList)

  useEffect(() => {
    if (id) {
      getMatchDetailsFunc()
      setMatchId(id)
    }
    const start = 0
    if (Auth === 'SUPER' || adminPermission?.TEAM === 'W') {
      dispatch(getTeamName(eCategory, token, start, 10, ''))
    }
    dispatch(getFormatsList(eCategory.toUpperCase(), token))
  }, [])

  function getMatchDetailsFunc () {
    dispatch(getMatchDetails(id, token))
  }
  function onRefresh () {
    dispatch(matchRefresh(matchId, token))
  }
  const content = useRef()

  function AddMatchFunc (Series, seasonId, seasonName, SeasonKey, MatchName, MatchFormat, StartDate, TeamAName, TeamBName, TeamAScore, TeamBScore, Venue, matchOnTop, TossWinner, ChooseTossWinner, bDisabled, MaxTeamLimit, sSponsoredText, FantasyPostID, StreamURL, StreamType, matchKey, info, winningText, scoreCardFlag, grandLeague, dreamTeamFlag, pitchDetails, avgVenueScore) {
    const addMatchData = {
      Series,
      seasonId,
      seasonName,
      SeasonKey,
      MatchName,
      MatchFormat,
      StartDate,
      TeamAName,
      TeamBName,
      TeamAScore,
      TeamBScore,
      Venue,
      eCategory,
      matchOnTop,
      TossWinner,
      ChooseTossWinner,
      bDisabled,
      MaxTeamLimit,
      sSponsoredText,
      FantasyPostID,
      StreamURL,
      StreamType,
      matchKey,
      info,
      winningText,
      scoreCardFlag,
      grandLeague: grandLeague?.value,
      dreamTeamFlag,
      pitchDetails,
      avgVenueScore,
      token
    }
    dispatch(addMatch(addMatchData))
  }

  function getTeamNameFun (Start, Search) {
    dispatch(getTeamName(eCategory, token, Start, 10, Search))
  }

  function generatePDF () {
    dispatch(generatePdf('MATCH', matchId, token))
  }
  function calculateLiveLeaderBoard () {
    dispatch(loadLiveLeaderBoard(matchId, token))
  }

  function UpdateMatchFunc (
    Series,
    seasonId,
    seasonName,
    SeasonKey,
    MatchName,
    MatchFormat,
    StartDate,
    TeamAName,
    TeamBName,
    TeamAScore,
    TeamBScore,
    Venue,
    MatchStatus,
    TossWinner,
    ChooseTossWinner,
    matchOnTop,
    bDisabled,
    MaxTeamLimit,
    sSponsoredText,
    FantasyPostID,
    StreamURL,
    StreamType,
    matchKey,
    info,
    winningText,
    scoreCardFlag,
    grandLeague,
    dreamTeamFlag, pitchDetails, avgVenueScore
  ) {
    const updateMatchData = {
      Series, seasonId, seasonName, SeasonKey, MatchName, MatchFormat, StartDate, TeamAName, TeamBName, TeamAScore, TeamBScore, Venue, MatchStatus, TossWinner, ChooseTossWinner, matchOnTop, eCategory, token, ID: matchId, bDisabled, MaxTeamLimit, sSponsoredText, FantasyPostID, StreamURL, StreamType, matchKey, info, winningText, scoreCardFlag, grandLeague: grandLeague?.value, dreamTeamFlag, pitchDetails, avgVenueScore
    }
    dispatch(updateMatch(updateMatchData))
  }

  function onAdd () {
    content.current.onAdd()
  }
  function getLeagueListFunc (start, limit, search, ID) {
    const leagueListData = {
      start,
      limit,
      sort: 'nTotalPayout',
      order: 'dsc',
      searchText: search,
      leagueType: '',
      isFullList: false,
      ID,
      sportsType: eCategory,
      cancelFlag: '',
      token
    }
    dispatch(getMatchLeagueList(leagueListData))
  }

  function generateDreamTeamFunc () {
    dispatch(generateDreamTeam(matchId, token))
  }

  function getScoreCardDataFunc () {
    dispatch(liveInnings(matchId, token))
    dispatch(fullScoreCard(matchId, token))
    setLoading(true)
  }
  return (
    <div>
      <Layout {...props}>
        <MatchEditMainHeader
          Auth={Auth}
          SportsType={eCategory}
          adminPermission={adminPermission}
          appView={appView}
          isCreate={isCreate}
          matchId={matchId}
          onAdd={onAdd}
          page={page}
          updateDisableButton={updateDisableButton}
        />

        <div className='without-pagination'>
          <MatchEditHeader
            Auth={Auth}
            SportsType={eCategory}
            appView={appView}
            calculateLiveLeaderBoard={calculateLiveLeaderBoard}
            generateDreamTeamFunc={generateDreamTeamFunc}
            generatePDF={generatePDF}
            getScoreCardDataFunc={getScoreCardDataFunc}
            isCreate={isCreate}
            matchDetails={matchDetails}
            matchId={matchId}
            matchLeague={`/${eCategory}/match-management/match-league-management/${matchId}`}
            matchPlayer={`/${eCategory}/match-management/match-player-management/${matchId}`}
            matchReport={`/${eCategory}/match-management/match-report/${matchId}`}
            mergeMatchPage={`/${eCategory}/match-management/merge-match`}
            onRefresh={onRefresh}
          />
          <AddMatch
            {...props}
            ref={content}
            AddMatchFunc={AddMatchFunc}
            FormatsList={FormatsList}
            SportsType={eCategory}
            UpdateMatch={UpdateMatchFunc}
            getLeagueListFunc={getLeagueListFunc}
            getMatchDetailsFunc={getMatchDetailsFunc}
            getTeamName={getTeamNameFun}
            isCreate={isCreate}
            loading={loading}
            matchId={matchId}
            matchLeague={`/${eCategory}/match-management/match-league-management/${matchId}`}
            matchPlayer={`/${eCategory}/match-management/match-player-management/${matchId}`}
            matchReport={`/${eCategory}/match-management/match-report/${matchId}`}
            mergeMatchPage={`/${eCategory}/match-management/merge-match`}
            setIsCreate={setIsCreate}
            setLoading={setLoading}
            setMatchId
            setUpdateDisableButton={setUpdateDisableButton}
            teamName={teamName}
          />
        </div>
      </Layout>
    </div>
  )
}

IndexAddMatch.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default IndexAddMatch
