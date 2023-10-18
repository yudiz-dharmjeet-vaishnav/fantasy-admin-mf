import React, { Fragment, useRef, useState } from 'react'
import { useQueryState } from 'react-router-use-location-state'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import MatchApiLogsList from './MatchApiLogs'
import Layout from '../../../components/Layout'
import SubAdminHeader from '../components/SubAdminHeader'
import SubAdminMainHeader from '../components/SubAdminMainHeader'

import { getMatchAPILogs } from '../../../actions/subadmin'

const MatchApiLogs = props => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const content = useRef()
  const [dateRange, setDateRange] = useState([null, null])
  const [filter, setFilter] = useQueryState('eType', '')
  const [startDate, endDate] = dateRange

  const token = useSelector(state => state?.auth?.token)
  const matchApiLogsList = useSelector(state => state?.subadmin?.matchAPILogs)
  const dateFlag = useRef(false)

  function getList (start, limit, order, filter) {
    dispatch(getMatchAPILogs(id, start, limit, order, filter, token))
  }

  function onRefreshFun () {
    content?.current?.onRefresh()
  }

  function onFilter (e) {
    setFilter(e?.target?.value)
  }
  return (
    <Fragment>
      <Layout {...props} >

        <main className="main-content">
          <section className="management-section common-box">
            <SubAdminMainHeader
              MatchAPILog
              header="Match API Logs"
              onRefresh={onRefreshFun}
              refresh="Refresh"

            />
            <SubAdminHeader
              {...props}
              List={matchApiLogsList}
              dateFlag={dateFlag}
              dateRange={dateRange}
              endDate={endDate}
              filter={filter}
              header
              isMatchLog={id}
              matchApiLogs
              onFilter={onFilter}
              setDateRange={setDateRange}
              startDate={startDate}
            />
            <MatchApiLogsList
              {...props}
              ref={content}
              List={matchApiLogsList}
              dateFlag={dateFlag}
              endDate={endDate}
              filter={filter}
              getList={getList}
              startDate={startDate}
            />
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

MatchApiLogs.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default MatchApiLogs
