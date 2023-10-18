import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Form, FormGroup, Label, Input, CustomInput, InputGroupText, Row, Col } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import documentPlaceholder from '../../../../assets/images/upload-icon.svg'
import removeImg from '../../../../assets/images/ep-close.svg'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { verifyLength, isNumber, modalMessageFunc, acceptFormat } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'
import { getPaymentDetails, updatePayment } from '../../../../actions/payment'

const AddPayment = forwardRef((props, ref) => {
  const { setSubmitDisableButton, adminPermission, Auth } = props
  const { id } = useParams()
  const [Offer, setOffer] = useState('')
  const [Name, setName] = useState('')
  const [Key, setKey] = useState('')
  const [Order, setOrder] = useState('')
  const [errOffer] = useState('')
  const [errName, setErrName] = useState('')
  const [errOrder, setErrOrder] = useState('')
  const [PaymentImage, setPaymentImage] = useState('')
  const [errImage, setErrImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState(false)
  const [PaymentId, setPaymentId] = useState('')
  const [close, setClose] = useState(false)
  const [PaymentStatus, setPaymentStatus] = useState('N')

  const dispatch = useDispatch()
  const token = useSelector(state => state?.auth?.token)
  const PaymentDetails = useSelector(state => state?.payment?.PaymentDetails)
  const resStatus = useSelector(state => state?.payment?.resStatus)
  const resMessage = useSelector(state => state?.payment?.resMessage)
  const getUrlLink = useSelector(state => state?.url?.getUrl)
  const previousProps = useRef({ resStatus, resMessage, PaymentDetails }).current
  const page = JSON?.parse(localStorage?.getItem('queryParams'))
  const [modalMessage, setModalMessage] = useState(false)
  const navigate = useNavigate()

  // through this condition if there is no changes in at update time submit button will remain disable
  const submitDisable = PaymentDetails && previousProps?.PaymentDetails !== PaymentDetails && PaymentDetails?.sImage === PaymentImage && PaymentDetails?.sOffer === Offer && PaymentDetails?.sName === Name && PaymentDetails?.eKey === Key && PaymentDetails?.nOrder === parseInt(Order) && (PaymentDetails?.bEnable === (PaymentStatus === 'Y'))

  useEffect(() => {
    if (id) {
      // dispatch action to get payment details
      dispatch(getPaymentDetails(id, token))
      setPaymentId(id)
      setLoading(true)
    }
    dispatch(getUrl('media'))
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    setSubmitDisableButton(submitDisable)
  }, [submitDisable])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          navigate(`${props.cancelLink}${page?.PaymentManagement || ''}`, { state: { message: resMessage } })
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resMessage, resStatus])

  // for set payment details
  useEffect(() => {
    if (previousProps?.PaymentDetails !== PaymentDetails) {
      if (PaymentDetails) {
        setName(PaymentDetails?.sName)
        setKey(PaymentDetails?.eKey)
        setOffer(PaymentDetails?.sOffer)
        setPaymentImage(PaymentDetails?.sImage)
        setOrder(PaymentDetails?.nOrder)
        setPaymentStatus(PaymentDetails?.bEnable ? 'Y' : 'N')
        setLoading(false)
      }
    }
    return () => {
      previousProps.PaymentDetails = PaymentDetails
    }
  }, [PaymentDetails])

  // to handle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'Offer':
        setOffer(event?.target?.value)
        break
      case 'Order':
        if (event?.target?.value && !isNumber(event?.target?.value)) {
          setErrOrder('Should be a Number')
        } else {
          setErrOrder('')
        }
        setOrder(event?.target?.value)
        break
      case 'Name':
        if (verifyLength(event?.target?.value, 1)) {
          setErrName('')
        } else {
          setErrName('Required field')
        }
        setName(event?.target?.value)
        break
      case 'Image':
        if ((event?.target?.files[0]?.size / 1024 / 1024)?.toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event?.target?.files[0] && event?.target?.files[0]?.type?.includes('image')) {
          setPaymentImage({ imageURL: URL?.createObjectURL(event?.target?.files[0]), file: event?.target?.files[0] })
          setErrImage('')
        }
        break
      case 'Status':
        setPaymentStatus(event?.target?.value)
        break
      case 'RemoveImage' :
        setPaymentImage('')
        break
      default:
        break
    }
  }

  // to handle image error occurred during add time
  function onImageError (ev) {
    ev.target.src = documentPlaceholder
  }

  // to validate the field and dispatch action
  function onSubmit (e) {
    if (verifyLength(Name, 1) && verifyLength(Key, 1) && !errOffer && !errName && !errOrder) {
      const updatePaymentData = {
        PaymentId, Offer, Name, Key, PaymentStatus: PaymentStatus === 'Y', Order, PaymentImage, token
      }
      dispatch(updatePayment(updatePaymentData))
      setLoading(true)
    } else {
      if (!verifyLength(Name, 1)) {
        setErrName('Required field')
      }
      if (!isNumber(Order)) {
        setErrOrder('Should be a Number')
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
                    <div className={PaymentImage ? 'theme-img' : 'theme-img-default'} >
                      <img alt="themeImage" className={PaymentImage ? 'custom-img' : 'custom-img-default'} onError={onImageError} src={PaymentImage ? PaymentImage?.imageURL ? PaymentImage?.imageURL : url + PaymentImage : documentPlaceholder} />
                      {PaymentImage && ((Auth && Auth === 'SUPER') || (adminPermission?.PAYMENT_OPTION === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveImage')} src={removeImg} /></div>}
                      {!PaymentImage && ((Auth && Auth === 'SUPER') || (adminPermission?.PAYMENT_OPTION === 'W')) &&
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

                      <p className="error-text">{errImage}</p>
                    </div>
                  </div>
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col className='mt-3' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Name">
                  Name
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errName ? 'league-placeholder-error ' : 'input-box-setting'} disabled={adminPermission?.PAYMENT_OPTION === 'R'} name="Link" onChange={event => handleChange(event, 'Name')} placeholder="Enter Name" value={Name} />
                <p className="error-text">{errName}</p>
              </FormGroup>
            </Col>

            <Col className='mt-3' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Key">
                  Key
                  {' '}
                  <RequiredField/>
                </Label>
                <InputGroupText className='input-box-setting' >{Key}</InputGroupText>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col className='mt-3' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Offer">Offer</Label>
                <Input className={errOffer ? 'league-placeholder-error ' : 'input-box-setting'} disabled={adminPermission?.PAYMENT_OPTION === 'R'} name="Offer" onChange={event => handleChange(event, 'Offer')} placeholder="Enter Offer" value={Offer} />
                <p className="error-text">{errOffer}</p>
              </FormGroup>
            </Col>
            <Col className='mt-3' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Order">Order</Label>
                <Input className={errOrder ? 'league-placeholder-error ' : 'input-box-setting'} disabled={adminPermission?.PAYMENT_OPTION === 'R'} name="Order" onChange={event => handleChange(event, 'Order')} placeholder="Enter Order" value={Order} />
                <p className="error-text">{errOrder}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='p-3'>
            <div className='radio-button-div'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting'>Status</Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput checked={PaymentStatus === 'Y'} disabled={adminPermission?.PAYMENT_OPTION === 'R'} id="bannerRadio1" label="Active" name="bannerRadio" onClick={event => handleChange(event, 'Status')} type="radio" value="Y" />
                    <CustomInput checked={PaymentStatus !== 'Y'} disabled={adminPermission?.PAYMENT_OPTION === 'R'} id="bannerRadio2" label="In Active" name="bannerRadio" onClick={event => handleChange(event, 'Status')} type="radio" value="N" />
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

AddPayment.defaultProps = {
  history: {}
}

AddPayment.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  match: PropTypes.object,
  cancelLink: PropTypes.string,
  setSubmitDisableButton: PropTypes.func,
  adminPermission: PropTypes.object,
  Auth: PropTypes.string
}
AddPayment.displayName = AddPayment
export default connect(null, null, null, { forwardRef: true })(AddPayment)
