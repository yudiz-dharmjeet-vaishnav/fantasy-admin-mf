import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import moment from 'moment'
import PropTypes from 'prop-types'

// component
import Layout from '../../../components/Layout'
import UserHeader from '../Component/UsersListHeader'
import UserList from './UserList'
import UsersListMainHeader from '../Component/UsersListMainHeader'

// api
import { getDeletedUserList, getUserList, getUsersTotalCount } from '../../../actions/users'

function UsersList (props) {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const usersTotalCount = useSelector(state => state.users.usersTotalCount)
  const resStatus = useSelector(state => state.users.usersTotalCount)
  const resMessage = useSelector(state => state.users.resMessage)
  const usersList = useSelector((state) => state.users.usersList)
  const content = useRef()

  // useEffect to initial call for search ,data and filter
  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.searchvalue) {
      setSearch(obj.searchvalue)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
    if (obj.filterBy) {
      setFilter(obj.filterBy)
    }
  }, [])

  // function use a search Filter
  function onHandleSearch (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    setSearch(e.target.value)
    setinitialFlag(true)
  }

  function handleOtherFilter (e) {
    setFilter(e.target.value)
  }

  function getUsersTotalCountFunc (searchvalue, filterBy, startDate, endDate) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const data = {
      searchvalue, filterBy, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', token
    }
    // dispatch action to getUsersTotalCount
    dispatch(getUsersTotalCount(data))
  }

  // function for userList and dispatch action userList
  function getList (start, limit, sort, order, searchvalue, filterBy, startDate, endDate, isFullResponse) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const usersData = {
      start, limit, sort, order, searchvalue: searchvalue.trim(), filterBy, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', isFullResponse, token
    }
    dispatch(getUserList(usersData))
  }

  // for delete user
  function getDeletedUsers (start, limit, sort, order, searchvalue, filterBy, startDate, endDate, isFullResponse) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const usersData = {
      start, limit, sort, order, searchvalue: searchvalue.trim(), filterBy, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', isFullResponse, token
    }
    dispatch(getDeletedUserList(usersData))
  }

  function onExport () {
    content.current.onExport()
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className='main-content'>
          <section className='management-section common-box'>
            <UsersListMainHeader
              heading={location.pathname.includes('deleted-users') ? 'Deleted Users' : 'Users'}
              list={usersList}
              onExport= {onExport}
              onRefresh={onRefreshFun}
              refresh = 'Refresh User Data'
              users
            />
            <div className={usersList?.results?.length === 0 ? 'without-pagination' : 'setting-component'}>
              <UserHeader
                dateRange={dateRange}
                endDate={endDate}
                filter={filter}
                handleOtherFilter={handleOtherFilter}
                handleSearch={onHandleSearch}
                list={usersList}
                normalUser
                search={search}
                searchBox
                setDateRange={setDateRange}
                startDate={startDate}
                totalCount={usersTotalCount}
                heading={location?.pathname.includes('deleted')}
                users
              />
              <UserList
                {...props}
                ref={content}
                List={usersList}
                endDate={endDate}
                filter={filter}
                flag={initialFlag}
                getDeletedUsers={getDeletedUsers}
                getList={getList}
                getUsersTotalCountFunc={getUsersTotalCountFunc}
                resMessage={resMessage}
                resStatus={resStatus}
                search={search}
                setDateRange={setDateRange}
                setFilter={setFilter}
                setSearchProp={setSearch}
                setinitialFlag={setinitialFlag}
                startDate={startDate}
                usersTotalCount={usersTotalCount}
                viewLink='/users/user-management/user-details'
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

UsersList.propTypes = {
  location: PropTypes.object
}

export default UsersList
