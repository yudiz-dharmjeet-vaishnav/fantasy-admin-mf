import React, { Fragment, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types'

import AppLikeView from './AppLikeView'
import Layout from '../../../../components/Layout'
import SportsMainHeader from '../../SportsMainHeader'
import { getUrl } from '../../../../actions/url'
import { getMatchesTotalCount, getMatchList, getMatchListInReview, getMatchListLive } from '../../../../actions/match'

function IndexAppViewMatch (props) {
  const location = useLocation()
  const content = useRef()
  const dispatch = useDispatch()
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const matchList = useSelector(state => state.match.matchList)
  const LiveMatchList = useSelector(state => state.match.matchLive)
  const inReview = useSelector(state => state.match.matchInReview)
  const matchStatus = useSelector(state => state.match.matchStatus)
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('baseball') ? 'baseball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function getList (start, limit, sort, order, searchText, filterMatchStatus, startDate, endDate, provider, season, format) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const matchListData = {
      start, limit, sort, order, search: searchText, filter: filterMatchStatus, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', sportsType, provider, season, format, token
    }
    dispatch(getMatchList(matchListData))
  }
  function getListLive (start, limit, sort, order, searchText, filterMatchStatus, startDate, endDate, provider, season, format) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const matchListData = {
      start, limit, sort, order, search: searchText, filter: filterMatchStatus, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', sportsType, provider, season, format, token
    }
    dispatch(getMatchListLive(matchListData))
  }
  function getListInReview (start, limit, sort, order, searchText, filterMatchStatus, startDate, endDate, provider, season, format) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const matchListData = {
      start, limit, sort, order, search: searchText, filter: filterMatchStatus, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', sportsType, provider, season, format, token
    }
    dispatch(getMatchListInReview(matchListData))
  }

  function getMatchesTotalCountFunc (filter, search, startDate, endDate, provider, season, format) {
    const upcoming = {
      filter, search, startDate, endDate, provider, season, format, sportsType, token
    }
    dispatch(getMatchesTotalCount(upcoming))
  }

  function getMediaUrlFunc () {
    dispatch(getUrl('media'))
  }

  return (
    <Fragment>
      <Layout {...props} >

        <main className="main-content">
          <section className="management-section common-box">
            <Fragment>

              <SportsMainHeader
                appView
                heading={`${sportsType.charAt(0).toUpperCase() + sportsType.slice(1)} Matches`}
                hidden
                onRefresh={onRefreshFun}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'R')}
                refresh = 'Refresh Match Data'
              />

              <AppLikeView
                {...props}
                ref={content}
                List={matchList}
                getList={getList}
                getMatchesTotalCountFunc={getMatchesTotalCountFunc}
                getMediaUrlFunc={getMediaUrlFunc}
                matchStatus={matchStatus}
                sportsType={sportsType}
                getListLive={getListLive}
                getListInReview={getListInReview}
                LiveMatchList={LiveMatchList}
                inReview={inReview}
                viewLink={`/${sportsType}/match-management/view-match`}
              />
            </Fragment>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

IndexAppViewMatch.propTypes = {
  location: PropTypes.object
}

export default IndexAppViewMatch
