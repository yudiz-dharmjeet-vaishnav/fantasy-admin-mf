import React, { useState, useEffect, useRef, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Layout from '../../../../components/Layout'
import SportsMainHeader from '../../SportsMainHeader'
import MatchLeagueCashbackList from './MatchLeagueCashbackList'

import { isNumber } from '../../../../helpers/helper'
import { getMatchDetails } from '../../../../actions/match'
import { getRecommendedList } from '../../../../actions/users'
import { getMatchLeagueDetails, getUsersCashbackList } from '../../../../actions/matchleague'

function MatchLeagueCashback (props) {
  const { id1, id2 } = useParams()
  const location = useLocation()
  const content = useRef()
  const [searchText, setSearchText] = useState('')
  const [matchName, setMatchName] = useState('')
  const [IsNumber, setIsNumber] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [matchLeagueName, setMatchLeagueName] = useState('')
  const [initialFlag, setInitialFlag] = useState(false)

  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const usersCashbackList = useSelector(state => state.matchleague.usersCashbackList)
  const MatchDetails = useSelector(state => state.match.matchDetails)
  const recommendedList = useSelector(state => state.users.recommendedList)
  const matchLeagueDetails = useSelector(state => state.matchleague.matchLeagueDetails)
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''
  const previousProps = useRef({ userSearch }).current
  const dispatch = useDispatch()

  useEffect(() => {
    if (id1) {
      dispatch(getMatchDetails(id1, token))
    }
    if (id2) {
      dispatch(getMatchLeagueDetails(id2, token))
    }
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearchText(obj.search)
      setUserSearch(obj.search)
      onGetRecommendedList(obj.search, true)
    } else if (recommendedList?.length === 0 || !recommendedList) {
      onGetRecommendedList('', false)
    }
  }, [])

  useEffect(() => {
    if (MatchDetails) {
      setMatchName(MatchDetails.sName)
    }
  }, [MatchDetails])

  useEffect(() => {
    const callSearchService = () => {
      onGetRecommendedList(userSearch, false)
    }
    if (initialFlag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.searchText = searchText
      }
    }
  }, [userSearch])

  useEffect(() => {
    if (matchLeagueDetails) {
      setMatchLeagueName(matchLeagueDetails.sName)
    }
  }, [matchLeagueDetails])

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setInitialFlag(true)
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function handleChangeSearch (e, value) {
    if (e.key === 'Enter') {
      e.preventDefault()
    } else {
      setSearchText(value)
      setInitialFlag(true)
    }
  }

  function onHandleRecommendedSearch (e, value) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    if (isNumber(value)) {
      setUserSearch(parseInt(value))
      setIsNumber(true)
    } else {
      setUserSearch(value)
      setIsNumber(false)
    }
  }

  function getList (start, limit, search) {
    if (id2) {
      let searchData
      if (searchText) {
        if (IsNumber) {
          const data = recommendedList?.length > 0 && recommendedList.find(rec => rec.sMobNum === search)
          searchData = data._id
        } else {
          const data2 = recommendedList?.length > 0 && recommendedList.find(rec => rec.sEmail === search)
          searchData = data2._id
        }
      }
      const cashbackData = {
        start, limit, search: (searchData || search), matchId: id1, matchLeagueID: id2, token
      }
      dispatch(getUsersCashbackList(cashbackData))
    }
  }

  function onGetRecommendedList (data, sendId) {
    dispatch(getRecommendedList(data, sendId, token))
  }

  function heading () {
    const title = sportsType.charAt(0).toUpperCase() + sportsType.slice(1) + ' Match League Cashback List'
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
              heading={heading()}
              hidden
              matchLeaguePage={`/${sportsType}/match-management/match-league-management/${id1}`}
              onRefresh={onRefreshFun}
              permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'R')}
              refresh="Refresh"
            />
            <MatchLeagueCashbackList
              {...props}
              ref={content}
              List={usersCashbackList}
              flag={initialFlag}
              getList={getList}
              handleChangeSearch={handleChangeSearch}
              handleRecommendedSearch={onHandleRecommendedSearch}
              handleSearch={onHandleSearch}
              isUserSearch
              matchLeagueName={matchLeagueName}
              recommendedList={recommendedList}
              search={searchText}
              systemUserDebuggerPage="/settings/system-user/system-user-debugger-page/"
              userDebuggerPage="/users/user-management/user-debugger-page/"
              userSearch={userSearch}
            />
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

MatchLeagueCashback.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default MatchLeagueCashback
