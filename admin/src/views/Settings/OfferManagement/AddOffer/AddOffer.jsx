import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { FormGroup, Input, Label, CustomInput, Form, Row, Col } from 'reactstrap'
import { connect, useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import DecoupledEditor from 'ckeditor5-custom-build/build/ckeditor'
import CKEditor from '@ckeditor/ckeditor5-react'
import PropTypes from 'prop-types'
import { useMutation, useQuery } from '@tanstack/react-query'

import documentPlaceholder from '../../../../assets/images/upload-icon.svg'
import removeImg from '../../../../assets/images/ep-close.svg'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { acceptFormat, modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'
import addOffer from '../../../../api/addOffer/addOffer'
import getOfferDetails from '../../../../api/addOffer/getOfferDetails'
import updateOffer from '../../../../api/Offermangement/updateOffer'

const AddOffer = forwardRef((props, ref) => {
  const { isCreate, setIsCreate, setIsEdit, setSubmitDisableButton, Title, setTitle, setDescription, Description, Details, setDetails } = props
  const { id } = useParams()
  const [offerImage, setOfferImage] = useState('')
  const [Active, setActive] = useState('N')
  const [url, setUrl] = useState('')
  const [errTitle, setErrTitle] = useState('')
  const [errDescription, seterrDescription] = useState('')
  const [errDetails, seterrDetails] = useState('')
  const [errImage, setErrImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [offerId, setofferId] = useState('')
  const [close, setClose] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(state => state?.auth?.token)
  // const offerDetails = useSelector(state => state.offers.offerDetails)
  const resStatus = useSelector(state => state?.offers?.resStatus)
  const resMessage = useSelector(state => state?.offers?.resMessage)
  const getUrlLink = useSelector(state => state?.url?.getUrl)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const previousProps = useRef({ resStatus, resMessage })?.current
  const [modalMessage, setModalMessage] = useState(false)

  // offerDetails fetch with id
  const { data: offerDetails } = useQuery({
    queryKey: ['getOfferDetails', id],
    queryFn: () => getOfferDetails(id),
    select: (res) => res?.data?.data,
    enabled: !!id

  })
  // through this condition if there is no changes in at update time submit button will remain disable
  const submitDisable = offerDetails && previousProps?.offerDetails !== offerDetails && offerDetails?.sTitle === Title && offerDetails?.sDetail === Details && offerDetails?.sImage === offerImage && offerDetails?.sDescription === Description && offerDetails?.eStatus === Active

  const { mutate: AddOfferFun } = useMutation(addOffer, {
    onSuccess: (res) => {
      navigate('/settings/offer-management', { state: { message: res?.data?.message } })
    }
  })

  const { mutate: updateOfferFunction } = useMutation(updateOffer, {
    onSuccess: (res) => {
      navigate('/settings/offer-management', { state: { message: res?.data?.message } })
    }
  })
  useEffect(() => {
    if (id) {
      // dispatch action to get offer details
      // dispatch(getOfferDetails(id, token))
      setofferId(id)
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
    dispatch(getUrl('media'))
  }, [])

  useEffect(() => {
    setSubmitDisableButton(submitDisable)
  }, [submitDisable])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

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
        if (resStatus && isCreate) {
          navigate('/settings/offer-management', { state: { message: resMessage } })
        } else {
          if (resStatus) {
            setIsEdit(false)
            // dispatch(getOfferDetails(id, token))
          }
          setModalMessage(true)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // for set offer details
  useEffect(() => {
    // if (previousProps.offerDetails !== offerDetails) {
    if (offerDetails) {
      setTitle(offerDetails?.sTitle)
      setDetails(offerDetails?.sDetail)
      setOfferImage(offerDetails?.sImage)
      setDescription(offerDetails?.sDescription)
      setActive(offerDetails?.eStatus)
      setLoading(false)
    }
    // }
    return () => {
      previousProps.offerDetails = offerDetails
    }
  }, [offerDetails])

  // to handle image error occurred during add time
  function onImageError (e) {
    e.target.src = documentPlaceholder
  }

  // for handle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'Image':
        if ((event?.target?.files[0]?.size / 1024 / 1024)?.toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event?.target?.files[0] && event?.target?.files[0]?.type?.includes('image')) {
          setOfferImage({ imageURL: URL?.createObjectURL(event?.target?.files[0]), file: event?.target?.files[0] })
          setErrImage('')
        }
        break
      case 'Status':
        setActive(event?.target?.value)
        break
      case 'Title':
        if (verifyLength(event?.target?.value, 1)) {
          setErrTitle('')
        } else {
          setErrTitle('Required field')
        }
        setTitle(event?.target?.value)
        break
      case 'Description':
        if (verifyLength(event?.target?.value, 1)) {
          seterrDescription('')
        } else {
          seterrDescription('Required field')
        }
        setDescription(event?.target?.value)
        break
      case 'RemoveImage':
        setOfferImage('')
        break
      default:
        break
    }
  }

  function onEditorChange (evt, editor) {
    if (verifyLength(editor?.getData(), 1)) {
      seterrDetails('')
    } else {
      seterrDetails('Required field')
    }
    setDetails(editor?.getData())
  }

  // for validate the field and dispatch action
  function onSubmit (e) {
    if (verifyLength(Title, 1) && verifyLength(Description, 1) && Details && !errDescription && !errTitle && !errDetails) {
      if (isCreate) {
        const addOfferData = {
          Title, Details, Description, Active, offerImage, token
        }
        AddOfferFun(addOfferData)
        // dispatch(addOffer(addOfferData))
      } else {
        const updateOfferData = {
          Title, Details, Description, Active, offerImage, offerId
        }
        updateOfferFunction(updateOfferData)
        // dispatch(updateOffer(updateOfferData, offerId, token))
      }
      setLoading(true)
    } else {
      if (!verifyLength(Title, 1)) {
        setErrTitle('Required field')
      }
      if (!verifyLength(Description, 1)) {
        seterrDescription('Required field')
      }
      if (!Details) {
        seterrDetails('Required field')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    onSubmit
  }))
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
                <div className="theme-image text-center">
                  <div className="d-flex theme-photo">
                    <div className={offerImage ? 'theme-img' : 'theme-img-default'}>
                      <img alt="PlayerImage"
                        className={offerImage ? 'custom-img' : 'custom-img-default'}
                        onError={onImageError}
                        src={offerImage ? offerImage?.imageURL ? offerImage?.imageURL : url + offerImage : documentPlaceholder}
                      />

                      {offerImage &&
                        ((Auth && Auth === 'SUPER') || (adminPermission?.OFFER === 'W')) && (
                          <div className='remove-img-label'>
                            <img onClick={event => handleChange(event, 'RemoveImage')} src={removeImg} />
                          </div>
                      )}
                      {!offerImage && ((Auth && Auth === 'SUPER') || adminPermission?.LEAGUE === 'W') && (
                        <CustomInput
                          accept={acceptFormat}
                          id="exampleCustomFileBrowser"
                          label="Add offer image"
                          name="customFile"
                          onChange={(event) => handleChange(event, 'Image')}
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
                <Label className='edit-label-setting' for="titleName">
                  Title
                  {' '}
                  <RequiredField/>
                </Label>
                <Input
                  className={errTitle ? 'league-placeholder-error ' : 'league-placeholder'}
                  disabled={adminPermission?.OFFER === 'R'}
                  id="titleName"
                  onChange={event => handleChange(event, 'Title')}
                  placeholder="Enter Title"
                  type="text"
                  value={Title}
                />
                <p className="error-text">{errTitle}</p>
              </FormGroup>
            </Col>

            <Col className='mt-3' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="shortDescription">
                  Short Description
                  {' '}
                  <RequiredField/>
                </Label>
                <Input
                  className={errDescription ? 'league-placeholder-error ' : 'league-placeholder'}
                  disabled={adminPermission?.OFFER === 'R'}
                  id="shortDescription"
                  onChange={event => handleChange(event, 'Description')}
                  placeholder="Enter Description"
                  type="text"
                  value={Description}

                />
                <p className="error-text">{errDescription}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col className='mt-3' md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="OfferDetails">
                  Details
                  {' '}
                  <RequiredField/>
                </Label>
                <div className={errDetails ? 'ck-border' : ''}>
                  <CKEditor
                    config={{
                      placeholder: 'Enter Details',
                      toolbar: {
                        items: ['heading', '|', 'fontSize', 'fontFamily', '|', 'fontColor', 'fontBackgroundColor', '|', 'bold', 'italic', 'underline', 'strikethrough',
                          '|', 'alignment', '|', 'numberedList', 'bulletedList', '|', 'outdent', 'indent', '|', 'todoList', 'imageUpload', 'link', 'blockQuote', 'insertTable',
                          'mediaEmbed', '|', 'undo', 'redo', 'imageInsert', '|']
                      }
                    }}
                    data={Details}
                    disabled={adminPermission?.OFFER === 'R'}
                    editor={DecoupledEditor}
                    onChange={onEditorChange}
                    onInit={(editor) => { editor?.ui?.getEditableElement()?.parentElement.insertBefore(editor?.ui?.view?.toolbar?.element, editor?.ui?.getEditableElement()) }}
                  />
                </div>
                <p className="error-text">{errDetails}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='p-3'>
            <div className='radio-button-div'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting' for="ActiveOffer">Status</Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput
                      checked={Active === 'Y'}
                      disabled={adminPermission?.OFFER === 'R'}
                      id="themeRadio1"
                      label="Active"
                      name="themeRadio"
                      onClick={event => handleChange(event, 'Status')}
                      type="radio"
                      value="Y"
                    />
                    <CustomInput
                      checked={Active !== 'Y'}
                      disabled={adminPermission?.OFFER === 'R'}
                      id="themeRadio2"
                      label="In Active"
                      name="themeRadio"
                      onClick={event => handleChange(event, 'Status')}
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

AddOffer.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  isCreate: PropTypes.string,
  setIsEdit: PropTypes.func,
  setIsCreate: PropTypes.func,
  setSubmitDisableButton: PropTypes.func,
  Title: PropTypes.string,
  setTitle: PropTypes.string,
  Description: PropTypes.string,
  setDetails: PropTypes.func,
  Details: PropTypes.string,
  setDescription: PropTypes.func,
  navigate: PropTypes.object

}
AddOffer.displayName = AddOffer
export default connect(null, null, null, { forwardRef: true })(AddOffer)
