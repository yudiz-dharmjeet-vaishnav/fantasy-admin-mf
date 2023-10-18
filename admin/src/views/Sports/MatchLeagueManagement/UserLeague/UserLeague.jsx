import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Button, Modal, ModalBody, Row, Col, Form, FormGroup, Label, Input, ModalHeader } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { useLocation, useParams } from 'react-router-dom'
import qs from 'query-string'
import PropTypes from 'prop-types'

import warningIcon from '../../../../assets/images/error-warning.svg'

import SportsHeader from '../../SportsHeader'
import Layout from '../../../../components/Layout'
import Loading from '../../../../components/Loading'
import SportsMainHeader from '../../SportsMainHeader'
import UserLeagueManagement from './UserLeagueManagement'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { getUrl } from '../../../../actions/url'
import { getMatchDetails } from '../../../../actions/match'
import { addSystemTeams, botCountMatchLeague, botUsers, getUserLeagueList, getExcelReport } from '../../../../actions/matchleague'

function UserLeague (props) {
  // const {
  //   match
  // } = props
  const { id1, id2 } = useParams()
  const location = useLocation()
  const content = useRef()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [matchId, setMatchId] = useState('')
  const [matchStatus, setMatchStatus] = useState('')
  const [matchName, setMatchName] = useState('')
  const [matchLeagueId, setMatchLeagueId] = useState('')
  const [teams, setTeams] = useState('')
  const [instantAdd, setInstantAdd] = useState(false)
  const [userType, setUserType] = useQueryState('type', '')
  const [userCount, setUserCount] = useState(0)
  const [copyBotCount, setCopyBotCount] = useState(0)
  const [normalBotCount, setNormalBotCount] = useState(0)
  const [combinationBotCount, setCombinationBotCount] = useState(0)
  const [url, setUrl] = useState('')
  const token = useSelector(state => state.auth.token)
  const userLeagueList = useSelector(state => state.matchleague.userLeagueList)
  const MatchDetails = useSelector(state => state.match.matchDetails)
  const resStatus = useSelector(state => state.matchleague.resStatus)
  const resMessage = useSelector(state => state.matchleague.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''
  const dispatch = useDispatch()
  const [modalMessage, setModalMessage] = useState(false)
  const [resModalMessage, setResModalMessage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const toggleMessage = () => {
    setModalMessage(!modalMessage)
    setTeams('')
    setInstantAdd('')
  }
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const previousProps = useRef({
    resStatus, resMessage, userLeagueList
  }).current

  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
    if (id1 && id2) {
      setMatchId(id1)
      setMatchLeagueId(id2)
    }
    if (id1) {
      getMatchDetailsFunc()
    }
    if (id2) {
      botCountInMatchLeagueFunc()
    }
    dispatch(getUrl('media'))
  }, [])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        setResModalMessage(true)
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (resModalMessage) {
      setTimeout(() => {
        setResModalMessage(false)
        setClose(false)
      }, 3000)
      setTimeout(() => {
        setClose(true)
      }, 2500)
    }
  }, [resModalMessage])

  useEffect(() => {
    if (MatchDetails) {
      setMatchName(MatchDetails.sName)
      setMatchStatus(MatchDetails.eStatus)
    }
  }, [MatchDetails])

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setinitialFlag(true)
  }

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  function getExcelReports () {
    dispatch(getExcelReport(matchLeagueId, token))
  }

  function handleInputChange (event, type) {
    switch (type) {
      case 'Teams':
        setTeams(event.target.value)
        break
      case 'InstantAdd':
        setInstantAdd(!instantAdd)
        break
      default:
        break
    }
  }

  // dispatch action to add system teams in particular contest
  function addBot (e) {
    e.preventDefault()
    if (id2) {
      dispatch(addSystemTeams(matchId, id2, teams, instantAdd, token))
      setLoading(true)
      toggleMessage()
    }
  }

  function getMatchDetailsFunc () {
    dispatch(getMatchDetails(id1, token))
  }

  // dispatch action to get number of rank, prize calculation, prize distribution, win prize distribution
  function botCountInMatchLeagueFunc () {
    dispatch(botCountMatchLeague(id2, token))
  }

  function getList (start, limit, sort, order, search, userType, isFullList) {
    const userLeagueData = {
      start, limit, sort, order, searchText: search, userType, isFullList, sportsType, ID: id2, token
    }
    dispatch(getUserLeagueList(userLeagueData))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  // dispatch action to stop adding system teams in contest
  function botUsersFunc (bBotUser) {
    setLoading(true)
    dispatch(botUsers(bBotUser, matchLeagueId, token))
  }

  function onExport () {
    content.current.onExport()
  }

  function onFiltering (event) {
    setUserType(event.target.value)
  }
  function stopSystemTeam () {
    botUsersFunc(false)
    setModalWarning(false)
  }
  function heading () {
    if (matchName && userLeagueList?.matchLeague?.sName) {
      if (window.innerWidth <= 480) {
        return (
          <div>
            User Leagues
            {' '}
            <p className='mb-0'>{`(${matchName})`}</p>
            {' '}
            <p>{`(${userLeagueList?.matchLeague?.sName})`}</p>
          </div>
        )
      } else {
        return (
          <div>
            User Leagues
            {' '}
            {`(${matchName} - ${userLeagueList?.matchLeague?.sName})`}
          </div>
        )
      }
    } else {
      return 'User Leagues'
    }
  }
  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          {loading && <Loading />}
          <AlertMessage
            close={close}
            message={message}
            modalMessage={resModalMessage}
            status={status}
          />
          <section className="management-section common-box">
            <SportsMainHeader
              heading={heading()}
              userLeagueList={userLeagueList}
              matchLeaguePage={`/${sportsType}/match-management/match-league-management/${matchId}`}
              onExportReport={onExport}
              onRefresh={onRefreshFun}
              refresh = "Refresh"
            />
            <div className={userLeagueList?.data && userLeagueList?.data[0]?.results?.length === 0 ? 'without-pagination' : 'setting-component'}>
              <SportsHeader
                {...props}
                AddSystemTeam="Add System Team"
                Bot
                MatchDetails={MatchDetails}
                SearchPlaceholder="Search League"
                botUser={botUsersFunc}
                combinationBotCount={combinationBotCount}
                copyBotCount={copyBotCount}
                excelUrl={url}
                generateExcel
                getExcelReports={getExcelReports}
                handleSearch={onHandleSearch}
                hidden
                matchLeagueManagement
                matchManagement
                normalBotCount={normalBotCount}
                onFiltering={onFiltering}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS === 'W')}
                search={searchText}
                setModalMessage={setModalMessage}
                setModalWarning={setModalWarning}
                status={matchStatus}
                userCount={userCount}
                userLeague
                userLeagueList={userLeagueList}
              />
              <UserLeagueManagement
                {...props}
                ref={content}
                List={userLeagueList}
                botCountInMatchLeagueFunc={botCountInMatchLeagueFunc}
                flag={initialFlag}
                getList={getList}
                getMatchDetailsFunc={getMatchDetailsFunc}
                onFiltering={onFiltering}
                resMessage={resMessage}
                resStatus={resStatus}
                search={searchText}
                setCombinationBotCount={setCombinationBotCount}
                setCopyBotCount={setCopyBotCount}
                setNormalBotCount={setNormalBotCount}
                setUserCount={setUserCount}
                sportsType={sportsType}
                url={url}
                userCopyTeams={`/${sportsType}/match-management/match-league-management/user-league/user-copy-teams/${matchId}/${matchLeagueId}`}
                userTeams={`/${sportsType}/match-management/match-league-management/user-league/user-teams/${matchId}/${matchLeagueId}`}
                userType={userType}
                userleagues={`/${sportsType}/match-management/match-league-management/user-league/user-leagues/${matchId}/${matchLeagueId}`}
              />
            </div>
          </section>
        </main>
      </Layout>

      { /* Modal to add system teams */}
      <Modal className="modal-confirm-bot" isOpen={modalMessage} toggle={toggleMessage}>
        <ModalHeader className='popup-modal-header modal-title-head' toggle={toggleMessage}>Add System Teams</ModalHeader>
        <ModalBody className="text-center">
          <Form className='user-sys-team-form'>
            <Row className='mt-3'>
              <Col className='p-0' md={12} xl={12}>
                <FormGroup className='user-team-text'>
                  <p>Enter the system team number that you desire to add</p>
                </FormGroup>
              </Col>
            </Row>

            <Row className='mt-3'>
              <Col className='p-0' md={12} xl={12}>
                <FormGroup className='user-team-form'>
                  <Label className='user-team-label' for="exampleTeams">
                    Teams
                    {' '}
                    <RequiredField/>
                  </Label>
                  <Input id="exampleTeams" name="exampleTeams" onChange={event => handleInputChange(event, 'Teams')} placeholder="Team Count" type="number" value={teams}/>
                </FormGroup>
              </Col>
            </Row>

            <Row className='user-team-form-checkbox mt-3'>
              <Col className='p-0' md={12} xl={12}>
                <FormGroup className='user-team-form-check'>
                  <Input checked={instantAdd} className='user-check' onChange={event => handleInputChange(event, 'InstantAdd')} type="checkbox" value='Y'/>
                  <Label className='user-check-label'>Add Instant Bot</Label>
                </FormGroup>
              </Col>
            </Row>

            {((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS !== 'R')) && (
              <Row className='mt-3'>
                <Col className='p-0' md={12} xl={12}>
                  <Button className="theme-btn success-btn full-btn" disabled={!teams} onClick={(e) => addBot(e)} type="submit">Add</Button>
                </Col>
              </Row>
            )}
          </Form>
        </ModalBody>
      </Modal>

      <Modal className="modal-confirm" isOpen={modalWarning} toggle={toggleWarning}>
        <ModalBody className='text-center'>
          <img alt='check' className='info-icon' src={warningIcon} />
          <h2 className='popup-modal-message'>Are you sure you want to stop it?</h2>
          <Row className='row-12'>
            <Col>
              <Button className="theme-btn outline-btn-cancel full-btn-cancel" onClick={toggleWarning} type='submit'>Cancel</Button>
            </Col>
            <Col>
              <Button className='theme-btn danger-btn full-btn' onClick={stopSystemTeam} type='submit'>Stop It</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

UserLeague.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default UserLeague
