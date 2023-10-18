import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { FormGroup, Input, Label, CustomInput, Form, InputGroupText, Row, Col } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import removeImg from '../../../../assets/images/ep-close.svg'
import documentPlaceholder from '../../../../assets/images/upload-icon.svg'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { verifyLength, withoutSpace, isFloat, modalMessageFunc, acceptFormat } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'

const AddPlayer = forwardRef((props, ref) => {
  const {
    AddNewPlayer, gameCategory, PlayerDetails, UpdatePlayer, playerRoleList, isCreate, setIsCreate, setIsEdit, setSubmitDisableButton
  } = props
  const { id } = useParams()
  const navigate = useNavigate()
  const [playerImage, setplayerImage] = useState('')
  const [PlayerPoint, setPlayerPoint] = useState(0)
  const [PlayerName, setPlayerName] = useState('')
  const [playerKey, setplayerKey] = useState('')
  const [provider, setProvider] = useState('')
  const [battingStyle, setBattingStyle] = useState('')
  const [bowlingStyle, setBowlingStyle] = useState('')
  const [errPlayerKey, seterrPlayerKey] = useState('')
  const [errPlayerName, seterrPlayerName] = useState('')
  const [errPlayerPoint, seterrPlayerPoint] = useState('')
  const [PlayerRole, setPlayerRole] = useState('')
  const [GameCategory, setGameCategory] = useState('')
  const [errImage, setErrImage] = useState('')
  const [url, setUrl] = useState('')
  const [errPlayerRole, setErrPlayerRole] = useState('')
  const [PlayerId, setPlayerId] = useState('')
  const [close, setClose] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const dispatch = useDispatch()
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resStatus = useSelector(state => state.player.resStatus)
  const resMessage = useSelector(state => state.player.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ playerRoleList, PlayerDetails, resStatus, resMessage }).current
  const [modalMessage, setModalMessage] = useState(false)

  const submitDisable = PlayerDetails && previousProps.PlayerDetails !== PlayerDetails && PlayerDetails.sName === PlayerName && PlayerDetails.sKey === playerKey && PlayerDetails.sImage === playerImage && PlayerDetails.eRole === PlayerRole && ((PlayerDetails?.nFantasyCredit || 0) === parseFloat(PlayerPoint))
  useEffect(() => {
    if (id) {
      setPlayerId(id)
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
    dispatch(getUrl('media'))
  }, [])

  useEffect(() => {
    gameCategory && setGameCategory(gameCategory)
  }, [gameCategory])

  useEffect(() => {
    setSubmitDisableButton(submitDisable)
  }, [submitDisable])

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
          navigate(`${props.cancelLink}`, { message: resMessage })
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

  // set PlayerDetails
  useEffect(() => {
    if (previousProps.PlayerDetails !== PlayerDetails) {
      if (PlayerDetails) {
        setplayerImage(PlayerDetails.sImage)
        setPlayerPoint(PlayerDetails.nFantasyCredit ? PlayerDetails.nFantasyCredit : 0)
        setPlayerName(PlayerDetails.sName)
        setplayerKey(PlayerDetails.sKey)
        setPlayerRole(PlayerDetails.eRole)
        setProvider(PlayerDetails.eProvider ? PlayerDetails.eProvider : '--')
        setBattingStyle(PlayerDetails.sBattingStyle ? PlayerDetails.sBattingStyle : '')
        setBowlingStyle(PlayerDetails.sBowlingStyle ? PlayerDetails.sBowlingStyle : '')
        setLoading(false)
      }
    }
    return () => {
      previousProps.PlayerDetails = PlayerDetails
    }
  }, [PlayerDetails])

  function Submit (e) {
    if (verifyLength(PlayerName, 1) && isFloat(PlayerPoint) && verifyLength(playerKey, 1) && verifyLength(PlayerRole, 1) && !errPlayerName && !errPlayerPoint && !errPlayerKey) {
      if (isCreate) {
        AddNewPlayer(playerKey, PlayerName, playerImage, PlayerPoint, PlayerRole)
      } else {
        UpdatePlayer(PlayerId, playerKey, PlayerName, playerImage, PlayerPoint, PlayerRole)
      }
      setLoading(true)
    } else {
      if (!verifyLength(PlayerName, 1)) {
        seterrPlayerName('Required field')
      }
      if (!verifyLength(playerKey, 1)) {
        seterrPlayerKey('Required field')
      }
      if (!isFloat(PlayerPoint)) {
        seterrPlayerPoint('Required field')
      }
      if (!PlayerRole) {
        setErrPlayerRole('Required field')
      }
    }
  }

  function handleChange (event, type) {
    switch (type) {
      case 'Image':
        if (event.target.files[0].type.includes('image/gif')) {
          setErrImage('Gif not allowed!')
        } else if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0].type.includes('image') && (!event.target.files[0].type.includes('image/gif')) && event.target.files[0].size !== 0) {
          setplayerImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setErrImage('')
        }
        break
      case 'PlayerName':
        if (withoutSpace(event.target.value)) {
          seterrPlayerName('No space')
        } else if (verifyLength(event.target.value, 1)) {
          seterrPlayerName('')
        } else {
          seterrPlayerName('Required field')
        }
        setPlayerName(event.target.value)
        break
      case 'PlayerKey':
        if (verifyLength(event.target.value, 1)) {
          if (withoutSpace(event.target.value)) {
            seterrPlayerKey('No space')
          } else {
            seterrPlayerKey('')
          }
        } else {
          seterrPlayerKey('Required field')
        }
        setplayerKey(event.target.value)
        break
      case 'PlayerPoint':
        if (isFloat(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            seterrPlayerPoint('')
          } else {
            seterrPlayerPoint('Required field')
          }
          setPlayerPoint(event.target.value)
          event.target.value > 10 ? seterrPlayerPoint('Point should not be greater than 10!') : setPlayerPoint(event.target.value)
        }
        break
      case 'PlayerRole':
        if (verifyLength(event.target.value, 1)) {
          setErrPlayerRole('')
        } else {
          setErrPlayerRole('Required field')
        }
        setPlayerRole(event.target.value)
        break
      case 'GameCategory':
        setGameCategory(event.target.value)
        break
      case 'RemoveImage':
        setplayerImage('')
        break
      default:
        break
    }
  }

  function onImageError (e) {
    e.target.src = documentPlaceholder
  }
  useImperativeHandle(ref, () => ({
    Submit
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
          <Row >
            <Col md={12} xl={12}>
              <FormGroup>
                <div className="theme-image text-center">
                  <div className="d-flex theme-photo">
                    <div className={ playerImage ? 'theme-img' : 'theme-img-default'}>
                      <img alt="PlayerImage" className={playerImage ? 'custom-img' : 'custom-img-default'} onError={onImageError} src={playerImage ? playerImage?.imageURL ? playerImage?.imageURL : url + playerImage : documentPlaceholder} />
                      {playerImage && ((Auth && Auth === 'SUPER') || (adminPermission?.PLAYER === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveImage')} src={removeImg} /></div>}
                      {((Auth && Auth === 'SUPER') || (adminPermission?.PLAYER === 'W')) && !playerImage && (
                      <CustomInput
                        accept={acceptFormat}
                        id="examplePlayerImageBrowser"
                        label="Add Player Image"
                        name="PlayerImage"
                        onChange={event => handleChange(event, 'Image')}
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
                <Label className='match-edit-label' for="PlayerName">
                  Player Name
                  {' '}
                  <RequiredField/>
                </Label>
                <Input
                  className={errPlayerName ? 'league-placeholder-error' : 'league-placeholder'}
                  disabled={adminPermission?.PLAYER === 'R'}
                  id="PlayerName"
                  onChange={event => handleChange(event, 'PlayerName')}
                  placeholder="Enter Player Name"
                  type="text"
                  value={PlayerName}
                />
                <p className="error-text">{errPlayerName}</p>
              </FormGroup>
            </Col>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='match-edit-label' for="Key">
                  Player Key
                  {' '}
                  <RequiredField/>
                </Label>
                <Input
                  className={errPlayerKey ? 'league-placeholder-error' : 'league-placeholder'}
                  disabled={adminPermission?.PLAYER === 'R'}
                  name="Key"
                  onChange={event => handleChange(event, 'PlayerKey')}
                  placeholder="Enter Player Key"
                  type="text"
                  value={playerKey}
                />
                <p className="error-text">{errPlayerKey}</p>
              </FormGroup>
            </Col>

          </Row>
          <Row className='mt-3'>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='match-edit-label' for="PlayerPoint">
                  Player Credit Points
                  {' '}
                  <RequiredField/>
                </Label>
                <Input
                  className={errPlayerPoint ? 'league-placeholder-error' : 'league-placeholder'}
                  disabled={adminPermission?.PLAYER === 'R'}
                  id="PlayerPoint"
                  onChange={event => handleChange(event, 'PlayerPoint')}
                  placeholder="Enter Player Point"
                  type="number"
                  value={PlayerPoint}
                />
                <p className="error-text">{errPlayerPoint}</p>
              </FormGroup>
            </Col>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='match-edit-label' for="PlayerRole">
                  Player Role
                  {' '}
                  <RequiredField/>
                </Label>
                <CustomInput
                  className={errPlayerRole ? 'league-placeholder-error' : 'custom-select-role'}
                  disabled={adminPermission?.PLAYER === 'R'}
                  id="PlayerRole"
                  name="select"
                  onChange={event => handleChange(event, 'PlayerRole')}
                  type="select"
                  value={PlayerRole}
                >
                  <option value=''>Select Player Role</option>
                  {
                playerRoleList && previousProps.playerRoleList !== playerRoleList && playerRoleList.length !== 0 && playerRoleList.map((data, i) => {
                  return (
                    <option key={data.sName} value={data.sName}>
                      {data.sName === 'ALLR'
                        ? 'All Rounder'
                        : data.sName === 'BATS'
                          ? 'Batsman'
                          : data.sName === 'BWL'
                            ? 'Bowler'
                            : data.sName === 'WK'
                              ? 'Wicket Keeper'
                              : data.sName === 'FWD'
                                ? 'Forwards'
                                : data.sName === 'GK'
                                  ? 'Goal Keeper'
                                  : data.sName === 'DEF'
                                    ? 'Defender'
                                    : data.sName === 'RAID'
                                      ? 'Raider'
                                      : data.sName === 'MID'
                                        ? 'Mid fielders'
                                        : data.sName === 'PG'
                                          ? 'Point-Gaurd'
                                          : data.sName === 'SG'
                                            ? 'Shooting-Gaurd'
                                            : data.sName === 'SF'
                                              ? 'Small-Forwards'
                                              : data.sName === 'PF'
                                                ? 'Power-Forwards'
                                                : data.sName === 'C'
                                                  ? 'Centre'
                                                  : data.sName === 'IF' ? 'Infielder' : data.sName === 'OF' ? 'Outfielder' : data.sName === 'P' ? 'Pitcher' : data.sName === 'CT' ? 'Catcher' : '--'}
                      {' '}
                      {`(${data.sName})`}

                    </option>
                  )
                })
              }
                </CustomInput>
                <p className="error-text">{errPlayerRole}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            {!isCreate && (
            <Col md={12} xl={!isCreate ? 6 : 0}>
              <FormGroup>
                <Label className='match-edit-label' for="provider">Provider</Label>
                <InputGroupText>{provider}</InputGroupText>
              </FormGroup>
            </Col>
            )}
            <Col md={12} xl={!isCreate ? 6 : 12}>
              <FormGroup>
                <Label className='match-edit-label' for="GameCategory">Game Category </Label>
                <InputGroupText>{GameCategory}</InputGroupText>
              </FormGroup>

            </Col>
          </Row>

          {!isCreate && (battingStyle || bowlingStyle) && (
            <Row className='mt-4'>
              {battingStyle && (
                <Col md={12} xl={!isCreate ? 6 : 0}>
                  <FormGroup>
                    <Label className='match-edit-label' for="battingStyle">Batting Style</Label>
                    <InputGroupText>{battingStyle}</InputGroupText>
                  </FormGroup>
                </Col>
              )}
              {bowlingStyle && (
                <Col md={12} xl={!isCreate ? 6 : 0}>
                  <FormGroup>
                    <Label className='match-edit-label' for="bowlingStyle">Bowling Style</Label>
                    <InputGroupText>{bowlingStyle}</InputGroupText>
                  </FormGroup>
                </Col>
              )}
            </Row>
          )}
        </Form>
      </section>
    </main>
  )
})

AddPlayer.propTypes = {
  AddNewPlayer: PropTypes.func,
  match: PropTypes.object,
  gameCategory: PropTypes.string,
  cancelLink: PropTypes.string,
  PlayerDetails: PropTypes.object,
  UpdatePlayer: PropTypes.func,
  playerRoleList: PropTypes.array,
  history: PropTypes.object,
  getPlayerDetailsFunc: PropTypes.func,
  setIsCreate: PropTypes.func,
  setIsEdit: PropTypes.func,
  isCreate: PropTypes.string,
  isEdit: PropTypes.string,
  setSubmitDisableButton: PropTypes.func

}

AddPlayer.displayName = AddPlayer
export default connect(null, null, null, { forwardRef: true })(AddPlayer)
