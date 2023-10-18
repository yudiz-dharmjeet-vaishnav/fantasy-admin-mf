import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import PassbookList from './PassbookList'
import UsersListHeader from '../Component/UsersListHeader'
import UsersListMainHeader from '../Component/UsersListMainHeader'

import { getLeaguePassbookList, getLeagueTransactionsTotalCount, getPassbookList, getTransactionsTotalCount } from '../../../actions/passbook'

function Passbook (props) {
  const location = useLocation()
  const { Id } = useParams()
  const [searchText, setSearchText] = useState('')
  const [searchType, setSearchType] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [userToPass, setUserToPass] = useState(false)
  const [systemUserToPass, setSystemUserToPass] = useState(false)
  const [tdsToPass, setTdsToPass] = useState(false)
  const [leagueToPass, setLeagueToPass] = useState(false)
  const [userToPassId, setUserToPassId] = useState('')
  const [leagueToPassId, setLeagueToPassId] = useState('')
  const [SeriesLeaderBoardUserRankLink, setSeriesLeaderBoardUserRankLink] = useState('')
  const [isSeriesLeaderBoardUserRank, setIsSeriesLeaderBoardUserRank] = useState('')
  const [tdsToPassId, setTdsToPassId] = useState(0)
  const [leagueToPassbookMatch, setLeagueToPassbookMatch] = useState('')
  const [leagueToPassbookLeague, setLeagueToPassbookLeague] = useState('')
  const [transactionStatus, setTransactionStatus] = useQueryState('transactionStatus', '')
  const [particulars, setParticulars] = useQueryState('particulars', '')
  const [eType, setEType] = useQueryState('etype', '')
  const [userType, setUserType] = useQueryState('eUserType', '')
  const dispatch = useDispatch()
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const token = useSelector(state => state.auth.token)
  const passbookList = useSelector(state => state.passbook.passbookList)

  const content = useRef()

  // useEffect set to the navigate state
  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.searchValue) {
      setSearchText(obj.searchValue)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
    if (obj.searchType) {
      setSearchType(obj.searchType)
    }
    setSystemUserToPass(location?.state?.systemUserToPassbook)
    setUserToPass(location?.state?.userToPassbook)
    setUserToPassId(location?.state?.id)
    setTdsToPass(location?.state?.tdsToPassbook)
    setTdsToPassId(location?.state?.passbookId)
    setLeagueToPass(location?.state?.leagueToPassbook)
    setLeagueToPassId(location?.state?.leaguePassbookId)
    setLeagueToPassbookMatch(location?.state?.matchNameToPassbook)
    setLeagueToPassbookLeague(location?.state?.leagueNameToPassbook)
    setSeriesLeaderBoardUserRankLink(location?.state?.SeriesLeaderBoardUserRankLink)
    setIsSeriesLeaderBoardUserRank(location?.state?.isSeriesLeaderBoardUserRank)
  }, [])

  function onHandleSearch (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    setSearchText(e.target.value)
    setinitialFlag(true)
  }

  function handleOtherFilter (e) {
    setSearchType(e.target.value)
  }

  function getTransactionsTotalCountFunc (search, searchType, userType, dateFrom, dateTo, particulars, eType, status, isFullResponse) {
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const passBookData = {
      search: search.trim(), searchType, userType, startDate: StartDate ? new Date(StartDate).toISOString() : '', endDate: EndDate ? new Date(EndDate).toISOString() : '', particulars, eType, status, isFullResponse, token
    }
    // dispatch action to get TransactionsTotalCount
    dispatch(getTransactionsTotalCount(passBookData))
  }

  function leagueTransactionsTotalCountFunc (search, searchType, userType, dateFrom, dateTo, particulars, eType, status, isFullResponse) {
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const id = Id
    const passBookData = {
      id, search: search.trim(), searchType, userType, startDate: StartDate ? new Date(StartDate).toISOString() : '', endDate: EndDate ? new Date(EndDate).toISOString() : '', particulars, eType, status, isFullResponse, token
    }
    // dispatch action to get LeagueTransactionTotalCount
    dispatch(getLeagueTransactionsTotalCount(passBookData))
  }

  function getList (start, limit, sort, order, userType, search, searchType, dateFrom, dateTo, particulars, eType, status, isFullResponse) {
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const passBookData = {
      start, limit, sort, order, userType, search, searchType, startDate: StartDate ? new Date(StartDate).toISOString() : '', endDate: EndDate ? new Date(EndDate).toISOString() : '', particulars, eType, status, isFullResponse, token
    }
    // dispatch action get PassbookList
    dispatch(getPassbookList(passBookData))
  }

  function leaguePassbookList (start, limit, sort, order, search, searchType, userType, dateFrom, dateTo, particulars, eType, status, isFullResponse) {
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const id = Id
    const passBookData = {
      id, start, limit, sort, order, search, searchType, userType, startDate: StartDate ? new Date(StartDate).toISOString() : '', endDate: EndDate ? new Date(EndDate).toISOString() : '', particulars, eType, status, isFullResponse, token
    }
    // dispatch action get LeaguePassbook List
    dispatch(getLeaguePassbookList(passBookData))
  }

  function onExport () {
    content.current.onExport()
  }

  function onRefresh () {
    content.current.onRefresh()
  }

  function handleUserType (e) {
    setUserType(e.target.value)
  }

  function onFiltering (event, type) {
    if (type === 'Particulars') {
      setParticulars(event.target.value)
    } else if (type === 'eType') {
      setEType(event.target.value)
    } else if (type === 'TransactionStatus') {
      setTransactionStatus(event.target.value)
    }
  }
  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <UsersListMainHeader
              {...props}
              SeriesLeaderBoardUserRankLink={SeriesLeaderBoardUserRankLink}
              heading="Transactions"
              isLeagueToPassbook={leagueToPass}
              isSeriesLeaderBoardUserRank={isSeriesLeaderBoardUserRank}
              isSystemUserToPassbook={systemUserToPass}
              isTdsToPassbook={tdsToPass}
              isUserToPassbook={userToPass}
              leagueToPassbookId={leagueToPassId}
              leagueToPassbookLeague={leagueToPassbookLeague}
              leagueToPassbookMatch={leagueToPassbookMatch}
              list={passbookList}
              onExport={onExport}
              onRefresh={onRefresh}
              passbook
              refresh = 'Refresh Transaction Data'
              tdsToPassbookId={tdsToPassId}
              transactionReport
              transactionReportPage='/users/transaction-report'
              userToPassbookId={userToPassId}
            />
            <div className={passbookList?.rows?.length === 0 ? 'without-pagination' : ' trans-component'}>
              <UsersListHeader
                {...props}
                dateRange={dateRange}
                eType={eType}
                endDate={endDate}
                handleOtherFilter={handleOtherFilter}
                handleSearch={onHandleSearch}
                heading="Transactions"
                isLeagueToPassbook={leagueToPass}
                isSeriesLeaderBoardUserRank={isSeriesLeaderBoardUserRank}
                isSystemUserToPassbook={systemUserToPass}
                isTdsToPassbook={tdsToPass}
                isUserToPassbook={userToPass}
                leagueToPassbookId={leagueToPassId}
                leagueToPassbookLeague={leagueToPassbookLeague}
                leagueToPassbookMatch={leagueToPassbookMatch}
                list={passbookList}
                onFiltering={onFiltering}
                particulars={particulars}
                passBookID
                passbook
                search={searchText}
                searchBox
                searchType={searchType}
                setDateRange={setDateRange}
                startDate={startDate}
                tdsToPassbookId={tdsToPassId}
                transactionReport
                transactionReportPage='/users/transaction-report'
                transactionStatus={transactionStatus}
                userToPassbookId={userToPassId}
                handleUserType={handleUserType}
                userType={userType}

              />
              <PassbookList
                {...props}
                ref={content}
                List={passbookList}
                endDate={endDate}
                flag={initialFlag}
                getList={getList}
                getTransactionsTotalCountFunc={getTransactionsTotalCountFunc}
                isLeaguePassbook={Id}
                isTdsToPassbook={tdsToPass}
                isUserToPassbook={userToPass}
                leaguePassbookList={leaguePassbookList}
                leagueTransactionsTotalCountFunc={leagueTransactionsTotalCountFunc}
                onExport={onExport}
                search={searchText}
                searchType={searchType}
                startDate={startDate}
                tdsToPassbookId={tdsToPassId}
                userType={userType}
                userToPassbookId={userToPassId}
                viewLink="/users/user-management/user-details"
              />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

Passbook.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default Passbook
