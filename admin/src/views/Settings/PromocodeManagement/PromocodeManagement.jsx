import React, { Fragment, useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Button, CustomInput, Modal, ModalBody, Row, Col } from 'reactstrap'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { useQueryState } from 'react-router-use-location-state'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import sortIcon from '../../../assets/images/sort-icon.svg'
import deleteIcon from '../../../assets/images/delete-bin-icon.svg'
import editButton from '../../../assets/images/edit-pen-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'
import statistics from '../../../assets/images/statistic.svg'

import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import { modalMessageFunc } from '../../../helpers/helper'
import { deletePromocode } from '../../../actions/promocode'

const PromoCodeManagement = forwardRef((props, ref) => {
  const { getList, promocodeList, updatePromo, startDate, endDate, promoType } = props
  const navigate = useNavigate()
  const location = useLocation()
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'des')
  const [search, setSearch] = useQueryState('search', '')
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 Rows')
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const [deleteId, setDeleteId] = useState('')

  const dispatch = useDispatch()
  const token = useSelector(state => state?.auth?.token)
  const resStatus = useSelector(state => state?.promocode?.resStatus)
  const resMessage = useSelector(state => state?.promocode?.resMessage)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const searchProp = props?.search
  const previousProps = useRef({ promocodeList, searchProp, resMessage, startDate, endDate, promoType, start, offset })?.current
  const obj = qs?.parse(location.search)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const paginationFlag = useRef(false)

  useEffect(() => {
    if (location?.state) {
      setModalMessage(true)
      setMessage(location?.state?.message)
      setStatus(true)
      navigate(location?.pathname, { replace: true })
    }
    let page = 1
    let limit = offset
    let order = 'desc'
    let searchText = ''
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
        order = obj?.order
        setOrder(order)
      }
      if (obj?.search) {
        searchText = obj?.search
        setSearch(obj?.search)
      }
      if (!(obj?.datefrom && obj?.dateto)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, sort, order, searchText, promoType, dateFrom, dateTo)
      }
    }
    setLoading(true)
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          if (list?.length === 1 && deleteId) {
            setDeleteId('')
            const startFrom = 0
            const limit = offset
            getList(startFrom, limit, sort, order, search, promoType, dateFrom, dateTo)
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(1)
          } else {
            const startFrom = (activePageNo - 1) * offset
            const limit = offset
            getList(startFrom, limit, sort, order, search, promoType, dateFrom, dateTo)
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(activePageNo)
          }
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
          setLoading(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  //  get promotype list
  useEffect(() => {
    if (previousProps?.promoType !== promoType) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, promoType, dateFrom, dateTo)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.promoType = promoType
    }
  }, [promoType])

  useEffect(() => {
    let data = localStorage?.getItem('queryParams') ? JSON?.parse(localStorage?.getItem('queryParams')) : {}
    !Object?.keys(data)?.length
      ? data = { PromoCodeManagement: location?.search }
      : data.PromoCodeManagement = location?.search
    localStorage?.setItem('queryParams', JSON?.stringify(data))
  }, [location?.search])

  //  set promocode list
  useEffect(() => {
    if (previousProps?.promocodeList !== promocodeList) {
      if (promocodeList) {
        if (promocodeList?.results) {
          const userArrLength = promocodeList?.results?.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(promocodeList.results)
        setIndex(activePageNo)
        setTotal(promocodeList.total || 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.promocodeList = promocodeList
    }
  }, [promocodeList])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, promoType, dateFrom, dateTo)
      setSearch(searchProp.trim())
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

  // will be called when change startDate and endDate
  useEffect(() => {
    if (previousProps?.startDate !== startDate || previousProps?.endDate !== endDate) {
      if (props?.startDate && props?.endDate) {
        const startFrom = (obj && obj?.datefrom && obj?.dateto && obj?.page) ? (obj?.page - 1) * offset : 0
        const limit = offset
        getList(startFrom, limit, sort, order, props.search, promoType, props?.startDate, props?.endDate)
        setDateFrom(moment(props?.startDate)?.format('MM-DD-YYYY'))
        setDateTo(moment(props?.endDate)?.format('MM-DD-YYYY'))
        if ((obj && obj?.datefrom && obj?.dateto && obj?.page)) {
          setPageNo(obj?.page)
        } else {
          setPageNo(1)
        }
        setLoading(true)
      } else if ((!props?.startDate) && (!props?.endDate)) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, props?.search, promoType, props?.startDate, props?.endDate)
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
    if ((previousProps?.start !== start || previousProps?.offset !== offset) && paginationFlag?.current) {
      getList(start, offset, sort, order, search, promoType, dateFrom, dateTo)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function warningWithConfirmMessage (data, eType) {
    setType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function warningWithDeleteMessage (Id, eType) {
    setType(eType)
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onDelete () {
    dispatch(deletePromocode(deleteId, token))
    setLoading(true)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  // update status from list and dispatch action
  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    const updatedPromoData = {
      promoType: selectedData?.eType,
      selectedMatches: selectedData?.aMatches,
      selectedLeagues: selectedData?.aLeagues,
      expiryDays: selectedData?.nBonusExpireDays,
      Name: selectedData?.sName,
      CouponCode: selectedData?.sCode,
      description: selectedData?.sInfo,
      amount: selectedData?.nAmount,
      minAmount: selectedData?.nMinAmount,
      maxAmount: selectedData?.nMaxAmount,
      maxAllow: selectedData?.nMaxAllow,
      startingDate: selectedData?.dStartTime,
      endingDate: selectedData?.dExpireTime,
      Percentage: selectedData?.bIsPercent,
      maxAllowPerUser: selectedData?.nPerUserUsage,
      promocodeStatus: statuss,
      token,
      promocodeId: selectedData?._id
    }
    updatePromo(updatedPromoData, selectedData?._id)
    setLoading(true)
    toggleWarning()
  }

  function onSorting (sortingBy) {
    setSort(sortingBy)
    if (order === 'desc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', search, promoType, dateFrom, dateTo)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', search, promoType, dateFrom, dateTo)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
    }
  }
  // Export Excel Report List
  const processExcelExportData = data => data.map((PromoCodeList) => {
    let dStartTime = moment(PromoCodeList?.dStartTime)?.local()?.format('lll')
    let dExpireTime = moment(PromoCodeList?.dExpireTime)?.local()?.format('lll')
    let eStatus = PromoCodeList?.eStatus
    let nBonusExpireDays = PromoCodeList?.nBonusExpireDays
    const nAmount = PromoCodeList?.bIsPercent ? `Rs. ${PromoCodeList?.nAmount}` : `${PromoCodeList?.nAmount}%`
    const nMinAmount = PromoCodeList?.nMinAmount || 0
    const nMaxAmount = PromoCodeList?.nMaxAmount || 0
    dStartTime = dStartTime === 'Invalid date' ? ' - ' : dStartTime
    dExpireTime = dExpireTime === 'Invalid date' ? ' - ' : dExpireTime
    eStatus = eStatus === 'Y' ? 'Active' : 'InActive'
    nBonusExpireDays = nBonusExpireDays || '--'

    return {
      ...PromoCodeList,
      dStartTime,
      dExpireTime,
      nAmount,
      nMinAmount,
      nMaxAmount,
      nBonusExpireDays,
      eStatus
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(list), fileName: 'Promocode.xlsx' }
      exporter?.current?.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
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
        data={list}
        fileName="Promocode.xlsx"
      >
        <ExcelExportColumn field="eStatus" title="Status" />
        <ExcelExportColumn field="eType" title="Promocode Type" />
        <ExcelExportColumn field="sCode" title="Promocode" />
        <ExcelExportColumn field="nAmount" title="Amount" />
        <ExcelExportColumn field="nMinAmount" title="MinAmount" />
        <ExcelExportColumn field="nMaxAmount" title="MaxAmount" />
        <ExcelExportColumn field="nMaxAllow" title="MaxAllow" />
        <ExcelExportColumn field="dStartTime" title="StartDate" />
        <ExcelExportColumn field="dExpireTime" title="EndDate" />
        <ExcelExportColumn field="sInfo" title="Info" />
        <ExcelExportColumn field="nBonusExpireDays" title="Bonus Expire Days" />
      </ExcelExport>
      {
      !loading && list?.length === 0
        ? (<DataNotFound message="Promo Codes" obj={obj}/>)
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Status</th>
                    <th>Type</th>
                    <th>Coupon Code</th>
                    <th>
                      <span className="d-inline-block align-middle">Amount/Percentage</span>
                      <Button className="sort-btn" color="link" onClick={() => onSorting('nAmount')}><img alt="sorting" className="m-0 d-block" src={sortIcon} /></Button>
                    </th>
                    <th>
                      <span className="d-inline-block align-middle">Min Amount</span>
                      <Button className="sort-btn" color="link" onClick={() => onSorting('nMinAmount')}><img alt="sorting" className="m-0 d-block" src={sortIcon} /></Button>
                    </th>
                    <th>
                      <span className="d-inline-block align-middle">Max Amount</span>
                      <Button className="sort-btn" color="link" onClick={() => onSorting('nMaxAmount')}><img alt="sorting" className="m-0 d-block" src={sortIcon} /></Button>
                    </th>
                    <th>
                      <span className="d-inline-block align-middle">Max Allow</span>
                      <Button className="sort-btn" color="link" onClick={() => onSorting('nMaxAllow')}><img alt="sorting" className="m-0 d-block" src={sortIcon} /></Button>
                    </th>
                    <th>
                      <span className="d-inline-block align-middle">Max Discount</span>
                      <Button className="sort-btn" color="link" onClick={() => onSorting('nMaxDiscount')}><img alt="sorting" className="m-0 d-block" src={sortIcon} /></Button>
                    </th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Statistics</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={12} />
                    : (
                      <Fragment>
                        {
                    list && list?.length !== 0 && list.map((data, i) => (
                      <tr key={data?._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>
                          <CustomInput checked={data?.eStatus === 'Y'}
                            disabled={adminPermission?.PROMO === 'R'}
                            id={'id' + data?._id}
                            name={'name' + data?._id}
                            onChange={() => warningWithConfirmMessage(data, data?.eStatus === 'Y' ? 'Inactivate' : 'Activate')}
                            type='switch'
                          />
                        </td>
                        <td>{data.eType ? data.eType : '--'}</td>
                        <td>{data.sCode}</td>
                        <td>{data.nAmount ? data.nAmount : '--'}</td>
                        <td>{data.nMinAmount ? `₹${data.nMinAmount}` : '--'}</td>
                        <td>{data.nMaxAmount ? `₹${data.nMaxAmount}` : '--'}</td>
                        <td>{data.nMaxAllow}</td>
                        <td>{ data?.nMaxDiscount ? `₹${data?.nMaxDiscount}` : '--'}</td>
                        <td>{moment(data.dStartTime).format('lll')}</td>
                        <td>{moment(data.dExpireTime).format('lll')}</td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink className="view" to={'/settings/promocode-statistics/' + data?._id}>
                                <img alt="View" height="20px" src={statistics} width="20px" />
                              </NavLink>
                            </li>
                          </ul>
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink className="view" to={'/settings/promocode-details/' + data?._id}>
                                <Button className='edit-btn-icon'>
                                  <img alt="View" src={editButton} />
                                </Button>
                              </NavLink>
                            </li>
                            {
                              ((Auth && Auth === 'SUPER') || (adminPermission?.PROMO !== 'R')) &&
                              (
                                <Fragment>
                                  <li onClick={() => warningWithDeleteMessage(data?._id, 'delete')}>
                                    <Button className='delete-btn-icon' color="link">
                                      <span><img alt="Delete" src={deleteIcon} /></span>
                                    </Button>
                                  </li>
                                </Fragment>
                              )
                            }
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

      <Modal className="modal-confirm" isOpen={modalWarning} toggle={toggleWarning}>
        <ModalBody className='text-center'>
          <img alt='check' className='info-icon' src={warningIcon} />
          <h2 className='popup-modal-message'>{`Are you sure you want to ${type} it?`}</h2>
          <Row className='row-12'>
            <Col>
              <Button className='theme-btn outline-btn-cancel full-btn-cancel' onClick={deleteId ? onCancel : toggleWarning} type='submit'>Cancel</Button>
            </Col>
            <Col>
              <Button className='theme-btn danger-btn full-btn' onClick={deleteId ? onDelete : onStatusUpdate} type='submit'>{deleteId ? 'Delete It' : `${type} It`}</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

PromoCodeManagement.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  search: PropTypes.string,
  flag: PropTypes.bool,
  getList: PropTypes.func,
  promocodeList: PropTypes.object,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  openDatePicker: PropTypes.bool,
  updatePromo: PropTypes.func,
  promoType: PropTypes.string
}

PromoCodeManagement.displayName = PromoCodeManagement
export default connect(null, null, null, { forwardRef: true })(PromoCodeManagement)
