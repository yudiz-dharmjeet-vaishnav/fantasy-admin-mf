import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import Heading from '../component/Heading'
import MainHeading from '../component/MainHeading'
import NotificationManagement from './NotificationContent'
import { notificationsList } from '../../../actions/notification'

function NotificationManage (props) {
  const dispatch = useDispatch()
  const location = useLocation()
  const [modalOpen, setModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setInitialFlag] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [notificationType, setNotificationType] = useQueryState('notificationtype', '')
  const [startDate, endDate] = dateRange
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const typesList = useSelector(state => state?.notification?.typeList)
  const notificationList = useSelector(state => state?.notificationsList)

  useEffect(() => {
    const obj = qs?.parse(location?.search)
    if (obj?.search) {
      setSearchText(obj?.search)
    }
    if (obj?.datefrom && obj?.dateto) {
      setDateRange([new Date(obj?.datefrom), new Date(obj?.dateto)])
    }
  }, [])

  function getList (start, limit, sort, order, search, notificationType, StartDate, EndDate, token) {
    const dateFrom = StartDate ? new Date(moment(StartDate)?.startOf('day')?.format()) : ''
    const dateTo = EndDate ? new Date(moment(EndDate)?.endOf('day')?.format()) : ''
    const data = {
      start, limit, sort, order, search: search?.trim(), notificationType, dateFrom: dateFrom ? new Date(dateFrom)?.toISOString() : '', dateTo: dateTo ? new Date(dateTo)?.toISOString() : '', token
    }
    dispatch(notificationsList(data))
  }

  function onHandleSearch (e) {
    setSearchText(e?.target?.value)
    setInitialFlag(true)
  }

  function onFiltering (event) {
    setNotificationType(event?.target?.value)
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainHeading
              heading="Notifications"
            />
            <div className={notificationList?.total === 0 ? 'without-pagination' : 'setting-component'}>
              <Heading
                dateRange={dateRange}
                endDate={endDate}
                handleSearch={onHandleSearch}
                modalOpen={modalOpen}
                notification="Send Notification"
                notificationFilter
                notificationType={notificationType}
                onFiltering={onFiltering}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.NOTIFICATION !== 'R')}
                search={searchText}
                setDateRange={setDateRange}
                setModalOpen={setModalOpen}
                startDate={startDate}
                typesList={typesList}
              />
              <NotificationManagement
                {...props}
                endDate={endDate}
                flag={initialFlag}
                getList={getList}
                modalOpen={modalOpen}
                notificationType={notificationType}
                search={searchText}
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

NotificationManage.propTypes = {
  location: PropTypes.object
}

export default NotificationManage
