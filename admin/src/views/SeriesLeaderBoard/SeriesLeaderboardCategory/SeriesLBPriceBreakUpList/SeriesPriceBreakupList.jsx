import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Button, Col, CustomInput, Input, Label, Modal, ModalBody, Row, ModalHeader } from 'reactstrap'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import editIcon from '../../../../assets/images/edit-pen-icon.svg'
import deleteIcon from '../../../../assets/images/delete-bin-icon.svg'
import warningIcon from '../../../../assets/images/error-warning.svg'
import documentPlaceholder from '../../../../assets/images/upload-icon.svg'
import noImage from '../../../../assets/images/no-image-1.svg'
import removeImg from '../../../../assets/images/ep-close.svg'

import Loading from '../../../../components/Loading'
import SkeletonTable from '../../../../components/SkeletonTable'
import AlertMessage from '../../../../components/AlertMessage'
import DataNotFound from '../../../../components/DataNotFound'
import RequiredField from '../../../../components/RequiredField'

import { acceptFormat, isFloat, isNumber, isPositive, modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'
import { addSeriesLBPriceBreakup, deleteSeriesPrizeBreakup, updateSeriesLBPriceBreakup } from '../../../../actions/seriesLeaderBoard'

function SeriesLBPriceBreakUpList (props) {
  const {
    List, getList, showInputFields, addPrizeBreakup, isEdit, setIsEdit
  } = props
  const location = useLocation()
  const navigate = useNavigate()
  const { id2 } = useParams()
  const [addPrize, setAddPrize] = useState('')
  const [addRankFrom, setAddRankFrom] = useState('')
  const [addRankTo, setAddRankTo] = useState('')
  const [addRankType, setAddRankType] = useState('R')
  const [addPrizeBreakUpImage, setAddPrizeBreakUpImage] = useState('')
  const [addExtra, setAddExtra] = useState('')
  const [addPrizeErr, setAddPrizeErr] = useState('')
  const [imagePrizeBrErr, setImagePrizeBrErr] = useState('')
  const [addRankFromErr, setAddRankFromErr] = useState('')
  const [addRankToErr, setAddRankToErr] = useState('')
  const [addRankTypeErr, setAddRankTypeErr] = useState('')
  const [addExtraErr, setAddExtraErr] = useState('')
  const [prize, setPrize] = useState('')
  const [rankFrom, setRankFrom] = useState('')
  const [rankTo, setRankTo] = useState('')
  const [rankType, setRankType] = useState('R')
  const [prizeBreakUpImage, setPrizeBreakUpImage] = useState('')
  const [extra, setExtra] = useState('')
  const [prizeErr, setPrizeErr] = useState('')
  const [rankFromErr, setRankFromErr] = useState('')
  const [rankToErr, setRankToErr] = useState('')
  const [rankTypeErr, setRankTypeErr] = useState('')
  const [extraErr, setExtraErr] = useState('')
  const [prizeBreakUpData, setPrizeBreakUpData] = useState({})
  const [loader, setLoader] = useState(false)

  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [close, setClose] = useState(false)
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const dispatch = useDispatch('')

  const seriesLeaderBoardCategoryDetails = useSelector(state => state.seriesLeaderBoard.seriesLeaderBoardCategoryDetails)
  const isDeletedPrizeBreakup = useSelector(state => state.seriesLeaderBoard.isDeletedPrizeBreakup)
  const token = useSelector(state => state.auth.token)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resStatus = useSelector(state => state.seriesLeaderBoard.resStatus)
  const resMessage = useSelector(state => state.seriesLeaderBoard.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ List, resMessage, resStatus, isDeletedPrizeBreakup }).current
  const [modalMessage, setModalMessage] = useState(false)

  useEffect(() => {
    if (location.state) {
      if (location.state.message) {
        setMessage(location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      navigate(location.pathname, { replace: true })
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
        if (resStatus) {
          getList(id2, token)
          setMessage(resMessage)
          setStatus(resStatus)
          setLoader(false)
          setModalMessage(true)
        } else {
          getList(id2, token)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setLoader(false)
          setLoading(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.List !== List) {
      if (List) {
        setLoading(false)
      }
    }
    return () => {
      previousProps.List = List
    }
  }, [List])

  useEffect(() => {
    if (previousProps.isDeletedPrizeBreakup !== isDeletedPrizeBreakup) {
      if (isDeletedPrizeBreakup) {
        getList(id2)
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
    dispatch(deleteSeriesPrizeBreakup(id2, deleteId, token))
    toggleWarning()
    setLoading(true)
  }

  function addHandleChange (event, type) {
    switch (type) {
      case 'ImagePrizeBreakup':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setImagePrizeBrErr('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setAddPrizeBreakUpImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setImagePrizeBrErr('')
        }
        break
      case 'Prize':
        if (!event.target.value) {
          setAddPrizeErr('Required field')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            setAddPrizeErr('Enter number only')
          } else {
            setAddPrizeErr('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          setAddPrizeErr('')
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
          } else if (parseInt(event.target.value) > seriesLeaderBoardCategoryDetails?.nMaxRank) {
            setAddRankFromErr('Value must be less than Max Rank')
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
          if (parseInt(event.target.value) > seriesLeaderBoardCategoryDetails?.nMaxRank) {
            setAddRankToErr('Value must be less than Max Rank')
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
        if (!verifyLength(event.target.value, 1)) {
          setAddRankTypeErr('Required field')
        } else if (event.target.value === 'E') {
          setAddExtra('')
          setAddPrizeBreakUpImage('')
          setAddPrize(0)
          setAddPrizeErr('')
          setAddRankTypeErr('')
        } else {
          setAddExtraErr('')
          setAddRankTypeErr('')
        }
        setAddRankType(event.target.value)
        break
      case 'RemoveImage':
        setAddPrizeBreakUpImage('')
        break
      default:
        break
    }
  }

  function handleChange (event, type) {
    switch (type) {
      case 'ImagePrizeBreakup':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setImagePrizeBrErr('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setPrizeBreakUpImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setImagePrizeBrErr('')
        }
        break
      case 'Prize':
        if (!event.target.value) {
          setPrizeErr('Required field')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            setPrizeErr('Enter number only')
          } else {
            setPrizeErr('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          if (seriesLeaderBoardCategoryDetails?.bPoolPrize && event.target.value > 100) {
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
          } else if (parseInt(event.target.value) > seriesLeaderBoardCategoryDetails?.nMaxRank) {
            setRankFromErr('Value must be less than Max Rank')
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
          if (parseInt(event.target.value) > seriesLeaderBoardCategoryDetails?.nMaxRank) {
            setRankToErr('Value must be less than Max Rank')
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
          setRankTypeErr('')
        } else if ((event.target.value === 'R') || (event.target.value === 'B')) {
          setExtra('')
          setPrizeBreakUpImage('')
          if (prize === 0) {
            setPrizeErr('Required field')
          }
          setRankTypeErr('')
        } else {
          setRankTypeErr('Required field')
        }
        setRankType(event.target.value)
        break
      case 'RemoveImage':
        setPrizeBreakUpImage('')
        break
      default:
        break
    }
  }

  function onImageError (e) {
    e.target.src = documentPlaceholder
  }

  function handleClick (e) {
    e.preventDefault()
    const addValidation = isFloat(addPrize) && isNumber(addRankFrom) && isNumber(addRankTo) && (parseInt(addRankFrom) <= parseInt(addRankTo)) && verifyLength(addRankType, 1) && !addPrizeErr && !addRankFromErr && !addRankToErr
    const validate = addRankType === 'E' ? (addValidation && verifyLength(addExtra, 1)) : (addValidation && (addPrize > 0))
    if (validate) {
      const addSeriesLBPriceBreakUpData = {
        Prize: addPrize, RankFrom: parseInt(addRankFrom), RankTo: parseInt(addRankTo), RankType: addRankType, Image: addPrizeBreakUpImage, Info: addExtra, seriesLBCategoryID: id2, token
      }
      dispatch(addSeriesLBPriceBreakup(addSeriesLBPriceBreakUpData))
      setLoader(true)
      setAddPrize(0)
      setAddRankFrom(0)
      setAddRankTo(0)
      setAddRankType('R')
      setAddExtra('')
      setAddPrizeBreakUpImage('')
      addPrizeBreakup()
    } else {
      if (!verifyLength(addRankType, 1)) {
        setAddRankTypeErr('Required field')
      }
      if (addRankType !== 'E' && isNaN(addPrize)) {
        setAddPrizeErr('Enter number only')
      } else if (addRankType !== 'E' && (!isFloat(addPrize) || addPrize <= 1)) {
        setAddPrizeErr('Required field')
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
      addPrizeBreakup(true)
    }
  }

  function setEdit (data) {
    setIsEdit(true)
    setPrizeBreakUpData(data)
    setPrize(data.nPrize || 0)
    setRankFrom(data.nRankFrom)
    setRankTo(data.nRankTo)
    setRankType(data.eRankType)
    setExtra(data.sInfo || '')
    setPrizeBreakUpImage(data.sImage || '')
    addPrizeBreakup(true)
  }

  useEffect(() => {
    if (!showInputFields) {
      setAddPrizeErr('')
      setAddRankFromErr('')
      setAddRankToErr('')
      setAddExtraErr('')
      setAddPrize(0)
      setAddRankFrom(0)
      setAddRankTo(0)
      setAddRankType('')
      setAddExtra('')
      setExtraErr('')
      setRankFromErr('')
      setRankToErr('')
      setRankTypeErr('')
      setPrizeErr('')
      setImagePrizeBrErr('')
    }
  }, [showInputFields])

  function updatePrizeBreakup () {
    const updateValidation = isFloat(prize) && isNumber(rankFrom) && isNumber(rankTo) && (parseInt(rankFrom) <= parseInt(rankTo)) && verifyLength(rankType, 1) && !prizeErr && !rankFromErr && !rankToErr
    const validate = rankType === 'E' ? (updateValidation && verifyLength(extra, 1)) : (updateValidation && (prize > ''))
    if (validate) {
      const updateSeriesLBPriceBreakUpData = {
        Prize: prize, RankFrom: parseInt(rankFrom), RankTo: parseInt(rankTo), RankType: rankType, Info: extra, Image: prizeBreakUpImage, seriesLBCategoryID: id2, PriceBreakupId: prizeBreakUpData._id, token
      }
      dispatch(updateSeriesLBPriceBreakup(updateSeriesLBPriceBreakUpData))
      setEdit(false)
      setLoader(true)
      setPrize('')
      setRankFrom('')
      setRankTo('')
      setRankType('')
      setExtra('')
      setPrizeBreakUpImage('')
      setPrizeErr('')
      setRankFromErr('')
      setRankToErr('')
      setRankTypeErr('')
      setRankTypeErr('')
      setExtraErr('')
      addPrizeBreakup()
    } else {
      if (!verifyLength(rankType, 1)) {
        setRankTypeErr('Required field')
      }
      if (rankType !== 'E' && isNaN(prize)) {
        setPrizeErr('Enter number only')
      } else if (rankType !== 'E' && (!isFloat(prize) || prize <= 1)) {
        setPrizeErr('Required field')
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
      addPrizeBreakup(true)
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

      {
      !loading && List?.length === 0
        ? (
          <DataNotFound message="Series Prize Breakups" obj=""/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="prize-breakup-table">
                <thead>
                  <tr>
                    <th> No. </th>
                    <th> Prize </th>
                    <th> Rank From </th>
                    <th> Rank To </th>
                    <th> Rank Type </th>
                    <th> Info </th>
                    <th> Image </th>
                    <th> Actions  </th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={8} />
                    : (
                      <Fragment>
                        {
                    List && List?.length !== 0 && List.sort((a, b) => a.nRankFrom > b.nRankFrom ? 1 : -1).map((data, i) => (
                      <tr key={data._id}>
                        <td>{i + 1}</td>
                        <td>
                          {data.nPrize || 0}
                        </td>
                        <td>
                          <div>{data.nRankFrom}</div>
                        </td>
                        <td>
                          <div>{data.nRankTo}</div>
                        </td>
                        <td>
                          <div>
                            {data.eRankType === 'R' ? ' Real Money ' : ''}
                            {data.eRankType === 'B' ? 'Bonus' : ''}
                            {data.eRankType === 'E' ? 'Extra' : ''}
                          </div>
                        </td>
                        <td>
                          <div>{data.sInfo || '--'}</div>
                        </td>
                        <td>
                          {data.sImage
                            ? <img alt="Extra Image" className='l-cat-img' src={url + data.sImage} />
                            : <img alt='no image' className='l-cat-img' src={noImage}/>}
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>

                              <Button className="edit-btn-icon " color="link" disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} onClick={() => setEdit(data)}>
                                <img alt="View" src={editIcon} />
                              </Button>
                            </li>
                            {((Auth && Auth === 'SUPER') ||
                                (adminPermission?.SERIES_LEADERBOARD !== 'R')) && (
                                <li>
                                  <Button
                                    className='delete-btn-icon ml-1'
                                    color='link'
                                    onClick={() =>
                                      warningWithDeleteMessage(data._id)
                                    }
                                  >
                                    <img alt='Delete' src={deleteIcon} />
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
        loader
          ? <Loading />
          : (
            <Modal className="modal-league-analytics" isOpen={showInputFields} toggle={() => addPrizeBreakup(false)}>
              <ModalHeader className='popup-modal-header modal-title-head' toggle={() => addPrizeBreakup(false)}>
                {isEdit ? 'Edit Series League Prize BreakUp' : 'Add Series League Prize Breakup'}
                {' '}
              </ModalHeader>
              <ModalBody className="text-center modal-prize-popup p-4 theme-image" >
                <div className='league-prize-popup-modal theme-photo'>
                  <div className={(prizeBreakUpImage || addPrizeBreakUpImage) ? 'league-prize-popup-modal-first theme-img' : 'league-prize-popup-modal-first theme-img-default'}>
                    {
                    isEdit
                      ? (
                        <>
                          <img alt='Upload Photo' className={prizeBreakUpImage ? 'custom-img' : 'custom-img-default'} onError={onImageError} src={prizeBreakUpImage ? prizeBreakUpImage?.imageURL ? prizeBreakUpImage?.imageURL : url + prizeBreakUpImage : documentPlaceholder} />
                          {prizeBreakUpImage && ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveImage')} src={removeImg} /></div>}
                        </>
                        )
                      : (
                        <>
                          <img alt='Upload Photo' className={addPrizeBreakUpImage ? 'custom-img' : 'custom-img-default'} onError={onImageError} src={addPrizeBreakUpImage ? addPrizeBreakUpImage?.imageURL ? addPrizeBreakUpImage?.imageURL : url + addPrizeBreakUpImage : documentPlaceholder} />
                          {addPrizeBreakUpImage && ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM === 'W')) && <div className='remove-img-label'><img onClick={event => addHandleChange(event, 'RemoveImage')} src={removeImg} /></div>}
                        </>
                        )
                  }
                    { isEdit
                      ? (
                        <>
                          {((Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE === 'W')) && rankType === 'E' && !prizeBreakUpImage &&
                          <CustomInput accept={acceptFormat} id="exampleCustomFileBrowser" name="customFile" onChange={event => handleChange(event, 'ImagePrizeBreakup')} type="file" />}
                        </>
                        )
                      : (
                        <>
                          {((Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE === 'W')) && addRankType === 'E' && !addPrizeBreakUpImage &&
                          <CustomInput accept={acceptFormat} id="exampleCustomFileBrowser" name="customFile" onChange={event => addHandleChange(event, 'ImagePrizeBreakup')} type="file" />}
                        </>
                        )
                  }
                  </div>
                  <p className="error-text">{imagePrizeBrErr}</p>

                  <div className='league-prize-popup-modal-second text-align-left'>
                    <Row className='mt-2'>
                      <Col md='6' xl='6'>
                        <Label className='pop-up-label'>
                          Prize
                          {(rankType !== 'E' && addRankType !== 'E') && (<RequiredField/>)}
                        </Label>
                        {isEdit
                          ? (
                            <>
                              <Input className={prizeErr ? 'league-placeholder-error' : 'prize-pop-input'} disabled={rankType === 'E'} onChange={(e) => handleChange(e, 'Prize')} type='text' value={prize} />
                              <p className="error-text">{prizeErr}</p>
                            </>
                            )
                          : (
                            <>
                              <Input className={addPrizeErr ? 'league-placeholder-error' : 'prize-pop-input'} disabled={addRankType === 'E'} onChange={(e) => addHandleChange(e, 'Prize')} placeholder='Prize' value={addPrize} />
                              <p className="error-text">{addPrizeErr}</p>
                            </>
                            ) }
                      </Col>
                      <Col md='6' xl='6'>
                        <Label className='pop-up-label'>
                          Rank Type
                          <RequiredField/>
                        </Label>
                        {isEdit
                          ? (
                            <>
                              <CustomInput
                                className={rankTypeErr ? 'league-placeholder-error' : 'prize-pop-input'}
                                id='RankType'
                                name='RankType'
                                onChange={(e) => handleChange(e, 'RankType')}
                                type='select'
                                value={rankType}
                              >
                                <option value="">Select prize type</option>
                                <option value="R"> RealMoney </option>
                                <option value="B"> Bonus </option>
                                <option value="E">Extra </option>
                              </CustomInput>
                              <p className="error-text">{rankTypeErr}</p>
                            </>
                            )
                          : (
                            <>
                              <CustomInput
                                className={addRankTypeErr ? 'league-placeholder-error' : 'prize-pop-input'}
                                id='RankType'
                                name='RankType'
                                onChange={(e) => addHandleChange(e, 'RankType')}
                                type='select'
                                value={addRankType}
                              >
                                <option value="">Select prize type</option>
                                <option value="R"> RealMoney </option>
                                <option value="B"> Bonus </option>
                                <option value="E">Extra </option>
                              </CustomInput>
                              <p className="error-text">{addRankTypeErr}</p>
                            </>
                            )}

                      </Col>
                    </Row>

                    <Row className='mt-4'>
                      <Col md='6' xl='6'>
                        <Label className='pop-up-label'>
                          Rank From
                          <RequiredField/>
                        </Label>
                        {isEdit
                          ? (
                            <>
                              <Input className={rankFromErr ? 'league-placeholder-error' : 'prize-pop-input'} onChange={(e) => handleChange(e, 'RankFrom')} placeholder='Rank From' value={rankFrom} />
                              <p className="error-text">{rankFromErr}</p>
                            </>
                            )
                          : (
                            <>
                              <Input className={addRankFromErr ? 'league-placeholder-error' : 'prize-pop-input' } onChange={(e) => addHandleChange(e, 'RankFrom')} placeholder='Rank From' value={addRankFrom} />
                              <p className="error-text">{addRankFromErr}</p>
                            </>
                            )
                    }

                      </Col>
                      <Col md='6' xl='6'>
                        <Label className='pop-up-label'>
                          Rank To
                          <RequiredField/>
                        </Label>
                        { isEdit
                          ? (
                            <>
                              <Input className={rankToErr ? 'league-placeholder-error' : 'prize-pop-input'} onChange={(e) => handleChange(e, 'RankTo')} placeholder='Rank To' value={rankTo} />
                              <p className="error-text">{rankToErr}</p>
                            </>
                            )
                          : (
                            <>
                              <Input className={addRankToErr ? 'league-placeholder-error' : 'prize-pop-input'} onChange={(e) => addHandleChange(e, 'RankTo')} placeholder='Rank To' value={addRankTo} />
                              <p className="error-text">{addRankToErr}</p>
                            </>
                            )
                     }
                      </Col>
                    </Row>

                    <Row className='mt-4'>
                      <Col md='12' xl='12'>
                        <Label className='pop-up-label'>
                          Info
                          {(isEdit ? rankType === 'E' : addRankType === 'E') && (<RequiredField/>)}
                        </Label>
                        {isEdit
                          ? (
                            <>
                              <Input className={extraErr ? 'league-placeholder-error' : 'prize-pop-input'} disabled={rankType !== 'E'} onChange={(e) => handleChange(e, 'Extra')} placeholder='Info' type='text' value={extra} />
                              <p className="error-text">{extraErr}</p>
                            </>
                            )
                          : (
                            <>
                              <Input className={addExtraErr ? 'league-placeholder-error' : 'prize-pop-input'} disabled={addRankType !== 'E'} onChange={(e) => addHandleChange(e, 'Extra')} placeholder='Info' type='text' value={addExtra} />
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
          <h2 className='popup-modal-message'>Are you sure you want to Delete it?</h2>
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
                onClick={onDelete}
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

SeriesLBPriceBreakUpList.propTypes = {
  List: PropTypes.array,
  getList: PropTypes.func,
  match: PropTypes.object,
  updateSeriesLBPriceBreakup: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  showInputFields: PropTypes.bool,
  addPrizeBreakup: PropTypes.func,
  setIsEdit: PropTypes.func,
  isEdit: PropTypes.bool,
  setShowInputFields: PropTypes.func
}

export default SeriesLBPriceBreakUpList
