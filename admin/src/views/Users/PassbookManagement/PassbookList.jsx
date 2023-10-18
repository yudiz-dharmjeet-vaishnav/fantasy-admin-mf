import React, { Fragment, useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { useSelector } from 'react-redux'
import { Badge, Button } from 'reactstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import moment from 'moment'
import PropTypes from 'prop-types'

import sortIcon from '../../../assets/images/sort-icon.svg'

import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import Loading from '../../../components/Loading'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import { modalMessageFunc } from '../../../helpers/helper'

const PassbookList = forwardRef((props, ref) => {
  const exporter = useRef(null)
  const {
    getList,
    List,
    startDate,
    endDate,
    flag,
    getTransactionsTotalCountFunc,
    searchType,
    isLeaguePassbook,
    leaguePassbookList,
    leagueTransactionsTotalCountFunc,
    userType
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
  const [particulars] = useQueryState('particulars', '')
  const [eType] = useQueryState('etype', '')
  const [searchTypeBy, setSearchTypeBy] = useQueryState('searchType', '')
  const [transactionStatus] = useQueryState('transactionStatus', '')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [nameOrder, setNameOrder] = useState('asc')
  const [createdOrder, setCreatedOrder] = useState('asc')
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  // eslint-disable-next-line no-unused-vars
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [sort, setSort] = useQueryState('sortBy', 'id')
  const [search, setSearch] = useQueryState('searchValue', '')
  const [listLength, setListLength] = useState('10 Rows')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)

  const adminPermission = useSelector(state => state.auth.adminPermission)
  const transactionsTotalCount = useSelector(state => state.passbook.transactionsTotalCount)
  const isFullList = useSelector(state => state.passbook.isFullResponse)
  const resStatus = useSelector(state => state.passbook.resStatus)
  const resMessage = useSelector(state => state.passbook.resMessage)
  const obj = qs.parse(location.search)
  const previousProps = useRef({
    resStatus, resMessage, List, startDate, endDate, particulars, eType, start, offset, transactionsTotalCount, transactionStatus, searchType, searchProp
  }).current
  const paginationFlag = useRef(false)

  // handle call when initial query params change
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
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    if (props?.location?.state?.passbookId) {
      setSearch(location.state.passbookId)
    }
    if (props?.location?.state?.systemUserToPassbook) {
      setSearch(location.state.id)
    }
    if (location.state && location.state.userId) {
      setSearch(location.state.userId)
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sort, order, location.state.userId, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        leagueTransactionsTotalCountFunc(location.state.userId, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      } else {
        getList(startFrom, limit, sort, order, userType, location.state.userId, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        getTransactionsTotalCountFunc(location.state.userId, userType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      }
    } else if (!(obj.datefrom && obj.dateto)) {
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        leagueTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      } else {
        getList(startFrom, limit, sort, order, userType, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        getTransactionsTotalCountFunc(search, searchTypeBy, userType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      }
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    if (props.isUserToPassbook) {
      setSearch(props.userToPassbookId)
    }
  }, [props.userToPassbookId])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sort, order, props.search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        leagueTransactionsTotalCountFunc(props.search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      } else {
        getList(startFrom, limit, sort, order, userType, props.search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        getTransactionsTotalCountFunc(props.search, searchTypeBy, userType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      }
      setSearch(searchProp.trim())
      setStart(startFrom)
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.searchProp !== searchProp && flag) {
      if (!props?.isTdsToPassbook) {
        const debouncer = setTimeout(() => {
          callSearchService()
        }, 1000)
        return () => {
          clearTimeout(debouncer)
          previousProps.searchProp = searchProp
        }
      }
    }
    return () => {
      previousProps.searchProp = searchProp
    }
  }, [searchProp])

  // handle to set SearchType
  useEffect(() => {
    if (previousProps.searchType !== searchType) {
      if (searchType === 'NAME' || searchType === 'USERNAME' || searchType === 'MOBILE' || searchType === 'PASSBOOK' || searchType === '') {
        if (!props?.isTdsToPassbook) {
          const startFrom = 0
          const limit = offset
          if (isLeaguePassbook) {
            leaguePassbookList(startFrom, limit, sort, order, search, props.searchType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
            leagueTransactionsTotalCountFunc(search, props.searchType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
          } else {
            getList(startFrom, limit, sort, order, userType, search, props.searchType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
            getTransactionsTotalCountFunc(search, props.searchType, userType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
          }
          setPageNo(1)
          setStart(startFrom)
          setLoading(true)
        }
        setSearchTypeBy(props.searchType)
      }
    }
    return () => {
      previousProps.searchType = searchType
    }
  }, [searchType])

  useEffect(() => {
    if (previousProps?.userType !== userType) {
      const startFrom = 0
      const limit = offset
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sort, order, search, props.searchType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        leagueTransactionsTotalCountFunc(search, props.searchType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      } else {
        getList(startFrom, limit, sort, order, userType, search, props.searchType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        getTransactionsTotalCountFunc(search, props.searchType, userType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      }
      setPageNo(1)
      setLoading(true)
    }
    return () => {
      previousProps.userType = userType
    }
  }, [userType])

  // use effect to startDate and EndDate Change
  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        if (isLeaguePassbook) {
          leaguePassbookList(startFrom, limit, sort, order, search, searchTypeBy, props.startDate, props.endDate, particulars, eType, transactionStatus, isFullResponse)
          leagueTransactionsTotalCountFunc(search, searchTypeBy, props.startDate, props.endDate, particulars, eType, transactionStatus, isFullResponse)
        } else {
          getList(startFrom, limit, sort, order, userType, search, searchTypeBy, props.startDate, props.endDate, particulars, eType, transactionStatus, isFullResponse)
          getTransactionsTotalCountFunc(search, searchTypeBy, userType, props.startDate, props.endDate, particulars, eType, transactionStatus, isFullResponse)
        }
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
        if (isLeaguePassbook) {
          leaguePassbookList(startFrom, limit, sort, order, search, searchTypeBy, props.startDate, props.endDate, particulars, eType, transactionStatus, isFullResponse)
          leagueTransactionsTotalCountFunc(search, searchTypeBy, props.startDate, props.endDate, particulars, eType, transactionStatus, isFullResponse)
        } else {
          getList(startFrom, limit, sort, order, userType, search, searchTypeBy, props.startDate, props.endDate, particulars, eType, transactionStatus, isFullResponse)
          getTransactionsTotalCountFunc(search, searchTypeBy, userType, props.startDate, props.endDate, particulars, eType, transactionStatus, isFullResponse)
        }
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
    if (previousProps.eType !== eType) {
      const startFrom = 0
      const limit = offset
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        leagueTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      } else {
        getList(startFrom, limit, sort, order, userType, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        getTransactionsTotalCountFunc(search, searchTypeBy, userType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      }
      setPageNo(1)
    }
    return () => {
      previousProps.eType = eType
    }
  }, [eType])

  // handle set transactionStatus
  useEffect(() => {
    if (previousProps.transactionStatus !== transactionStatus) {
      const startFrom = 0
      const limit = offset
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        leagueTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      } else {
        getList(startFrom, limit, sort, order, userType, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        getTransactionsTotalCountFunc(search, searchTypeBy, userType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      }
      setPageNo(1)
    }
    return () => {
      previousProps.transactionStatus = transactionStatus
    }
  }, [transactionStatus])

  // handle set Particulars
  useEffect(() => {
    if (previousProps.particulars !== particulars) {
      const startFrom = 0
      const limit = offset
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        leagueTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      } else {
        getList(startFrom, limit, sort, order, userType, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        getTransactionsTotalCountFunc(search, searchTypeBy, userType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      }
      setPageNo(1)
    }
    return () => {
      previousProps.particulars = particulars
    }
  }, [particulars])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // handle set List Details
  useEffect(() => {
    if (previousProps.List !== List) {
      if (List && !isFullList) {
        const userArrLength = List.rows ? List.rows.length : List.length
        const startFrom = ((activePageNo - 1) * offset) + 1
        const end = (startFrom - 1) + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
        setList(List?.rows ? List?.rows : List)
      } else if (transactionsTotalCount?.count === List?.rows?.length && isFullList) {
        setFullList(List.rows ? List.rows : [])
        setLoading(false)
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(List.rows ? List.rows : []),
          fileName: 'Transactions.xlsx'
        }
        exporter.current.save()
        setLoader(false)
      }
      setLoading(false)
    }
    if (previousProps.transactionsTotalCount !== transactionsTotalCount && transactionsTotalCount) {
      setTotal(transactionsTotalCount?.count ? transactionsTotalCount?.count : 0)
    }
    return () => {
      previousProps.List = List
      previousProps.transactionsTotalCount = transactionsTotalCount
    }
  }, [List, transactionsTotalCount])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          if (isLeaguePassbook) {
            leaguePassbookList(startFrom, limit, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
            leagueTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
          } else {
            getList(startFrom, limit, sort, order, userType, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
            getTransactionsTotalCountFunc(search, searchTypeBy, userType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
          }
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

  // will be called when page changes occurred
  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current && start) {
      if (isLeaguePassbook) {
        leaguePassbookList(start, offset, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      } else {
        getList(start, offset, sort, order, userType, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      }
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      if (isLeaguePassbook) {
        leaguePassbookList(start, offset, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        leagueTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      } else {
        getList(start, offset, sort, order, userType, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        getTransactionsTotalCountFunc(searchProp, searchTypeBy, userType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      }
      setLoading(true)
    } else if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      if (isLeaguePassbook) {
        leaguePassbookList(0, offset, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      } else {
        getList(0, offset, sort, order, userType, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      }
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  // function to sorting to the nameOrder and createdOrder
  function onSorting (sortingBy) {
    const Order = sortingBy === 'dActivityDate' ? nameOrder : createdOrder
    if (Order === 'asc') {
      const startFrom = 0
      const limit = offset
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sortingBy, 'desc', search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      } else {
        getList(startFrom, limit, sortingBy, 'desc', userType, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      }
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'dActivityDate') {
        setNameOrder('desc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('desc')
        setSort(sortingBy)
      }
    } else {
      const startFrom = 0
      const limit = offset
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sortingBy, 'asc', search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      } else {
        getList(startFrom, limit, sortingBy, 'asc', userType, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      }
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'dActivityDate') {
        setNameOrder('asc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('asc')
        setSort(sortingBy)
      }
    }
  }

  const processExcelExportData = data => data.map((passbookList) => {
    const sUsername = passbookList.sUsername ? passbookList.sUsername : '--'
    const sName = passbookList.sName ? passbookList.sName : '--'
    const sEmail = passbookList.sEmail ? passbookList.sEmail : '--'
    const sMobNum = passbookList.sMobNum ? passbookList.sMobNum : '--'
    const sPromocode = passbookList.sPromocode || '--'
    const matchName = passbookList.sMatchName || '--'
    const matchDateTime = passbookList.dMatchStartDate ? moment(passbookList.dMatchStartDate).format('DD/MM/YYYY hh:mm A') : '--'
    const sRemarks = passbookList.sRemarks ? passbookList.sRemarks : '--'
    let dActivityDate = moment(passbookList.dActivityDate).local().format('lll')
    const type = passbookList.eType === 'Cr' ? 'Credited' : passbookList.eType === 'Dr' ? 'Debited' : '--'
    dActivityDate = dActivityDate === 'Invalid date' ? ' - ' : dActivityDate
    const iTransactionId = passbookList.iTransactionId || '--'
    const eTransactionType = passbookList.eTransactionType || '--'
    const nLoyaltyPoint = passbookList.nLoyaltyPoint || '--'
    return {
      ...passbookList,
      sUsername,
      sName,
      sEmail,
      sMobNum,
      dActivityDate,
      sPromocode,
      iTransactionId,
      eTransactionType,
      matchName,
      matchDateTime,
      type,
      sRemarks,
      nLoyaltyPoint
    }
  })

  async function onExport () {
    if (startDate && endDate) {
      if (isLeaguePassbook) {
        await leaguePassbookList(start, offset, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, true)
        await leagueTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, true)
      } else {
        await getList(start, offset, sort, order, userType, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, true)
        await getTransactionsTotalCountFunc(search, searchTypeBy, userType, startDate, endDate, particulars, eType, transactionStatus, true)
      }
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

  function onRefresh () {
    // const startFrom = 0
    if (isLeaguePassbook) {
      leaguePassbookList(start, offset, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      leagueTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
    } else {
      getList(start, offset, sort, order, userType, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      getTransactionsTotalCountFunc(search, searchTypeBy, userType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
    }
    setLoading(true)
    setPageNo(activePageNo)
  }

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
        fileName={props.isUserToPassbook ? `Transactions - ${list[0]?.sUsername}.xlsx` : 'Transactions.xlsx'}
      >
        <ExcelExportColumn field="id" title="ID" />
        <ExcelExportColumn field="sUsername" title="Username" />
        <ExcelExportColumn field="sEmail" title="Email" />
        <ExcelExportColumn field="sMobNum" title="Mobile No" />
        <ExcelExportColumn field="nAmount" title="Amount" />
        <ExcelExportColumn field="nLoyaltyPoint" title="Loyalty Point" />
        <ExcelExportColumn field="nNewTotalBalance" title="Available Total Balance" />
        <ExcelExportColumn field="nNewBonus" title="Available Bonus" />
        <ExcelExportColumn field="sPromocode" title="Promocode" />
        <ExcelExportColumn field="type" title="Type" />
        <ExcelExportColumn field="eTransactionType" title="Transaction Type" />
        <ExcelExportColumn field="iTransactionId" title="Transaction ID" />
        <ExcelExportColumn field="matchName" title="Match" />
        <ExcelExportColumn field="matchDateTime" title="Match Date & Time" />
        <ExcelExportColumn field="dActivityDate" title="Activity Date" />
        <ExcelExportColumn field="sRemarks" title="Remarks" />
      </ExcelExport>
      {loader && <Loading />}
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="Transactions" obj={obj}/>
          )
        : (!loading && (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Passbook ID</th>
                    <th> Status </th>
                    <th>User Type</th>
                    <th>Username</th>
                    <th>Mobile No.</th>
                    <th>
                      Amount
                      <br />
                      (Cash + Bonus)
                    </th>
                    <th>Loyalty Point</th>
                    <th>
                      Available Total Balance
                      <br />
                      (Available Deposit Balance
                      {' '}
                      <br />
                      + Available Winning Balance)
                    </th>
                    <th>Promocode</th>
                    <th>Available Bonus</th>
                    <th>
                      {' '}
                      Type
                    </th>
                    <th> Transaction Type</th>
                    <th>Transaction ID</th>
                    <th>
                      Request Date & Time
                      <Button className="sort-btn" color="link" onClick={() => onSorting('dActivityDate')}><img alt="sorting" className="m-0 d-block" src={sortIcon} /></Button>
                    </th>
                    <th>
                      Approval Date & Time
                      <Button className="sort-btn" color="link" onClick={() => onSorting('dProcessedDate')}><img alt="sorting" className="m-0 d-block" src={sortIcon} /></Button>
                    </th>
                    <th>Match</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={17} />
                    : (
                      <Fragment>
                        {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr key={i}>
                        <td>{data.id ? data.id : '--'}</td>
                        <td>
                          {data.eStatus === 'CMP'
                            ? (
                              <Badge className='match-status-cmp ml-2'>
                                Completed
                              </Badge>
                              )
                            : (
                                ''
                              )}
                          {data.eStatus === 'R'
                            ? (
                              <Badge className='match-status-r ml-2'>
                                Refunded
                              </Badge>
                              )
                            : (
                                ''
                              )}
                          {data.eStatus === 'CNCL'
                            ? (
                              <Badge className='match-status-cancl ml-2'>
                                Cancelled
                              </Badge>
                              )
                            : (
                                ''
                              )}
                        </td>
                        <td>{data.eUserType ? data.eUserType === 'U' ? 'User' : 'Bot' : '--'}</td>
                        {(adminPermission && adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS === 'N' && data.eUserType === 'U')
                          ? <td><Button className='total-text-link' color="link" tag={Link} to={`/users/user-management/user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                          : (adminPermission && adminPermission.USERS === 'N' && adminPermission.SYSTEM_USERS !== 'N' && data.eUserType !== 'U')
                              ? <td><Button className='total-text-link' color="link" tag={Link} to={`/users/system-user/system-user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                              : (adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N'))
                                  ? <td><Button className='total-text-link' color="link" tag={Link} to={data.eUserType === 'U' ? `/users/user-management/user-details/${data.iUserId}` : `/users/system-user/system-user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                                  : <td>{data.sUsername || '--'}</td>}
                        <td>{data.sMobNum || '--'}</td>
                        <td>
                          {data.nAmount ? data.nAmount : 0}
                          <br />
                          <b>{data.nCash !== 0 || data.nBonus !== 0 ? `(${data.nCash} + ${data.nBonus})` : ''}</b>
                        </td>
                        <td>{data.nLoyaltyPoint || '--'}</td>
                        <td>
                          {data.nNewTotalBalance ? data.nNewTotalBalance : 0}
                          <br />
                          <b>{data.nNewDepositBalance !== 0 || data.nNewWinningBalance !== 0 ? `(${data.nNewDepositBalance} + ${data.nNewWinningBalance})` : ''}</b>
                        </td>
                        <td>{data.sPromocode || '--'}</td>
                        <td>{data.nNewBonus ? data.nNewBonus : 0}</td>
                        <td>{data.eType && data.eType === 'Cr' ? 'Credited' : data.eType === 'Dr' ? 'Debited' : '--'}</td>
                        <td>{data.eTransactionType ? data.eTransactionType : '--'}</td>
                        <td>{data.iTransactionId || '--'}</td>
                        <td>{data.dActivityDate ? moment(data.dActivityDate).format('DD/MM/YYYY hh:mm A') : ' - '}</td>
                        <td>{data.dProcessedDate ? moment(data.dProcessedDate).format('DD/MM/YYYY hh:mm A') : ' - '}</td>
                        <td>
                          {data.sMatchName || '--'}
                          <br />
                          {data.dMatchStartDate ? moment(data.dMatchStartDate).format('DD/MM/YYYY hh:mm A') : ''}
                        </td>
                        <td>{data.sRemarks ? data.sRemarks : '-'}</td>
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
          )
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

PassbookList.propTypes = {
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  flag: PropTypes.bool,
  getList: PropTypes.func,
  List: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  search: PropTypes.string,
  openPicker: PropTypes.bool,
  getTransactionsTotalCountFunc: PropTypes.func,
  searchType: PropTypes.string,
  isLeaguePassbook: PropTypes.string,
  leaguePassbookList: PropTypes.array,
  leagueTransactionsTotalCountFunc: PropTypes.func,
  userToPassbookId: PropTypes.string,
  tdsToPassbookId: PropTypes.number,
  isUserToPassbook: PropTypes.bool,
  isTdsToPassbook: PropTypes.bool,
  userType: PropTypes.string
}

PassbookList.displayName = PassbookList

export default PassbookList
