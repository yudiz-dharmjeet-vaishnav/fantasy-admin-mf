import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, CustomInput, FormGroup, Input, Modal, ModalBody, Row, Col, Label, UncontrolledTooltip, ModalHeader } from 'reactstrap'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import infoIcon from '../../../assets/images/info-icon.svg'
import removeImg from '../../../assets/images/ep-close.svg'
import noImage from '../../../assets/images/no-image-1.svg'
import editIcon from '../../../assets/images/edit-button.svg'
import uplaodIcon from '../../../assets/images/upload-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'
import deleteIcon from '../../../assets/images/delete-button.svg'
import documentPlaceholder from '../../../assets/images/doc-placeholder.jpg'

import Loading from '../../../components/Loading'
import SkeletonTable from '../../../components/SkeletonTable'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import { acceptFormat, isFloat, isNumber, isPositive, modalMessageFunc, verifyLength } from '../../../helpers/helper'
import { getUrl } from '../../../actions/url'
import { addLeaguePrice, updateLeaguePrice, deletePrizeBreaup } from '../../../actions/league'

function LeaguePrizeList (props) {
  const {
    List, getList, showInputFields, leaguePrizeBreakupModal, toggleModal, openModalAnayltics, isEdit, setIsEdit, setLeaguePrizeBreakupModal
  } = props
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [close, setClose] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)

  const [addPrize, setAddPrize] = useState('')
  const [addRankFrom, setAddRankFrom] = useState('')
  const [addRankTo, setAddRankTo] = useState('')
  const [addRankType, setAddRankType] = useState('R')
  const [addPrizeBreakUpImage, setAddPrizeBreakUpImage] = useState('')
  const [addExtra, setAddExtra] = useState('')
  const [addPrizeErr, setAddPrizeErr] = useState('')
  const [addRankFromErr, setAddRankFromErr] = useState('')
  const [addRankToErr, setAddRankToErr] = useState('')
  const [addExtraErr, setAddExtraErr] = useState('')

  const [prize, setPrize] = useState('')
  const [rankFrom, setRankFrom] = useState('')
  const [rankTo, setRankTo] = useState('')
  const [rankType, setRankType] = useState('R')
  const [prizeBreakUpImage, setPrizeBreakUpImage] = useState('')
  const [extra, setExtra] = useState('')
  const [prizeErr, setPrizeErr] = useState('')
  const [prizeBreakUpImageErr, setPrizeBreakUpImageErr] = useState('')
  const [rankFromErr, setRankFromErr] = useState('')
  const [rankToErr, setRankToErr] = useState('')
  const [extraErr, setExtraErr] = useState('')
  const [prizeBreakUpData, setPrizeBreakUpData] = useState({})
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch('')
  const [leagueLoading, setLeagueLoading] = useState(false)
  const LeagueAnalytics = useSelector(
    (state) => state.league.LeagueAnalyticsList
  )

  const isDeletedPrizeBreakup = useSelector(state => state.league.isDeletedPrizeBreakup)
  const token = useSelector((state) => state.auth.token)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resStatus = useSelector(state => state.league.resStatus)
  const resMessage = useSelector(state => state.league.resMessage)
  const LeagueDetails = useSelector(state => state.league.LeagueDetails)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const previousProps = useRef({ List, resMessage, resStatus, isDeletedPrizeBreakup }).current
  const [modalMessage, setModalMessage] = useState(false)

  useEffect(() => {
    if (LeagueAnalytics) {
      setLeagueLoading(false)
    }
  }, [LeagueAnalytics])

  // to set leaguePrizeBreakupModal
  useEffect(() => {
    if (leaguePrizeBreakupModal) {
      setPrizeBreakUpImageErr('')
      setPrizeErr('')
      setRankFromErr('')
      setRankToErr('')
      setExtraErr('')

      setAddPrizeErr('')
      setAddRankFromErr('')
      setAddRankToErr('')
      setAddExtraErr('')
    }
  }, [leaguePrizeBreakupModal])

  useEffect(() => {
    if (location.state) {
      if (location.state.message) {
        setMessage(location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      navigate(location.pathname, { replace: true })
    }
    setLoading(true)
    getList(id)
    dispatch(getUrl('media'))
  }, [])

  useEffect(() => {
    List && setLoading(false)
  }, [List])

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
        if (resStatus) {
          getList(id)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setLoader(false)
          setIsEdit(false)
          setPrizeBreakUpData({})
        } else {
          getList(id)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setLoading(false)
          setLoader(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.isDeletedPrizeBreakup !== isDeletedPrizeBreakup) {
      if (isDeletedPrizeBreakup) {
        getList(id)
      }
    }
    return () => {
      previousProps.isDeletedPrizeBreakup = isDeletedPrizeBreakup
    }
  }, [resStatus, isDeletedPrizeBreakup])

  function warningWithDeleteMessage (Id) {
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  function onDelete () {
    dispatch(deletePrizeBreaup(id, deleteId, token))
    toggleWarning()
    setLoading(true)
  }

  function addHandleChange (event, type) {
    switch (type) {
      case 'ImagePrizeBreakup':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setPrizeBreakUpImageErr('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setAddPrizeBreakUpImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setPrizeBreakUpImageErr('')
        }
        if (addRankType !== 'E' && !event.target.files[0]) {
          setPrizeBreakUpImageErr('Required Field')
        }
        break
      case 'RemoveImage':
        setAddPrizeBreakUpImage('')
        break
      case 'Prize':
        if (!event.target.value) {
          setAddPrizeErr('Required field')
        } else if (event.target.value < 0) {
          setAddPrizeErr('Negative value is Not Valid')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            setAddPrizeErr('Enter number only')
          } else {
            setAddPrizeErr('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          if (LeagueDetails?.bPoolPrize && event.target.value > 100) {
            setAddPrizeErr('Value must be less than 100')
          } else {
            setAddPrizeErr('')
          }
        }
        setAddPrize(event.target.value)
        break
      case 'RankFrom':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setAddRankFromErr('')
          } else {
            setAddRankFromErr('Required field')
          }
          setAddRankFrom(event.target.value)
          if (parseInt(addRankTo) && parseInt(event.target.value) > parseInt(addRankTo)) {
            setAddRankFromErr('Rank From value should be less than Rank To value')
          } else if (parseInt(event.target.value) > LeagueDetails?.nWinnersCount) {
            setAddRankFromErr('Value must be less than WinnersCount')
          } else {
            setAddRankFromErr('')
            setAddRankToErr('')
          }
        }
        break
      case 'RankTo':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setAddRankToErr('')
          } else {
            setAddRankToErr('Required field')
          }
          setAddRankTo(event.target.value)
          if (parseInt(event.target.value) > LeagueDetails?.nWinnersCount) {
            setAddRankToErr('Value must be less than WinnersCount')
          } else if (parseInt(addRankFrom) > parseInt(event.target.value)) {
            setAddRankToErr('Rank To value should be greater than Rank From value')
          } else {
            setAddRankToErr('')
            setAddRankFromErr('')
          }
        }
        break
      case 'Extra':
        if (verifyLength(event.target.value, 1)) {
          setAddExtraErr('')
        } else {
          setAddExtraErr('Required field')
        }
        setAddExtra(event.target.value)
        break
      case 'RankType':
        if (event.target.value === 'E') {
          setAddExtra('')
          setAddPrizeBreakUpImage('')
          setAddPrize(0)
          setAddPrizeErr('')
        } else {
          setAddExtraErr('')
        }
        setAddRankType(event.target.value)
        break
      default:
        break
    }
  }

  // for
  function handleChange (event, type) {
    switch (type) {
      case 'ImagePrizeBreakup':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setPrizeBreakUpImageErr('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setPrizeBreakUpImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setPrizeBreakUpImageErr('')
        }
        break
      case 'RemoveImage':
        setPrizeBreakUpImage('')
        break
      case 'Prize':
        if (!event.target.value) {
          setPrizeErr('Required field')
        } else if (event.target.value < 0) {
          setPrizeErr('Negative Value is Not a Valid')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            setPrizeErr('Enter number only')
          } else {
            setPrizeErr('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          if (LeagueDetails?.bPoolPrize && event.target.value > 100) {
            setPrizeErr('Value must be less than 100')
          } else {
            setPrizeErr('')
          }
        }
        setPrize(event.target.value)
        break
      case 'RankFrom':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setRankFromErr('')
          } else {
            setRankFromErr('Required field')
          }
          setRankFrom(event.target.value)
          if (parseInt(rankTo) && parseInt(event.target.value) > parseInt(rankTo)) {
            setRankFromErr('Rank From value should be less than Rank To value')
          } else if (parseInt(event.target.value) > LeagueDetails?.nWinnersCount) {
            setRankFromErr('Value must be less than WinnersCount')
          } else {
            setRankFromErr('')
            setRankToErr('')
          }
        }
        break
      case 'RankTo':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setRankToErr('')
          } else {
            setRankToErr('Required field')
          }
          setRankTo(event.target.value)
          if (parseInt(event.target.value) > LeagueDetails?.nWinnersCount) {
            setRankToErr('Value must be less than WinnersCount')
          } else if (parseInt(rankFrom) > parseInt(event.target.value)) {
            setRankToErr('Rank To value should be greater than Rank From value')
          } else {
            setRankToErr('')
            setRankFromErr('')
          }
        }
        break
      case 'Extra':
        if (verifyLength(event.target.value, 1)) {
          setExtraErr('')
        } else {
          setExtraErr('Required field')
        }
        setExtra(event.target.value)
        break
      case 'RankType':
        if (event.target.value === 'E') {
          setExtra('')
          setPrizeBreakUpImage('')
          setPrize(0)
          setPrizeErr('')
        } else if ((event.target.value === 'R') || (event.target.value === 'B')) {
          setExtra('')
          setPrizeBreakUpImage('')
          if (prize === 0) {
            setPrizeErr('Required field')
          }
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

  function handleClick (e) {
    e.preventDefault()
    const addValidation = isFloat(addPrize) && isNumber(addRankFrom) && isNumber(addRankTo) && (parseInt(addRankFrom) <= parseInt(addRankTo)) && addRankType && !addPrizeErr && !addRankFromErr && !addRankToErr
    const validate = addRankType === 'E' ? (addValidation && verifyLength(addExtra, 1)) : (addValidation && (addPrize > 0))
    if (validate) {
      const addLeaguePriceData = {
        price: addPrize, rFrom: addRankFrom, rTo: addRankTo, rType: addRankType, extra: addExtra, PrizeBreakupImage: addPrizeBreakUpImage, ID: id, token
      }
      dispatch(addLeaguePrice(addLeaguePriceData))
      setLoader(true)
      setAddPrize(0)
      setAddRankFrom(0)
      setAddRankTo(0)
      setAddRankType('R')
      setAddExtra('')
      setAddPrizeBreakUpImage('')
      setLeaguePrizeBreakupModal(false)
    } else {
      if (addRankType !== 'E' && isNaN(addPrize)) {
        setAddPrizeErr('Enter number only')
      } else if (addRankType !== 'E' && (!isFloat(addPrize) || addPrize <= 1)) {
        setAddPrizeErr(addPrizeErr)
      }
      if (parseInt(addRankTo) < parseInt(addRankFrom)) {
        setAddRankToErr('Rank To value should be greater than Rank From value')
      }
      if (!isPositive(addRankFrom)) {
        setAddRankFromErr('Required field')
      }
      if (!isPositive(addRankTo)) {
        setAddRankToErr('Required field')
      }
      if (addRankType === 'E' && !verifyLength(addExtra, 1)) {
        setAddExtraErr('Required field')
      }
      if (addRankType === 'E' && !prizeBreakUpImage) {
        setPrizeBreakUpImageErr('Required field')
      } else {
        setPrizeBreakUpImageErr('')
      }
    }
  }

  function setEdit (data) {
    setIsEdit(true)
    setPrizeBreakUpData(data)
    setPrize(data?.nPrize || 0)
    setRankFrom(data?.nRankFrom)
    setRankTo(data?.nRankTo)
    setRankType(data?.eRankType)
    setExtra(data?.sInfo || '')
    setPrizeBreakUpImage(data?.sImage || '')
    openModalAnayltics(data?._id)
  }

  // to set inputFields
  useEffect(() => {
    if (!showInputFields) {
      setAddPrizeErr('')
      setAddRankFromErr('')
      setAddRankToErr('')
      setAddExtraErr('')
    }
  }, [showInputFields])

  function updatePrizeBreakup () {
    const updateValidation = isFloat(prize) && isNumber(rankFrom) && isNumber(rankTo) && (parseInt(rankFrom) <= parseInt(rankTo)) && rankType && !prizeErr && !rankFromErr && !rankToErr
    const validate = rankType === 'E' ? (updateValidation && verifyLength(extra, 1)) : (updateValidation && (prize > ''))
    if (validate) {
      const updatePrizeBreakupData = {
        PrizeBreakupImage: prizeBreakUpImage,
        rFrom: parseInt(rankFrom),
        rTo: parseInt(rankTo),
        price: prize,
        rType: rankType,
        extra: extra,
        ID1: id,
        ID2: prizeBreakUpData._id,
        token
      }
      dispatch(updateLeaguePrice(updatePrizeBreakupData))
      setEdit(false)
      setLoader(true)
      setPrize('')
      setRankFrom('')
      setRankTo('')
      setRankType('')
      setExtra('')
      setPrizeBreakUpImage('')
      setLeaguePrizeBreakupModal(false)
    } else {
      if (rankType !== 'E' && isNaN(prize)) {
        setPrizeErr('Enter number only')
      } else if (rankType !== 'E' && (!isFloat(prize) || prize <= 1)) {
        setPrizeErr(prizeErr)
      }
      if (parseInt(rankTo) < parseInt(rankFrom)) {
        setRankToErr('Rank To value should be greater than Rank From value')
      }
      if (!isPositive(rankFrom)) {
        setRankFromErr('Required field')
      }
      if (!isPositive(rankTo)) {
        setRankToErr('Required field')
      }
      if (!verifyLength(extra, 1)) {
        setExtraErr('Required field')
      }
    }
  }
  return (
    <Fragment>
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      {loader && <Loading />}
      {showInputFields && (
        <Fragment>
          <Row>
            <Col lg='2' md='4'>
              <FormGroup>
                <Label>Prize</Label>
                <Input disabled={addRankType === 'E'} onChange={(e) => addHandleChange(e, 'Prize')} placeholder='Prize' value={addPrize} />
                <p className="error-text">{addPrizeErr}</p>
              </FormGroup>
            </Col>
            <Col lg='2' md='4'>
              <FormGroup>
                <Label>Rank From</Label>
                <Input onChange={(e) => addHandleChange(e, 'RankFrom')} placeholder='Rank From' value={addRankFrom} />
                <p className="error-text">{addRankFromErr}</p>
              </FormGroup>
            </Col>
            <Col lg='2' md='4'>
              <FormGroup>
                <Label>Rank To</Label>
                <Input onChange={(e) => addHandleChange(e, 'RankTo')} placeholder='Rank To' value={addRankTo} />
                <p className="error-text">{addRankToErr}</p>
              </FormGroup>
            </Col>
            <Col lg='2' md='4'>
              <FormGroup>
                <Label>Rank Type</Label>
                <CustomInput
                  className='editable-select'
                  id='RankType'
                  name='RankType'
                  onChange={(e) => addHandleChange(e, 'RankType')}
                  type='select'
                  value={addRankType}
                >

                  <option value="R"> RealMoney </option>
                  <option value="B"> Bonus </option>
                  {(!LeagueDetails?.bPoolPrize) && <option value="E">Extra </option>}
                </CustomInput>
              </FormGroup>
            </Col>
            <Col lg='2' md='4'>
              <FormGroup>
                <Label>Info</Label>
                <Input disabled={addRankType !== 'E'} onChange={(e) => addHandleChange(e, 'Extra')} placeholder='Info' type='text' value={addExtra} />
                <p className="error-text">{addExtraErr}</p>
              </FormGroup>
            </Col>
            <Col lg='2' md='4'>
              <FormGroup>
                <div className="theme-image text-center">
                  <div className="d-flex theme-photo">

                    <img alt="Extra Image" height={50} onError={onImageError} src={addPrizeBreakUpImage ? addPrizeBreakUpImage.imageURL ? addPrizeBreakUpImage.imageURL : url + addPrizeBreakUpImage : documentPlaceholder} width={50} />
                  </div>
                  {((Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE === 'W')) && addRankType === 'E' &&
                    <CustomInput accept={acceptFormat} id="exampleCustomFileBrowser" name="customFile" onChange={event => addHandleChange(event, 'ImagePrizeBreakup')} type="file" />}
                </div>
                <p className="error-text">{prizeBreakUpImageErr}</p>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup className='text-center'>
            <Button className="theme-btn" onClick={handleClick}>Add</Button>
          </FormGroup>
        </Fragment>
      )}

      {
      !loading && List?.length === 0
        ? (
          <DataNotFound message="League Prize" obj=""/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="prize-breakup-table">
                <thead>
                  <tr>
                    <th> No. </th>
                    <th> Image </th>
                    <th>
                      {' '}
                      Prize
                      <img className='custom-info' id='prize' src={infoIcon} />
                      <UncontrolledTooltip className="bg-default-prize-breakup" delay={0} placement="right-center" target="prize" >
                        <h3>Pool Prize</h3>
                        <p className='first-p'>If pool prize is turned on, the prize breakup amount will be measured in percentage instead of real money.</p>
                        <p className='second-p'>Formula -</p>
                        <p className='third-p'> nTotalPayout = (nPrice * totalUsers * 100) / ((nDeductPercent || 0) + 100)</p>
                        <p className='third-p'>winning Amount = (nTotalPayout * nPrize) / 100) / (nRankTo - nRankFrom + 1)</p>
                        <p className='fourth-p'>Note - If multiple users get the same rank, then the win amount will be divided between them.</p>
                      </UncontrolledTooltip>
                    </th>
                    <th> Rank From </th>
                    <th> Rank To </th>
                    <th> Rank Type </th>
                    <th> Info </th>
                    <th> Actions  </th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={8} />
                    : (
                      <Fragment>
                        {
                    List && List.length !== 0 && List.sort((a, b) => a.nRankFrom > b.nRankFrom ? 1 : -1).map((data, i) => (
                      <tr key={data._id}>
                        <td>{i + 1}</td>
                        <td className='editable-text'>
                          {
                             data.sImage
                               ? <img alt="Extra Image" className="rounded-circle" height={46} src={url + data?.sImage} width={46} />
                               : <img alt="League Category Image" className='l-cat-img' src={noImage} />}
                        </td>
                        <td className='editable-text'>{data.nPrize || 0}</td>
                        <td className='editable-text'><div>{data.nRankFrom}</div></td>
                        <td className='editable-text'><div>{data.nRankTo}</div></td>
                        <td className='editable-select-league'>
                          <Fragment>
                            <Fragment>{data.eRankType === 'R' ? ' Real Money ' : ''}</Fragment>
                            <Fragment>{data.eRankType === 'B' ? 'Bonus' : ''}</Fragment>
                            <Fragment>{data.eRankType === 'E' ? 'Extra' : ''}</Fragment>
                          </Fragment>
                        </td>
                        <td className='editable-text'><div>{data.sInfo || ' - '}</div></td>
                        <td className='editable-field-league'>
                          <ul className="action-list mb-0 d-flex">
                            <li className='action-btn'>
                              <Button className='edit-btn-icon' color="link" disabled={adminPermission?.LEAGUE === 'R'} onClick={() => setEdit(data)}>
                                <span><img alt="View" src={editIcon} /></span>
                              </Button>
                            </li>
                            {((Auth && Auth === 'SUPER') ||
                              (adminPermission?.LEAGUE !== 'R')) && (
                                <li>
                                  <Button className='delete-btn-icon' color='link' onClick={() => warningWithDeleteMessage(data._id, 'delete')}>
                                    <span><img alt='Delete' src={deleteIcon} /></span>
                                  </Button>
                                </li>
                            )}
                          </ul>
                        </td>
                      </tr>
                    ))
                  }
                      </Fragment>
                      )
            }
                </tbody>
              </table>
            </div>
          </div>
          )}
      {
        leagueLoading
          ? <Loading />
          : (
            <Modal className="modal-league-analytics" isOpen={leaguePrizeBreakupModal} toggle={toggleModal}>
              <ModalHeader className='popup-modal-header modal-title-head' toggle={toggleModal}>
                {isEdit ? 'Edit League Prize BreakUp' : 'Add League Prize Breakup'}
                {' '}
              </ModalHeader>
              <ModalBody className="text-center modal-prize-popup p-4 theme-image" >
                <div className='league-prize-popup-modal theme-photo'>
                  <div className='d-flex flex-column theme-photo league-prize-popup-modal'>
                    <div className={(isEdit ? prizeBreakUpImage : addPrizeBreakUpImage) ? 'league-prize-popup-modal-first theme-img' : 'league-prize-popup-modal-first theme-img-default'}>
                      {
                              isEdit
                                ? (
                                  <>
                                    <img alt='upload photo' className={prizeBreakUpImage ? 'custom-img' : 'custom-img-default'} onError={onImageError} src={prizeBreakUpImage ? prizeBreakUpImage.imageURL ? prizeBreakUpImage?.imageURL : url + prizeBreakUpImage : uplaodIcon} />
                                    {prizeBreakUpImage && ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveImage')} src={removeImg} /></div>}

                                  </>
                                  )
                                : (
                                  <>
                                    <img alt='upload photo' className={addPrizeBreakUpImage ? 'custom-img' : 'custom-img-default'} onError={onImageError} src={addPrizeBreakUpImage ? addPrizeBreakUpImage.imageURL ? addPrizeBreakUpImage?.imageURL : url + addPrizeBreakUpImage : uplaodIcon} />
                                    {addPrizeBreakUpImage && ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM === 'W')) && <div className='remove-img-label'><img onClick={event => addHandleChange(event, 'RemoveImage')} src={removeImg} /></div>}

                                  </>
                                  )
                            }
                      {isEdit
                        ? (
                          <>
                            {
                    ((Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE === 'W')) && rankType === 'E' &&
                      <CustomInput accept={acceptFormat} id="exampleCustomFileBrowser" name="customFile" onChange={event => handleChange(event, 'ImagePrizeBreakup')} type="file" />
                    }
                          </>
                          )
                        : (
                          <>
                            {
                    ((Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE === 'W')) && addRankType === 'E' &&
                      <CustomInput accept={acceptFormat} id="exampleCustomFileBrowser" name="customFile" onChange={event => addHandleChange(event, 'ImagePrizeBreakup')} type="file" />
                    }

                          </>
                          )}
                    </div>
                    <p className="error-text">{prizeBreakUpImageErr}</p>
                  </div>
                  <div className='league-prize-popup-modal-second text-align-left '>
                    <Row className='mt-2'>
                      <Col md='6' xl='6'>
                        <Label className='pop-up-label'>Prize</Label>
                        {isEdit
                          ? (
                            <>
                              <Input className='prize-pop-input' disabled={rankType === 'E'} onChange={(e) => handleChange(e, 'Prize')} type='text' value={prize} />
                              <p className="error-text">{prizeErr}</p>
                            </>
                            )
                          : (
                            <>
                              <Input className='prize-pop-input' disabled={addRankType === 'E'} onChange={(e) => addHandleChange(e, 'Prize')} placeholder='Prize' value={addPrize} />
                              <p className="error-text">{addPrizeErr}</p>
                            </>
                            ) }
                      </Col>
                      <Col md='6' xl='6'>
                        <Label className='pop-up-label'>Rank Type</Label>
                        {isEdit
                          ? (
                            <>
                              <CustomInput
                                className='prize-pop-input'
                                id='RankType'
                                name='RankType'
                                onChange={(e) => handleChange(e, 'RankType')}
                                type='select'
                                value={rankType}
                              >
                                <option value="R"> RealMoney </option>
                                <option value="B"> Bonus </option>
                                {(!LeagueDetails?.bPoolPrize) && <option value="E">Extra </option>}
                              </CustomInput>
                            </>
                            )
                          : (
                            <>
                              <CustomInput
                                className='prize-pop-input'
                                id='RankType'
                                name='RankType'
                                onChange={(e) => addHandleChange(e, 'RankType')}
                                type='select'
                                value={addRankType}
                              >
                                <option value="">Select prize type</option>
                                <option value="R"> RealMoney </option>
                                <option value="B"> Bonus </option>
                                {(!LeagueDetails?.bPoolPrize) && <option value="E">Extra </option>}
                              </CustomInput>
                            </>
                            )}

                        {/* : <Fragment>
                              <Fragment>
                                {data.eRankType === 'R' ? ' Real Money ' : ''}
                              </Fragment>
                              <Fragment>
                                {data.eRankType === 'B' ? 'Bonus' : ''}
                              </Fragment>
                              <Fragment>
                                {data.eRankType === 'E' ? 'Extra' : ''}
                              </Fragment>
                            </Fragment> */}
                      </Col>
                    </Row>

                    <Row className='mt-4'>
                      <Col md='6' xl='6'>
                        <Label className='pop-up-label'>Rank From</Label>
                        {isEdit
                          ? (
                            <>
                              <Input className='prize-pop-input' onChange={(e) => handleChange(e, 'RankFrom')} placeholder='Rank From' value={rankFrom} />
                              <p className="error-text">{rankFromErr}</p>
                            </>
                            )
                          : (
                            <>
                              <Input className='prize-pop-input' onChange={(e) => addHandleChange(e, 'RankFrom')} placeholder='Rank From' value={addRankFrom} />
                              <p className="error-text">{addRankFromErr}</p>
                            </>
                            )
                    }

                      </Col>
                      <Col md='6' xl='6'>
                        <Label className='pop-up-label'>Rank To</Label>
                        { isEdit
                          ? (
                            <>
                              <Input className='prize-pop-input' onChange={(e) => handleChange(e, 'RankTo')} placeholder='Rank To' value={rankTo} />
                              <p className="error-text">{rankToErr}</p>
                            </>
                            )
                          : (
                            <>
                              <Input className='prize-pop-input' onChange={(e) => addHandleChange(e, 'RankTo')} placeholder='Rank To' value={addRankTo} />
                              <p className="error-text">{addRankToErr}</p>
                            </>
                            )
                     }
                      </Col>
                    </Row>

                    <Row className='mt-4'>
                      <Col md='12' xl='12'>
                        <Label className='pop-up-label'>Info</Label>
                        {isEdit
                          ? (
                            <>
                              <Input className='prize-pop-input' disabled={rankType !== 'E'} onChange={(e) => handleChange(e, 'Extra')} placeholder='Info' type='text' value={extra} />
                              <p className="error-text">{extraErr}</p>
                            </>
                            )
                          : (
                            <>
                              <Input className='prize-pop-input' disabled={addRankType !== 'E'} onChange={(e) => addHandleChange(e, 'Extra')} placeholder='Info' type='text' value={addExtra} />
                              <p className="error-text">{addExtraErr}</p>
                            </>
                            )
                    }
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className='popup-btn-div'>
                  <Row className='mt-4'>
                    <Col className='mt-2' md='12' xl='12'>
                      {isEdit
                        ? (
                          <>
                            <Button className='btn w-100 popup-btn' onClick={updatePrizeBreakup}> Save </Button>
                          </>
                          )
                        : (
                          <>
                            <Button className="btn w-100 popup-btn" onClick={handleClick}>Add</Button>
                          </>
                          )

                 }
                    </Col>
                  </Row>
                </div>
              </ModalBody>
            </Modal>
            )
      }

      <Modal
        className='modal-confirm'
        isOpen={modalWarning}
        toggle={toggleWarning}
      >
        <ModalBody className='text-center'>
          <img alt='check' className='info-icon' src={warningIcon} />
          <h2 className='popup-modal-message'>Are you sure you want to delete it?</h2>
          <Row className='row-12'>
            <Col>
              <Button
                className="theme-btn outline-btn-cancel full-btn-cancel"
                onClick={deleteId ? onCancel : toggleWarning}
                type='submit'
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                className='theme-btn danger-btn full-btn'
                onClick={deleteId && onDelete}
                type='submit'
              >
                Delete It
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

LeaguePrizeList.propTypes = {
  List: PropTypes.array,
  getList: PropTypes.func,
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  showInputFields: PropTypes.bool,
  leaguePrizeBreakupModal: PropTypes.bool,
  toggleModal: PropTypes.func,
  openModalAnayltics: PropTypes.func,
  isEdit: PropTypes.bool,
  setIsEdit: PropTypes.func,
  setLeaguePrizeBreakupModal: PropTypes.func

}

export default LeaguePrizeList
