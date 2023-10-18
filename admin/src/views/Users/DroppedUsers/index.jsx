import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import moment from 'moment'
import PropTypes from 'prop-types'

// component
import Layout from '../../../components/Layout'
import UserHeader from '../Component/UsersListHeader'
import UsersListMainHeader from '../Component/UsersListMainHeader'

// api
// import getDroppedUser from '../../../api/DroppedUsers/getDroppedUser'
import { getDroppedUser } from '../../../actions/users'
import DroppedUserList from './DroppedUsersList'

function DroppedUser (props) {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const resMessage = useSelector(state => state.users.resMessage)
  const resStatus = useSelector(state => state.users.resStatus)
  const droppedUsersList = useSelector(state => state.users.droppedUserList)
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

  // function for userList and dispatch action userList
  function getList (start, limit, sort, order, search, type, startDate, endDate) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const usersData = {
      start, limit, sort, order, search: search.trim(), type, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', token
    }
    dispatch(getDroppedUser(usersData))
  }

  // for delete user

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
              heading="Dropped Users"
              list={droppedUsersList?.result?.data}
              onExport= {onExport}
              onRefresh={onRefreshFun}
              refresh = 'Refresh User Data'
              users
            />
            <div className={droppedUsersList?.result?.data?.length === 0 ? 'without-pagination' : 'setting-component'}>
              <UserHeader
                dateRange={dateRange}
                endDate={endDate}
                filter={filter}
                handleOtherFilter={handleOtherFilter}
                handleSearch={onHandleSearch}
                list={droppedUsersList}
                search={search}
                searchBox
                setDateRange={setDateRange}
                startDate={startDate}
                totalCount={droppedUsersList?.result?.nTotal}
                droppedUser
              />
              <DroppedUserList
                {...props}
                ref={content}
                List={droppedUsersList}
                endDate={endDate}
                filter={filter}
                flag={initialFlag}
                getList={getList}
                resMessage={resMessage}
                resStatus={resStatus}
                search={search}
                setDateRange={setDateRange}
                setFilter={setFilter}
                setSearchProp={setSearch}
                setinitialFlag={setinitialFlag}
                startDate={startDate}
                viewLink='/users/user-management/user-details'
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

DroppedUser.propTypes = {
  location: PropTypes.object
}

export default DroppedUser
