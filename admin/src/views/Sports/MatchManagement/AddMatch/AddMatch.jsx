/* eslint-disable no-case-declarations */
import React, { useState, useEffect, useRef, forwardRef, Fragment, useImperativeHandle } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Row, Col, FormGroup, Input, Label, Button, CustomInput, InputGroupText, ModalBody, ModalHeader, Modal, Collapse, CardBody } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import moment from 'moment'
import PropTypes from 'prop-types'

import star from '../../../../assets/images/star.svg'
import down from '../../../../assets/images/down-arrow.svg'
import calender from '../../../../assets/images/calendar.svg'
import viewIcon from '../../../../assets/images/view-eye.svg'
import caretBottom from '../../../../assets/images/caret-top.svg'
import caretIcon from '../../../../assets/images/caret-bottom.svg'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { isNumber, isScore, modalMessageFunc, verifyLength, verifyUrl, withoutSpace } from '../../../../helpers/helper'
import { getSeasonList } from '../../../../actions/season'
import { getSeriesNameList } from '../../../../actions/seriesLeaderBoard'

const AddMatch = forwardRef((props, ref) => {
  const {
    AddMatchFunc,
    UpdateMatch,
    teamName,
    SportsType,
    getTeamName,
    FormatsList,
    getMatchDetailsFunc,
    getLeagueListFunc,
    loading,
    setLoading,
    isCreate,
    setIsCreate, setUpdateDisableButton
  } = props
  const { id } = useParams()
  const [isOpenSeries, setIsOpenSeries] = useState(true)
  const toggleSeries = () => setIsOpenSeries(!isOpenSeries)
  const [isOpenMatchDetails, setIsOpenMatchDetails] = useState(false)
  const toggleMatchDetails = () => setIsOpenMatchDetails(!isOpenMatchDetails)
  const [isOpenOther, setIsOpenOther] = useState(false)
  const toggleOther = () => setIsOpenOther(!isOpenOther)
  const [provider, setProvider] = useState('')
  const [matchId, setMatchId] = useState('')
  const [info, setInfo] = useState('')
  const [options, setOptions] = useState([])
  const [tossOptions, setTossOptions] = useState([])
  const [Series, setSeries] = useState('')
  const [season, setSeasonName] = useState('')
  const [SeasonKey, setSeasonKey] = useState('')
  const [StatusNote, setStatusNote] = useState('')
  const [matchKey, setMatchKey] = useState('')
  const [MatchName, setMatchName] = useState('')
  const [Total, setTotal] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [searchType, setSearchType] = useState('')
  const [MatchFormat, setMatchFormat] = useState('')
  const [StartDate, setStartDate] = useState('')
  const [TeamAName, setTeamAName] = useState('')
  const [TeamBName, setTeamBName] = useState('')
  const [Venue, setVenue] = useState('')
  const [winningText, setWinningText] = useState('')
  const [MatchStatus, setMatchStatus] = useState('')
  const [StreamType, setStreamType] = useState('YOUTUBE')
  const [TeamAScore, setTeamAScore] = useState('')
  const [TeamBScore, setTeamBScore] = useState('')
  const [TossWinner, setTossWinner] = useState('')
  const [MaxTeamLimit, setMaxTeamLimit] = useState(0)
  const [matchOnTop, setMatchOnTop] = useState('N')
  const [disable, setDisable] = useState('Y')
  const [ChooseTossWinner, setChooseTossWinner] = useState('')
  const [SponsoredText, setSponsoredText] = useState('')
  const [FantasyPostID, setFantasyPostID] = useState('')
  const [StreamURL, setStreamURL] = useState('')
  const [scoreCardFlag, setScoreCardFlag] = useState('N')
  const [dreamTeamFlag, setDreamTeamFlag] = useState('N')
  // this state is hide
  // const [errFantasyPostID] = useState('')
  const [errStreamURL, setStreamURLErr] = useState('')
  const [activePageNo, setPageNo] = useState(1)
  const [errChooseTossWinner, setErrChooseTossWinner] = useState('')
  const [seasonErr, setSeasonErr] = useState('')
  const [errSeasonKey, setErrSeasonKey] = useState('')
  const [errMatchName, setErrMatchName] = useState('')
  const [errStartDate, setErrStartDate] = useState('')
  const [errTeamAName, setErrTeamAName] = useState('')
  const [errTeamBName, setErrTeamBName] = useState('')
  const [errVenue, setErrVenue] = useState('')
  const [errTeamAScore, seterrTeamAScore] = useState('')
  const [errTeamBScore, seterrTeamBScore] = useState('')
  const [errSponsoredText] = useState('')
  const [close, setClose] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [seriesOptions, setSeriesOptions] = useState([])
  const [seasonOptions, setSeasonOptions] = useState([])
  const [seasonTotal, setSeasonTotal] = useState(0)
  const [grandLeagueOptions, setGrandLeagueOptions] = useState([])
  const [grandLeague, setGrandLeague] = useState('')
  const [grandLeagueTotal, setGrandLeagueTotal] = useState(0)
  const [grandLeagueActivePage, setGrandLeagueActivePage] = useState(1)
  const [limit] = useState(10)
  const [seriesTotal, setSeriesTotal] = useState(0)
  const [seriesActivePage, setSeriesActivePage] = useState(1)
  const [seasonActivePage, setSeasonActivePage] = useState(1)
  const [liveInningsState, setLiveInningsState] = useState([])
  const [fullScoreCardState, setFullScoreCardState] = useState([])
  const [modalOpen, setModalOpen] = useState(false)

  const [field, setField] = useState([false, false, false, false])
  const [pitchDetails, setPitchDetails] = useState('')
  const [avgVenueScore, setAvgVenueScore] = useState('')
  const toggle = () => setModalOpen(!modalOpen)

  const matchDetails = useSelector((state) => state.match.matchDetails)
  const resStatus = useSelector((state) => state.match.resStatus)
  const resMessage = useSelector((state) => state.match.resMessage)
  const token = useSelector((state) => state.auth.token)
  const adminPermission = useSelector((state) => state.auth.adminPermission)
  const seasonList = useSelector(state => state.season.seasonList)
  const seriesNameList = useSelector(state => state.seriesLeaderBoard.seriesNameList)
  const liveInningsData = useSelector(state => state.match.liveInningsData)
  const fullScoreCardData = useSelector(state => state.match.fullScoreCardData)
  const matchLeagueListData = useSelector(state => state.matchleague.matchLeagueList)
  const previousProps = useRef({
    resStatus,
    resMessage,
    matchDetails,
    teamName,
    seriesNameList,
    searchValue,
    seasonList,
    liveInningsData,
    fullScoreCardData,
    matchLeagueListData
  }).current
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [modalMessage, setModalMessage] = useState(false)
  const [streamURLModal, setStreamURLModal] = useState(false)

  // through this condition if there is no changes in at update time submit button will remain disable
  const updateDisable = matchDetails && (previousProps.matchDetails !== matchDetails) && ((matchDetails.iSeriesId ? matchDetails.iSeriesId : '') === Series.value) &&
   matchDetails?.iSeasonId === (season && (season?.value?.split('/'))[0]) && matchDetails?.sSeasonKey === SeasonKey && matchDetails.sName === MatchName &&
   matchDetails.eFormat === MatchFormat && moment(matchDetails.dStartDate).isSame(StartDate) && matchDetails.sVenue === Venue && matchDetails?.eStatus === MatchStatus &&
   (matchDetails.oHomeTeam && (matchDetails.oHomeTeam.nScore ? matchDetails.oHomeTeam.nScore : '') === TeamAScore) && ((matchDetails.oAwayTeam && matchDetails.oAwayTeam.nScore ? matchDetails.oAwayTeam.nScore : '') === TeamBScore) &&
   ((matchDetails.nMaxTeamLimit ? matchDetails.nMaxTeamLimit : 0) === parseInt(MaxTeamLimit)) && ((matchDetails.sFantasyPost ? matchDetails.sFantasyPost : '') === FantasyPostID) &&
   ((matchDetails.sStreamUrl ? matchDetails.sStreamUrl : '') === StreamURL) && ((matchDetails.eStreamType ? matchDetails.eStreamType : '') === StreamType) && ((matchDetails.iTossWinnerId ? matchDetails.iTossWinnerId : '') === TossWinner) &&
   ((matchDetails.eTossWinnerAction ? matchDetails.eTossWinnerAction : '') === ChooseTossWinner) && ((matchDetails.sSponsoredText ? matchDetails.sSponsoredText : '') === SponsoredText) &&
   ((matchDetails.sInfo ? matchDetails.sInfo : '') === info) && (matchDetails?.bMatchOnTop === (matchOnTop === 'Y')) && (matchDetails?.bDisabled === (disable === 'Y')) &&
   (matchDetails.bScorecardShow === (scoreCardFlag === 'Y')) && (matchDetails.bDreamTeam === (dreamTeamFlag === 'Y')) && (matchDetails.sWinning ? matchDetails.sWinning : '') === winningText &&
   (matchDetails.iGrandLeagueId ? matchDetails.iGrandLeagueId : '') === grandLeague &&
   (matchDetails?.sPitchDetails ? matchDetails?.sPitchDetails : '') === (pitchDetails || '') &&
   (matchDetails?.nAvgVenueScore ? matchDetails?.nAvgVenueScore : '') === (parseInt(avgVenueScore) || avgVenueScore)

  useEffect(() => {
    if (id) {
      setIsCreate(false)
      setLoading(true)
      getLeagueListFunc(0, 10, '', id)
    }
    dispatch(getSeriesNameList(SportsType, searchValue, 0, limit, token))
    getSeasonListFunc(0, '')
    SportsType === 'cricket'
      ? setMatchFormat('ODI')
      : setMatchFormat(SportsType)
  }, [])

  function getSeasonListFunc (start, search) {
    const data = {
      start, limit: 10, search, sportsType: SportsType, startDate: '', endDate: '', token
    }
    dispatch(getSeasonList(data))
  }
  useEffect(() => {
    setUpdateDisableButton(updateDisable)
  }, [updateDisable])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.seasonList !== seasonList) {
      if (seasonList && seasonList.results && seasonList.results.length > 0) {
        const arr = [...seasonOptions]
        seasonList.results.map((data) => {
          const obj = {
            value: data._id + '/' + data.sKey,
            label: data.sName
          }
          arr.push(obj)
          return arr
        })
        setSeasonOptions(arr)
      }
      setLoading(false)
    }
    if (seasonList && seasonList.total) {
      setSeasonTotal(seasonList.total)
    }
    return () => {
      previousProps.seasonList = seasonList
    }
  }, [seasonList])

  // set grandLeagueList
  useEffect(() => {
    if (previousProps.matchLeagueListData !== matchLeagueListData) {
      if (matchLeagueListData && matchLeagueListData.results && matchLeagueListData.results.length > 0) {
        const arr = [...grandLeagueOptions]
        matchLeagueListData.results.map((data) => {
          const obj = {
            value: data._id,
            label:
  <>
    <p className='m-0'>
      {data.sName}

      (Total Payout :

      {data.nTotalPayout}
      )
    </p>
  </>
          }
          arr.push(obj)
          return arr
        })
        setGrandLeagueOptions(arr)
      }
      setLoading(false)
    }
    if (matchLeagueListData && matchLeagueListData.total) {
      setGrandLeagueTotal(matchLeagueListData.total)
    }
    return () => {
      previousProps.matchLeagueListData = matchLeagueListData
    }
  }, [matchLeagueListData])

  useEffect(() => {
    if (previousProps.seriesNameList !== seriesNameList) {
      if (seriesNameList && seriesNameList.aData && seriesNameList.aData.length > 0) {
        const arr = [...seriesOptions]
        seriesNameList.aData.map((series) => {
          const obj = {
            value: series._id,
            label: series.sName
          }
          arr.push(obj)
          return arr
        })
        setSeriesOptions(arr)
      }
      setLoading(false)
    }
    if (seriesNameList && seriesNameList.nTotal) {
      setSeriesTotal(seriesNameList.nTotal)
    }
    return () => {
      previousProps.seriesNameList = seriesNameList
    }
  }, [seriesNameList])

  useEffect(() => {
    if (previousProps.teamName !== teamName) {
      if (teamName && teamName.results) {
        const arr = [...options]
        if (teamName.results.length !== 0) {
          teamName.results.map(data => {
            const obj = {
              value: data._id,
              label: data.sName
            }
            arr.push(obj)
            return arr
          })
          setOptions(arr)
        }
        setLoading(false)
      }
    }

    if (teamName && teamName.total) {
      setTotal(teamName.total)
    }
    return () => {
      previousProps.teamName = teamName
    }
  }, [teamName])

  // handle TeamA and TeamB name
  useEffect(() => {
    if (TeamAName && TeamBName && TeamBName.value && TeamAName.value) {
      const arr = []
      if (TeamAName.value && TeamBName.value) {
        const obj = {
          value: TeamAName.value,
          label: TeamAName.label
        }
        const obj2 = {
          value: TeamBName.value,
          label: TeamBName.label
        }
        arr.push(obj, obj2)
      }
      setTossOptions(arr)

      if (TeamAName.value === TeamBName.value) {
        setErrTeamAName('Same Team Name')
        setErrTeamBName('Same Team Name')
      } else {
        setErrTeamAName('')
        setErrTeamBName('')
      }
    }
  }, [TeamAName, TeamBName])

  useEffect(() => {
    if (previousProps.liveInningsData !== liveInningsData) {
      if (liveInningsData) {
        setLiveInningsState(liveInningsData)
        setModalOpen(true)
      }
    }
    if (previousProps.fullScoreCardData !== fullScoreCardData) {
      if (fullScoreCardData) {
        setFullScoreCardState(fullScoreCardData)
      }
    }
    return () => {
      previousProps.liveInningsData = liveInningsData
      previousProps.fullScoreCardData = fullScoreCardData
    }
  }, [liveInningsData, fullScoreCardData])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus && isCreate) {
          // match add a success full when navigate this url with ResMessage
          navigate(`/${SportsType}/match-management`, {
            state: {
              message: resMessage,
              resStatus: resStatus
            }
          })
        } else {
          if (resStatus) {
            setLoading(false)
          }
          getMatchDetailsFunc()
          setLoading(true)
          setModalMessage(true)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // set all need to matchDetails related state
  useEffect(() => {
    if (previousProps.matchDetails !== matchDetails) {
      if (matchDetails) {
        const arr = []
        if (
          matchDetails.oAwayTeam &&
          matchDetails.oAwayTeam.iTeamId &&
          matchDetails.oHomeTeam &&
          matchDetails.oHomeTeam.iTeamId
        ) {
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
        setTossOptions(arr)
        setMatchId(matchDetails._id)
        setTossWinner(
          matchDetails.iTossWinnerId ? matchDetails.iTossWinnerId : ''
        )
        setChooseTossWinner(
          matchDetails.eTossWinnerAction ? matchDetails.eTossWinnerAction : ''
        )
        setMatchOnTop(matchDetails.bMatchOnTop === true ? 'Y' : 'N')
        setDisable(matchDetails.bDisabled === true ? 'Y' : 'N')
        setMatchStatus(matchDetails.eStatus ? matchDetails.eStatus : '')
        setStreamType(matchDetails.eStreamType ? matchDetails.eStreamType : 'YOUTUBE')
        setTeamAName({
          label:
            matchDetails &&
              matchDetails.oHomeTeam &&
              matchDetails.oHomeTeam.sName
              ? matchDetails.oHomeTeam.sName
              : '',
          value:
            matchDetails &&
              matchDetails.oHomeTeam &&
              matchDetails.oHomeTeam.iTeamId
              ? matchDetails.oHomeTeam.iTeamId
              : ''
        })
        setTeamBName({
          label:
            matchDetails &&
              matchDetails.oAwayTeam &&
              matchDetails.oAwayTeam.sName
              ? matchDetails.oAwayTeam.sName
              : '',
          value:
            matchDetails &&
              matchDetails.oAwayTeam &&
              matchDetails.oAwayTeam.iTeamId
              ? matchDetails.oAwayTeam.iTeamId
              : ''
        })
        setSeasonName(matchDetails.oSeason ? { label: matchDetails.oSeason?.sName || '', value: matchDetails.oSeason?._id || '' } : '')
        setGrandLeague(matchDetails.oGrandLeague
          ? {
              label:
            <>
              <p className='m-0'>
                {matchDetails.oGrandLeague.sName}

                (Total Payout :

                {matchDetails.oGrandLeague.nTotalPayout}
                )
              </p>
            </> || '',
              value: matchDetails.oGrandLeague?._id || ''
            }
          : '')
        setInfo(matchDetails.sInfo ? matchDetails.sInfo : '')
        setSeasonKey(matchDetails?.sSeasonKey || '')
        setStatusNote(matchDetails?.sStatusNote || '')
        setMatchName(matchDetails.sName)
        setSeries(matchDetails.oSeries ? { label: matchDetails.oSeries?.sName || '', value: matchDetails.oSeries?._id || '' } : '')
        setMatchFormat(matchDetails.eFormat)
        setStartDate(new Date(moment(matchDetails.dStartDate).format()))
        setVenue(matchDetails.sVenue)
        setPitchDetails(matchDetails?.sPitchDetails ? matchDetails.sPitchDetails : '')
        setAvgVenueScore(matchDetails?.nAvgVenueScore ? matchDetails.nAvgVenueScore : '')
        setSponsoredText(
          matchDetails.sSponsoredText ? matchDetails.sSponsoredText : ''
        )
        setTeamAScore(
          matchDetails &&
            matchDetails.oHomeTeam &&
            matchDetails.oHomeTeam.nScore
            ? matchDetails.oHomeTeam.nScore
            : ''
        )
        setTeamBScore(
          matchDetails &&
            matchDetails.oAwayTeam &&
            matchDetails.oAwayTeam.nScore
            ? matchDetails.oAwayTeam.nScore
            : ''
        )
        setMaxTeamLimit(
          matchDetails && matchDetails.nMaxTeamLimit
            ? matchDetails.nMaxTeamLimit
            : 0
        )
        setFantasyPostID(
          matchDetails && matchDetails.sFantasyPost
            ? matchDetails.sFantasyPost
            : ''
        )
        setStreamURL(
          matchDetails && matchDetails.sStreamUrl ? matchDetails.sStreamUrl : ''
        )
        setMatchKey(matchDetails && matchDetails.sKey ? matchDetails.sKey : '')
        setProvider(matchDetails.eProvider ? matchDetails.eProvider : '')
        setWinningText(matchDetails.sWinning ? matchDetails.sWinning : '')
        setScoreCardFlag(matchDetails.bScorecardShow ? 'Y' : 'N')
        setDreamTeamFlag(matchDetails.bDreamTeam ? 'Y' : 'N')
        setLoading(false)
      }
    }
    return () => {
      previousProps.matchDetails = matchDetails
    }
  }, [matchDetails])

  function handleChange (event, type) {
    switch (type) {
      case 'season':
        if (event) {
          setSeasonErr('')
        } else {
          setSeasonErr('Required field')
        }
        const seasonData = (event.value).split('/')
        setSeasonName(event)
        setSeasonKey(seasonData[1])
        if (errSeasonKey) {
          setErrSeasonKey('')
        }
        break
      case 'grandLeague':
        setGrandLeague(event)
        break
      case 'Series':
        setSeries(event)
        break
      case 'TossWinner':
        if (event.target.value === '') {
          setTossWinner(event.target.value)
          setChooseTossWinner('')
        } else {
          setTossWinner(event.target.value)
        }
        errChooseTossWinner && setErrChooseTossWinner('')
        break
      case 'ChooseTossWinner':
        if (verifyLength(event.target.value, 1)) {
          setErrChooseTossWinner('')
        } else if (TossWinner && !verifyLength(event.target.value, 1)) {
          setErrChooseTossWinner('Required field')
        }
        setChooseTossWinner(event.target.value)
        break
      case 'SeasonKey':
        if (verifyLength(event.target.value, 1)) {
          if (withoutSpace(event.target.value)) {
            setErrSeasonKey('No space')
          } else {
            setErrSeasonKey('')
          }
        } else {
          setErrSeasonKey('Required field')
        }
        setSeasonKey(event.target.value)
        break
      case 'MatchStatus':
        setMatchStatus(event.target.value)
        break
      case 'StreamType':
        setStreamType(event.target.value)
        break
      case 'MatchName':
        if (verifyLength(event.target.value, 1)) {
          setErrMatchName('')
        } else {
          setErrMatchName('Required field')
        }
        setMatchName(event.target.value)
        break
      case 'SponsoredText':
        setSponsoredText(event.target.value)
        break
      case 'TeamAName':
        if (verifyLength(event.value, 1)) {
          setErrTeamAName('')
        } else {
          setErrTeamAName('Required field')
        }
        setTeamAName(event)
        break
      case 'TeamBName':
        if (verifyLength(event.value, 1)) {
          setErrTeamBName('')
        } else {
          setErrTeamBName('Required field')
        }
        setTeamBName(event)
        break
      case 'TeamAScore':
        if (event.target.value && !isScore(event.target.value)) {
          seterrTeamAScore('Enter proper score')
        } else {
          seterrTeamAScore('')
          seterrTeamBScore('')
          TeamBScore && setTeamBScore('')
        }
        setTeamAScore(event.target.value)
        break
      case 'TeamBScore':
        if (event.target.value && !isScore(event.target.value)) {
          seterrTeamBScore('Enter proper score')
        } else if (TeamAScore && !event.target.value) {
          seterrTeamBScore('Required field')
        } else {
          seterrTeamBScore('')
        }
        setTeamBScore(event.target.value)
        break
      case 'Venue':
        if (verifyLength(event.target.value, 1)) {
          setErrVenue('')
        } else {
          setErrVenue('Required field')
        }
        setVenue(event.target.value)
        break
      case 'MatchFormat':
        setMatchFormat(event.target.value)
        break
      case 'matchOnTop':
        setMatchOnTop(event.target.value)
        break
      case 'disable':
        setDisable(event.target.value)
        break
      case 'StartDate':
        const Dated = moment(event).format('DD/MM/YYYY hh:mm A')
        if (verifyLength(Dated, 1)) {
          setErrStartDate('')
        } else {
          setErrStartDate('Required field')
        }
        setStartDate(event)
        break
      case 'MaxTeamLimit':
        if (isNumber(event.target.value) || (!event.target.value)) {
          setMaxTeamLimit(event.target.value)
        }
        break
      case 'FantasyPostID':
        setFantasyPostID(event.target.value)
        break
      case 'StreamURL':
        if (event.target.value && !verifyUrl(event.target.value)) {
          setStreamURLErr('Enter valid URL')
        } else {
          setStreamURLErr('')
        }
        setStreamURL(event.target.value)
        break
      case 'Info':
        setInfo(event.target.value)
        break
      case 'WinningText':
        setWinningText(event.target.value)
        break
      case 'ScoreCardFlag':
        setScoreCardFlag(event.target.value)
        break
      case 'DreamTeamFlag':
        setDreamTeamFlag(event.target.value)
        break
      case 'PitchDetails':
        setPitchDetails(event.target.value)
        break
      case 'AvgVenueScore':
        setAvgVenueScore(event.target.value)
        break
      default:
        break
    }
  }

  // add and update match
  function onAdd (e) {
    const validateCreate = season && verifyLength(SeasonKey, 1) && verifyLength(MatchName, 1) && MatchFormat && TeamAName && TeamBName && StartDate && verifyLength(Venue, 1) && !seasonErr && !errSeasonKey &&
    !errMatchName && !errStartDate && !errVenue && !errTeamAScore && !errTeamBScore && !errTeamAName && !errTeamBName && !errStreamURL
    const validateEdit = season && verifyLength(MatchName, 1) && MatchFormat && TeamAName && TeamBName && StartDate && verifyLength(Venue, 1) && !seasonErr && !errSeasonKey &&
      !errMatchName && !errStartDate && !errVenue && !errTeamAScore && !errTeamBScore && !errTeamAName && !errTeamBName && !errStreamURL
    const validation = isCreate ? validateCreate : validateEdit
    if (validation) {
      let contestDate
      if (StartDate) {
        contestDate = new Date(StartDate).toISOString()
      }
      const seasonKey = season.value.split('/')
      if (isCreate) {
        AddMatchFunc(Series.value, seasonKey[0], season.label, SeasonKey, MatchName, MatchFormat, contestDate, TeamAName.value, TeamBName.value, TeamAScore, TeamBScore, Venue, matchOnTop, TossWinner, ChooseTossWinner, disable, parseInt(MaxTeamLimit), SponsoredText, FantasyPostID, StreamURL, StreamType, matchKey, info, winningText, scoreCardFlag, grandLeague, dreamTeamFlag, pitchDetails, avgVenueScore)
      } else {
        UpdateMatch(Series.value, seasonKey[0], season.label, SeasonKey, MatchName, MatchFormat, contestDate, TeamAName.value, TeamBName.value, TeamAScore, TeamBScore, Venue, MatchStatus, TossWinner, ChooseTossWinner, matchOnTop, disable, parseInt(MaxTeamLimit), SponsoredText, FantasyPostID, StreamURL, StreamType, matchKey, info, winningText, scoreCardFlag, grandLeague, dreamTeamFlag, pitchDetails, avgVenueScore)
      }
      setLoading(true)
    } else {
      if (!season) {
        setSeasonErr('Required field')
      }
      if (!verifyLength(SeasonKey, 1)) {
        setErrSeasonKey('Required field')
      }
      if (!verifyLength(MatchName, 1)) {
        setErrMatchName('Required field')
      }
      if (!StartDate) {
        setErrStartDate('Required field')
      }
      if (!TeamAName.value) {
        setErrTeamAName('Required field')
      }
      if (!TeamBName.value) {
        setErrTeamBName('Required field')
      }
      if (!StartDate) {
        setErrStartDate('Required field')
      }
      if (!verifyLength(Venue, 1)) {
        setErrVenue('Required field')
      }
    }
  }
  useImperativeHandle(ref, () => ({
    onAdd
  }))

  // pagination for series field
  function onSeriesPagination () {
    const length = Math.ceil(seriesTotal / 10)
    if (seriesActivePage < length) {
      const start = seriesActivePage * 10
      dispatch(getSeriesNameList(SportsType, searchValue, start, limit, token))
      setSeriesActivePage(seriesActivePage + 1)
    }
  }

  // pagination for season field
  function onSeasonPagination () {
    const length = Math.ceil(seasonTotal / 10)
    if (seasonActivePage < length) {
      const start = seasonActivePage * 10
      getSeasonListFunc(start, searchValue)
      setSeasonActivePage(seasonActivePage + 1)
    }
  }

  // pagination for grandLeaguePagination
  function onGrandLeaguePagination () {
    const length = Math.ceil(grandLeagueTotal / 10)
    if (grandLeagueActivePage < length) {
      const start = grandLeagueActivePage * 10
      const limit = 10
      getLeagueListFunc(start, limit, searchValue, matchId)
      setGrandLeagueActivePage(grandLeagueActivePage + 1)
    }
  }

  // pagination for teams field
  function onPagination () {
    const length = Math.ceil(Total / 10)
    if (activePageNo < length) {
      const start = activePageNo * 10
      getTeamName(start, searchValue)
      setPageNo(activePageNo + 1)
    }
  }

  useEffect(() => {
    const callSearchService = () => {
      if (searchType === 'Series') {
        const isSeriesTotalValid = (seriesTotal !== seriesOptions.length)
        const isValueNotInList = !(seriesNameList.aData.some(series => series.sName.toUpperCase().includes(searchValue) || series.sName.toLowerCase().includes(searchValue)))
        if (isSeriesTotalValid && isValueNotInList) {
          const start = 0
          dispatch(getSeriesNameList(SportsType, searchValue, start, limit, token))
          setPageNo(1)
          setLoading(true)
        }
      } else if (searchType === 'season') {
        const start = 0
        const isSeasonTotalValid = (seasonTotal !== seasonOptions.length)
        const isSeasonNotInList = !(seasonList.results.some(data => data.sName.toUpperCase().includes(searchValue) || data.sName.toLowerCase().includes(searchValue)))
        if (isSeasonTotalValid && isSeasonNotInList) {
          getSeasonListFunc(start, searchValue)
          setLoading(true)
        }
      } else if (searchType === 'TeamName') {
        const start = 0
        const isTeamTotalValid = (Total !== options.length)
        const isTeamNotInList = !(teamName.results.some(team => team.sName.toUpperCase().includes(searchValue) || team.sName.toLowerCase().includes(searchValue)))
        if (isTeamTotalValid && isTeamNotInList) {
          getTeamName(start, searchValue)
          setLoading(true)
          setPageNo(1)
        }
      } else if (searchType === 'grandLeague') {
        const start = 0
        const isGrandLeagueTotalValid = (grandLeagueTotal !== grandLeagueOptions.length)
        const isGrandLeagueNotInList = !(matchLeagueListData.results.some(team => team.sName.toUpperCase().includes(searchValue) || team.sName.toLowerCase().includes(searchValue)))
        if (isGrandLeagueTotalValid && isGrandLeagueNotInList) {
          getLeagueListFunc(start, 10, searchValue, matchId)
          setLoading(true)
        }
      }
    }
    if (previousProps.searchValue !== searchValue) {
      const deBouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(deBouncer)
        previousProps.searchValue = searchValue
      }
    }
    return () => {
      previousProps.searchValue = searchValue
    }
  }, [searchValue])

  function handleInputChange (value, type) {
    setSearchValue(value)
    setSearchType(type)
  }

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className={errStartDate ? 'form-control date-range-notify league-placeholder-error' : 'form-control date-range-notify' } onClick={onClick}>
      <img alt="" src={calender} />
      <Input ref={ref} className='date-input range ' placeholder='Enter match date' readOnly value={value} />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  return (
    <main className='main-content'>
      {loading && <Loading />}

      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      <section className='common-box management-section'>
        <section className='add-contest-section'>
          <div className='match-details'>
            <div className='common-box'>
              <h2 className='common-box-header' onClick={toggleSeries}>
                Series Details
                <span className='carer-Icons'>
                  <img alt="caret-icon" src={isOpenSeries ? caretBottom : caretIcon} />
                </span>
              </h2>
              <Collapse isOpen={isOpenSeries}>
                <Row className='series-row'>
                  <Col lg={4} md={6} xl={4}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='Series'> Series</Label>
                      <Select
                        controlShouldRenderValue={seriesOptions}
                        id='series'
                        isDisabled={adminPermission?.MATCH === 'R'}
                        name='series'
                        onChange={(selectedOption) => handleChange(selectedOption, 'Series')}
                        onInputChange={(value) => handleInputChange(value, 'Series')}
                        onMenuScrollToBottom={onSeriesPagination}
                        options={seriesOptions}
                        placeholder='Select a Series'
                        type='select'
                        value={Series}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg={4} md={6} xl={4}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='season'>
                        Season Name
                        <RequiredField/>
                      </Label>
                      <Select
                        className={seasonErr ? 'league-placeholder-error ' : 'league-placeholder'}
                        controlShouldRenderValue={seasonOptions}
                        id='season'
                        isDisabled={adminPermission?.MATCH === 'R'}
                        name='season'
                        onChange={(selectedOption) => handleChange(selectedOption, 'season')}
                        onInputChange={(value) => handleInputChange(value, 'season')}
                        onMenuScrollToBottom={onSeasonPagination}
                        options={seasonOptions}
                        placeholder='Select a season'
                        type='select'
                        value={season}
                      />
                      <p className='error-text'>{seasonErr}</p>
                    </FormGroup>
                  </Col>
                  <Col lg={4} md={6} xl={4}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='SeasonKey'>
                        Season Key

                        <RequiredField/>
                      </Label>
                      {isCreate
                        ? (
                          <Input
                            className={seasonErr ? 'league-placeholder-error ' : 'league-placeholder'}
                            disabled={
                          adminPermission?.MATCH === 'R'
                        }
                            id='SeasonKey'
                            onChange={(event) => handleChange(event, 'SeasonKey')}
                            placeholder='Enter Season Key'
                            type='text'
                            value={SeasonKey}
                          />
                          )
                        : <InputGroupText className='input-group-text'>{SeasonKey}</InputGroupText>}
                      <p className='error-text'>{errSeasonKey}</p>
                    </FormGroup>
                  </Col>
                </Row>
              </Collapse>
            </div>
          </div>

          <div className='match-details'>
            <div className='common-box'>
              <h2 className='common-box-header' onClick={toggleMatchDetails}>
                Match Details

                <span className='carer-Icons'>

                  <img alt="caret-icon" src={isOpenMatchDetails ? caretBottom : caretIcon} />
                </span>
              </h2>
              <Collapse isOpen={isOpenMatchDetails}>
                <Row className='series-row'>
                  {!isCreate && matchKey && (
                  <Col lg={12} md={6} xl={12}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='MatchKey'>Match Key</Label>
                      <InputGroupText>{matchKey}</InputGroupText>
                    </FormGroup>
                  </Col>
                  )}
                  <Col lg={4} md={6} xl={4}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='MatchName'>
                        Match Name

                        <RequiredField/>
                      </Label>
                      <Input
                        className={errMatchName ? 'league-placeholder-error ' : 'league-placeholder'}
                        disabled={adminPermission?.MATCH === 'R'}
                        id='MatchName'
                        onChange={(event) => handleChange(event, 'MatchName')}
                        placeholder='Enter Match Name'
                        type='text'
                        value={MatchName}
                      />
                      <p className='error-text'>{errMatchName}</p>
                    </FormGroup>
                  </Col>
                  <Col lg={4} md={6} xl={4}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='matchFormat'>Match Format </Label>
                      <CustomInput
                        className='custom-input-filter'
                        disabled={adminPermission?.MATCH === 'R'}
                        id='matchFormat'
                        name='select'
                        onChange={(event) => handleChange(event, 'MatchFormat')}
                        type='select'
                        value={MatchFormat}
                      >
                        {FormatsList &&
                        FormatsList.length !== 0 &&
                        FormatsList.map((data, i) => {
                          return (
                            <option key={data} value={data}>
                              {data}
                            </option>
                          )
                        })}
                      </CustomInput>
                    </FormGroup>
                  </Col>
                  <Col lg={4} md={6} xl={4}>
                    <FormGroup className='date-picker-filter form-group-match d-flex flex-column'>
                      <Label className='match-edit-label' for='startDate'>
                        Match Date

                        <RequiredField/>
                      </Label>
                      <DatePicker
                        className={errStartDate ? 'league-placeholder-error ' : 'league-placeholder'}
                        customInput={<ExampleCustomInput />}
                        dateFormat="dd-MM-yyyy h:mm aa"
                        disabled={adminPermission?.MATCH === 'R'}
                        onChange={(date) => {
                          handleChange(date, 'StartDate')
                        }}
                        selected={StartDate}
                        showTimeSelect
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        timeIntervals={1}
                        value={StartDate}
                      />

                      <p className='error-text'>{errStartDate}</p>
                    </FormGroup>
                  </Col>
                  <Col lg={12} md={6} xl={12}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='Venue'>

                        Venue

                        <RequiredField/>
                      </Label>
                      <Input
                        className={errVenue ? 'league-placeholder-error ' : 'league-placeholder'}
                        disabled={adminPermission?.MATCH === 'R'}
                        id='Venue'
                        onChange={(event) => handleChange(event, 'Venue')}
                        placeholder='Enter Venue'
                        type='text'
                        value={Venue}
                      />
                      <p className='error-text'>{errVenue}</p>
                    </FormGroup>
                  </Col>
                  <Col lg={6} md={6} xl={6}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='TeamAName'>
                        Season Team A Name

                        <RequiredField/>
                      </Label>
                      <Select
                        className={errTeamAName ? 'league-placeholder-error ' : 'league-placeholder'}
                        controlShouldRenderValue={options}
                        id='SeasonAname'
                        isDisabled={!isCreate}
                        name='SeasonAname'
                        onChange={(selectedOption) =>
                          handleChange(selectedOption, 'TeamAName')
                      }
                        onInputChange={(value) => handleInputChange(value, 'TeamName')}
                        onMenuScrollToBottom={onPagination}
                        options={options}
                        placeholder='Enter Team A Name'
                        value={TeamAName}
                      />
                      <p className='error-text'>{errTeamAName}</p>
                    </FormGroup>
                  </Col>
                  <Col lg={6} md={6} xl={6}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='TeamBName'>
                        Season Team B Name

                        <RequiredField/>
                      </Label>
                      <Select
                        className={errTeamBName ? 'league-placeholder-error ' : 'league-placeholder'}
                        id='TeamBName'
                        isDisabled={!isCreate}
                        name='TeamBName'
                        onChange={(selectedOption) =>
                          handleChange(selectedOption, 'TeamBName')
                      }
                        onInputChange={(value) => handleInputChange(value, 'TeamName')}
                        onMenuScrollToBottom={onPagination}
                        options={options}
                        placeholder='Enter Team B Name'
                        value={TeamBName}
                      />
                      <p className='error-text'>{errTeamBName}</p>
                    </FormGroup>
                  </Col>
                  <Col lg={6} md={6} xl={6}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='season'>Grand League</Label>
                      <Select
                        controlShouldRenderValue={grandLeagueOptions}
                        id='grandLeague'
                        isDisabled={adminPermission?.MATCH === 'R'}
                        name='grandLeague'
                        onChange={(selectedOption) => handleChange(selectedOption, 'grandLeague')}
                        onInputChange={(value) => handleInputChange(value, 'grandLeague')}
                        onMenuScrollToBottom={onGrandLeaguePagination}
                        options={grandLeagueOptions}
                        placeholder='Select a Grand League'
                        type='select'
                        value={grandLeague}
                      />
                    </FormGroup>
                  </Col>
                  {!isCreate && (
                  <Col lg={6} md={6} xl={6}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='MatchStatus'> Match Status</Label>
                      <CustomInput
                        className='custom-input-filter'
                        disabled={
                          adminPermission?.MATCH === 'R'
                        }
                        id='MatchStatus'
                        name='MatchStatus'
                        onChange={(event) => handleChange(event, 'MatchStatus')}
                        type='select'
                        value={MatchStatus}
                      >
                        <option value='P'>Pending</option>
                        <option value='U'>Upcoming </option>
                        <option value='L'>Live </option>
                        <option value='I'>In-review</option>
                        <option value='CMP'>Completed </option>
                        <option value='CNCL'>Cancel</option>
                      </CustomInput>
                    </FormGroup>
                  </Col>
                  )}
                  {!isCreate && provider && (
                  <Col lg={6} md={6} xl={6}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='MatchStatus'>Provider</Label>
                      <InputGroupText>{provider}</InputGroupText>
                    </FormGroup>
                  </Col>
                  )}

                  <Col lg={6} md={6} xl={6}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='TeamAScore'>Season Team A Score</Label>
                      <Input
                        disabled={adminPermission?.MATCH === 'R'}
                        id='TeamAScore'
                        onChange={(event) => handleChange(event, 'TeamAScore')}
                        placeholder='Enter Team A Score'
                        type='string'
                        value={TeamAScore}
                      />
                      <p className='error-text'>{errTeamAScore}</p>
                    </FormGroup>
                  </Col>
                  <Col lg={6} md={6} xl={6}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='TeamBScore'>Season Team B Score</Label>
                      <Input
                        disabled={adminPermission?.MATCH === 'R'}
                        id='TeamBScore'
                        onChange={(event) => handleChange(event, 'TeamBScore')}
                        placeholder='Enter Team B Score'
                        type='string'
                        value={TeamBScore}
                      />
                      <p className='error-text'>{errTeamBScore}</p>
                    </FormGroup>
                  </Col>
                  <Col lg={6} md={6} xl={6}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='MaxTeamLimit'>Max Team Limit</Label>
                      <Input
                        disabled={adminPermission?.MATCH === 'R'}
                        id='MaxTeamLimit'
                        onChange={(event) => handleChange(event, 'MaxTeamLimit')}
                        placeholder='Enter Max Team Limit'
                        type='number'
                        value={MaxTeamLimit}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg={6} md={6} xl={6}>
                    <FormGroup>
                      <Label className='match-edit-label' for='PitchDetails'>Pitch Details</Label>
                      <Input
                        disabled={adminPermission?.MATCH === 'R'}
                        id='PitchDetails'
                        onChange={(event) => handleChange(event, 'PitchDetails')}
                        placeholder='Enter Pitch Details'
                        type='text'
                        value={pitchDetails}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg={6} md={6} xl={6}>
                    <FormGroup>
                      <Label className='match-edit-label' for='AvgScore'>Average Venue Score</Label>
                      <Input
                        disabled={adminPermission?.MATCH === 'R'}
                        id='PitchScore'
                        onChange={(event) => handleChange(event, 'AvgVenueScore')}
                        placeholder='Enter Average Pitch Score'
                        type='number'
                        value={avgVenueScore}
                      />
                      <p className='error-text'>{errTeamAScore}</p>
                    </FormGroup>
                  </Col>

                  {/* this field  hide */}

                  {/* <Col xl={6} lg={6} md={6}>
                  <FormGroup className='form-group-match'>
                    <Label for='fantasyPost'>Fantasy Post ID</Label>
                    <div style={{ position: 'relative' }}>
                      <Input
                        disabled={
                          adminPermission?.MATCH === 'R'
                        }
                        type='string'
                        id='fantasyPost'
                        placeholder='Enter Fantasy Tips post ID'
                        value={FantasyPostID}
                        onChange={(event) => handleChange(event, 'FantasyPostID')}
                      />
                      {matchDetails && matchDetails.sFantasyPost && <img
                        src={viewIcon}
                        className='view-info'
                        alt='View'
                        onClick={() => {
                          setModalState(true)
                          dispatch(getPost(FantasyPostID, token))
                        }}
                      />}
                      <Modal
                        isOpen={modalState}
                        toggle={() => {
                          setModalState(false)
                        }}
                      >
                        <ModalHeader
                          toggle={() => {
                            setModalState(false)
                          }}
                        >
                          <h2>{post?.sTitle}</h2>
                        </ModalHeader>
                        <ModalBody>
                          <div dangerouslySetInnerHTML={{ __html: post?.sContent }}></div>
                        </ModalBody>
                      </Modal>
                    </div>
                    <p className='error-text'>{errFantasyPostID}</p>
                  </FormGroup>
                </Col> */}
                  {SportsType === 'cricket'
                    ? (
                      <Col lg={6} md={6} xl={6}>
                        <FormGroup className='form-group-match'>
                          <Label className='match-edit-label' for='Toss'>Toss Winner Team</Label>
                          <CustomInput
                            className='custom-input-field'
                            disabled={
                          adminPermission?.MATCH === 'R'
                        }
                            id='Toss'
                            name='tossName'
                            onChange={(event) => handleChange(event, 'TossWinner')}
                            placeholder='Enter Toss Winner Team'
                            type='select'
                            value={TossWinner}
                          >
                            <option value=''>
                              Select Toss Winner Team
                            </option>
                            {tossOptions &&
                          tossOptions.length !== 0 &&
                          tossOptions.map((data) => {
                            return (
                              <option key={data.value} value={data.value}>
                                {data.label}
                              </option>
                            )
                          })}
                          </CustomInput>
                        </FormGroup>
                      </Col>
                      )
                    : ('')}
                  <Col lg={6} md={6} xl={6}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='WinningText'>Winning Text</Label>
                      <Input
                        disabled={adminPermission?.MATCH === 'R'}
                        id='WinningText'
                        onChange={(event) => handleChange(event, 'WinningText')}
                        placeholder='Enter Winning Text'
                        type='text'
                        value={winningText}
                      />
                    </FormGroup>
                  </Col>
                  {SportsType === 'cricket'
                    ? (
                      <Col lg={6} md={6} xl={6}>
                        <FormGroup className='form-group-match'>
                          <Label className='match-edit-label' for='chooseTossWinner'>Opted field</Label>
                          <CustomInput
                            className='custom-input-field'
                            disabled={
                          !TossWinner ||
                          (adminPermission?.MATCH === 'R')
                        }
                            id='chooseTossWinner'
                            name='chooseTossWinner'
                            onChange={(event) =>
                              handleChange(event, 'ChooseTossWinner')
                        }
                            placeholder='Enter Choose Toss Winner'
                            type='select'
                            value={ChooseTossWinner}
                          >
                            <option value=''>

                              Select a Opted Field
                            </option>
                            <option value='BAT'>Batting</option>
                            <option value='BOWLING'>Bowling</option>
                          </CustomInput>
                          <p className='error-text'>{errChooseTossWinner}</p>
                        </FormGroup>
                      </Col>
                      )
                    : ''}
                </Row>
              </Collapse>
            </div>
          </div>

          <div className='match-details pb-4'>
            <div className='common-box'>
              <h2 className='common-box-header' onClick={toggleOther}>
                Other Details

                <span className='carer-Icons'>

                  <img alt="caret-icon" src={isOpenOther ? caretBottom : caretIcon} />
                </span>

              </h2>
              <Collapse isOpen={isOpenOther}>
                <Row className='series-row'>

                  {/* this Field  Hide */}

                  {/* {(
                  <Col xl={6} lg={6} md={6}>
                    <FormGroup className='form-group-match'>
                      <Label for='StreamType'>Stream Type</Label>
                      <CustomInput
                        disabled={
                          adminPermission?.MATCH === 'R'
                        }
                        type='select'
                        name='StreamType'
                        id='StreamType'
                        value={StreamType}
                        onChange={(event) => handleChange(event, 'StreamType')}
                        className='custom-input-field'
                      >
                        <option value='YOUTUBE'>YouTube</option>
                        <option value='STREAM'>Stream</option>
                      </CustomInput>
                    </FormGroup>
                  </Col>
                )} */}

                  <Col lg={6} md={6} xl={6}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='streamURL'>Stream URL (Only add embed)</Label>
                      <Input
                        disabled={
                        adminPermission?.MATCH === 'R'
                      }
                        id='streamURL'
                        onChange={(event) => handleChange(event, 'StreamURL')}
                        placeholder='Enter URL'
                        type='string'
                        value={StreamURL}
                      />
                      {matchDetails && matchDetails.sStreamUrl && (
                      <img
                        alt='View'
                        className='view-info'
                        onClick={() => {
                          setStreamURLModal(true)
                        }}
                        src={viewIcon}
                      />
                      )}
                      <Modal
                        isOpen={streamURLModal}
                        toggle={() => {
                          setStreamURLModal(false)
                        }}
                      >
                        <ModalHeader
                          toggle={() => {
                            setStreamURLModal(false)
                          }}
                        />
                        <ModalBody>
                          <div className='videoShowing'>
                            <iframe
                              allow='autoplay; encrypted-media'
                              allowFullScreen
                              frameBorder='0'
                              src={StreamURL}
                              title='video'
                            />
                          </div>
                        </ModalBody>
                      </Modal>
                      <p className='error-text'>{errStreamURL}</p>
                    </FormGroup>
                  </Col>

                  <Col lg={6} md={6} xl={6}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='SponsoredText'>Sponsored Text</Label>
                      <Input
                        disabled={adminPermission?.MATCH === 'R'}
                        id='SponsoredText'
                        onChange={(event) => handleChange(event, 'SponsoredText')}
                        placeholder='Enter Sponsored Text'
                        type='text'
                        value={SponsoredText}
                      />
                      <p className='error-text'>{errSponsoredText}</p>
                    </FormGroup>
                  </Col>
                  <Col lg={12} md={12} xl={12}>
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='Info'>Info</Label>
                      <Input
                        disabled={adminPermission?.MATCH === 'R'}
                        id='Info'
                        onChange={(event) => handleChange(event, 'Info')}
                        placeholder='Enter Info'
                        style={{ height: '100px' }}
                        type='textarea'
                        value={info}
                      />
                    </FormGroup>
                  </Col>
                  {StatusNote && (
                  <Col lg={4} md={6} xl={4} >
                    <FormGroup className='form-group-match'>
                      <Label className='match-edit-label' for='StatusNote'>Status Note</Label>
                      <InputGroupText>{StatusNote}</InputGroupText>
                    </FormGroup>
                  </Col>
                  )}
                  <Col className='match-details-radio' lg={2} md={6} xl={2}>
                    <FormGroup className='radio-div'>
                      <Label className='match-edit-label' for='matchontop'>Match On Top </Label>
                      <div className='d-flex switch-add-match mt-2'>
                        <CustomInput
                          checked={matchOnTop === 'Y'}
                          className='matchBottom'
                          disabled={
                          adminPermission?.MATCH === 'R'
                        }
                          id='matchOnTop1'
                          label='Yes'
                          name='matchOnTop1'
                          onChange={(event) => handleChange(event, 'matchOnTop')}
                          type='radio'
                          value='Y'
                        />
                        <CustomInput
                          checked={matchOnTop !== 'Y'}
                          className='matchBottom'
                          id='matchOnTop2'
                          label='No'
                          name='matchOnTop2'
                          onChange={(event) => handleChange(event, 'matchOnTop')}
                          type='radio'
                          value='N'
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col className='match-details-radio' lg={2} md={6} xl={2}>
                    <FormGroup className='radio-div'>
                      <Label className='match-edit-label' for='matchontop'>Disabled </Label>
                      <div className='d-flex switch-add-match mt-2'>
                        <CustomInput
                          checked={disable === 'Y'}
                          className='matchBottom'
                          disabled={
                          adminPermission?.MATCH === 'R'
                        }
                          id='disable1'
                          label='Yes'
                          name='disable1'
                          onChange={(event) => handleChange(event, 'disable')}
                          type='radio'
                          value='Y'
                        />
                        <CustomInput
                          checked={disable !== 'Y'}
                          className='matchBottom'
                          disabled={
                          adminPermission?.MATCH === 'R'
                        }
                          id='disable2'
                          label='No'
                          name='disable2'
                          onChange={(event) => handleChange(event, 'disable')}
                          type='radio'
                          value='N'
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  {SportsType === 'cricket' && (
                  <Col className='match-details-radio' lg={2} md={6} xl={2}>
                    <FormGroup className='radio-div'>
                      <Label className='match-edit-label' for='ScoreCardFlag'>Show Score Card</Label>
                      <div className='d-flex switch-add-match mt-2'>
                        <CustomInput
                          checked={scoreCardFlag === 'Y'}
                          disabled={
                            adminPermission?.MATCH === 'R'
                          }
                          id='scoreCard1'
                          label='Yes'
                          name='scoreCard1'
                          onChange={(event) => handleChange(event, 'ScoreCardFlag')}
                          type='radio'
                          value='Y'
                        />
                        <CustomInput
                          checked={scoreCardFlag !== 'Y'}
                          disabled={
                            adminPermission?.MATCH === 'R'
                          }
                          id='scoreCard2'
                          label='No'
                          name='scoreCard2'
                          onChange={(event) => handleChange(event, 'ScoreCardFlag')}
                          type='radio'
                          value='N'
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  )}
                  {(matchDetails?.eStatus === 'I' || matchDetails?.eStatus === 'CMP') && (
                  <Col className='match-details-radio' lg={2} md={6} xl={2}>
                    <FormGroup className='radio-div'>
                      <Label className='match-edit-label' for='DreamTeamFlag'>Show Dream Team</Label>
                      <div className='d-flex switch-add-match mt-2'>
                        <CustomInput
                          checked={dreamTeamFlag === 'Y'}
                          disabled={
                          adminPermission?.MATCH === 'R'
                        }
                          id='dreamTeam1'
                          label='Yes'
                          name='dreamTeam1'
                          onChange={(event) => handleChange(event, 'DreamTeamFlag')}
                          type='radio'
                          value='Y'
                        />
                        <CustomInput
                          checked={dreamTeamFlag !== 'Y'}
                          disabled={
                          adminPermission?.MATCH === 'R'
                        }
                          id='dreamTeam2'
                          label='No'
                          name='dreamTeam2'
                          onChange={(event) => handleChange(event, 'DreamTeamFlag')}
                          type='radio'
                          value='N'
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  )}
                </Row>
              </Collapse>

            </div>
          </div>
        </section>
      </section>

      <Modal className='score-card mt-4 mb-4' isOpen={modalOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Live Innings</ModalHeader>
        <ModalBody>
          <div className="score-cards">
            {
              liveInningsState?.length > 0
                ? (
                  <Fragment>
                    {
                      liveInningsState.map((inning, index) => {
                        return (
                          <Fragment key={index}>
                            <Button color=" d-flex justify-content-between align-item-center"
                              onClick={() => {
                                setField(field.map((data, index2) => index2 === index && !data))
                              }}
                              onLoad={() => setField([true, false, false, false])}
                              style={{ marginBottom: '1rem' }}
                            >
                              <span>
                                {inning?.sName}
                                {(fullScoreCardState?.nLatestInningNumber === inning?.nInningNumber) && <img src={star} />}
                              </span>
                              <span>
                                {inning?.oEquations?.nRuns}
                                /
                                {inning?.oEquations?.nWickets}

                                (
                                {inning?.oEquations?.sOvers}
                                )
                                <img className={`${field[index] ? 'rotate' : ''}`} src={down} />
                              </span>
                            </Button>
                            <Collapse isOpen={field[index]}>
                              <CardBody className='table-responsive-scorecard'>
                                <div className='table' style={{ overflowX: 'auto' }}>
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>Batsman</th>
                                        <th>Runs</th>
                                        <th>Balls</th>
                                        <th>4s</th>
                                        <th>6s</th>
                                        <th>SR</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {
                                          inning?.aBatters?.length > 0 && inning?.aBatters.map((bat, ind) => {
                                            const isInInning = inning?.oCurrentPartnership?.aBatters?.map(inn => inn.iBatterId)
                                            return (
                                              <Fragment key={ind}>
                                                <tr className='scorecard-tr'>
                                                  <td className={isInInning.includes(bat?.iBatterId) ? 'blueText' : ''}>
                                                    <p><b>{bat?.oBatter?.sName}</b></p>
                                                    <span>

                                                      {bat?.sHowOut}

                                                    </span>
                                                  </td>
                                                  <td>{bat?.nRuns}</td>
                                                  <td>{bat?.nBallFaced}</td>
                                                  <td>{bat?.nFours}</td>
                                                  <td>{bat?.nSixes}</td>
                                                  <td>{bat?.sStrikeRate}</td>
                                                </tr>
                                              </Fragment>
                                            )
                                          })
                                        }
                                      <tr>
                                        <td>
                                          <p>Extra</p>
                                          <span>
                                            ( b -

                                            {inning?.oExtraRuns?.nByes || 0}
                                            , w -

                                            {inning?.oExtraRuns?.nWides || 0}
                                            , no -

                                            {inning?.oExtraRuns?.nNoBalls || 0}
                                            , lb -

                                            {inning?.oExtraRuns?.nLegByes || 0}
                                            , p -

                                            {inning?.oExtraRuns?.nPenalty || 0}

                                            )
                                          </span>
                                        </td>
                                        <td>{inning?.oExtraRuns?.nTotal}</td>
                                        <td />
                                        <td />
                                        <td />
                                        <td />
                                      </tr>
                                      <tr className='backgroundBlue'>
                                        <td>
                                          <p>Total</p>
                                          <span>
                                            (

                                            {inning?.oEquations?.sRunRate}

                                            Runs Per Over)
                                          </span>
                                        </td>
                                        <td>{inning?.oEquations?.nRuns}</td>
                                        <td />
                                        <td />
                                        <td />
                                        <td />
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <div className='fow'>
                                  <span className='blueText d-block'>Fall Of Wickets</span>
                                  <span className='d-block'>
                                    {inning?.aFOWs.map((fow, indF) => (fow?.nRuns) + '-' + fow?.nWicketNumber + '(' + fow?.oBatter?.sName + ',' + fow?.sOverDismissal + ')' + (indF === (inning?.aFOWs?.length - 1) ? '' : ', '))}
                                  </span>
                                </div>
                                <div className='mb-3' style={{ overflowX: 'auto' }}>
                                  <table className='table'>
                                    <thead>
                                      <tr className='scorecard-tr'>
                                        <th>Bowler</th>
                                        <th>Ov</th>
                                        <th>M</th>
                                        <th>R</th>
                                        <th>W</th>
                                        <th>NB</th>
                                        <th>WD</th>
                                        <th>Eco</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {
                                          inning?.aBowlers?.length > 0 && inning?.aBowlers.map((bowl, ind) => {
                                            return (
                                              <Fragment key={ind}>
                                                <tr className='scorecard-tr'>
                                                  <td>{bowl?.oBowler?.sName}</td>
                                                  <td>{bowl?.sOvers}</td>
                                                  <td>{bowl?.nMaidens}</td>
                                                  <td>{bowl?.nRunsConducted}</td>
                                                  <td>{bowl?.nWickets}</td>
                                                  <td>{bowl?.nNoBalls}</td>
                                                  <td>{bowl?.nWides}</td>
                                                  <td>{bowl?.sEcon}</td>
                                                </tr>
                                              </Fragment>
                                            )
                                          })
                                        }
                                    </tbody>
                                  </table>
                                </div>
                              </CardBody>
                            </Collapse>
                          </Fragment>
                        )
                      })
                    }
                  </Fragment>
                  )
                : (
                  <h1>Data not available</h1>)
            }
          </div>
        </ModalBody>
      </Modal>

    </main>
  )
})

AddMatch.propTypes = {
  AddMatchFunc: PropTypes.func,
  UpdateMatch: PropTypes.func,
  teamName: PropTypes.object,
  SportsType: PropTypes.string,
  getTeamName: PropTypes.func,
  FormatsList: PropTypes.array,
  match: PropTypes.object,
  history: PropTypes.object,
  matchReport: PropTypes.string,
  matchLeague: PropTypes.string,
  matchPlayer: PropTypes.string,
  getMatchDetailsFunc: PropTypes.func,
  value: PropTypes.string,
  onClick: PropTypes.func,
  mergeMatchPage: PropTypes.string,
  location: PropTypes.object,
  getLeagueListFunc: PropTypes.func,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  isCreate: PropTypes.bool,
  setIsCreate: PropTypes.func,
  setUpdateDisableButton: PropTypes.func
}

AddMatch.displayName = AddMatch
export default connect(null, null, null, { forwardRef: true })(AddMatch)
