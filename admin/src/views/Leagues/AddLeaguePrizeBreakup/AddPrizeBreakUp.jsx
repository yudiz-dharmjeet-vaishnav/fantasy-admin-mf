import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { Button, Form, FormGroup, Label, Input, CustomInput, UncontrolledPopover, PopoverBody } from 'reactstrap'
import PropTypes from 'prop-types'

import infoIcon from '../../../assets/images/info-icon.svg'
import documentPlaceholder from '../../../assets/images/doc-placeholder.jpg'

import Loading from '../../../components/Loading'
import AlertMessage from '../../../components/AlertMessage'
import RequiredField from '../../../components/RequiredField'

import { isNumber, isPositive, verifyLength, isFloat, modalMessageFunc, acceptFormat } from '../../../helpers/helper'
import { getUrl } from '../../../actions/url'

function AddPrizeBreakUp (props) {
  const {
    AddNewLeaguePrice, UpdateLeaguePrice, LeaguePriceDetails, cancelLink, LeagueDetails, getLeaguePriceBreakupDetails, getLeagueDetailsFunc
  } = props
  const { id1, id2 } = useParams()
  const [Price, setPrice] = useState(0)
  const [RankFrom, setRankFrom] = useState(0)
  const [RankTo, setRankTo] = useState(0)
  const [RankType, setRankType] = useState('R')
  const [PrizeBreakupImage, setPrizeBreakupImage] = useState('')
  const [Extra, setExtra] = useState('')
  const [errPrice, seterrPrice] = useState('')
  const [errExtra, seterrExtra] = useState('')
  const [errImage, setErrImage] = useState('')
  const [errRankFrom, seterrRankFrom] = useState('')
  const [errRankTo, seterrRankTo] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const resStatus = useSelector(state => state.league.resStatus)
  const resMessage = useSelector(state => state.league.resMessage)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const previousProps = useRef({ LeaguePriceDetails, resStatus, resMessage }).current
  const [modalMessage, setModalMessage] = useState(false)

  // through this condition if there is no changes in at update time submit button will remain disable
  const updateDisable = LeaguePriceDetails && previousProps.LeaguePriceDetails !== LeaguePriceDetails && LeaguePriceDetails.aLeaguePrize[0] &&
          LeaguePriceDetails.aLeaguePrize[0].nPrize === parseInt(Price) && LeaguePriceDetails.aLeaguePrize[0].nRankFrom === parseInt(RankFrom) &&
          LeaguePriceDetails.aLeaguePrize[0].nRankTo === parseInt(RankTo) && LeaguePriceDetails.aLeaguePrize[0].eRankType === RankType &&
          LeaguePriceDetails.aLeaguePrize[0].sInfo === Extra && LeaguePriceDetails.aLeaguePrize[0].sImage === PrizeBreakupImage

  useEffect(() => {
    if (id1 && id2) {
      setLoading(true)
      setIsCreate(false)
    } else {
      setIsEdit(true)
    }
    dispatch(getUrl('media'))
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

  // to handle response and get details
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
            getLeaguePriceBreakupDetails()
            getLeagueDetailsFunc()
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

  //  to set legauePriceDetails
  useEffect(() => {
    if (previousProps.LeaguePriceDetails !== LeaguePriceDetails) {
      if (LeaguePriceDetails && LeaguePriceDetails.aLeaguePrize[0]) {
        setPrizeBreakupImage(LeaguePriceDetails.aLeaguePrize[0].sImage)
        setRankType(LeaguePriceDetails.aLeaguePrize[0].eRankType)
        setExtra(LeaguePriceDetails.aLeaguePrize[0].sInfo)
        setPrice(LeaguePriceDetails.aLeaguePrize[0].nPrize)
        setRankFrom(LeaguePriceDetails.aLeaguePrize[0].nRankFrom)
        setRankTo(LeaguePriceDetails.aLeaguePrize[0].nRankTo)
        setLoading(false)
      }
    }
    return () => {
      previousProps.LeaguePriceDetails = LeaguePriceDetails
    }
  }, [LeaguePriceDetails])

  // forvalidate the field and dispatch action
  function Submit (e) {
    e.preventDefault()
    const addValidation = isFloat(Price) && isNumber(RankFrom) && isNumber(RankTo) && isPositive(RankTo) && (parseInt(RankFrom) <= parseInt(RankTo)) && isPositive(RankFrom) && RankType && !errPrice && !errRankFrom && !errRankTo
    const validate = RankType === 'E' ? (addValidation && verifyLength(Extra, 1)) : (addValidation && (Price > 0))
    if (validate) {
      if (isCreate) {
        AddNewLeaguePrice(Price, RankFrom, RankTo, RankType, Extra, PrizeBreakupImage)
      } else {
        UpdateLeaguePrice(Price, RankFrom, RankTo, RankType, Extra, PrizeBreakupImage)
      }
    } else {
      if (RankType !== 'E' && isNaN(Price)) {
        seterrPrice('Enter number only')
      } else if (RankType !== 'E' && (!isFloat(Price) || Price <= 1)) {
        seterrPrice('Required field')
      }
      if (parseInt(RankTo) < parseInt(RankFrom)) {
        seterrRankTo('Rank To value should be greater than Rank From value')
      }
      if (!isPositive(RankFrom)) {
        seterrRankFrom('Required field')
      }
      if (!isPositive(RankTo)) {
        seterrRankTo('Required field')
      }
      if (!verifyLength(Extra, 1)) {
        seterrExtra('Required field')
      }
    }
  }

  // forhandle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'ImagePrizeBreakup':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setPrizeBreakupImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setErrImage('')
        }
        break
      case 'Price':
        if (!event.target.value) {
          seterrPrice('Required field')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            seterrPrice('Enter number only')
          } else {
            seterrPrice('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          if (LeagueDetails?.bPoolPrize && event.target.value > 100) {
            seterrPrice('Value must be less than 100')
          } else {
            seterrPrice('')
          }
        }
        setPrice(event.target.value)
        break
      case 'RankFrom':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            seterrRankFrom('')
          } else {
            seterrRankFrom('Required field')
          }
          setRankFrom(event.target.value)
          if (parseInt(RankTo) && parseInt(event.target.value) > parseInt(RankTo)) {
            seterrRankFrom('Rank From value should be less than Rank To value')
          } else if (parseInt(event.target.value) > LeagueDetails?.nWinnersCount) {
            seterrRankFrom('Value must be less than WinnersCount')
          } else {
            seterrRankFrom('')
            seterrRankTo('')
          }
        }
        break
      case 'RankTo':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            seterrRankTo('')
          } else {
            seterrRankTo('Required field')
          }
          setRankTo(event.target.value)
          if (parseInt(event.target.value) > LeagueDetails?.nWinnersCount) {
            seterrRankTo('Value must be less than WinnersCount')
          } else if (parseInt(RankFrom) > parseInt(event.target.value)) {
            seterrRankTo('Rank To value should be greater than Rank From value')
          } else {
            seterrRankTo('')
            seterrRankFrom('')
          }
        }
        break
      case 'Extra':
        if (verifyLength(event.target.value, 1)) {
          seterrExtra('')
        } else {
          seterrExtra('Required field')
        }
        setExtra(event.target.value)
        break
      case 'RankType':
        if (event.target.value === 'E') {
          setExtra('')
          setPrizeBreakupImage('')
          setPrice(0)
          seterrPrice('')
        }
        setRankType(event.target.value)
        break
      default:
        break
    }
  }

  // to handle image error occurred during add time
  function onImageError (e) {
    e.target.src = documentPlaceholder
  }

  function heading () {
    if (isCreate) {
      return 'Add League Prize Breakup'
    }
    return !isEdit ? 'Edit League Prize Breakup' : 'View Details'
  }

  function button () {
    if (isCreate) {
      return 'Create League Prize Breakup'
    }
    return !isEdit ? 'Save Changes' : 'Edit League Prize Breakup'
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
        <h2>
          {heading()}
        </h2>
        <Form>
          <FormGroup>
            <Label for="Price">
              Prize
              {' '}
              <RequiredField/>
              {' '}
              <img className='custom-info' id='prize' src={infoIcon} />
              <UncontrolledPopover placement="bottom" target='prize' trigger="legacy">
                <PopoverBody>
                  <p>When league have pool prize the prize money will be in percentage</p>
                </PopoverBody>
              </UncontrolledPopover>
            </Label>
            <Input disabled={(RankType === 'E') || (adminPermission?.LEAGUE === 'R')} name="Price" onChange={event => handleChange(event, 'Price')} placeholder="Price" value={Price} />
            <p className="error-text">{errPrice}</p>
          </FormGroup>
          <FormGroup>
            <Label for="RankFrom">
              Rank From
              {' '}
              <RequiredField/>
            </Label>
            <Input disabled={adminPermission?.LEAGUE === 'R'} name="RankFrom" onChange={event => handleChange(event, 'RankFrom')} placeholder="Rank From" value={RankFrom} />
            <p className="error-text">{errRankFrom}</p>
          </FormGroup>
          <FormGroup>
            <Label for="RankTo">
              Rank To
              {' '}
              <RequiredField/>
            </Label>
            <Input disabled={adminPermission?.LEAGUE === 'R'} name="RankTo" onChange={event => handleChange(event, 'RankTo')} placeholder="RankTo" value={RankTo} />
            <p className="error-text">{errRankTo}</p>
          </FormGroup>
          <FormGroup>
            <Label for="RankType"> Rank Type </Label>
            <CustomInput
              disabled={adminPermission?.LEAGUE === 'R'}
              id="RankType"
              name="select"
              onChange={event => handleChange(event, 'RankType')}
              type="select"
              value={RankType}
            >
              <option value="R"> RealMoney </option>
              <option value="B"> Bonus </option>
              {(!LeagueDetails?.bPoolPrize) && <option value="E"> Extra </option>}
            </CustomInput>
          </FormGroup>
          {
          RankType === 'E'
            ? (
              <div>
                <FormGroup>
                  <Label for="ExtraField">
                    Info
                    {' '}
                    <RequiredField/>
                  </Label>
                  <Input disabled={adminPermission?.LEAGUE === 'R'} name="ExtraField" onChange={event => handleChange(event, 'Extra')} placeholder="Add Extra Field" value={Extra} />
                  <p className="error-text">{errExtra}</p>
                </FormGroup>
                <FormGroup>
                  <div className="theme-image text-center">
                    <div className="d-flex theme-photo">
                      <div className="theme-img">
                        <img alt="themeImage" onError={onImageError} src={PrizeBreakupImage ? PrizeBreakupImage.imageURL ? PrizeBreakupImage.imageURL : url + PrizeBreakupImage : documentPlaceholder} />
                      </div>
                    </div>
                    {((Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE === 'W')) &&
                    <CustomInput accept={acceptFormat} id="exampleCustomFileBrowser" label="Add Prize Breakup image" name="customFile" onChange={event => handleChange(event, 'ImagePrizeBreakup')} type="file" />}
                    <p className="error-text">{errImage}</p>
                  </div>
                </FormGroup>
              </div>
              )
            : ''
          }
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'R')) &&
            (
              <Button className="theme-btn full-btn" disabled={updateDisable} onClick={Submit}>
                {button()}
              </Button>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={cancelLink}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

AddPrizeBreakUp.propTypes = {
  AddNewLeaguePrice: PropTypes.object,
  UpdateLeaguePrice: PropTypes.object,
  LeaguePriceDetails: PropTypes.object,
  match: PropTypes.object,
  cancelLink: PropTypes.string,
  history: PropTypes.object,
  LeagueDetails: PropTypes.object,
  getLeaguePriceBreakupDetails: PropTypes.func,
  getLeagueDetailsFunc: PropTypes.func
}

export default AddPrizeBreakUp
