import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import { Button, Badge } from 'reactstrap'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import editButton from '../../../assets/images/edit-pen-icon.svg'
import noImage from '../../../assets/images/no-image-1.svg'
import sortIcon from '../../../assets/images/sort-icon.svg'

import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import { modalMessageFunc } from '../../../helpers/helper'
import { getUrl } from '../../../actions/url'

const FeedbackList = forwardRef((props, ref) => {
  const exporter = useRef(null)
  const { getList, feedbackList, startDate, endDate, recommendedList, dateFlag, type, complainStatus } = props
  const navigate = useNavigate()
  const location = useLocation()
  const [start, setStart] = useState(0)
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [nameOrder, setNameOrder] = useState('desc')
  const [createdOrder, setCreatedOrder] = useState('desc')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 Rows')
  const [url, setUrl] = useState('')
  const [close, setClose] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const isSendId = useSelector(state => state?.users?.isSendId)
  const dispatch = useDispatch()
  const getUrlLink = useSelector(state => state?.url?.getUrl)
  const resMessage = useSelector(state => state?.feedback?.resMessage)
  const resStatus = useSelector(state => state?.feedback?.resStatus)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const searchProp = props.search

  const obj = qs?.parse(location?.search)
  const previousProps = useRef({ start, offset, feedbackList, searchProp, resMessage, resStatus, type, complainStatus, startDate, endDate })?.current
  const paginationFlag = useRef(false)

  useEffect(() => {
    if (location?.state) {
      if (location?.state?.message) {
        setMessage(location?.state?.message)
        setStatus(true)
        setModalMessage(true)
      }
      navigate(location?.pathname, { replace: true })
    }
    let page = 1
    let limit = offset
    let orderBy = 'desc'
    if (obj) {
      if (obj?.page) {
        page = obj?.page
        setPageNo(page)
      }
      if (obj?.pageSize) {
        limit = obj?.pageSize
        setOffset(limit)
        setListLength(`${limit} Rows`)
      }
      if (obj?.order) {
        orderBy = obj?.order
        setOrder(orderBy)
      }
      if (!obj?.search) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, sort, orderBy, searchProp, type, complainStatus, obj?.datefrom ? new Date(obj?.datefrom) : dateFrom, obj?.dateto ? new Date(obj?.dateto) : dateTo)
      }
    }
    dispatch(getUrl('media'))
    setLoading(true)
  }, [])

  // to set recommendedList
  useEffect(() => {
    if (isSendId && recommendedList && recommendedList?.length > 0 && searchProp) {
      getList(start, offset, sort, order, searchProp, type, complainStatus, dateFrom, dateTo)
      setLoading(true)
    }
  }, [isSendId, searchProp])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  // to set feedbackList
  useEffect(() => {
    if (previousProps?.feedbackList !== feedbackList) {
      if (feedbackList) {
        if (feedbackList?.aData) {
          const userArrLength = feedbackList?.aData?.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(feedbackList?.aData ? feedbackList?.aData : [])
        setIndex(activePageNo)
        setTotal(feedbackList?.nTotal ? feedbackList?.nTotal : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.feedbackList = feedbackList
    }
  }, [feedbackList])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, sort, order, searchProp, type, complainStatus, dateFrom, dateTo)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(1)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setLoading(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // to handle query params
  useEffect(() => {
    let data = localStorage?.getItem('queryParams') ? JSON?.parse(localStorage?.getItem('queryParams')) : {}
    !Object.keys(data)?.length
      ? data = {
        FeedbackManagement: location?.search
      }
      : data.FeedbackManagement = location?.search
    localStorage?.setItem('queryParams', JSON?.stringify(data))
  }, [location?.search])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props?.search, type, complainStatus, dateFrom, dateTo)
      setStart(startFrom)
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps?.searchProp !== searchProp && props?.flag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.searchProp = searchProp
      }
    }
    return () => {
      previousProps.searchProp = searchProp
    }
  }, [searchProp])

  // will be called when startdate and endDate change
  useEffect(() => {
    if (previousProps?.startDate !== startDate || previousProps?.endDate !== endDate) {
      if (props?.startDate && props?.endDate && dateFlag?.current) {
        const startFrom = (obj && obj?.datefrom && obj?.dateto && obj?.page) ? (obj?.page - 1) * offset : 0
        const limit = offset
        getList(startFrom, limit, sort, order, searchProp, type, complainStatus, props?.startDate, props?.endDate)
        setDateFrom(moment(props?.startDate)?.format('MM-DD-YYYY'))
        setDateTo(moment(props?.endDate)?.format('MM-DD-YYYY'))
        if ((obj && obj?.datefrom && obj?.dateto && obj.page)) {
          setPageNo(obj?.page)
        } else {
          setPageNo(1)
        }
        setLoading(true)
      } else if ((!props?.startDate) && (!props?.endDate)) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, searchProp, type, complainStatus, props?.startDate, props?.endDate)
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

  // set type and complaint status
  useEffect(() => {
    if (previousProps?.type !== type || previousProps.complainStatus !== complainStatus) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, searchProp, type, complainStatus, props?.startDate, props?.endDate)
      setLoading(true)
      setPageNo(1)
    }

    return () => {
      previousProps.type = type
      previousProps.complainStatus = complainStatus
    }
  }, [type, complainStatus])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if ((previousProps?.start !== start || previousProps?.offset !== offset) && paginationFlag?.current) {
      getList(start, offset, sort, order, searchProp, type, complainStatus, dateFrom, dateTo)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  // for sort name and create order to ascending/decending
  function onSorting (sortingBy) {
    const Order = sortingBy === 'dCreatedAt' ? nameOrder : createdOrder
    if (Order === 'asc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', searchProp, type, complainStatus, dateFrom, dateTo)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'dCreatedAt') {
        setNameOrder('desc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('desc')
        setSort(sortingBy)
      }
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', searchProp, type, complainStatus, dateFrom, dateTo)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'dCreatedAt') {
        setNameOrder('asc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('asc')
        setSort(sortingBy)
      }
    }
  }
  // Export Excel Report List
  const processExcelExportData = data => data?.map((listOfFeedbacks) => {
    const eStatus = listOfFeedbacks?.eStatus === 'P' ? 'Pending' : listOfFeedbacks.eStatus === 'R' ? 'Resolved' : listOfFeedbacks?.eStatus === 'I' ? 'In-Progress' : listOfFeedbacks?.eStatus === 'D' ? 'Declined' : '--'
    const sUsername = listOfFeedbacks?.iUserIds?.sUsername || '--'
    const eType = listOfFeedbacks?.eType === 'F' ? 'Feedback' : listOfFeedbacks?.eType === 'C' ? 'Complaint' : '--'
    let dCreatedAt = moment(listOfFeedbacks?.dCreatedAt)?.local()?.format('lll')
    dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt
    const sComment = listOfFeedbacks?.sComment ? listOfFeedbacks?.sComment : '--'

    return {
      ...listOfFeedbacks,
      eStatus,
      sUsername,
      eType,
      dCreatedAt,
      sComment
    }
  })

  function onRefresh () {
    // const startFrom = 0
    getList(start, offset, sort, order, searchProp, type, complainStatus, dateFrom, dateTo)
    setLoading(true)
    setPageNo(activePageNo)
  }

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(list), fileName: 'Feedback.xlsx' }
      exporter?.current?.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport,
    onRefresh
  }))

  return (
    <Fragment>
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      <ExcelExport ref={exporter} data={list} fileName="Feedback.xlsx">
        <ExcelExportColumn field="eStatus" title="Status" />
        <ExcelExportColumn field="sUsername" title="Username" />
        <ExcelExportColumn field="eType" title="Type" />
        <ExcelExportColumn field="sTitle" title="Title" />
        <ExcelExportColumn field="dCreatedAt" title="Time" />
        <ExcelExportColumn field="sDescription" title="Description" />
        <ExcelExportColumn field="sComment" title="Comment" />
      </ExcelExport>
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="Feedback/Complaint List" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Status</th>
                    <th>Image</th>
                    <th>Username</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th className='table_sortIcon'>
                      <ul>
                        <li>
                          Date
                          <Button className="sort-btn" color="link" onClick={() => onSorting('dCreatedAt')}><img alt="sorting" className="m-0 d-block" src={sortIcon} /></Button>
                        </li>
                      </ul>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={8} />
                    : (
                      <Fragment>
                        {
                    list && list?.length !== 0 && list?.map((data, i) => (
                      <tr key={data?._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>
                          {data?.eStatus === 'P'
                            ? (<Badge className='match-status-p '>Pending</Badge>)
                            : ('')
                          }
                          {data?.eStatus === 'R'
                            ? (<Badge className='match-status-cmp '>Resolved</Badge>)
                            : ('')
                          }
                          {data?.eStatus === 'I'
                            ? (<Badge className='match-status-r'>In-Progress</Badge>)
                            : ('')
                          }
                          {data?.eStatus === 'D'
                            ? (<Badge className='match-status-cancl '>Declined</Badge>)
                            : ('')
                          }
                        </td>
                        <td>
                          {data?.sImage
                            ? <img alt="No Image" className="table-image" src={url + data?.sImage} />
                            : <img alt="No Image" className='l-cat-img' src={noImage}/>}
                        </td>
                        <td>
                          {(adminPermission?.USERS !== 'N') && data?.iUserId?._id
                            ? (
                              <Button className="view" color="link" tag={Link} to={'/users/user-management/user-details/' + data?.iUserId?._id }>
                                {data?.iUserIds?.sUsername || '-'}
                              </Button>
                              )
                            : data?.iUserIds?.sUsername || '--'}
                        </td>
                        <td>{data?.eType === 'F' ? 'Feedback' : data?.eType === 'C' ? 'Complaint' : ''}</td>
                        <td>{data?.sTitle ? data?.sTitle : '--'}</td>
                        <td>{data?.dCreatedAt ? moment(data?.dCreatedAt)?.format('DD/MM/YYYY hh:mm A') : '--'}</td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink className="view" color="link" to={'/settings/update-complaint-status/' + data?._id }>
                                <Button className='edit-btn-icon'>
                                  <img alt="View" src={editButton} />
                                </Button>
                              </NavLink>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))
                  }
                      </Fragment>
                      )}
                </tbody>
              </table>
            </div>
          </div>
          )}
      {
      list?.length !== 0 && (
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
      )}
    </Fragment>
  )
})

FeedbackList.propTypes = {
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  flag: PropTypes.bool,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  openDatePicker: PropTypes.bool,
  getList: PropTypes.func,
  feedbackList: PropTypes.object,
  recommendedList: PropTypes.array,
  dateFlag: PropTypes.bool,
  complainStatus: PropTypes.string,
  type: PropTypes.string
}

FeedbackList.displayName = FeedbackList

export default FeedbackList
