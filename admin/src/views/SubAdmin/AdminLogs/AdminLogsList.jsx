/* eslint-disable no-unused-vars */
import React, { Fragment, useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'reactstrap'
import { useQueryState } from 'react-router-use-location-state'
import { Link, useLocation, useParams } from 'react-router-dom'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import viewIcon from '../../../assets/images/view-eye.svg'

import DataNotFound from '../../../components/DataNotFound'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'

import { getKYCUrl, getKycUrl, getUrl } from '../../../actions/url'

const AdminLogsList = forwardRef((props, ref) => {
  const {
    getList, List, getAdminIds, startDate, endDate, recommendedList, dateFlag, match, getMatchLogsFunc, getLeagueLogsFunc, searchType, setSearch
  } = props
  const location = useLocation()
  const { id, leagueid } = useParams()
  const dispatch = useDispatch()
  const [activityDetails, setActivityDetails] = useState([])
  const [prizeBreakupFields, setPrizeBreakupFields] = useState({
    oldField: {},
    newField: {}
  })
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [isModalOpen, setModalOpen] = useState(false)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [searchTypeBy, setSearchTypeBy] = useQueryState('searchType', '')
  const [adminSearch, setAdminSearch] = useQueryState('adminId', '')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [listLength, setListLength] = useState('10 Rows')
  const [KYCUrl, setKycUrl] = useState('')
  const [url, setUrl] = useState('')
  const searchProp = props?.search
  const adminSearchProp = props?.adminSearch

  const toggleModal = () => setModalOpen(!isModalOpen)
  const matchLogs = useSelector(state => state?.subadmin?.matchLogs)
  const leagueLogs = useSelector(state => state?.subadmin?.leagueLogs)
  const singleLog = useSelector(state => state?.subadmin?.singleAdminLog)
  const token = useSelector(state => state?.auth?.token)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const profileUrl = useSelector(state => state?.url?.getUrl)
  const kycUrl = useSelector(state => state?.url?.kycUrl)
  const resStatus = useSelector(state => state?.subadmin?.resStatus)
  const resMessage = useSelector(state => state?.subadmin?.resMessage)
  const isSendId = useSelector(state => state?.users?.isSendId)
  const obj = qs.parse(location?.search)
  const previousProps = useRef({
    resMessage, resStatus, List, start, offset, startDate, endDate, searchProp, matchLogs, leagueLogs, searchType, singleLog, adminSearchProp
  })?.current
  const paginationFlag = useRef(false)

  useEffect(() => {
    let page = 1
    let limit = offset
    let orderBy = 'desc'
    if (obj) {
      if (obj?.page) {
        page = obj?.page
        setPageNo(page)
      }
      if (obj.pageSize) {
        limit = obj?.pageSize
        setOffset(limit)
        setListLength(`${limit} Rows`)
      }
      if (obj.order) {
        orderBy = obj.order
        setOrder(orderBy)
      }
      setLoading(true)
      if (id) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getMatchLogsFunc(startFrom, limit)
      } else if (leagueid) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getLeagueLogsFunc(startFrom, limit)
      } else if (!obj?.user) {
        dispatch(getUrl('media'))
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, orderBy, searchProp, searchTypeBy, adminSearch, obj?.datefrom ? new Date(obj?.datefrom) : dateFrom, obj?.dateto ? new Date(obj?.dateto) : dateTo)
      }
    }
  }, [])

  //  get recommendedList
  useEffect(() => {
    if (isSendId && recommendedList && recommendedList?.length !== 0 && searchProp) {
      getList(start, offset, order, searchProp, searchTypeBy, adminSearch, dateFrom, dateTo)
      setLoading(true)
    }
  }, [isSendId, searchProp])

  useEffect(() => {
    if (kycUrl) {
      setKycUrl(kycUrl)
    }
    if (profileUrl) {
      setUrl(profileUrl)
    }
  }, [kycUrl, profileUrl])

  useEffect(() => {
    let data = localStorage?.getItem('queryParams') ? JSON?.parse(localStorage?.getItem('queryParams')) : {}
    !Object?.keys(data)?.length
      ? data = {
        AdminLogs: location?.search
      }
      : data.AdminLogs = location?.search
    localStorage?.setItem('queryParams', JSON.stringify(data))
  }, [location?.search])

  //  set admin logs list
  useEffect(() => {
    if (previousProps?.List !== List) {
      if (List) {
        if (List?.aResult) {
          const userArrLength = List?.aResult.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(List?.aResult ? List?.aResult : [])
        setIndex(activePageNo)
        setTotal(List?.nTotal ? List?.nTotal : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.List = List
    }
  }, [List])

  useEffect(() => {
    if (previousProps?.matchLogs !== matchLogs) {
      if (matchLogs) {
        if (matchLogs?.results) {
          const userArrLength = matchLogs?.results?.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(matchLogs?.results ? matchLogs?.results : [])
        setIndex(activePageNo)
        setTotal(matchLogs?.total ? matchLogs?.total : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.matchLogs = matchLogs
    }
  }, [matchLogs])

  useEffect(() => {
    if (previousProps?.leagueLogs !== leagueLogs) {
      if (leagueLogs) {
        if (leagueLogs?.aResults) {
          const userArrLength = leagueLogs?.aResults?.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(leagueLogs?.aResults ? leagueLogs?.aResults : [])
        setIndex(activePageNo)
        setTotal(leagueLogs?.nTotal ? leagueLogs?.nTotal : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.leagueLogs = leagueLogs
    }
  }, [leagueLogs])

  useEffect(() => {
    if (previousProps?.searchType !== searchType) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, order, '', props?.searchType, adminSearch, props.startDate, props.endDate)
      setPageNo(1)
      setStart(startFrom)
      setLoading(true)
      setSearchTypeBy(props?.searchType)
      setSearch('')
    }
    return () => {
      previousProps.searchType = searchType
    }
  }, [searchType])

  useEffect(() => {
    if (previousProps?.startDate !== startDate || previousProps?.endDate !== endDate) {
      if (props?.startDate && props?.endDate && dateFlag?.current) {
        const startFrom = (obj && obj?.datefrom && obj?.dateto && obj?.page) ? (obj?.page - 1) * offset : 0
        const limit = offset
        getList(startFrom, limit, order, searchProp, searchTypeBy, adminSearch, props?.startDate, props?.endDate)
        setDateFrom(moment(props?.startDate)?.format('MM-DD-YYYY'))
        setDateTo(moment(props?.endDate)?.format('MM-DD-YYYY'))
        setStart(startFrom)
        if ((obj && obj?.datefrom && obj?.dateto && obj?.page)) {
          setPageNo(obj?.page)
        } else {
          setPageNo(1)
        }
        setLoading(true)
      } else if ((!props?.startDate) && (!props?.endDate)) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, order, searchProp, searchTypeBy, adminSearch, props?.startDate, props?.endDate)
        setStart(startFrom)
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
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = (activePageNo - 1) * offset
          const limit = offset
          getList(startFrom, limit, order, searchProp, searchTypeBy, adminSearch, dateFrom, dateTo)
          setPageNo(activePageNo)
        } else {
          setLoading(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, order, props?.search, searchTypeBy, adminSearch, dateFrom, dateTo)
      getAdminIds()
      setStart(startFrom)
      setAdminSearch(adminSearchProp)
      setPageNo(activePageNo)
      setLoading(true)
    }
    if (searchProp && !match?.params?.id && !match?.params?.leagueid) {
      if (previousProps?.searchProp !== searchProp) {
        const debouncer = setTimeout(() => {
          callSearchService()
        }, 1000)
        return () => {
          clearTimeout(debouncer)
          previousProps.searchProp = searchProp
        }
      }
    }
    if (!searchProp && !id && !leagueid && !activePageNo) {
      callSearchService()
    }
    return () => {
      previousProps.searchProp = searchProp
    }
  }, [searchProp])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, order, searchProp, searchTypeBy, props?.adminSearch, dateFrom, dateTo)
      getAdminIds()
      setAdminSearch(adminSearchProp)
      setStart(startFrom)
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps?.adminSearchProp !== adminSearchProp && props?.flag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.adminSearchProp = adminSearchProp
      }
    }
    return () => {
      previousProps.adminSearchProp = adminSearchProp
    }
  }, [adminSearchProp])

  useEffect(() => {
    if ((previousProps?.start !== start || previousProps?.offset !== offset) && paginationFlag?.current) {
      if (id) {
        getMatchLogsFunc(start, offset)
        setLoading(true)
      } else if (leagueid) {
        getLeagueLogsFunc(start, offset)
        setLoading(true)
      } else {
        getList(start, offset, order, searchProp, searchTypeBy, adminSearch, dateFrom, dateTo)
        getAdminIds()
        setLoading(true)
      }
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  useEffect(() => {
    if (previousProps?.singleLog !== singleLog) {
      setModalOpen(true)
      if (singleLog?.eKey === 'KYC') {
        const path = {
          sImage: singleLog?.oNewFields?.sImage,
          sFrontImage: singleLog?.oNewFields?.sFrontImage,
          sBackImage: singleLog?.oNewFields?.sBackImage
        }
        dispatch(getKYCUrl(path, token))
      }
      if (singleLog?.eKey === 'PB') {
        const oldFields = singleLog?.oOldFields?.aLeaguePrize
        const newFields = singleLog?.oNewFields?.aLeaguePrize
        const isSameData = (a, b) => a?.nPrize === b?.nPrize && a?.nRankFrom === b?.nRankFrom && a?.nRankTo === b?.nRankTo && a?.eRankType === b?.eRankType && a?.sInfo === b?.sInfo && a?.sImage === b?.sImage
        const onlyInOld = (left, right, compareFunction) =>
          left?.filter(leftValue =>
            !right?.some(rightValue =>
              compareFunction(leftValue, rightValue)))
        const oldField = onlyInOld(oldFields, newFields, isSameData)
        const newField = onlyInOld(newFields, oldFields, isSameData)
        setActivityDetails({ ...activityDetails, oNewFields: singleLog?.oNewFields, oOldFields: singleLog?.oOldFields })
        setPrizeBreakupFields({
          oldField: oldField?.length !== 0 ? [...oldField] : [],
          newField: newField?.length !== 0 ? [...newField] : []
        })
      } else {
        setActivityDetails({ ...activityDetails, oNewFields: singleLog?.oNewFields, oOldFields: singleLog?.oOldFields })
      }
    }

    return () => {
      previousProps.singleLog = singleLog
    }
  }, [singleLog])

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  function onRefresh () {
    // const startFrom = 0
    if (id) {
      getMatchLogsFunc(start, offset)
    } else if (leagueid) {
      getLeagueLogsFunc(start, offset)
    } else {
      getList(start, offset, order, searchProp, searchTypeBy, adminSearch, dateFrom, dateTo)
      dispatch(getKycUrl('kyc'))
      dispatch(getUrl('media'))
    }
    setLoading(true)
    setPageNo(activePageNo)
  }

  const eKeyLabels = {
    P: 'Profile',
    D: 'Process Deposit',
    W: 'Process Withdraw',
    KYC: 'KYC',
    BD: 'Bank Details',
    SUB: 'Sub Admin',
    AD: 'Deposit',
    AW: 'Withdraw',
    PC: 'Promo Code',
    L: 'League',
    PB: 'League Prize Breakup',
    M: 'Match',
    ML: 'Match League',
    S: 'Settings',
    CR: 'Common Rules',
    CF: 'Complaints & Feedback',
    SLB: 'Series Leaderboard',
    MP: 'Match Player',
    LB: 'Leaderboard'
  }

  function highlighted (oldFieldss, newFieldss, fOld, fNew) {
    if (!oldFieldss) {
      if (fNew !== 0 && fNew !== undefined) {
        return 'admin-logs-highlighted'
      } else {
        return ''
      }
    }
    if (!newFieldss) {
      if (fOld !== 0 && fOld !== undefined) {
        return 'admin-logs-highlighted'
      } else {
        return ''
      }
    }
    if (((fOld && fNew) && fOld !== fNew) || (fOld && !fNew) || (!fOld && fNew)) {
      return 'admin-logs-highlighted'
    } else {
      return ''
    }
  }
  return (
    <Fragment>
      {
          !loading && list?.length !== 0
            ? (
              <div className='table-represent'>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Admin Type</th>
                        <th>Admin Name</th>
                        <th>Admin&lsquo;s Username</th>
                        <th>User&lsquo;s Username</th>
                        <th> Operation Type</th>
                        <th>Operation Name</th>
                        <th>Operation Time</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading
                        ? <SkeletonTable numberOfColumns={9} />
                        : (
                          <Fragment>
                            {
                          list && list?.length !== 0 && list?.map((data, i) => (
                            <tr key={data?._id}>
                              <td>{(((index - 1) * offset) + (i + 1))}</td>
                              <td>{data?.iAdminId && data?.iAdminId?.eType ? data.iAdminId?.eType : '--'}</td>
                              <td>{data?.iAdminId && data?.iAdminId?.sName ? data.iAdminId?.sName : '--'}</td>
                              <td>
                                {(data?.iAdminId?.eType === 'SUB')
                                  ? <Button className="total-text-link" color="link" tag={Link} to={'/sub-admin/edit-sub-admin/' + data?.iAdminId?._id}>{data?.iAdminId?.sUsername || '--'}</Button>
                                  : (data?.iAdminId?.sUsername || '--')}
                              </td>
                              <td>
                                {(adminPermission && (adminPermission?.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N')) && data?.iUserId?.sUsername
                                  ? <Button className="total-text-link" color="link" tag={Link} to={data?.iUserId?.eType === 'U' ? '/users/user-management/user-details/' + data.iUserId?._id : '/users/system-user/system-user-details/' + data.iUserId?._id}>{data?.iUserId?.sUsername}</Button>
                                  : data?.iUserId?.sUsername || '--'}
                              </td>
                              <td>
                                {eKeyLabels[data?.eKey] || '--'}
                              </td>
                              <td>{data?.oOldFields && data?.oOldFields?.sName ? data?.oOldFields?.sName : '--'}</td>
                              <td>{data?.dCreatedAt ? moment(data?.dCreatedAt)?.format('DD/MM/YYYY hh:mm A') : '--'}</td>
                              <td>
                                <ul className='action-list mb-0 d-flex'>
                                  <li>
                                    <Link state={data} to={{ pathname: '/admin-logs/single-log-details/' + data?._id }} >
                                      <Button className='view-btn-icon'>
                                        <img alt="View" src={viewIcon} />
                                      </Button>
                                    </Link>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          ))}
                          </Fragment>
                          )}
                    </tbody>
                  </table>
                </div>
              </div>
              )
            : (obj
                ? <DataNotFound message="" obj=" "/>
                : <DataNotFound message="Logs" obj={obj}/>
              )
      }

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

AdminLogsList.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  search: PropTypes.string,
  flag: PropTypes.bool,
  getList: PropTypes.func,
  List: PropTypes.object,
  getAdminIds: PropTypes.func,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  searchType: PropTypes.string,
  adminSearch: PropTypes.string,
  recommendedList: PropTypes.object,
  dateFlag: PropTypes.bool,
  getMatchLogsFunc: PropTypes.func,
  getLeagueLogsFunc: PropTypes.func,
  setSearch: PropTypes.func
}
AdminLogsList.displayName = AdminLogsList

export default AdminLogsList
