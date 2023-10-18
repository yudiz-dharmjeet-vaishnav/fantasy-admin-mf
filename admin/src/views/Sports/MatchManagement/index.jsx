import React, { useRef, useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import moment from 'moment'
import PropTypes from 'prop-types'

import SportsHeader from '../SportsHeader'
import Layout from '../../../components/Layout'
import SportsMainHeader from '../SportsMainHeader'
import MatchManagementComponent from './MatchManagement'
import { getMatchList, fetchMatch, clearMatchMsg, getMatchesTotalCount } from '../../../actions/match'
import { getSeasonDetails, getSeasonList } from '../../../actions/season'

function IndexMatchManagement (props) {
  const content = useRef()
  const location = useLocation()
  const [searchText, setSearchText] = useState('')
  const [selectedDate, setselectedDate] = useState(null)
  const [openPicker, setOpenPicker] = useState(false)
  const [initialFlag, setinitialFlag] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [provider, setProvider] = useState('ENTITYSPORT')
  const [sFormat, setsFormat] = useQueryState('format', '')
  const [filterMatchStatus, setfilterMatchStatus] = useQueryState('filter', '')
  const [sProvider, setsProvider] = useQueryState('provider', '')
  const [season, setSeason] = useQueryState('iSeasonId', '')
  const [selectedSeason, setSelectedSeason] = useState([])
  const [listOfSeasons, setListOfSeasons] = useState([])
  const [activePageSeason, setActivePageSeason] = useState(1)
  const [seasonInput, setSeasonInput] = useState('')
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const matchList = useSelector(state => state.match.matchList)
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('baseball') ? 'baseball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''
  const seasonResponseList = useSelector(state => state?.season?.seasonList)
  const dispatch = useDispatch()
  useEffect(() => {
    const obj = qs.parse(location.pathname.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
  }, [])

  useEffect(() => {
    sportsType === 'csgo' || sportsType === 'dota2' ? setProvider('PANDASCORE') : setProvider('ENTITYSPORT')
  }, [sportsType])
  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setinitialFlag(true)
  }

  function onHandleDatePicker (isOpen = true, sd) {
    setOpenPicker(isOpen)
    if (sd) {
      setselectedDate(moment(sd).format('DD-MM-YYYY'))
    }
  }

  function getMatchesTotalCountFunc (search, filter, dateFrom, dateTo, matchProvider, season, format) {
    const from = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const to = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const matchListData = {
      search, filter, startDate: from ? new Date(from).toISOString() : '', endDate: to ? new Date(to).toISOString() : '', sportsType: sportsType.toUpperCase(), provider: matchProvider, season, format, token
    }
    dispatch(getMatchesTotalCount(matchListData))
  }
  function getList (start, limit, sort, order, search, filterMatchStatus, dateFrom, dateTo, matchProvider, season, format) {
    const from = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const to = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const matchListData = {
      start, limit, sort, order, search, filter: filterMatchStatus, startDate: from ? new Date(from).toISOString() : '', endDate: to ? new Date(to).toISOString() : '', sportsType: sportsType.toUpperCase(), provider: matchProvider, season, format, token
    }
    dispatch(getMatchList(matchListData))
  }

  function getSeason (id) {
    dispatch(getSeasonDetails(id, token))
  }

  function seasonList (start, limit, search, sportsType) {
    const startDate = ''
    const endDate = ''
    const data = { start, limit, search, sportsType, startDate, endDate, token }
    dispatch(getSeasonList(data))
  }

  function setProviderFunc (event) {
    setProvider(event?.target?.value)
  }

  function AddMatch (date) {
    dispatch(fetchMatch(date, provider, token, sportsType))
  }

  function clearMatchMsgFun () {
    dispatch(clearMatchMsg())
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function onFiltering (event, type) {
    if (type === 'status') {
      setfilterMatchStatus(event.target.value)
    } else if (type === 'provider') {
      setsProvider(event.target.value)
    } else if (type === 'format') {
      setsFormat(event.target.value)
    } else if (type === 'season') {
      setSeason(event ? event.value : '')
      setSelectedSeason(event)
    }
  }

  function onSeasonPagination () {
    const length = Math.ceil(seasonResponseList?.total / 10)
    if (activePageSeason < length) {
      const start = activePageSeason * 10
      const limit = 10
      seasonList(start, limit, seasonInput, sportsType)
      setActivePageSeason(activePageSeason + 1)
    }
  }

  function handleInputChange (value) {
    setSeasonInput(value)
  }
  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <Fragment>
              <SportsMainHeader
                DateText="Fetch Match Data"
                handleDatePicker={onHandleDatePicker}
                heading={`${sportsType.charAt(0).toUpperCase() + sportsType.slice(1)} Match Management`}
                onRefresh={onRefreshFun}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'R')}
                refresh='Refresh Match Data'
              />
              <div className={(matchList?.results?.length > 0 || !matchList) ? 'setting-component' : 'without-pagination '}>
                <SportsHeader
                  DateText="Fetch Match Data"
                  SearchPlaceholder="Search Match"
                  buttonText="Add Match"
                  dateRange={dateRange}
                  endDate={endDate}
                  extButton
                  filterMatchStatus={filterMatchStatus}
                  handleDatePicker={onHandleDatePicker}
                  handleInputChange={handleInputChange}
                  handleSearch={onHandleSearch}
                  heading='Match Management'
                  listOfSeasons={listOfSeasons}
                  matchManagement
                  onFiltering={onFiltering}
                  onRefresh={onRefreshFun}
                  onSeasonPagination={onSeasonPagination}
                  permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'R')}
                  refresh
                  sFormat={sFormat}
                  sProvider={sProvider}
                  search={searchText}
                  searchDateBox
                  season={season}
                  seasonInput={seasonInput}
                  seasonList={seasonList}
                  selectedDate={selectedDate}
                  selectedSeason={selectedSeason}
                  setDateRange={setDateRange}
                  setUrl={`/${sportsType}/match-management/add-match`}
                  startDate={startDate}
                />
                <MatchManagementComponent
                  {...props}
                  ref={content}
                  AddMatch={AddMatch}
                  clearMatchMsg={clearMatchMsgFun}
                  endDate={endDate}
                  filterMatchStatus={filterMatchStatus}
                  flag={initialFlag}
                  getList={getList}
                  getMatchesTotalCountFunc={getMatchesTotalCountFunc}
                  getSeason={getSeason}
                  handleDatePicker={onHandleDatePicker}
                  listOfSeasons={listOfSeasons}
                  openPicker={openPicker}
                  provider={provider}
                  search={searchText}
                  season={season}
                  seasonInput={seasonInput}
                  seasonList={seasonList}
                  setListOfSeasons={setListOfSeasons}
                  setProviderFunc={setProviderFunc}
                  setSelectedSeason={setSelectedSeason}
                  sportsType={sportsType}
                  startDate={startDate}
                  setProvider={setProvider}
                  viewLink={`/${sportsType}/match-management/view-match`}
                />
              </div>
            </Fragment>
          </section>
        </main>
      </Layout>
    </div>
  )
}

IndexMatchManagement.propTypes = {
  location: PropTypes.object
}

export default IndexMatchManagement
