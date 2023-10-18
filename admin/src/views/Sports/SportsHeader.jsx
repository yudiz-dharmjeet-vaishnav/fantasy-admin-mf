import React, { useState, useEffect, forwardRef, Fragment } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle, Col, Form, FormGroup, Input, Row, CustomInput } from 'reactstrap'
import { useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import makeAnimated from 'react-select/animated'
import Select from 'react-select'

import addlIcon from '../../assets/images/add-white-icon.svg'
import generateIcon from '../../assets/images/generate-icon.svg'
import fetchIcon from '../../assets/images/fetch-icon.svg'
import backIcon from '../../assets/images/back-icon-1.svg'
import calendarIcon from '../../assets/images/calendar.svg'
import excelIcon from '../../assets/images/excel-icon.svg'

// Common header component for sports tab(cricket, football, etc.)

const animatedComponents = makeAnimated()
function SportsHeader (props) {
  const {
    fetchMatchPlayerList,
    fetchPlaying11,
    lineupsOut,
    userLeagueList,
    MatchPageLink,
    generateScorePoint,
    setModalMessage,
    setModalWarning,
    prizeDistributionFunc,
    winPrizeDistributionFunc,
    rankCalculate,
    openModalToEditBot,
    pointCalculate,
    startDate,
    endDate,
    matchLeaguePage,
    seasonPoint,
    MatchDetails,
    leagueCount,
    matchLeague,
    seasonListPage,
    onExport,
    usersListInSeason,
    matchPlayerManagement,
    matchLeagueManagement,
    matchManagement,
    dateRange,
    setDateRange,
    fetchPlayingSevenFunc,
    fetchPlayingFiveFunc,
    status,
    userLeaguePage,
    matchLeagueList,
    promoUsageList,
    clearPendingReq,
    fetchLastMatchPlayerFunc,
    fetchMatchPlayer,
    copyBotLogs,
    copyBotLogsUrl,
    isCopyBotLogs,
    copyBotBackUrl,
    combinationBotLogs,
    combinationBotLogsFunc,
    baseTeams,
    baseTeamsPage,
    heading,
    provider,
    onFiltering,
    sFormat,
    listOfSeasons,
    selectedSeason,
    filterMatchStatus,
    onSeasonPagination,
    handleInputChange,
    sProvider,
    TeamManagement,
    playerManagement,
    userType,
    leagueType,
    userCount,
    normalBotCount,
    copyBotCount,
    combinationBotCount,
    userLeague,
    role,
    playerRoleList,
    onInputChange,
    teams,
    team,
    fetchMatchPlayersForNewMatch,
    apiGeneratedMatch,
    handleChange,
    matchListArr,
    margeMatch,
    SystemTeamMatchPlayers,
    teamName,
    onFilteringFunction,
    getExcelReports,
    excelUrl,
    leagueCancel,
    AutoSelect,
    autoSelectFunc,
    combinationBot,
    substitute
  } = props

  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const resStatus = useSelector(state => state.matchleague.resStatus)
  const [Lineupsout, setLineupsout] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const getFormatList = useSelector(state => state.pointSystem.getFormatsList)
  const [excelData, setExcelData] = useState()

  const [totalLeagueCount, setTotalLeagueCount] = useState(0)
  const [totalJoinedUser, setTotalJoinedUser] = useState(0)
  const [pointCalc, setPointCalc] = useState(0)
  const [rankCalc, setRankCalc] = useState(0)
  const [prizeCalc, setPrizeCalc] = useState(0)
  const [winPrizeCalc, setWinPrizeCalc] = useState(0)

  const params = useParams()

  useEffect(() => {
    if (resStatus) {
      setTotalJoinedUser(leagueCount?.nJoinedUsers || 0)
      setTotalLeagueCount(leagueCount?.nLeagueCount || 0)
      setPointCalc(leagueCount?.nPointCalculated || 0)
      setRankCalc(leagueCount?.nRankCalculated || 0)
      setPrizeCalc(leagueCount?.nPrizeCalculated || 0)
      setWinPrizeCalc(leagueCount?.nWinDistributed || 0)
    }
  }, [leagueCount])

  useEffect(() => {
    if (MatchDetails && MatchDetails.bLineupsOut) {
      setLineupsout(MatchDetails && MatchDetails.bLineupsOut ? MatchDetails.bLineupsOut : '')
    }

    return () => {
      setTotalJoinedUser('-')
      setTotalLeagueCount('-')
      setPointCalc('-')
      setRankCalc('-')
      setPrizeCalc('-')
      setWinPrizeCalc('-')
    }
  }, [MatchDetails])

  function lineupOut () {
    setLineupsout(!Lineupsout)
    lineupsOut(!Lineupsout)
  }

  function downLoadExcel (event) {
    event.preventDefault()
    setExcelData(event)
    window.open(event.target.value, '_blank')
  }

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range' onClick={onClick}>
      <img alt="calendar" src={calendarIcon} />
      <Input ref={ref} className='range' placeholder='DD/MM/YYYY' readOnly value={value} />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  return (
    <div className={status === 'I' && matchLeague ? 'inreview-header' : 'header-block'}>
      {(baseTeams || (combinationBotLogs && !location.pathname.includes('copy-bot-logs')) || (copyBotLogs && !location.pathname.includes('copy-bot-logs')) || props.combinationBotPage) && (
        <div className="filter-block d-flex justify-content-between align-items-start">
          <div className='d-flex inline-input'>
            {props.MatchPageLink && <img className='custom-go-back' height='20' onClick={() => MatchPageLink ? (clearPendingReq && clearPendingReq(), navigate(`${MatchPageLink}`)) : navigate(-1)} src={backIcon} width='20' />}
            {props.seasonListPage && <img className='custom-go-back' height='20' onClick={() => seasonListPage ? navigate(`${seasonListPage}${page?.SeasonList || ''}`) : navigate(-1)} src={backIcon} width='20' />}
            {props.matchLeaguePage && <img className='custom-go-back' height='20' onClick={() => (props?.goBack === true || props?.location?.state?.goBack) ? navigate(-1) : isCopyBotLogs ? navigate({ pathname: `${copyBotBackUrl}`, search: page?.MatchLeagueManagement || '' }) : navigate({ pathname: `${matchLeaguePage}`, search: page?.MatchLeagueManagement || '' })} src={backIcon} width='20' />}
            {props.userLeaguePage && <img className='custom-go-back' height='20' onClick={() => navigate(`${userLeaguePage}`)} src={backIcon} width='20' />}
          </div>
          <div className='btn-list'>
            {
              onExport && ((matchLeagueList?.total !== 0 && status === 'CMP') || ((usersListInSeason?.total > 0) || (userLeagueList?.data && userLeagueList.data[0].total > 0)) || (promoUsageList?.results?.length > 0)) &&
              <img alt="excel" className="header-button" onClick={props.onExport} src={excelIcon} style={{ cursor: 'pointer' }} title="Export" />
            }
            {baseTeams && (
            <Button color="link" onClick={() => navigate(baseTeamsPage)}>
              Super User Teams
            </Button>
            )}
            {copyBotLogs && !isCopyBotLogs && (
            <Button className="theme-btn ml-2 ml-0-480" onClick={() => navigate(copyBotLogsUrl)}>
              Copy Bot Logs
            </Button>
            )}
            {combinationBotLogs && !isCopyBotLogs && (
            <Button className="theme-btn ml-2 ml-0-480" onClick={combinationBotLogsFunc}>
              Combination Bot Logs
            </Button>
            )}
            {props.combinationBotPage && (
              <Button className="theme-btn ml-2 ml-0-480 mb-3" onClick={() => props.combinationBotLogsFunc()} type="submit">
                SHOW LOGS
              </Button>
            )}
            {props.fetchMatchPlayersForNewMatch && (
            <Button className="theme-btn icon-btn ml-2 ml-0-480" disabled={(!apiGeneratedMatch) || (adminPermission?.MATCHPLAYER === 'R')} onClick={fetchMatchPlayersForNewMatch}>
              <img alt="Fetch Match Player" src={fetchIcon} />
              Fetch Match Player
            </Button>
            )}
          </div>

        </div>
      )}

      {SystemTeamMatchPlayers && (
      <>
        <div className='combination-header'>
          <CustomInput
            className="searchFilter"
            id="teamName"
            name="teamName"
            onChange={(event) => onFilteringFunction(event, 'TeamName')}
            type="select"
            value={teamName}
          >
            <option value=''>Team Name</option>
            {teams && teams.length !== 0 && teams.map(data => {
              return (
                <option key={data.iTeamId} value={data.iTeamId}>{data.sName}</option>
              )
            })
          }
          </CustomInput>
          {!combinationBot && (
          <Button className="ml-2 button-section button-section-outline section-btn" disabled={adminPermission?.MATCHPLAYER === 'R'} onClick={autoSelectFunc} style={{ background: 'none' }}>
            Auto Select -
            {' '}
            {AutoSelect === false ? 'NO' : 'YES'}
          </Button>
          )}
        </div>
      </>
      )}
      {!matchManagement && (
      <Row className='d-flex align-items-center'>
        <Col className='ml-10px-480' lg={(status === 'p' || status === 'CMP') ? 6 : 4} md='12' xl={(status === 'p' || status === 'I') ? 4 : 6}>
          <div className='d-flex flex-wrap league-sub-header'>

            {matchLeague && (adminPermission?.MATCHLEAGUE !== 'N') && (
            <FormGroup>
              <Input className="search-box" name="search" onChange={props.handleSearch} placeholder='Search' type="search" value={props.search} />
            </FormGroup>
            )}

            {onFiltering && (
            <FormGroup>
              <CustomInput
                className='format-f w-100'
                id="promoType"
                name="promoType"
                onChange={(event) => onFiltering(event, 'promocode')}
                type="select"
                value={leagueType}
              >
                <option value="">Type</option>
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </CustomInput>
            </FormGroup>
            )}

            { onFiltering && (
            <FormGroup>
              <CustomInput
                className= {status === 'I' ? 'leagueFilter' : 'ReportFilter'}
                id="league"
                name='league'
                onChange={(event) => onFiltering(event, 'league')}
                type='select'
                value={leagueCancel}
              >
                <option value="">Status</option>
                <option value="true">Cancel League</option>
                <option value="false"> Not Cancel League</option>
              </CustomInput>
            </FormGroup>
            )}
          </div>

        </Col>

        {(props.permission && props.isShow && status && (status === 'U' || status === 'P')) && (
        <Col className='match-league-button-heading text-right text-align-left-480' lg={status === 'U' ? 8 : 4} md={12} xl={ status === 'P ' ? 8 : 6}>

          <div className='upcoming-pending'>
            {status && status === 'U' && (adminPermission?.SYSTEM_USERS === 'W' || Auth === 'SUPER') && (
            <Button className="theme-btn orange-btn mr-2" onClick={() => navigate(props.combinationBotUrl)} type="submit">
              EDIT COMBINATION BOT TEAMS
            </Button>
            )}
            {(props.normalBotTeamsTrue) && status && status === 'U' && (adminPermission?.SYSTEM_USERS === 'W' || Auth === 'SUPER') && (
            <Button className="theme-btn blue-btn mr-2" onClick={openModalToEditBot} type="submit">
              EDIT NORMAL BOT TEAMS
            </Button>
            )}
            {
                props.setUrl && (
                <Button className="theme-btn icon-btn" tag={Link} to={props.setUrl}>
                  <img alt="add" src={addlIcon} />
                  {props.buttonText}
                </Button>
                )}
          </div>
        </Col>
        )}
        {(props.extraWinListLink && status && status === 'CMP') && (
        <Col className='text-right text-align-left-480' lg={6} md={4} xl={status === 'CMP' ? 6 : 9}>
          {status && status === 'CMP' && (adminPermission?.SYSTEM_USERS === 'W' || Auth === 'SUPER') && (
          <Button className="theme-btn ml-2 ml-0-480" onClick={() => navigate(props.extraWinListLink)} type="submit">
            EXTRA WIN LIST
          </Button>
          )}
        </Col>
        )}

        {status && status === 'I' && (
        <Col className='inReview-button' xl={8}>
          <Row>
            {props.otherButton && (adminPermission?.MATCHLEAGUE !== 'N') && status && status === 'I' && (
            <Col className='calculation-card pl-3' lg='3' md='6' xl='3'>
              <Card>
                <CardBody className='card-body-div'>
                  <div className='card-body-section d-flex justify-content-between'>
                    <div>
                      <CardTitle>Points</CardTitle>
                      <CardSubtitle>
                        {pointCalc}
                        /
                        {totalJoinedUser}
                      </CardSubtitle>
                    </div>
                    <CardText>
                      <Button className='calculate-button' disabled={(pointCalc && rankCalc && prizeCalc && winPrizeCalc) || (pointCalc === totalJoinedUser) || (adminPermission?.MATCHLEAGUE === 'R') || (totalJoinedUser === 0)} onClick={pointCalculate}>
                        Calculate
                      </Button>
                    </CardText>
                  </div>
                </CardBody>
              </Card>
            </Col>
            )}
            {props.otherButton && (adminPermission?.MATCHLEAGUE !== 'N') && status && status === 'I' && (
            <Col className='calculation-card' lg='3' md='6' xl='3'>
              <Card>
                <CardBody className='card-body-div'>
                  <div className='card-body-section d-flex justify-content-between'>
                    <div>
                      <CardTitle>Rank</CardTitle>
                      <CardSubtitle>
                        {rankCalc}
                        {' '}
                        /
                        {' '}
                        {totalJoinedUser}
                      </CardSubtitle>
                    </div>
                    <CardText>
                      <Button className="calculate-button" disabled={(pointCalc === 0 && totalJoinedUser === 0) || (pointCalc !== totalJoinedUser) || (rankCalc === totalJoinedUser) || (pointCalc && rankCalc && prizeCalc && winPrizeCalc) || (adminPermission?.MATCHLEAGUE === 'R')} onClick={rankCalculate}>
                        Calculate
                      </Button>
                    </CardText>
                  </div>
                </CardBody>
              </Card>
            </Col>
            )}
            {props.otherButton && (adminPermission?.MATCHLEAGUE !== 'N') && status && status === 'I' && (
            <Col className='calculation-card' lg='3' md='6' xl='3'>
              <Card>
                <CardBody className='card-body-div'>
                  <div className='card-body-section d-flex justify-content-between'>
                    <div>
                      <CardTitle>Prize</CardTitle>
                      <CardSubtitle>
                        {prizeCalc}
                        {' '}
                        /
                        {' '}
                        {totalLeagueCount}
                      </CardSubtitle>
                    </div>
                    <CardText>
                      <Button className="calculate-button" disabled={((rankCalc !== totalJoinedUser) || (!rankCalc)) || (prizeCalc === totalLeagueCount) || (pointCalc && rankCalc && prizeCalc && winPrizeCalc) || (adminPermission?.MATCHLEAGUE === 'R')} onClick={prizeDistributionFunc}>
                        Calculate
                      </Button>
                    </CardText>
                  </div>
                </CardBody>
              </Card>
            </Col>
            )}
            {props.otherButton && (adminPermission?.MATCHLEAGUE !== 'N') && status && status === 'I' && (
            <Col className='calculation-card pr-3' lg='3' md='6' xl='3'>
              <Card>
                <CardBody className='card-body-div'>
                  <div className='card-body-section d-flex justify-content-between'>
                    <div>
                      <CardTitle>Win Prize</CardTitle>
                      <CardSubtitle>
                        {winPrizeCalc}
                        {' '}
                        /
                        {' '}
                        {totalLeagueCount}
                      </CardSubtitle>
                    </div>
                    <CardText>
                      <Button className="calculate-button" disabled={(prizeCalc !== totalLeagueCount || !rankCalc || !prizeCalc) || (pointCalc && rankCalc && prizeCalc && (winPrizeCalc === totalLeagueCount)) || (adminPermission?.MATCHLEAGUE === 'R')} onClick={winPrizeDistributionFunc}>
                        Distribute
                      </Button>
                    </CardText>
                  </div>
                </CardBody>
              </Card>
            </Col>
            )}
          </Row>
        </Col>
        )}
      </Row>
      )}

      {matchLeagueManagement && (
        <Row className='d-flex align-items-center'>
          <Col className='d-flex user-sub-header' lg='4' md='4'>
            <Form className='d-flex'>
              {props.hidden && (
                <FormGroup>
                  <Input className="search-box" name="search" onChange={props.handleSearch} placeholder='Search' type="search" value={props.search} />
                </FormGroup>
              )}
            </Form>
            {userLeague && (
            <FormGroup>
              <CustomInput
                className="format-f"
                id="userType"
                name="userType"
                onChange={(event) => onFiltering(event)}
                type="select"
                value={userType}
              >
                <option value="">All</option>
                <option value="U">
                  User
                  {userCount && (Auth && Auth === 'SUPER') ? '(' + userCount + ')' : ''}
                </option>
                <option value="B">
                  Bot
                  {normalBotCount && (Auth && Auth === 'SUPER') ? '(' + normalBotCount + ')' : ''}
                </option>
                <option value='CB'>
                  Copy Bot
                  {copyBotCount && (Auth && Auth === 'SUPER') ? '(' + copyBotCount + ')' : ''}
                </option>
                <option value='CMB'>
                  Combination Bot
                  {combinationBotCount && (Auth && Auth === 'SUPER') ? '(' + combinationBotCount + ')' : ''}
                </option>
              </CustomInput>
            </FormGroup>
            )}
          </Col>
          <Col className='text-right d-flex align-items-center justify-content-end' lg='8' md='8'>

            {(userLeagueList && status && status === 'L')
              ? (
                <div className='d-block' style={{ width: '60%' }}>
                  <marquee direction="left" width="100%">
                    <h5 className='text-danger'>Disclaimer : Rank and Points are not Accurate in Live Match</h5>
                  </marquee>
                </div>
                )
              : ''}
            {(userLeagueList && userLeagueList.matchLeague && userLeagueList.matchLeague.bBotCreate) && status && status === 'U' && (

              <Button className="theme-btn pink-btn " disabled={adminPermission?.MATCHPLAYER === 'R'} onClick={() => setModalWarning(true)} type="submit">
                STOP SYSTEM TEAM
              </Button>
            )}
            {props.AddSystemTeam && props.permission && (userLeagueList && userLeagueList.matchLeague && (!userLeagueList.matchLeague.bPrivateLeague)) && (status && status === 'U') && (
              <Button className="theme-btn icon-btn ml-2 ml-0-480" onClick={() => setModalMessage(true)}>
                <img alt="add" src={addlIcon} />
                {props.AddSystemTeam}
              </Button>
            )}
            { userLeagueList?.matchLeague?.eReportStatus === 'S' && userLeagueList?.matchLeague?.aReportUrl && (
            <CustomInput
              className='ReportFilter ml-2'
              id="userType"
              name="userType"
              onChange={(event) => downLoadExcel(event)}
              type="select"
              value={excelData}
            >
              <option value="select">Select</option>
              {
                  userLeagueList?.matchLeague?.aReportUrl.sort((a, b) => a.localeCompare(b))?.map((data, index) => {
                    return (
                      <React.Fragment key={index}>
                        <option value={excelUrl + data} >{data.substring(18)}</option>
                      </React.Fragment>
                    )
                  })
                }
            </CustomInput>
            )}
            {(userLeagueList?.matchLeague?.eMatchStatus === 'U' || userLeagueList?.matchLeague?.eMatchStatus === 'CMP' || userLeagueList?.matchLeague?.eMatchStatus === 'L' || userLeagueList?.matchLeague?.eMatchStatus === 'I') && <Button className="theme-btn icon-btn ml-2" disabled={userLeagueList?.matchLeague?.eReportStatus === 'P'} onClick={() => getExcelReports()}>{(userLeagueList?.matchLeague?.eReportStatus === 'N' || userLeagueList?.matchLeague?.eReportStatus === undefined) ? 'GENERATE REPORT' : userLeagueList?.matchLeague?.eReportStatus === 'P' ? 'GENERATE REPORT....' : 'REGENERATE REPORT'}</Button>}
          </Col>
        </Row>
      )}

      {matchPlayerManagement && (
        <Row className='d-flex align-items-center'>
          <Col className='pl-0 d-flex flex-wrap' md={(status !== 'P') ? 12 : 5} xl={5}>
            <Form className='d-flex league-sub-header flex-wrap'>
              {props.hidden && (
                <FormGroup className={(status !== 'P') ? '' : ''}>
                  <Input className={status && status === 'U' ? 'search-box format-f ' : 'search-box format-f '} name="search" onChange={props.handleSearch} placeholder='Search' type="search" value={props.search} />
                </FormGroup>
              )}
              <CustomInput
                className='substitute'
                id="Substitute"
                name="Substitute"
                value={substitute}
                onChange={(event) => onInputChange(event, 'Substitute')}
                type='select'
              >
                <option value="">Substitute Player</option>
                <option value={true}>Substitute</option>
                <option value={false}> Not Substitute</option>
              </CustomInput>
              <CustomInput
                className='format-f '
                id='Role'
                name='Role'
                onChange={(event) => onInputChange(event, 'Role')}
                type='select'
                value={role}
              >
                <option value=''>Role</option>

                {playerRoleList && playerRoleList.length !== 0 && playerRoleList.map((data, i) => {
                  return (
                    <option key={data.sName} value={data.sName}>{data.sFullName}</option>
                  )
                })
              }
              </CustomInput>
              <CustomInput
                className='format-f'
                id='Team'
                name='Team'
                onChange={(event) => onInputChange(event, 'Team')}
                type='select'
                value={team}
              >
                <option value=''>Team</option>

                {teams && teams.length !== 0 && teams.map(data => {
                  return (
                    <option key={data.iTeamId} value={data.iTeamId}>{data.sName}</option>
                  )
                })
                }
              </CustomInput>
            </Form>
          </Col>

          {seasonPoint || props.LineUpsOut || props.scorePoint || props.fetchPlayingEleven || props.fetchPlayingSeven || props.fetchPlayingFive || fetchMatchPlayer || props.permission}
          <Col className={(window.innerWidth > 968) ? 'text-right text-align-left-480 btn-list' : (window.innerWidth <= 768 && status && status !== 'U') ? 'text-right text-align-left-480 btn-list' : 'text-align-left-480 btn-list'} md={(status !== 'P') ? 12 : 7} xl={7}>
            {seasonPoint && status && status === 'U' && (
              <Button className="theme-btn pink-btn mr-2" disabled={adminPermission?.MATCHPLAYER === 'R'} onClick={seasonPoint}>
                Season point
              </Button>
            )}

            {props.scorePoint && (adminPermission?.SCORE_POINT !== 'N') && status && (status === 'I' || status === 'L') && (
              <Button className="theme-btn icon-btn ml-2" disabled={adminPermission?.SCORE_POINT === 'R'} onClick={generateScorePoint}>
                <img alt="add" src={generateIcon} />
                Generate Score Points
              </Button>
            )}
            {props.fetchPlayingEleven && MatchDetails?.eProvider !== 'CUSTOM' && status && (status === 'U') && (
              <Button className="theme-btn blue-btn mr-2" disabled={adminPermission?.MATCHPLAYER === 'R'} onClick={fetchPlaying11}>
                Fetch Playing 11
              </Button>
            )}
            {props.fetchPlayingSeven && status && (status === 'U') && (
              <Button className="theme-btn orange-btn ml-2" disabled={adminPermission?.MATCHPLAYER === 'R'} onClick={fetchPlayingSevenFunc}>
                <img alt="add" src={fetchIcon} />
                Fetch Playing 7
              </Button>
            )}
            {props.fetchPlayingFive && status && (status === 'U') && (
              <Button className="theme-btn purple-btn ml-2" disabled={adminPermission?.MATCHPLAYER === 'R'} onClick={fetchPlayingFiveFunc}>
                <img alt="add" src={fetchIcon} />
                Fetch Playing 5
              </Button>
            )}
            {props.fetchMatchPlayer && MatchDetails?.eProvider !== 'CUSTOM' && status && (status === 'U' || status === 'P') && (
              <Button className="theme-btn green-btn mr-2" disabled={adminPermission?.MATCHPLAYER === 'R'} onClick={fetchMatchPlayerList}>
                Fetch Match Player
              </Button>
            )}
            {fetchMatchPlayer && MatchDetails?.eProvider !== 'CUSTOM' && status && (status === 'U' || status === 'P') && (
              <Button className="theme-btn dark-blue-btn mr-2" disabled={adminPermission?.MATCHPLAYER === 'R'} onClick={fetchLastMatchPlayerFunc}>
                Fetch Last Match Player
              </Button>
            )}
            {(props.permission && props.isShowAddButton && status && (status === 'U' || status === 'P')) && (
              <Button className="theme-btn icon-btn ml-2" tag={Link} to={props.setUrl}>
                <img alt="add" src={addlIcon} />
                {props.buttonText}
              </Button>
            )}
            {props.LineUpsOut && MatchDetails?.eProvider !== 'CUSTOM' && status && (status === 'U') && (
              <Button className="ml-2 button-section button-section-outline section-btn" disabled={adminPermission?.MATCHPLAYER === 'R'} onClick={lineupOut} style={{ background: 'none' }}>
                Lineups Out -
                {' '}
                {Lineupsout === false ? 'NO' : 'YES'}
              </Button>
            )}
          </Col>
        </Row>
      )}

      {margeMatch && (
      <Row className='d-flex  align-items-center'>
        <Col className='d-flex  align-items-center p-0' lg="3" md="6" xl="3" >
          <Select
            captureMenuScroll={true}
            className='marge-filter'
            // menuPosition="fixed" this for sticky show option
            closeMenuOnSelect={true}
            components={animatedComponents}
            id="Match"
            isDisabled={adminPermission?.MATCH === 'R'}
            menuPlacement="auto"
            name="Match"
            onChange={selectedOption => handleChange(selectedOption)}
            options={matchListArr}
            placeholder="Select Match"
            value={apiGeneratedMatch}
          />

        </Col>
        <Col className='d-flex justify-content-end align-items-center p-0' lg="9" md="6" xl="9">
          <Button className="fetch-match-player" disabled={(!apiGeneratedMatch) || (adminPermission?.MATCHPLAYER === 'R')} onClick={fetchMatchPlayersForNewMatch}>
            <img alt="Fetch Match Player" src={fetchIcon} />
            Fetch Match Player
          </Button>
        </Col>
      </Row>
      )
    }
      {
              (props.searchDateBox || !props.hidden || heading || playerManagement || TeamManagement || props.extButton) && (
              <Row>
                <Col className='season-main' lg={10} md={matchManagement ? 8 : 9} xl={matchManagement ? 11 : 10}>
                  <Form className='d-flex fdc-480 flex-wrap header-form'>
                    {!props.hidden && (
                    <FormGroup>
                      <Input className="search-box" name="search" onChange={props.handleSearch} placeholder='Search' type="search" value={props.search} />
                      {leagueCount && (
                      <div className='total-text'>
                        Total Leagues :
                        <b>{leagueCount.nLeagueCount ? leagueCount.nLeagueCount : 0}</b>
                      </div>
                      )}
                      {totalLeagueCount
                        ? (
                          <div className='total-text'>
                            Total User Leagues :
                            <b>{totalLeagueCount}</b>
                          </div>
                          )
                        : ''}
                    </FormGroup>
                    )}
                    {props.searchDateBox && (
                    <FormGroup>
                      <DatePicker
                        customInput={<ExampleCustomInput />}
                        dropdownMode="select"
                        endDate={endDate}
                        isClearable={true}
                        onChange={(update) => {
                          setDateRange(update)
                        }}
                        peekNextMonth
                        placeholderText='Select Date Range'
                        selectsRange={true}
                        showMonthDropdown
                        showYearDropdown
                        startDate={startDate}
                        value={dateRange}
                      />
                    </FormGroup>
                    )}

                    {heading === 'Match Management' && (
                    <FormGroup>
                      <CustomInput
                        className='mt-2 format-f'
                        id="format"
                        name="format"
                        onChange={(event) => onFiltering(event, 'format')}
                        type="select"
                        value={sFormat}
                      >
                        <option value="">Format</option>
                        {
                    getFormatList?.length > 0 && getFormatList.map((format, i) => {
                      return (
                        <Fragment key={i}>
                          <option value={format}>{format}</option>
                        </Fragment>
                      )
                    })
                  }
                      </CustomInput>
                    </FormGroup>
                    )}

                    {heading === 'Match Management' && (
                    <FormGroup>
                      <CustomInput
                        type="select"
                        name="provider"
                        id="provider"
                        value={sProvider}
                        className='mt-2 provider-p'
                        onChange={(event) => onFiltering(event, 'provider')}
                      >
                        <option value="">Provider</option>
                        {(params?.sportstype !== 'csgo' && params?.sportstype !== 'dota2') && <option value="ENTITYSPORT">ENTITYSPORT</option>}
                        {(params?.sportstype !== 'hockey' && params?.sportstype !== 'csgo' && params?.sportstype !== 'dota2') && <option value="SPORTSRADAR">SPORTSRADAR</option>}
                        {(params?.sportstype === 'cricket' || params?.sportstype === 'football' || params?.sportstype === 'kabaddi') && <option value="ROANUZ">ROANUZ</option>}
                        {(params?.sportstype !== 'hockey' && params?.sportstype !== 'csgo' && params?.sportstype !== 'dota2') && <option value='CUSTOM'>CUSTOM</option>}
                        {(params?.sportstype === 'csgo' || params?.sportstype === 'dota2') && <option value="PANDASCORE">PANDASCORE</option>}
                      </CustomInput>
                    </FormGroup>
                    )}

                    {(TeamManagement || playerManagement) && (
                    <FormGroup>
                      <CustomInput
                        type="select"
                        name="provider"
                        id="provider"
                        value={provider}
                        className='provider-p'
                        onChange={onFiltering}
                        placeholder='heelo'
                      >
                        <option value="">Provider</option>
                        {(params?.sportstype !== 'csgo' && params?.sportstype !== 'dota2') && <option value="ENTITYSPORT">ENTITYSPORT</option>}
                        {(params?.sportstype !== 'hockey' && params?.sportstype !== 'csgo' && params?.sportstype !== 'dota2') && <option value="SPORTSRADAR">SPORTSRADAR</option>}
                        {(params?.sportstype === 'cricket' || params?.sportstype === 'football' || params?.sportstype === 'kabaddi') && <option value="ROANUZ">ROANUZ</option>}
                        {(params?.sportstype !== 'hockey' && params?.sportstype !== 'csgo' && params?.sportstype !== 'dota2') && <option value='CUSTOM'>CUSTOM</option>}
                        {(params?.sportstype === 'csgo' || params?.sportstype === 'dota2') && <option value="PANDASCORE">PANDASCORE</option>}
                      </CustomInput>
                    </FormGroup>
                    )}

                    {heading === 'Match Management' && (
                    <FormGroup>
                      <Select
                        captureMenuScroll={true}
                        className='season-select'
                        components={animatedComponents}
                        id="LeagueName"
                        isClearable={true}
                        menuPlacement="auto"
                        name="LeagueName"
                        onChange={selectedOption => onFiltering(selectedOption, 'season')}
                        onInputChange={(value) => handleInputChange(value)}
                        onMenuScrollToBottom={onSeasonPagination}
                        options={listOfSeasons}
                        placeholder="Season Name"
                        value={selectedSeason}
                      />
                    </FormGroup>
                    )}
                    {heading === 'Match Management' && (
                    <FormGroup>
                      <CustomInput
                        className='mt-2 status-s'
                        id="MatchStatus"
                        name="MatchStatus"
                        onChange={(event) => onFiltering(event, 'status')}
                        type="select"
                        value={filterMatchStatus}
                      >
                        <option value="">Status</option>
                        <option value="P">Pending</option>
                        <option value="U">Upcoming </option>
                        <option value="L">Live </option>
                        <option value="I">In-Review </option>
                        <option value="CMP">Completed </option>
                        <option value="CNCL">Cancel</option>
                      </CustomInput>
                    </FormGroup>
                    )}

                  </Form>
                </Col>
                <Col className='text-right text-left-480 p-0' lg={2} md={matchManagement ? 4 : 3} xl={matchManagement ? 1 : 2}>
                  {(props.extButton && props.permission) && (
                  <Button className="theme-btn icon-btn" tag={Link} to={props.setUrl}>
                    <img alt="add" src={addlIcon} />
                    {props.buttonText}
                  </Button>
                  )}
                </Col>
              </Row>
              )}

    </div>
  )
}

SportsHeader.propTypes = {
  handleSearch: PropTypes.func,
  heading: PropTypes.string,
  prizeDistributionFunc: PropTypes.func,
  selectedDate: PropTypes.string,
  setUrl: PropTypes.string,
  buttonText: PropTypes.string,
  otherButton: PropTypes.bool,
  fetchPlaying11: PropTypes.func,
  generateScorePoint: PropTypes.func,
  setModalMessage: PropTypes.func,
  setModalWarning: PropTypes.func,
  rankCalculate: PropTypes.func,
  pointCalculate: PropTypes.func,
  fetchMatchPlayerList: PropTypes.func,
  permission: PropTypes.bool,
  extButton: PropTypes.any,
  isShow: PropTypes.bool,
  leagueCount: PropTypes.object,
  hidden: PropTypes.any,
  searchDateBox: PropTypes.bool,
  lineupsOut: PropTypes.func,
  botUser: PropTypes.func,
  userLeagueList: PropTypes.object,
  MatchPageLink: PropTypes.string,
  winPrizeDistributionFunc: PropTypes.func,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  matchLeaguePageLink: PropTypes.string,
  seasonPoint: PropTypes.func,
  MatchDetails: PropTypes.object,
  matchLeague: PropTypes.bool,
  fetchPlayingEleven: PropTypes.bool,
  fetchMatchPlayer: PropTypes.bool,
  AddSystemTeam: PropTypes.any,
  onRefresh: PropTypes.func,
  handleDatePicker: PropTypes.func,
  LineUpsOut: PropTypes.bool,
  scorePoint: PropTypes.bool,
  refresh: PropTypes.bool,
  DateText: PropTypes.string,
  search: PropTypes.string,
  seasonListPage: PropTypes.string,
  onExport: PropTypes.func,
  usersListInSeason: PropTypes.object,
  matchManagement: PropTypes.bool,
  matchPlayerManagement: PropTypes.bool,
  matchLeagueManagement: PropTypes.bool,
  setDateRange: PropTypes.func,
  dateRange: PropTypes.array,
  onClick: PropTypes.func,
  value: PropTypes.string,
  isShowAddButton: PropTypes.bool,
  fetchPlayingSevenFunc: PropTypes.func,
  fetchPlayingSeven: PropTypes.bool,
  fetchPlayingFiveFunc: PropTypes.func,
  fetchPlayingFive: PropTypes.bool,
  status: PropTypes.string,
  matchLeaguePage: PropTypes.string,
  userLeaguePage: PropTypes.bool,
  matchLeagueList: PropTypes.object,
  promoUsageList: PropTypes.object,
  goBack: PropTypes.bool,
  location: PropTypes.object,
  clearPendingReq: PropTypes.func,
  editNormalBotTeams: PropTypes.func,
  normalBotTeamsTrue: PropTypes.bool,
  fetchLastMatchPlayerFunc: PropTypes.func,
  extraWinListLink: PropTypes.string,
  copyBotLogs: PropTypes.bool,
  copyBotLogsUrl: PropTypes.string,
  isCopyBotLogs: PropTypes.bool,
  copyBotBackUrl: PropTypes.string,
  combinationBotUrl: PropTypes.string,
  openModalToEditBot: PropTypes.func,
  setEditNormalBotModal: PropTypes.func,
  combinationBotLogs: PropTypes.bool,
  combinationBotPage: PropTypes.bool,
  combinationBotLogsFunc: PropTypes.func,
  baseTeams: PropTypes.bool,
  baseTeamsPage: PropTypes.string,
  provider: PropTypes.string,
  onFiltering: PropTypes.func,
  sFormat: PropTypes.string,
  listOfSeasons: PropTypes.array,
  selectedSeason: PropTypes.array,
  filterMatchStatus: PropTypes.string,
  onSeasonPagination: PropTypes.func,
  handleInputChange: PropTypes.func,
  sProvider: PropTypes.string,
  TeamManagement: PropTypes.bool,
  playerManagement: PropTypes.bool,
  leagueType: PropTypes.string,
  userType: PropTypes.string,
  combinationBotCount: PropTypes.string,
  userCount: PropTypes.string,
  normalBotCount: PropTypes.string,
  copyBotCount: PropTypes.string,
  userLeague: PropTypes.bool,
  onInputChange: PropTypes.func,
  role: PropTypes.string,
  team: PropTypes.string,
  playerRoleList: PropTypes.object,
  teams: PropTypes.array,
  fetchMatchPlayersForNewMatch: PropTypes.func,
  apiGeneratedMatch: PropTypes.object,
  handleChange: PropTypes.func,
  matchListArr: PropTypes.array,
  margeMatch: PropTypes.bool,
  SystemTeamMatchPlayers: PropTypes.bool,
  teamName: PropTypes.object,
  onFilteringFunction: PropTypes.func,
  getExcelReports: PropTypes.func,
  excelUrl: PropTypes.string,
  leagueCancel: PropTypes.string,
  AutoSelect: PropTypes.bool,
  autoSelectFunc: PropTypes.func,
  combinationBot: PropTypes.bool,
  substitute: PropTypes.bool

}

export default SportsHeader
