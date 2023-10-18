import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, FormGroup, Label, Input, CustomInput, InputGroupText, Row, Col } from 'reactstrap'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@tanstack/react-query'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { isNumber, modalMessageFunc, verifyLength, verifyUrl } from '../../../../helpers/helper'
import getSportDetails from '../../../../api/sport/getSportDetails'
import updateSport from '../../../../api/sport/updateSport'

const AddSport = forwardRef((props, ref) => {
  const { setSubmitDisableButton, adminPermission } = props
  const { id } = useParams()
  const [sportName, setSportName] = useState('')
  const [key, setKey] = useState('')
  const [position, setPosition] = useState('')
  const [Active, setActive] = useState('N')
  const [maxPlayerOneTeam, setMaxPlayerOneTeam] = useState(0)
  const [totalPlayers, setTotalPlayers] = useState(0)
  const [scoreInfoLink, setScoreInfoLink] = useState('')
  const [scoreInfoTabName, setScoreInfoTabName] = useState('')
  const [errSportName, setErrSportName] = useState('')
  const [errKey, setErrKey] = useState('')
  const [errPosition, setErrPosition] = useState('')
  const [totalPlayerErr, setTotalPlayerErr] = useState('')
  const [maxPlayerOneTeamErr, setMaxPlayerOneTeamErr] = useState('')
  const [scoreInfoLinkErr, setScoreInfoLinkErr] = useState('')
  const [scoreInfoTabNameErr, setScoreInfoTabNameErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [close, setClose] = useState(false)

  const navigate = useNavigate()
  const token = useSelector(state => state?.auth?.token)
  const resStatus = useSelector(state => state?.sports?.resStatus)
  const resMessage = useSelector(state => state?.sports?.resMessage)
  const previousProps = useRef({ resStatus, resMessage })?.current
  const [modalMessage, setModalMessage] = useState(false)

  const { data: sportDetails } = useQuery({
    queryKey: ['getSportDetails', id],
    queryFn: () => getSportDetails(id),
    select: (res) => res?.data?.data
  })

  const { mutate: updateSportFun } = useMutation(updateSport, {
    onSuccess: (res) => {
      navigate('/settings/sports', { state: { message: res?.data?.message } })
    },
    onError: (error) => {
      setMessage(error?.response?.data?.message)
      setModalMessage(true)
      setStatus(false)
      setLoading(false)
    }
  })

  // through this condition if there is no changes in at update time submit button will remain disable
  const submitDisable = sportDetails && previousProps?.sportDetails !== sportDetails && sportDetails?.sName === sportName && sportDetails?.nPosition === parseInt(position) && sportDetails?.eStatus === Active && sportDetails?.oRule && sportDetails?.oRule?.nTotalPlayers === parseInt(totalPlayers) && sportDetails?.oRule?.nMaxPlayerOneTeam === parseInt(maxPlayerOneTeam) && sportDetails?.sScoreInfoLink === scoreInfoLink && sportDetails?.sScoreInfoTabName === scoreInfoTabName

  useEffect(() => {
    setSubmitDisableButton(submitDisable)
  }, [submitDisable])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          navigate('/settings/sports', { state: { message: resMessage } })
        }

        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // to set sportsDetails
  useEffect(() => {
    if (sportDetails) {
      setSportName(sportDetails?.sName)
      setKey(sportDetails?.sKey)
      setPosition(sportDetails?.nPosition || '')
      setActive(sportDetails?.eStatus)
      setTotalPlayers(sportDetails?.oRule?.nTotalPlayers || 0)
      setMaxPlayerOneTeam(sportDetails?.oRule?.nMaxPlayerOneTeam || 0)
      setScoreInfoLink(sportDetails?.sScoreInfoLink || '')
      setScoreInfoTabName(sportDetails?.sScoreInfoTabName || '')
      setLoading(false)
    }
    return () => {
      previousProps.sportDetails = sportDetails
    }
  }, [sportDetails])

  // for validate the field and dispatch action
  function onSubmit (e) {
    if (verifyLength(sportName, 1) && verifyLength(key, 1) && isNumber(position) && isNumber(totalPlayers) && isNumber(maxPlayerOneTeam) && scoreInfoLink && scoreInfoTabName && !errSportName && !errKey && !errPosition) {
      const updateSportData = {
        sportName, key, position, Active, totalPlayers, maxPlayerOneTeam, scoreInfoLink, scoreInfoTabName, id: id, token
      }
      updateSportFun(updateSportData)
      setLoading(true)
    } else {
      if (!verifyLength(sportName, 1)) {
        setErrSportName('Required field')
      }
      if (!verifyLength(key, 1)) {
        setErrKey('Required field')
      }
      if (!position) {
        setErrPosition('Required field')
      } else if (!isNumber(position)) {
        setErrPosition('Field should be number')
      }
      if (!totalPlayers) {
        setTotalPlayerErr('Required field')
      } else if (!isNumber(position)) {
        setTotalPlayerErr('Field should be number')
      }
      if (!maxPlayerOneTeam) {
        setMaxPlayerOneTeamErr('Required field')
      } else if (!isNumber(position)) {
        setMaxPlayerOneTeamErr('Field should be number')
      }
      if (!scoreInfoLink) {
        setScoreInfoLinkErr('Required field')
      }
      if (!scoreInfoTabName) {
        setScoreInfoTabNameErr('Required field')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    onSubmit
  }))

  // for handle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'SportName':
        if (verifyLength(event?.target?.value, 1)) {
          setErrSportName('')
        } else {
          setErrSportName('Required field')
        }
        setSportName(event?.target?.value)
        break
      case 'Key':
        if (verifyLength(event?.target?.value, 1)) {
          setErrKey('')
        } else {
          setErrKey('Required field')
        }
        setKey(event?.target?.value)
        break
      case 'Position':
        if (isNumber(event?.target?.value)) {
          setErrPosition('')
        } else {
          setErrPosition('Required field')
        }
        setPosition(event?.target?.value)
        break
      case 'Status':
        setActive(event?.target?.value)
        break
      case 'TotalPlayers':
        if (event?.target?.value) {
          if (!isNumber(event?.target?.value)) {
            setTotalPlayerErr('Enter numeric value only!')
          } else {
            setTotalPlayerErr('')
          }
        } else {
          setTotalPlayerErr('Required field')
        }
        setTotalPlayers(event?.target?.value)
        break
      case 'MaxPlayerOneTeam':
        if (event?.target?.value) {
          if (!isNumber(event?.target?.value)) {
            setMaxPlayerOneTeamErr('Enter numeric value only!')
          } else {
            setMaxPlayerOneTeamErr('')
          }
        } else {
          setMaxPlayerOneTeamErr('Required field')
        }
        setMaxPlayerOneTeam(event?.target?.value)
        break
      case 'ScoreInfoLink':
        if (event?.target?.value) {
          if (!verifyUrl(event?.target?.value)) {
            setScoreInfoLinkErr('Invalid link ')
          } else {
            setScoreInfoLinkErr('')
          }
        } else {
          setScoreInfoLinkErr('Required field')
        }
        setScoreInfoLink(event?.target?.value)
        break
      case 'ScoreInfoTabName':
        if (verifyLength(event?.target?.value, 1)) {
          setScoreInfoTabNameErr('')
        } else {
          setScoreInfoTabNameErr('Required field')
        }
        setScoreInfoTabName(event?.target?.value)
        break
      default:
        break
    }
  }
  return (
    <main className="main-content">
      {loading && <Loading />}
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />

      <section className="common-form-block">
        <Form>
          <Row>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="sportName">
                  Sport
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errSportName ? 'league-placeholder-error' : 'input-box-setting'} disabled={adminPermission?.SPORT === 'R'} name="sportName" onChange={event => handleChange(event, 'SportName')} placeholder="Sport" value={sportName} />
                <p className="error-text">{errSportName}</p>
              </FormGroup>
            </Col>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="key">
                  Key
                  {' '}
                  <RequiredField/>
                </Label>
                <InputGroupText className='input-box'>{key}</InputGroupText>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="position">
                  Position
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errPosition ? 'league-placeholde-error' : 'input-box-setting'} disabled={adminPermission?.SPORT === 'R'} name="position" onChange={event => handleChange(event, 'Position')} placeholder="Position" value={position} />
                <p className="error-text">{errPosition}</p>
              </FormGroup>
            </Col>

            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="totalPlayers">Total Players</Label>
                <Input className={totalPlayerErr ? 'league-placeholder-error' : 'input-box-setting'} disabled={adminPermission?.SPORT === 'R'} name="totalPlayers" onChange={event => handleChange(event, 'TotalPlayers')} placeholder="Total Players" value={totalPlayers} />
                <p className="error-text">{totalPlayerErr}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="maxPlayerOneTeam">Max Player From One Team</Label>
                <Input className={maxPlayerOneTeamErr ? 'league-placeholder-error' : 'input-box-setting'} disabled={adminPermission?.SPORT === 'R'} name="maxPlayerOneTeam" onChange={event => handleChange(event, 'MaxPlayerOneTeam')} placeholder="Max Player One Team" value={maxPlayerOneTeam} />
                <p className="error-text">{maxPlayerOneTeamErr}</p>
              </FormGroup>
            </Col>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="scoreInfoLink">Score Info Link</Label>
                <Input className={scoreInfoLinkErr ? 'league-placeholder-error' : 'input-box-setting'} disabled={(adminPermission?.SPORT === 'R') || (key !== 'CRICKET')} name="scoreInfoLink" onChange={event => handleChange(event, 'ScoreInfoLink')} placeholder="Score Info Link" value={scoreInfoLink} />
                <p className="error-text">{scoreInfoLinkErr}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="scoreInfoTabName">Score Info Tab Name</Label>
                <Input className={scoreInfoTabNameErr ? 'league-placeholder-error' : 'input-box-setting'} disabled={(adminPermission?.SPORT === 'R') || (key !== 'CRICKET')} name="scoreInfoTabName" onChange={event => handleChange(event, 'ScoreInfoTabName')} placeholder="Score Info Tab Name" value={scoreInfoTabName} />
                <p className="error-text">{scoreInfoTabNameErr}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='p-3 mt-3'>
            <div className='radio-button-div'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting' for="status">Status</Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput
                      checked={Active === 'Y'}
                      className='input-box-setting'
                      disabled={adminPermission?.SPORT === 'R'}
                      id="themeRadio1"
                      label="Active"
                      name="themeRadio"
                      onChange={event => handleChange(event, 'Status')}
                      type="radio"
                      value="Y"
                    />
                    <CustomInput
                      checked={Active !== 'Y'}
                      className='input-box-setting'
                      disabled={adminPermission?.SPORT === 'R'}
                      id="themeRadio2"
                      label="In Active"
                      name="themeRadio"
                      onChange={event => handleChange(event, 'Status')}
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

AddSport.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  setSubmitDisableButton: PropTypes.func,
  adminPermission: PropTypes.object,
  Auth: PropTypes.string
}

AddSport.displayName = AddSport
export default connect(null, null, null, { forwardRef: true })(AddSport)
