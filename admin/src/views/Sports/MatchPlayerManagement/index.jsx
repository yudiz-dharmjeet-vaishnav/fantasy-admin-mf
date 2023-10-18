import React, { useState, useEffect, Fragment, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import PropTypes from 'prop-types'

import SportsHeader from '../SportsHeader'
import Layout from '../../../components/Layout'
import Loading from '../../../components/Loading'
import SportsMainHeader from '../SportsMainHeader'
import MatchPlayerComponent from './MatchPlayerComponent'
import { getMatchDetails } from '../../../actions/match'
import { getPlayerRoleList } from '../../../actions/playerRole'
import { fetchMatchPlayer, fetchplaying11, getMatchPlayerList, getGenerateScorePoint, lineupsOut, UpdateMatchPlayer, generateScorePoint, calculateSeasonPoint, fetchPlaying7, fetchPlaying5, fetchLastMatchPlayer } from '../../../actions/matchplayer'

function IndexPlayerManagement (props) {
  const { id } = useParams()
  const location = useLocation()
  const content = useRef()
  const [loading, setLoading] = useState(false)
  const [matchName, setMatchName] = useState('')
  const [role, setRole] = useQueryState('role', '')
  const [team, setTeam] = useQueryState('team', '')
  const [substitute, setSubstitute] = useQueryState('substitute', '')
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'dsc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [teams, setTeams] = useState([])
  const [status, setStatus] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const token = useSelector(state => state.auth.token)
  const matchPlayerList = useSelector(state => state.matchplayer.matchPlayerList)
  const MatchDetails = useSelector(state => state.match.matchDetails)
  const playerRoleList = useSelector(state => state.playerRole.playerRoleList)
  const resStatus = useSelector(state => state.matchplayer.resStatus)
  const resMessage = useSelector(state => state.matchplayer.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({
    resMessage, resStatus
  }).current
  const [matchId, setMatchId] = useState('')
  const dispatch = useDispatch()
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''

  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearchValue(obj.search)
    }
    if (id) {
      setMatchId(id)
      dispatch(getMatchDetails(id, token))
    }
    if (obj?.substitute) {
      setSubstitute(obj?.substitute)
    }
    if ((Auth && Auth === 'SUPER') || (adminPermission?.ROLES !== 'N')) {
      dispatch(getPlayerRoleList(sportsType, token))
    }
  }, [])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (MatchDetails) {
      setMatchName(MatchDetails.sName)
      setStatus(MatchDetails.eStatus)
    }
  }, [MatchDetails])

  function onHandleSearch (e) {
    setSearchValue(e.target.value)
    setinitialFlag(true)
  }

  // dispatch action to get match player's list
  function getList (start, limit, sort, order, searchText, role, team, substitute) {
    const matchPlayerListData = {
      start, limit, sort, order, searchText, role, team, token, Id: id, bCMBList: false, substitute
    }
    dispatch(getMatchPlayerList(matchPlayerListData))
  }

  // dispatch action to generate score points
  function generateScorePointFun () {
    setLoading(true)
    if (sportsType === 'cricket') {
      dispatch(getGenerateScorePoint(id, token))
    } else {
      dispatch(generateScorePoint(sportsType, id, token))
    }
  }

  // dispatch action to fetch players for match
  function fetchMatchPlayerList () {
    setLoading(true)
    dispatch(fetchMatchPlayer(sportsType, id, token))
  }

  function fetchLastMatchPlayerFunc () {
    dispatch(fetchLastMatchPlayer(id, token))
  }

  // dispatch action to fetch the player's list whoever gonna play(cricket, football)
  function fetchPlayingeleven () {
    setLoading(true)
    dispatch(fetchplaying11(sportsType, id, token))
  }

  // dispatch action to fetch the player's list whoever gonna play(kabaddi)
  function fetchPlayingSevenFunc () {
    dispatch(fetchPlaying7(id, token))
  }

  // dispatch action to fetch the player's list whoever gonna play(basketball)
  function fetchPlayingFiveFunc () {
    dispatch(fetchPlaying5(id, token))
  }

  // dispatch action to show player's status at app side whoever gonna play
  function lineupsOutfunction (bLineupsOut) {
    setLoading(true)
    dispatch(lineupsOut(bLineupsOut, matchId, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function UpdatePlayer (playerName, playerId, playerImage, playerRole, credits, scorePoints, seasonPoints, TeamName, show, frontendStatus, playedInLastMatch, matchPlayerId, substitutePlayer) {
    const updateMatchPlayerData = {
      playerName, playerId, playerImage, playerRole, credits, scorePoints, seasonPoints: parseFloat(seasonPoints), TeamName, show, frontendStatus, playedInLastMatch, sportsType, token, matchId, matchPlayerId, substitutePlayer
    }
    dispatch(UpdateMatchPlayer(updateMatchPlayerData))
  }

  // dispatch action to calculate season points
  function seasonPoint () {
    setLoading(true)
    dispatch(calculateSeasonPoint(matchId, token))
  }

  function heading () {
    const title = sportsType.charAt(0).toUpperCase() + sportsType.slice(1) + ' Match Players'
    if (matchName) {
      if (window.innerWidth <= 480) {
        return (
          <div>
            {title}
            <p>{`(${matchName})`}</p>
          </div>
        )
      } else {
        return (
          <div>
            {title}
            {' '}
            {`(${matchName})`}
          </div>
        )
      }
    } else {
      return <div>{title}</div>
    }
  }

  function onInputChange (e, type) {
    if (type === 'Role') {
      setRole(e.target.value)
    } else if (type === 'Team') {
      setTeam(e.target.value)
    } else if (type === 'Substitute') {
      setSubstitute(e?.target?.value)
    }
  }

  useEffect(() => {
    if (previousProps.team !== team) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, role, team, substitute)
      setPageNo(1)
    }
    return () => {
      previousProps.team = team
    }
  }, [team])

  useEffect(() => {
    if (previousProps.role !== role) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, role, team, substitute)
      setPageNo(1)
    }
    return () => {
      previousProps.role = role
    }
  }, [role])

  useEffect(() => {
    if (previousProps.substitute !== substitute) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, role, team, substitute)
      setPageNo(1)
    }
    return () => {
      previousProps.role = role
    }
  }, [substitute])
  return (
    <Fragment>
      <Layout {...props} >

        <main className="main-content">
          {loading && <Loading />}
          <section className="management-section common-box">
            <SportsMainHeader
              MatchPageLink={`/${sportsType}/match-management/view-match/${id}`}
              heading={heading()}
              onRefresh={onRefreshFun}
              refresh="Refresh"
              role={role}
              team={team}
              substitute={substitute}
            />
            <div className={matchPlayerList?.total === 0 || matchPlayerList === undefined ? 'without-pagination' : 'setting-component'}>
              <SportsHeader
                LineUpsOut
                MatchDetails={MatchDetails}
                buttonText="Add Match Player"
                fetchLastMatchPlayerFunc={fetchLastMatchPlayerFunc}
                fetchMatchPlayer
                fetchMatchPlayerList={fetchMatchPlayerList}
                fetchPlaying11={fetchPlayingeleven}
                fetchPlayingEleven={sportsType === 'cricket' || sportsType === 'football' || sportsType === 'hockey'}
                fetchPlayingFive={sportsType === 'basketball'}
                fetchPlayingFiveFunc={fetchPlayingFiveFunc}
                fetchPlayingSeven={sportsType === 'kabaddi'}
                fetchPlayingSevenFunc={fetchPlayingSevenFunc}
                generateScorePoint={generateScorePointFun}
                handleSearch={onHandleSearch}
                hidden
                isShowAddButton
                lineupsOut={lineupsOutfunction}
                matchId={matchId}
                matchManagement
                matchPlayerManagement
                onInputChange={onInputChange}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCHPLAYER !== 'N' && adminPermission.MATCHPLAYER !== 'R')}
                playerRoleList={playerRoleList}
                refresh
                role={role}
                scorePoint
                search={searchValue}
                seasonPoint={seasonPoint}
                setUrl={`/${sportsType}/match-management/match-player-management/add-match-player/${id}`}
                status={status}
                team={team}
                teams={teams}
                substitute={substitute}
              />
              <MatchPlayerComponent
                {...props}
                ref={content}
                List={matchPlayerList}
                MatchDetails={MatchDetails}
                UpdateMatchPlayer={UpdatePlayer}
                activePageNo={activePageNo}
                editLink={`/${sportsType}/match-management/match-player-management/update-match-player/${id}`}
                flag={initialFlag}
                getList={getList}
                offset={offset}
                order={order}
                playerRoleList={playerRoleList}
                search={searchValue}
                setOffset={setOffset}
                setOrder={setOrder}
                setPageNo={setPageNo}
                setRole={setRole}
                setSearch={setSearch}
                setSort={setSort}
                setTeam={setTeam}
                setTeams={setTeams}
                sort={sort}
                teams={teams}
                substitute={substitute}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

IndexPlayerManagement.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default IndexPlayerManagement
