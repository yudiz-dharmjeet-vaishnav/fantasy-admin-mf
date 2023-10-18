import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useQueryState } from 'react-router-use-location-state'
import { Badge } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Loading from '../../../../components/Loading'
import SkeletonTable from '../../../../components/SkeletonTable'
import PaginationComponent from '../../../../components/PaginationComponent'
import GenerateReportIndex from './GenerateReport'
import AlertMessage from '../../../../components/AlertMessage'

import { modalMessageFunc } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'

const TransactionReport = forwardRef((props, ref) => {
  const { transactionReportList, getTransactionReportListFunc, startDate, endDate, generateReportModal, setGenerateReportModal } = props
  const dispatch = useDispatch('')
  const location = useLocation()
  const [start, setStart] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [sort] = useQueryState('sort', 'dCreatedAt')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [listLength, setListLength] = useState('10 Rows')
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [modalMessage, setModalMessage] = useState(false)
  const [url, setUrl] = useState('')
  const [index, setIndex] = useState(1)
  const [close, setClose] = useState(false)
  const paginationFlag = useRef(false)
  const resStatus = useSelector(state => state.passbook.resStatus)
  const resMessage = useSelector(state => state.passbook.resMessage)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const previousProps = useRef({ transactionReportList, start, offset, startDate, endDate }).current
  const obj = qs.parse(location.search)

  useEffect(() => {
    let page = 1
    let limit = offset
    if (obj) {
      if (obj.page) {
        page = obj.page
        setPageNo(page)
      }
      if (obj.pageSize) {
        limit = obj.pageSize
        setOffset(limit)
        setListLength(`${limit} entries`)
      }
      if (!(obj.datefrom && obj.dateto)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getTransactionReportListFunc(startFrom, limit, sort, dateFrom, dateTo)
      }
    }
    dispatch(getUrl('media'))
    setLoader(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  // useEffect to set transactionReportList
  useEffect(() => {
    if (previousProps.transactionReportList !== transactionReportList) {
      if (transactionReportList) {
        const userArrLength = transactionReportList.aData ? transactionReportList.aData.length : transactionReportList?.aData?.length
        const startFrom = ((activePageNo - 1) * offset) + 1
        const end = (startFrom - 1) + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
        setList(transactionReportList?.aData)
        setTotal(transactionReportList?.nTotal)
        setIndex(activePageNo)
        setLoading(false)
      }
      setLoader(false)
    }
  }, [transactionReportList])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          setGenerateReportModal(false)
          getTransactionReportListFunc(startFrom, limit, sort, startDate, endDate)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(1)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
      previousProps.resStatus = resStatus
    }
  }, [resStatus, resMessage])

  // use effect to startDate and EndDate Change
  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        getTransactionReportListFunc(startFrom, limit, sort, props.startDate, props.endDate)
        setDateFrom(moment(props.startDate).format('MM-DD-YYYY'))
        setDateTo(moment(props.endDate).format('MM-DD-YYYY'))
        if ((obj && obj.datefrom && obj.dateto && obj.page)) {
          setPageNo(obj.page)
        } else {
          setPageNo(1)
        }
        setLoading(true)
      } else if ((!props.startDate) && (!props.endDate)) {
        const startFrom = 0
        const limit = offset
        getTransactionReportListFunc(startFrom, limit, sort, props.startDate, props.endDate)
        setDateFrom('')
        setDateTo('')
        setPageNo(1)
        setLoading(true)
      }
    }
    return () => {
      previousProps.startDate = startDate
      previousProps.endDate = endDate
    }
  }, [startDate, endDate])

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      // dispatch action to get TransactionReportList
      getTransactionReportListFunc(start, offset, sort, dateFrom, dateTo)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  // Refresh Function
  function onRefresh () {
    getTransactionReportListFunc(start, offset, sort, dateFrom, dateTo)
    setLoading(true)
    setPageNo(1)
  }

  return (
    <Fragment>
      {
        modalMessage && message && (
        <AlertMessage
          close={close}
          message={message}
          modalMessage={modalMessage}
          status={status}
        />
        )}
      {generateReportModal && <GenerateReportIndex {...props} />}
      {loader && <Loading />}
      <div className='table-represent'>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Date Range</th>
                <th>Report Status</th>
                <th>Admin</th>
                <th>Match</th>
                <th>Match League</th>
                <th>No of rows in a report</th>
                <th>Filters</th>
                <th>Report Generation Date</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? <SkeletonTable numberOfColumns={10} />
                : (
                  <Fragment>
                    {
                      list?.length > 0 && list.map((data, i) => (
                        <tr key={i}>
                          <td>{(((index - 1) * offset) + (i + 1))}</td>
                          <td>{data.dDateFrom && data.dDateTo ? moment(data?.dDateFrom).format('DD/MM/YYYY hh:mm A') + ' to ' + moment(data?.dDateTo).format('DD/MM/YYYY hh:mm A') : '--'}</td>
                          <td>{data?.eStatus === 'P' ? 'Generating' : data?.eStatus === 'S' ? 'Success' : '-'}</td>
                          <td>{data?.iAdminId?.sUsername || '--'}</td>
                          <td>{data?.iMatchId?.sName || '--'}</td>
                          <td>{data?.iMatchLeagueId?.sName || '--'}</td>
                          <td>{data?.nTotal || 0}</td>
                          <td>
                            <div>{data?.oFilter?.eStatus === 'CMP' ? 'Completed' : data?.oFilter?.eStatus === 'R' ? 'Refunded' : data?.oFilter?.eStatus === 'CNCL' ? 'Cancelled' : ''}</div>
                            <div>{data?.oFilter?.eType === 'Cr' ? 'Credited' : data?.oFilter?.eType === 'Dr' ? 'Debited' : ''}</div>
                            <div>{data?.oFilter?.eTransactionType || ''}</div>
                            <div>{(data?.oFilter?.eStatus || data?.oFilter?.eType || data?.oFilter?.eTransactionType) ? '' : '--'}</div>
                          </td>
                          <td>{moment(data?.dCreatedAt).format('DD/MM/YYYY hh:mm A')}</td>
                          <td onClick={() => {
                            if (data?.sReportUrl) {
                              window.open(`${url}${data?.sReportUrl}`)
                            } else {
                              setMessage('Report not available')
                            }
                          }}
                          >
                            <Badge className='p-2' color={data?.eStatus === 'P' ? 'secondary' : 'primary'} role='button'>Download</Badge>

                          </td>
                        </tr>
                      ))
                    }
                  </Fragment>
                  )
              }
            </tbody>
          </table>
        </div>
      </div>
      {
        !loading && list.length === 0 &&
        (
          <div className="text-center">
            <h3>Reports not available</h3>
          </div>
        )
      }

      <PaginationComponent
        activePageNo={activePageNo}
        endingNo={endingNo}
        listLength={listLength}
        offset={offset}
        paginationFlag={paginationFlag}
        setListLength={setListLength}
        setLoading={setLoading}
        setOffset={setOffset}
        setPageNo={setPageNo}
        setStart={setStart}
        startingNo={startingNo}
        total={total}
      />
    </Fragment>
  )
})

TransactionReport.propTypes = {
  transactionReportList: PropTypes.array,
  getTransactionReportListFunc: PropTypes.func,
  location: PropTypes.object,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  generateReportModal: PropTypes.bool,
  setGenerateReportModal: PropTypes.func
}

TransactionReport.displayName = TransactionReport

export default TransactionReport
