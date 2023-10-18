import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Form, FormGroup, Label, Input, CustomInput, InputGroupText, Row, Col } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import removeImg from '../../../../assets/images/ep-close.svg'
import documentPlaceholder from '../../../../assets/images/upload-icon.svg'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { acceptFormat, modalMessageFunc, verifyLength, verifyUrl } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'
import { getMatchList } from '../../../../actions/match'
import { getSportsList } from '../../../../actions/sports'
import { getBannerMatchLeagueList } from '../../../../actions/matchleague'
import { addPopupAd, getPopupAdDetails, updatePopupAd } from '../../../../actions/popup'

const AddPopupAd = forwardRef((props, ref) => {
  const { setSubmitDisableButton, Auth, adminPermission } = props
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [Link, setLink] = useState('')
  const [type, setType] = useState('')
  const [adImage, setAdImage] = useState('')
  const [popupAdId, setPopupAdId] = useState('')
  const [platform, setPlatform] = useState('')
  const [errType, setErrType] = useState('')
  const [errPlatform, setErrPlatform] = useState('')
  const [category, setCategory] = useState('')
  const [MatchList, setMatchList] = useState([])
  const [Match, setMatch] = useState('')
  const [LeagueList, setLeagueList] = useState([])
  const [League, setLeague] = useState('')
  const [errCategory, setErrCategory] = useState('')
  const [errMatch, setErrMatch] = useState('')
  const [errLink, setErrLink] = useState('')
  const [errImage, setErrImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [isCreate, setIsCreate] = useState(true)
  const [close, setClose] = useState(false)
  const [adStatus, setAdStatus] = useState('N')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(state => state?.auth?.token)
  const popupAdDetails = useSelector(state => state?.popup?.popupAdDetails)
  const getUrlLink = useSelector(state => state?.url?.getUrl)
  const resStatus = useSelector(state => state?.popup?.resStatus)
  const resMessage = useSelector(state => state?.popup?.resMessage)
  const sportsList = useSelector(state => state?.sports?.sportsList)
  const matchList = useSelector(state => state?.match?.matchList)
  const MatchLeagueList = useSelector(state => state?.matchleague?.bannerMatchLeagueList)
  const previousProps = useRef({ resStatus, resMessage, popupAdDetails, type, category, Match, matchList, League, LeagueList }).current
  const page = JSON?.parse(localStorage?.getItem('queryParams'))
  const [modalMessage, setModalMessage] = useState(false)

  // through this condition if there is no changes in at update time submit button will remain disable
  const submitDisable = popupAdDetails && previousProps?.popupAdDetails !== popupAdDetails && popupAdDetails?.sTitle === title && popupAdDetails?.eType === type &&
  popupAdDetails?.sLink === Link && popupAdDetails?.eStatus === adStatus && popupAdDetails?.ePlatform === platform &&
  ((popupAdDetails?.iMatchId ? popupAdDetails?.iMatchId : '') === Match) && ((popupAdDetails?.iMatchLeagueId ? popupAdDetails?.iMatchLeagueId : '') === League) &&
  ((popupAdDetails?.eCategory ? popupAdDetails?.eCategory : '') === category) && popupAdDetails?.sImage === adImage

  useEffect(() => {
    if (id) {
      // dispatch action to get popup-ads details
      dispatch(getPopupAdDetails(id, token))
      setPopupAdId(id)
      setIsCreate(false)
      setLoading(true)
    }
    dispatch(getUrl('media'))
  }, [])

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
          navigate(`/settings/popup-ads-management${page?.PopupAdsManagement || ''}`, { state: { message: resMessage } })
        }
        setModalMessage(true)
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

  //  get popup-ads type
  useEffect(() => {
    if (previousProps?.type !== type) {
      if (type === 'I') {
        dispatch(getSportsList(token))
        setLoading(true)
      }
    }
    if (sportsList) {
      setLoading(false)
    }
    return () => {
      previousProps.type = type
    }
  }, [type, sportsList])

  useEffect(() => {
    if (category && previousProps?.category !== category) {
      const data = { start: 0, limit: 10, sort: 'dCreatedAt', order: 'desc', search: '', filter: 'U', startDate: '', endDate: '', sportsType: category, provider: '', season: '', format: '', token }
      dispatch(getMatchList(data))
      setLoading(true)
    }
    if (matchList) {
      setLoading(false)
    }
    return () => {
      previousProps.category = category
      previousProps.matchList = matchList
    }
  }, [category, matchList])

  //  set match and get bannerMatchLeagueList
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

  //  set matchList
  useEffect(() => {
    if (previousProps?.matchList !== matchList) {
      if (matchList) {
        setMatchList(matchList?.results || [])
        !matchList?.results && setErrMatch('')
        setLoading(false)
      }
    }
    return () => {
      previousProps.matchList = matchList
    }
  }, [matchList])

  //  set mmatchLegaueList
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

  //  set popup-ads details
  useEffect(() => {
    if (previousProps?.popupAdDetails !== popupAdDetails) {
      if (popupAdDetails) {
        setType(popupAdDetails?.eType || '')
        setLink(popupAdDetails?.sLink || '')
        setAdImage(popupAdDetails?.sImage || '')
        setAdStatus(popupAdDetails?.eStatus || '')
        setCategory(popupAdDetails?.eCategory || '')
        setMatch(popupAdDetails?.iMatchId || '')
        setLeague(popupAdDetails?.iMatchLeagueId || '')
        setPlatform(popupAdDetails?.ePlatform || '')
        setTitle(popupAdDetails?.sTitle || '')
        setLoading(false)
      }
    }
    return () => {
      previousProps.popupAdDetails = popupAdDetails
    }
  }, [popupAdDetails])

  // for handle onChange event
  function handleChange (event, field) {
    switch (field) {
      case 'Title':
        setTitle(event?.target?.value)
        break
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
      case 'Image':
        if ((event?.target?.files[0]?.size / 1024 / 1024)?.toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event?.target?.files[0] && event?.target?.files[0]?.type?.includes('image')) {
          setAdImage({ imageURL: URL.createObjectURL(event?.target?.files[0]), file: event?.target?.files[0] })
          setErrImage('')
        }
        break
      case 'Status':
        setAdStatus(event?.target?.value)
        break
      case 'Type':
        if (verifyLength(event?.target?.value, 1)) {
          setErrType('')
        } else {
          setErrType('Required field')
        }
        setType(event?.target?.value)
        break
      case 'SportsType':
        if (verifyLength(event?.target?.value, 1)) {
          setErrCategory('')
        } else {
          setErrCategory('Required field')
        }
        setCategory(event?.target?.value)
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
      case 'Platform':
        if (event?.target?.value) {
          setErrPlatform('')
        } else {
          setErrPlatform('Required field')
        }
        setPlatform(event?.target?.value)
        break
      case 'RemoveImage':
        setAdImage('')
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
    if (type === 'I') {
      verify = (adImage && category && Match && platform)
    } else if (type === 'E') {
      verify = (verifyLength(Link, 1) && adImage && platform && !errLink)
    }

    if (verify) {
      if (isCreate) {
        const addPopupAdData = {
          title, adImage, type, Link, category, Match, League, platform, adStatus, token
        }
        dispatch(addPopupAd(addPopupAdData))
      } else {
        const updatePopupAdData = {
          popupAdId, title, adImage, type, Link, category, Match, League, platform, adStatus, token
        }
        dispatch(updatePopupAd(updatePopupAdData))
      }
      setLoading(true)
    } else {
      if (type === 'E' && !verifyLength(Link, 1)) {
        setErrLink('Required field')
      }
      if (!type) {
        setErrType('Required field')
      }
      if (!adImage) {
        setErrImage('Required field')
      }
      if (type === 'I' && category === '') {
        setErrCategory('Required field')
      }
      if (MatchList?.length !== 0 && Match === '') {
        setErrMatch('Required field')
      }
      if (!platform) {
        setErrPlatform('Required field')
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
                    <div className={adImage ? 'theme-img' : 'theme-img-default'}>
                      <img
                        alt="themeImage"
                        className={adImage ? 'custom-img' : 'custom-img-default'}
                        onError={onImageError}
                        src={adImage ? adImage?.imageURL ? adImage?.imageURL : url + adImage : documentPlaceholder}
                      />
                      {adImage && ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveImage')} src={removeImg} /></div>}
                      {!adImage && ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM === 'W')) &&
                  (
                  <CustomInput
                    accept={acceptFormat}
                    disabled={adminPermission?.POPUP_ADS === 'R'}
                    hidden={adminPermission?.POPUP_ADS === 'R'}
                    id="exampleCustomFileBrowser"
                    label="Add Theme image"
                    name="customFile"
                    onChange={event => handleChange(event, 'Image')}
                    type="file"
                  />
                  )}
                    </div>
                  </div>
                  {errImage && <p className="error-text">{errImage}</p>}
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col className='mt-3' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="title">Title</Label>
                <Input disabled={adminPermission?.POPUP_ADS === 'R'} name="title" onChange={event => handleChange(event, 'Title')} placeholder="Enter Title" value={title} />
              </FormGroup>
            </Col>

            <Col className='mt-3' md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="type">
                  Type
                  {' '}
                  <RequiredField/>
                </Label>
                <CustomInput
                  className={errType ? 'league-placeholder-error ' : 'form-control'}
                  disabled={adminPermission?.POPUP_ADS === 'R'}
                  name="type"
                  onChange={event => handleChange(event, 'Type')}
                  type="select"
                  value={type}
                >
                  <option value=''>Select type</option>
                  <option value="I">Internal</option>
                  <option value="E">External</option>
                </CustomInput>
                <p className="error-text">{errType}</p>
              </FormGroup>
            </Col>
          </Row>

          {type === 'E'
            ? (
              <Row>
                <Col className='mt-3' md={12} xl={12}>
                  <FormGroup>
                    <Label className='edit-label-setting' for="Name">
                      Link
                      <RequiredField/>
                    </Label>
                    <Input
                      className={errLink ? 'league-placeholder-error ' : 'form-control'}
                      disabled={adminPermission?.POPUP_ADS === 'R'}
                      name="Link"
                      onChange={event => handleChange(event, 'Link')}
                      placeholder="Enter Link"
                      value={Link}
                    />
                    <p className="error-text">{errLink}</p>
                  </FormGroup>
                </Col>
              </Row>
              )
            : ''
          }

          {type === 'I'
            ? (
              <Row>
                <Col className='mt-3' md={12} xl={12}>
                  <FormGroup>
                    <Label className='edit-label-setting'>
                      Sports
                      <RequiredField/>
                    </Label>
                    <CustomInput
                      className={errCategory ? 'league-placeholder-error ' : 'form-control'}
                      disabled={adminPermission?.POPUP_ADS === 'R'}
                      name="category"
                      onChange={event => handleChange(event, 'SportsType')}
                      type="select"
                      value={category}
                    >
                      <option value=''>Select Sports</option>
                      {sportsList && sportsList?.length !== 0 && sportsList?.map(sport =>
                        <option key={sport?._id} value={sport?.sName}>{sport?.sName}</option>)}
                    </CustomInput>
                    <p className="error-text">{errCategory}</p>
                  </FormGroup>
                </Col>
              </Row>
              )
            : ''
          }

          {type === 'I' && category && (
            <Row>
              <Col className='mt-3' md={12} xl={12}>
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
                          className={errMatch ? 'league-placeholder-error ' : 'form-control'}
                          disabled={adminPermission?.POPUP_ADS === 'R'}
                          name="match"
                          onChange={event => handleChange(event, 'Match')}
                          type="select"
                          value={Match}
                        >
                          <option value=''>Select Match</option>
                          {MatchList?.map(match =>
                            <option key={match?._id} value={match?._id}>{match?.sName}</option>)}
                        </CustomInput>
                        )
                      : ''}
                  <p className="error-text">{errMatch}</p>
                </FormGroup>
              </Col>
            </Row>
          )}

          {type === 'I' && category && Match && MatchList?.length !== 0 && (
            <Row >
              <Col className='mt-3' md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting'>League List</Label>
                  {LeagueList && LeagueList?.length === 0
                    ? <InputGroupText>No League Available</InputGroupText>
                    : LeagueList && LeagueList?.length !== 0
                      ? (
                        <CustomInput
                          className="form-control"
                          disabled={adminPermission?.POPUP_ADS === 'R'}
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
            </Row>
          )}

          <Row className='mt-2'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="platform">
                  Platform
                  {' '}
                  <RequiredField/>
                </Label>
                <CustomInput
                  className={errPlatform ? 'league-placeholder-error ' : 'form-control'}
                  disabled={adminPermission?.POPUP_ADS === 'R'}
                  name="type"
                  onChange={event => handleChange(event, 'Platform')}
                  type="select"
                  value={platform}
                >
                  <option value=''>Select Platform</option>
                  <option value="ALL">All</option>
                  <option value="W">Web</option>
                  <option value="A">Android</option>
                  <option value="I">iOS</option>
                </CustomInput>
                <p className="error-text">{errPlatform}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='p-3' >
            <div className='radio-button-div'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting'>Status</Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput
                      checked={adStatus === 'Y'}
                      disabled={adminPermission?.POPUP_ADS === 'R'}
                      id="bannerRadio1"
                      label="Active"
                      name="bannerRadio"
                      onClick={event => handleChange(event, 'Status')}
                      type="radio"
                      value="Y"
                    />
                    <CustomInput
                      checked={adStatus !== 'Y'}
                      disabled={adminPermission?.POPUP_ADS === 'R'}
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

AddPopupAd.defaultProps = {
  history: {}
}

AddPopupAd.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  match: PropTypes.object,
  setSubmitDisableButton: PropTypes.func,
  adminPermission: PropTypes.object,
  Auth: PropTypes.string
}
AddPopupAd.displayName = AddPopupAd
export default connect(null, null, null, { forwardRef: true })(AddPopupAd)
