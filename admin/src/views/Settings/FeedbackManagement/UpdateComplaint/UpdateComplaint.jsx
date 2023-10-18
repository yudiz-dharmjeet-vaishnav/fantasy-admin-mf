import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector, connect } from 'react-redux'
import { FormGroup, Input, Label, InputGroupText, CustomInput, Row, Col } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types'

import documentPlaceholder from '../../../../assets/images/upload-icon.svg'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'
import { getFeedbackDetails, updateFeedbackStatus } from '../../../../actions/feedback'

const UpdateComplaint = forwardRef((props, ref) => {
  const { setType, type, setSubmitDisableButton } = props
  const { id } = useParams()
  const [username, setUsername] = useState('')
  const [title, setTitle] = useState('')
  const [complainStatus, setComplainStatus] = useState('')
  const [comment, setComment] = useState('')
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [errComment, setErrComment] = useState('')
  const [loading, setLoading] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [Id, setId] = useState('')
  const [close, setClose] = useState(false)
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(state => state?.auth?.token)
  const feedbackDetails = useSelector(state => state?.feedback?.feedbackDetails)
  const resMessage = useSelector(state => state?.feedback?.resMessage)
  const resStatus = useSelector(state => state?.feedback?.resStatus)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const previousProps = useRef({ resMessage, feedbackDetails, resStatus })?.current
  const [modalMessage, setModalMessage] = useState(false)
  const submitDisable = feedbackDetails && previousProps?.feedbackDetails !== feedbackDetails && feedbackDetails.eStatus === complainStatus && feedbackDetails?.sComment === comment

  useEffect(() => {
    if (id) {
      // dispatch action to get Feedback Details
      dispatch(getFeedbackDetails(id, token))
      setId(id)
      setLoading(true)
      dispatch(getUrl('media'))
    }
  }, [])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    setSubmitDisableButton(submitDisable)
  }, [submitDisable])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        setLoading(false)
        if (resStatus) {
          navigate('/settings/feedback-complaint-management', { state: { message: resMessage } })
        }
        setModalMessage(true)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resMessage])

  // to set Feedback Details
  useEffect(() => {
    if (previousProps?.feedbackDetails !== feedbackDetails) {
      if (feedbackDetails) {
        setUsername(feedbackDetails?.iUserId && feedbackDetails?.iUserId?.sUsername ? feedbackDetails?.iUserId?.sUsername : '--')
        setTitle(feedbackDetails?.sTitle)
        setDescription(feedbackDetails?.sDescription)
        setComplainStatus(feedbackDetails?.eStatus)
        setType(feedbackDetails?.eType)
        setComment(feedbackDetails?.sComment)
        setImage(feedbackDetails?.sImage)
        setDate(moment(feedbackDetails?.dCreatedAt)?.format('DD/MM/YYYY hh:mm A'))
        setLoading(false)
      }
    }
    return () => {
      previousProps.feedbackDetails = feedbackDetails
    }
  }, [feedbackDetails])

  // forhandle onChange event
  function handleChange (event, Type) {
    switch (Type) {
      case 'Comment':
        if (verifyLength(event?.target?.value, 1)) {
          setErrComment('')
        } else {
          setErrComment('Required field')
        }
        setComment(event?.target?.value)
        break
      case 'Status':
        setComplainStatus(event?.target?.value)
        break
      default:
        break
    }
  }

  function onEdit (e) {
    let verify
    if (complainStatus === 'D') {
      verify = complainStatus && comment
    } else {
      verify = complainStatus
    }
    if (verify) {
      const data = {
        complainStatus, comment, type, Id, token
      }
      dispatch(updateFeedbackStatus(data))
    } else {
      if (complainStatus === 'D' && !comment) {
        setErrComment('Required field')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    onEdit
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
        <FormGroup>
          <div className="theme-image text-center">
            <div className="d-flex theme-photo">
              <div className={ image ? 'theme-img' : 'theme-img-default'}>
                <img alt="PlayerImage" className={image ? 'custom-img' : 'custom-img-default'} src={image ? image?.imageURL ? image?.imageURL : url + image : documentPlaceholder}/>
              </div>
            </div>
          </div>
        </FormGroup>

        <Row className='mt-3'>
          <Col md={12} xl={6}>
            <FormGroup>
              <Label className='edit-label-setting' for="Name">Username</Label>
              <InputGroupText>{username}</InputGroupText>
            </FormGroup>
          </Col>
          <Col md={12} xl={6}>
            <FormGroup>
              <Label className='edit-label-setting' for="title">Title</Label>
              <InputGroupText>{title}</InputGroupText>
            </FormGroup>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col md={12} xl={6}>
            <FormGroup>
              <Label className='edit-label-setting' for="date">Date</Label>
              <InputGroupText>{date}</InputGroupText>
            </FormGroup>
          </Col>
          <Col md={12} xl={6}>
            <FormGroup>
              <Label className='edit-label-setting' for="status">Status</Label>
              <CustomInput className="form-control" disabled={adminPermission?.COMPLAINT === 'R'} name="status" onChange={event => handleChange(event, 'Status')} type="select" value={complainStatus}>
                <option value='P'>Pending</option>
                <option value='I'>In-Progress</option>
                <option value='D'>Declined</option>
                <option value='R'>Resolved</option>
              </CustomInput>
            </FormGroup>
          </Col>
        </Row>

        {complainStatus === 'D' && (
          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="comment">
                  Comment
                  <RequiredField/>
                </Label>
                <Input className={errComment ? 'league-placeholder-error' : 'league-placeholder'} name='comment' onChange={(e) => handleChange(e, 'Comment')} value={comment} />
                <p className='error-text'>{errComment}</p>
              </FormGroup>
            </Col>
          </Row>
        )}
        <Row className='mt-3'>
          <Col md={12} xl={12}>
            <FormGroup>
              <Label className='edit-label-setting' for="description">Description</Label>
              <Input className='read-only-class' disabled type="textarea" value={description} />
            </FormGroup>
          </Col>
        </Row>
      </section>
    </main>
  )
})

UpdateComplaint.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  setType: PropTypes.func,
  type: PropTypes.string,
  setSubmitDisableButton: PropTypes.func,
  navigate: PropTypes.object

}

UpdateComplaint.displayName = UpdateComplaint
export default connect(null, null, null, { forwardRef: true })(UpdateComplaint)
