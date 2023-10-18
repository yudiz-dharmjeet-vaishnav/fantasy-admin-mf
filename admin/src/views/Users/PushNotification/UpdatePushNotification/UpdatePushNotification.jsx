import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Form, FormGroup, Label, Input, CustomInput, InputGroupText, Col, Row } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { modalMessageFunc } from '../../../../helpers/helper'
import { getPushNotificationDetails, updatePushNotification } from '../../../../actions/pushnotification'

const UpdatePushNotification = forwardRef((props, ref) => {
  const { setSubmitDisableButton } = props
  const { id } = useParams()
  const navigate = useNavigate()
  const [heading, setHeading] = useState('')
  const [key, setKey] = useState('')
  const [platform, setPlatform] = useState('')
  const [description, setDescription] = useState('')
  const [notificationStatus, setNotificationStatus] = useState('N')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [close, setClose] = useState(false)

  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const pushNotificationDetails = useSelector(state => state.pushNotification.pushNotificationDetails)
  const resStatus = useSelector(state => state.pushNotification.resStatus)
  const resMessage = useSelector(state => state.pushNotification.resMessage)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ resStatus, resMessage, pushNotificationDetails }).current
  const [modalMessage, setModalMessage] = useState(false)
  const submitDisable = pushNotificationDetails && previousProps.pushNotificationDetails !== pushNotificationDetails && pushNotificationDetails.sHeading === heading && pushNotificationDetails.ePlatform === platform && pushNotificationDetails.sDescription === description && (pushNotificationDetails.bEnableNotifications === (notificationStatus === 'Y'))

  useEffect(() => {
    dispatch(getPushNotificationDetails(id, token))
    setLoading(true)
  }, [])

  useEffect(() => {
    setSubmitDisableButton(submitDisable)
  }, [submitDisable])
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          navigate('/users/push-notification', { state: { message: resMessage } })
        }

        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.pushNotificationDetails !== pushNotificationDetails) {
      if (pushNotificationDetails) {
        setHeading(pushNotificationDetails.sHeading || '')
        setKey(pushNotificationDetails.eKey || '')
        setPlatform(pushNotificationDetails.ePlatform || '')
        setDescription(pushNotificationDetails.sDescription || '')
        setNotificationStatus(pushNotificationDetails.bEnableNotifications ? 'Y' : 'N')
        setLoading(false)
      }
    }
    return () => {
      previousProps.pushNotificationDetails = pushNotificationDetails
    }
  }, [pushNotificationDetails])

  function onSubmit (e) {
    const updateSportData = {
      heading, key, description, platform, notificationStatus, notificationId: id, token
    }
    dispatch(updatePushNotification(updateSportData))
    setLoading(true)
  }

  useImperativeHandle(ref, () => ({
    onSubmit
  }))

  function handleChange (event, type) {
    switch (type) {
      case 'Heading':
        setHeading(event.target.value)
        break
      case 'Description':
        setDescription(event.target.value)
        break
      case 'Platform':
        setPlatform(event.target.value)
        break
      case 'Status':
        setNotificationStatus(event.target.value)
        break
      default:
        break
    }
  }
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
                <Label className='edit-label-setting' for="heading">Heading</Label>
                <Input disabled={adminPermission?.PUSHNOTIFICATION === 'R'} name="heading" onChange={event => handleChange(event, 'Heading')} placeholder="Enter Heading" value={heading} />
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="key">Key</Label>
                <InputGroupText>{key}</InputGroupText>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="platform">
                  Platform
                  {' '}
                  <RequiredField/>
                </Label>
                <CustomInput className="form-control" disabled={adminPermission?.PUSHNOTIFICATION === 'R'} id="typeSelect" name="typeSelect" onChange={event => handleChange(event, 'Platform')} type="select" value={platform}>
                  <option value='ALL'>All</option>
                  <option value='W'>Web</option>
                  <option value='I'>iOS</option>
                  <option value='A'>Android</option>
                </CustomInput>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="description">Description</Label>
                <Input disabled={adminPermission?.PUSHNOTIFICATION === 'R'} name="Description" onChange={event => handleChange(event, 'Description')} placeholder="Enter Description" value={description} />
              </FormGroup>
            </Col>
          </Row>

          <Row className='p-3'>
            <div className='radio-button-div'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting' for="status">Status</Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput
                      checked={notificationStatus === 'Y'}
                      disabled={adminPermission?.PUSHNOTIFICATION === 'R'}
                      id="themeRadio1"
                      label="Active"
                      name="themeRadio"
                      onChange={event => handleChange(event, 'Status')}
                      type="radio"
                      value="Y"
                    />
                    <CustomInput
                      checked={notificationStatus !== 'Y'}
                      disabled={adminPermission?.PUSHNOTIFICATION === 'R'}
                      id="themeRadio2"
                      label="In Active"
                      name="themeRadio"
                      onChange={event => handleChange(event, 'Status')}
                      type="radio"
                      value="N"
                    />
                  </div>
                </FormGroup>
              </Col>
            </div>
          </Row>
        </Form>

      </section>
    </main>
  )
})

UpdatePushNotification.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  setSubmitDisableButton: PropTypes.func,
  navigate: PropTypes.object
}

UpdatePushNotification.displayName = UpdatePushNotification
export default connect(null, null, null, { forwardRef: true })(UpdatePushNotification)
