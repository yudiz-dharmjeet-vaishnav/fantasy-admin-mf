import React, { useState, useEffect, Fragment, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { useLocation, useParams } from 'react-router-dom'
import axios from 'axios'
import qs from 'query-string'
import PropTypes from 'prop-types'

import SportsHeader from '../SportsHeader'
import Layout from '../../../components/Layout'
import SportsMainHeader from '../SportsMainHeader'
import { getSettingList } from '../../../actions/setting'
import MatchLeagueComponent from './MatchLeagueComponent'

import { getRankCalculate, getWinReturn } from '../../../actions/matchplayer'
import { getMatchDetails, priceDistriBution, winPrizeDistribution } from '../../../actions/match'
import { canceledMatchLeague, getLeagueCount, getMatchLeagueList, pointCalculate } from '../../../actions/matchleague'
function IndexMatchLeagueManagement (props) {
  const { id } = useParams()
  const location = useLocation()
  const content = useRef()
  const [searchText, setSearchText] = useState('')
  const [matchName, setMatchName] = useState('')
  const [matchStatus, setMatchStatus] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [pointCalculateFlag, setPointCalculateFlag] = useState(false)
  const [rankCalculateFlag, setRankCalculateFlag] = useState(false)
  const [prizeCalculateFlag, setPrizeCalculateFlag] = useState(false)
  const [winPrizeCalculateFlag, setWinPrizeCalculateFlag] = useState(false)
  const [pointCalculateInterval, setPointCalculateInterval] = useState({})
  const [rankCalculateInterval, setRankCalculateInterval] = useState({})
  const [prizeCalculateInterval, setPrizeCalculateInterval] = useState({})
  const [winPrizeCalculateInterval, setWinPrizeCalculateInterval] = useState({})
  const [editNormalBotModal, setEditNormalBotModal] = useState(false)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [loading, setLoading] = useState(false)
  const [sort, setSort] = useQueryState('sortBy', '_id')
  const [order, setOrder] = useQueryState('order', 'dsc')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [leagueCancel, setLeagueCancel] = useQueryState('bCancelled', '')

  const token = useSelector(state => state.auth.token)
  const matchLeagueList = useSelector(state => state.matchleague.matchLeagueList)
  const MatchDetails = useSelector(state => state.match.matchDetails)
  const leagueCount = useSelector(state => state.matchleague.leagueCount)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const settingList = useSelector(state => state.setting.settingList)
  const matchLeagueResponse = useSelector(state => state.matchleague.resFlag)
  const matchPlayerResponse = useSelector(state => state.matchplayer.resFlag)
  const matchPrizeResponse = useSelector(state => state.match.prizeFlag)
  const matchWinResponse = useSelector(state => state.match.winFlag)
  const [leagueType, setLeagueType] = useQueryState('leagueType', '')
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''
  const dispatch = useDispatch()
  const previousProps = useRef({ MatchDetails }).current
  const cancelTokenSource = useRef()
  useEffect(() => {
    if (id) {
      dispatch(getMatchDetails(id, token))
    }
    const obj = qs.parse(location.pathname.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  useEffect(() => {
    if (MatchDetails && previousProps.MatchDetails !== MatchDetails) {
      setMatchName(MatchDetails.sName)
      setMatchStatus(MatchDetails.eStatus)
      leagueCountFunc(MatchDetails.eStatus)
    }

    return () => {
      previousProps.MatchDetails = MatchDetails
    }
  }, [MatchDetails])

  useEffect(() => {
    if (leagueCount) {
      if (leagueCount?.nPointCalculated === leagueCount?.nJoinedUsers && pointCalculateFlag) {
        setPointCalculateFlag(false)
        clearInterval(pointCalculateInterval)
        cancelTokenSource.current.cancel()
      }
      if (leagueCount?.nRankCalculated === leagueCount?.nJoinedUsers && rankCalculateFlag) {
        setRankCalculateFlag(false)
        clearInterval(rankCalculateInterval)
        cancelTokenSource.current.cancel()
      }
      if (leagueCount?.nPrizeCalculated === leagueCount?.nLeagueCount && prizeCalculateFlag) {
        setPrizeCalculateFlag(false)
        clearInterval(prizeCalculateInterval)
        cancelTokenSource.current.cancel()
      }
      if (leagueCount?.nWinDistributed === leagueCount?.nLeagueCount && winPrizeCalculateFlag) {
        setWinPrizeCalculateFlag(false)
        clearInterval(winPrizeCalculateInterval)
        cancelTokenSource.current.cancel()
      }
    }
  }, [leagueCount])

  useEffect(() => {
    cancelTokenSource.current = axios.CancelToken.source()
    const cancelToken = cancelTokenSource.current.token

    if (pointCalculateFlag && matchLeagueResponse) {
      const intervalPointCalculate = setInterval(() => {
        if (matchStatus) {
          leagueCountFunc(matchStatus, cancelToken)
        }
      }, 2000)
      setPointCalculateInterval(intervalPointCalculate)
    }

    if (rankCalculateFlag && matchPlayerResponse) {
      const intervalRankCalculate = setInterval(() => {
        if (matchStatus) {
          leagueCountFunc(matchStatus, cancelToken)
        }
      }, 2000)
      setRankCalculateInterval(intervalRankCalculate)
    }

    if (prizeCalculateFlag && matchPrizeResponse) {
      const intervalPriceCalculate = setInterval(() => {
        if (matchStatus) {
          leagueCountFunc(matchStatus, cancelToken)
        }
      }, 2000)
      setPrizeCalculateInterval(intervalPriceCalculate)
    }

    if (winPrizeCalculateFlag && matchWinResponse) {
      const intervalWinPrizeCalculate = setInterval(() => {
        if (matchStatus) {
          leagueCountFunc(matchStatus, cancelToken)
        }
      }, 2000)
      setWinPrizeCalculateInterval(intervalWinPrizeCalculate)
    }

    return () => {
      clearInterval(pointCalculateInterval)
      clearInterval(rankCalculateInterval)
      clearInterval(prizeCalculateInterval)
      clearInterval(winPrizeCalculateInterval)
    }
  }, [pointCalculateFlag, rankCalculateFlag, prizeCalculateFlag, winPrizeCalculateFlag, matchLeagueResponse, matchPlayerResponse, matchPrizeResponse, matchWinResponse])

  function clearPendingReq () {
    clearInterval(pointCalculateInterval)
    clearInterval(rankCalculateInterval)
    clearInterval(prizeCalculateInterval)
    clearInterval(winPrizeCalculateInterval)
    cancelTokenSource.current.cancel()
  }

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setinitialFlag(true)
  }

  function getList (start, limit, sort, order, search, leagueType, isFullList, cancelFlag) {
    const matchLeagueData = {
      start, limit, sort, order, searchText: search, leagueType, isFullList, ID: id, sportsType, cancelFlag, token
    }
    dispatch(getMatchLeagueList(matchLeagueData))
  }

  function getMatchDetailsFunc () {
    dispatch(getMatchDetails(id, token))
  }

  function leagueCountFunc (status, cancelToken) {
    dispatch(getLeagueCount(status, cancelToken, id, token))
  }

  function openModalToEditBot () {
    setEditNormalBotModal(true)
    getList(0, 10, 'sName', 'asc', '', 'PUBLIC', true)
  }

  // dispatch action to cancel league
  function cancelLeague (iMatchLeagueId) {
    dispatch(canceledMatchLeague(iMatchLeagueId, token))
  }

  // dispatch action to calculate prize distribution for match leagues
  function prizeDistributionFunc () {
    setPrizeCalculateFlag(true)
    dispatch(priceDistriBution(id, token))
  }

  // dispatch action to calculate win prize distribution for match leagues
  function winPrizeDistributionFunc () {
    setWinPrizeCalculateFlag(true)
    dispatch(winPrizeDistribution(id, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function pointCalculateFunc () {
    setPointCalculateFlag(true)
    dispatch(pointCalculate(id, token))
  }

  // dispatch action to calculate rank for match leagues
  function rankCalculate () {
    setRankCalculateFlag(true)
    dispatch(getRankCalculate(id, token))
  }

  function getSettingsList (start, limit, sort, order, search, isFullResponse) {
    dispatch(getSettingList(start, limit, sort, order, search.trim(), isFullResponse, token))
  }

  function winReturn () {
    dispatch(getWinReturn(id, token))
  }

  function onFiltering (event, type) {
    if (type === 'promocode') {
      setLeagueType(event.target.value)
      setLoading(true)
    }
    if (type === 'league') {
      setLeagueCancel(event.target.value)
      setLoading(true)
    }
  }

  function onExport () {
    content.current.onExport()
  }

  function heading () {
    const title = sportsType.charAt(0).toUpperCase() + sportsType.slice(1) + ' Match Leagues'
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

  return (
    <Fragment>
      <Layout {...props} >

        <main className="main-content">
          <section className="management-section common-box">
            <SportsMainHeader
              MatchPageLink={`/${sportsType}/match-management/view-match/${id}`}
              export ="Export"
              heading={heading()}
              matchLeagueList={matchLeagueList}
              onExport={onExport}
              onRefresh={onRefreshFun}
              refresh = "Refresh"
              baseTeams
              baseTeamsPage={`/${sportsType}/match-management/base-teams/${id}`}
            />
            <div className={ matchLeagueList?.results?.length === 0 ? 'without-pagination' : 'setting-component'}>
              <SportsHeader
                MatchDetails={MatchDetails}
                SearchPlaceholder="Search Match League"
                buttonText="Add Match League"
                clearPendingReq={clearPendingReq}
                combinationBotUrl={`/${sportsType}/match-management/edit-combination-bot-teams/${id}`}
                extraWinListLink={`/${sportsType}/match-management/extra-win-list/${id}`}
                handleSearch={onHandleSearch}
                hidden
                isShow
                leagueCancel={leagueCancel}
                leagueCount={leagueCount}
                leagueType={leagueType}
                matchLeague
                matchLeagueList={matchLeagueList}
                normalBotTeamsTrue
                onFiltering={onFiltering}
                openModalToEditBot={openModalToEditBot}
                otherButton
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'R')}
                pointCalculate={pointCalculateFunc}
                prizeDistributionFunc={prizeDistributionFunc}
                rankCalculate={rankCalculate}
                search={searchText}
                setUrl={`/${sportsType}/match-management/match-league-management/add-match-league/${id}`}
                status={matchStatus}
                winPrizeDistributionFunc={winPrizeDistributionFunc}
                winReturn={winReturn}
              />
              <MatchLeagueComponent
                {...props}
                ref={content}
                List={matchLeagueList}
                MatchDetails={MatchDetails}
                activePageNo={activePageNo}
                cancelLeague={cancelLeague}
                cashback={`/${sportsType}/match-management/match-league-management/match-league-cashback-list/${id}`}
                editNormalBotModal={editNormalBotModal}
                flag={initialFlag}
                getList={getList}
                getMatchDetailsFunc={getMatchDetailsFunc}
                getSettingList={getSettingsList}
                leagueCancel={leagueCancel}
                leagueCount={leagueCount}
                leagueCountFunc={leagueCountFunc}
                leagueType={leagueType}
                loading={loading}
                matchStatus={matchStatus}
                offset={offset}
                order={order}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'R')}
                pointCalculateFlag={pointCalculateFlag}
                prizeCalculateFlag={prizeCalculateFlag}
                prizeDistributionFunc={prizeDistributionFunc}
                promoUsage={`/${sportsType}/match-management/match-league-management/match-league-promo-usage-list/${id}`}
                rankCalculateFlag={rankCalculateFlag}
                search={searchText}
                setEditNormalBotModal={setEditNormalBotModal}
                setLeagueCancel = {setLeagueCancel}
                setLeagueType={setLeagueType}
                setLoading={setLoading}
                setOffset={setOffset}
                setOrder={setOrder}
                setPageNo={setPageNo}
                setSort={setSort}
                settingList={settingList}
                sort={sort}
                systemBotsLogs={`/${sportsType}/match-management/match-league-management/system-bot-logs/${id}`}
                systemTeams={`/${sportsType}/match-management/match-league-management/system-team-match-players/${id}`}
                userLeague={`/${sportsType}/match-management/match-league-management/user-league/${id}`}
                winPrizeCalculateFlag={winPrizeCalculateFlag}
                winPrizeDistributionFunc={winPrizeDistributionFunc}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

IndexMatchLeagueManagement.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default IndexMatchLeagueManagement
