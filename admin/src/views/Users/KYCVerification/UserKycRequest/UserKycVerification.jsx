import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Row, Col, FormGroup, Input, Label, CustomInput, Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
import PropTypes from 'prop-types'

import profilePicture from '../../../../assets/images/profile_pic.png'
import documentPlaceholder from '../../../../assets/images/doc-placeholder.jpg'
import rightIcon from '../../../../assets/images/right-icon.svg'
import wrongIcon from '../../../../assets/images/wrong-icon.svg'
import viewIcon from '../../../../assets/images/view-icon.svg'
import warningIcon from '../../../../assets/images/error-warning.svg'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import { acceptFormat, modalMessageFunc } from '../../../../helpers/helper'
import { getKycUrl } from '../../../../actions/url'
import { updatePanDetails, updateAadhaarDetails, updateKYCStatus, getKycDetails, getKycInfo } from '../../../../actions/kyc'

function UserKycVerification (props) {
  const { id } = useParams('')
  const adminData = useSelector(state => state.auth.adminData)
  const permission = adminData.aPermissions && adminData.aPermissions.length !== 0 && adminData.aPermissions.filter(e => e.eKey === 'USERS')[0].eType
  const [isEditPanDetails, setEditPanDetails] = useState(false)
  const [isEditAadhaarDetails, setEditAadhaarDetails] = useState(false)
  const [isEditUserDetails] = useState(false)
  const [kycPanImgErr, setKycPanImgErr] = useState('')
  const [aadharFrontImgErr, setAadharFrontImgErr] = useState('')
  const [aadharBackImgErr, setAadharBackImgErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('')
  const [userId, setUserId] = useState('')
  const [userName, setUsername] = useState('')
  const [errReason, setErrReason] = useState('')
  const [errPanNo] = useState('')
  const [url, setUrl] = useState('')
  const [errAadhaarNo] = useState('')
  const [reason, setReason] = useState('')
  const [modal, setModal] = useState(false)
  const [panDetails, setPanDetails] = useState({})
  const [aadhaarDetails, setAadhaarDetails] = useState({})
  const [Aadhaar, setAadhaar] = useState({})
  const [statusType, setStatusType] = useState('')
  const [message, setMessage] = useState('')
  const [responseStatus, setResponseStatus] = useState(false)

  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const getKycUrlLink = useSelector(state => state.url.getKycUrl)
  const kycDetails = useSelector(state => state.kyc.kycDetails)
  const kycInfo = useSelector(state => state.kyc.kycInfo)
  const resStatus = useSelector(state => state.kyc.resStatus)
  const resMessage = useSelector(state => state.kyc.resMessage)
  const previousProps = useRef({
    resStatus, resMessage, kycDetails, kycInfo
  }).current

  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const [modalPan, setModalOpen] = useState(false)
  const togglepan = () => setModalOpen(!modalPan)
  const [modalAadhaarF, setModalAADHAARF] = useState(false)
  const toggleAadhaarF = () => setModalAADHAARF(!modalAadhaarF)
  const [modalAadhaarB, setModalAADHAARB] = useState(false)
  const toggleAadhaarB = () => setModalAADHAARB(!modalAadhaarB)

  useEffect(() => {
    if (id) {
      dispatch(getKycInfo(id, token))
      dispatch(getKycDetails(id, token))
      setUserId(id)
      setLoading(true)
    }
    if (!getKycUrlLink) {
      dispatch(getKycUrl('kyc'))
    } else {
      setUrl(getKycUrlLink)
    }
  }, [])

  useEffect(() => {
    if (!getKycUrlLink) {
      dispatch(getKycUrl('kyc'))
    } else {
      setUrl(getKycUrlLink)
    }
  }, [getKycUrlLink])

  // handle kyc Details
  useEffect(() => {
    if (previousProps.kycDetails !== kycDetails) {
      if (kycDetails) {
        setUsername(kycDetails.sName ? kycDetails.sName : '')
        setAadhaarDetails(kycDetails.oAadhaar)
        setPanDetails(kycDetails.oPan)
        setLoading(false)
      }
    }
    return () => {
      previousProps.kycDetails = kycDetails
    }
  }, [kycDetails])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // handle to set kyc info
  useEffect(() => {
    if (previousProps.kycInfo !== kycInfo) {
      if (kycInfo) {
        setAadhaar(kycInfo.oAadhaar)
      }
    }
    return () => {
      previousProps.kycInfo = kycInfo
    }
  }, [kycInfo])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          setLoading(true)
          dispatch(getKycDetails(userId, token))
          setMessage(resMessage)
          setResponseStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
        } else {
          setLoading(false)
          setMessage(resMessage)
          setResponseStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
        }
      }
    }
    setLoading(false)
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // handleChange function to handle onChange event
  function handleChange (event, eType) {
    switch (eType) {
      case 'Name':
        setUsername(event.target.value)
        break
      case 'KYC_AADHAAR_NO':
        setAadhaarDetails({ ...aadhaarDetails, nNo: event.target.value })
        break
      case 'KYC_Pan_DocNo':
        setPanDetails({ ...panDetails, sNo: event.target.value })
        break
      case 'KYC_Aadhaar_front':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setAadharFrontImgErr('Please select a file less than 5MB')
        } else if (event.target.files[0].type.includes('image') && event.target.files[0].size !== 0) {
          setAadhaarDetails({ ...aadhaarDetails, sFrontImage: { imageUrl: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] } })
          setEditAadhaarDetails(true)
          setAadharFrontImgErr('')
        }
        break
      case 'KYC_Aadhaar_Back':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setAadharBackImgErr('Please select a file less than 5MB')
        } else if (event.target.files[0].type.includes('image') && event.target.files[0].size !== 0) {
          setAadhaarDetails({ ...aadhaarDetails, sBackImage: { imageUrl: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] } })
          setEditAadhaarDetails(true)
          setAadharBackImgErr('')
        }
        break
      case 'KYC_Pan':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setKycPanImgErr('Please select a file less than 5MB')
        } else if (event.target.files[0].type.includes('image') && event.target.files[0].size !== 0) {
          setPanDetails({ ...panDetails, sImage: { imageUrl: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] } })
          setEditPanDetails(true)
          setKycPanImgErr('')
        }
        break
      case 'Reason':
        if (event.target.value.length >= 10) {
          setErrReason('')
        } else {
          setErrReason('Reason should be greater than 10 letter!')
        }
        setReason(event.target.value)
        break
      default:
        break
    }
  }

  function onEditPanDetails () {
    if (isEditPanDetails) {
      if (panDetails && panDetails.sImage !== 0) {
        dispatch(updatePanDetails(userId, panDetails.sImage, panDetails.sNo, token))
        setLoading(true)
        setEditPanDetails(false)
        setType('')
      }
    } else {
      setEditPanDetails(true)
    }
  }

  function onEditAadhaarDetails () {
    if (isEditAadhaarDetails) {
      if (aadhaarDetails && aadhaarDetails.sFrontImage && aadhaarDetails.sBackImage) {
        if (aadhaarDetails.sBackImage.imageUrl && aadhaarDetails.sFrontImage.imageUrl) {
          dispatch(updateAadhaarDetails(userId, aadhaarDetails.sFrontImage, aadhaarDetails.sBackImage, aadhaarDetails.nNo, token))
        } else if (aadhaarDetails.sBackImage.imageUrl && !aadhaarDetails.sFrontImage.imageUrl) {
          dispatch(updateAadhaarDetails(userId, Aadhaar.sFrontImage, aadhaarDetails.sBackImage, aadhaarDetails.nNo, token))
        } else if (aadhaarDetails.sFrontImage.imageUrl && !aadhaarDetails.sBackImage.imageUrl) {
          dispatch(updateAadhaarDetails(userId, aadhaarDetails.sFrontImage, Aadhaar.sBackImage, aadhaarDetails.nNo, token))
        } else {
          dispatch(updateAadhaarDetails(userId, Aadhaar.sFrontImage, Aadhaar.sBackImage, aadhaarDetails.nNo, token))
        }
        setLoading(true)
        setEditPanDetails(false)
        setType('')
      }
    } else {
      setEditAadhaarDetails(true)
    }
  }

  function onImageError (ev, Type) {
    if (Type === 'propic') {
      ev.target.src = profilePicture
    } else {
      ev.target.src = documentPlaceholder
    }
  }

  function handleModalClose () {
    setModal(false)
  }

  function onUpdateStatus () {
    const eStatus = (type === 'verify' ? 'A' : 'R')
    dispatch(updateKYCStatus(userId, eStatus, statusType, reason, token))
    setLoading(true)
    toggleWarning()
  }

  function warningWithConfirmMessage (eType, statustype) {
    const Status = (eType === 'verify' ? 'A' : 'R')
    setStatusType(statustype)
    setType(eType)
    if (Status === 'R') {
      setModal(true)
    } else {
      setModalWarning(true)
    }
  }

  function onConfirm () {
    onUpdateStatus()
    setModal(false)
    setReason('')
  }

  return (
    <main className="main-content d-flex">
      {loading && <Loading />}

      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={responseStatus}
      />
      <section className="sidebar common-box">
        <div className="text-right">
          {permission === 'R' ? null : <Button color="link">{isEditUserDetails ? 'Save' : 'Edit'}</Button>}
        </div>
        <FormGroup>
          <Label for="userName">Username</Label>
          <Input disabled={!isEditUserDetails} id="userName" onChange={event => handleChange(event, 'Name')} placeholder="Enter Your Username" type="text" value={userName} />
        </FormGroup>
      </section>
      <section className="content-section user-edit-view">
        <Row>
          <Col lg="5">
            <div className="common-box">
              <h3>Documents</h3>
              <div className="d-flex justify-content-between align-items-start">
                <h3>PAN Card</h3>
                <Button color="link" onClick={onEditPanDetails}>{isEditPanDetails ? 'Save' : 'Edit'}</Button>
              </div>
              <div className="document-list">
                <div className="item">
                  <div className="doc-photo text-center">
                    <div className="doc-img">
                      {
                        panDetails && panDetails.sImage ? <img alt="pancard" onError={ev => onImageError(ev, 'document')} src={panDetails.sImage.imageUrl ? panDetails.sImage.imageUrl : url + panDetails.sImage} /> : <img alt="pancard" onError={ev => onImageError(ev, 'document')} src={documentPlaceholder} />
                      }
                    </div>
                    <CustomInput accept={acceptFormat} id="exampleCustomFileBrowser" label="Edit" name="customFile" onChange={event => handleChange(event, 'KYC_Pan')} type="file" />
                    <Button className="view ml-3" color="link" hidden={!panDetails.sImage} onClick={togglepan}>
                      {' '}
                      <img alt="View" src={viewIcon} />
                      {' '}
                      View
                      {' '}
                    </Button>
                    <p className="error-text">{kycPanImgErr}</p>
                  </div>
                  <Row>
                    <Col lg={12} md={6} xl={6}>
                      <FormGroup>
                        <Label for="document1No">Pan No.</Label>
                        <Input disabled={!isEditPanDetails} id="document1No" onChange={event => handleChange(event, 'KYC_Pan_DocNo')} placeholder="Enter Document No." type="text" value={panDetails && panDetails.sNo ? panDetails.sNo : ''} />
                        <p className="error-text">{errPanNo}</p>
                      </FormGroup>
                    </Col>
                  </Row>
                  {panDetails && panDetails.eStatus === 'P'
                    ? (
                      <div>
                        <Button className="success-btn" color="link" onClick={() => warningWithConfirmMessage('verify', 'PAN')}>
                          <img alt="Approve" src={rightIcon} />
                          <span>Approve</span>
                        </Button>
                        <Button className="danger-btn" color="link" onClick={() => warningWithConfirmMessage('reject', 'PAN')}>
                          <img alt="Reject" src={wrongIcon} />
                          <span>Reject</span>
                        </Button>
                      </div>
                      )
                    : (
                        panDetails && panDetails.eStatus === 'A' ? <p className="success-text"> Verified </p> : (panDetails && panDetails.eStatus === 'N' ? <p> Not Added </p> : <p className="warning-text"> Rejected </p>)
                      )
                  }
                </div>
                <div className="d-flex justify-content-between align-items-start">
                  <h3>Aadhaar Details</h3>
                  <Button color="link" onClick={onEditAadhaarDetails}>{isEditAadhaarDetails ? 'Save' : 'Edit'}</Button>
                </div>
                <div className="item">
                  <div className="doc-photo text-center">
                    <div className="doc-img">
                      {aadhaarDetails && aadhaarDetails.sFrontImage ? <img alt="pancard" onError={ev => onImageError(ev, 'document')} src={aadhaarDetails.sFrontImage.imageUrl ? aadhaarDetails.sFrontImage.imageUrl : aadhaarDetails.sFrontImage} /> : <img alt="aadhaarcardFront" onError={ev => onImageError(ev, 'document')} src={documentPlaceholder} />
                      }
                      <div className="side-label">Front</div>
                    </div>
                    <CustomInput accept={acceptFormat} id="exampleCustomFileBrowser1" label="Edit" name="customFile1" onChange={event => handleChange(event, 'KYC_Aadhaar_front')} type="file" />
                    <Button className="view ml-3" color="link" hidden={!aadhaarDetails.sFrontImage} onClick={toggleAadhaarF}>
                      {' '}
                      <img alt="View" src={viewIcon} />
                      {' '}
                      View
                      {' '}
                    </Button>
                    <p className="error-text">{aadharFrontImgErr}</p>
                  </div>
                  <div className="doc-photo text-center">
                    <div className="doc-img">
                      {aadhaarDetails && aadhaarDetails.sBackImage ? <img alt="pancard" onError={ev => onImageError(ev, 'document')} src={aadhaarDetails.sBackImage.imageUrl ? aadhaarDetails.sBackImage.imageUrl : aadhaarDetails.sBackImage} /> : <img alt="aadhaarcardFront" onError={ev => onImageError(ev, 'document')} src={documentPlaceholder} />
                      }
                      <div className="side-label">Back</div>
                    </div>
                    <CustomInput accept={acceptFormat} id="exampleCustomFileBrowser2" label="Edit" name="customFile2" onChange={event => handleChange(event, 'KYC_Aadhaar_Back')} type="file" />
                    <Button className="view ml-3" color="link" hidden={!aadhaarDetails.sBackImage} onClick={toggleAadhaarB}>
                      {' '}
                      <img alt="View" src={viewIcon} />
                      {' '}
                      View
                      {' '}
                    </Button>
                    <p className="error-text">{aadharBackImgErr}</p>
                  </div>
                  <Row>
                    <Col lg={12} md={6} xl={6}>
                      <FormGroup>
                        <Label for="document2No">Aadhaar No.</Label>
                        <Input disabled={!isEditAadhaarDetails} id="document2No" onChange={event => handleChange(event, 'KYC_AADHAAR_NO')} placeholder="Enter Aadhaar No." type="text" value={aadhaarDetails && aadhaarDetails.nNo ? aadhaarDetails.nNo : ''} />
                        <p className="error-text">{errAadhaarNo}</p>
                      </FormGroup>
                    </Col>
                  </Row>
                  {aadhaarDetails
                    ? aadhaarDetails.eStatus === 'P'
                      ? (
                        <div>
                          <Button className="success-btn" color="link" onClick={() => warningWithConfirmMessage('verify', 'AADHAAR')}>
                            <img alt="Approve" src={rightIcon} />
                            <span>Approve</span>
                          </Button>
                          <Button className="danger-btn" color="link" onClick={() => warningWithConfirmMessage('reject', 'AADHAAR')}>
                            <img alt="Reject" src={wrongIcon} />
                            <span>Reject</span>
                          </Button>
                        </div>
                        )
                      : (
                          aadhaarDetails.eStatus === 'A' ? <p className="success-text"> Verified </p> : (aadhaarDetails.eStatus === 'N' ? <p> Not Added </p> : <p className="warning-text"> Rejected </p>)
                        )
                    : null}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </section>
      <Modal className="modal-reject" isOpen={modalPan} toggle={togglepan}>
        <ModalBody className="text-center">
          <div className="doc-img2">
            <h1>hello</h1>
            {
              panDetails && panDetails.sImage ? <img alt="pancard" onError={ev => onImageError(ev, 'document')} src={panDetails.sImage && panDetails.sImage.imageUrl ? panDetails.sImage.imageUrl : panDetails.sImage} /> : <img alt="pancard" onError={ev => onImageError(ev, 'document')} src={documentPlaceholder} />
            }
          </div>
          <Button className="mt-5" color="secondary" onClick={togglepan}>Cancel</Button>
        </ModalBody>
      </Modal>
      <Modal className="modal-reject" isOpen={modalAadhaarF} toggle={toggleAadhaarF}>
        <ModalBody className="text-center">
          <div className="doc-img2">
            {
              aadhaarDetails && aadhaarDetails.sFrontImage ? <img alt="pancard" onError={ev => onImageError(ev, 'document')} src={aadhaarDetails.sFrontImage && aadhaarDetails.sFrontImage.imageUrl ? aadhaarDetails.sFrontImage.imageUrl : aadhaarDetails.sFrontImage} /> : <img alt="aadhaarcardFront" onError={ev => onImageError(ev, 'document')} src={documentPlaceholder} />
            }
          </div>
          <Button className="mt-5" color="secondary" onClick={toggleAadhaarF}>Cancel</Button>
        </ModalBody>
      </Modal>
      <Modal className="modal-reject" isOpen={modalAadhaarB} toggle={toggleAadhaarB}>
        <ModalBody className="text-center">
          <div className="doc-img2">
            {
              aadhaarDetails && aadhaarDetails.sBackImage ? <img alt="pancard" onError={ev => onImageError(ev, 'document')} src={aadhaarDetails.sBackImage && aadhaarDetails.sBackImage.imageUrl ? aadhaarDetails.sBackImage.imageUrl : aadhaarDetails.sBackImage} /> : <img alt="aadhaarcardFront" onError={ev => onImageError(ev, 'document')} src={documentPlaceholder} />
            }
          </div>
          <Button className="mt-5" color="secondary" onClick={toggleAadhaarB}>Cancel</Button>
        </ModalBody>
      </Modal>
      <Modal className="modal-reject" isOpen={modal} toggle={handleModalClose} >
        <ModalHeader toggle={handleModalClose} />
        <ModalBody>
          <FormGroup>
            <Label for="rejectReason">Reason for Reject</Label>
            <Input id="rejectReason" name="rejectReason" onChange={event => handleChange(event, 'Reason')} placeholder="Describe Your Reason for Reject" type="textarea" value={reason} />
            <p className="error-text">{errReason}</p>
          </FormGroup>
          <Button className="theme-btn full-btn" onClick={onConfirm} type="submit">SEND</Button>
        </ModalBody>
      </Modal>
      <Modal className="modal-confirm" isOpen={modalWarning} toggle={toggleWarning}>
        <ModalBody className="text-center">
          <img alt="check" className="info-icon" src={warningIcon} />
          <h2 className='popup-modal-message'>{`Are you sure you want to ${type} it?`}</h2>
          <Row className="row-12">
            <Col>
              <Button className="theme-btn outline-btn-cancel full-btn-cancel" onClick={toggleWarning} type="submit">Cancel</Button>
            </Col>
            <Col>
              <Button className="theme-btn danger-btn full-btn" onClick={onUpdateStatus} type="submit">{`${type} It`}</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </main>
  )
}

UserKycVerification.propTypes = {
  match: PropTypes.object
}

export default UserKycVerification
