/* eslint-disable no-unused-vars */
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, Fragment } from 'react'
import { useQueryState } from 'react-router-use-location-state'
import { Input, FormGroup, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, Button } from 'reactstrap'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import qs from 'query-string'
import moment from 'moment'
import PropTypes from 'prop-types'

import AlertMessage from '../../../../components/AlertMessage'
import DataNotFound from '../../../../components/DataNotFound'
import SkeletonTable from '../../../../components/SkeletonTable'
import PaginationComponent from '../../../../components/PaginationComponent'

const PromocodeStatistics = forwardRef((props, ref) => {
  const { promocodeStatisticsDetails, getList, recommendedList, setTotalBonusGiven, PromoUsage, setPromoUsage } = props
  const { id } = useParams()
  const location = useLocation()
  const exporter = useRef(null)
  const searchProp = props.search
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [show, setShow] = useState(false)
  const [total, setTotal] = useState(0)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [listLength, setListLength] = useState('10 Rows')
  const [message] = useState('')
  const [close] = useState(false)
  const [status] = useState(false)
  const [Loading, setLoading] = useState(false)
  const [modalMessage] = useState(false)
  const isSendId = useSelector(state => state?.users?.isSendId)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const previousProps = useRef({ promocodeStatisticsDetails, searchProp, start, offset })?.current
  const paginationFlag = useRef(false)
  const navigate = useNavigate()
  const obj = qs?.parse(location?.search)

  useEffect(() => {
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
      if (obj?.search) {
        setSearch(obj?.search)
      }
      if ((!obj?.search) && (!obj?.datefrom)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        if (id) {
          getList(startFrom, limit, sort, order, search)
          setLoading(true)
        }
      }
    }
  }, [])

  //  get recommended list
  useEffect(() => {
    if (isSendId && recommendedList && recommendedList?.length > 0 && searchProp) {
      getList(start, offset, sort, order, search)
      setLoading(true)
    }
  }, [isSendId, searchProp])

  //  set recommended list
  useEffect(() => {
    if (previousProps.recommendedList !== recommendedList && recommendedList) {
      setShow(true)
    }
    return () => {
      previousProps.recommendedList = recommendedList
    }
  }, [recommendedList])

  // useeffect to set promocode statistics details
  useEffect(() => {
    if (promocodeStatisticsDetails && previousProps?.promocodeStatisticsDetails !== promocodeStatisticsDetails) {
      setTotalBonusGiven(promocodeStatisticsDetails?.ntotalBonusGiven)
      setPromoUsage(promocodeStatisticsDetails?.data)
      setLoading(false)
      if (promocodeStatisticsDetails?.data) {
        const userArrLength = promocodeStatisticsDetails?.data?.length
        const startFrom = ((activePageNo - 1) * offset) + 1
        const end = (startFrom - 1) + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
      }
    }
    setIndex(activePageNo)
    setTotal(promocodeStatisticsDetails?.total)
    return () => {
      previousProps.promocodeStatisticsDetails = promocodeStatisticsDetails
    }
  }, [promocodeStatisticsDetails])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props?.search)

      setSearch(searchProp?.trim())
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

  useEffect(() => {
    if ((previousProps?.start !== start || previousProps?.offset !== offset) && paginationFlag?.current) {
      getList(start, offset, sort, order, search)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  // Export Excel Report List
  const processExcelExportData = data => data?.map((PromoUsageList) => {
    const sUsername = PromoUsageList?.iUserId?.sUsername
    const sMobNum = PromoUsageList?.iUserId?.sMobNum
    const idepositId = PromoUsageList?.idepositId || '--'
    let dCreatedAt = moment(PromoUsageList?.dCreatedAt)?.local()?.format('lll')
    let eStatus = PromoUsageList?.eStatus
    dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt
    eStatus = eStatus === 'Y' ? 'Active' : 'InActive'

    return {
      ...PromoUsageList,
      sUsername,
      sMobNum,
      idepositId,
      dCreatedAt,
      eStatus
    }
  })

  function onExport () {
    const { length } = PromoUsage
    if (length !== 0) {
      exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(PromoUsage), fileName: 'PromoUsageList.xlsx' }
      exporter.current.save()
    }
  }

  // for refresh promo statistics
  function onRefresh () {
    const startFrom = 0
    getList(startFrom, offset, sort, order, search)
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

      <ExcelExport ref={exporter} data={PromoUsage} fileName="Promocode.xlsx">
        <ExcelExportColumn field="sUsername" title="Username" />
        <ExcelExportColumn field="sTransactionType" title="Transaction Type" />
        <ExcelExportColumn field="sMobNum" title="Mobile Number" />
        <ExcelExportColumn field="nAmount" title="Amount" />
        <ExcelExportColumn field="idepositId" title="Deposit Id" />
        <ExcelExportColumn field="eStatus" title="Status" />
        <ExcelExportColumn field="dCreatedAt" title="Creation Time" />
      </ExcelExport>

      {!Loading && !PromoUsage
        ? (
          <DataNotFound message="promocode statistics list" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <div className="d-flex justify-content-between mb-3 fdc-480" />
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Username</th>
                    <th>Mobile Number</th>
                    <th>Amount</th>
                    <th>Transaction Type</th>
                    <th>Match Name</th>
                    <th>Deposit ID</th>
                    <th>Created Time</th>
                  </tr>
                </thead>
                <tbody>
                  {Loading
                    ? <SkeletonTable numberOfColumns={8} />
                    : (
                      <Fragment>
                        {
                PromoUsage && PromoUsage?.length !== 0 && PromoUsage?.map((data, i) => (
                  <tr key={data?._id}>
                    <td>{(((index - 1) * offset) + (i + 1))}</td>
                    <td>
                      {(adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N')) && data?.iUserId?.eType && data?.iUserId?._id
                        ? <Button className="total-text-link" color="link" tag={Link} to={(data.iUserId.eType === 'U') ? '/users/user-management/user-details/' + data?.iUserId?._id : '/users/system-user/system-user-details/' + data?.iUserId?._id }>{data?.iUserId?.sUsername || '--'}</Button>
                        : data?.iUserId?.sUsername || '--'}
                    </td>
                    <td>{data?.iUserId && data?.iUserId?.sMobNum ? data?.iUserId?.sMobNum : '--'}</td>
                    <td>{data?.nAmount}</td>
                    <td>{data?.sTransactionType || '--'}</td>
                    <td>
                      {data?.iMatchId?.sName ? <Button className='btn-link' color='link' onClick={() => navigate('/cricket/match-management/match-league-management/match-league-promo-usage-list/' + data?.iMatchId?._id + '/' + data?.iMatchLeagueId, { goBack: true }) }>{data?.iMatchId?.sName}</Button> : '--'}
                    </td>
                    <td>{data?.idepositId || '--'}</td>
                    <td>{moment(data?.dCreatedAt)?.format('lll')}</td>
                  </tr>
                ))}
                      </Fragment>
                      )}
                </tbody>
              </table>
            </div>
          </div>
          )}
      {
  PromoUsage && (
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

PromocodeStatistics.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  search: PropTypes.string,
  userSearch: PropTypes.string,
  recommendedList: PropTypes.array,
  flag: PropTypes.bool,
  handleChangeSearch: PropTypes.func,
  handleRecommendedSearch: PropTypes.func,
  promocodeStatisticsDetails: PropTypes.object,
  getList: PropTypes.func,
  setTotalBonusGiven: PropTypes.func,
  PromoUsage: PropTypes.array,
  setPromoUsage: PropTypes.func
}

PromocodeStatistics.displayName = PromocodeStatistics
export default PromocodeStatistics
