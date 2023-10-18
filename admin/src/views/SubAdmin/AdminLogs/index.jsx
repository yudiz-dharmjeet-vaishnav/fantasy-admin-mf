import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useQueryState } from 'react-router-use-location-state'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import qs from 'query-string'
import moment from 'moment'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import AdminLogsList from './AdminLogsList'
import SubAdminHeader from '../components/SubAdminHeader'
import SubAdminMainHeader from '../components/SubAdminMainHeader'

import { isNumber } from '../../../helpers/helper'
import { getRecommendedList } from '../../../actions/users'
import { adminIds, adminLogs, getLeagueLogs, getMatchLogs, singleAdminLogs } from '../../../actions/subadmin'

const AdminLogs = props => {
  const location = useLocation()
  const { id, leagueid } = useParams()
  const dispatch = useDispatch()
  const content = useRef()
  const [adminUsername, setAdminUsername] = useState('')
  const [searchType, setSearchType] = useState('')
  const [userName, setUserName] = useQueryState('user', '')
  const [userSearch, setUserSearch] = useState('')
  const [IsNumber, setIsNumber] = useState(false)
  const [initialFlag, setInitialFlag] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const token = useSelector(state => state?.auth?.token)
  const adminLogsList = useSelector(state => state?.subadmin?.adminLogsList)
  const recommendedList = useSelector(state => state?.users?.recommendedList)
  const adminsList = useSelector(state => state?.subadmin?.adminsList)
  const previousProps = useRef({ userSearch })?.current
  const dateFlag = useRef(false)

  useEffect(() => {
    const obj = qs?.parse(location?.search)
    if (obj?.user) {
      setUserName(obj?.user)
      setUserSearch(obj?.user)
      onGetRecommendedList(obj?.user, true)
      if (isNumber(obj?.user)) {
        setIsNumber(true)
      }
    } else if (recommendedList?.length === 0 || !recommendedList) {
      onGetRecommendedList('', false)
    }
    if (obj?.adminId) {
      setAdminUsername(obj?.adminId)
    }
    if (obj?.datefrom && obj?.dateto) {
      setDateRange([new Date(obj?.datefrom), new Date(obj?.dateto)])
    }
    if (obj?.searchType) {
      setSearchType(obj?.searchType)
    }
    getAdminIds()
  }, [])

  function handleAdminSearch (e) {
    setAdminUsername(e?.target?.value)
    getAdminIds()
    setInitialFlag(true)
  }

  function handleSearch (e, value) {
    if (e?.key === 'Enter') {
      e?.preventDefault()
    } else {
      setUserName(value)
      setInitialFlag(true)
    }
  }

  function handleNormalSearch (val) {
    setUserName(val)
  }

  useEffect(() => {
    const typeOfUserSearch = typeof userSearch
    const callSearchService = () => {
      if (typeOfUserSearch === 'string') {
        onGetRecommendedList(userSearch?.trim(), false)
      } else {
        onGetRecommendedList(userSearch, false)
      }
    }
    if (initialFlag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.userName = userName
      }
    }
  }, [userSearch])

  function onHandleRecommendedSearch (e, value) {
    if (e?.key === 'Enter') {
      e?.preventDefault()
    }
    if (isNumber(value)) {
      setUserSearch(parseInt(value))
      setIsNumber(true)
    } else {
      setUserSearch(value)
      setIsNumber(false)
    }
  }

  function onGetRecommendedList (data, sendId) {
    dispatch(getRecommendedList(data, sendId, token))
  }

  function handleOtherFilter (e) {
    setSearchType(e?.target?.value)
  }

  function getList (start, limit, order, search, searchType, adminId, dateFrom, dateTo) {
    let searchData = ''
    if (searchType === 'AW' || searchType === 'AD' || searchType === 'D' || searchType === 'W' || searchType === 'KYC' || searchType === 'P' || searchType === 'BD' || searchType === '') {
      if (search) {
        if (IsNumber) {
          const data1 = recommendedList?.length > 0 && recommendedList.find(rec => rec?.sMobNum === search)
          searchData = data1 ? data1?._id : ''
        } else {
          const data2 = recommendedList?.length > 0 && recommendedList.find(rec => rec?.sEmail === search)
          searchData = data2 ? data2?._id : ''
        }
      }
    }
    const StartDate = dateFrom ? new Date(moment(dateFrom)?.startOf('day')?.format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo)?.endOf('day')?.format()) : ''
    const data = {
      start, limit, order, search: (searchData || search), searchType, adminId, dateFrom: (StartDate ? new Date(StartDate)?.toISOString() : ''), dateTo: (EndDate ? new Date(moment(new Date(EndDate))?.endOf('day'))?.toISOString() : ''), token
    }
    dispatch(adminLogs(data))
  }

  function getSingleAdminLog (id) {
    dispatch(singleAdminLogs(id, token))
  }

  function getMatchLogsFunc (start, limit) {
    dispatch(getMatchLogs(start, limit, id, token))
  }

  function getLeagueLogsFunc (start, limit) {
    dispatch(getLeagueLogs(start, limit, leagueid, token))
  }

  function getAdminIds () {
    dispatch(adminIds(token))
  }

  function onRefreshFun () {
    content?.current?.onRefresh()
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <SubAdminMainHeader
              header="Admin Logs"
              isLeagueLog={leagueid}
              isMatchLog={id}
              matchApiLogUrl={`/${id}/matchapi-logs`}
              onRefresh={onRefreshFun}
              refresh = "Refresh Admin Logs "
            />
            <div className={(adminLogsList?.nTotal === 0 || adminLogsList === undefined || adminsList?.length === 0) ? 'without-pagination' : 'setting-component'}>
              <SubAdminHeader
                {...props}
                List={adminLogsList}
                adminLogs
                adminSearch={adminUsername}
                adminsList={adminsList}
                dateFlag={dateFlag}
                dateRange={dateRange}
                endDate={endDate}
                handleAdminSearch={handleAdminSearch}
                handleChangeSearch={handleSearch}
                handleNormalSearch={handleNormalSearch}
                handleOtherFilter={handleOtherFilter}
                handleRecommendedSearch={onHandleRecommendedSearch}
                isLeagueLog={leagueid}
                isMatchLog={id}
                matchApiLogUrl={`/admin-logs/${id}/matchapi-logs`}
                recommendedList={recommendedList}
                search={userName}
                searchType={searchType}
                setDateRange={setDateRange}
                startDate={startDate}
                userSearch={userSearch}
              />
              <AdminLogsList
                {...props}
                ref={content}
                List={adminLogsList}
                adminSearch={adminUsername}
                dateFlag={dateFlag}
                endDate={endDate}
                flag={initialFlag}
                getAdminIds={getAdminIds}
                getLeagueLogsFunc={getLeagueLogsFunc}
                getList={getList}
                getMatchLogsFunc={getMatchLogsFunc}
                getSingleAdminLog={getSingleAdminLog}
                recommendedList={recommendedList}
                search={userName}
                searchType={searchType}
                setSearch={setUserName}
                startDate={startDate}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

AdminLogs.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default AdminLogs
