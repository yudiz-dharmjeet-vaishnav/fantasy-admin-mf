import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import Heading from '../../Settings/component/Heading'
import PushNotificationContent from './PushNotification'
import MainHeading from '../../Settings/component/MainHeading'

import { pushNotificationList } from '../../../actions/pushnotification'

function PushNotification (props) {
  const location = useLocation()
  const dispatch = useDispatch()
  const content = useRef()
  const [search, setSearch] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [modalOpen, setModalOpen] = useState(false)
  const [sPlatform, setsPlatform] = useQueryState('platform', '')

  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector(state => state.auth.token)
  const notificationList = useSelector(state => state.pushNotification.pushNotificationList)

  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearch(obj.search)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
  }, [])

  function onHandleSearch (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    setSearch(e.target.value)
    setinitialFlag(true)
  }

  function getList (start, limit, sort, search, dateFrom, dateTo, platform, orderby) {
    const from = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const to = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const listData = {
      start, limit, sort, search, startDate: from ? new Date(from).toISOString() : '', endDate: to ? new Date(to).toISOString() : '', platform, orderby, token
    }
    dispatch(pushNotificationList(listData))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function onFiltering (event) {
    setsPlatform(event.target.value)
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainHeading
              heading="Push Notifications"
              list={notificationList}
              onRefresh={onRefreshFun}
              permission={(Auth && Auth === 'SUPER') || (adminPermission?.PUSHNOTIFICATION !== 'R')}
              refresh = 'Refresh Push Notofications'
            />
            <div className={notificationList?.results?.length === 0 ? 'without-pagination' : 'setting-component'}>
              <Heading
                aNotification="Automated Notifications"
                dateRange={dateRange}
                endDate={endDate}
                handleSearch={onHandleSearch}
                list={notificationList}
                modalOpen={modalOpen}
                notification="Send Push Notification"
                notificationFilter
                onFiltering={onFiltering}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.PUSHNOTIFICATION !== 'R')}
                pushNotification
                sPlatform={sPlatform}
                search={search}
                setDateRange={setDateRange}
                setModalOpen={setModalOpen}
                startDate={startDate}
              />
              <PushNotificationContent
                {...props}
                ref={content}
                endDate={endDate}
                flag={initialFlag}
                getList={getList}
                modalOpen={modalOpen}
                search={search}
                setModalOpen={setModalOpen}
                startDate={startDate}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

PushNotification.propTypes = {
  location: PropTypes.object
}

export default PushNotification
