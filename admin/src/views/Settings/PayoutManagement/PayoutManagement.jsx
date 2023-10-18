import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { CustomInput, Modal, ModalBody, Row, Col, Button } from 'reactstrap'
import qs from 'query-string'
import PropTypes from 'prop-types'

import noImage from '../../../assets/images/no-image-1.svg'
import editButton from '../../../assets/images/edit-pen-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'

import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import { modalMessageFunc } from '../../../helpers/helper'
import { getUrl } from '../../../actions/url'
import { updatePayout } from '../../../actions/payout'
import classNames from 'classnames'

const PayoutComponent = forwardRef((props, ref) => {
  const { getList, payoutList } = props
  const navigate = useNavigate()
  const location = useLocation()

  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'asc')
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
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const token = useSelector(state => state?.auth?.token)
  const resStatus = useSelector(state => state?.payout?.resStatus)
  const resMessage = useSelector(state => state?.payout?.resMessage)
  const getUrlLink = useSelector(state => state?.url?.getUrl)
  const searchProp = props?.search
  const previousProps = useRef({ payoutList, resStatus, resMessage, searchProp, start, offset })?.current
  const paginationFlag = useRef(false)
  const obj = qs?.parse(location?.search)

  useEffect(() => {
    if (location?.state) {
      if (location?.state?.message) {
        setMessage(location?.state?.message)
        setStatus(true)
        setModalMessage(true)
      }
      navigate(location.pathname, { replace: true })
    }
    let page = 1
    let limit = offset
    let orderBy = 'asc'
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
    }
    dispatch(getUrl('media'))
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, orderBy, search)
    setLoading(true)
  }, [])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  // to set payout list
  useEffect(() => {
    if (previousProps?.payoutList !== payoutList) {
      if (payoutList) {
        if (payoutList?.results) {
          const userArrLength = payoutList?.results?.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(payoutList?.results || [])
        setIndex(activePageNo)
        setTotal(payoutList?.total || 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.payoutList = payoutList
    }
  }, [payoutList])

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
      ? data = { PayoutManagement: location?.search }
      : data.PayoutManagement = location?.search
    localStorage?.setItem('queryParams', JSON?.stringify(data))
  }, [location?.search])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props?.search)
      setSearch(searchProp?.trim())
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
    const statuss = !selectedData.bEnable
    const updatedPaymentData = {
      title: selectedData?.sTitle,
      type: selectedData?.eType,
      key: selectedData?.eKey,
      withdrawFee: selectedData?.nWithdrawFee,
      minAmount: selectedData?.nMinAmount,
      maxAmount: selectedData?.nMaxAmount,
      payoutImage: selectedData?.sImage,
      payoutStatus: statuss,
      info: selectedData?.sInfo,
      token,
      payoutId: selectedData?._id
    }
    dispatch(updatePayout(updatedPaymentData))
    setLoading(true)
    toggleWarning()
  }

  // Export Excel Report List
  const processExcelExportData = data => data?.map((payoutMethods) => {
    let bEnable = payoutMethods?.bEnable
    const nMinAmount = payoutMethods?.nMinAmount || 0
    const nMaxAmount = payoutMethods?.nMaxAmount || 0
    const nWithdrawFee = payoutMethods?.nWithdrawFee || 0
    bEnable = bEnable ? 'Active' : 'InActive'
    return {
      ...payoutMethods,
      nWithdrawFee,
      nMinAmount,
      nMaxAmount,
      bEnable
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(list), fileName: 'PayoutList.xlsx' }
      exporter?.current?.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      <ExcelExport ref={exporter} data={list} fileName="PayoutList.xlsx">
        <ExcelExportColumn field="bEnable" title="Status" />
        <ExcelExportColumn field="sTitle" title="Title" />
        <ExcelExportColumn field="eType" title="Type" />
        <ExcelExportColumn field="eKey" title="Key" />
        <ExcelExportColumn field="nMinAmount" title="Min" />
        <ExcelExportColumn field="nMaxAmount" title="Max" />
        <ExcelExportColumn field="nWithdrawFee" title="Withdraw Fee" />
        <ExcelExportColumn field="sInfo" title="Info" />
      </ExcelExport>

      <div className='d-flex justify-content-between flex-wrap pr-4 pl-4 mt-4'>
        <Row className='reports-heading'>
          <Button tag={Link} className={classNames('payment-combine', { active: location && ((location?.pathname === '/settings/payment-management')) })} to='/settings/payment-management'>
            Payment Gateways
          </Button>
          <Button tag={Link} className={classNames('payment-combine', { 'payment-combine-active': location && ((location?.pathname === '/settings/payout-management')) })}>
            Payout Gateways
          </Button>
        </Row>
      </div>
      {
      !loading && list?.length === 0
        ? (<DataNotFound message="Payout Method List" obj={obj}/>)
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
                    <th>Title</th>
                    <th>Key</th>
                    <th>Type</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Withdraw Fee</th>
                    <th>Info</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={11} />
                    : (
                      <Fragment>
                        {
                  list && list?.length !== 0 && list?.map((data, i) => (
                    <tr key={data?._id}>
                      <td>{(((index - 1) * offset) + (i + 1))}</td>
                      <td>
                        <CustomInput checked={data?.bEnable}
                          disabled={adminPermission?.PAYOUT_OPTION === 'R'}
                          id={'switch' + (i + 1)}
                          name={'switch' + (i + 1)}
                          onClick={() => warningWithConfirmMessage(data, data?.bEnable ? 'Inactivate' : 'Activate')}
                          type="switch"
                        />
                      </td>
                      <td>
                        {data?.sImage
                          ? <img alt="payout" className="theme-image" src={url + data?.sImage} />
                          : <img alt="No Image" className='theme-image-offer' src={noImage}/>
                            }
                      </td>
                      <td>{data?.sTitle || '-'}</td>
                      <td>{data?.eKey || '-'}</td>
                      <td>{data?.eType || '-'}</td>
                      <td>{data?.nMinAmount || '--'}</td>
                      <td>{data?.nMaxAmount || '--'}</td>
                      <td>{data?.nWithdrawFee || '--'}</td>
                      <td>{data?.sInfo || '-'}</td>
                      <td>
                        <ul className="action-list mb-0 d-flex">
                          <li>
                            <NavLink className="view" color="link" to={'/settings/payout-details/' + data?._id}>
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

PayoutComponent.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  getList: PropTypes.func,
  payoutList: PropTypes.object,
  search: PropTypes.string,
  flag: PropTypes.bool
}

PayoutComponent.displayName = PayoutComponent

export default connect(null, null, null, { forwardRef: true })(PayoutComponent)
