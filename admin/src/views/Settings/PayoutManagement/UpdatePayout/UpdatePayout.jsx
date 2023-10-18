import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Form, FormGroup, Label, Input, CustomInput, InputGroupText, Row, Col } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import documentPlaceholder from '../../../../assets/images/upload-icon.svg'
import removeImg from '../../../../assets/images/ep-close.svg'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { acceptFormat, isNumber, modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'
import { getPayoutDetails, updatePayout } from '../../../../actions/payout'

const UpdatePayoutComponent = forwardRef((props, ref) => {
  const { setSubmitDisableButton, Auth, adminPermission } = props
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [withdrawFee, setWithdrawFee] = useState(0)
  const [minAmount, setMinAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(0)
  const [minAmountErr, setMinAmountErr] = useState('')
  const [maxAmountErr, setMaxAmountErr] = useState('')
  const [key, setKey] = useState('')
  const [type, setType] = useState('')
  const [info, setInfo] = useState('')
  const [titleErr, setTitleErr] = useState('')
  const [typeErr, setTypeErr] = useState('')
  const [payoutImage, setPayoutImage] = useState('')
  const [imageErr, setErrImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState(false)
  const [payoutId, setPayoutId] = useState('')
  const [close, setClose] = useState(false)
  const [payoutStatus, setPayoutStatus] = useState('N')
  const dispatch = useDispatch()
  const token = useSelector(state => state?.auth?.token)
  const payoutDetails = useSelector(state => state?.payout?.payoutDetails)
  const resStatus = useSelector(state => state?.payout?.resStatus)
  const resMessage = useSelector(state => state?.payout?.resMessage)
  const getUrlLink = useSelector(state => state?.url)
  const previousProps = useRef({ resStatus, resMessage, payoutDetails })?.current
  const page = JSON?.parse(localStorage?.getItem('queryParams'))
  const [modalMessage, setModalMessage] = useState(false)
  const navigate = useNavigate()
  const submitDisable = payoutDetails && previousProps?.payoutDetails !== payoutDetails && payoutDetails?.sImage === payoutImage && payoutDetails?.eType === type && payoutDetails?.sTitle === title && (payoutDetails?.bEnable === (payoutStatus === 'Y')) && payoutDetails?.sInfo === info && (payoutDetails?.nWithdrawFee === parseInt(withdrawFee)) && (payoutDetails?.nMinAmount === parseInt(minAmount)) && (payoutDetails?.nMaxAmount === parseInt(maxAmount))

  useEffect(() => {
    if (id) {
      dispatch(getPayoutDetails(id, token))
      setPayoutId(id)
      setLoading(true)
    }
    dispatch(getUrl('media'))
  }, [])

  useEffect(() => {
    setSubmitDisableButton(submitDisable)
  }, [submitDisable])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          navigate(`${props?.cancelLink}${page?.PayoutManagement || ''}`, { state: { message: resMessage } })
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resMessage, resStatus])

  //  to set payoutDetails
  useEffect(() => {
    if (previousProps?.payoutDetails !== payoutDetails) {
      if (payoutDetails) {
        setTitle(payoutDetails?.sTitle)
        setType(payoutDetails?.eType)
        setKey(payoutDetails?.eKey)
        setWithdrawFee(payoutDetails?.nWithdrawFee || 0)
        setMinAmount(payoutDetails?.nMinAmount || 0)
        setMaxAmount(payoutDetails?.nMaxAmount || 0)
        setPayoutImage(payoutDetails?.sImage)
        setInfo(payoutDetails?.sInfo)
        setPayoutStatus(payoutDetails?.bEnable ? 'Y' : 'N')
        setLoading(false)
      }
    }
    return () => {
      previousProps.payoutDetails = payoutDetails
    }
  }, [payoutDetails])

  // for handle onChange event
  function handleChange (event, field) {
    switch (field) {
      case 'Title':
        if (verifyLength(event?.target?.value, 1)) {
          setTitleErr('')
        } else {
          setTitleErr('Required field')
        }
        setTitle(event?.target?.value)
        break
      case 'Type':
        if (verifyLength(event?.target?.value, 1)) {
          setTypeErr('')
        } else {
          setTypeErr('Required field')
        }
        setType(event?.target?.value)
        break
      case 'Image':
        if ((event?.target?.files[0]?.size / 1024 / 1024)?.toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event?.target?.files[0] && event?.target?.files[0]?.type?.includes('image')) {
          setPayoutImage({ imageURL: URL?.createObjectURL(event?.target?.files[0]), file: event?.target?.files[0] })
          setErrImage('')
        }
        break
      case 'Info':
        setInfo(event?.target?.value)
        break
      case 'Status':
        setPayoutStatus(event?.target?.value)
        break
      case 'MinAmount':
        if (isNumber(event?.target?.value) || !event?.target?.value) {
          if (parseInt(maxAmount) && parseInt(event?.target?.value) > parseInt(maxAmount)) {
            setMinAmountErr('Rank From value should be less than Rank To value')
          } else {
            setMaxAmountErr('')
            setMinAmountErr('')
          }
          setMinAmount(event?.target?.value)
        }
        break
      case 'MaxAmount':
        if (isNumber(event?.target?.value) || !event?.target?.value) {
          if (parseInt(minAmount) > parseInt(event?.target?.value)) {
            setMaxAmountErr('Max value must be greater than Min value')
          } else {
            setMaxAmountErr('')
            setMinAmountErr('')
          }
          setMaxAmount(event?.target.value)
        }
        break
      case 'WithdrawFee':
        if (isNumber(event?.target?.value) || !event?.target?.value) {
          setWithdrawFee(event?.target?.value)
        }
        break
      case 'RemoveImage':
        setPayoutImage('')
        break
      default:
        break
    }
  }

  // to handle image error occurred during add time
  function onImageError (ev) {
    ev.target.src = documentPlaceholder
  }

  // for validate the field and dispatch action
  function onSubmit (e) {
    if (verifyLength(title, 1) && (withdrawFee >= 0) && (minAmount >= 0) && (maxAmount >= 0) && type && !titleErr && !typeErr) {
      const updatePayoutData = {
        type, key, minAmount: parseInt(minAmount), maxAmount: parseInt(maxAmount), withdrawFee: parseInt(withdrawFee), payoutStatus: payoutStatus === 'Y', title, info, payoutImage, payoutId, token
      }
      dispatch(updatePayout(updatePayoutData))
      setLoading(true)
    } else {
      if (!type) {
        setTypeErr('Required field')
      }
      if (!verifyLength(title, 1)) {
        setTitleErr('Required field')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    onSubmit
  }))
  return (
    <main className="main-content">
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      {loading && <Loading />}
      <section className="common-form-block">
        <Form>
          <Row>
            <Col md={12} xl={12}>
              <FormGroup>
                <div className="theme-image text-center">
                  <div className="d-flex theme-photo">
                    <div className={payoutImage ? 'theme-img' : 'theme-img-default'}>
                      <img alt="themeImage" className={payoutImage ? 'custom-img' : 'custom-img-default'} onError={onImageError} src={payoutImage ? payoutImage?.imageURL ? payoutImage?.imageURL : url + payoutImage : documentPlaceholder} />
                      {payoutImage && ((Auth && Auth === 'SUPER') || (adminPermission?.PAYOUT_OPTION === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveImage')} src={removeImg} /></div>}
                      {!payoutImage && ((Auth && Auth === 'SUPER') || (adminPermission?.PAYOUT_OPTION === 'W')) &&
                (
                  <CustomInput
                    accept={acceptFormat}
                    id="exampleCustomFileBrowser"
                    label="Add Theme image"
                    name="customFile"
                    onChange={event => handleChange(event, 'Image')}
                    type="file"
                  />
                )}
                      <p className="error-text">{imageErr}</p>
                    </div>
                  </div>
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col className='mt-3' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Type">
                  Type
                  {' '}
                  <RequiredField/>
                </Label>
                <CustomInput className={typeErr ? 'league-placeholder-error ' : 'form-control'} disabled={adminPermission?.PAYOUT_OPTION === 'R'} name="type" onChange={event => handleChange(event, 'Type')} type="select" value={type}>
                  <option value="">Select type</option>
                  <option value="STD">STD</option>
                  <option value='INSTANT'>INSTANT</option>
                </CustomInput>
                <p className="error-text">{typeErr}</p>
              </FormGroup>
            </Col>

            <Col className='mt-3' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="title">
                  Title
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={titleErr ? 'league-placeholder-error' : 'input-box'} disabled={adminPermission?.PAYOUT_OPTION === 'R'} name="title" onChange={event => handleChange(event, 'Title')} placeholder="Enter Title" value={title} />
                <p className="error-text">{titleErr}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col className='mt-2' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Key">Key</Label>
                <InputGroupText className='input-box'>{key}</InputGroupText>
              </FormGroup>
            </Col>

            <Col className='mt-2' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="WithdrawFee">Withdraw Fee</Label>
                <Input className='input-box' disabled={adminPermission?.PAYOUT_OPTION === 'R'} name="WithdrawFee" onChange={event => handleChange(event, 'WithdrawFee')} placeholder="Enter Withdraw Fee" type='number' value={withdrawFee} />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col className='mt-3' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="MinAmount">Min Amount</Label>
                <Input className='input-box' disabled={adminPermission?.PAYOUT_OPTION === 'R'} name="MinAmount" onChange={event => handleChange(event, 'MinAmount')} placeholder="Enter Min Amount" type='number' value={minAmount} />
                <p className="error-text">{minAmountErr}</p>
              </FormGroup>
            </Col>
            <Col className='mt-3' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="MaxAmount">Max Amount</Label>
                <Input className='input-box' disabled={adminPermission?.PAYOUT_OPTION === 'R'} name="MaxAmount" onChange={event => handleChange(event, 'MaxAmount')} placeholder="Enter Max Amount" type='number' value={maxAmount} />
                <p className="error-text">{maxAmountErr}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col className='mt-2' md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="Info">Info</Label>
                <Input className='read-only-class' disabled={adminPermission?.PAYOUT_OPTION === 'R'} name="Info" onChange={event => handleChange(event, 'Info')} placeholder="Enter Info" type='textarea' value={info} />
              </FormGroup>
            </Col>
          </Row>

          <Row className='p-3 mt-2'>
            <div className='radio-button-div'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting'>Status</Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput checked={payoutStatus === 'Y'} disabled={adminPermission?.PAYOUT_OPTION === 'R'} id="payoutRadio1" label="Active" name="payoutRadio" onClick={event => handleChange(event, 'Status')} type="radio" value="Y" />
                    <CustomInput checked={payoutStatus !== 'Y'} disabled={adminPermission?.PAYOUT_OPTION === 'R'} id="payoutRadio2" label="In Active" name="payoutRadio" onClick={event => handleChange(event, 'Status')} type="radio" value="N" />
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

UpdatePayoutComponent.propTypes = {
  match: PropTypes.object,
  cancelLink: PropTypes.string,
  setSubmitDisableButton: PropTypes.func,
  Auth: PropTypes.string,
  adminPermission: PropTypes.object
}
UpdatePayoutComponent.displayName = UpdatePayoutComponent
export default connect(null, null, null, { forwardRef: true })(UpdatePayoutComponent)
