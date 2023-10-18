import React, { Fragment, useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Button, FormGroup, Modal, ModalBody, Row, Col, Form, Label, CustomInput, ModalHeader, Badge } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ReactJson from 'react-json-view'
import qs from 'query-string'
import moment from 'moment'
import PropTypes from 'prop-types'

import rightIcon from '../../../assets/images/right-icon.svg'
import wrongIcon from '../../../assets/images/wrong-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'
import viewButton from '../../../assets/images/view-eye.svg'

import PaginationComponent from '../../../components/PaginationComponent'
import Loading from '../../../components/Loading'
import SkeletonTable from '../../../components/SkeletonTable'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'

import { modalMessageFunc } from '../../../helpers/helper'
import { apiLogsTransaction } from '../../../actions/apilogs'
import { updatePaymentStatus } from '../../../actions/deposit'

const DepositManagement = forwardRef((props, ref) => {
  const {
    getList,
    List,
    flag,
    startDate,
    endDate,
    getDepositsTotalCountFunc
  } = props
  const navigate = useNavigate()
  const location = useLocation()
  const exporter = useRef(null)
  const search = props.search
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
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order] = useQueryState('order', 'desc')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [searchValue, setSearchValue] = useQueryState('searchValue', '')
  const [paymentStatus] = useQueryState('status', '')
  const [depositPaymentMethod] = useQueryState('method', '')
  const [listLength, setListLength] = useState('10 Rows')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalMessage2, setModalMessage2] = useState(false)
  const [logModal, setLogModal] = useState(false)
  const [depositPaymentStatus, setDepositPaymentStatus] = useState('')
  const [UserID, setUserID] = useState('')

  const dispatch = useDispatch('')
  const token = useSelector(state => state.auth.token)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const toggleLogModal = () => setLogModal(!logModal)
  const depositsTotalCount = useSelector(state => state.deposit.depositsTotalCount)
  const resStatus = useSelector(state => state.deposit.resStatus)
  const resMessage = useSelector(state => state.deposit.resMessage)
  const isFullList = useSelector(state => state.deposit.isFullResponse)
  const logsData = useSelector(state => state.apilogs.logs)
  // eslint-disable-next-line no-unused-vars
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const obj = qs.parse(location.search)
  const previousProps = useRef({
    resStatus, resMessage, List, paymentStatus, depositPaymentMethod, search, startDate, endDate, start, offset, depositsTotalCount
  }).current
  const paginationFlag = useRef(false)

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
    let searchData = searchValue
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
      if (obj.searchValue) {
        searchData = obj.searchValue
        setSearchValue(searchData)
      }
      if (!(obj.datefrom && obj.dateto)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
        getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
      }
    }
    setLoading(true)
  }, [])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
      getDepositsTotalCountFunc(props.search, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
      setSearchValue(search.trim())
      setStart(startFrom)
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.search !== search && flag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.search = search
      }
    }
    return () => {
      previousProps.search = search
    }
  }, [search])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // useEffect to set exporting Report and list
  useEffect(() => {
    if (previousProps.List !== List) {
      if (List && List.rows && !isFullList) {
        const userArrLength = List.rows.length
        const startFrom = ((activePageNo - 1) * offset) + 1
        const end = (startFrom - 1) + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
        setList(List.rows)
      } else if (depositsTotalCount?.count === List?.rows?.length && isFullList) {
        setFullList(List.rows ? List.rows : [])
        setLoading(false)
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(List.rows ? List.rows : []),
          fileName: 'Deposits.xlsx'
        }
        exporter.current.save()
        setLoader(false)
      }
      setLoading(false)
    }
    if (previousProps.depositsTotalCount !== depositsTotalCount && depositsTotalCount) {
      setTotal(depositsTotalCount?.count ? depositsTotalCount?.count : 0)
    }
    return () => {
      previousProps.List = List
      previousProps.depositsTotalCount = depositsTotalCount
    }
  }, [List, depositsTotalCount])

  // useEffect to set DepositPaymentMethod
  useEffect(() => {
    if (previousProps.depositPaymentMethod !== depositPaymentMethod) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
      getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
      setPageNo(1)
    }
    return () => {
      previousProps.depositPaymentMethod = depositPaymentMethod
    }
  }, [depositPaymentMethod])

  // useEffect to handle resMessage
  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
          getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
          setPageNo(1)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // useEffect will be call when startDate and endDate change
  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        getList(startFrom, limit, sort, order, searchValue, paymentStatus, depositPaymentMethod, props.startDate, props.endDate, isFullResponse)
        getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, props.startDate, props.endDate, isFullResponse)
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
        getList(startFrom, limit, sort, order, searchValue, paymentStatus, depositPaymentMethod, props.startDate, props.endDate, isFullResponse)
        getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, props.startDate, props.endDate, isFullResponse)
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

  // useEffect set to payment status
  useEffect(() => {
    if (previousProps.paymentStatus !== paymentStatus) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
      getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
      setPageNo(1)
    }
    return () => {
      previousProps.paymentStatus = paymentStatus
    }
  }, [paymentStatus])

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current && start) {
      getList(start, offset, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      getList(start, offset, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
      getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
      setLoading(true)
    } else if (((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current)) {
      getList(0, offset, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function Completed () {
    setModalMessage2(false)
  }

  function warningWithConfirmMessage (PaymentStatus, id) {
    setDepositPaymentStatus(PaymentStatus)
    setUserID(id)
    setModalWarning(true)
  }

  function onStatusUpdate () {
    const Status = depositPaymentStatus === 'Approve' ? 'S' : depositPaymentStatus === 'Reject' ? 'C' : ''
    dispatch(updatePaymentStatus(Status, UserID, token))
    setLoading(true)
  }

  function onCancel () {
    toggleWarning()
  }

  const processExcelExportData = data => data.map((depositsList) => {
    let ePaymentStatus = depositsList.ePaymentStatus
    ePaymentStatus = ePaymentStatus === 'C' ? 'Cancelled' : ePaymentStatus === 'P' ? 'Pending' : ePaymentStatus === 'R' ? 'Refunded' : ePaymentStatus === 'S' ? 'Success' : '--'
    const sEmail = depositsList.sEmail || '--'
    let sPromocode = depositsList.sPromocode
    sPromocode = sPromocode || '--'
    const iTransactionId = depositsList.iTransactionId || '--'
    let depositDate = moment(depositsList.dUpdatedAt).local().format('ll')
    depositDate = depositDate === 'Invalid date' ? ' - ' : depositDate
    let depositTime = moment(depositsList.dUpdatedAt).local().format('LT')
    depositTime = depositTime === 'Invalid date' ? ' - ' : depositTime
    let sInfo = depositsList.sInfo
    sInfo = sInfo || '--'
    return {
      ...depositsList,
      ePaymentStatus,
      sEmail,
      sPromocode,
      iTransactionId,
      depositDate,
      depositTime,
      sInfo
    }
  })

  async function onExport () {
    if (startDate && endDate) {
      await getList(start, offset, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, true)
      getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, true)
      setLoader(true)
    } else {
      setMessage('Please Select Date Range')
      setModalMessage(true)
      setStatus(false)
    }
  }

  function onRefresh () {
    // const startFrom = 0
    getList(start, offset, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
    getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
    setLoading(true)
    setPageNo(activePageNo)
  }

  function setModalOpenFunc (data) {
    setLogModal(true)
    dispatch(apiLogsTransaction(data?.id, 'D', token))
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
        data={fullList && fullList.count > 0 ? fullList : list}
        fileName={(startDate && endDate) ? `Deposits (${moment(startDate).format('MMMM Do YYYY, h-mm-ss a')} - ${moment(endDate).format('MMMM Do YYYY, h-mm-ss a')}).xlsx` : 'Deposits.xlsx'}
      >
        <ExcelExportColumn field="ePaymentStatus" title="Payment Status" />
        <ExcelExportColumn field="sUsername" title="Username" />
        <ExcelExportColumn field="sEmail" title="Email" />
        <ExcelExportColumn field="sMobNum" title="Mobile No" />
        <ExcelExportColumn field="nAmount" title="Amount" />
        <ExcelExportColumn field="sPromocode" title="Promocode" />
        <ExcelExportColumn field="iTransactionId" title="Reference Id" />
        <ExcelExportColumn field="depositDate" title="Deposit Date" />
        <ExcelExportColumn field="depositTime" title="Deposit Time" />
        <ExcelExportColumn field="ePaymentGateway" title="Payment Gateway" />
        <ExcelExportColumn field="sInfo" title="Info" />
        <ExcelExportColumn field="id" title="Transaction Id" />
        <ExcelExportColumn field="nBonus" title="Bonus" />
        <ExcelExportColumn field="nCash" title="Cash" />
      </ExcelExport>
      {loader && <Loading />}
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="Deposit List" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="deposit-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Status</th>
                    <th>Username</th>
                    <th>Mobile No.</th>
                    <th>
                      Amount
                      <br />
                      (Cash + Bonus)
                    </th>
                    <th>Promo Code</th>
                    <th>Deposit Date</th>
                    <th> Gateway Info</th>
                    <th width="25%" className='whitespace-normal'>Info</th>
                    <th>Logs</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={11} />
                    : (
                      <Fragment>
                        {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr key={i}>
                        <td>{data.id}</td>
                        <td>
                          {data.ePaymentStatus === 'C'
                            ? (
                              <Badge className='match-status-cancl'>
                                Cancelled
                              </Badge>
                              )
                            : (
                                ''
                              )}
                          {data.ePaymentStatus === 'P'
                            ? (
                              <Badge className='match-status-p '>
                                Pending
                              </Badge>
                              )
                            : (
                                ''
                              )}
                          {data.ePaymentStatus === 'R'
                            ? (
                              <Badge className='match-status-r '>
                                Refunded
                              </Badge>
                              )
                            : (
                                ''
                              )}
                          {data.ePaymentStatus === 'S'
                            ? (
                              <Badge className='match-status-cmp '>
                                Success
                              </Badge>
                              )
                            : (
                                ''
                              )}
                        </td>

                        {(adminPermission && adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS === 'N' && data.eUserType === 'U')
                          ? <td><Button className='total-text-link' color="link" tag={Link} to={`/users/user-management/user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                          : (adminPermission && adminPermission.USERS === 'N' && adminPermission.SYSTEM_USERS !== 'N' && data.eUserType !== 'U')
                              ? <td><Button className='total-text-link' color="link" tag={Link} to={`/users/system-user/system-user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                              : (adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N'))
                                  ? <td><Button className='total-text-link' color="link" tag={Link} to={data.eUserType === 'U' ? `/users/user-management/user-details/${data.iUserId}` : `/users/system-user/system-user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                                  : <td>{data.sUsername || '--'}</td>}

                        <td>{data.sMobNum || '--'}</td>
                        <td>
                          {data.nAmount ? data.nAmount : '--'}
                          <br />
                          (
                          {data.nCash ? data.nCash : 0}
                          {' '}
                          +
                          {' '}
                          {data.nBonus ? data.nBonus : 0}
                          )
                        </td>
                        <td>{data.sPromocode || '--'}</td>
                        <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD-MM-YYYY') : '--'}</td>
                        <td>{data.ePaymentGateway ? data.ePaymentGateway : '--'}</td>
                        <td width="25%">
                          {data.ePaymentGateway === 'CASHFREE' ? `Deposit from CASHFREE TransactionId : ${data.iTransactionId ? data.iTransactionId : 'NA'}` : data.sInfo ? data.sInfo : '--'}
                          {data.iOrderId && <p className='mb-0'>{data.iOrderId ? `Order Id : ${data.iOrderId}` : '--'}</p>}
                        </td>
                        <td>
                          <ul className='action-list mb-0 d-flex'>
                            <li>
                              <Button color='link' onClick={() => setModalOpenFunc(data)}>
                                <Button className='view-btn-icon'>
                                  <img alt="View" src={viewButton} />
                                </Button>
                              </Button>
                            </li>
                          </ul>
                        </td>
                        {data.ePaymentStatus === 'P'
                          ? (
                            <td className='action-list-btn'>
                              <Button className="success-btn" color="link" disabled={adminPermission?.DEPOSIT === 'R'} onClick={() => warningWithConfirmMessage('Approve', data.id)}>
                                <img alt="Approve" src={rightIcon} />
                                <span>Approve</span>
                              </Button>
                              <Button className="danger-btn" color="link" disabled={adminPermission?.DEPOSIT === 'R'} onClick={() => warningWithConfirmMessage('Reject', data.id)}>
                                <img alt="Reject" src={wrongIcon} />
                                <span>Reject</span>
                              </Button>
                            </td>
                            )
                          : data.ePaymentStatus === 'S' ? <td style={{ color: 'green' }}>Approved</td> : data.ePaymentStatus === 'C' ? <td style={{ color: 'red' }}>Cancelled</td> : data.ePaymentStatus === 'R' ? <td style={{ color: 'blue' }}>Refunded</td> : ''}
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

      <Modal isOpen={modalMessage2}>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <FormGroup row>
                  <Label for="exampleEmail" sm={2}>Email</Label>
                  <CustomInput id="exampleEmail" name="email" placeholder="with a placeholder" type="email" />
                </FormGroup>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button className="theme-btn success-btn full-btn" data-dismiss="modal" onClick={Completed} type="button">Confirm</Button>
            </Col>
            <Col>
              <Button
                className="theme-btn danger-btn full-btn"
                data-dismiss="modal"
                onClick={() => setModalMessage2(false)}
                type="button"
              >
                Close
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal className="modal-confirm" isOpen={modalWarning} toggle={toggleWarning}>
        <ModalBody className="text-center">
          <img alt="check" className="info-icon" src={warningIcon} />
          <h2 className='popup-modal-message'>{`Are you sure you want to ${depositPaymentStatus} it?`}</h2>
          <Row className="row-12">
            <Col>
              <Button className="theme-btn outline-btn-cancel full-btn-cancel" onClick={onCancel} type="submit">Cancel</Button>
            </Col>
            <Col>
              <Button className="theme-btn danger-btn full-btn" onClick={onStatusUpdate} type="submit">{`${depositPaymentStatus} It`}</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal className='deposit-modal-content' isOpen={logModal} toggle={toggleLogModal}>
        <ModalHeader toggle={toggleLogModal}>Transaction Log Details</ModalHeader>
        <ModalBody>
          <ReactJson collapsed={3} displayDataTypes={false} displayObjectSize={false} name='data' src={logsData} />
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

DepositManagement.propTypes = {
  getList: PropTypes.func,
  List: PropTypes.object,
  flag: PropTypes.bool,
  search: PropTypes.string,
  searchBox: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  openDatePicker: PropTypes.bool,
  handle: PropTypes.func,
  getDepositsTotalCountFunc: PropTypes.func
}

DepositManagement.displayName = DepositManagement

export default DepositManagement
