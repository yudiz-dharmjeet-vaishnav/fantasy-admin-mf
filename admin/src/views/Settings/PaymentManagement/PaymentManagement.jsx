import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { CustomInput, Modal, ModalBody, Row, Col, Button } from 'reactstrap'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import classNames from 'classnames'
import qs from 'query-string'
import PropTypes from 'prop-types'

import warningIcon from '../../../assets/images/error-warning.svg'
import editButton from '../../../assets/images/edit-pen-icon.svg'
import noImage from '../../../assets/images/no-image-1.svg'
import sortIcon from '../../../assets/images/sort-icon.svg'

import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import { modalMessageFunc } from '../../../helpers/helper'
import { getUrl } from '../../../actions/url'
import { updatePayment } from '../../../actions/payment'

const PaymentManagementComponent = forwardRef((props, ref) => {
  const { getList, paymentList } = props
  const navigate = useNavigate()
  const location = useLocation()
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 Rows')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [type, setType] = useState('')
  const [selectedData, setSelectedData] = useState({})
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)

  const dispatch = useDispatch()
  const token = useSelector(state => state?.auth?.token)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const resStatus = useSelector(state => state?.payment?.resStatus)
  const resMessage = useSelector(state => state?.payment?.resMessage)
  const getUrlLink = useSelector(state => state?.url?.getUrl)
  const searchProp = props?.search
  const previousProps = useRef({ paymentList, resStatus, resMessage, searchProp, start, offset })?.current
  const paginationFlag = useRef(false)
  const obj = qs?.parse(location.search)

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
    let order = 'desc'
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
    }
    dispatch(getUrl('media'))
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, order, search)
    setLoading(true)
  }, [])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  // to set payment list
  useEffect(() => {
    if (previousProps?.paymentList !== paymentList) {
      if (paymentList) {
        if (paymentList?.results) {
          const userArrLength = paymentList?.results?.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(paymentList?.results || [])
        setIndex(activePageNo)
        setTotal(paymentList?.total || 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.paymentList = paymentList
    }
  }, [paymentList])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = (activePageNo - 1) * offset
          const limit = offset
          getList(startFrom, limit, sort, order, search)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(activePageNo)
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
    !Object?.keys(data)?.length
      ? data = { PaymentManagement: location.search }
      : data.PaymentManagement = location?.search
    localStorage?.setItem('queryParams', JSON?.stringify(data))
  }, [location?.search])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search)
      setSearch(searchProp?.trim())
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps?.searchProp !== searchProp && props.flag) {
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

  // for set ascending/decending operation
  function onSorting (sortingBy) {
    if (order === 'desc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', search)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', search)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
    }
  }

  // will be called when page change occured
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

  function warningWithConfirmMessage (data, eType) {
    setType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function onCancel () {
    toggleWarning()
  }

  // update status from list and dispatch action
  function onStatusUpdate () {
    const statuss = !selectedData?.bEnable
    const updatedPaymentData = {
      Offer: selectedData?.sOffer,
      Name: selectedData?.sName,
      Key: selectedData?.eKey,
      PaymentImage: selectedData?.sImage,
      Order: selectedData?.nOrder,
      PaymentStatus: statuss,
      token,
      PaymentId: selectedData?._id
    }
    dispatch(updatePayment(updatedPaymentData))
    setLoading(true)
    toggleWarning()
  }
  // Export Excel Report List
  const processExcelExportData = data => data.map((listOfPayments) => {
    let bEnable = listOfPayments?.bEnable
    bEnable = bEnable ? 'Active' : 'InActive'
    return {
      ...listOfPayments,
      bEnable
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(list), fileName: 'PaymentMethods.xlsx' }
      exporter?.current?.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      <ExcelExport
        ref={exporter}
        data={list}
        fileName="PaymentMethods.xlsx"
      >
        <ExcelExportColumn field="bEnable" title="Status" />
        <ExcelExportColumn field="sName" title="Name" />
        <ExcelExportColumn field="eKey" title="Key" />
        <ExcelExportColumn field="sOffer" title="Offer" />
        <ExcelExportColumn field="nOrder" title="Order" />
      </ExcelExport>

      <div className='d-flex justify-content-between flex-wrap pr-4 pl-4 mt-4'>
        <Row className='reports-heading'>
          <Button tag={Link} className={classNames('payment-combine', { 'payment-combine-active': location && ((location?.pathname === '/settings/payment-management')) })}>
            Payment Gateways
          </Button>
          <Button tag={Link} className={classNames('payment-combine', { active: location && ((location?.pathname === '/settings/payout-management')) })} to='/settings/payout-management'>
            Payout Gateways
          </Button>
        </Row>
      </div>

      {
      !loading && list?.length === 0
        ? (<DataNotFound message="Payment Method List" obj={obj}/>)
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <AlertMessage
                close={close}
                message={message}
                modalMessage={modalMessage}
                status={status}
              />
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Status</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Key</th>
                    <th>Offer</th>
                    <th className='table_sortIcon'>
                      <ul>
                        <li>
                          <span className="d-inline-block align-middle">Order</span>
                          <Button className="sort-btn" color="link" onClick={() => onSorting('nOrder')}><img alt="sorting" className="m-0 d-block" src={sortIcon} /></Button>
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
                        <CustomInput checked={data.bEnable}
                          disabled={adminPermission?.PAYMENT_OPTION === 'R'}
                          id={'switch' + (i + 1)}
                          name={'switch' + (i + 1)}
                          onClick={() => warningWithConfirmMessage(data, data?.bEnable ? 'Inactivate' : 'Activate')}
                          type="switch"
                        />
                      </td>
                      <td>
                        {data?.sImage
                          ? <img alt="payment" className="theme-image" src={url + data?.sImage} />
                          : <img alt="No Image" className='theme-image-offer' src={noImage}/>
                          }
                      </td>
                      <td>{data?.sName || '-'}</td>
                      <td>{data?.eKey || '-'}</td>
                      <td>{data?.sOffer || '-'}</td>
                      <td>{data?.nOrder || '-'}</td>
                      <td>
                        <ul className="action-list mb-0 d-flex">
                          <li>
                            <NavLink className="view" color="link" to={'/settings/payment-details/' + data?._id}>
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
              <Button className='theme-btn outline-btn-cancel full-btn-cancel' onClick={onCancel} type='submit'>Cancel</Button>
            </Col>
            <Col>
              <Button className='theme-btn danger-btn full-btn' onClick={onStatusUpdate} type='submit'>{`${type} It`}</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

PaymentManagementComponent.propTypes = {
  getList: PropTypes.func,
  paymentList: PropTypes.object,
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  flag: PropTypes.bool
}

PaymentManagementComponent.displayName = PaymentManagementComponent
export default connect(null, null, null, { forwardRef: true })(PaymentManagementComponent)
