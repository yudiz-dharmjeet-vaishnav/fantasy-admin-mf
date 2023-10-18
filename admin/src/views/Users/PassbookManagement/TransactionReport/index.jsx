import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import TransactionReport from './TransactionReport'
import UserListHeader from '../../Component/UsersListHeader'
import Layout from '../../../../components/Layout'
import UsersListMainHeader from '../../Component/UsersListMainHeader'

import { getTransactionReportList } from '../../../../actions/passbook'

function TransactionReportIndex (props) {
  const location = useLocation()
  // const { location } = props
  const dispatch = useDispatch()
  const [generateReportModal, setGenerateReportModal] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const token = useSelector(state => state.auth.token)
  const transactionReportList = useSelector(state => state.passbook.transactionReportList)

  const content = useRef()

  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
  }, [])

  // dispatch action get Transaction Report List
  function getTransactionReportListFunc (start, limit, sort, dateFrom, dateTo) {
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const data = {
      start, limit, sort, startDate: StartDate ? new Date(StartDate).toISOString() : '', endDate: EndDate ? new Date(EndDate).toISOString() : '', token
    }
    dispatch(getTransactionReportList(data))
  }

  // Refresh Function
  function onRefresh () {
    content.current.onRefresh()
  }

  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <UsersListMainHeader
              {...props}
              heading="Transactions Report"
              isTransactionReport
              onRefresh={onRefresh}
              passbook
              refresh = 'Refresh Transaction Reports'
            />
            <div className={transactionReportList?.rows?.length !== 0 ? 'trans-component' : 'setting-component'}>
              <UserListHeader
                {...props}
                dateRange={dateRange}
                endDate={endDate}
                generateTransactionReport
                heading="Transaction Report"
                hidden
                setDateRange={setDateRange}
                setGenerateReportModal={setGenerateReportModal}
                startDate={startDate}
              />
              <TransactionReport
                {...props}
                ref={content}
                endDate={endDate}
                generateReportModal={generateReportModal}
                getTransactionReportListFunc={getTransactionReportListFunc}
                setGenerateReportModal={setGenerateReportModal}
                startDate={startDate}
                token={token}
                transactionReportList={transactionReportList}
              />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

TransactionReportIndex.propTypes = {
  location: PropTypes.object
}

export default TransactionReportIndex
