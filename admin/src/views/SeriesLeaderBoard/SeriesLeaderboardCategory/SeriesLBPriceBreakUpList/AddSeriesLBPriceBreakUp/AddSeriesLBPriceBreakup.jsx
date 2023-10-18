import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Form, FormGroup, Label, Input, CustomInput } from 'reactstrap'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import documentPlaceholder from '../../../../../assets/images/doc-placeholder.jpg'

import Loading from '../../../../../components/Loading'
import AlertMessage from '../../../../../components/AlertMessage'
import RequiredField from '../../../../../components/RequiredField'

import { isNumber, isPositive, verifyLength, isFloat, modalMessageFunc, acceptFormat } from '../../../../../helpers/helper'
import { getUrl } from '../../../../../actions/url'

function AddSeriesLBPrizeBreakup (props) {
  const {
    AddSeriesPriceBreakup, UpdateSeriesPriceBreakup, seriesLeaderBoardPrizeBreakupDetails, cancelLink
  } = props
  const { id, id2, id3 } = useParams()
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
  const [isCreate, setIsCreate] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const resStatus = useSelector(state => state.seriesLeaderBoard.resStatus)
  const resMessage = useSelector(state => state.seriesLeaderBoard.resMessage)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const previousProps = useRef({ seriesLeaderBoardPrizeBreakupDetails, resStatus, resMessage }).current
  const updateDisable = seriesLeaderBoardPrizeBreakupDetails && previousProps.seriesLeaderBoardPrizeBreakupDetails !== seriesLeaderBoardPrizeBreakupDetails &&
          seriesLeaderBoardPrizeBreakupDetails.nPrize === parseInt(Price) && seriesLeaderBoardPrizeBreakupDetails.nRankFrom === parseInt(RankFrom) &&
          seriesLeaderBoardPrizeBreakupDetails.nRankTo === parseInt(RankTo) && seriesLeaderBoardPrizeBreakupDetails.eRankType === RankType &&
          seriesLeaderBoardPrizeBreakupDetails.sInfo === Extra && seriesLeaderBoardPrizeBreakupDetails.sImage === PrizeBreakupImage

  const [modalMessage, setModalMessage] = useState(false)

  useEffect(() => {
    if (id && id2 && id3) {
      setIsEdit(true)
    } else {
      setIsCreate(true)
    }
    dispatch(getUrl('media'))
  }, [])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

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

  // to set SLB Prize Breakup details
  useEffect(() => {
    if (previousProps.seriesLeaderBoardPrizeBreakupDetails !== seriesLeaderBoardPrizeBreakupDetails) {
      if (seriesLeaderBoardPrizeBreakupDetails) {
        setPrizeBreakupImage(seriesLeaderBoardPrizeBreakupDetails.sImage)
        setRankType(seriesLeaderBoardPrizeBreakupDetails.eRankType)
        setExtra(seriesLeaderBoardPrizeBreakupDetails.sInfo)
        setPrice(seriesLeaderBoardPrizeBreakupDetails.nPrize)
        setRankFrom(seriesLeaderBoardPrizeBreakupDetails.nRankFrom)
        setRankTo(seriesLeaderBoardPrizeBreakupDetails.nRankTo)
      }
    }
    return () => {
      previousProps.seriesLeaderBoardPrizeBreakupDetails = seriesLeaderBoardPrizeBreakupDetails
    }
  }, [seriesLeaderBoardPrizeBreakupDetails])

  function Submit (e) {
    e.preventDefault()
    const addValidation = isFloat(Price) && isNumber(RankFrom) && isNumber(RankTo) && isPositive(RankTo) && (parseInt(RankFrom) <= parseInt(RankTo)) && isPositive(RankFrom) && RankType && !errPrice && !errRankFrom && !errRankTo
    const validate = RankType === 'E' ? (addValidation && verifyLength(Extra, 1)) : addValidation
    if (validate) {
      if (isCreate) {
        AddSeriesPriceBreakup(Price, RankFrom, RankTo, RankType, Extra, PrizeBreakupImage)
      } else {
        UpdateSeriesPriceBreakup(Price, RankFrom, RankTo, RankType, Extra, PrizeBreakupImage)
        setLoading(true)
      }
    } else {
      if (RankType === 'E' && !verifyLength(Extra, 1)) {
        seterrExtra('Required field')
      }
      if (RankType !== 'E' && (!isFloat(Price) || Price < 1)) {
        seterrPrice('Required field')
      }
      if (parseInt(RankTo) > parseInt(RankFrom)) {
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
          seterrPrice('')
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
          if (parseInt(RankTo) && (parseInt(event.target.value) > parseInt(RankTo))) {
            seterrRankFrom('Rank From value should be less than Rank To value')
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
          if (parseInt(RankFrom) && (parseInt(RankFrom) > parseInt(event.target.value))) {
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
        if (event.target.value !== 'E') {
          Extra && setExtra('')
          PrizeBreakupImage && setPrizeBreakupImage('')
        } else {
          Price && setPrice(0)
          errPrice && seterrPrice('')
        }
        setRankType(event.target.value)
        break
      default:
        break
    }
  }

  function onImageError (e) {
    e.target.src = documentPlaceholder
  }

  function heading () {
    if (isCreate) {
      return 'Add SeriesLB PrizeBreakup'
    }
    return !isEdit ? 'Edit SeriesLB PrizeBreakup' : 'View Details'
  }

  function button () {
    if (isCreate) {
      return 'Create SeriesLB PrizeBreakup'
    }
    return !isEdit ? 'Save Changes' : 'Edit SeriesLB PrizeBreakup'
  }

  function PrizeBreakupImageTernary () {
    if (PrizeBreakupImage) {
      return PrizeBreakupImage.imageURL ? PrizeBreakupImage.imageURL : url + PrizeBreakupImage
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
        <h2>
          {heading()}
        </h2>
        <Form>
          <FormGroup>
            <Label for="Price">
              Prize
              {' '}
              <RequiredField/>
            </Label>
            <Input disabled={(RankType === 'E') || (adminPermission?.SERIES_LEADERBOARD === 'R')} name="Price" onChange={event => handleChange(event, 'Price')} placeholder="Price" value={Price} />
            <p className="error-text">{errPrice}</p>
          </FormGroup>
          <FormGroup>
            <Label for="RankFrom">
              Rank From
              {' '}
              <RequiredField/>
            </Label>
            <Input disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} name="RankFrom" onChange={event => handleChange(event, 'RankFrom')} placeholder="Rank From" value={RankFrom} />
            <p className="error-text">{errRankFrom}</p>
          </FormGroup>
          <FormGroup>
            <Label for="RankTo">
              Rank To
              {' '}
              <RequiredField/>
            </Label>
            <Input disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} name="RankTo" onChange={event => handleChange(event, 'RankTo')} placeholder="RankTo" value={RankTo} />
            <p className="error-text">{errRankTo}</p>
          </FormGroup>
          <FormGroup>
            <Label for="RankType"> Rank Type </Label>
            <CustomInput
              disabled={adminPermission?.SERIES_LEADERBOARD === 'R'}
              id="RankType"
              name="select"
              onChange={event => handleChange(event, 'RankType')}
              type="select"
              value={RankType}
            >
              <option value="R"> RealMoney </option>
              <option value="B"> Bonus </option>
              <option value="E"> Extra </option>
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
                  <Input disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} name="ExtraField" onChange={event => handleChange(event, 'Extra')} placeholder="Add Extra Field" value={Extra} />
                  <p className="error-text">{errExtra}</p>
                </FormGroup>
                <FormGroup>
                  <div className="theme-image text-center">
                    <div className="d-flex theme-photo">
                      <div className="theme-img">
                        <img alt="themeImage" className='custom-img' onError={onImageError} src={PrizeBreakupImageTernary()} />
                      </div>
                    </div>
                    {((Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD === 'W')) &&
                    <CustomInput accept={acceptFormat} id="exampleCustomFileBrowser" label="Add Prize Breakup image" name="customFile" onChange={event => handleChange(event, 'ImagePrizeBreakup')} type="file" />}
                    <p className="error-text">{errImage}</p>
                  </div>
                </FormGroup>
              </div>
              )
            : null
          }
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD !== 'R')) &&
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

AddSeriesLBPrizeBreakup.propTypes = {
  AddSeriesPriceBreakup: PropTypes.object,
  UpdateSeriesPriceBreakup: PropTypes.object,
  seriesLeaderBoardPrizeBreakupDetails: PropTypes.object,
  match: PropTypes.object,
  cancelLink: PropTypes.string,
  history: PropTypes.object
}

export default AddSeriesLBPrizeBreakup
