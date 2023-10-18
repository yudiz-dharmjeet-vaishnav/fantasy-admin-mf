import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormGroup, Input, Label, CustomInput, Button, Modal, ModalBody, ModalHeader, Form, Row, Col } from 'reactstrap'
import { modalMessageFunc, verifyLength } from '../../../helpers/helper'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import calender from '../../../assets/images/calendar.svg'
import sortIcon from '../../../assets/images/sort-icon.svg'

import Loading from '../../../components/Loading'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import SkeletonTable from '../../../components/SkeletonTable'
import RequiredField from '../../../components/RequiredField'
import PaginationComponent from '../../../components/PaginationComponent'

import { AddPushNotification } from '../../../actions/pushnotification'

const PushNotificationContent = forwardRef((props, ref) => {
  const { List, getList, flag, startDate, endDate, modalOpen, setModalOpen } = props
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const searchProp = props.search
  const [list, setList] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [Type, setType] = useState('All')
  const [scheduleTime, setScheduleTime] = useState('')
  const [errTitle, setErrTitle] = useState('')
  const [errDescription, setErrDescription] = useState('')
  const [errType, setErrType] = useState('')
  const [errExpDate, setErrExpDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [close, setClose] = useState(false)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [start, setStart] = useState(0)
  const [index, setIndex] = useState(1)
  const [total, setTotal] = useState(0)
  const [listLength, setListLength] = useState('10 Rows')
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [search, setSearch] = useQueryState('search', '')
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [sPlatform, setsPlatform] = useQueryState('platform', '')
  const [order, setOrder] = useQueryState('orderby', 'desc')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  const [dateTo, setDateTo] = useQueryState('dateto', '')

  const paginationFlag = useRef(false)
  const notificationList = useSelector(state => state.pushNotification.pushNotificationList)
  const isUpdateNotification = useSelector(state => state.pushNotification.isUpdateNotification)
  const resMessage = useSelector(state => state.pushNotification.resMessage)
  const resStatus = useSelector(state => state.pushNotification.resStatus)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector(state => state.auth.token)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const toggleModal = () => setModalOpen(!modalOpen)

  const obj = qs.parse(location.search)

  const previousProps = useRef({
    resStatus, resMessage, notificationList, isUpdateNotification, offset, List, startDate, endDate, activePageNo, sPlatform
  }).current

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
    let searchText = ''
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
      if (obj.search) {
        searchText = obj.search
        setSearch(obj.search)
      }
      if (!(obj.datefrom && obj.dateto)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, sort, searchText, dateFrom, dateTo, sPlatform, order)
      }
    }
    setLoading(true)
  }, [])

  // handle query params
  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    !Object.keys(data).length
      ? data = {
        PushNotificationManagement: location.search
      }
      : data.PushNotificationManagement = location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [location.search])

  // handle notification list
  useEffect(() => {
    if (previousProps.notificationList !== notificationList) {
      if (notificationList && notificationList.results) {
        if (notificationList.results) {
          const userArrLength = notificationList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(notificationList.results || [])
        setIndex(activePageNo)
        setTotal(notificationList.total ? notificationList.total : 0)
        setLoading(false)
      }
    }
    return () => {
      previousProps.notificationList = notificationList
    }
  }, [notificationList])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      setLoading(false)
      if (resMessage) {
        setMessage(resMessage)
        if (resStatus) {
          const startFrom = (activePageNo - 1) * offset
          const limit = offset
          getList(startFrom, limit, sort, search, dateFrom, dateTo, sPlatform, order)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(activePageNo)
        } else {
          setStatus(resStatus)
          setModalMessage(true)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
      previousProps.resStatus = resStatus
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, searchProp, dateFrom, dateTo, sPlatform, order)
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

  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        getList(startFrom, limit, sort, search, props.startDate, props.endDate, sPlatform, order)
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
        getList(startFrom, limit, sort, search, props.startDate, props.endDate, sPlatform, order)
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
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, sort, search, dateFrom, dateTo, sPlatform, order)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  useEffect(() => {
    if (previousProps.sPlatform !== sPlatform) {
      setsPlatform(sPlatform)
      getList(start, offset, sort, search, dateFrom, dateTo, sPlatform, order)
    }
    return () => {
      previousProps.sPlatform = sPlatform
    }
  }, [sPlatform])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  function handleChange (event, type) {
    switch (type) {
      case 'title':
        if (verifyLength(event.target.value, 1)) {
          setErrTitle('')
        } else {
          setErrTitle('Required field')
        }
        setTitle(event.target.value)
        break
      case 'description':
        if (verifyLength(event.target.value, 1)) {
          setErrDescription('')
        } else {
          setErrDescription('Required field')
        }
        setDescription(event.target.value)
        break
      case 'Type':
        if (verifyLength(event.target.value, 1)) {
          setErrType('')
        } else {
          setErrType('Required field')
        }
        setType(event.target.value)
        break
      case 'scheduleTime':
        if (verifyLength(moment(event).format('DD/MM/YYYY hh:mm:ss A'), 1)) {
          setErrExpDate('')
        } else {
          setErrExpDate('Required field')
        }
        if (moment(event._d).isBefore(moment())) {
          setErrExpDate('Date should be future date')
        }
        setScheduleTime(event)
        break
      default:
        break
    }
  }

  function onAdd (e) {
    e.preventDefault()
    if (verifyLength(title, 1) && verifyLength(description, 1) && verifyLength(Type, 1) && scheduleTime && !errTitle && !errDescription && !errType && !errExpDate) {
      const date = new Date(moment(scheduleTime).format())
      const hour = moment(scheduleTime).hours()
      const minutes = moment(scheduleTime).minutes()
      const seconds = moment(scheduleTime).seconds()
      const pushNotificationData = {
        title, description, Type, date: new Date(date).toISOString(), hour, minutes, seconds, token
      }
      dispatch(AddPushNotification(pushNotificationData))
      setTitle('')
      setDescription('')
      setScheduleTime('')
      setType('All')
      setLoading(false)
      setModalOpen(!modalOpen)
    } else {
      if (!verifyLength(title, 1)) {
        setErrTitle('Required field')
      }
      if (!verifyLength(description, 1)) {
        setErrDescription('Required field')
      }
      if (!verifyLength(Type, 1)) {
        setErrType('Required field')
      }
      if (!scheduleTime) {
        setErrExpDate('Required field')
      }
    }
  }

  function onSorting (sortingBy) {
    if (order === 'desc') {
      const start = 0
      const limit = offset
      getList(start, limit, sortingBy, search, dateFrom, dateTo, sPlatform, 'asc')
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
    } else {
      const start = 0
      const limit = offset
      getList(start, limit, sortingBy, search, dateFrom, dateTo, sPlatform, 'desc')
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
    }
  }

  function filterPassedTime (time) {
    const currentDate = new Date()
    const date = new Date(time)
    return currentDate.getTime() < date.getTime()
  }

  function checkDate (date) {
    return moment(date).isBefore(new Date(), 'h:mm aa')
  }

  function onRefresh () {
    // const startFrom = 0
    getList(start, offset, sort, search, dateFrom, dateTo, sPlatform, order)
    setLoading(true)
    setPageNo(activePageNo)
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className={errExpDate ? 'form-control date-range-notify league-placeholder-error' : 'form-control date-range-notify'} onClick={onClick}>
      <img alt="" src={calender} />
      <Input ref={ref} className='date-input range' placeholder='Schedule Date & Time' readOnly type="text" value={value} />
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

      <Modal className='notification-modal' isOpen={modalOpen}>
        <ModalHeader toggle={toggleModal}>Push Notification</ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting' for="NotificationTitle">
                    Title
                    <RequiredField/>
                  </Label>
                  <Input className={errTitle ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.PUSHNOTIFICATION === 'R'} onChange={event => handleChange(event, 'title')} placeholder="Enter Notification Title" type="text" value={title} />
                  <p className="error-text">{errTitle}</p>
                </FormGroup>
              </Col>
            </Row>

            <Row className='mt-3'>
              <Col md={12} xl={12}>
                <FormGroup className='d-flex flex-column'>
                  <Label className='edit-label-setting' for="startDate">
                    Schedule Date & Time
                    <RequiredField/>
                  </Label>
                  <DatePicker
                    customInput={<ExampleCustomInput />}
                    dateFormat="dd-MM-yyyy h:mm aa"
                    disabled={adminPermission?.PUSHNOTIFICATION === 'R'}
                    filterTime={filterPassedTime}
                    minDate={new Date()}
                    onChange={(date) => {
                      if (checkDate(date)) {
                        handleChange(new Date(moment().add(30, 'minute').format()), 'scheduleTime')
                      } else {
                        handleChange(date, 'scheduleTime')
                      }
                    }}
                    selected={scheduleTime}
                    showTimeSelect
                    timeIntervals={1}
                    value={scheduleTime}
                  />
                  <p className="error-text">{errExpDate}</p>
                </FormGroup>
              </Col>
            </Row>

            <Row className='mt-3'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting' for="notificationDescription">
                    Description
                    <RequiredField/>
                  </Label>
                  <Input className={errDescription ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.PUSHNOTIFICATION === 'R'} onChange={event => handleChange(event, 'description')} placeholder="Enter Notification Description" type="textarea" value={description} />
                  <p className="error-text">{errDescription}</p>
                </FormGroup>
              </Col>
            </Row>

            <Row className='mt-3'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting' for="typeSelect">Notification Type</Label>
                  <CustomInput className="form-control" disabled={adminPermission?.PUSHNOTIFICATION === 'R'} id="typeSelect" name="typeSelect" onChange={event => handleChange(event, 'Type')} type="select" value={Type}>
                    <option>All</option>
                    <option>Web</option>
                    <option>IOS</option>
                    <option>Android</option>
                  </CustomInput>
                  <p className="error-text">{errType}</p>
                </FormGroup>
              </Col>
            </Row>

            {
            ((Auth && Auth === 'SUPER') || (adminPermission?.PUSHNOTIFICATION !== 'R')) &&
              (
                <Row className='mt-3'>
                  <Col md={12} xl={12}>
                    <Fragment>
                      <Button className="theme-btn full-btn" onClick={onAdd} type="submit">Send</Button>
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
        ? (
          <DataNotFound message="Push notifications" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="content-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Title</th>
                    <th>Message</th>
                    <th>Admin`s Username</th>
                    <th>Admin Type</th>
                    <th>Paltform</th>
                    <th>
                      <span className="d-inline-block align-middle">Schedule Date & Time</span>
                      <Button className="sort-btn" color="link" onClick={() => onSorting('dScheduleTime')}><img alt="sorting" className="m-0 d-block" src={sortIcon} /></Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={7} />
                    : (
                      <Fragment>
                        {list.length !== 0 && list.map((data, i) => {
                          return (
                            <tr key={data._id}>
                              <td>{(((index - 1) * offset) + (i + 1))}</td>
                              <td>{data?.sTitle || '--'}</td>
                              <td>{data?.sDescription || '-- '}</td>
                              <td>
                                {data?.oAdmin?.eType !== 'SUPER'
                                  ? (
                                    <Button className="view" color='link' tag={Link} to={(data?.oAdmin?.eType !== 'SUPER') ? `/sub-admin/edit-sub-admin/${data?.oAdmin?._id}` : '/users/push-notification'}>
                                      {data?.oAdmin?.sUsername || '--'}
                                    </Button>
                                    )
                                  : data?.oAdmin?.sUsername }
                              </td>
                              <td>{data?.oAdmin?.eType || '--'}</td>
                              <td>{data?.ePlatform || '--'}</td>
                              <td>{data?.dScheduleTime ? moment(data.dScheduleTime).format('DD/MM/YYYY hh:mm A') : '--'}</td>
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

PushNotificationContent.propTypes = {
  modalOpen: PropTypes.bool,
  setModalOpen: PropTypes.func,
  value: PropTypes.string,
  onClick: PropTypes.func,
  location: PropTypes.object,
  getList: PropTypes.func,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  history: PropTypes.object,
  searchProp: PropTypes.string,
  List: PropTypes.array,
  search: PropTypes.string,
  flag: PropTypes.bool,
  filter: PropTypes.string
}

PushNotificationContent.displayName = PushNotificationContent

export default PushNotificationContent
