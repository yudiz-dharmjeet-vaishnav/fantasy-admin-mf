import React, { useState, useEffect, useRef, Fragment, forwardRef, useImperativeHandle } from 'react'
import { FormGroup, Input, Label, Form, InputGroupText, CustomInput, Col, Row } from 'reactstrap'
import { useDispatch, useSelector, connect } from 'react-redux'
import { useNavigate, useParams, useLocation } from 'react-router'
import moment from 'moment'
import PropTypes from 'prop-types'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { modalMessageFunc, verifyLength, verifyUrl } from '../../../../helpers/helper'
import { getVersionDetails, updateVersion } from '../../../../actions/version'

const AddVersion = forwardRef((props, ref) => {
  const { setSubmitDisableButton, adminPermission } = props
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [urlError, setUrlError] = useState('')
  const [versionErr, setVersionErr] = useState('')
  const [typeErr, setTypeErr] = useState('')
  const [versionId, setVersionId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [version, setVersion] = useState('')
  const [urlofversion, setUrlofversion] = useState('')
  const [createdAt, setCreatedAt] = useState('')
  const [updatedAt, setUpdatedAt] = useState('')
  const [inAppUpdate, setInAppUpdate] = useState('N')
  const [forceVersion, setForceVersion] = useState('')
  const [errName, setErrName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)

  const dispatch = useDispatch()
  const token = useSelector((state) => state?.auth?.token)
  const versionDetails = useSelector((state) => state?.version?.versionDetails)
  const resStatus = useSelector((state) => state?.version?.resStatus)
  const resMessage = useSelector((state) => state?.version?.resMessage)

  const previousProps = useRef({
    resStatus,
    resMessage,
    versionDetails
  })?.current
  const page = JSON?.parse(localStorage?.getItem('queryParams'))
  const [modalMessage, setModalMessage] = useState(false)
  const conditionUrl = !location?.pathname?.includes('add-version')

  // through this condition if there is no changes in at update time submit button will remain disable
  const submitDisable = versionDetails && previousProps?.versionDetails !== versionDetails && versionDetails?.sVersion === version && versionDetails?.sName === name && versionDetails?.sDescription === description && versionDetails?.eType === type && versionDetails?.sUrl === urlofversion && (versionDetails?.bInAppUpdate === (inAppUpdate === 'Y')) && versionDetails?.sForceVersion === forceVersion

  useEffect(() => {
    if (id) {
      // dispatch action to get version details
      dispatch(getVersionDetails(id, token))
      setVersionId(id)
      setLoading(true)
    }
  }, [])

  useEffect(() => {
    setSubmitDisableButton(submitDisable)
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          navigate(`/settings/versions${page?.VersionManagement || ''}`, {
            message: resMessage
          })
        } else {
          setModalMessage(true)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  //  set version details
  useEffect(() => {
    if (previousProps?.versionDetails !== versionDetails) {
      if (versionDetails) {
        setName(versionDetails?.sName)
        setDescription(versionDetails?.sDescription)
        setType(versionDetails?.eType)
        setVersion(versionDetails?.sVersion)
        setUrlofversion(versionDetails?.sUrl)
        setInAppUpdate(versionDetails?.bInAppUpdate ? 'Y' : 'N')
        setForceVersion(versionDetails?.sForceVersion || '')
        setCreatedAt(versionDetails?.dCreatedAt)
        setUpdatedAt(versionDetails?.dUpdatedAt)
        setLoading(false)
      }
    }
    return () => {
      previousProps.versionDetails = versionDetails
    }
  }, [versionDetails])

  // for handle onChange event
  function handleChange (event, field) {
    switch (field) {
      case 'Name':
        if (!event?.target?.value) {
          setErrName('Required field')
        } else if (event?.target?.value.trimStart().length === 0) {
          setErrName('No Initial Space Allowed')
        } else {
          setErrName('')
        }
        setName(event?.target?.value?.trimStart())
        break
      case 'Description':
        setDescription(event?.target?.value)
        break
      case 'Type':
        if (verifyLength(event?.target?.value, 1)) {
          setTypeErr('')
        } else {
          setTypeErr('Required field')
        }
        setType(event?.target?.value)
        break
      case 'Version':
        if (!event?.target?.value) {
          setVersionErr('Required field')
        } else if (event?.target?.value.trimStart().length === 0) {
          setVersionErr('No Initial Space Allowed')
        } else {
          setVersionErr('')
        }
        setVersion(event?.target?.value?.trimStart())
        break
      case 'Url':
        if (event?.target?.value && !verifyUrl(event?.target?.value)) {
          setUrlError('Invalid link ')
        } else {
          setUrlError('')
        }
        setUrlofversion(event?.target?.value)
        break
      case 'InAppUpdate':
        setInAppUpdate(event?.target?.value)
        break
      case 'ForceVersion':
        setForceVersion(event?.target?.value)
        break
      default:
        break
    }
  }

  // for validate the field and dispatch action
  function onSubmit (e) {
    if (verifyLength(name, 1) && version && verifyLength(type, 1) && !errName && !versionErr && !typeErr) {
      const updateVersionData = {
        versionId,
        name,
        description,
        type,
        version,
        urlofversion,
        token,
        conditionUrl,
        inAppUpdate,
        forceVersion
      }
      dispatch(updateVersion(updateVersionData))
      setLoading(true)
    } else {
      if (!verifyLength(name, 1)) {
        setErrName('Required field')
      }
      if (!version) {
        setVersionErr('Required field')
      }
      if (!verifyLength(type, 1)) {
        setTypeErr('Required field')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    onSubmit
  }))
  return (
    <main className='main-content'>
      {loading && <Loading />}
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />

      <section className='common-form-block'>
        <Form>
          <Row>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for='name'>
                  Version Name
                  {' '}
                  <RequiredField/>
                </Label>
                <Input
                  className={errName ? 'league-placeholder-error' : 'input-box-setting'}
                  disabled={adminPermission?.VERSION === 'R'}
                  id='name'
                  onChange={(event) => handleChange(event, 'Name')}
                  placeholder='Enter Version Name'
                  type='text'
                  value={name}
                />
                <p className='error-text'>{errName}</p>
              </FormGroup>
            </Col>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for='name'>Description</Label>
                <Input
                  className='input-box-setting'
                  disabled={adminPermission?.VERSION === 'R'}
                  id='Description'
                  onChange={(event) => handleChange(event, 'Description')}
                  placeholder='Enter Version Description'
                  type='text'
                  value={description}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row className='version-type'>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for='type'>
                  Type
                  {' '}
                  <RequiredField/>
                </Label>
                <CustomInput className={typeErr ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.VERSION === 'R'} name="type" onChange={event => handleChange(event, 'Type')} type="select" value={type}>
                  <option value=''>Select type</option>
                  <option value="I">iOS</option>
                  <option value="A">Android</option>
                </CustomInput>
                <p className='error-text'>{typeErr}</p>
              </FormGroup>
            </Col>

            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for='name'>
                  Version
                  {' '}
                  <RequiredField/>
                </Label>
                <Input
                  className={versionErr ? 'league-placeholder-error' : 'input-box-setting'}
                  disabled={adminPermission?.VERSION === 'R'}
                  id='Version'
                  onChange={(event) => handleChange(event, 'Version')}
                  placeholder='Enter Version Number'
                  type='text'
                  value={version}
                />
                <p className='error-text'>{versionErr}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='version-url'>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for='name'>Url</Label>
                <Input
                  className={urlError ? 'league-placeholder-error' : 'input-box-setting'}
                  disabled={adminPermission?.VERSION === 'R'}
                  id='Url'
                  onChange={(event) => handleChange(event, 'Url')}
                  placeholder='Enter Version Url'
                  type='text'
                  value={urlofversion}
                />
                <p className='error-text'>{urlError}</p>
              </FormGroup>
            </Col>

            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for='forceVersion'>Force Version</Label>
                <Input
                  className='input-box-setting'
                  disabled={adminPermission?.VERSION === 'R'}
                  id='forceVersion'
                  onChange={(event) => handleChange(event, 'ForceVersion')}
                  placeholder='Force Version'
                  type='text'
                  value={forceVersion}
                />
              </FormGroup>
            </Col>
          </Row>

          {conditionUrl && (
            <>
              <Row className='mt-3'>
                <Col md={12} xl={6} >
                  <FormGroup>
                    <Label className='edit-label-setting' for='name'>Created Date</Label>
                    <InputGroupText className='input-box-setting'>
                      {moment(createdAt)?.format('DD/MM/YYYY hh:mm A')}
                    </InputGroupText>
                  </FormGroup>
                </Col>

                <Col className='version-date' md={12} xl={6}>
                  <FormGroup>
                    <Label className='edit-label-setting' for='name'>Last Updated Date</Label>
                    <InputGroupText className='input-box-setting'>
                      {moment(updatedAt)?.format('DD/MM/YYYY hh:mm A')}
                    </InputGroupText>
                  </FormGroup>
                </Col>
              </Row>
            </>

          )}
          <Row className='p-3 mt-2' >
            <div className='radio-button-div'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting' for="ActiveOffer">In App Update</Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput
                      checked={inAppUpdate === 'Y'}
                      className='input-box-setting'
                      disabled={adminPermission?.VERSION === 'R'}
                      id="themeRadio1"
                      label="True"
                      name="themeRadio"
                      onClick={event => handleChange(event, 'InAppUpdate')}
                      type="radio"
                      value="Y"
                    />
                    <CustomInput
                      checked={inAppUpdate !== 'Y'}
                      className='input-box-setting'
                      disabled={adminPermission?.VERSION === 'R'}
                      id="themeRadio2"
                      label="False"
                      name="themeRadio"
                      onClick={event => handleChange(event, 'InAppUpdate')}
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

AddVersion.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  Auth: PropTypes.string,
  adminPermission: PropTypes.object,
  setSubmitDisableButton: PropTypes.func
}

AddVersion.displayName = AddVersion
export default connect(null, null, null, { forwardRef: true })(AddVersion)
