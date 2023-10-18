import React, { useEffect, useState, Fragment, useRef, forwardRef, useImperativeHandle } from 'react'
import { Form, FormGroup, Label, Input, InputGroupText, Row, Col } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import { verifyLength, isNumber, isFloat, modalMessageFunc, blockInvalidChar } from '../../../../helpers/helper'
import { getPointSystem, updateScorePoint } from '../../../../actions/pointSystem'

const UpdatePoint = forwardRef((props, ref) => {
  const { setUpdateDisableButton, errPoints, setErrPoints, setMultiDisableButton } = props
  const { id, id1 } = useParams()
  const [message, setMessage] = useState('')
  const [Name, setName] = useState('')
  const [Key, setKey] = useState('')
  const [Points, setPoints] = useState('')
  const [errName, setErrName] = useState('')
  const [Bonus, setBonus] = useState('')
  const [MinValue, setMinValue] = useState('')
  const [RangeFrom, setRangeFrom] = useState('')
  const [RangeTo, setRangeTo] = useState('')
  const [errBonus, setErrBonus] = useState('')
  const [errMinValue, setErrMinValue] = useState('')
  const [errRangeFrom, setErrRangeFrom] = useState('')
  const [errRangeTo, setErrRangeTo] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state.pointSystem.resStatus)
  const resMessage = useSelector(state => state.pointSystem.resMessage)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const scorePointDetails = useSelector(state => state.pointSystem.scorePointDetails)
  const previousProps = useRef({
    resStatus, resMessage, scorePointDetails
  }).current
  const submitDisable = scorePointDetails && previousProps.scorePointDetails !== scorePointDetails && scorePointDetails.nPoint === parseInt(Points) && scorePointDetails.sName === Name
  const multiData = scorePointDetails && scorePointDetails.aPoint && scorePointDetails.aPoint.find(data => data._id === id1)
  const multiUpdate = multiData && multiData.nBonus === Bonus && multiData.nRangeFrom === parseInt(RangeFrom) && multiData.nRangeTo === parseInt(RangeTo) && multiData.nMinValue === MinValue
  useEffect(() => {
    if (id) {
      dispatch(getPointSystem(id, token))
      setLoading(true)
    }
  }, [])

  useEffect(() => {
    setUpdateDisableButton(submitDisable)
    setMultiDisableButton(multiUpdate)
  }, [submitDisable, multiUpdate])
  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        setModalMessage(true)
        setLoading(false)
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.scorePointDetails !== scorePointDetails) {
      if (scorePointDetails) {
        if (id1 && scorePointDetails.aPoint && scorePointDetails.aPoint.length !== 0) {
          const ScorePointsData = scorePointDetails.aPoint.find(data => data._id === id1)
          setBonus(ScorePointsData.nBonus)
          setMinValue(ScorePointsData.nMinValue)
          setRangeFrom(ScorePointsData.nRangeFrom)
          setRangeTo(ScorePointsData.nRangeTo)
        }
        setName(scorePointDetails.sName)
        setKey(scorePointDetails.sKey)
        setPoints(scorePointDetails.nPoint)
        setLoading(false)
      }
    }
    return () => {
      previousProps.scorePointDetails = scorePointDetails
    }
  }, [scorePointDetails])

  function handleChange (event, type) {
    switch (type) {
      case 'Bonus':
        if (isNumber(event.target.value)) {
          setErrBonus('')
        } else {
          setErrBonus('Should be a Number')
        }
        setBonus(event.target.value)
        break
      case 'MinValue':
        if (isNumber(event.target.value)) {
          setErrMinValue('')
        } else {
          setErrMinValue('Should be a Number')
        }
        setMinValue(event.target.value)
        break
      case 'RangeFrom':
        if (isFloat(event.target.value) || (!event.target.value)) {
          if (isFloat(event.target.value) && RangeTo > event.target.value) {
            setErrRangeFrom('')
          } else if (!(event.target.value < RangeTo)) {
            setErrRangeFrom('')
          } else if (!isFloat(event.target.value)) {
            setErrRangeFrom('Should be a Number')
          }
          setRangeFrom(event.target.value)
        }
        break
      case 'RangeTo':
        if (isFloat(event.target.value) || (!event.target.value)) {
          if (isFloat(event.target.value) && event.target.value > RangeFrom) {
            setErrRangeTo('')
          } else if (!(event.target.value > RangeFrom)) {
            setErrRangeTo('')
          } else if (!isFloat(event.target.value)) {
            setErrRangeTo('Should be a Number')
          }
          setRangeTo(event.target.value)
        }
        break
      case 'Name':
        if (verifyLength(event.target.value, 1)) {
          setErrName('')
        } else {
          setErrName('Required field')
        }
        setName(event.target.value)
        break
      case 'Points':
        if ((!isNaN(event.target.value)) || !event.target.value) {
          setErrPoints('')
          if (Points[0] === '-' ? event.target.value.length > 4 : event.target.value.length > 3) {
            setErrPoints('Value must be under 3 digit')
          }
        } else {
          if (event.target.value === '-') {
            setErrPoints('Please enter any number')
          } else {
            setErrPoints('Do not use special characters')
          }
        }
        setPoints(event.target.value)
        break
      default:
        break
    }
  }

  function onSubmit () {
    const verify = Name && Key
    if (verify) {
      const scorePointData = {
        iPointId: id, id: '', Name, Key, Points, Bonus: '', MinValue: '', RangeFrom: '', RangeTo: '', token
      }
      dispatch(updateScorePoint(scorePointData))
    } else {
      if (!Points) {
        setErrPoints('Required field')
      }
    }
  }
  function onInsideSubmit () {
    const verify = Bonus && MinValue && RangeFrom >= 0 && RangeTo >= 0
    if (verify) {
      const scorePointData = {
        iPointId: id, id: id1, Name, Key: '', Points: '', Bonus, MinValue, RangeFrom, RangeTo, token
      }
      dispatch(updateScorePoint(scorePointData))
    } else {
      if (!Bonus) {
        setErrBonus('Required field')
      }
      if (!MinValue) {
        setErrMinValue('Required field')
      }
      if (!RangeFrom) {
        setErrRangeFrom('Required field')
      }
      if (!RangeTo) {
        setErrRangeTo('Required field')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    onSubmit, onInsideSubmit
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
          {
             id && id1
               ? (
                 <Fragment>
                   <Row className='mt-2'>
                     <Col md={12} xl={12}>
                       <FormGroup>
                         <Label className='match-edit-label' for="Name">Name</Label>
                         <Input disabled={adminPermission?.SCORE_POINT === 'R'} name="Link" onChange={event => handleChange(event, 'Name')} placeholder="Enter Name" type='textarea' value={Name} />
                         <p className="error-text">{errName}</p>
                       </FormGroup>
                     </Col>
                   </Row>
                   <Row className='mt-3'>
                     <Col md={12} xl={12}>
                       <FormGroup>
                         <Label className='match-edit-label' for="Bonus">Bonus</Label>
                         <Input disabled={adminPermission?.SCORE_POINT === 'R'} name="Link" onChange={event => handleChange(event, 'Bonus')} placeholder="Enter Bonus" value={Bonus} />
                         <p className="error-text">{errBonus}</p>
                       </FormGroup>
                     </Col>
                   </Row>
                   <Row className='mt-3'>
                     <Col md={12} xl={12}>
                       <FormGroup>
                         <Label className='match-edit-label' for="Key">Min Value</Label>
                         <Input disabled={adminPermission?.SCORE_POINT === 'R'} name="Key" onChange={event => handleChange(event, 'MinValue')} placeholder="Enter MinValue" value={MinValue} />
                         <p className="error-text">{errMinValue}</p>
                       </FormGroup>
                     </Col>
                   </Row>

                   <Row className='mt-3'>
                     <Col md={12} xl={6}>
                       <FormGroup>
                         <Label className='match-edit-label' for="RangeFrom">{scorePointDetails?.sName?.includes('Strike Rate') ? 'Min Range for Strike Rate' : scorePointDetails?.sName?.includes('Economy Bonus') ? 'Min Range for Economy Bonus' : 'Min Range'}</Label>
                         <Input disabled={adminPermission?.SCORE_POINT === 'R'} name="RangeFrom" onChange={event => handleChange(event, 'RangeFrom')} placeholder={scorePointDetails?.sName?.includes('Strike Rate') ? 'Min Range for Strike Rate' : scorePointDetails?.sName?.includes('Economy Bonus') ? 'Min Range for Economy Bonus' : 'Min Range'} type='number' value={RangeFrom} />
                         <p className="error-text">{errRangeFrom}</p>
                       </FormGroup>
                     </Col>
                     <Col md={12} xl={6}>
                       <FormGroup>
                         <Label className='match-edit-label' for="RangeTo">{scorePointDetails?.sName?.includes('Strike Rate') ? 'Max Range for Strike Rate' : scorePointDetails?.sName?.includes('Economy Bonus') ? 'Max Range for Economy Bonus' : 'Max Range'}</Label>
                         <Input disabled={adminPermission?.SCORE_POINT === 'R'} name="RangeTo" onChange={event => handleChange(event, 'RangeTo')} placeholder={scorePointDetails?.sName?.includes('Strike Rate') ? 'Max Range for Strike Rate' : scorePointDetails?.sName?.includes('Economy Bonus') ? 'Max Range for Economy Bonus' : 'Max Range'} type='number' value={RangeTo} />
                         <p className="error-text">{errRangeTo}</p>
                       </FormGroup>
                     </Col>
                   </Row>

                 </Fragment>
                 )
               : (
                 <Fragment>
                   <Row className='mt-2'>
                     <Col md={12} xl={12}>
                       <FormGroup>
                         <Label className='match-edit-label' for="Name">Name</Label>
                         <Input className='p-1' disabled={adminPermission?.SCORE_POINT === 'R'} name="Link" onChange={event => handleChange(event, 'Name')} placeholder="Enter Name" type='textarea' value={Name} />
                         <p className="error-text">{errName}</p>
                       </FormGroup>
                     </Col>
                   </Row>

                   <Row className='mt-3'>
                     <Col md={12} xl={12}>
                       <FormGroup>
                         <Label className='match-edit-label' for="Key">Key</Label>
                         <InputGroupText>{Key}</InputGroupText>
                       </FormGroup>
                     </Col>
                   </Row>

                   <Row className='mt-3'>
                     <Col md={12} xl={12}>
                       <FormGroup>
                         <Label className='match-edit-label' for="Order">Points</Label>
                         <Input
                           disabled={adminPermission?.SCORE_POINT === 'R'}
                           name="Points"
                           onChange={event => handleChange(event, 'Points')}
                           onKeyDown={(e) => blockInvalidChar(e, Points)}
                           placeholder="Enter Points"
                           type='text'
                           value={Points}
                         />
                         <p className="error-text">{errPoints}</p>
                       </FormGroup>
                     </Col>
                   </Row>

                 </Fragment>
                 )
          }
        </Form>
      </section>
    </main>
  )
})

UpdatePoint.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      id1: PropTypes.string
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  location: PropTypes.object,
  sportsType: PropTypes.string,
  setUpdateDisableButton: PropTypes.func,
  setErrPoints: PropTypes.func,
  errPoints: PropTypes.string,
  setMultiDisableButton: PropTypes.func
}
UpdatePoint.displayName = UpdatePoint
export default UpdatePoint
