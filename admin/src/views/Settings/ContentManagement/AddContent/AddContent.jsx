import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useSelector } from 'react-redux'
import { Form, FormGroup, Label, Input, CustomInput, Row, Col } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import DecoupledEditor from 'ckeditor5-custom-build/build/ckeditor'
import CKEditor from '@ckeditor/ckeditor5-react'
import PropTypes from 'prop-types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { isNumber, modalMessageFunc, verifyLength, withoutSpace } from '../../../../helpers/helper'
import addCMS from '../../../../api/contentManagement/addCMS'
import getCMSDetails from '../../../../api/contentManagement/getCMSDetails'
import updateCMS from '../../../../api/contentManagement/updateCMS'
import getCMSList from '../../../../api/contentManagement/getCMSList'

const AddContentForm = forwardRef((props, ref) => {
  const { isCreate, setIsCreate, setIsEdit, setSubmitDisableButton, adminPermission } = props
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [Slug, setSlug] = useState('')
  const [Title, setTitle] = useState('')
  const [Description, setDescription] = useState('')
  const [priority, setPriority] = useState(1)
  const [Details, setDetails] = useState('')
  const [Category, setCategory] = useState('')
  const [contentStatus, setContentStatus] = useState('N')
  const [errTitle, seterrTitle] = useState('')
  const [errSlug, seterrSlug] = useState('')
  const [errDetails, seterrDetails] = useState('')
  const [errPriority, setErrPriority] = useState('')
  // const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [cmsId, setcmsId] = useState('')
  const [close, setClose] = useState(false)

  const { slug } = useParams()
  const token = useSelector(state => state.auth.token)
  const { data: cmsDetails, isLoading } = useQuery({
    queryKey: ['getCMSDetails', slug],
    queryFn: () => getCMSDetails(slug),
    select: (response) => response?.data?.data,
    enabled: !!slug
  })

  const { data: cmsList } = useQuery({
    queryFn: () => getCMSList(''),
    select: (response) => response?.data?.data
  })
  const resStatus = useSelector(state => state?.cms?.resStatus)
  const resMessage = useSelector(state => state?.cms?.resMessage)
  const previousProps = useRef({ resStatus, resMessage, cmsDetails })?.current
  const [modalMessage, setModalMessage] = useState(false)

  // through this condition if there is no changes in at update time submit button will remain disable
  const submitDisable = cmsDetails && previousProps?.cmsDetails !== cmsDetails && cmsDetails?.sTitle === Title && cmsDetails?.sContent === Details && cmsDetails?.sSlug === Slug &&
                        cmsDetails?.sDescription === Description && cmsDetails?.eStatus === contentStatus && cmsDetails?.nPriority === parseInt(priority) && cmsDetails?.sCategory === Category

  const { mutate: updateCMSFunction } = useMutation(updateCMS, {
    onSuccess: (response) => {
      queryClient?.invalidateQueries('getCMS')
      setMessage(response?.data?.message)
      setModalMessage(true)
      setStatus(true)
    }
  })
  const { mutate: addCMSFunction } = useMutation(addCMS, {
    onSuccess: (response) => {
      navigate('/settings/content-management', { state: { message: response?.data?.message } })
    }
  })

  useEffect(() => {
    if (slug) {
      setIsCreate(false)
    } else {
      setIsEdit(true)
    }
  }, [])

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
        if (resStatus && isCreate) {
          navigate('/settings/content-management', { state: { message: resMessage } })
        } else {
          if (resStatus) {
            setIsEdit(false)
          }
          setModalMessage(true)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // for set content Details
  useEffect(() => {
    if (cmsDetails && Object.keys(cmsDetails)?.length !== 0) {
      setcmsId(cmsDetails?._id)
      setSlug(cmsDetails?.sSlug)
      setTitle(cmsDetails?.sTitle)
      setDescription(cmsDetails?.sDescription)
      setPriority(cmsDetails?.nPriority)
      setDetails(cmsDetails?.sContent)
      setCategory(cmsDetails?.sCategory)
      setContentStatus(cmsDetails?.eStatus)

      if (previousProps?.cmsDetails?.sSlug !== cmsDetails?.sSlug) {
        navigate(`/settings/content-details/${cmsDetails?.sSlug}`)
      }
    }
  }, [cmsDetails])

  // forvalidate the field and dispatch action
  function onSubmit (e) {
    if (verifyLength(Slug, 1) && verifyLength(Title, 1) && verifyLength(Details, 1) && !errPriority && !errDetails && !errSlug && !errTitle) {
      if (isCreate) {
        const addDataCMS = {
          Category, Slug, Title, Description, priority, contentStatus, Details, token
        }
        addCMSFunction(addDataCMS)
      } else {
        const updateDataCMS = {
          Category, cmsId, Slug, Title, Description, priority, contentStatus, Details, token
        }
        updateCMSFunction(updateDataCMS)
        // dispatch(updateCMS(updateDataCMS))
      }
      // setLoading(true)
    } else {
      if (!verifyLength(Slug, 1)) {
        seterrSlug('Required field')
      }
      if (!verifyLength(Title, 1)) {
        seterrTitle('Required field')
      }
      if (!verifyLength(Details, 1)) {
        seterrDetails('Required field')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    onSubmit
  }))

  // forhandle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'Slug':
        if (verifyLength(event?.target?.value, 1)) {
          if (withoutSpace(event?.target?.value)) {
            seterrSlug('No space')
          } else {
            seterrSlug('')
          }
        } else {
          seterrSlug('Required field')
        }
        setSlug(event?.target?.value)
        break
      case 'Title':
        if (verifyLength(event?.target?.value, 1)) {
          seterrTitle('')
        } else {
          seterrTitle('Required field')
        }
        setTitle(event?.target?.value)
        break
      case 'Category':
        setCategory(event?.target?.value)
        break
      case 'description':
        setDescription(event?.target?.value)
        break
      case 'Priority':
        if (isNumber(event?.target?.value) || (!event?.target?.value)) {
          if (isNumber(event?.target?.value)) {
            setErrPriority('')
          } else if (!event?.target?.value) {
            setErrPriority('Required field')
          }
          cmsList && cmsList?.map((list) => (list?.nPriority === parseInt(event?.target?.value) && list?.sSlug !== Slug)
            ? setErrPriority('Priority is already exist')
            : setPriority(event?.target?.value))
        }
        break
      case 'Status':
        setContentStatus(event?.target?.value)
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

  return (
    <main className="main-content">
      {!isCreate && isLoading && <Loading />}
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />

      <section className="common-form-block">
        <Form>
          <Row>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="slug">
                  Slug
                  {' '}
                  <RequiredField/>
                </Label>
                <Input autoComplete='off' className={errSlug ? 'league-placeholder-error ' : 'league-placeholder'} disabled={adminPermission?.CMS === 'R'} name="slug" onChange={event => handleChange(event, 'Slug')} placeholder="Slug" value={Slug} />
                <p className="error-text">{errSlug}</p>
              </FormGroup>
            </Col>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="category">Category</Label>
                <Input autoComplete='off' disabled={adminPermission?.CMS === 'R'} name="category" onChange={event => handleChange(event, 'Category')} placeholder="Category" value={Category} />
              </FormGroup>
            </Col>
          </Row>

          <Row >
            <Col className='mt-3' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="title">
                  Title
                  {' '}
                  <RequiredField/>
                </Label>
                <Input autoComplete='off' className={errTitle ? 'league-placeholder-error ' : 'league-placeholder'} disabled={adminPermission?.CMS === 'R'} name="title" onChange={event => handleChange(event, 'Title')} placeholder="Title" value={Title} />
                <p className="error-text">{errTitle}</p>
              </FormGroup>
            </Col>
            <Col className='mt-3' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="priority">
                  Priority
                  {' '}
                  <RequiredField/>
                </Label>
                <Input autoComplete='off' className={errPriority ? 'league-placeholder-error ' : 'league-placeholder'} disabled={adminPermission?.CMS === 'R'} name="title" onChange={event => handleChange(event, 'Priority')} placeholder="Priority" type='number' value={priority} />
                <p className="error-text">{errPriority}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col className='mt-3' md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="description">Description</Label>
                <Input autoComplete='off' className='read-only-class' disabled={adminPermission?.CMS === 'R'} name="description" onChange={event => handleChange(event, 'description')} placeholder="Enter Description" type='textarea' value={Description} />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col className='mt-3' md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="status">
                  Content
                  {' '}
                  <RequiredField/>
                </Label>
                <div className={errDetails ? 'ck-border' : ''}>
                  <CKEditor
                    config={{
                      placeholder: 'Enter content',
                      toolbar: {
                        items: ['heading', '|', 'fontSize', 'fontFamily', '|', 'fontColor', 'fontBackgroundColor', '|', 'bold', 'italic', 'underline', 'strikethrough', '|',
                          'alignment', '|', 'numberedList', 'bulletedList', '|', 'outdent', 'indent', '|', 'todoList', 'imageUpload', 'link', 'blockQuote',
                          'insertTable', 'mediaEmbed', '|', 'undo', 'redo', 'imageInsert', '|']
                      }
                    }}
                    data={Details}
                    disabled={adminPermission?.CMS === 'R'}
                    editor={DecoupledEditor}
                    onChange={onEditorChange}
                    onInit={(editor) => {
                      editor?.ui?.getEditableElement()?.parentElement?.insertBefore(editor?.ui?.view?.toolbar?.element, editor?.ui?.getEditableElement())
                    }}
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
                  <Label className='edit-label-setting' for="status">Status</Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput
                      checked={contentStatus === 'Y'}
                      disabled={adminPermission?.CMS === 'R'}
                      id="contentRadio1"
                      label="Active"
                      name="contentRadio"
                      onClick={event => handleChange(event, 'Status')}
                      type="radio"
                      value="Y"
                    />
                    <CustomInput
                      checked={contentStatus !== 'Y'}
                      disabled={adminPermission?.CMS === 'R'}
                      id="contentRadio2"
                      label="In Active"
                      name="contentRadio"
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

AddContentForm.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  isCreate: PropTypes.string,
  isEdit: PropTypes.string,
  setIsCreate: PropTypes.func,
  setIsEdit: PropTypes.func,
  setSubmitDisableButton: PropTypes.func,
  adminPermission: PropTypes.string
}

AddContentForm.displayName = AddContentForm
export default connect(null, null, null, { forwardRef: true })(AddContentForm)
