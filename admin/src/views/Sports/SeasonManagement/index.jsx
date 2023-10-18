import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import qs from 'query-string'
import moment from 'moment'
import PropTypes from 'prop-types'

import SeasonList from './SeasonList'
import SportsHeader from '../SportsHeader'
import Layout from '../../../components/Layout'
import SportsMainHeader from '../SportsMainHeader'
import { getSeasonList, updateSeason } from '../../../actions/season'

const SeasonManagement = props => {
  const location = useLocation()
  const content = useRef()
  const dispatch = useDispatch()
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setInitialFlag] = useState(false)
  const seasonList = useSelector(state => state.season.seasonList)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('baseball') ? 'baseball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''

  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
  }, [])

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setInitialFlag(true)
  }

  function getList (start, limit, search, dateFrom, dateTo) {
    const from = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const to = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const data = { start, limit, search: search.trim(), sportsType, startDate: from ? new Date(from).toISOString() : '', endDate: to ? new Date(to).toISOString() : '', token }
    // dispatch action season list
    dispatch(getSeasonList(data))
  }

  function updateSeasonFunc (seasonName, seasonId) {
    const data = {
      seasonName, seasonId, token
    }
    // dispatch action updateSeason
    dispatch(updateSeason(data))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <Fragment>
              <SportsMainHeader
                DateText="Fetch Match Data"
                heading='Season Management'
                onRefresh={onRefreshFun}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'R')}
                refresh='Refresh Match Data'
              />
              <div className={seasonList?.total === 0 ? ' without-pagination' : 'setting-component'}>
                <SportsHeader
                  SearchPlaceholder="Search Match"
                  dateRange={dateRange}
                  endDate={endDate}
                  flag={initialFlag}
                  getList={getList}
                  handleSearch={onHandleSearch}
                  heading='Season Management'
                  matchManagement
                  search={searchText}
                  searchDateBox
                  seasonList={seasonList}
                  setDateRange={setDateRange}
                  startDate={startDate}
                />
                <SeasonList
                  {...props}
                  ref={content}
                  endDate={endDate}
                  flag={initialFlag}
                  getList={getList}
                  search={searchText}
                  seasonList={seasonList}
                  sportsType={sportsType}
                  startDate={startDate}
                  updateSeasonFunc={updateSeasonFunc}
                  userListView={`/${sportsType}/season-management/users-list`}
                />
              </div>
            </Fragment>
          </section>
        </main>
      </Layout>
    </div>
  )
}

SeasonManagement.propTypes = {
  location: PropTypes.object
}

export default SeasonManagement
