import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Button } from 'reactstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import sortIcon from '../../../assets/images/sort-icon.svg'

import Loading from '../../../components/Loading'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import { modalMessageFunc } from '../../../helpers/helper'

const DroppedUserList = forwardRef((props, ref) => {
  const { List, resStatus, resMessage, getList, flag, startDate, endDate, filter } = props
  const location = useLocation()
  const exporter = useRef(null)
  const searchProp = props.search
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [total, setTotal] = useState(0)
  const [index, setIndex] = useState(1)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  // eslint-disable-next-line no-unused-vars
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [filterBy, setFilterBy] = useQueryState('filterBy', '')
  const [order, setOrder] = useQueryState('order', 'desc')
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [search, setSearch] = useQueryState('searchvalue', '')
  const [listLength, setListLength] = useState('10 Rows')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const obj = qs.parse(location.search)
  const previousProps = useRef({
    List,
    resStatus,
    resMessage,
    startDate,
    endDate,
    activePageNo,
    start,
    offset,
    filter
  }).current
  const paginationFlag = useRef(false)
  const navigate = useNavigate()

  // useEffect to set Query Param form url and also set Message from navigate
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
    const searchText = ''
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
      if (obj.searchvalue) {
        // searchText = obj.searchvalue
        setSearch(obj.searchvalue)
      }
      if (!(obj.datefrom && obj.dateto)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, sort, order, searchText, filterBy, startDate, endDate)
      }
    }
    setLoading(true)
  }, [])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, filterBy, startDate, endDate)
      setSearch(searchProp.trim())
      setStart(startFrom)
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

  // handle to set filter
  useEffect(() => {
    if (previousProps.filter !== filter) {
      if (filter === 'E' || filter === 'M' || filter === '') {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, props.search, props.filter, startDate, endDate)
        setFilterBy(props.filter)
        setStart(startFrom)
        setPageNo(1)
        setLoading(true)
      }
    }
    return () => {
      previousProps.filter = filter
    }
  }, [filter])

  // handle to set startDate and EndDate
  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        getList(startFrom, limit, sort, order, search, filterBy, props.startDate, props.endDate)
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
        getList(startFrom, limit, sort, order, search, filterBy, props.startDate, props.endDate)
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

  // handle to set user List
  useEffect(() => {
    if (previousProps.List?.result !== List?.result) {
      if (List && List.result) {
        const userArrLength = List.result?.data.length
        const startFrom = (activePageNo - 1) * offset + 1
        const end = startFrom - 1 + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
        setList(List.result?.data)
        setIndex(activePageNo)
        setTotal(List?.result?.nTotal)
        setLoading(false)
      }
    }

    return () => {
      previousProps.List = List
    }
  }, [List?.result])

  // handle to set resMessage
  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, sort, order, search, filterBy, startDate, endDate)
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

  // useEffect to handle QueryParams
  useEffect(() => {
    let data = localStorage.getItem('queryParams')
      ? JSON.parse(localStorage.getItem('queryParams'))
      : {}
    !Object.keys(data).length
      ? (data = {
          UserManagement: location.search
        })
      : (data.UserManagement = location.search)
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [location.search])

  // will be called when page changes occurred
  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current && start) {
      getList(start, offset, sort, order, search, filterBy, startDate, endDate)
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      getList(start, offset, sort, order, search, filterBy, startDate, endDate)
      setLoading(true)
    } else if (((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current)) {
      getList(0, offset, sort, order, search, filterBy, startDate, endDate)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  // function use for listing sorting
  function onSorting (sortingBy) {
    if (order === 'desc') {
      const start = 0
      const limit = offset
      getList(start, limit, sortingBy, 'asc', search, filterBy, startDate, endDate)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
    } else {
      const start = 0
      const limit = offset
      getList(start, limit, sortingBy, 'desc', search, filterBy, startDate, endDate)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
    }
  }

  // export list
  const processExcelExportData = (data) =>
    data.map((userList) => {
      const sType = userList.sType === 'M' ? 'Mobile No' : 'Email'
      const sEmail = userList?.sLogin || '-'
      let dCreatedAt = moment(userList.dCreatedAt).local().format('lll')
      dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt
      return {
        ...userList,
        dCreatedAt,
        sType,
        sEmail
      }
    })
  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = {
        ...exporter.current.props,
        data: processExcelExportData(list),
        fileName: 'DroppedUserList.xlsx'
      }
      exporter.current.save()
    }
  }

  function onRefresh () {
    getList(start, offset, sort, order, search, filterBy, startDate, endDate)
    setLoading(true)
    setPageNo(activePageNo)
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
      <ExcelExport ref={exporter} data={List?.result?.data} fileName='DroppedUserList.xlsx'>
        <ExcelExportColumn field='sEmail' title='Email' />
        <ExcelExportColumn field='sType' title='Type' />
        <ExcelExportColumn field='dCreatedAt' title='Registration Date' />

      </ExcelExport>
      {loading && <Loading />}
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="User List" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className='table-responsive'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Type</th>
                    <th>Email / Mobile No </th>
                    <th>
                      Registration Date
                      <Button
                        className='sort-btn'
                        color='link'
                        onClick={() => onSorting('dCreatedAt')}
                      >
                        <img alt='sorting' className='m-0 d-block' src={sortIcon} />
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={4} />
                    : (
                      <Fragment>
                        {
                    list && list?.length !== 0 && list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data?.sType === 'M' ? 'Mobile No' : 'Email ' || '--'}</td>
                        <td>{data?.sLogin || '--'}</td>
                        <td>{moment(data?.dCreatedAt).format('DD/MM/YYYY hh:mm A')}</td>
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

DroppedUserList.propTypes = {
  location: PropTypes.object,
  openPicker: PropTypes.bool,
  search: PropTypes.string,
  List: PropTypes.object,
  resStatus: PropTypes.bool,
  resMessage: PropTypes.string,
  getList: PropTypes.func,
  flag: PropTypes.bool,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  viewLink: PropTypes.string,
  searchBox: PropTypes.string,
  history: PropTypes.object,
  filter: PropTypes.string,
  getUsersTotalCountFunc: PropTypes.func,
  usersTotalCount: PropTypes.object,
  onRefresh: PropTypes.func,
  getDeletedUsers: PropTypes.func,
  setSearchProp: PropTypes.func,
  setFilter: PropTypes.func,
  setinitialFlag: PropTypes.func,
  setDateRange: PropTypes.func
}

DroppedUserList.displayName = DroppedUserList

export default DroppedUserList
