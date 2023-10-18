import React, { Fragment, useState, useEffect, useRef, forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, FormGroup, Label, Input, CustomInput, Modal, ModalHeader, ModalBody, Row, Col } from 'reactstrap'
import { useQueryState } from 'react-router-use-location-state'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import calenderIcon from '../../../assets/images/calendar.svg'
import editButton from '../../../assets/images/edit-pen-icon.svg'
import deleteIcon from '../../../assets/images/delete-bin-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'
import sortIcon from '../../../assets/images/sort-icon.svg'

import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import Loading from '../../../components/Loading'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import RequiredField from '../../../components/RequiredField'

import { modalMessageFunc, verifyLength, withInitialSpace } from '../../../helpers/helper'
import { AddTimeNoti, deleteNotification, TypeList } from '../../../actions/notification'

function NotificationContent (props) {
  const { modalOpen, setModalOpen, getList, startDate, endDate, notificationType } = props
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const searchProp = props.search
  const [list, setList] = useState([])
  const [notificationTypeList, setNotificationTypeList] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [Title, setTitle] = useState('')
  const [titleErr, setTitleErr] = useState('')
  const [Message, setmessage] = useState('')
  const [Type, setType] = useState('')
  const [typeErr, setTypeErr] = useState('')
  const [messageErr, setMessageErr] = useState('')
  const [expireDate, setExpireDate] = useState('')
  const [expireDateErr, setExpireDateErr] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [start, setStart] = useState(0)
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [search, setSearch] = useQueryState('search', '')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [listLength, setListLength] = useState('10 Rows')
  const [order, setOrder] = useQueryState('order', 'des')
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')

  const typesList = useSelector(state => state?.notification?.typeList)
  const notificationList = useSelector(state => state?.notification?.notificationsList)
  const resStatus = useSelector(state => state?.notification?.resStatus)
  const resMessage = useSelector(state => state.notification.resMessage)
  const token = useSelector(state => state?.auth?.token)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const previousProps = useRef({ resStatus, resMessage, notificationList, notificationType, startDate, endDate, searchProp, start, offset })?.current
  const toggleModal = () => setModalOpen(!modalOpen)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const paginationFlag = useRef(false)
  const obj = qs.parse(location.search)

  useEffect(() => {
    if (location.state) {
      setModalMessage(true)
      setMessage(location?.state?.message)
      setStatus(true)
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
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, order, search, notificationType, dateFrom, dateTo, token)
    dispatch(TypeList(token))
    setLoading(true)
  }, [])

  // to handle query params
  useEffect(() => {
    let data = localStorage?.getItem('queryParams') ? JSON?.parse(localStorage?.getItem('queryParams')) : {}
    !Object?.keys(data)?.length
      ? data = {
        NotificationManagement: location.search
      }
      : data.NotificationManagement = location.search
    localStorage?.setItem('queryParams', JSON?.stringify(data))
  }, [location?.search])

  // to set Notification List
  useEffect(() => {
    if (previousProps?.notificationList !== notificationList) {
      if (notificationList && notificationList?.results) {
        if (notificationList?.results) {
          const userArrLength = notificationList?.results?.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(notificationList?.results || [])
        setIndex(activePageNo)
        setTotal(notificationList?.total ? notificationList?.total : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.notificationList = notificationList
    }
  }, [notificationList])

  // to set notification type list
  useEffect(() => {
    if (typesList) {
      if (typesList && typesList?.length !== 0) {
        setNotificationTypeList(typesList)
      }
    }
  }, [typesList])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          if (list?.length === 1 && deleteId) {
            setDeleteId('')
            const startFrom = 0
            const limit = offset
            getList(startFrom, limit, sort, order, search, notificationType, dateFrom, dateTo, token)
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(1)
          } else {
            const startFrom = (activePageNo - 1) * offset
            const limit = offset
            getList(startFrom, limit, sort, order, search, notificationType, dateFrom, dateTo, token)
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

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // to get notificationType list
  useEffect(() => {
    if (previousProps?.notificationType !== notificationType) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, notificationType, dateFrom, dateTo, token)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.notificationType = notificationType
    }
  }, [notificationType])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, notificationType, dateFrom, dateTo, token)
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

  // will be called when change startDate and endDate
  useEffect(() => {
    if (previousProps?.startDate !== startDate || previousProps?.endDate !== endDate) {
      if (props?.startDate && props?.endDate) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, props?.search, notificationType, props?.startDate, props?.endDate, token)
        setDateFrom(moment(props?.startDate)?.format('MM-DD-YYYY'))
        setDateTo(moment(props?.endDate)?.format('MM-DD-YYYY'))
        setPageNo(1)
        setLoading(true)
      } else if ((!props?.startDate) && (!props.endDate)) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, props?.search, notificationType, props?.startDate, props?.endDate, token)
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
      getList(start, offset, sort, order, search, notificationType, dateFrom, dateTo, token)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  // forset ascending/decending operation
  function onSorting (sortingBy) {
    setSort(sortingBy)
    if (order === 'desc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', search, notificationType, dateFrom, dateTo, token)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', search, notificationType, dateFrom, dateTo, token)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
    }
  }
  // forhandle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'Title':
        if (!event?.target?.value) {
          setTitleErr('Required field')
        } else if (event?.target?.value?.trimStart()?.length === 0) {
          setTitleErr('No initial space should be allowed')
        } else {
          setTitleErr('')
        }
        setTitle(event?.target?.value?.trimStart())
        break
      case 'Message':
        if (!event?.target?.value) {
          setMessageErr('Required field')
        } else if (event?.target?.value?.trimStart()?.length === 0) {
          setMessageErr('No initial space should be allowed')
        } else {
          setMessageErr('')
        }
        setmessage(event?.target?.value?.trimStart())
        break
      case 'Type':
        if (!event?.target?.value) {
          setTypeErr('Required field')
        } else {
          setTypeErr('')
        }
        setType(event?.target?.value)
        break
      case 'ExpiryDate':
        if (verifyLength(moment(event)?.format('DD/MM/YYYY hh:mm:ss A'), 1)) {
          setExpireDateErr('')
        } else {
          setExpireDateErr('Required field')
        }
        setExpireDate(event)
        break
      default:
        break
    }
  }

  // forvalidate the field  and dispatch actions
  function AddNotification () {
    if (withInitialSpace(Title) && verifyLength(Title, 1) && withInitialSpace(Message) && verifyLength(Message, 1) && Type && expireDate && !expireDateErr && !titleErr && !messageErr) {
      dispatch(AddTimeNoti(Title, Message, Type, expireDate, token))
      toggleModal()
      setLoading(true)
      setTitle('')
      setmessage('')
      setExpireDate('')
      setType('')
    } else {
      if (!verifyLength(Title, 1)) {
        setTitleErr('Required field')
      } else if (withInitialSpace(Title)) {
        setTitleErr('No Initial space should be allowed')
      }
      if (!verifyLength(Message, 1)) {
        setMessageErr('Required field')
      } else if (withInitialSpace(Message)) {
        setMessageErr('No Initial space should be allowed')
      }
      if (!verifyLength(Type, 1)) {
        setTypeErr('Required field')
      }
      if (!expireDate) {
        setExpireDateErr('Required field')
      }
    }
  }

  // to check and disable past date
  function filterPassedTime (time) {
    const currentDate = new Date()
    const date = new Date(time)
    return currentDate?.getTime() < date?.getTime()
  }

  function checkDate (date) {
    return moment(date)?.isBefore(new Date(), 'h:mm aa')
  }

  function warningWithDeleteMessage (Id, eType) {
    setType(eType)
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onDelete () {
    dispatch(deleteNotification(deleteId, token))
    setLoading(true)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className={expireDateErr ? 'form-control date-range-notify league-placeholder-error' : 'form-control date-range-notify'} onClick={onClick}>
      <img src={calenderIcon} />
      <Input ref={ref} className='date-input range' placeholder='Select Expiry Date' readOnly type="text" value={value} />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  return (
    <Fragment>
      {loading && <Loading />}
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />

      <Modal className='notification-modal' isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Notification</ModalHeader>
        <ModalBody>
          <Form>
            <Row >
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting' for="title">
                    Title
                    {' '}
                    <RequiredField/>
                  </Label>
                  <Input className={titleErr ? 'league-placeholder-error ' : 'league-placeholder'} disabled={adminPermission?.NOTIFICATION === 'R'} name="title" onChange={event => handleChange(event, 'Title')} placeholder="Title" value={Title} />
                  <p className="error-text">{titleErr}</p>
                </FormGroup>
              </Col>
            </Row>

            <Row className='mt-3'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting' for="message">
                    Message
                    {' '}
                    <RequiredField/>
                  </Label>
                  <Input className={messageErr ? 'league-placeholder-error ' : 'read-only-class'} disabled={adminPermission?.NOTIFICATION === 'R'} name="message" onChange={event => handleChange(event, 'Message')} placeholder="Message" type="textarea" value={Message} />
                  <p className="error-text">{messageErr}</p>
                </FormGroup>
              </Col>
            </Row>

            <Row className='mt-3'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting' for="expireDate">
                    Expiry Date & Time
                    {' '}
                    <RequiredField/>
                  </Label>
                  <br/>
                  <DatePicker
                    className={expireDateErr ? 'league-placeholder-error ' : 'league-placeholder'}
                    customInput={<ExampleCustomInput />}
                    dateFormat="dd-MM-yyyy h:mm aa"
                    filterTime={filterPassedTime}
                    minDate={new Date()}
                    onChange={(date) => {
                      if (checkDate(date)) {
                        handleChange(new Date(moment()?.add(30, 'minute')?.format()), 'ExpiryDate')
                      } else {
                        handleChange(date, 'ExpiryDate')
                      }
                    }}
                    selected={expireDate}
                    showTimeSelect
                    timeIntervals={15}
                    value={expireDate}
                  />
                  <p className="error-text">{expireDateErr}</p>
                </FormGroup>
              </Col>
            </Row>

            <Row className='mt-3'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting' for="type">
                    Type
                    {' '}
                    <RequiredField/>
                  </Label>
                  <CustomInput className={typeErr ? 'league-placeholder-error ' : 'form-control'} disabled={adminPermission?.NOTIFICATION === 'R'} name="type" onChange={event => handleChange(event, 'Type')} type="select" value={Type}>
                    <option value=''>Select notification type</option>
                    {
                     notificationTypeList && notificationTypeList?.length !== 0 && notificationTypeList?.map((data) => {
                       return (
                         <option key={data?._id} value={data?._id}>{data?.sHeading}</option>
                       )
                     })
                    }
                  </CustomInput>
                  <p className="error-text">{typeErr}</p>
                </FormGroup>
              </Col>
            </Row>
            {
                ((Auth && Auth === 'SUPER') || (adminPermission?.NOTIFICATION !== 'R')) &&
                (
                <Row className='mt-4'>
                  <Col md={12} xl={12}>
                    <Fragment>
                      <Button className="theme-btn full-btn" onClick={AddNotification}>
                        Send Notification
                      </Button>
                    </Fragment>
                  </Col>
                </Row>
                )
            }
          </Form>
        </ModalBody>
      </Modal>
      {
      !loading && list?.length === 0
        ? (<DataNotFound message="Notifications" obj={obj}/>)
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="common-rule-table-notification">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Title</th>
                    <th>Message</th>
                    <th>Type</th>
                    <th className='table_sortIcon'>
                      <ul>
                        <li>
                          <span className="d-inline-block align-middle">Expiry Date & Time</span>
                          <Button className="sort-btn" color="link" onClick={() => onSorting('dExpTime')}><img alt="sorting" className="m-0" src={sortIcon} /></Button>
                        </li>
                      </ul>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={6} />
                    : (
                      <Fragment>
                        {list?.length !== 0 && list.map((data, i) => {
                          const type = (typesList?.length > 0 && data?.iType) && typesList?.find(d => d?._id === data?.iType)
                          return (
                            <tr key={data?._id}>
                              <td>{(((index - 1) * offset) + (i + 1))}</td>
                              <td>{data?.sTitle || '--'}</td>
                              <td>{data?.sMessage || '-- '}</td>
                              <td>{type?.sHeading || '--'}</td>
                              <td>{data?.dExpTime ? moment(data?.dExpTime)?.format('DD/MM/YYYY hh:mm A') : '--'}</td>
                              <td>
                                <ul className="action-list mb-0 d-flex">
                                  <li>
                                    <Link className="view" to={`/settings/notification-details/${data?._id}`}>
                                      <Button className='edit-btn-icon'>
                                        <img alt="View" src={editButton} />
                                      </Button>
                                    </Link>
                                  </li>
                                  {((Auth && Auth === 'SUPER') || (adminPermission?.NOTIFICATION !== 'R')) &&
                              (
                              <Fragment>
                                <li>
                                  <Button className="delete" color="link" onClick={() => warningWithDeleteMessage(data?._id, 'delete')}>
                                    <Button className='delete-btn-icon'>
                                      <img alt="Delete" src={deleteIcon} />
                                    </Button>
                                  </Button>
                                </li>
                              </Fragment>
                              )}
                                </ul>
                              </td>
                            </tr>
                          )
                        })
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

      <Modal className="modal-confirm" isOpen={modalWarning} toggle={toggleWarning}>
        <ModalBody className='text-center'>
          <img alt='check' className='info-icon' src={warningIcon} />
          <h2 className='popup-modal-message'>Are you sure you want to delete it?</h2>
          <Row className='row-12'>
            <Col>
              <Button
                className="theme-btn outline-btn-cancel full-btn-cancel"
                onClick={onCancel}
                type='submit'
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                className='theme-btn danger-btn full-btn'
                onClick={onDelete}
                type='submit'
              >
                Delete It
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

NotificationContent.propTypes = {
  list: PropTypes.array,
  viewLink: PropTypes.string,
  resStatus: PropTypes.bool,
  resMessage: PropTypes.string,
  value: PropTypes.string,
  onClick: PropTypes.func,
  modalOpen: PropTypes.bool,
  setModalOpen: PropTypes.func,
  getList: PropTypes.func,
  location: PropTypes.object,
  search: PropTypes.string,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  history: PropTypes.object,
  flag: PropTypes.bool,
  notificationType: PropTypes.string
}

export default NotificationContent
