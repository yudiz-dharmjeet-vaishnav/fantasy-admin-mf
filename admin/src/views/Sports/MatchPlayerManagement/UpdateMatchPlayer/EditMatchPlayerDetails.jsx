import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FormGroup, Input, CustomInput, Label, Form, InputGroup, InputGroupText, InputGroupAddon, Row, Col } from 'reactstrap'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import PropTypes from 'prop-types'

import editIcon from '../../../../assets/images/edit-icon.svg'
import removeImg from '../../../../assets/images/ep-close.svg'
import documentPlaceholder from '../../../../assets/images/upload-icon.svg'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import { verifyLength, isNumber, modalMessageFunc, acceptFormat } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'
import { getMatchPlayerDetails } from '../../../../actions/matchplayer'
import RequiredField from '../../../../components/RequiredField'

const animatedComponents = makeAnimated()

const EditMatchPlayerDetails = forwardRef((props, ref) => {
  const {
    matchPlayerDetails, UpdateMatchPlayer, playerRoleList, matchDetails, getMatchDetails, getList, getPlayersTotalCountFunc, AddNewMatchPlayer, ResetMatchPlayer, isCreate, setIsCreate, setIsEdit, setMatchName, setSubmitDisableButton
  } = props
  const { id1, id2 } = useParams()
  const [playerOptions, setPlayerOptions] = useState('')
  const [playerImage, setPlayerImage] = useState('')
  const [search, setSearch] = useState('')
  const [options, setOptions] = useState([])
  const [playerId, setPlayerId] = useState([])
  const [playerIdErr, setPlayerIdErr] = useState('')
  const [playerImgErr, setPlayerImgErr] = useState('')
  const [seasonPoints, setSeasonPoints] = useState(0)
  const [scorePoints, setScorePoints] = useState(0)
  const [battingStyle, setBattingStyle] = useState('')
  const [bowlingStyle, setBowlingStyle] = useState('')
  const [credits, setCredits] = useState(0)
  const [playerRole, setPlayerRole] = useState('')
  const [playerRoleErr, setPlayerRoleErr] = useState('')
  const [TeamName, setTeamName] = useState('')
  const [teamErr, setTeamErr] = useState('')
  const [show, setshow] = useState('N')
  const [showInFrontEnd, setShowInFrontEnd] = useState('N')
  const [playInLastMatch, setPlayInLastMatch] = useState('N')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const [playersTotal, setPlayersTotal] = useState('')
  const [playersActivePageNo, setPlayersActivePageNo] = useState(1)
  const [url, setUrl] = useState('')
  const [back, setBack] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const dispatch = useDispatch()
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resStatus = useSelector(state => state.matchplayer.resStatus)
  const resMessage = useSelector(state => state.matchplayer.resMessage)
  const matchResStatus = useSelector(state => state.match.resStatus)
  const matchResMessage = useSelector(state => state.match.resMessage)
  const playerList = useSelector(state => state.player.playersList)
  const isSearch = useSelector(state => state.player.isSearch)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const playersTotalCount = useSelector(state => state.player.playersTotalCount)
  const previousProps = useRef({ isSearch, playersTotalCount, matchPlayerDetails, resStatus, resMessage, matchDetails, playerRoleList, playerList, search }).current
  const [modalMessage, setModalMessage] = useState(false)
  const [matchPlayerId, setmatchPlayerId] = useState('')
  const [substitutePlayer, setSubstitutePlayer] = useState('')
  const navigate = useNavigate()
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const updateDisable = matchPlayerDetails && previousProps.matchPlayerDetails !== matchPlayerDetails && matchPlayerDetails.iPlayerId === playerId && (matchPlayerDetails.bShow === (show === 'Y')) && matchPlayerDetails.iTeamId === TeamName && matchPlayerDetails.nSeasonPoints === parseFloat(seasonPoints)
  useEffect(() => {
    if (id1 && id2) {
      setmatchPlayerId(id2)
      setIsCreate(false)
      getMatchDetails(id1)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
    dispatch(getUrl('media'))
    const startFrom = 0
    const limit = 20
    getList(startFrom, limit, 'sName', 'asc', '', '')
    getPlayersTotalCountFunc('', '')
  }, [])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    setSubmitDisableButton(updateDisable)
  }, [updateDisable])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setModalMessage(resMessage)
        setStatus(resStatus)
        if (back) {
          if (resStatus && isCreate) {
            navigate(`${props.cancelLink}`, { state: { message: resMessage } })
          } else {
            navigate(`${props.cancelLink}${page?.MatchPlayerManagement || ''}`, { state: { message: resMessage } })
          }
        } else {
          dispatch(getMatchPlayerDetails(matchPlayerId, token))
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.matchResMessage !== matchResMessage) {
      if (matchResMessage) {
        setLoading(false)
      }
    }
    return () => {
      previousProps.matchResMessage = matchResMessage
    }
  }, [matchResStatus, matchResMessage])

  // set all related matchPlayer Details
  useEffect(() => {
    if (matchPlayerDetails) {
      if (previousProps.matchPlayerDetails !== matchPlayerDetails) {
        setCredits(matchPlayerDetails.nFantasyCredit ? matchPlayerDetails.nFantasyCredit : 0)
        setPlayerImage(matchPlayerDetails.sImage)
        setTeamName(matchPlayerDetails.iTeamId)
        setPlayerRole(matchPlayerDetails.eRole)
        setScorePoints(matchPlayerDetails.nScoredPoints ? matchPlayerDetails.nScoredPoints : 0)
        setSeasonPoints(matchPlayerDetails.nSeasonPoints || 0)
        setshow(matchPlayerDetails.bShow === true ? 'Y' : 'N')
        setShowInFrontEnd(matchPlayerDetails?.eStatus ? 'Y' : 'N')
        setPlayInLastMatch(matchPlayerDetails.bPlayInLastMatch === true ? 'Y' : 'N')
        setPlayerId(matchPlayerDetails.sName ? { label: matchPlayerDetails?.sName || '', value: matchPlayerDetails?.iPlayerId || '' } : '')
        setPlayerName(matchPlayerDetails?.sName || '')
        setBattingStyle(matchPlayerDetails.sBattingStyle ? matchPlayerDetails.sBattingStyle : '')
        setBowlingStyle(matchPlayerDetails.sBowlingStyle ? matchPlayerDetails.sBowlingStyle : '')
        setSubstitutePlayer(matchPlayerDetails?.bSubstitute ? 'Y' : 'N')
        setLoading(false)
      }
    }
    return () => {
      previousProps.matchPlayerDetails = matchPlayerDetails
    }
  }, [matchPlayerDetails])

  useEffect(() => {
    if (matchDetails) {
      const arr = []
      if (matchDetails && matchDetails.oAwayTeam && matchDetails.oAwayTeam.iTeamId && matchDetails.oHomeTeam && matchDetails.oHomeTeam.iTeamId) {
        const obj = {
          value: matchDetails.oAwayTeam.iTeamId,
          label: matchDetails.oAwayTeam.sName
        }
        const obj2 = {
          value: matchDetails.oHomeTeam.iTeamId,
          label: matchDetails.oHomeTeam.sName
        }
        arr.push(obj, obj2)
      }
      setOptions(arr)

      if (matchDetails && matchDetails.sName) {
        setMatchName(matchDetails.sName)
      }
    }

    return () => {
      previousProps.matchDetails = matchDetails
    }
  }, [matchDetails])

  useEffect(() => {
    if (previousProps.playerList !== playerList || previousProps.isSearch !== isSearch) {
      const playerOps = isSearch ? [] : [...playerOptions]
      playerList?.results?.map(data => {
        const obj = {
          label: data.sName,
          value: data._id
        }
        playerOps.push(obj)
        return playerOps
      })
      setPlayerOptions(playerOps)
      setLoading(false)
    }
    if (previousProps.playersTotalCount !== playersTotalCount && playersTotalCount) {
      setPlayersTotal(playersTotalCount?.count ? playersTotalCount?.count : 0)
    }
    return () => {
      previousProps.playerList = playerList
      previousProps.playersTotalCount = playersTotalCount
      previousProps.isSearch = isSearch
    }
  }, [playerList, playersTotalCount, isSearch])

  useEffect(() => {
    const callSearchService = () => {
      const isValueNotInList = !(playerList?.results?.some(player => player.sName.toUpperCase().includes(search) || player.sName.toLowerCase().includes(search)))
      if (isValueNotInList) {
        const startFrom = 0
        getList(startFrom, 20, 'sName', 'asc', search, '')
        getPlayersTotalCountFunc(search, '')
        setLoading(true)
      }
    }
    if (previousProps.search !== search) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.search = search
      }
    }
    return () => {
      previousProps.search = search
    }
  }, [search])

  function Submit (e) {
    const addValidation = playerId && TeamName && show
    const updateValidation = playerName && TeamName && show && playerRole
    const validate = isCreate ? addValidation : updateValidation
    if (validate) {
      if (isCreate && show) {
        const aPlayers = playerId.map((item) => {
          return { sName: item.label, iPlayerId: item.value }
        })
        AddNewMatchPlayer(aPlayers, scorePoints, seasonPoints, TeamName, show)
      } else {
        UpdateMatchPlayer(isCreate ? playerId?.label : playerName, playerId?.value, playerImage, playerRole, credits, scorePoints, seasonPoints, TeamName, show, showInFrontEnd, playInLastMatch, matchPlayerId, substitutePlayer)
      }
      setBack(true)
      setLoading(true)
    } else {
      if (playerId?.length === 0 || verifyLength(playerName, 1)) {
        setPlayerIdErr('Required field')
      }
      if (!TeamName) {
        setTeamErr('Required field')
      }
      if (!playerRole) {
        setPlayerRoleErr('Required field')
      }
    }
  }

  function resetPlayer () {
    ResetMatchPlayer(matchPlayerId)
    setBack(false)
    setLoading(true)
  }

  function handleChange (event, type) {
    switch (type) {
      case 'Image':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setPlayerImgErr('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setPlayerImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setPlayerImgErr('')
        }
        break
      case 'Credits':
        if (parseFloat(event.target.value) || !event.target.value) {
          setCredits(event.target.value)
        }
        break
      case 'PlayerRole':
        if (verifyLength(event.target.value, 1)) {
          setPlayerRoleErr('')
        } else {
          setPlayerRoleErr('Required field')
        }
        setPlayerRole(event.target.value)
        break
      case 'SeasonPoints':
        if (isNumber(event.target.value) || !event.target.value) {
          setSeasonPoints(event.target.value)
        }
        break
      case 'Player':
        if (event !== null && verifyLength(event, 1)) {
          setPlayerIdErr('')
        } else {
          setPlayerIdErr('Required field')
        }

        if (event === null) {
          setSearch('')
          setPlayerOptions([])
          getList(0, 20, 'sName', 'asc', '', '')
          getPlayersTotalCountFunc('', '')
          setPlayerId('')
        } else {
          setPlayerId(event)
        }

        break
      case 'substitutePlayer':
        setSubstitutePlayer(event?.target?.value)
        break
      case 'TeamName':
        if (verifyLength(event.target.value, 1)) {
          setTeamErr('')
        } else {
          setTeamErr('Required field')
        }
        setTeamName(event.target.value)
        break
      case 'lineups':
        setshow(event.target.value)
        break
      case 'showInFrontEnd':
        setShowInFrontEnd(event.target.value)
        break
      case 'playInLastMatch':
        setPlayInLastMatch(event.target.value)
        break
      case 'RemoveImage':
        setPlayerImage('')
        break
      case 'PlayerName':
        if (verifyLength(event.target.value, 1)) {
          setPlayerIdErr('')
        } else {
          setPlayerIdErr('Required field')
        }
        setPlayerName(event.target.value)
        break
      default:
        break
    }
  }

  // pagination for series field
  function onPlayerPagination () {
    const length = Math.ceil(playersTotal / 20)
    if (playersActivePageNo < length) {
      const start = playersActivePageNo * 20
      getList(start, 20, 'sName', 'asc', search, '')
      getPlayersTotalCountFunc(search, '')
      setPlayersActivePageNo(playersActivePageNo + 1)
    }
  }

  useImperativeHandle(ref, () => ({
    resetPlayer, Submit
  }))
  return (
    <main className="main-content">

      <section className="common-form-block">

        <AlertMessage
          close={close}
          message={message}
          modalMessage={modalMessage}
          status={status}
        />

        {loading && <Loading />}

        <Form>
          <Row>
            <Col md={12} xl={12}>
              {!isCreate && (
              <FormGroup>
                <div className="theme-image text-center">
                  <div className="d-flex theme-photo">
                    <div className={playerImage ? 'theme-img' : 'theme-img-default'}>
                      <img
                        alt="themeImage"
                        className={playerImage ? 'custom-img' : ' custom-img-default'}
                        src={playerImage ? playerImage.imageURL ? playerImage.imageURL : url + playerImage : documentPlaceholder}
                      />
                      {playerImage && ((Auth && Auth === 'SUPER') || (adminPermission?.MATCHPLAYER === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveImage')} src={removeImg} /></div>}
                      {!playerImage && ((Auth && Auth === 'SUPER') || (adminPermission?.MATCHPLAYER === 'W')) && (
                      <CustomInput
                        accept={acceptFormat}
                        id="exampleCustomFileBrowser"
                        label="Add Theme image"
                        name="customFile"
                        onChange={event => handleChange(event, 'Image')}
                        type="file"
                      />
                      )}
                    </div>
                  </div>
                </div>
                <p className="error-text">{playerImgErr}</p>
              </FormGroup>
              )}
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='match-edit-label' for="playerId">
                  Player Name
                  {' '}
                  <RequiredField/>
                </Label>
                {isCreate
                  ? (
                    <Select
                      className={playerIdErr ? 'league-placeholder-error' : 'css-2b097c-container'}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      controlShouldRenderValue={playerOptions}
                      id='playerId'
                      isClearable
                      isDisabled={adminPermission?.MATCHPLAYER === 'R' || !isCreate}
                      isMulti={isCreate}
                      name='playerId'
                      onChange={selectedOption => handleChange(selectedOption, 'Player')}
                      onInputChange={(value) => setSearch(value)}
                      onMenuScrollToBottom={onPlayerPagination}
                      options={playerOptions}
                      placeholder='Select Player'
                      value={playerId}
                    />
                    )
                  : (
                    <Input
                      disabled={adminPermission?.MATCHPLAYER === 'R'}
                      id="playerId"
                      name='playerId'
                      onChange={event => handleChange(event, 'PlayerName')}
                      placeholder="Enter Player Name"
                      type="text"
                      value={playerName}
                    />
                    )
            }
                <p className="error-text">{playerIdErr}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='match-edit-label' for="SeasonPoints">Player Season Points</Label>
                <Input
                  disabled={adminPermission?.MATCHPLAYER === 'R'}
                  id="SeasonPoints"
                  onChange={event => handleChange(event, 'SeasonPoints')}
                  placeholder="Enter Season Points"
                  type="text"
                  value={seasonPoints}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='match-edit-label' for="TeamName">
                  Team Name
                  {' '}
                  <RequiredField/>
                </Label>
                <CustomInput
                  className={teamErr ? 'league-placeholder-error' : 'custom-select-role'}
                  disabled={adminPermission?.MATCHPLAYER === 'R'}
                  id="tName"
                  name="teamName"
                  onChange={event => handleChange(event, 'TeamName')}
                  placeholder="Enter Teams name"
                  type="select"
                  value={TeamName}
                >
                  <option value=''>Select Team</option>
                  {
                options && options.length !== 0 && options.map((data, i) => {
                  return (
                    <option key={data.value} value={data.value}>{data.label}</option>
                  )
                })
              }
                </CustomInput>
                {teamErr && <p className="error-text">{teamErr}</p>}
              </FormGroup>
            </Col>
          </Row>

          {!isCreate && (
          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='match-edit-label' for="PlayerRole">
                  Player`s Role
                  {' '}
                  <RequiredField/>
                </Label>
                <CustomInput
                  className={playerRoleErr ? 'league-placeholder-error' : 'custom-select-role'}
                  disabled={adminPermission?.MATCHPLAYER === 'R'}
                  id="PlayerRole"
                  name="select"
                  onChange={event => handleChange(event, 'PlayerRole')}
                  placeholder="Enter Player's Role"
                  type="select"
                  value={playerRole}
                >
                  <option value=''>Select Player Role</option>
                  {
                playerRoleList && playerRoleList.length !== 0 && playerRoleList.map((data, i) => {
                  return (
                    <option key={data.sName} value={data.sName}>{data.sFullName}</option>
                  )
                })
              }
                </CustomInput>
                {playerRoleErr && <p className="error-text">{playerRoleErr}</p>}
              </FormGroup>
            </Col>
          </Row>
          )}

          { !isCreate && (
          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='match-edit-label' for="credits">Credits</Label>
                <Input
                  id="credits"
                  onChange={event => handleChange(event, 'Credits')}
                  placeholder="Enter Player's credit"
                  type="number"
                  value={credits}
                />
              </FormGroup>
            </Col>
          </Row>
          )}

          <Row className='mt-4'>
            <Col md={12} xl={4}>
              <div className='radio-button-div mb-3'>
                <FormGroup>
                  <Label className='match-edit-label' for="phoneNumber">Show In Front End</Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput checked={showInFrontEnd === 'Y'} disabled={adminPermission?.MATCHPLAYER === 'R'} id="showInFrontEnd1" label="Yes" name="showInFrontEnd" onClick={event => handleChange(event, 'showInFrontEnd')} type="radio" value="Y" />
                    <CustomInput checked={showInFrontEnd !== 'Y'} disabled={adminPermission?.MATCHPLAYER === 'R'} id="showInFrontEnd2" label="No" name="showInFrontEnd" onClick={event => handleChange(event, 'showInFrontEnd')} type="radio" value="N" />
                  </div>
                </FormGroup>
              </div>
            </Col>
            <Col md={12} xl={4}>
              <div className='radio-button-div mb-3'>
                <FormGroup>
                  <Label className='match-edit-label' for="phoneNumber">In Lineups</Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput checked={show === 'Y'} disabled={adminPermission?.MATCHPLAYER === 'R'} id="lineups1" label="Yes" name="lineups" onClick={event => handleChange(event, 'lineups')} type="radio" value="Y" />
                    <CustomInput checked={show !== 'Y'} disabled={adminPermission?.MATCHPLAYER === 'R'} id="lineups2" label="No" name="lineups" onClick={event => handleChange(event, 'lineups')} type="radio" value="N" />
                  </div>
                </FormGroup>
              </div>
            </Col>
            <Col md={12} xl={4}>
              <div className='radio-button-div mb-3'>
                <FormGroup>
                  <Label className='match-edit-label' for="phoneNumber">Play In Last Match</Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput checked={playInLastMatch === 'Y'} disabled={adminPermission?.MATCHPLAYER === 'R'} id="playInLastMatch1" label="Yes" name="playInLastMatch" onClick={event => handleChange(event, 'playInLastMatch')} type="radio" value="Y" />
                    <CustomInput checked={playInLastMatch !== 'Y'} disabled={adminPermission?.MATCHPLAYER === 'R'} id="playInLastMatch2" label="No" name="playInLastMatch" onClick={event => handleChange(event, 'playInLastMatch')} type="radio" value="N" />
                  </div>
                </FormGroup>
              </div>
            </Col>
          </Row>

          <Row >
            {!isCreate && (
            <Col md={12} xl={4}>
              <div className='radio-button-div mb-3'>
                <FormGroup>
                  <Label className='match-edit-label' for="substitute">Substitute Player</Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput checked={substitutePlayer === 'Y'} disabled={adminPermission?.MATCHPLAYER === 'R'} id="substitutePlayer1" label="Yes" name="substitutePlayer" onClick={event => handleChange(event, 'substitutePlayer')} type="radio" value="Y" />
                    <CustomInput checked={substitutePlayer !== 'Y'} disabled={adminPermission?.MATCHPLAYER === 'R'} id="substitutePlayer2" label="No" name="substitutePlayer" onClick={event => handleChange(event, 'substitutePlayer')} type="radio" value="N" />
                  </div>
                </FormGroup>
              </div>
            </Col>
            )}
          </Row>

          <Row >
            <Col md={12} xl={12}>
              { !isCreate && (
                <FormGroup className='form-score-point'>
                  <Label className='match-edit-label' for="scorePoints">Score Points</Label>
                  <InputGroup>
                    <Input
                      className={!isCreate ? 'scorePoints' : ''}
                      disabled
                      id="ScorePoint"
                      onChange={event => handleChange(event, 'ScorePoint')}
                      placeholder="Enter Score Point"
                      type="number"
                      value={scorePoints}
                    />
                    {
                ((Auth && Auth === 'SUPER') || (adminPermission?.SCORE_POINT !== 'N')) &&
                (
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <Link className='ml-5' color="link" to={props.eScorePoint}>
                        <img alt="edit" className="mr-2 custom-img" src={editIcon} />
                        Score Points
                      </Link>
                    </InputGroupText>
                  </InputGroupAddon>
                )
              }
                  </InputGroup>
                </FormGroup>
              )}
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

EditMatchPlayerDetails.propTypes = {
  location: PropTypes.object,
  matchPlayerDetails: PropTypes.object,
  AddNewMatchPlayer: PropTypes.func,
  UpdateMatchPlayer: PropTypes.func,
  playerRoleList: PropTypes.array,
  matchDetails: PropTypes.object,
  getMatchDetails: PropTypes.func,
  match: PropTypes.object,
  cancelLink: PropTypes.string,
  eScorePoint: PropTypes.string,
  getList: PropTypes.func,
  getPlayersTotalCountFunc: PropTypes.func,
  ResetMatchPlayer: PropTypes.func,
  setIsCreate: PropTypes.func,
  setIsEdit: PropTypes.func,
  isCreate: PropTypes.string,
  isEdit: PropTypes.string,
  MatchName: PropTypes.string,
  setMatchName: PropTypes.func,
  setSubmitDisableButton: PropTypes.func

}
EditMatchPlayerDetails.displayName = EditMatchPlayerDetails
export default connect(null, null, null, { forwardRef: true })(EditMatchPlayerDetails)
