import React, { createRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Badge, Button, Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types'
import moment from 'moment'
import classNames from 'classnames'

import noImage from '../../../../assets/images/avatar.svg'
import addIcon from '../../../../assets/images/base-add.svg'

import Teams from './Teams/createTeam'

import { defaultPlayerRoleImages, modalMessageFunc } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'
import { getMatchDetails } from '../../../../actions/match'
import { getSportsList } from '../../../../actions/sports'
import { createBaseTeam, getBaseTeamDetails, getMatchPlayerListDetails } from '../../../../actions/matchplayer'
import AlertMessage from '../../../../components/AlertMessage'
import DataNotFound from '../../../../components/DataNotFound'
// import Loading from '../../../../components/Loading'

const BaseTeam = forwardRef((props, ref) => {
  const { id, iTeamId, openPicker, onClose, setSaveAllDisabled, setOpenPicker, openCollapse } = props
  const { sportstype } = useParams()
  const dispatch = useDispatch()

  const [role, setRole] = useState('All')
  const [time, setTime] = useState('')
  const [intervalRef, setIntervalRef] = useState(null)
  const [modal, setModal] = useState([])
  const [roleWiseEmptyPlayer, setroleWiseEmptyPlayer] = useState({})
  const [sportRule, setSportRule] = useState({})
  const [mainPlayerList, setMainPlayerList] = useState({})
  const [playerRole, setPlayerRole] = useState({})
  const [playerRoles, setPlayerRoles] = useState([])
  const [matchStatus, setMatchStatus] = useState('')
  const [modalObj, setModalObj] = useState({})
  const [successModalObj, setsuccessModalObj] = useState({})
  // const [message, setMessage] = useState('')
  // const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  // const [teamError, setTeamError] = useState('')

  const token = useSelector(state => state?.auth?.token)
  const matchDetails = useSelector(state => state?.match?.matchDetails)

  const getUrlLink = useSelector((state) => state?.url?.getUrl)
  const sportsList = useSelector(state => state?.sports?.sportsList)
  const baseTeamList = useSelector(state => state?.matchplayer?.baseTeamList)
  const baseTeamResponse = useSelector(state => state?.matchplayer?.baseTeamDetails)
  const matchPlayerListDetails = useSelector(state => state?.matchplayer?.matchPlayerListDetails)
  const baseTeamDetails = useSelector(state => state?.matchplayer?.getBaseTeamDetails)

  // const resMessage = useSelector((state) => state?.matchplayer?.resMessage)
  // const resStatus = useSelector((state) => state?.matchplayer?.resStatus)

  const btnDisabled = matchStatus === 'L' || matchStatus === 'I'
  // const previousProps = useRef({
  //   resMessage, resStatus
  // })

  const disabled = modal?.length === 1

  // For scrolling all teams at same Time
  const firstDivRef = useRef()
  // Create an array of refs for elements in modal
  const elementsRef = useRef(modal?.map(() => createRef()))
  // Update refs when modal change
  useEffect(() => {
    elementsRef.current = modal?.map(() => createRef())
  }, [modal])
  // this is for first set of element
  const handleScrollFirst = (scroll) => {
    // Scroll all the elements in elementsRef array
    elementsRef?.current?.forEach((e) => {
      if (e?.current) {
        e.current.scrollTop = scroll?.target?.scrollTop
      }
    })
  }
  // this is for first div and second set of element
  const handleScrollSecond = (scroll) => {
    if (firstDivRef?.current) {
      firstDivRef.current.scrollTop = scroll?.target?.scrollTop
    }
    // scroll all the elements in elementsRef array
    elementsRef?.current?.forEach((e) => {
      if (e?.current) {
        e.current.scrollTop = scroll?.target?.scrollTop
      }
    })
  }

  useEffect(() => {
    if (matchDetails) {
      setMatchStatus(matchDetails?.eStatus)
    }
  }, [matchDetails])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // useEffect(() => {
  //   if (previousProps?.resMessage !== resMessage) {
  //     if (resMessage) {
  //       setMessage(resMessage)
  //       setStatus(resStatus)
  //       if (resStatus) {
  //         setModalMessage(true)
  //       }
  //       // setLoading(false)
  //     }
  //   }
  //   return () => {
  //     previousProps.resMessage = resMessage
  //   }
  // }, [resStatus, resMessage])

  useEffect(() => {
    if (id) {
      dispatch(getMatchDetails(id, token))
      dispatch(getMatchPlayerListDetails(id, token))
      dispatch(getSportsList(token))
      dispatch(getUrl('media'))
      // dispatch(getBaseTeamList(id, token))
    } if (iTeamId) {
      dispatch(getBaseTeamDetails(iTeamId, token))
    }
  }, [])

  useEffect(() => {
    if (baseTeamList && Object?.keys(roleWiseEmptyPlayer)?.length && matchDetails) {
      // to calculate used credit and other info
      const calculateCreditUsed = (playerList, selectedPlayers) => {
        let usedCredit = 0
        let selectedPlayer = []
        // Remove duplicate selected players
        const uniquePlayers = selectedPlayers?.filter((item, index, ar) => {
          return ar?.indexOf(item) === index
        })
        // Count Selected players from home and away teams
        const homeTeamCount = uniquePlayers?.filter(data => data?.isAdded && data?.oTeam?.sName === matchDetails?.oHomeTeam?.sName)?.length
        const awayTeamCount = uniquePlayers?.filter(data => data?.isAdded && data?.oTeam?.sName === matchDetails?.oAwayTeam?.sName)?.length
        // Calculate used credit and gather selected player
        uniquePlayers?.forEach(player => {
          if (playerList?.includes(player?._id)) {
            usedCredit += player?.nFantasyCredit
            selectedPlayer = [...selectedPlayer, player]
          }
        })

        return { usedCredit, homeTeamCount, awayTeamCount, selectedPlayer }
      }

      // Prepare teams array with calculated data
      const teams = baseTeamList?.map(team => {
        const roleWisePlayers = {}
        // Loop through different player roles and mark selected players
        Object?.keys(roleWiseEmptyPlayer)?.forEach(key => {
          const arr = roleWiseEmptyPlayer[key]?.map(player => {
            const isSelected = team?.aPlayers?.some(id => id === player?._id)
            return {
              ...player,
              isAdded: isSelected,
              isDisable: !isSelected
            }
          })
          roleWisePlayers[key] = arr
        })
        // Calculate credit used and other team information
        const { usedCredit, homeTeamCount, awayTeamCount, selectedPlayer } = calculateCreditUsed(team?.aPlayers, roleWisePlayers?.All)
        // Construct team object with relevant data
        return {
          id: team._id,
          teamName: team?.sName,
          creditLeft: 100 - usedCredit,
          homeTeam: homeTeamCount,
          awayTeam: awayTeamCount,
          homeTeamId: matchDetails?.oHomeTeam?.iTeamId,
          awayTeamId: matchDetails?.oAwayTeam?.iTeamId,
          selectedPlayerArray: selectedPlayer,
          aPlayer: { ...roleWisePlayers },
          editTeam: true
        }
      })

      setModal(teams)
    }
  }, [baseTeamList, roleWiseEmptyPlayer, matchDetails])

  useEffect(() => {
    if (baseTeamDetails && Object?.keys(roleWiseEmptyPlayer)?.length && matchDetails && iTeamId) {
      // to calculate used credit and other info
      const calculateCreditUsed = (playerList, selectedPlayers) => {
        let usedCredit = 0
        let selectedPlayer = []
        // Remove duplicate selected players
        const uniquePlayers = selectedPlayers?.filter((item, index, ar) => {
          return ar?.indexOf(item) === index
        })
        // Count Selected players from home and away teams
        const homeTeamCount = uniquePlayers?.filter(data => data?.isAdded && data?.oTeam?.sName === matchDetails?.oHomeTeam?.sName)?.length
        const awayTeamCount = uniquePlayers?.filter(data => data?.isAdded && data?.oTeam?.sName === matchDetails?.oAwayTeam?.sName)?.length
        // Calculate used credit and gather selected player
        uniquePlayers?.forEach(player => {
          if (playerList?.includes(player?._id)) {
            usedCredit += player?.nFantasyCredit
            selectedPlayer = [...selectedPlayer, player]
          }
        })

        return { usedCredit, homeTeamCount, awayTeamCount, selectedPlayer }
      }

      // Prepare teams array with calculated data
      const teams = baseTeamDetails?.map(team => {
        const roleWisePlayers = {}
        // Loop through different player roles and mark selected players
        Object?.keys(roleWiseEmptyPlayer)?.forEach(key => {
          const arr = roleWiseEmptyPlayer[key]?.map(player => {
            const isSelected = team?.aPlayers?.some(id => id === player?._id)
            return {
              ...player,
              isAdded: isSelected,
              isDisable: !isSelected
            }
          })
          roleWisePlayers[key] = arr
        })
        // Calculate credit used and other team information
        const { usedCredit, homeTeamCount, awayTeamCount, selectedPlayer } = calculateCreditUsed(team?.aPlayers, roleWisePlayers?.All)
        // Construct team object with relevant data
        return {
          id: team._id,
          teamName: team?.sName,
          creditLeft: 100 - usedCredit,
          homeTeam: homeTeamCount,
          awayTeam: awayTeamCount,
          homeTeamId: matchDetails?.oHomeTeam?.iTeamId,
          awayTeamId: matchDetails?.oAwayTeam?.iTeamId,
          selectedPlayerArray: selectedPlayer,
          aPlayer: { ...roleWisePlayers },
          editTeam: true
        }
      })

      setModal(teams)
    }
  }, [baseTeamDetails, roleWiseEmptyPlayer, matchDetails])

  useEffect(() => {
    if (matchDetails && matchDetails?.dStartDate) {
      if ((new Date(matchDetails.dStartDate) > Date?.now() + 86400000) || (new Date(matchDetails?.dStartDate) < new Date(Date?.now()))) {
        setTime(moment(matchDetails.dStartDate)?.format('lll'))
      } else {
        setIntervalRef(setInterval(() => {
          const duration = moment?.duration(moment(matchDetails?.dStartDate)?.diff(moment(new Date())))
          setTime(`${duration?.hours()}h ${duration?.minutes()}m  ${duration?.seconds()}s to start `)
        }, 1000))
      }
    }
    return () => {
      clearInterval(intervalRef)
    }
  }, [matchDetails])

  // This useEffect is triggered whenever there are changes in the 'matchPlayerListDetails'
  useEffect(() => {
    if (matchPlayerListDetails?.matchPlayer) {
      const obj = {}
      obj.All = []
      // Iterate through each player
      matchPlayerListDetails?.matchPlayer?.forEach((player) => {
        const p = {
          ...player,
          isAdded: false

        }
        if (!obj[player?.eRole]) {
          obj[player?.eRole] = []
        }
        obj[player?.eRole]?.push(p)
        obj?.All?.push(p)
      })

      setroleWiseEmptyPlayer(obj)
    }
    if (matchPlayerListDetails?.aPlayerRole) {
      // Create a role-based object that containing minimum and maximum player count.
      const roleObject = matchPlayerListDetails?.aPlayerRole?.reduce((oRole, { sName, nMin, nMax }) => {
        oRole[sName] = { nMin, nMax }
        return oRole
      }, {})
      setPlayerRole(roleObject)
      setPlayerRoles(matchPlayerListDetails?.aPlayerRole)
    }
    if (sportsList) {
      const sport = sportsList?.find(({ sKey }) => sKey?.toLowerCase() === sportstype)
      setSportRule(sport?.oRule)
    }
  }, [matchPlayerListDetails])

  useEffect(() => {
    if (roleWiseEmptyPlayer) {
      setMainPlayerList(roleWiseEmptyPlayer)

      if (Object.keys(roleWiseEmptyPlayer)?.length && !iTeamId) {
        const tid = uuidv4()

        // Create a new team object with default values and add it to the 'modal' state
        handleModalChange({
          data: [
            ...modal, {
              id: tid,
              teamName: '',
              creditLeft: 100,
              homeTeam: 0,
              awayTeam: 0,
              homeTeamId: matchDetails?.oHomeTeam?.iTeamId,
              awayTeamId: matchDetails?.oAwayTeam?.iTeamId,
              selectedPlayerArray: [], // Array to store selected players for this team
              aPlayer: { ...roleWiseEmptyPlayer } // Object containing role-wise empty player data
            }]
        })
      }
    }
  }, [Object.keys(roleWiseEmptyPlayer).length])

  useEffect(() => {
    setSaveAllDisabled(disabled)
  }, [disabled])

  // This useEffect is triggered whenever there are changes in the 'modal' or 'mainPlayerList' state
  useEffect(() => {
    if (modal?.length && mainPlayerList) {
      const obj = {}
      // Iterate through each player in the main player list for the specified role
      mainPlayerList[role]?.forEach((player) => {
        obj[player?._id] = 0
      })
      // Iterate through the player IDs stored in the 'obj' object
      Object.keys(obj)?.forEach((key, value) => {
        let count = 0
        // Iterate through each team in the 'modal'
        modal?.forEach((team) => {
          // Iterate through each player in the specific role of the current team
          team?.aPlayer[role]?.forEach((player) => {
            if (key === player?._id && player?.isAdded) {
              count = count + 1
            }
          })
        })
        obj[key] = count
      })
      // Create a new object that updates the player count in the main player list for the specified role
      const mainPlayers = {
        ...mainPlayerList,
        role: mainPlayerList[role]?.map((player) => {
          Object?.keys(obj)?.forEach((playerId) => {
            if (playerId === player?._id) {
              player.count = obj[playerId]
            }
          })
          return player
        })
      }
      setMainPlayerList(mainPlayers)
    }
  }, [modal])

  function setRoleFunc (role) {
    setRole(role)
  }

  // This function is triggered when add a new team to the 'modal' state
  function handleButtonClick () {
    // Generate a unique identifier for the new team
    const tid = uuidv4()

    // Create a new team object with default values and add it to the 'modal' state
    handleModalChange({
      data: [
        ...modal, {
          id: tid,
          teamName: '',
          creditLeft: 100,
          homeTeam: 0,
          awayTeam: 0,
          homeTeamId: matchDetails?.oHomeTeam?.iTeamId,
          awayTeamId: matchDetails?.oAwayTeam?.iTeamId,
          selectedPlayerArray: [], // Array to store selected players for this team
          aPlayer: { ...roleWiseEmptyPlayer } // Object containing role-wise empty player data
        }]
    })
  }

  // This function handles the player to all teams' selected player arrays and performs related calculations
  function handleAddPlayeForAllTeam (data, index, isAdded) {
    const updatedModal = [...modal]
    updatedModal?.forEach((teamModal) => {
      teamModal.selectedPlayerArray = [...teamModal?.selectedPlayerArray]

      // To update player status based on the added player's data
      teamModal.aPlayer.All = teamModal?.aPlayer?.All?.map(player => {
        if (player?._id === data?._id && !player?.isDisable && !player?.isLimitExceed && !player?.isElevenPlayer) {
          !teamModal?.selectedPlayerArray?.find(p => p?._id === player?._id) && teamModal?.selectedPlayerArray?.push({ ...player, isAdded: true })
          return {
            ...player,
            isAdded: true
          }
        } else {
          return player
        }
      })

      // Calculate credit and team composition limits after player add
      const { nCredit, homeTeam, awayTeam } = teamModal?.aPlayer?.All?.reduce((oValue, oPlayer) => {
        if (oPlayer?.isAdded) {
          oValue.nCredit = oValue?.nCredit - oPlayer?.nFantasyCredit
          oValue.homeTeam = matchDetails?.oHomeTeam?.sShortName === oPlayer?.oTeam?.sShortName ? (oValue?.homeTeam + 1) : oValue?.homeTeam
          oValue.awayTeam = matchDetails?.oAwayTeam?.sShortName === oPlayer?.oTeam?.sShortName ? (oValue?.awayTeam + 1) : oValue?.awayTeam
          return oValue
        }
        return oValue
      }, { nCredit: 100, homeTeam: 0, awayTeam: 0 })
      teamModal.creditLeft = nCredit
      teamModal.homeTeam = homeTeam
      teamModal.awayTeam = awayTeam

      // Update the player status within the role-specific arrays
      teamModal.aPlayer[data.eRole] = teamModal?.aPlayer[data?.eRole]?.map(player => {
        if (player?._id === data?._id && !player?.isDisable && !player?.isLimitExceed && !player?.isElevenPlayer) {
          return {
            ...player,
            isAdded: true
          }
        } else {
          return player
        }
      })

      // Function to check and update player disable status, player count, and limit exceed status based on rules
      function checkPlayers ({ data, role, limit, playerData }) {
        const newData = {
          [role]: [],
          All: []
        }
        const aPlayer = { ...data?.aPlayer }
        const isDisable = aPlayer[role]?.filter(p => p?.isAdded)?.length >= limit

        // Common function to update player disable status
        function commonFunction (p) {
          const player = { ...p }
          if (player?.eRole === role) {
            if (!isDisable) {
              player.isDisable = isDisable
            } else if (!player?.isAdded && isDisable) {
              player.isDisable = isDisable
            } else if (player?.isAdded) {
              player.isDisable = false
            }
          }
          return player
        }
        // Update 'All' and role-specific arrays using the 'commonFunction'
        newData.All = aPlayer?.All?.map(commonFunction)
        newData[role] = aPlayer[role]?.map(commonFunction)
        for (const role in aPlayer) {
          newData[role] = (newData[role]?.length ? newData[role] : aPlayer[role])?.map((p) => {
            const player = { ...p }
            if ((data?.homeTeam + data?.awayTeam) >= sportRule?.nTotalPlayers) {
              player.isElevenPlayer = !player?.isAdded
            } else {
              player.isElevenPlayer = false
            }
            if (matchDetails?.oHomeTeam?.iTeamId === player?.oTeam?.iTeamId) {
              player.isLimitExceed = !player?.isAdded && data?.homeTeam >= sportRule?.nMaxPlayerOneTeam
            } else if (matchDetails?.oAwayTeam?.iTeamId === player.oTeam.iTeamId) {
              player.isLimitExceed = !player?.isAdded && data?.awayTeam >= sportRule?.nMaxPlayerOneTeam
            }
            return player
          })
        }
        return newData // return the updated player data
      }

      // Call 'checkPlayers' to update player based on the role-specific rules
      const finalData = checkPlayers({ data: teamModal, role: data.eRole, limit: playerRole[data.eRole]?.nMax, playerData: data })
      for (const key in finalData) {
        teamModal.aPlayer[key] = finalData[key]
      }
    })
    // Call to update the state with the modified updatedModal array
    handleModalChange({ data: updatedModal })
  }

  // This function is used to handle changes in the modal data, updating selected player information
  function handleModalChange ({ item, data }) {
    if (item) {
      const selected = item?.aPlayer?.All?.filter(player => player?.isAdded)
      const modall = data?.map((team) => {
        if (team?.id === modal?.id) {
          const t = { ...team }
          t.selectedPlayerArray = selected
          return t
        } else {
          return team
        }
      })
      setModal(modall)
    } else {
      setModal(data)
    }
  }

  // This function is used to submit team data, either for editing an existing team or creating a new one
  function submitAll () {
    const teams = []
    modal?.forEach((team, index) => {
      const add = team?.selectedPlayerArray?.map((data) => data?._id)
      const data = {
        aPlayers: add,
        sName: team?.teamName,
        iTeamId: team?.id
      }
      const data2 = {
        aPlayers: add,
        sName: team?.teamName
      }
      if (team?.editTeam) {
        teams?.push(data)
      } else if (data2?.aPlayers?.length !== 0) {
        teams?.push(data2)
        // setTeamError('team' + (index + 1))
      }
    })
    const sendData = {
      teams,
      iMatchId: matchDetails._id,
      token
    }
    dispatch(createBaseTeam(sendData, modal))
    dispatch(getMatchPlayerListDetails(id, token))
  }

  useImperativeHandle(ref, () => ({
    submitAll,
    handleButtonClick
  }))

  useEffect(() => {
    if (baseTeamResponse?.fail) {
      const obj = {}
      baseTeamResponse?.fail.forEach((res) => {
        if (!obj[res?.type]) {
          obj[res?.type] = []
        }

        obj[res?.type]?.push(res)
      })
      setModalObj(obj)
    }
    if (baseTeamResponse?.success) {
      const obj = {}
      baseTeamResponse?.success.forEach((res) => {
        if (!obj[res?.type]) {
          obj[res?.type] = []
        }

        obj[res?.type]?.push(res)
      })
      setsuccessModalObj(obj)
    }
  }, [baseTeamResponse])

  return (
    <>

      <AlertMessage
        close ={close}
        // message={message}
        status={status}
        modalMessage={modalMessage}
      />
      {/* {!matchPlayerListDetails && <Loading/> } */}
      {
        (matchPlayerListDetails?.matchPlayer?.length === undefined || matchPlayerListDetails?.matchPlayer?.length === 0)
          ? (
            <DataNotFound message='Player' obj=''/>
            )
          : (
            <>
              {!iTeamId &&
              <Button className='create-team-btn' onClick={handleButtonClick} disabled={btnDisabled}> Create New Team</Button>}
              <div className='base-team d-flex'>
                <div className='player-main-div'>
                  <div className='player-list-head'>
                    <div className="m-time">
                      <strong>{time}</strong>
                    </div>
                    <div className='d-flex align-items-center justify-content-between mt-4 pl-3 pr-3'>
                      <div className='team d-flex align-items-center'>
                        <div className='t-img1 d-flex justify-content-end'>
                          <img src={matchDetails?.oHomeTeam?.sImage ? `${getUrlLink}${matchDetails?.oHomeTeam?.sImage}` : noImage} alt='Home team image' />
                        </div>
                        <div className='name'>
                          <h3>{matchDetails?.oHomeTeam?.sShortName}</h3>
                        </div>
                      </div>
                      <div className='team d-flex align-items-center'>
                        <div className='name'>
                          <h3>{matchDetails?.oAwayTeam?.sShortName}</h3>
                        </div>
                        <div className=' t-img d-flex justify-content-end'>
                          <img src={matchDetails?.oAwayTeam?.sImage ? `${getUrlLink}${matchDetails?.oAwayTeam?.sImage}` : noImage} alt='Away team image' />
                        </div>
                      </div>
                    </div>
                    <div className='d-  flex justify-content-between'>
                      <ul className='player-role pr-4 pl-4 mb-0'>
                        <li className={role === 'All' ? 'player-roles-list-active' : 'player-roles-list'} onClick={() => setRoleFunc('All')}>ALL</li>
                        {playerRoles?.map((data) => (
                          <>
                            <li className={data?.sName === role ? 'player-roles-list-active' : 'player-roles-list'} key={data?.sName} onClick={() => setRoleFunc(data?.sName)}>{data?.sName}</li>
                          </>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className={classNames('scrolling', { 'scrolling-height': !iTeamId, 'scrolling-height-without-createbtn': iTeamId })} onScroll={handleScrollFirst} ref={firstDivRef}>

                    {mainPlayerList[role]?.map((data, index) => (
                      <>
                        <div className='player-listing' key={data._id} >
                          <div className='player-img-div'>
                            <div className='player-img'>
                              <div className='player-details-div'>
                                <img src={data && data?.sImage ? getUrlLink + data?.sImage : defaultPlayerRoleImages(sportstype, data?.eRole)} />
                              </div>
                              <span className='ml-4'>
                                <h4>{data?.sName}</h4>
                                <h5>{data?.sTeamName}</h5>
                              </span>
                            </div>
                            <div className='player-add'><img src={addIcon} onClick={() => handleAddPlayeForAllTeam(data, index, data.isAdded)} /></div>
                          </div>
                          <div className='pt-2'>
                            <Row className='d-flex credits'>
                              <h4>
                                Credits:
                                {data?.nFantasyCredit}
                              </h4>
                              <h4>
                                Points:
                                {data?.nSeasonPoints}
                              </h4>
                            </Row>
                          </div>
                          <div className='pt-2'>
                            <Row className={classNames('d-flex played-last-match', { 'justify-content-center': !(data?.bPlayInLastMatch || data?.bShow) })}>
                              {(data?.bPlayInLastMatch || data?.bShow) && (
                              <div className='played-div'>
                                <h4 className={classNames({ 'played-match': data?.bPlayInLastMatch, playing: data?.bShow })}>
                                  {data?.bPlayInLastMatch ? 'Played Last Match' : data?.bShow ? 'Playing' : ''}
                                </h4>
                              </div>
                              )}
                              <h4>
                                Picked in
                                {' '}
                                <strong>{data.count || 0}</strong>
                                {' '}
                                Teams
                              </h4>
                            </Row>
                          </div>
                        </div>
                      </>
                    )
                    )}
                  </div>
                  <div className='footer-section' />
                </div>
                <Row className='d-flex justify-content-between'>
                  {/* <div className='scroll-league' id='scroll-league' style={{ transform: `translateX(${scrollX}px)` }}> */}
                  <div className={classNames({ 'scroll-league-2': !openCollapse, 'scroll-league': openCollapse })}>
                    {
            modal?.map((item, index) => {
              return (
                <div className='mx-3' key={item?.id}>
                  <Teams
                    {...props}
                    ref={elementsRef?.current[index]}
                    index={index}
                    matchPlayerListDetails={matchPlayerListDetails}
                    role={role}
                    setModal={setModal}
                    allModal={modal}
                    handleModalChange={({ data, item }) => handleModalChange({ data, item })}
                    modal={item}
                    singlemodal={item}
                    playerRole={playerRole}
                    sportRule={sportRule}
                    handleScrollSecond={handleScrollSecond}
                    position={firstDivRef?.current?.scrollTop}
                    matchStatus={matchStatus}
                    setOpenPicker={setOpenPicker}
                    iTeamId={iTeamId}
                  />
                </div>
              )
            })
          }
                    <Modal className='saveallmodal' isOpen={openPicker}>
                      <ModalHeader toggle={onClose}>Team Save Status </ModalHeader>
                      <ModalBody>
                        <Row className='p-3'>
                          <Col md={12} xl={12}>
                            <div className='saved-team-label'>
                              <Label className='team-label' for='sports-select'>Saved Teams</Label>
                            </div>
                            {baseTeamResponse?.success?.length !== 0 && (
                            <div className='saved-team'>
                              <div className='d-flex' style={{ flexWrap: 'wrap' }}>
                                {
                                  Object.keys(successModalObj).map((key, value) => (
                                    <>
                                      <p className='mr-2'>
                                        {successModalObj[key].map((team, index) => (index + 1 === successModalObj[key].length) ? `${team?.teamName}` : `${team?.teamName}, `)}
                                      </p>
                                    </>
                                  ))}
                              </div>
                              <div>
                                <Badge className="saved-badge">
                                  Saved
                                </Badge>
                              </div>
                            </div>
                            )}

                            {(baseTeamResponse?.fail?.length !== 0) && (
                            <>
                              <div className='unsave-team-label'>
                                <Label className='team-label' for='sports-select'>Unsaved Teams</Label>
                              </div>
                              <div className='saved-team d-flex flex-column'>
                                {
                                    Object.keys(modalObj).map((key, value) => (
                                      <>
                                        <div className='d-flex w-100 justify-content-between ' key={value}>
                                          <div>
                                            <p key={value}>
                                              {modalObj[key].map((team, index) => (index + 1 === modalObj[key].length) ? `${team?.teamName}` : `${team?.teamName}, `)}
                                            </p>
                                            <h3 className='fail-msg'>{modalObj[key][0]?.reason}</h3>
                                          </div>
                                          <div>
                                            <Badge className={classNames({
                                              'fail-same': key === 'SAME-TEAM-NAME',
                                              'fail-dupli': key === 'DUPLICATE-TEAM',
                                              'fail-invalid': key === 'PLAYER-SELECTION-INVALID'
                                            })}
                                            >
                                              {key}
                                            </Badge>
                                          </div>
                                        </div>
                                      </>
                                    ))
                                  }
                              </div>
                            </>
                            )}
                          </Col>
                        </Row>
                      </ModalBody>
                    </Modal>
                  </div>
                </Row>

              </div>
            </>
            )}
    </>
  )
})

BaseTeam.propTypes = {
  id: PropTypes?.string,
  saveAllRef: PropTypes?.func,
  openPicker: PropTypes?.bool,
  onClose: PropTypes?.bool,
  setSaveAllDisabled: PropTypes?.func,
  setOpenPicker: PropTypes.func,
  openCollapse: PropTypes.bool,
  iTeamId: PropTypes.string

}

BaseTeam.displayName = BaseTeam
export default BaseTeam
