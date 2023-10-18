import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Form, FormGroup, Label, Input, CustomInput, InputGroupText, Row, Col } from 'reactstrap'
import { connect, useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import removeImg from '../../../../assets/images/ep-close.svg'
import documentPlaceholder from '../../../../assets/images/upload-icon.svg'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { acceptFormat, modalMessageFunc, verifyLength, withoutSpace } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'

const AddTeamForm = forwardRef((props, ref) => {
  const {
    AddNewTeam, TeamDetails, UpdateTeam, isCreate, setIsCreate, setIsEdit, Auth, adminPermission, Name, setName, ShortName, setShortName, setUpdateDisableButton, Key, setKey
  } = props
  const { id } = useParams()
  const navigate = useNavigate()
  const [teamStatus, setTeamStatus] = useState('Y')
  const [Image, setImage] = useState('')
  const [provider, setProvider] = useState('')
  const [errName, seterrName] = useState('')
  const [errShortName, seterrShortName] = useState('')
  const [errImage, seterrImage] = useState('')
  const [url, setUrl] = useState('')
  const [errKey, seterrKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const dispatch = useDispatch()
  const resStatus = useSelector(state => state.team.resStatus)
  const resMessage = useSelector(state => state.team.resMessage)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const previousProps = useRef({ TeamDetails, resStatus, resMessage }).current
  const [modalMessage, setModalMessage] = useState(false)
  const [teamId, setteamId] = useState('')
  const submitDisable = TeamDetails && previousProps.TeamDetails !== TeamDetails && TeamDetails.sName === Name && TeamDetails.sKey === Key && TeamDetails.sShortName === ShortName && TeamDetails.sImage === Image && TeamDetails.eStatus === teamStatus

  useEffect(() => {
    if (id) {
      setteamId(id)
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
    dispatch(getUrl('media'))
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    setUpdateDisableButton(submitDisable)
  }, [submitDisable])

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

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (previousProps.TeamDetails !== TeamDetails) {
      if (TeamDetails) {
        setName(TeamDetails.sName)
        setImage(TeamDetails.sImage)
        setKey(TeamDetails.sKey)
        setShortName(TeamDetails.sShortName)
        setProvider(TeamDetails.eProvider ? TeamDetails.eProvider : '--')
        setTeamStatus(TeamDetails.eStatus)
        setLoading(false)
      }
    }
    return () => {
      previousProps.TeamDetails = TeamDetails
    }
  }, [TeamDetails])

  function Submit (e) {
    if (verifyLength(Name, 1) && verifyLength(ShortName, 1) && verifyLength(Key, 1) && !errName && !errShortName && !errKey) {
      if (isCreate) {
        AddNewTeam(Key, Name, Image, ShortName, teamStatus)
      } else {
        UpdateTeam(teamId, Key, Name, Image, ShortName, teamStatus)
      }
      setLoading(true)
    } else {
      if (!verifyLength(Name, 1)) {
        seterrName('Required field')
      }
      if (!verifyLength(ShortName, 1)) {
        seterrShortName('Required field')
      }
      if (!verifyLength(Key, 1)) {
        seterrKey('Required field')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    Submit
  }))
  function handleChange (event, type) {
    switch (type) {
      case 'Name':
        if (verifyLength(event.target.value, 1)) {
          seterrName('')
        } else {
          seterrName('Required field')
        }
        setName(event.target.value)
        break
      case 'ShortName':
        if (verifyLength(event.target.value, 1)) {
          seterrShortName('')
        } else {
          seterrShortName('Required field')
        }
        setShortName(event.target.value)
        break
      case 'Key':
        if (verifyLength(event.target.value, 1)) {
          if (withoutSpace(event.target.value)) {
            seterrKey('No space')
          } else {
            seterrKey('')
          }
        } else {
          seterrKey('Required field')
        }
        setKey(event.target.value)
        break
      case 'Image':
        if (event.target.files[0]?.type?.includes('image/gif')) {
          seterrImage('Gif not allowed!')
        } else if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          seterrImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          seterrImage('')
        }
        break
      case 'RemoveImage':
        setImage('')
        break
      case 'TeamStatus':
        setTeamStatus(event.target.value)
        break
      default:
        break
    }
  }

  function onImageError (e) {
    e.target.src = documentPlaceholder
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
                    <div className={Image ? 'theme-img' : 'theme-img-default'}>
                      <img alt="themeImage" className={Image ? 'custom-img' : 'custom-img-default'} onError={onImageError} src={Image ? Image.imageURL ? Image.imageURL : url + Image : documentPlaceholder} />
                      {Image && ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveImage')} src={removeImg} /></div>}
                      {((Auth && Auth === 'SUPER') || (adminPermission?.TEAM === 'W')) && <CustomInput accept={acceptFormat} id="exampleCustomFileBrowser" label="Add Team image" name="TamImage" onChange={event => handleChange(event, 'Image')} type="file" />}
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
                <Label className='match-edit-label' for="Name" >
                  Team
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errName ? 'league-placeholder-error' : 'input-box'} disabled={adminPermission?.TEAM === 'R'} name="Name" onChange={event => handleChange(event, 'Name')} placeholder="Team Name" value={Name} />
                <p className="error-text">{errName}</p>
              </FormGroup>
            </Col>
            <Col md={12} xl={6}>

              <FormGroup>
                <Label className='match-edit-label' for="ShortName">
                  Short Name
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errShortName ? 'league-placeholder-error' : 'input-box'} disabled={adminPermission?.TEAM === 'R'} name="ShortName" onChange={event => handleChange(event, 'ShortName')} placeholder="Short Name" value={ShortName} />
                <p className="error-text">{errShortName}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='match-edit-label' for="Key" >
                  Key
                  {' '}
                  <RequiredField/>
                </Label>
                <Input
                  className={errKey ? 'league-placeholder-error' : 'input-box'}
                  disabled={adminPermission?.TEAM === 'R'}
                  name="Key"
                  onChange={event => handleChange(event, 'Key')}
                  placeholder="Key"
                  type="text"
                  value={Key}
                />
                <p className="error-text">{errKey}</p>
              </FormGroup>
            </Col>
            <Col md={12} xl={6}>
              {!isCreate && (
              <FormGroup>
                <Label className='match-edit-label' for="provider">Provider</Label>
                <InputGroupText>{provider}</InputGroupText>
              </FormGroup>
              )}
            </Col>
          </Row>

          <Row className='p-3 mt-2'>
            <div className='radio-button-div'>
              <Col md={6} xl={12}>
                <FormGroup>
                  <Label className='match-edit-label'>Status</Label>
                  <div className="d-flex inline-input">
                    <CustomInput checked={teamStatus === 'Y'} disabled={(adminPermission?.TEAM === 'R')} id="teamRadio1" label="Active" name="teamRadio" onClick={event => handleChange(event, 'TeamStatus')} type="radio" value="Y" />
                    <CustomInput checked={teamStatus !== 'Y'} disabled={(adminPermission?.TEAM === 'R')} id="teamRadio2" label="In Active" name="teamRadio" onClick={event => handleChange(event, 'TeamStatus')} type="radio" value="N" />
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

AddTeamForm.defaultProps = {
  history: {}
}

AddTeamForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  AddNewTeam: PropTypes.func,
  TeamDetails: PropTypes.object,
  cancelLink: PropTypes.string,
  UpdateTeam: PropTypes.func,
  match: PropTypes.object,
  setIsCreate: PropTypes.func,
  setIsEdit: PropTypes.func,
  isEdit: PropTypes.string,
  isCreate: PropTypes.string,
  Auth: PropTypes.string,
  adminPermission: PropTypes.string,
  Name: PropTypes.string,
  setName: PropTypes.func,
  ShortName: PropTypes.string,
  setShortName: PropTypes.func,
  setUpdateDisableButton: PropTypes.func,
  Key: PropTypes.string,
  setKey: PropTypes.func
}

AddTeamForm.displayName = AddTeamForm
export default connect(null, null, null, { forwardRef: true })(AddTeamForm)
