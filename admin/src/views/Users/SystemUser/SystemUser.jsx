import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { Button } from 'reactstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import sortIcon from '../../../assets/images/sort-icon.svg'
import editButton from '../../../assets/images/edit-pen-icon.svg'
import debugButton from '../../../assets/images/carbon-debug.svg'
import verify from '../../../assets/images/verify.svg'

import Loading from '../../../components/Loading'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import { modalMessageFunc } from '../../../helpers/helper'

const SystemUser = forwardRef((props, ref) => {
  const exporter = useRef(null)
  const {
    List, resStatus, resMessage, getList, flag, startDate, endDate, filter, getSystemUsersTotalCountFunc, systemUsersTotalCount
  } = props
  const navigate = useNavigate()
  const location = useLocation()
  const searchProp = props.search
  const [isFullResponse] = useState(false)
  const [fullList, setFullList] = useState([])
  const [start, setStart] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [total, setTotal] = useState(0)
  const [index, setIndex] = useState(1)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [nameOrder, setNameOrder] = useState('asc')
  const [createdOrder, setCreatedOrder] = useState('asc')
  // eslint-disable-next-line no-unused-vars
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  // eslint-disable-next-line no-unused-vars
  const [filterBy, setFilterBy] = useQueryState('filterBy', '')
  const [order, setOrder] = useQueryState('order', 'desc')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  const [search, setSearch] = useQueryState('searchvalue', '')
  const [listLength, setListLength] = useState('10 Rows')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const isFullList = useSelector(state => state.systemusers.isFullResponse)
  const obj = qs.parse(location.search)

  const previousProps = useRef({
    List, resStatus, resMessage, startDate, endDate, start, offset, filter, systemUsersTotalCount
  }).current
  const paginationFlag = useRef(false)

  // useEffect call initial api
  useEffect(() => {
    if (location.state) {
      if (location.state.message) {
        setMessage(location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      navigate(location.pathname, { replace: true })
    }
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
        setListLength(`${limit} Rows`)
      }
      if ((!obj.search) && (!obj.datefrom) && (!obj.filterBy)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, sort, order, search, filterBy, startDate, endDate, isFullResponse)
        getSystemUsersTotalCountFunc(search, filterBy, startDate, endDate)
      }
    }
    setLoading(true)
  }, [])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, filterBy, startDate, endDate, isFullResponse)
      getSystemUsersTotalCountFunc(props.search, filterBy, startDate, endDate)
      setStart(startFrom)
      setSearch(searchProp.trim())
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.searchProp !== searchProp && flag) {
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

  // use effect to set filter
  useEffect(() => {
    if (previousProps.filter !== filter) {
      if (filter === 'EMAIL_VERIFIED' || filter === 'MOBILE_VERIFIED' || filter === 'INTERNAL_ACCOUNT' || filter === '') {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, props.search, filter, startDate, endDate, isFullResponse)
        getSystemUsersTotalCountFunc(search, filter, startDate, endDate)
        setSearch(searchProp.trim())
        setStart(startFrom)
        setPageNo(1)
        setLoading(true)
      }
      setFilterBy(filter)
    }
    return () => {
      previousProps.filter = filter
    }
  }, [filter])

  // use effect to startDate and EndDate Change
  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        getList(startFrom, limit, sort, order, search, filterBy, props.startDate, props.endDate, isFullResponse)
        getSystemUsersTotalCountFunc(search, filterBy, props.startDate, props.endDate)
        setDateFrom(moment(props.startDate).format('MM-DD-YYYY'))
        setDateTo(moment(props.endDate).format('MM-DD-YYYY'))
        if ((obj && obj.datefrom && obj.dateto && obj.page)) {
          setPageNo(obj.page)
        } else {
          setPageNo(1)
        }
        setLoading(true)
      } else if ((!props.startDate) && (!props.endDate)) {
        const start = 0
        const limit = offset
        getList(start, limit, sort, order, search, filterBy, props.startDate, props.endDate, isFullResponse)
        getSystemUsersTotalCountFunc(search, filterBy, props.startDate, props.endDate)
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

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // use effect to set List Data
  useEffect(() => {
    if (previousProps.List !== List) {
      if (List && List.results && !isFullList) {
        const userArrLength = List.results.length
        const start = ((activePageNo - 1) * offset) + 1
        const end = (start - 1) + userArrLength
        setStartingNo(start)
        setEndingNo(end)
        setList(List.results ? List.results : [])
        setIndex(activePageNo)
        setLoading(false)
      } else if (systemUsersTotalCount?.count === List?.results?.length && isFullList) {
        setFullList(List.results ? List.results : [])
        setLoading(false)
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(List.results ? List.results : []),
          fileName: 'SystemUsers.xlsx'
        }
        exporter.current.save()
        setLoader(false)
      }
    }
    if (previousProps.systemUsersTotalCount !== systemUsersTotalCount && systemUsersTotalCount) {
      setTotal(systemUsersTotalCount?.count ? systemUsersTotalCount?.count : 0)
    }
    return () => {
      previousProps.List = List
      previousProps.systemUsersTotalCount = systemUsersTotalCount
    }
  }, [List, systemUsersTotalCount])

  // use effect set resMessage
  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const start = 0
          const limit = offset
          getList(start, limit, sort, order, search, filterBy, startDate, endDate, isFullResponse)
          getSystemUsersTotalCountFunc(search, filterBy, startDate, endDate)
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

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    !Object.keys(data).length
      ? data = {
        SystemUser: location.search
      }
      : data.SystemUser = location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [location.search])

  // will be called when page changes occurred
  useEffect(() => {
    if (((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) && start) {
      getList(start, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      getList(start, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
      getSystemUsersTotalCountFunc(search, filterBy, startDate, endDate)
      setLoading(true)
    } else if (((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current)) {
      getList(0, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
      setLoading(true)
    }
    getSystemUsersTotalCountFunc(search, filterBy, startDate, endDate)
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  // sorting function on nameOrder and createdOrder
  function onSorting (sortingBy) {
    const Order = sortingBy === 'dStartTime' ? nameOrder : createdOrder
    if (Order === 'asc') {
      const start = 0
      const limit = offset

      getList(start, limit, sortingBy, 'desc', search, filterBy, startDate, endDate, isFullResponse)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'dStartTime') {
        setNameOrder('desc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('desc')
        setSort(sortingBy)
      }
    } else {
      const start = 0
      const limit = offset
      getList(start, limit, sortingBy, 'asc', search, filterBy, startDate, endDate, isFullResponse)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'dStartTime') {
        setNameOrder('asc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('asc')
        setSort(sortingBy)
      }
    }
  }

  function onRefresh () {
    // const start = 0
    // const limit = offset
    getList(start, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
    getSystemUsersTotalCountFunc(search, filterBy, startDate, endDate)
    setPageNo(activePageNo)
    setLoading(true)
  }

  const processExcelExportData = data => data.map((userList) => {
    let dCreatedAt = moment(userList.dCreatedAt).local().format('lll')
    dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt

    return {
      ...userList,
      dCreatedAt
    }
  })

  async function onExport () {
    if (startDate && endDate) {
      await getList(start, offset, sort, order, search, filterBy, startDate, endDate, true)
      await getSystemUsersTotalCountFunc(search, filterBy, startDate, endDate)
      setLoader(true)
    } else {
      setMessage('Please Select Date Range')
      setModalMessage(true)
      setStatus(false)
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

      <ExcelExport
        ref={exporter}
        data={fullList && fullList.length > 0 ? fullList : list}
        fileName="SystemUsers.xlsx"
      >
        <ExcelExportColumn field="sName" title="Name" />
        <ExcelExportColumn field="sUsername" title="Team Name" />
        <ExcelExportColumn field="sEmail" title="Email" />
        <ExcelExportColumn field="sMobNum" title="Mobile No." />
        <ExcelExportColumn field="dCreatedAt" title="Registration Date" />
      </ExcelExport>
      {loader && <Loading />}

      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="System-User List" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Team Name</th>
                    <th>Email</th>
                    <th>Mobile No.</th>
                    <th>
                      Registration Date
                      <Button className="sort-btn" color="link" onClick={() => onSorting('dStartDate')}><img alt="sorting" className="m-0 d-block" src={sortIcon} /></Button>
                    </th>
                    <th>Actions</th>
                    <th>User Debugger</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={7} />
                    : (
                      <Fragment>
                        {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data && data.sUsername}</td>
                        <td>
                          {(data && data.sEmail) || '--'}
                          {data && data.bIsEmailVerified ? <img className='mx-2' src={verify} /> : ''}
                        </td>
                        <td>
                          {data && data.sMobNum}
                          {data && data.bIsMobVerified ? <img className="mx-2" src={verify} /> : ''}
                        </td>
                        <td>{moment(data.dCreatedAt).format('DD/MM/YYYY hh:mm A')}</td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Button className="view" color="link" onClick={() => navigate(`${props.viewLink}/${data._id}`, { systemUserList: true })}>
                                <Button className='edit-btn-icon'>
                                  <img alt="View" src={editButton} />
                                </Button>
                              </Button>
                            </li>
                          </ul>
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Link className="view" color="link" to={`/users/system-user/system-user-debugger-page/${data._id}`}>
                                <Button className='debug-btn-icon'>
                                  <img alt="debug" src={debugButton} />
                                </Button>
                              </Link>
                            </li>
                          </ul>
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
          )}

      {list?.length !== 0 && (
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

SystemUser.propTypes = {
  location: PropTypes.object,
  openPicker: PropTypes.bool,
  search: PropTypes.string,
  List: PropTypes.object,
  getList: PropTypes.func,
  resStatus: PropTypes.bool,
  resMessage: PropTypes.string,
  flag: PropTypes.bool,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  filter: PropTypes.string,
  viewLink: PropTypes.string,
  history: PropTypes.object,
  getSystemUsersTotalCountFunc: PropTypes.func,
  systemUsersTotalCount: PropTypes.object
}

SystemUser.displayName = SystemUser

export default SystemUser
