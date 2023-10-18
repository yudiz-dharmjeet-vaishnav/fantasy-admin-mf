import React, { Fragment, forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react'
import { Button, Col, CustomInput, Form, FormGroup, Input, InputGroupText, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { useSelector, connect } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import CKEditor from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-custom-build/build/ckeditor'
import PropTypes from 'prop-types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import updateEmailTemplate from '../../../../api/emailTemplate/updateEmailTemplate'
import imageUpload from '../../../../api/emailTemplate/imageUpload'
import getEmailTemplateDetails from '../../../../api/emailTemplate/getEmailTemplateDetails'

const UpdateEmailTemplate = forwardRef((props, ref) => {
  const { adminPermission, setSubmitDisableButton } = props
  const { slug } = useParams()
  const queryClient = useQueryClient()
  const [Slug, setSlug] = useState('')
  const [Title, setTitle] = useState('')
  const [Content, setContent] = useState('')
  const [htmlContent, setHtmlContent] = useState('')
  const [Subject, setSubject] = useState('')
  const [Description, setDescription] = useState('')
  const [EmailStatus, setEmailStatus] = useState('Y')
  const [errTitle, setErrTitle] = useState('')
  const [errContent, setErrContent] = useState('')
  const [errHtmlContent, setErrHtmlContent] = useState('')
  const [errSubject, setErrSubject] = useState('')
  const [errDescription, setErrDescription] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [emailTemplateID, setEmailTemplateID] = useState('')
  const [close, setClose] = useState(false)
  const [editor, setEditor] = useState('richtext')
  const [modalOpen, setModalOpen] = useState(false)
  const toggleModal = () => setModalOpen(!modalOpen)

  // const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(state => state?.auth?.token)
  const resStatus = useSelector(state => state?.users?.resStatus)
  const resMessage = useSelector(state => state?.users?.resMessage)
  const [modalMessage, setModalMessage] = useState(false)

  const { data: EmailTemplateDetails, isLoading } = useQuery({
    queryKey: ['getEmailTemplateDetails', slug],
    queryFn: () => getEmailTemplateDetails(slug),
    select: (response) => response?.data?.data
  })

  const previousProps = useRef({ resStatus, resMessage, EmailTemplateDetails })?.current
  // through this condition if there is no changes in at update time submit button will remain disable
  const submitDisable = EmailTemplateDetails && previousProps?.EmailTemplateDetails !== EmailTemplateDetails && EmailTemplateDetails?.sTitle === Title &&
  EmailTemplateDetails?.sSubject === Subject && EmailTemplateDetails?.sDescription === Description && EmailTemplateDetails?.eStatus === EmailStatus &&
  EmailTemplateDetails?.sContent === Content

  const { mutate: updateEmailTemplateFun } = useMutation(updateEmailTemplate, {
    onSuccess: (response) => {
      setMessage(response?.data?.message)
      setModalMessage(true)
      setStatus(true)
      queryClient?.invalidateQueries('getEmailTemplateDetails')
    }
  })

  const { mutate: uploadImagFun } = useMutation(imageUpload, {
  })

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
        if (resStatus) {
          navigate('/settin?gs/email-template', { state: { message: resMessage } })
        }
        setModalMessage(resMessage)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
      previousProps.resStatus = resStatus
    }
  }, [resStatus, resMessage])

  // for set email template Details
  useEffect(() => {
    if (EmailTemplateDetails) {
      setEmailTemplateID(EmailTemplateDetails?._id)
      setSlug(EmailTemplateDetails?.sSlug)
      setTitle(EmailTemplateDetails?.sTitle)
      setSubject(EmailTemplateDetails?.sSubject)
      setDescription(EmailTemplateDetails?.sDescription)
      setContent(EmailTemplateDetails?.sContent)
      setHtmlContent(EmailTemplateDetails?.sContent)
      setEmailStatus(EmailTemplateDetails?.eStatus)
    }
  }, [EmailTemplateDetails, resStatus, resMessage])

  // for validate the field and dispatch action
  function onSubmit (e) {
    const CONTENT = editor === 'richtext' ? changeTag(Content) : htmlContent
    if (verifyLength(Title, 1) && verifyLength(Content, 1) && verifyLength(Subject, 1) && verifyLength(Description, 1) && !errDescription && !errSubject && !errContent && !errTitle) {
      const updateEmailTemplateData = {
        Slug, Title, Description, Content: CONTENT, Subject, EmailStatus, ID: emailTemplateID, token
      }
      updateEmailTemplateFun(updateEmailTemplateData)
    } else {
      if (!verifyLength(Title, 1)) {
        setErrTitle('Required field')
      }
      if (!verifyLength(Content, 1)) {
        setErrContent('Required field')
      }
      if (!verifyLength(Content, 1)) {
        setErrHtmlContent('Required field')
      }
      if (!verifyLength(Subject, 1)) {
        setErrSubject('Required field')
      }
      if (!verifyLength(Description, 1)) {
        setErrDescription('Required field')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    onSubmit
  }))

  // for handle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'Title':
        if (verifyLength(event?.target?.value, 1)) {
          setErrTitle('')
        } else {
          setErrTitle('Required field')
        }
        setTitle(event?.target?.value)
        break
      case 'Subject':
        if (verifyLength(event?.target?.value, 1)) {
          setErrSubject('')
        } else {
          setErrSubject('Required field')
        }
        setSubject(event?.target?.value)
        break
      case 'Description':
        if (verifyLength(event?.target?.value, 1)) {
          setErrDescription('')
        } else {
          setErrDescription('Required field')
        }
        setDescription(event?.target?.value)
        break
      case 'Status':
        setEmailStatus(event?.target?.value)
        break
      case 'HtmlContent':
        setHtmlContent(event?.target?.value)
        break
      default:
        break
    }
  }

  function onEditorChange (evt, editor) {
    if (verifyLength(editor?.getData(), 1)) {
      setErrContent('')
    } else {
      setErrContent('Required field')
    }
    setContent(editor?.getData())
  }

  // below 3 functions are to add image in CKEditor
  function uploadAdapter (loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          loader?.file?.then(async (file) => {
            const data = uploadImagFun(file, token)
            resolve({ default: 'https://yudiz-fantasy-media.s3.ap-south-1.amazonaws.com/' + data })
          })
        })
      }
    }
  }

  function uploadPlugin (editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return uploadAdapter(loader)
    }
  }

  function changeTag (html) {
    const div = document?.createElement('div')
    div.innerHTML = html
    const figure = div?.getElementsByTagName('figure')
    const firstImage = div?.getElementsByTagName('img')
    const otp = div?.getElementsByTagName('span')[0]
    otp && (otp.style = 'text-align: center; padding: 10px; border-radius: 10%;')
    for (let index = 0; index < figure?.length; index++) {
      const figureWidth = figure[index]?.style?.width
      firstImage[index].style.width = figureWidth
      if (figure[index]?.classList?.contains('image-style-align-left')) {
        figure[index].style = 'width:95%; text-align: left;'
      } else if (figure[index]?.classList.contains('image-style-align-center')) {
        figure[index].style = 'width:95%; text-align: center;'
      } else if (figure[index].classList.contains('image-style-align-right')) {
        figure[index].style = 'width:95%; text-align: right;'
      } else {
        figure[index].style = 'width:95%'
      }
    }
    return div?.innerHTML
  }

  function openModalFunc () {
    setModalOpen(true)
  }

  function createMarkup () {
    if (editor === 'richtext') {
      return { __html: Content }
    }
    return { __html: htmlContent }
  }

  return (
    <main className="main-content">
      {isLoading && <Loading />}
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      <section className="common-form-block">
        <Form>
          <FormGroup className='email-temp'>
            <h3 style={{ color: '#FF3D3D' }}>Notes: </h3>
            <p className='email-p'>
              <b className='email-bold'>{'{{username}}'}</b>
              {' '}
              will be replaced with Users Username
            </p>
            <p className='email-p'>
              <b className='email-bold'>{'{{firstName}}'}</b>
              {' '}
              will be replaced with Users Firstname
            </p>
            <p className='email-p'>
              <b className='email-bold'>{'{{lastName}}'}</b>
              {' '}
              will be replaced with Users Lastname
            </p>
            <p className='email-p'>
              <b className='email-bold'>{'{{otp}}'}</b>
              {' '}
              will be replaced with actual OTP
            </p>
            <p className='email-p'>
              <b className='email-bold'>{'{{email}}'}</b>
              {' '}
              will be replaced with Users Email ID
            </p>

          </FormGroup>
        </Form>
        <Form>
          <Row >
            <Col className='mt-3' md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="title">
                  Title
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errTitle ? 'league-placeholder-error ' : 'league-placeholder'} disabled={adminPermission?.EMAIL_TEMPLATES === 'R'} name="title" onChange={event => handleChange(event, 'Title')} placeholder="Title" value={Title} />
                <p className="error-text">{errTitle}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col className='mt-2' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for='slug'>Slug</Label>
                <InputGroupText>{Slug}</InputGroupText>
              </FormGroup>
            </Col>
            <Col className='mt-2' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="subject">
                  Subject
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errSubject ? 'league-placeholder-error ' : 'league-placeholder'} disabled={adminPermission?.EMAIL_TEMPLATES === 'R'} name="subject" onChange={event => handleChange(event, 'Subject')} placeholder="Subject" value={Subject} />
                <p className="error-text">{errSubject}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col className='mt-2' md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="description">
                  Description
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errDescription ? 'league-placeholder-error ' : 'read-only-class'} disabled={adminPermission?.EMAIL_TEMPLATES === 'R'} name="description" onChange={event => handleChange(event, 'Description')} placeholder="Description" type='textarea' value={Description} />
                <p className="error-text">{errDescription}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='p-3 mt-1'>
            <div className='radio-button-div'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting'>
                    Content
                    {' '}
                    <RequiredField/>
                  </Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput checked={editor === 'richtext'} id="Radio1" label="Rich Text" name="Editor" onChange={() => setEditor('richtext')} type="radio" value="richtext" />
                    <CustomInput checked={editor === 'html'} id="Radio2" label="HTML" name="Editor" onChange={() => setEditor('html')} type="radio" value="html" />
                  </div>
                </FormGroup>
              </Col>
            </div>
          </Row>

          {editor === 'richtext' && (
          <Row>
            <Col md={12} xl={12}>
              <FormGroup>
                <div className={errContent ? 'ck-border' : ''}>
                  <CKEditor
                    config={{
                      extraPlugins: [uploadPlugin],
                      image: {
                        resizeUnit: 'px',
                        resize: true,
                        toolbar: [
                          {
                            name: 'imageStyle:customDropdown',
                            title: 'Custom drop-down title',
                            items: ['imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight'],
                            defaultItem: 'imageStyle:alignLeft'
                          }
                        ]
                      },
                      placeholder: 'Enter content',
                      toolbar: {
                        items: ['heading', '|', 'fontSize', 'fontFamily', '|', 'fontColor', 'fontBackgroundColor', '|', 'bold', 'italic', 'underline', 'strikethrough',
                          '|', 'alignment', '|', 'numberedList', 'bulletedList', '|', 'outdent', 'indent', '|', 'todoList', 'imageUpload', 'imageResize', 'link',
                          'blockQuote', 'insertTable', 'mediaEmbed', '|', 'undo', 'redo', 'imageInsert', '|']
                      }
                    }}
                    data={Content}
                    disabled={adminPermission?.EMAIL_TEMPLATES === 'R'}
                    editor={Editor}
                    onChange={onEditorChange}
                    onInit={(editor) => { editor?.ui?.getEditableElement()?.parentElement?.insertBefore(editor?.ui?.view?.toolbar?.element, editor?.ui?.getEditableElement()) }}
                  />
                </div>
                <p className="error-text">{errContent}</p>
              </FormGroup>
            </Col>
          </Row>
          )}
          {editor === 'html' && (
          <Row>
            <Col md={12} xl={12}>
              <FormGroup>
                <textarea cols="100" defaultValue={htmlContent} onChange={event => handleChange(event, 'HtmlContent')} rows="12" className='w-100'/>
                <p className="error-text">{errHtmlContent}</p>
              </FormGroup>
            </Col>
          </Row>
          )}
          <Row className='p-3 mt-1'>
            <div className='radio-button-div'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting'>Status</Label>
                  <div className="d-flex inline-input">
                    <CustomInput checked={EmailStatus === 'Y'} disabled={adminPermission?.EMAIL_TEMPLATES === 'R'} id="Radio3" label="Active" name="Radio" onChange={event => handleChange(event, 'Status')} type="radio" value="Y" />
                    <CustomInput checked={EmailStatus !== 'Y'} disabled={adminPermission?.EMAIL_TEMPLATES === 'R'} id="Radio4" label="In Active" name="Radio" onChange={event => handleChange(event, 'Status')} type="radio" value="N" />
                  </div>
                </FormGroup>
              </Col>
            </div>
          </Row>
          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <Button className="theme-btn success-btn full-btn" onClick={openModalFunc}>View Template</Button>
            </Col>
          </Row>
          <Fragment />
        </Form>
      </section>

      <Modal className="modal-reject" isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Preview of Email Template</ModalHeader>
        <ModalBody>
          <div className='email-popup' dangerouslySetInnerHTML={createMarkup()} />
        </ModalBody>
      </Modal>
    </main>
  )
})

UpdateEmailTemplate.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  adminPermission: PropTypes.string,
  setSubmitDisableButton: PropTypes.func,
  navigate: PropTypes.object
}

UpdateEmailTemplate.displayName = UpdateEmailTemplate
export default connect(null, null, null, { forwardRef: true })(UpdateEmailTemplate)
// export default UpdateEmailTemplate
