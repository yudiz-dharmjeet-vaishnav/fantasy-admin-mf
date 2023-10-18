import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Form, FormGroup, Label, Input, CustomInput, Row, Col } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import removeImg from '../../../assets/images/ep-close.svg'
import documentPlaceholder from '../../../assets/images/upload-icon.svg'

import Loading from '../../../components/Loading'
import AlertMessage from '../../../components/AlertMessage'
import RequiredField from '../../../components/RequiredField'

import { verifyLength, isNumber, isPositive, modalMessageFunc, acceptFormat } from '../../../helpers/helper'
import { getUrl } from '../../../actions/url'

const AddLeagueCategory = forwardRef((props, ref) => {
  const { AddNewLeagueCategory, UpdateLeagueCategory, LeagueCategoryDetails, setIsEdit, Position, Title, setTitle, setPosition, setSubmitDisableButton } = props

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const [Remark, setRemark] = useState('')
  const [errTitle, seterrTitle] = useState('')
  const [errImage, setErrImage] = useState('')
  const [leagueCategoryImage, setLeagueCategoryImage] = useState('')
  const [errPosition, seterrPosition] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCreate, setIsCreate] = useState(true)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const [url, setUrl] = useState('')
  const resStatus = useSelector((state) => state.leaguecategory.resStatus)
  const resMessage = useSelector((state) => state.leaguecategory.resMessage)
  const getUrlLink = useSelector((state) => state.url.getUrl)
  const adminPermission = useSelector((state) => state.auth.adminPermission)
  const Auth = useSelector((state) => state?.auth?.adminData?.eType)
  const previousProps = useRef({ resStatus, resMessage, LeagueCategoryDetails }).current
  const [modalMessage, setModalMessage] = useState(false)

  // through this condition if there is no changes in at update time submit button will remain disable
  const submitDisable =
    LeagueCategoryDetails &&
    previousProps.LeagueCategoryDetails !== LeagueCategoryDetails &&
    LeagueCategoryDetails.sTitle === Title &&
    LeagueCategoryDetails.sRemark === Remark &&
    LeagueCategoryDetails.nPosition === parseInt(Position) &&
    LeagueCategoryDetails.sImage === leagueCategoryImage

  useEffect(() => {
    if (id) {
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
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus && isCreate) {
          navigate(`${props.cancelLink}`, { state: { message: resMessage } })
        } else {
          if (resStatus) {
            setIsEdit(false)
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

  // set det leagueCategoryDetails
  useEffect(() => {
    if (previousProps.LeagueCategoryDetails !== LeagueCategoryDetails) {
      if (LeagueCategoryDetails) {
        setTitle(LeagueCategoryDetails.sTitle ? LeagueCategoryDetails.sTitle : '')
        setPosition(LeagueCategoryDetails.nPosition ? LeagueCategoryDetails.nPosition : 0)
        setRemark(LeagueCategoryDetails.sRemark ? LeagueCategoryDetails.sRemark : '')
        setLeagueCategoryImage(LeagueCategoryDetails.sImage || '')
        setLoading(false)
      }
    }
    return () => {
      previousProps.LeagueCategoryDetails = LeagueCategoryDetails
    }
  }, [LeagueCategoryDetails])

  // to handle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'Remark':
        setRemark(event.target.value)
        break
      case 'Title':
        if (!event?.target?.value) {
          seterrTitle('Required field')
        } else if (event?.target?.value.trimStart().length === 0) {
          seterrTitle('No Initial Space Allowed')
        } else {
          seterrTitle('')
        }
        setTitle(event.target.value.trimStart())
        break
      case 'Position':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            seterrPosition('')
          } else {
            seterrPosition('Required field')
          }
          setPosition(event.target.value)
        }
        break
      case 'Image':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setLeagueCategoryImage({
            imageURL: URL.createObjectURL(event.target.files[0]),
            file: event.target.files[0]
          })
          setErrImage('')
        }
        break
      case 'RemoveImage':
        setLeagueCategoryImage('')
        break
      default:
        break
    }
  }

  // forvalidate the field and dispatch action
  function onSubmit (e) {
    if (verifyLength(Title, 1) && isPositive(Position) && !errTitle && !errPosition) {
      if (isCreate) {
        AddNewLeagueCategory(Title, Position, Remark, leagueCategoryImage)
      } else {
        UpdateLeagueCategory(Title, Position, Remark, leagueCategoryImage)
      }
      setLoading(true)
    } else {
      if (!verifyLength(Title, 1)) {
        seterrTitle('Required field')
      }
      if (!isPositive(Position)) {
        seterrPosition('Required field')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    onSubmit
  }))

  function leagueCategoryImageTernary () {
    if (leagueCategoryImage) {
      return leagueCategoryImage.imageURL ? leagueCategoryImage.imageURL : url + leagueCategoryImage
    }
    return documentPlaceholder
  }

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
                    <div className={leagueCategoryImage ? 'theme-img' : 'theme-img-default'} >
                      <img alt="themeImage" className={leagueCategoryImage ? 'custom-img' : 'custom-img-default'} src={leagueCategoryImageTernary()} />
                      {leagueCategoryImage &&
                        ((Auth && Auth === 'SUPER') || adminPermission?.LEAGUE === 'W') && (
                          <div className="remove-img-label">
                            <img onClick={(event) => handleChange(event, 'RemoveImage')} src={removeImg}/>
                          </div>
                      )}

                      { !leagueCategoryImage && ((Auth && Auth === 'SUPER') || adminPermission?.LEAGUE === 'W') && (
                      <CustomInput
                        accept={acceptFormat}
                        className={errImage ? 'league-placeholder-error ' : 'league-placeholder'}
                        id="exampleCustomFileBrowser"
                        label="Add Image"
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

          <Row className='mt-3'>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Title">
                  Title
                  {' '}
                  <RequiredField/>
                </Label>
                <Input
                  className={errTitle ? 'league-placeholder-error ' : 'league-placeholder'}
                  disabled={adminPermission?.LEAGUE === 'R'}
                  name="Title"
                  onChange={(event) => handleChange(event, 'Title')}
                  placeholder="Enter Title"
                  type="text"
                  value={Title}
                />
                <p className="error-text">{errTitle}</p>
              </FormGroup>
            </Col>

            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Position">
                  Position
                  {' '}
                  <RequiredField/>
                </Label>
                <Input
                  className={errPosition ? 'league-placeholder-error ' : 'league-placeholder'}
                  disabled={adminPermission?.LEAGUE === 'R'}
                  name="Position"
                  onChange={(event) => handleChange(event, 'Position')}
                  placeholder="Enter Position"
                  type="text"
                  value={Position}
                />
                <p className="error-text">{errPosition}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="Remark">Remark</Label>
                <Input
                  disabled={adminPermission?.LEAGUE === 'R'}
                  name="Remark"
                  onChange={(event) => handleChange(event, 'Remark')}
                  placeholder="Enter Remark"
                  type="text"
                  value={Remark}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <div className="form-footer text-center small-text" />
      </section>
    </main>
  )
})

AddLeagueCategory.propTypes = {
  cancelLink: PropTypes.string,
  AddNewLeagueCategory: PropTypes.func,
  UpdateLeagueCategory: PropTypes.func,
  LeagueCategoryDetails: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  setIsEdit: PropTypes.func,
  Position: PropTypes.string,
  Title: PropTypes.string,
  setPosition: PropTypes.func,
  setTitle: PropTypes.func,
  setSubmitDisableButton: PropTypes.func
}

AddLeagueCategory.displayName = AddLeagueCategory
export default connect(null, null, null, { forwardRef: true })(AddLeagueCategory)
