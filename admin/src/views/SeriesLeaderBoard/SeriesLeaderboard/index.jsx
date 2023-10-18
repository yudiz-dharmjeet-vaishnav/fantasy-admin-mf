import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import LeagueHeader from '../../Leagues/Header/LeagueHeader'
import SeriesLeaderBoard from './SeriesLeaderBoard'
import MainLeagueHeader from '../../Leagues/MainHeader/MainLeagueHeader'
import { getGameCategory } from '../../../actions/league'
import { getSeriesList } from '../../../actions/seriesLeaderBoard'

function SeriesLB (props) {
  const location = useLocation()
  const [searchText, setSearchText] = useQueryState('search', '')
  const [SportsType, setSportsType] = useQueryState('sportsType', 'CRICKET')
  const [seriesStatus, setSeriesStatus] = useQueryState('status', '')
  const [initialFlag, setinitialFlag] = useState(false)
  const token = useSelector(state => state.auth.token)
  const leaderboardSeriesList = useSelector(state => state.seriesLeaderBoard.leaderboardSeriesList)
  const GameCategoryList = useSelector(state => state.league.GamecategoryList)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const dispatch = useDispatch()
  const content = useRef()
  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  function onHandleSearch (value) {
    setSearchText(value)
    setinitialFlag(true)
  }

  function onHandleSport (value) {
    setSportsType(value)
  }

  function getGameCategoryFun () {
    dispatch(getGameCategory(token))
  }

  function getList (start, limit, sort, order, search, status, SportsType) {
    const data = {
      start, limit, sort, order, search: search.trim(), status, SportsType, token
    }
    dispatch(getSeriesList(data))
  }

  function onFiltering (event) {
    setSeriesStatus(event.target.value)
  }

  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainLeagueHeader
              heading="Series Leaderboard"
            />

            <div className={leaderboardSeriesList?.total === 0 ? 'without-pagination' : 'setting-component'}>
              <LeagueHeader
                GameCategoryList={GameCategoryList}
                SearchPlaceholder="Search Series Leaderboard"
                addButton
                buttonText="Add Series"
                handleSearch={onHandleSearch}
                handleSportType={onHandleSport}
                league
                onFiltering={onFiltering}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD !== 'R')}
                search={searchText}
                selectGame={SportsType}
                seriesLeaderBoard
                seriesStatus={seriesStatus}
                setSeriesStatus={setSeriesStatus}
                setUrl="/seriesLeaderBoard/add-SeriesLeaderBoard"
              />
              <SeriesLeaderBoard
                {...props}
                ref={content}
                List={leaderboardSeriesList}
                flag={initialFlag}
                getGameCategory={getGameCategoryFun}
                getList={getList}
                handleSportType={onHandleSport}
                search={searchText}
                selectGame={SportsType}
                seriesStatus={seriesStatus}
                updateSeries="/seriesLeaderBoard/edit-SeriesLeaderBoard"
              />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

SeriesLB.propTypes = {
  location: PropTypes.object
}

export default SeriesLB
