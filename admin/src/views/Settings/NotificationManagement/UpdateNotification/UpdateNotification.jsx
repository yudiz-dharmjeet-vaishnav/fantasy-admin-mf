import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Form, FormGroup, Label, Input, CustomInput, Row, Col } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import PropTypes from 'prop-types'

import calenderIcon from '../../../../assets/images/calendar.svg'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import { getNotificationDetails, TypeList, updateNotification } from '../../../../actions/notification'

const UpdateNotification = forwardRef((props, ref) => {
  const { setSubmitDisableButton, adminPermission } = props
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')
  const [titleErr, setTitleErr] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationMessageErr, setNotificationMessageErr] = useState('')
  const [notificationType, setNotificationType] = useState('')
  const [typeErr, setTypeErr] = useState('')
  const [expireTime, setExpireTime] = useState('')
  const [expireTimeErr, setExpireTimeErr] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)

  const [modalMessage, setModalMessage] = useState(false)
  const notificationDetails = useSelector(state => state?.notification?.notificationDetails)
  const notificationTypeList = useSelector(state => state?.notification?.typeList)
  const resStatus = useSelector(state => state?.notification?.resStatus)
  const resMessage = useSelector(state => state?.notification?.resMessage)
  const token = useSelector(state => state?.auth?.token)
  const previousProps = useRef({ notificationDetails, resStatus, resMessage }).current
  const page = JSON.parse(localStorage?.getItem('queryParams'))

  // through this condition if there is no changes in at update time submit button will remain disable
  const updateDisable = notificationDetails && previousProps?.notificationDetails !== notificationDetails && notificationDetails?.sTitle === title && notificationDetails?.sMessage === notificationMessage && (moment(notificationDetails?.dExpTime)?.format('lll')) === moment(expireTime)?.format('lll') && notificationDetails?.iType === notificationType

  useEffect(() => {
    if (id) {
      // dispatch action to get notification details and notification type list
      dispatch(getNotificationDetails(id, token))
      dispatch(TypeList(token))
      setLoading(true)
    }
  }, [])

  useEffect(() => {
    setSubmitDisableButton(updateDisable)
  }, [updateDisable])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // to set notification Details
  useEffect(() => {
    if (previousProps?.notificationDetails !== notificationDetails && notificationDetails) {
      setTitle(notificationDetails?.sTitle)
      setNotificationMessage(notificationDetails?.sMessage)
      setNotificationType(notificationDetails?.iType)
      setExpireTime(notificationDetails?.dExpTime ? new Date(moment(notificationDetails?.dExpTime)?.format()) : '')
      setLoading(false)
    }
    return () => {
      previousProps.notificationDetails = notificationDetails
    }
  }, [notificationDetails])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          navigate(`/settings/notification-management${page?.NotificationManagement || ''}`, { state: { message: resMessage } })
        }

        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // forhandle onChange event and set notification details
  function handleChange (event, type) {
    switch (type) {
      case 'Title':
        if (verifyLength(event?.target?.value, 3)) {
          setTitleErr('')
        } else {
          setTitleErr('Length should be at least 3')
        }
        setTitle(event?.target?.value)
        break
      case 'Message':
        if (verifyLength(event?.target?.value, 3)) {
          setNotificationMessageErr('')
        } else {
          setNotificationMessageErr('Length should be at least 3')
        }
        setNotificationMessage(event?.target?.value)
        break
      case 'NotificationType':
        if (!event?.target?.value) {
          setTypeErr('Required field')
        } else {
          setTypeErr('')
        }
        setNotificationType(event?.target?.value)
        break
      case 'ExpireTime':
        if (verifyLength(moment(event)?.format('DD/MM/YYYY hh:mm:ss A'), 1)) {
          setExpireTimeErr('')
        } else {
          setExpireTimeErr('Required field')
        }
        setExpireTime(event)
        break
      default:
        break
    }
  }

  // for validate the field and dispatch action
  function onSubmit () {
    if (verifyLength(title, 1) && verifyLength(notificationMessage, 1) && notificationType && expireTime && !expireTimeErr && !titleErr && !notificationMessageErr) {
      const date = new Date(expireTime)?.toISOString()
      const data = {
        title, notificationMessage, notificationType, expireTime: date, token, notificationId: id
      }
      dispatch(updateNotification(data))
    } else {
      if (!verifyLength(notificationType, 1)) {
        setTypeErr('Required field')
      }
      if (!verifyLength(title, 1)) {
        setTitleErr('Required field')
      }
      if (!verifyLength(notificationMessage, 1)) {
        setNotificationMessageErr('Required field')
      }
      if (!expireTime) {
        setExpireTimeErr('Required field')
      }
    }
  }
  useImperativeHandle(ref, () => ({
    onSubmit
  }))

  // to check and disable past date
  function filterPassedTime (time) {
    const currentDate = new Date()
    const date = new Date(time)
    return currentDate?.getTime() < date?.getTime()
  }

  function checkDate (date) {
    return moment(date)?.isBefore(new Date(), 'h:mm aa')
  }

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range-notify' onClick={onClick}>
      <img alt="calender" src={calenderIcon} />
      <Input ref={ref} className='date-input range' placeholder='Select Expiry Date' readOnly value={value} />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  return (
    <main className="main-content">
      {loading && <Loading />}
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      <section className="common-form-block">
        <Form>
          <Row>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="title">
                  Title
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={titleErr ? 'league-placeholder-error ' : 'league-placeholder'} disabled={adminPermission?.NOTFICATION === 'R'} name="title" onChange={event => handleChange(event, 'Title')} placeholder="Enter Title" value={title} />
                <p className='error-text'>{titleErr}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup className='d-flex flex-column'>
                <Label className='edit-label-setting' for="expireTime">
                  Expiry Date & Time
                  {' '}
                  <RequiredField/>
                </Label>
                <DatePicker
                  customInput={<ExampleCustomInput />}
                  dateFormat="dd-MM-yyyy h:mm aa"
                  filterTime={filterPassedTime}
                  minDate={new Date()}
                  onChange={(date) => {
                    if (checkDate(date)) {
                      handleChange(new Date(moment()?.add(30, 'minute')?.format()), 'ExpireTime')
                    } else {
                      handleChange(date, 'ExpireTime')
                    }
                  }}
                  selected={expireTime}
                  showTimeSelect
                  timeIntervals={15}
                  value={expireTime}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-4'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="notificationType">
                  Notification Type
                  {' '}
                  <RequiredField/>
                </Label>
                <CustomInput className={typeErr ? 'league-placeholder-error ' : 'form-control'} disabled={adminPermission?.NOTIFICATION === 'R'} name="notificationType" notificationType="select" onChange={event => handleChange(event, 'NotificationType')} type='select' value={notificationType}>
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

          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="notificationMessage">
                  Message
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={notificationMessageErr ? 'league-placeholder-error ' : 'read-only-class'} disabled={adminPermission?.NOTFICATION === 'R'} name="notificationMessage" onChange={event => handleChange(event, 'Message')} placeholder="Enter Message" type='textarea' value={notificationMessage} />
                <p className='error-text'>{notificationMessageErr}</p>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </section>
    </main>
  )
})

UpdateNotification.propTypes = {
  match: PropTypes.object,
  list: PropTypes.array,
  viewLink: PropTypes.string,
  value: PropTypes.string,
  onClick: PropTypes.func,
  setSubmitDisableButton: PropTypes.func,
  adminPermission: PropTypes.string
}

UpdateNotification.displayName = UpdateNotification
export default connect(null, null, null, { forwardRef: true })(UpdateNotification)
