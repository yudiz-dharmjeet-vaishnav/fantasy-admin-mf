import React, { Fragment, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useQueryState } from 'react-router-use-location-state'
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import qs from 'query-string'

import Layout from '../../../components/Layout'
import UserListHeader from '../Component/UsersListHeader'
import TDSManagement from './TDSManagement'
import UsersListMainHeader from '../Component/UsersListMainHeader'

import { getTDSList, tdsCount, updateTds, getLeagueTdsList, tdsLeagueCount } from '../../../actions/users'

const TDS = props => {
  const { id } = useParams()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [initialFlag, setInitialFlag] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [leagueToTds, setLeagueToTds] = useState(false)
  const [leagueToTdsId, setLeagueToTdsId] = useState('')
  const [leagueToTdsMatch, setLeagueToTdsMatch] = useState('')
  const [leagueToTdsLeague, setLeagueToTdsLeague] = useState('')
  const [filter, setFilter] = useQueryState('status', 'P')
  const [userType, setUserType] = useQueryState('eUserType', '')

  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const tdsList = useSelector((state) => state.users.tdsList)
  const content = useRef()

  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearch(obj.search)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
    // when navigate to the matchLeague to Tds page , ulr matchLeague sport/match-management/match-league-management/id
    // this state are set
    setLeagueToTds(props?.location?.state?.leagueTotds) // set flag
    setLeagueToTdsId(props?.location?.state?.leagueTdsId)// set id
    setLeagueToTdsMatch(props?.location?.state?.matchNameToTds) // set matchName
    setLeagueToTdsLeague(props?.location?.state?.leagueNameToTds) // set league id
  }, [])

  function onHandleSearch (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    setSearch(e.target.value)
    setInitialFlag(true)
  }

  function getTDSTotalCountFunc (searchValue, status, userType, startDate, endDate) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    // const id = Id
    const data = {
      searchValue, status, userType, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', token
    }
    // dispatch action set to tds Count api
    dispatch(tdsCount(data))
  }

  function getLeagueTdsCount (searchValue, status, userType, startDate, endDate) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    // const id = Id
    const data = {
      id, searchValue, status, userType, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', token
    }
    // dispatch action set to tds-league count
    dispatch(tdsLeagueCount(data))
  }

  function getList (start, limit, sort, order, userType, searchValue, status, startDate, endDate, isFullResponse) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const data = {
      start, limit, sort, order, userType, searchValue: searchValue.trim(), status, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', isFullResponse, token
    }
    // dispatch action set to tds list
    dispatch(getTDSList(data))
  }

  function getLeagueTds (start, limit, sort, order, userType, searchValue, status, startDate, endDate, isFullResponse) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const data = {
      id, start, limit, sort, order, userType, searchValue: searchValue.trim(), status, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', isFullResponse, token
    }
    // dispatch action set to league-tds list
    dispatch(getLeagueTdsList(data))
  }

  function updateTdsFunc (status, id) {
    dispatch(updateTds(status, id, token))
  }

  function onExport () {
    content.current.onExport()
  }

  function onRefresh () {
    content.current.onRefresh()
  }

  function onFilter (e) {
    setFilter(e.target.value)
  }

  function handleUserType (e) {
    setUserType(e.target.value)
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className='main-content'>
          <section className='management-section common-box'>
            <UsersListMainHeader
              heading='TDS Management'
              idLeagueLog={id}
              isLeagueToTds={leagueToTds}
              leagueToTdsId={leagueToTdsId}
              leagueToTdsLeague={leagueToTdsLeague}
              leagueToTdsMatch={leagueToTdsMatch}
              list={tdsList}
              onExport={onExport}
              onRefresh={onRefresh}
              refresh = 'Refresh TDS Data'
            />
            <div className= {tdsList?.length === 0 ? 'without-pagination' : 'setting-component'}>
              <UserListHeader
                dateRange={dateRange}
                endDate={endDate}
                filter={filter}
                handleSearch={onHandleSearch}
                handleUserType={handleUserType}
                heading='TDS Management'
                idLeagueLog={id}
                isLeagueToTds={leagueToTds}
                leagueToTdsId={leagueToTdsId}
                leagueToTdsLeague={leagueToTdsLeague}
                leagueToTdsMatch={leagueToTdsMatch}
                list={tdsList}
                onFilter={onFilter}
                search={search}
                setDateRange={setDateRange}
                startDate={startDate}
                tdsUserType
                userType={userType}
              />
              <TDSManagement
                {...props}
                ref={content}
                List={tdsList}
                endDate={endDate}
                flag={initialFlag}
                getLeagueTds={getLeagueTds}
                getLeagueTdsCount={getLeagueTdsCount}
                getList={getList}
                getTDSTotalCountFunc={getTDSTotalCountFunc}
                isLeagueLog={id}
                search={search}
                startDate={startDate}
                updateTdsFunc={updateTdsFunc}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

TDS.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default TDS
