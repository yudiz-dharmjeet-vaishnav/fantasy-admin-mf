import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useSelector } from 'react-redux'
import { Form, FormGroup, Label, Input, InputGroupText, Row, Col } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { verifyLength, isNumber, modalMessageFunc } from '../../../../helpers/helper'

const AddPlayerRole = forwardRef((props, ref) => {
  const {
    PlayerRoleDetails, UpdatePlayerRole, clearMsg, playerRoleDetailsFunc, setIsCreate, setIsEdit, isCreate, setSubmitDisableButton
  } = props
  const { id } = useParams()
  const navigate = useNavigate()

  const [RoleName, setRoleName] = useState('')
  const [RoleShortName, setRoleShortName] = useState('')
  const [MinPlayer, setMinPlayer] = useState(0)
  const [MaxPlayer, setMaxPlayer] = useState(0)
  const [Position, setPosition] = useState(0)
  const [errRoleName, setErrRoleName] = useState('')
  const [errRoleShortName, setErrRoleShortName] = useState('')
  const [errMinPlayer, setErrMinPlayer] = useState('')
  const [errMaxPlayer, setErrMaxPlayer] = useState('')
  const [errPosition, setErrPosition] = useState('')
  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const resStatus = useSelector(state => state.playerRole.resStatus)
  const resMessage = useSelector(state => state.playerRole.resMessage)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ PlayerRoleDetails, resStatus, resMessage }).current
  const [modalMessage, setModalMessage] = useState(false)

  const submitDisable = PlayerRoleDetails && previousProps.PlayerRoleDetails !== PlayerRoleDetails && PlayerRoleDetails.nMin === parseInt(MinPlayer) && PlayerRoleDetails.nMax === parseInt(MaxPlayer) && PlayerRoleDetails.sFullName === RoleName && PlayerRoleDetails.nPosition === parseInt(Position)
  useEffect(() => {
    if (id) {
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
  }, [])

  useEffect(() => {
    setSubmitDisableButton(submitDisable)
  }, [submitDisable])
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
            playerRoleDetailsFunc()
          }
          setModalMessage(true)
        }
        setLoading(false)
      }
      clearMsg()
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.PlayerRoleDetails !== PlayerRoleDetails) {
      if (PlayerRoleDetails) {
        setRoleName(PlayerRoleDetails.sFullName ? PlayerRoleDetails.sFullName : '')
        setMinPlayer(PlayerRoleDetails.nMin)
        setMaxPlayer(PlayerRoleDetails.nMax)
        setPosition(PlayerRoleDetails.nPosition || 0)
        setRoleShortName(PlayerRoleDetails && PlayerRoleDetails.sName ? PlayerRoleDetails.sName : '')
        setLoading(false)
      }
    }
    return () => {
      previousProps.PlayerRoleDetails = PlayerRoleDetails
    }
  }, [PlayerRoleDetails])

  function onSubmit (e) {
    if (verifyLength(RoleName, 1) && verifyLength(RoleShortName, 1) && MinPlayer !== 0 && MaxPlayer !== 0 && Position !== 0 && !errRoleName && !errRoleShortName && !errMaxPlayer && !errMinPlayer && !errPosition) {
      if (!isCreate) {
        UpdatePlayerRole(RoleName, MaxPlayer, MinPlayer, Position)
      }
      setLoading(true)
    } else {
      if (!verifyLength(RoleName, 1)) {
        setErrRoleName('Required field')
      }
      if (!verifyLength(RoleShortName, 1)) {
        setErrRoleShortName('Required field')
      }
      if (MinPlayer === 0) {
        setErrMinPlayer('Required field')
      }
      if (MaxPlayer === 0) {
        setErrMaxPlayer('Required field')
      }
      if (Position === 0) {
        setErrPosition('Required field')
      }
    }
  }

  function handleChange (event, type) {
    switch (type) {
      case 'RoleName':
        if (verifyLength(event.target.value, 1)) {
          setErrRoleName('')
        } else {
          setErrRoleName('Required field')
        }
        setRoleName(event.target.value)
        break
      case 'RoleShortName':
        if (verifyLength(event.target.value, 1)) {
          setErrRoleShortName('')
        } else {
          setErrRoleShortName('Required field')
        }
        setRoleShortName(event.target.value)
        break
      case 'MaxPlayer':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setErrMaxPlayer('')
          } else {
            setErrMaxPlayer('Required field')
          }
          setMaxPlayer(event.target.value)
        }
        break
      case 'MinPlayer':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setErrMinPlayer('')
          } else {
            setErrMinPlayer('Required field')
          }
          setMinPlayer(event.target.value)
        }
        break
      case 'Position':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setErrPosition('')
          } else {
            setErrPosition('Required field')
          }
          setPosition(event.target.value)
        }
        break
      default:
        break
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
          <Row className='mt-2'>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='match-edit-label' for="RoleName">
                  Player Role
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errRoleName ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.ROLES === 'R'} name="RoleName" onChange={event => handleChange(event, 'RoleName')} placeholder="RoleName" value={RoleName} />
                <p className="error-text">{errRoleName}</p>
              </FormGroup>
            </Col>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='match-edit-label' for="RoleShortName">Short Name</Label>
                <InputGroupText className={errRoleShortName ? 'league-placeholder-error' : 'league-placeholder'}>{RoleShortName}</InputGroupText>
                <p className="error-text">{errRoleShortName}</p>
              </FormGroup>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='match-edit-label' for="MinPlayer">
                  Min Player
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errMinPlayer ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.ROLES === 'R'} name="MinPlayer" onChange={event => handleChange(event, 'MinPlayer')} placeholder="MinPlayer" value={MinPlayer} />
                <p className="error-text">{errMinPlayer}</p>
              </FormGroup>
            </Col>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='match-edit-label' for="MaxPlayer">
                  Max Player
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errMaxPlayer ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.ROLES === 'R'} name="MaxPlayer" onChange={event => handleChange(event, 'MaxPlayer')} placeholder="MaxPlayer" value={MaxPlayer} />
                <p className="error-text">{errMaxPlayer}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label for="GameCategory">Game Category</Label>
                <InputGroupText>{props.sportsType}</InputGroupText>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </section>
    </main>
  )
})

AddPlayerRole.defaultProps = {
  history: {}
}

AddPlayerRole.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  cancelLink: PropTypes.string,
  PlayerRoleDetails: PropTypes.object,
  UpdatePlayerRole: PropTypes.func,
  clearMsg: PropTypes.func,
  match: PropTypes.object,
  sportsType: PropTypes.string,
  playerRoleDetailsFunc: PropTypes.func,
  isEdit: PropTypes.string,
  isCreate: PropTypes.string,
  setIsCreate: PropTypes.func,
  setIsEdit: PropTypes.func,
  setSubmitDisableButton: PropTypes.func
}
AddPlayerRole.displayName = AddPlayerRole
export default connect(null, null, null, { forwardRef: true })(AddPlayerRole)
