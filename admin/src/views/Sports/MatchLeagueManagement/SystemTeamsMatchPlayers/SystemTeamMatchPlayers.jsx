import React, { useState, Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import moment from 'moment'
import PropTypes from 'prop-types'

import noImage from '../../../../assets/images/no-image-1.svg'
import uncheckedRadio from '../../../../assets/images/remove-icon.svg'
import caretIcon from '../../../../assets/images/caret-top.svg'

import Loading from '../../../../components/Loading'
import SkeletonTable from '../../../../components/SkeletonTable'
import AlertMessage from '../../../../components/AlertMessage'
import DataNotFound from '../../../../components/DataNotFound'
import RequiredField from '../../../../components/RequiredField'

import { isNumber, isPositive, modalMessageFunc } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'
import { getSportsList } from '../../../../actions/sports'
import { getMatchDetails } from '../../../../actions/match'
import { getMatchPlayerList } from '../../../../actions/matchplayer'
import { getPlayerRoleList } from '../../../../actions/playerRole'
import { combinationBotTeams, getProbability, joinBotInContest } from '../../../../actions/systemusers'

const animatedComponents = makeAnimated()

function SystemTeamMatchPlayers (props) {
  const { matchLeaguePage, combinationBot, isModalOpen, setModalOpen, matchLeagueList, getList, sportsType, matchDetails, setLoading, loading, teamName, teams, setTeams, AutoSelect } = props
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id1, id2 } = useParams()
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [list, setList] = useState([])
  const [url, setUrl] = useState('')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [creditLimitMin, setCreditLimitMin] = useState(0)
  const [creditLimitMax, setCreditLimitMax] = useState(0)
  const [teamCount, setTeamCount] = useState(0)
  const [playersErr, setPlayersErr] = useState('')
  const [creditLimitMinErr, setCreditLimitMinErr] = useState('')
  const [creditLimitMaxErr, setCreditLimitMaxErr] = useState('')
  const [teamCountErr, setTeamCountErr] = useState('')
  const [combinationMsg, setCombinationMsg] = useState('')
  const [instantAdd, setInstantAdd] = useState(false)
  const [loader, setLoader] = useState(false)
  const [players, setPlayers] = useState([])
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [probability, setProbability] = useState(0)
  const [combinationLogsDetails, setCombinationLogsDetails] = useState({})
  const [SelectedOption, setSelectedOption] = useState([])
  const [options, setOptions] = useState([])
  const [minMaxCountsPlayer, setMinMaxCountsPlayer] = useState('')
  const [teamsName, setTeamsName] = useState('')
  const [matchLeagueId, setMatchLeagueId] = useState([])
  const [leagueIdErr, setLeagueIdErr] = useState('')
  // const [customTeamPlayer, setCustomTeamPlayer] = useState('')

  const [selectedSize, setSelectedSize] = useState(0)
  const [selectedSizeErr, setSelectedSizeErr] = useState('')
  const [neglectedSize, setNeglectedSize] = useState(0)
  const [neglectedSizeErr, setNeglectedSizeErr] = useState('')
  const getUrlLink = useSelector(state => state.url.getUrl)
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state.systemusers.resStatus)
  const resMessage = useSelector(state => state.systemusers.resMessage)
  const isTeamCreate = useSelector(state => state.systemusers.isTeamCreate || state.systemusers.isTeamUpdate)
  const probabilityForTeams = useSelector(state => state.systemusers.probabilityForTeams)
  const matchPlayerList = useSelector(state => state.matchplayer.matchPlayerList)
  const combinationLogs = useSelector(state => state.systemusers.combinationBotLogs)
  const start = useRef(0)
  const sort = useRef('sName')
  const order = useRef('asc')
  const search = useRef('')
  const role = useRef('')
  const [matchLeagueSort] = useState('sName')
  const [matchLeagueOrder] = useState('asc')
  const [totalPlayers, setTotalPlayers] = useState('')
  const previousProps = useRef({ list, resMessage, resStatus, probabilityForTeams, combinationLogs, matchLeagueList, teamName, matchPlayerList }).current
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const playerRoleList = useSelector(state => state.playerRole.playerRoleList)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const activeSports = useSelector(state => state.sports.sportsList)
  const toggleModal = () => setModalOpen(!isModalOpen)
  useEffect(() => {
    const matchPlayerListData = {
      start: start.current, limit: '', sort: sort.current, order: order.current, searchText: search.current, role: role.current, team: teamName, token, Id: id1, bCMBList: true
    }
    dispatch(getMatchPlayerList(matchPlayerListData))
    getList(0, 10, matchLeagueSort, matchLeagueOrder, teamName, 'PUBLIC', true)
    dispatch(getUrl('media'))
    dispatch(getSportsList(token))
    dispatch(getPlayerRoleList(sportsType, token))
    setLoading(true)
  }, [])

  useEffect(() => {
    if (activeSports?.length > 0) {
      activeSports?.map(data => {
        if (data?.sKey === sportsType?.toUpperCase()) setTotalPlayers(data?.oRule?.nTotalPlayers)
        return data
      })
    }
  }, [activeSports])

  useEffect(() => {
    if (teams) {
      const team = teams.map((data) => data?.sName)
      setTeamsName(team)
    }
  }, [teams])

  useEffect(() => {
    const arr = []
    if (playerRoleList) {
      playerRoleList.map((playerRole) => {
        const obj = {
          role: playerRole?.sName, max: playerRole.nMax, min: playerRole.nMin
        }
        arr.push(obj)
        return arr
      })
      setMinMaxCountsPlayer(arr)
    }
  }, [playerRoleList])

  useEffect(() => {
    if (previousProps.matchLeagueList !== matchLeagueList) {
      if (matchLeagueList) {
        const arr = []
        if (matchLeagueList?.results?.length > 0) {
          matchLeagueList?.results?.map((data) => {
            const obj = {
              value: data._id,
              label: data.bCopyLeague ? data.sName + '(Copy League)' : data.sName
            }
            !data?.bCancelled && arr.push(obj)
            return arr
          })
          setOptions(arr)
        }
      }
    }
    return () => {
      previousProps.matchLeagueList = matchLeagueList
    }
  }, [matchLeagueList])

  useEffect(() => {
    if (previousProps.combinationLogs !== combinationLogs) {
      const error = combinationLogs?.data?.aError?.map((item) => {
        return {
          ...item,
          dDate: moment(item.dDate).format('DD/MM/YYYY hh:mm A')
        }
      })
      const success = combinationLogs?.data?.aSuccess?.map((item) => {
        return {
          ...item,
          dDate: moment(item.dDate).format('DD/MM/YYYY hh:mm A')
        }
      })
      const mainCombinationLogsDetails = {
        aError: error,
        aSuccess: success
      }
      setCombinationLogsDetails(mainCombinationLogsDetails)
    }

    return () => {
      previousProps.combinationLogs = combinationLogs
    }
  }, [combinationLogs])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (previousProps.matchPlayerList !== matchPlayerList) {
      if (matchPlayerList) {
        const arr = []
        let playersList
        if (matchPlayerList?.bLineupsOut) {
          playersList = matchPlayerList?.results?.filter(data => data.bShow)
          if (teamName === '') {
            for (const data of playersList) {
              const player = selectedPlayers.find(player => player.iPlayerId === data._id)
              const obj = {
                iPlayerId: data._id,
                selected: player?.selected === 'Y' ? 'Y' : player?.selected === 'N' ? 'N' : !!combinationBot,
                isCaptain: true,
                sTeamName: data.sTeamName,
                eRole: data.eRole,
                sName: data?.sName
              }
              arr.push(obj)
            }
            setSelectedPlayers(arr)
          }
        } else {
          playersList = matchPlayerList?.results
          if (teamName === '') {
            for (const data of playersList) {
              const player = selectedPlayers.find(player => player.iPlayerId === data._id)
              const obj = {
                iPlayerId: data._id,
                selected: player?.selected === 'Y' ? 'Y' : player?.selected === 'N' ? 'N' : !!combinationBot,
                isCaptain: true,
                sTeamName: data.sTeamName,
                eRole: data.eRole,
                sName: data?.sName
              }
              arr.push(obj)
            }
            setSelectedPlayers(arr)
          }
        }
        const combinationBotTeamsList = matchPlayerList?.results?.filter(data => data.bShow)
        if (combinationBot && matchPlayerList.bLineupsOut) {
          setList(combinationBotTeamsList)
        } else {
          setList(matchPlayerList.results ? playersList : [])
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.matchPlayerList = matchPlayerList
    }
  }, [matchPlayerList])

  useEffect(() => {
    if (previousProps.probabilityForTeams !== probabilityForTeams) {
      if (probabilityForTeams && probabilityForTeams.combinationCount) {
        setCombinationMsg(` ${probabilityForTeams.combinationCount}`)
        setProbability(probabilityForTeams.combinationCount)
      }
    }
    return () => {
      previousProps.probabilityForTeams = probabilityForTeams
    }
  }, [probabilityForTeams])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus && isTeamCreate) {
          navigate(`${matchLeaguePage}`, { state: { message: resMessage } })
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setLoading(false)
        }
        setLoader(false)
        if (!resStatus) {
          setModalOpen(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage, isTeamCreate])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (list) {
      const arr = []
      if (list.length !== 0) {
        list.map((data) => {
          const player = selectedPlayers.find(player => player.iPlayerId === data._id)
          const obj = {
            iPlayerId: data._id,
            selected: player?.selected === 'Y' ? 'Y' : player?.selected === 'N' ? 'N' : !!combinationBot,
            isCaptain: true,
            sTeamName: data.sTeamName,
            eRole: data.eRole,
            sName: data?.sName
          }
          arr.push(obj)
          return arr
        })
        setPlayers(arr)
      }
    }
    return () => {
      previousProps.list = list
    }
  }, [list])

  function handleCaption (event, ID, type) {
    if (type === 'Captian') {
      const arr = [...players]
      const allPlayersArr = [...selectedPlayers]
      const index = players.findIndex(data => data.iPlayerId === ID)
      const index2 = allPlayersArr.findIndex(data => data.iPlayerId === ID)
      if (event.target.value) {
        arr[index] = { ...arr[index], isCaptain: !arr[index].isCaptain }
        allPlayersArr[index2] = { ...allPlayersArr[index2], isCaptain: event.target.value }
        setSelectedPlayers(allPlayersArr)
        setPlayers(arr)
      }
    } else if (type === 'SelectedPlayer') {
      const arr = [...players]
      const allPlayersArr = [...selectedPlayers]
      const index = players.findIndex(data => data.iPlayerId === ID)
      const index2 = allPlayersArr.findIndex(data => data.iPlayerId === ID)
      if (event.target.value) {
        arr[index] = { ...arr[index], selected: event.target.value }
        allPlayersArr[index2] = { ...allPlayersArr[index2], selected: event.target.value }
        if (arr.filter(data => data.selected).length < 4) {
          setPlayersErr('Select at least 4 players!!')
        } else {
          setPlayersErr('')
        }
        setSelectedPlayers(allPlayersArr)
        setPlayers(arr)
      }
    } else if (type === 'SelectedPlayerClear') {
      const arr = [...players]
      const allPlayersArr = [...selectedPlayers]
      const index = players.findIndex(data => data.iPlayerId === ID)
      const index2 = allPlayersArr.findIndex(data => data.iPlayerId === ID)
      arr[index] = { ...arr[index], selected: false }
      allPlayersArr[index2] = { ...allPlayersArr[index2], selected: event.target.value }
      setSelectedPlayers(allPlayersArr)
      setPlayers(arr)
    }
  }

  function handleLeagueChange (selectedOption, type) {
    switch (type) {
      case 'LeagueId':
        if (selectedOption) {
          setSelectedOption(selectedOption)
          if (selectedOption.length >= 1) {
            setLeagueIdErr('')
          } else {
            setLeagueIdErr('Required field')
          }
          setMatchLeagueId(selectedOption)
        } else {
          setMatchLeagueId([])
        }
        break
      default:
        break
    }
  }

  function handleOnChange (event, type) {
    switch (type) {
      case 'Min':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setCreditLimitMinErr('')
          } else {
            setCreditLimitMinErr('Required field')
          }
          setCreditLimitMin(event.target.value)
          if (parseInt(creditLimitMax) && parseInt(event.target.value) > parseInt(creditLimitMax)) {
            setCreditLimitMinErr('Value must be less than Max Value ')
          } else {
            setCreditLimitMinErr('')
            setCreditLimitMaxErr('')
          }
        }
        break
      case 'Max':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0 && event.target.value <= 100) {
            setCreditLimitMaxErr('')
          } else if (event.target.value > 100) {
            setCreditLimitMaxErr('Value must be less then or equal to 100')
          } else {
            setCreditLimitMaxErr('Required field')
          }
          setCreditLimitMax(event.target.value)
          if (parseInt(creditLimitMin) && parseInt(creditLimitMin) > parseInt(event.target.value)) {
            setCreditLimitMaxErr('Value must be greater than Min Value ')
          } else {
            if (event.target.value < 100) {
              setCreditLimitMaxErr('')
              setCreditLimitMinErr('')
            }
          }
        }
        break
      case 'TeamCount':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > probability) {
            setTeamCountErr(`Value must be less than ${probability}`)
          } else if (!event.target.value) {
            setTeamCountErr('Required field')
          } else {
            setTeamCountErr('')
          }
          setTeamCount(event.target.value)
        }
        break
      case 'InstantAdd':
        setInstantAdd(!instantAdd)
        break
      case 'SelectedSize':
        if (isNumber(event.target.value) || !event.target.value) {
          if (parseInt(event.target.value) === 0) {
            setSelectedSizeErr('Value must be greater than 0')
          } else if (parseInt(event.target.value) > (totalPlayers - 1)) {
            setSelectedSizeErr(`Value must be less than ${totalPlayers}`)
          } else if (!event.target.value) {
            setSelectedSizeErr('Required field')
          } else if (parseInt(event.target.value) <= (totalPlayers - 1)) {
            setSelectedSizeErr('')
            setNeglectedSizeErr('')
          }
          setSelectedSize(event.target.value)
          setNeglectedSize(totalPlayers - parseInt(event.target.value))
        }
        break
      default:
        break
    }
  }

  function getProbabilityFunc (e) {
    e.preventDefault()
    const updatedPlayers = []
    players.map((item) => {
      if (item.selected) {
        const data = {
          ...item,
          selected: item.selected === 'Y'
        }
        updatedPlayers.push(data)
      }
      return updatedPlayers
    })
    const rules = {
      creditLimit: {
        min: parseInt(creditLimitMin),
        max: parseInt(creditLimitMax)
      }
    }
    const isPlayersSelected = updatedPlayers.filter(data => data.selected).length
    const isPlayerNeglected = updatedPlayers.filter(data => !data.selected).length
    const a = isPlayersSelected / 2
    const validate = (creditLimitMin > 0) && (creditLimitMax <= 100) && !creditLimitMaxErr && (isPositive(creditLimitMin) && (creditLimitMax > 0) && (isPositive(creditLimitMax))) && (parseInt(creditLimitMin) <= parseInt(creditLimitMax)) && updatedPlayers && rules && isPlayersSelected >= 4 && (isPlayerNeglected >= totalPlayers - a) && selectedSize >= 1 && selectedSize <= (totalPlayers - 1) && neglectedSize >= 1
    if (validate) {
      const data = {
        players: updatedPlayers, rules, matchLeagueId: id2, matchId: id1, selSize: parseInt(selectedSize), token
      }
      dispatch(getProbability(data))
      setLoader(true)
    } else {
      if (players.filter(data => data.selected).length < 4) {
        setPlayersErr('Select at least 4 players!!')
      } else if (isPlayerNeglected < totalPlayers - a) {
        setPlayersErr('Neglected players should be greater than or equal to ' + parseInt(totalPlayers - a))
      }
      if (parseInt(creditLimitMax) < parseInt(creditLimitMin)) {
        setCreditLimitMaxErr('Max credit limit must be greater than Min credit value')
      }
      if (!isPositive(creditLimitMin)) {
        setCreditLimitMinErr('Value must be positive!')
      }
      if (!isPositive(creditLimitMax)) {
        setCreditLimitMaxErr('Value must be positive!')
      }
      if (creditLimitMax > 100) {
        setCreditLimitMaxErr('Value must be less then or equal to 100')
      }
      if (!creditLimitMin) {
        setCreditLimitMinErr('Required field')
      }
      if (!creditLimitMax) {
        setCreditLimitMaxErr('Required field')
      }
      if (!selectedSize) {
        setSelectedSizeErr('Required field')
      } else if (selectedSize < 1) {
        setSelectedSizeErr('Value must be greater than 0')
      }
      if (!neglectedSize) {
        setNeglectedSizeErr('Required field')
      }
    }
  }

  function createTeamsFunc () {
    const updatedPlayers = []
    players.map((item) => {
      if (item.selected) {
        const data = {
          ...item,
          selected: item.selected === 'Y'
        }
        updatedPlayers.push(data)
      }
      return updatedPlayers
    })
    const rules = {
      creditLimit: {
        min: parseInt(creditLimitMin),
        max: parseInt(creditLimitMax)
      }
    }
    const validate = (teamCount > 0) && (isPositive(teamCount)) && updatedPlayers && rules
    if (validate) {
      const data = {
        players: updatedPlayers, rules, teamCount: parseInt(teamCount), instantAdd, matchLeagueId: id2, matchId: id1, selSize: parseInt(selectedSize), token
      }
      dispatch(joinBotInContest(data))
      setLoader(true)
      setCreditLimitMin(0)
      setCreditLimitMax(0)
      setTeamCount(0)
      setProbability(0)
      setCombinationMsg('')
    } else {
      if (!isPositive(teamCount)) {
        setTeamCountErr('Value must be positive!')
      }
      if (!teamCount) {
        setTeamCountErr('Required field')
      }
    }
  }

  function recalculateFunc () {
    setProbability(0)
    setCombinationMsg('')
  }

  function updateCombinationTeams () {
    const selected = []
    SelectedOption.map((data) => {
      selected.push(data?.value)
      return selected
    })
    const updatedPlayers = []
    players.map((item) => {
      if (item.selected === 'Y' || item.selected === 'N') {
        if (item.selected) {
          const data = {
            ...item,
            selected: item.selected === 'Y'
          }
          updatedPlayers.push(data)
        }
      }

      return updatedPlayers
    })
    const isPlayersSelected = updatedPlayers?.filter(data => data.selected).length
    const isPlayerNeglected = updatedPlayers?.filter(data => !data.selected).length
    const a = isPlayersSelected / 2
    const validate = SelectedOption?.length >= 1 && !leagueIdErr && updatedPlayers && isPlayersSelected >= 4 && (isPlayerNeglected >= totalPlayers - a) && selectedSize >= 1 && selectedSize <= (totalPlayers - 1) && neglectedSize >= 1
    if (validate) {
      dispatch(combinationBotTeams(props.matchId, updatedPlayers, selected, parseInt(selectedSize), token))
      setLoading(true)
    } else {
      if (players.filter(data => data.selected).length < 4) {
        setPlayersErr('Select at least 4 players!!')
      } else if (isPlayerNeglected < totalPlayers - a) {
        setPlayersErr('Neglected players should be greater than or equal to ' + parseInt(totalPlayers - a))
      }
      if (!SelectedOption.length >= 1) {
        setLeagueIdErr('Required field')
      }
      if (!selectedSize) {
        setSelectedSizeErr('Required field')
      } else if (selectedSize < 1) {
        setSelectedSizeErr('Value must be greater than 0')
      }
      if (!neglectedSize) {
        setNeglectedSizeErr('Required field')
      }
    }
  }

  useEffect(() => {
    if (id1) {
      dispatch(getMatchDetails(id1, token))
    }
  }, [])

  useEffect(() => {
    if (previousProps.matchDetails !== matchDetails) {
      if (matchDetails) {
        const arr = []
        const team1 = {
          sName: matchDetails?.oHomeTeam?.sName,
          iTeamId: matchDetails?.oHomeTeam?.iTeamId
        }
        arr.push(team1)
        const team2 = {
          sName: matchDetails?.oAwayTeam?.sName,
          iTeamId: matchDetails?.oAwayTeam?.iTeamId
        }
        arr.push(team2)
        setTeams(arr)
      }
    }
    return () => {
      previousProps.matchDetails = matchDetails
    }
  }, [matchDetails])

  useEffect(() => {
    if (previousProps.teamName !== teamName) {
      const matchPlayerListData = {
        start: start.current, limit: '', sort: sort.current, order: order.current, searchText: search.current, role: role.current, team: teamName, token, Id: id1, bCMBList: true
      }
      dispatch(getMatchPlayerList(matchPlayerListData))
    }
    return () => {
      previousProps.teamName = teamName
    }
  }, [teamName])

  function getRandomPlayers (playerData, teamNames, minMaxCounts) {
    const shuffledPlayers = playerData.sort(() => 0.5 - Math.random())
    const selectedPlayers = []
    const teamCounts = { [teamNames[0]]: totalPlayers, [teamNames[1]]: totalPlayers }
    const teamCountsTest = { [teamNames[0]]: 0, [teamNames[1]]: 0 }

    // Initialize role counts for both teams
    const roleCounts = {}
    minMaxCounts.forEach((minMax) => {
      roleCounts[minMax.role] = {
        [teamNames[0]]: 0,
        [teamNames[1]]: 0
      }
    })

    const homeTeam = shuffledPlayers.filter((players) => players?.sTeamName === teamNames[0])
    const awayTeam = shuffledPlayers.filter((players) => players?.sTeamName === teamNames[1])
    homeTeam.forEach((player, index) => {
      if (teamCounts[teamNames[0]] <= totalPlayers) {
        const pRole = minMaxCounts.find((r) => r.role === player.eRole)
        if (pRole && (pRole.min >= roleCounts[pRole.role][teamNames[0]] && teamCountsTest[teamNames[0]] < totalPlayers)) {
          const obj = {
            ...player,
            selected: index % 2 === 0 ? 'Y' : 'N'
          }
          selectedPlayers.push(obj)
          roleCounts[pRole.role][teamNames[0]]++
          teamCountsTest[teamNames[0]]++
        } else {
          const obj = {
            ...player,
            selected: ''
          }
          selectedPlayers.push(obj)
        }
      }
    })
    awayTeam.forEach((player, index) => {
      if (teamCounts[teamNames[1]] <= totalPlayers) {
        const pRole = minMaxCounts.find((r) => r.role === player.eRole)
        if (pRole && (pRole.min >= roleCounts[pRole.role][teamNames[1]] && teamCountsTest[teamNames[1]] < totalPlayers)) {
          const obj = {
            ...player,
            selected: index % 2 === 0 ? 'Y' : 'N'
          }
          selectedPlayers.push(obj)
          roleCounts[pRole.role][teamNames[1]]++
          teamCountsTest[teamNames[1]]++
        } else {
          const obj = {
            ...player,
            selected: ''
          }
          selectedPlayers.push(obj)
        }
      }
    })

    setPlayers(selectedPlayers)
    return selectedPlayers
  }

  useEffect(() => {
    const playersData = []
    if (AutoSelect === true) {
      if (matchPlayerList?.bLineupsOut) {
        players.map((player, i) => {
          const obj = {
            ...player,
            selected: (player.eRole === 'ALLR' || player.eRole === 'WK' || player.eRole === 'FWD' || player.eRole === 'GK' || player.eRole === 'MID' || player.eRole === 'IF' || player.eRole === 'OF' || player.eRole === 'C' || player.eRole === 'SF' || player.eRole === 'RAID')
              ? 'Y'
              : 'N'
          }
          playersData.push(obj)
          return players
        })
        setPlayers(playersData)
      } else {
        getRandomPlayers(players, teamsName, minMaxCountsPlayer)
        // const arr = []
        // const team1 = players.filter((data) => data?.sTeamName === teams[0]?.sName)
        // const allRounder = team1.filter((data) => data?.eRole === 'ALLR' || data?.eRole === 'IF' || data?.eRole === 'FWD')
        // const bowler = team1.filter((data) => data?.eRole === 'BWL' || data?.eRole === 'OF' || data?.eRole === 'SF')
        // const batsman = team1.filter((data) => data?.eRole === 'BATS' || data?.eRole === 'C' || data?.eRole === 'P' || data?.eRole === 'RAID')
        // const Wicket = team1.filter((data) => data?.eRole === 'WK' || data?.eRole === 'CT' || data?.eRole === 'PG' || data?.eRole === 'GK')
        // const allK = team1.filter((data) => data?.eRole === 'ALLR')
        // const def = team1.filter((data) => data?.eRole === 'DEF')
        // const pf = team1.filter((data) => data?.eRole === 'PF')
        // const mid = team1.filter((data) => data?.eRole === 'MID')
        // const sg = team1.filter((data) => data?.eRole === 'SG')
        // const aslt = team1.filter((data) => data?.eRole === 'ASLT')

        // const team2 = players.filter((data) => data?.sTeamName === teams[1]?.sName)
        // const allRounder1 = team2.filter((data) => data?.eRole === 'ALLR' || data?.eRole === 'IF' || data?.eRole === 'FWD')
        // const bowler1 = team2.filter((data) => data?.eRole === 'BWL' || data?.eRole === 'OF' || data?.eRole === 'SF')
        // const batsman1 = team2.filter((data) => data?.eRole === 'BATS' || data?.eRole === 'C' || data?.eRole === 'P' || data?.eRole === 'RAID')
        // const Wicket1 = team2.filter((data) => data?.eRole === 'WK' || data?.eRole === 'CT' || data?.eRole === 'PG' || data?.eRole === 'GK')
        // const allK1 = team2.filter((data) => data?.eRole === 'ALLR')
        // const def1 = team2.filter((data) => data?.eRole === 'DEF')
        // const pf1 = team2.filter((data) => data?.eRole === 'PF')
        // const mid1 = team2.filter((data) => data?.eRole === 'MID')
        // const sg1 = team2.filter((data) => data?.eRole === 'SG')
        // const aslt1 = team2.filter((data) => data?.eRole === 'ASLT')

        // const randomSelect = (playerList, count) => {
        //   const shuffledPlayers = playerList.sort(() => 0.5 - Math.random())
        //   return shuffledPlayers
        // }

        // const selectPlayers = (playerList, count, isSelected) => {
        //   return playerList.map((player, i) => {
        //     const obj = {
        //       ...player,
        //       selected: i < count ? isSelected : ''
        //     }
        //     customTeamPlayer[player.sTeamName].push(obj)
        //     arr.push(obj)
        //     return player
        //   })
        // }
        // const selectPlayersForESport = (playerList, count, isSelected) => {
        //   return playerList.map((player, i) => {
        //     const obj = {
        //       ...player,
        //       selected: i < count ? isSelected : 'N'
        //     }
        //     customTeamPlayer[player.sTeamName].push(obj)
        //     arr.push(obj)
        //     return player
        //   })
        // }

        // const randomAllRounder = randomSelect(allRounder, 4)
        // sportsType !== 'kabaddi' && sportsType === 'hockey' ? selectPlayers(randomAllRounder, 2, 'Y') : selectPlayers(randomAllRounder, 4, 'Y')

        // const randomBowler = randomSelect(bowler, 3)
        // selectPlayers(randomBowler, 3, 'N')

        // const randomBatsman = randomSelect(batsman, 3)
        // selectPlayers(randomBatsman, 3, 'Y')

        // const randomWicket = randomSelect(Wicket, 1)
        // selectPlayers(randomWicket, 1, 'Y')

        // if (sportsType === 'kabaddi') {
        //   const randomallK = randomSelect(allK, 2)
        //   selectPlayers(randomallK, 2, 'Y')
        // }
        // const randomAslt = randomSelect(aslt, 5)
        // selectPlayersForESport(randomAslt, 3)

        // const randomAslt1 = randomSelect(aslt1, 5)
        // selectPlayersForESport(randomAslt1, 3)
        // const randomMID = randomSelect(mid, 4)
        // selectPlayers(randomMID, 4, 'N')

        // const randomSG = randomSelect(sg, 2)
        // selectPlayers(randomSG, 2, 'N')

        // const randomDEF = randomSelect(def, 2)
        // sportsType === 'hockey' ? selectPlayers(randomDEF, 4, 'N') : selectPlayers(randomDEF, 2, 'N')

        // const randomPF = randomSelect(pf, 2)
        // selectPlayers(randomPF, 2, 'Y')

        // const randomAllRounder1 = randomSelect(allRounder1, 4)
        // sportsType !== 'kabaddi' && sportsType === 'hockey' ? selectPlayers(randomAllRounder1, 2, 'Y') : selectPlayers(randomAllRounder1, 4, 'Y')

        // const randomBowler1 = randomSelect(bowler1, 3)
        // selectPlayers(randomBowler1, 3, 'N')

        // const randomBatsman1 = randomSelect(batsman1, 3)
        // selectPlayers(randomBatsman1, 3, 'Y')

        // const randomWicket1 = randomSelect(Wicket1, 1)
        // selectPlayers(randomWicket1, 1, 'N')

        // if (sportsType === 'kabaddi') {
        //   const randomallK1 = randomSelect(allK1, 2)
        //   selectPlayers(randomallK1, 2, 'Y')
        // }

        // const randomNID1 = randomSelect(mid1, 4)
        // selectPlayers(randomNID1, 4, 'N')

        // const randomSG1 = randomSelect(sg1, 2)
        // selectPlayers(randomSG1, 2, 'N')

        // const randomDEF1 = randomSelect(def1, 2)
        // sportsType === 'hockey' ? selectPlayers(randomDEF1, 4, 'N') : selectPlayers(randomDEF1, 2, 'N')

        // const randomPF1 = randomSelect(pf1, 2)
        // selectPlayers(randomPF1, 2, 'Y')
        // setPlayers(arr)
      }
    } else {
      players.map((player, i) => {
        const obj = {
          ...player,
          selected: ''
        }
        playersData.push(obj)
        return players
      })
      setPlayers(playersData)

      // if (teams) {
      //   const obj = {
      //     [teams[0]?.sName]: [],
      //     [teams[1]?.sName]: []
      //   }
      //   setCustomTeamPlayer(obj)
      // }
    }
  }, [AutoSelect])

  // useEffect(() => {
  //   const obj = {}
  //   if (teams) {
  //     obj[teams[0]?.sName] = []
  //     obj[teams[1]?.sName] = []
  //     setCustomTeamPlayer(obj)
  //   }
  // }, [teams])

  return (
    <Fragment>
      <div className='table-represent'>
        <div className='table-responsive'>

          <AlertMessage
            close={close}
            message={message}
            modalMessage={modalMessage}
            status={status}
          />

          {loader && <Loading />}
          {
            !loading && list?.length === 0
              ? (
                <DataNotFound message="Match Player" obj="" />
                )
              : (
                <table className='table'>
                  <thead>
                    <tr>
                      <th rowSpan='2'>No</th>
                      <th rowSpan='2'>Image</th>
                      <th rowSpan='2'>
                        <div>Team Name</div>
                      </th>
                      <th rowSpan='2'>Player Name</th>
                      <th rowSpan='2'>Role</th>
                      <th className='bot-th text-center' colSpan='3'>Players</th>
                      <th className='text-center' rowSpan='2'>Captian</th>
                      <th rowSpan='2'>Score Point</th>
                      <th rowSpan='2'>Credits</th>
                    </tr>
                    <tr>
                      <th className='bot-th-1 text-center'>Select Player</th>
                      <th className='bot-th-1 text-center'>Neglect Player</th>
                      <th className='bot-th-2 text-center'>Clear</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading
                      ? <SkeletonTable numberOfColumns={11} />
                      : (
                        <Fragment>
                          {
                          list && list.length !== 0 && list.map((data, i) => (
                            <Fragment key={data._id}>
                              <tr key={data._id}>
                                <td>{i + 1}</td>
                                <td>
                                  {data.sImage
                                    ? <img alt='No Image' className='theme-image' src={url + data.sImage} />
                                    : <img alt="No Image" className='l-cat-img' src={noImage} />
                                }
                                </td>
                                <td>{data.sTeamName}</td>
                                <td>{data.sName}</td>
                                <td>
                                  {data.eRole === 'ALLR'
                                    ? 'All Rounder'
                                    : data.eRole === 'BATS'
                                      ? 'Batsman'
                                      : data.eRole === 'BWL'
                                        ? 'Bowler'
                                        : data.eRole === 'WK'
                                          ? 'Wicket Keeper'
                                          : data.eRole === 'FWD'
                                            ? 'Forwards'
                                            : data.eRole === 'GK'
                                              ? 'Goal Keeper'
                                              : data.eRole === 'DEF'
                                                ? 'Defender'
                                                : data.eRole === 'RAID'
                                                  ? 'Raider'
                                                  : data.eRole === 'MID'
                                                    ? 'Mid fielders'
                                                    : data.eRole === 'PG'
                                                      ? 'Point-Gaurd'
                                                      : data.eRole === 'SG'
                                                        ? 'Shooting-Gaurd'
                                                        : data.eRole === 'SF'
                                                          ? 'Small-Forwards'
                                                          : data.eRole === 'PF'
                                                            ? 'Power-Forwards'
                                                            : data.eRole === 'C'
                                                              ? 'Centre'
                                                              : data.eRole === 'IF' ? 'Infielder' : data.eRole === 'OF' ? 'Outfielder' : data.eRole === 'P' ? 'Pitcher' : data.eRole === 'CT' ? 'Catcher' : '--'}
                                </td>
                                {players.map((player, index) => (player.iPlayerId === data._id) && (
                                  <>
                                    <td className='text-center'>
                                      <Input
                                        checked={player.selected === 'Y'}
                                        defaultChecked={player.selected === 'Y'}
                                        disabled={probability > 0}
                                        id='one'
                                        name={`SelectedPlayer${data._id}`}
                                        onClick={event => handleCaption(event, data._id, 'SelectedPlayer')}
                                        type='radio'
                                        value='Y'
                                      />
                                    </td>
                                    <td className='text-center'>
                                      <Input
                                        checked={player.selected === 'N'}
                                        disabled={probability > 0}
                                        id='two'
                                        name={`SelectedPlayer${data._id}`}
                                        onClick={event => handleCaption(event, data._id, 'SelectedPlayer')}
                                        type='radio'
                                        value='N'
                                      />
                                    </td>
                                    <td className='clear-button-teammatchplayer text-center' onClick={event => handleCaption(event, data._id, 'SelectedPlayerClear')}><img height={16} src={uncheckedRadio} width={16} /></td>
                                    <td className='text-center'><Input checked={player.isCaptain} className='custom-check-box' disabled={probability > 0} onChange={(e) => handleCaption(e, data._id, 'Captian')} type="checkbox" /></td>
                                  </>
                                )
                                )}
                                <td>{data.nScoredPoints ? data.nScoredPoints : ' 0 '}</td>
                                <td>{data.nFantasyCredit}</td>
                              </tr>
                            </Fragment>
                          ))
                        }
                        </Fragment>
                        )
                  }
                  </tbody>
                </table>
                )}
          <FormGroup>
            <p className='error-text'>{playersErr}</p>
          </FormGroup>
        </div>
      </div>

      <div className='edit-main-bot mb-4'>
        <Row >
          <Col className='pl-4' lg={6} md={12} xl={6}>
            <div className='bot-field'>
              {list?.length !== 0 && combinationBot && (
                <>
                  <div className='edit-bots bot-field-edit-header'>
                    <h3> Combination Teams</h3>
                    <img alt="caret-icon" src={caretIcon} />
                  </div>
                  <Row className='mt-4'>
                    <Col className='copy-select p-0' md={12} xl={12}>
                      <FormGroup className='select-label-bot'>
                        <Label for="MatchLeagueId">
                          Match League
                          <RequiredField/>
                        </Label>
                        <Select
                          captureMenuScroll={true}
                          className={leagueIdErr ? 'league-placeholder-error' : 'league-placeholder'}
                          closeMenuOnSelect={false}
                          components={animatedComponents}
                          id="MatchLeagueId"
                          isMulti={true}
                          menuPlacement="auto"
                          name="MatchLeagueId"
                          onChange={selectedOption => handleLeagueChange(selectedOption, 'LeagueId')}
                          options={options}
                          placeholder="Select Match League"
                          value={matchLeagueId}
                        />
                        <p className="error-text">{leagueIdErr}</p>
                      </FormGroup>
                    </Col>
                    <Col lg={6} md={6} xl={6}>
                      <FormGroup className='pl-2'>
                        <Label for='selectedSize'>
                          Selected Player Size
                          <RequiredField/>
                        </Label>
                        <Input disabled={(list.length === 0)} onChange={(e) => handleOnChange(e, 'SelectedSize')} type='number' value={selectedSize} />
                        <p className='error-text'>{selectedSizeErr}</p>
                      </FormGroup>
                    </Col>
                    <Col lg={6} md={6} xl={6}>
                      <FormGroup className='pr-2'>
                        <Label for='neglectedSize'>
                          Neglected Player Size
                          <RequiredField/>
                        </Label>
                        <Input disabled onChange={(e) => handleOnChange(e, 'NegPlayerSize')} type='number' value={neglectedSize} />
                        <p className='error-text'>{neglectedSizeErr}</p>
                      </FormGroup>
                    </Col>
                  </Row>
                </>
              )}

              {
                ((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS === 'W')) && (
                <Fragment>
                  {combinationBot
                    ? (
                      <Row>
                        <Col className='p-0' md={6} xl={12}>
                          {list?.length !== 0 && (
                          <FormGroup className='edit-bot-btn'>
                            <Button className='theme-btn icon-btn' onClick={updateCombinationTeams}>Update Combination Teams</Button>
                          </FormGroup>
                          )}
                        </Col>
                      </Row>
                      )
                    : (
                      <>
                        <div className='edit-bots bot-field-edit-header'>
                          <h3> Possible Combinations </h3>
                          <img alt='caret-icon' src={caretIcon} />
                        </div>
                        <Row className='edit-bot-row mt-2'>
                          <Col md='6' xl='6'>
                            <FormGroup>
                              <Label for='creditLimitMin'>
                                Credit Limit (Min)
                                <RequiredField/>
                              </Label>
                              <Input disabled={(list.length === 0) || (probability > 0)} onChange={(e) => handleOnChange(e, 'Min')} type='number' value={creditLimitMin} />
                              <p className='error-text'>{creditLimitMinErr}</p>
                            </FormGroup>
                          </Col>
                          <Col md='6' xl='6'>
                            <FormGroup>
                              <Label for='creditLimitMax'>
                                Credit Limit (Max)
                                <RequiredField/>
                              </Label>
                              <Input disabled={(list.length === 0) || (probability > 0)} onChange={(e) => handleOnChange(e, 'Max')} type='number' value={creditLimitMax} />
                              <p className='error-text'>{creditLimitMaxErr}</p>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className='edit-bot-row mt-2'>
                          <Col md='6' xl='6'>
                            <FormGroup>
                              <Label for='selectedSize'>
                                Selected Player Size
                                <RequiredField/>
                              </Label>
                              <Input disabled={(list.length === 0) || (probability > 0)} onChange={(e) => handleOnChange(e, 'SelectedSize')} type='number' value={selectedSize} />
                              <p className='error-text'>{selectedSizeErr}</p>
                            </FormGroup>
                          </Col>

                          <Col md='6' xl='6'>
                            <FormGroup>
                              <Label for='neglectedSize'>
                                Neglected Player Size
                                <RequiredField/>
                              </Label>
                              <Input disabled={(list.length === 0) || (probability > 0)} onChange={(e) => handleOnChange(e, 'NegPlayerSize')} type='number' value={neglectedSize} />
                              <p className='error-text'>{neglectedSizeErr}</p>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className='mt-2'>
                          <div className='d-flex justify-content-start'>
                            {/* <div> */}
                            <FormGroup className='edit-bot-btn'>
                              <Button className='theme-btn icon-btn' disabled={(list.length === 0) || (probability > 0)} onClick={getProbabilityFunc}>Get Combination Count</Button>
                            </FormGroup>
                            {/* </div> */}

                            {
                            (probability > 0) && (
                            <div className='ml-3'>
                              <FormGroup>
                                <Button className='outline-bot' onClick={recalculateFunc}>Re-Calculate</Button>
                              </FormGroup>
                            </div>
                            )}
                          </div>
                        </Row>
                        <Row className='possible-combi-bot mt-2'>
                          {
                          (probability > 0) && (
                          <Col className='p-0' md='12'>
                            <div className='combi-bot-p d-flex justify-content-between align-items-center'>
                              <p className='m-0 bot-text'>Possible Combinations</p>
                              <p className='total-text-bot'>{combinationMsg}</p>
                            </div>
                          </Col>
                          )}
                        </Row>
                      </>
                      )
                  }
                </Fragment>
                )}
            </div>
          </Col>
          <Col className='pr-4' lg={6} md={12} xl={6}>
            {probability > 0 && (
              <div className='bot-field' style={{ height: '350px' }}>
                <div className='create-bots create-field-edit-header'>
                  <div className='sub-heading px-4'>
                    <h3> Create Team</h3>
                    <span className='carer-Icons'>
                      {' '}
                      <img alt="caret-icon" src={caretIcon} />
                    </span>
                  </div>
                  <Fragment>
                    <Row>
                      <Col className='p-0 mt-2' md={12} xl={12}>
                        <FormGroup className='bot-team-form'>
                          <Label className='text-left' for='teamCount'>
                            Team Count
                            <RequiredField/>
                          </Label>
                          <Input disabled={list.length === 0} onChange={(e) => handleOnChange(e, 'TeamCount')} type='number' value={teamCount} />
                          <p className='error-text'>{teamCountErr}</p>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row className='bot-team-form-checkbox'>
                      <Col className='p-0' md={12} xl={12}>
                        <FormGroup className='bot-team-form-check'>
                          <Input
                            checked={instantAdd}
                            className='bot-check'
                            disabled={list.length === 0}
                            onChange={e => handleOnChange(e, 'InstantAdd')}
                            type="checkbox"
                            value='Y'
                          />
                          <Label className='bot-check-label'>Add Instant Bot</Label>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col className='p-0' lg='4' md='6'>
                        <FormGroup className='edit-bot-btn'>
                          <Button className='theme-btn icon-btn' disabled={list.length === 0} onClick={createTeamsFunc}>Create Teams</Button>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Fragment>
                </div>
              </div>
            )}
          </Col>
        </Row>

      </div>

      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Combination Bot Logs</ModalHeader>
        <ModalBody>
          {combinationLogsDetails?.aError?.length > 0 && (
            <>
              <h3 className='text-center mt-3'>Error Logs</h3>
              <div className='table-represent'>
                <div className='table-responsive'>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th rowSpan={2}>No</th>
                        <th rowSpan={2}>Date</th>
                        <th rowSpan={2}>Message</th>
                        <th className='text-center border-right-transparent' colSpan={4}>Players</th>
                        <th className='text-center' colSpan={2}>Teams</th>
                      </tr>
                      <tr>
                        <th className='text-center'>Total</th>
                        <th className='text-center'>Selected</th>
                        <th className='text-center'>Neglected</th>
                        <th className='text-center border-right-transparent'>Captains</th>
                        <th className='text-center'>Edited</th>
                        <th className='text-center'>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {combinationLogsDetails?.aError?.length !== 0 && combinationLogsDetails?.aError?.map((log, i) => (
                        <tr key={log._id}>
                          <td>{i + 1}</td>
                          <td>{log.dDate || '--'}</td>
                          <td>{log.sMessage || '--'}</td>
                          <td className='text-center'>{log.aPlayers.length || 0}</td>
                          <td className='text-center'>{log.aPlayers.filter((item) => item.selected).length || 0}</td>
                          <td className='text-center'>{log.aPlayers.filter((item) => !item.selected).length || 0}</td>
                          <td className='text-center'>{log.aPlayers.filter((item) => item.isCaptain).length || 0}</td>
                          <td className='text-center'>{log.nTotalTeamEdited || 0}</td>
                          <td className='text-center'>{log.nTotalTeam || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <h3 className='text-center mt-4'>Success Logs</h3>
          <div className='table-represent'>
            <div className='table-responsive'>
              <table className='table'>
                <thead>
                  <tr>
                    <th rowSpan={2}>No</th>
                    <th rowSpan={2}>Date</th>
                    <th rowSpan={2}>Message</th>
                    <th className='text-center border-right-transparent' colSpan={4}>Players</th>
                    <th className='text-center' colSpan={2}>Teams</th>
                  </tr>
                  <tr>
                    <th className='text-center'>Total</th>
                    <th className='text-center'>Selected</th>
                    <th className='text-center'>Neglected</th>
                    <th className='text-center border-right-transparent'>Captains</th>
                    <th className='text-center'>Edited</th>
                    <th className='text-center'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {combinationLogsDetails?.aSuccess?.length !== 0 && combinationLogsDetails?.aSuccess?.map((log, i) => (
                    <tr key={log._id}>
                      <td>{i + 1}</td>
                      <td>{log.dDate || '--'}</td>
                      <td>{log.sMessage || '--'}</td>
                      <td className='text-center'>{log.aPlayers.length || 0}</td>
                      <td className='text-center'>{log.aPlayers.filter((item) => item.selected).length || 0}</td>
                      <td className='text-center'>{log.aPlayers.filter((item) => !item.selected).length || 0}</td>
                      <td className='text-center'>{log.aPlayers.filter((item) => item.isCaptain).length || 0}</td>
                      <td className='text-center'>{log.nTotalTeamEdited || 0}</td>
                      <td className='text-center'>{log.nTotalTeam || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

SystemTeamMatchPlayers.propTypes = {
  match: PropTypes.object,
  matchLeaguePage: PropTypes.string,
  combinationBot: PropTypes.bool,
  matchId: PropTypes.string,
  isModalOpen: PropTypes.bool,
  setModalOpen: PropTypes.func,
  getCombinationBotLogs: PropTypes.func,
  matchLeagueList: PropTypes.array,
  getList: PropTypes.function,
  sportsType: PropTypes.string,
  matchDetails: PropTypes.object,
  location: PropTypes.object,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  teamName: PropTypes.array,
  setTeams: PropTypes.func,
  AutoSelect: PropTypes.bool,
  setAutoSelect: PropTypes.func,
  teams: PropTypes.arr
}

export default SystemTeamMatchPlayers
