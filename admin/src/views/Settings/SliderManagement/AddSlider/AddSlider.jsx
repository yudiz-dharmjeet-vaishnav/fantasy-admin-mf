import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Form, FormGroup, Label, Input, CustomInput, InputGroupText, Row, Col } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import DecoupledEditor from 'ckeditor5-custom-build/build/ckeditor'
import CKEditor from '@ckeditor/ckeditor5-react'
import PropTypes from 'prop-types'

import removeImg from '../../../../assets/images/ep-close.svg'
import documentPlaceholder from '../../../../assets/images/upload-icon.svg'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { acceptFormat, isNumber, modalMessageFunc, verifyLength, verifyUrl } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'
import { getMatchList } from '../../../../actions/match'
import { getSportsList } from '../../../../actions/sports'
import { getBannerMatchLeagueList } from '../../../../actions/matchleague'
import { addBanner, getBannerDetails, updateBanner } from '../../../../actions/banner'

const AddSliderForm = forwardRef((props, ref) => {
  const { isCreate, setIsEdit, setIsCreate, Auth, adminPermission, setSubmitDisableButton } = props
  const { id } = useParams()
  const [place, setPlace] = useState('')
  const [placeErr, setPlaceErr] = useState('')
  const [Link, setLink] = useState('')
  const [Description, setDescription] = useState('')
  const [bannerType, setBannerType] = useState('')
  const [screen, setScreen] = useState('')
  const [screenErr, setScreenErr] = useState('')
  const [bannerErr, setBannerErr] = useState('')
  const [errLink, setErrLink] = useState('')
  const [errDescription, setErrDescription] = useState('')
  const [bannerImage, setbannerImage] = useState('')
  const [errImage, setErrImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [bannerId, setbannerId] = useState('')
  const [sportsType, setSportsType] = useState('')
  const [MatchList, setMatchList] = useState([])
  const [Match, setMatch] = useState('')
  const [LeagueList, setLeagueList] = useState([])
  const [League, setLeague] = useState('')
  const [position, setPosition] = useState(0)
  const [errSportsType, setErrSportsType] = useState('')
  const [errMatch, setErrMatch] = useState('')
  const [close, setClose] = useState(false)
  const [bannerStatus, setBannerStatus] = useState('N')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(state => state?.auth?.token)
  const bannerDetails = useSelector(state => state?.banner?.bannerDetails)
  const getUrlLink = useSelector(state => state?.url?.getUrl)
  const resStatus = useSelector(state => state?.banner?.resStatus)
  const resMessage = useSelector(state => state?.banner?.resMessage)
  const sportsList = useSelector(state => state?.sports?.sportsList)
  const matchList = useSelector(state => state?.match?.matchList)
  const MatchLeagueList = useSelector(state => state?.matchleague?.bannerMatchLeagueList)
  const previousProps = useRef({ resStatus, resMessage, bannerDetails, bannerType, screen, sportsType, Match, matchList, League, LeagueList })?.current
  const [modalMessage, setModalMessage] = useState(false)

  // through this condition if there is no changes in at update time submit button will remain disable
  const submitDisable = bannerDetails && previousProps?.bannerDetails !== bannerDetails && bannerDetails?.sLink === Link && bannerDetails?.eType === bannerType && bannerDetails?.nPosition === parseInt(position) && bannerDetails?.sDescription === Description && (bannerDetails?.iMatchId ? bannerDetails?.iMatchId : Match === '') && (bannerDetails?.iMatchLeagueId ? bannerDetails?.iMatchLeagueId : League === '') && bannerDetails?.eStatus === bannerStatus && bannerDetails?.eScreen === screen && bannerDetails?.sImage === bannerImage && bannerDetails?.ePlace === place

  useEffect(() => {
    if (id) {
      // dispatch action to get banner(slider) details
      dispatch(getBannerDetails(id, token))
      setbannerId(id)
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

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus && isCreate) {
          navigate('/settings/slider-management', { state: { message: resMessage } })
        } else {
          if (resStatus) {
            setIsEdit(false)
            dispatch(getBannerDetails(id, token))
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

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps?.screen !== screen) {
      if (screen === 'CR') {
        dispatch(getSportsList(token))
        setLoading(true)
      }
    }
    if (sportsList) {
      setLoading(false)
    }
    return () => {
      previousProps.screen = screen
    }
  }, [screen, sportsList])

  useEffect(() => {
    if (sportsType && previousProps?.sportsType !== sportsType) {
      const data = { start: 0, limit: 10, sort: 'dCreatedAt', order: 'desc', search: '', filter: 'U', startDate: '', endDate: '', sportsType, provider: '', season: '', format: '', token }
      dispatch(getMatchList(data))
      setLoading(true)
    }
    if (matchList) {
      setLoading(false)
    }
    return () => {
      previousProps.sportsType = sportsType
      previousProps.matchList = matchList
    }
  }, [sportsType, matchList])

  useEffect(() => {
    if (Match && previousProps?.Match !== Match) {
      dispatch(getBannerMatchLeagueList(Match, token))
      setLoading(true)
    }
    if (MatchLeagueList) {
      setLoading(false)
    }
    return () => {
      previousProps.Match = Match
    }
  }, [Match, MatchLeagueList])

  //  set match list
  useEffect(() => {
    if (previousProps?.matchList !== matchList) {
      if (matchList) {
        setMatchList(matchList?.results || [])
        !matchList.results && setErrMatch('')
        setLoading(false)
      }
    }
    return () => {
      previousProps.matchList = matchList
    }
  }, [matchList])

  //  set matchLegaueList
  useEffect(() => {
    if (previousProps?.MatchLeagueList !== MatchLeagueList) {
      if (MatchLeagueList) {
        setLeagueList(MatchLeagueList)
      }
      setLoading(false)
    }
    return () => {
      previousProps.MatchLeagueList = MatchLeagueList
    }
  }, [MatchLeagueList])

  //  set banner details
  useEffect(() => {
    if (previousProps?.bannerDetails !== bannerDetails) {
      if (bannerDetails) {
        setPlace(bannerDetails?.ePlace)
        setBannerType(bannerDetails?.eType)
        setLink(bannerDetails?.sLink)
        setScreen(bannerDetails?.eScreen)
        setbannerImage(bannerDetails?.sImage)
        setDescription(bannerDetails?.sDescription)
        setBannerStatus(bannerDetails?.eStatus)
        setSportsType(bannerDetails?.eCategory || '')
        setMatch(bannerDetails?.iMatchId || '')
        setLeague(bannerDetails?.iMatchLeagueId || '')
        setPosition(bannerDetails?.nPosition || 0)
        setLoading(false)
      }
    }
    return () => {
      previousProps.bannerDetails = bannerDetails
    }
  }, [bannerDetails])

  // for handle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'Link':
        if (verifyLength(event?.target?.value, 1)) {
          if (!verifyUrl(event?.target?.value)) {
            setErrLink('Invalid link')
          } else {
            setErrLink('')
          }
        } else {
          setErrLink('Required field')
        }
        setLink(event?.target?.value)
        break
      case 'Description':
        if (verifyLength(event?.target?.value, 1)) {
          setErrDescription('')
        } else {
          setErrDescription('Required field')
        }
        setDescription(event?.target?.value)
        break
      case 'Image':
        if ((event?.target?.files[0]?.size / 1024 / 1024)?.toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event?.target?.files[0] && event?.target?.files[0]?.type?.includes('image')) {
          setbannerImage({ imageURL: URL?.createObjectURL(event?.target?.files[0]), file: event?.target?.files[0] })
          setErrImage('')
        }
        break
      case 'Status':
        setBannerStatus(event?.target?.value)
        break
      case 'Place':
        if (!event?.target?.value) {
          setPlaceErr('Required field')
        } else {
          setPlaceErr('')
        }
        setPlace(event?.target?.value)
        break
      case 'Type':
        if (event?.target?.value === 'S') {
          setScreen('D')
          setLink('')
          setBannerErr('')
          if (errImage || errDescription) {
            setErrImage('')
            setErrDescription('')
          }
        } else if (event?.target?.value === 'L') {
          setBannerErr('')
          setScreen('')
          if (errImage || errDescription) {
            setErrImage('')
            setErrDescription('')
            setErrLink('')
          }
        } else {
          setBannerErr('Required field')
          setLink('')
          setScreen('')
        }
        setBannerType(event?.target?.value)
        break
      case 'Screen':
        if (!event?.target?.value) {
          setScreenErr('Required field')
        } else {
          setScreenErr('')
        }
        setScreen(event?.target?.value)
        break
      case 'SportsType':
        if (verifyLength(event?.target?.value, 1)) {
          setErrSportsType('')
        } else {
          setErrSportsType('Required field')
        }
        setSportsType(event?.target?.value)
        setMatch('')
        setLeague('')
        break
      case 'Match':
        if (verifyLength(event?.target?.value, 1)) {
          setErrMatch('')
        } else {
          setErrMatch('Required field')
        }
        setMatch(event?.target?.value)
        setLeague('')
        break
      case 'League':
        setLeague(event?.target?.value)
        break
      case 'Position':
        if (isNumber(event?.target?.value) || !event?.target?.value) {
          setPosition(event?.target?.value)
        }
        break
      case 'RemoveImage' :
        setbannerImage('')
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
    let verify = false
    if (bannerType === 'L') {
      verify = (verifyLength(place, 1) && verifyLength(Link, 1) && verifyLength(Description, 1) && bannerImage && !errLink && !errDescription)
    } else if (bannerType === 'S' && screen === 'CR') {
      verify = verifyLength(place, 1) && verifyLength(Description, 1) && bannerImage && sportsType && Match
    } else {
      verify = (verifyLength(place, 1) && verifyLength(Description, 1) && bannerImage && !errDescription)
    }

    if (verify) {
      if (isCreate) {
        const addBannerData = {
          place, Link, bannerType, Description, bannerStatus, screen, bannerImage, sportsType, Match, League, position, token
        }
        dispatch(addBanner(addBannerData))
      } else {
        const updateBannerData = {
          place, bannerId, Link, bannerType, Description, bannerStatus, screen, bannerImage, sportsType, Match, League, position, token
        }
        dispatch(updateBanner(updateBannerData))
      }
      setLoading(true)
    } else {
      if (!bannerType) {
        setBannerErr('Required field')
      }
      if (!place) {
        setPlaceErr('Required field')
      }
      if (bannerType === 'L' && !verifyLength(Link, 1)) {
        setErrLink('Required field')
      }
      if (!verifyLength(Description, 1)) {
        setErrDescription('Required field')
      }
      if (!bannerImage) {
        setErrImage('Required field')
      }
      if (sportsType === '') {
        setErrSportsType('Required field')
      }
      if (MatchList?.length !== 0 && Match === '') {
        setErrMatch('Required field')
      }
      if (MatchList?.length === 0) {
        setErrMatch('No Upcoming Match Available')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    onSubmit
  }))

  function onEditorChange (evt, editor) {
    if (verifyLength(editor?.getData(), 1)) {
      setErrDescription('')
    } else {
      setErrDescription('Required field')
    }
    setDescription(editor?.getData())
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
                    <div className={ bannerImage ? 'theme-img' : 'theme-img-default'}>
                      <img alt="PlayerImage" className={bannerImage ? 'custom-img' : 'custom-img-default'} onError={onImageError} src={bannerImage ? bannerImage?.imageURL ? bannerImage?.imageURL : url + bannerImage : documentPlaceholder}/>
                      {bannerImage && ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveImage')} src={removeImg} /></div>}
                      {!bannerImage && ((Auth && Auth === 'SUPER') || (adminPermission?.BANNER === 'W')) && !bannerImage &&
              (
              <CustomInput
                abel="Add Theme image"
                accept={acceptFormat}
                id="exampleCustomFileBrowser"
                l
                name="customFile"
                onChange={event => handleChange(event, 'Image')}
                type="file"
              />
              )}
                    </div>
                  </div>
                  <p className="error-text">{errImage}</p>
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="place">
                  Place
                  {' '}
                  <RequiredField/>
                </Label>
                <CustomInput
                  className={placeErr ? 'league-placeholder-error' : 'form-control'}
                  disabled={adminPermission?.BANNER === 'R'}
                  name="place"
                  onChange={event => handleChange(event, 'Place')}
                  type="select"
                  value={place}
                >
                  <option value=''>Select place</option>
                  <option value="H">Home</option>
                  <option value="D">Deposit</option>
                </CustomInput>
                <p className="error-text">{placeErr}</p>
              </FormGroup>
            </Col>

            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="type">
                  Type
                  {' '}
                  <RequiredField/>
                </Label>
                <CustomInput
                  className={bannerErr ? 'league-placeholder-error' : 'form-control'}
                  disabled={adminPermission?.BANNER === 'R'}
                  name="type"
                  onChange={event => handleChange(event, 'Type')}
                  type="select"
                  value={bannerType}
                >
                  <option value=''>Select type</option>
                  <option value="L">Link</option>
                  <option value="S">Screen</option>
                </CustomInput>
                <p className="error-text">{bannerErr}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-2'>
            {bannerType === 'L'
              ? (
                <Col md={12} xl={12}>
                  <FormGroup>
                    <Label className='edit-label-setting' for="Name">
                      Link
                      <RequiredField/>
                    </Label>
                    <Input
                      className={errLink ? 'league-placeholder-error' : 'form-control'}
                      disabled={adminPermission?.BANNER === 'R'}
                      name="Link"
                      onChange={event => handleChange(event, 'Link')}
                      placeholder="Enter Link"
                      value={Link}
                    />
                    <p className="error-text">{errLink}</p>
                  </FormGroup>
                </Col>
                )
              : (
                <Col md={12} xl={12}>
                  <FormGroup>
                    <Label className='edit-label-setting' for="type">
                      Screen
                      <RequiredField/>
                    </Label>
                    <CustomInput
                      className={screenErr ? 'league-placeholder-error' : 'form-control'}
                      disabled={adminPermission?.BANNER === 'R'}
                      name="screen"
                      onChange={event => handleChange(event, 'Screen')}
                      type="select"
                      value={screen}
                    >
                      <option value=''>Select Screen</option>
                      <option value="D">Deposit</option>
                      <option value="S">Share</option>
                      <option value='CR'>Contest Redirect</option>
                    </CustomInput>
                    <p className="error-text">{screenErr}</p>
                  </FormGroup>
                </Col>
                )
          }
          </Row>

          <Row>
            { screen === 'CR' && (
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting'>
                  Sports
                  <RequiredField/>
                </Label>
                <CustomInput
                  className={errSportsType ? 'league-placeholder-error' : 'form-control'}
                  disabled={adminPermission?.BANNER === 'R'}
                  name="sportsType"
                  onChange={event => handleChange(event, 'SportsType')}
                  type="select"
                  value={sportsType}
                >
                  <option value=''>Select Sports</option>
                  {sportsList && sportsList?.length !== 0 && sportsList?.map(sport =>
                    <option key={sport?._id} value={sport?.sName}>{sport?.sName}</option>)}
                </CustomInput>
                <p className="error-text">{errSportsType}</p>
              </FormGroup>
            </Col>
            )}
          </Row>

          <Row>
            {screen === 'CR' && sportsType && (
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting'>
                  Match List
                  <RequiredField/>
                </Label>
                {MatchList && MatchList?.length === 0
                  ? <InputGroupText>No Upcoming Match Available</InputGroupText>
                  : MatchList && MatchList?.length !== 0
                    ? (
                      <CustomInput
                        className={errMatch ? 'league-placeholder-error' : 'form-control'}
                        disabled={adminPermission?.BANNER === 'R'}
                        name="match"
                        onChange={event => handleChange(event, 'Match')}
                        type="select"
                        value={Match}
                      >
                        <option value=''>Select Match</option>
                        {MatchList?.map(data =>
                          <option key={data?._id} value={data?._id}>{data?.sName}</option>)}
                      </CustomInput>
                      )
                    : ''}
                <p className="error-text">{errMatch}</p>
              </FormGroup>
            </Col>
            )}
          </Row>

          <Row>
            {screen === 'CR' && sportsType && Match && MatchList?.length !== 0 && (
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting'>League List</Label>
                {LeagueList && LeagueList?.length === 0
                  ? <InputGroupText>No League Available</InputGroupText>
                  : LeagueList && LeagueList?.length !== 0
                    ? (
                      <CustomInput
                        className="form-control"
                        disabled={adminPermission?.BANNER === 'R'}
                        name="league"
                        onChange={event => handleChange(event, 'League')}
                        type="select"
                        value={League}
                      >
                        <option value=''>Select League</option>
                        {LeagueList?.map(league =>
                          <option key={league?._id} value={league?._id}>{league?.sName}</option>)}
                      </CustomInput>
                      )
                    : ''}
              </FormGroup>
            </Col>
            )}
          </Row>

          <Row className='mt-2'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="position">Position</Label>
                <Input
                  disabled={adminPermission?.BANNER === 'R'}
                  name="position"
                  onChange={event => handleChange(event, 'Position')}
                  placeholder="Position"
                  value={position}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="Info">
                  Description
                  {' '}
                  <RequiredField/>
                </Label>
                <div className={errDescription ? 'ck-border' : ''}>
                  <CKEditor
                    className={errDescription ? 'league-placeholder-error' : 'form-control'}
                    config={{
                      placeholder: 'Enter Description',
                      toolbar: {
                        items: [
                          'heading', '|', 'fontSize', 'fontFamily', '|', 'fontColor', 'fontBackgroundColor', '|', 'bold', 'italic', 'underline',
                          'strikethrough', '|', 'alignment', '|', 'numberedList', 'bulletedList', '|', 'outdent', 'indent', '|', 'todoList', 'imageUpload', 'link',
                          'blockQuote', 'insertTable', 'mediaEmbed', '|', 'undo', 'redo', 'imageInsert', '|']
                      }
                    }}
                    data={Description}
                    disabled={adminPermission?.BANNER === 'R'}
                    editor={DecoupledEditor}
                    onChange={onEditorChange}
                    onInit={(editor) => {
                      editor?.ui?.getEditableElement()?.parentElement?.insertBefore(editor?.ui?.view?.toolbar?.element, editor?.ui?.getEditableElement())
                    }}
                  />
                </div>
                <p className="error-text">{errDescription}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='p-3 mt-2'>
            <div className='radio-button-div'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting'>Status</Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput
                      checked={bannerStatus === 'Y'}
                      disabled={adminPermission?.BANNER === 'R'}
                      id="bannerRadio1"
                      label="Active"
                      name="bannerRadio"
                      onClick={event => handleChange(event, 'Status')}
                      type="radio"
                      value="Y"
                    />
                    <CustomInput
                      checked={bannerStatus !== 'Y'}
                      disabled={adminPermission?.BANNER === 'R'}
                      id="bannerRadio2"
                      label="In Active"
                      name="bannerRadio"
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

AddSliderForm.defaultProps = {
  history: {}
}

AddSliderForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  match: PropTypes.object,
  isEdit: PropTypes.string,
  setIsEdit: PropTypes.func,
  isCreate: PropTypes.string,
  setIsCreate: PropTypes.func,
  adminPermission: PropTypes.object,
  Auth: PropTypes.string,
  setSubmitDisableButton: PropTypes.func
}

AddSliderForm.displayName = AddSliderForm
export default connect(null, null, null, { forwardRef: true })(AddSliderForm)
