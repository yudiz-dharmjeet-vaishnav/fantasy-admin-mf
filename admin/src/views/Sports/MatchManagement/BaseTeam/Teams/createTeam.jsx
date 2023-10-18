import React, { forwardRef, useEffect, useState } from 'react'
import { Button, Input, Label, Row, UncontrolledTooltip } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types'

import plusIcon from '../../../../../assets/images/plus.svg'
import minusIcon from '../../../../../assets/images/minus.svg'

import { defaultPlayerRoleImages } from '../../../../../helpers/helper'
import { getUrl } from '../../../../../actions/url'
import { createBaseTeam, deleteBaseTeam, getMatchPlayerListDetails } from '../../../../../actions/matchplayer'
import { getMatchDetails } from '../../../../../actions/match'
import RequiredField from '../../../../../components/RequiredField'
import classNames from 'classnames'

const Teams = forwardRef(function (props, ref) {
  const { id, index, role, modal, setModal, allModal, handleModalChange, playerRole, sportRule, matchStatus, setOpenPicker, iTeamId } = props
  const dispatch = useDispatch()
  const { sportstype } = useParams()

  const [teamName, setTeamName] = useState('')
  const [creditLeft, setCreditLeft] = useState(100)
  const [homeTeam, setHomeTeam] = useState(0)
  const [awayTeam, setAwayTeam] = useState(0)
  const [teamNameError, setTeamNameError] = useState('')

  const token = useSelector(state => state?.auth?.token)
  const matchDetails = useSelector(state => state?.match?.matchDetails)

  const submitDisabled = modal?.selectedPlayerArray?.length !== sportRule?.nTotalPlayers || (matchStatus === 'L' || matchStatus === 'I')
  const btnDisabled = matchStatus === 'L' || matchStatus === 'I'

  // function to generate and  represent progress bar
  function generateProgressBar (count) {
    const emptyArray = Array(count)?.fill('')
    return emptyArray
  }
  const array = generateProgressBar(sportRule?.nTotalPlayers)

  useEffect(() => {
    if (id) {
      // dispatch(getBaseTeamList(id, token))
    }
    dispatch(getUrl('media'))
  }, [])

  useEffect(() => {
    if (!teamName) {
      setTeamNameError('Please enter teamname')
    } else {
      setTeamNameError('')
    }
  }, [teamName])

  useEffect(() => {
    if (modal?.creditLeft) { setCreditLeft(modal?.creditLeft) }
    if (modal?.homeTeam) { setHomeTeam(modal?.homeTeam) }
    if (modal?.awayTeam) { setAwayTeam(modal?.awayTeam) }
    if (modal?.teamName) { setTeamName(modal?.teamName) }
  }, [modal, allModal])

  useEffect(() => {
  }, [homeTeam, awayTeam])

  // Function to handle adding/removing a player
  function handleClick (data, index, isAdded) {
    setCreditLeft(isAdded ? modal?.creditLeft + data?.nFantasyCredit : modal?.creditLeft - data?.nFantasyCredit)

    if (matchDetails?.oHomeTeam?.sShortName === data?.oTeam?.sShortName) {
      setHomeTeam(isAdded ? modal?.homeTeam - 1 : modal?.homeTeam + 1)
    }
    if (matchDetails?.oAwayTeam?.sShortName === data?.oTeam?.sShortName) {
      setAwayTeam(isAdded ? modal?.awayTeam - 1 : modal?.awayTeam + 1)
    }

    // Function to check player limits
    function checkPlayers ({ data, role, limit, playerData }) {
      const newData = {
        [role]: [],
        All: []
      }
      const aPlayer = { ...data?.aPlayer }
      const isDisable = aPlayer[role]?.filter(p => p?.isAdded)?.length >= limit
      // Common function to update player
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
      // Update data for all roles
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
          } else if (matchDetails.oAwayTeam?.iTeamId === player.oTeam.iTeamId) {
            player.isLimitExceed = !player?.isAdded && data?.awayTeam >= sportRule?.nMaxPlayerOneTeam
          }
          return player
        })
      }
      return newData
    }

    // update 'myTeam' with new player
    const myTeam = {
      ...modal,
      teamName: teamName,
      creditLeft: isAdded ? modal?.creditLeft + data?.nFantasyCredit : modal?.creditLeft - data?.nFantasyCredit,
      homeTeam: matchDetails?.oHomeTeam?.sShortName === data?.oTeam?.sShortName ? (isAdded ? modal?.homeTeam - 1 : modal?.homeTeam + 1) : modal?.homeTeam,
      awayTeam: matchDetails?.oAwayTeam?.sShortName === data?.oTeam?.sShortName ? (isAdded ? modal?.awayTeam - 1 : modal?.awayTeam + 1) : modal?.awayTeam,
      aPlayer: {
        ...modal?.aPlayer,
        // Update specific player role array with added/removed player
        [data?.eRole]: modal?.aPlayer[data?.eRole]?.map((player, i) => {
          if (data?._id === player?._id) {
            return {
              ...player,
              isAdded: !isAdded
            }
          } else {
            return player
          }
        }),
        // Update 'All' player role array with added/removed player
        All: modal?.aPlayer?.All?.map((player, i) => {
          if (data?._id === player?._id) {
            return {
              ...player,
              isAdded: !isAdded
            }
          } else {
            return player
          }
        })
      }
    }
    // Update the selectedPlayerArray based on whether the player is being added or removed
    if (isAdded) {
      myTeam.selectedPlayerArray = myTeam?.selectedPlayerArray?.filter(p => p?._id !== data?._id)
    } else {
      myTeam?.selectedPlayerArray?.push({ ...data, isAdded: true })
    }
    // Check and update player using the 'checkPlayers' function
    const finalData = checkPlayers({ data: myTeam, role: data.eRole, limit: playerRole[data.eRole]?.nMax, playerData: data })
    // Update player in 'myTeam' for each role based on 'finalData'
    for (const key in finalData) {
      myTeam.aPlayer[key] = finalData[key]
    }

    // Update the 'teams' array by replacing the modified 'myTeam'
    const teams = allModal?.map((item) => {
      if (item?.id === myTeam?.id) {
        return myTeam
      } else {
        return item
      }
    })
    // Call the 'handleModalChange' function to update the modal data
    handleModalChange({ data: teams })
  }

  const handleChange = (e) => {
    setTeamName(e?.target?.value)
    const updatedModal = allModal.map((team) => {
      if (team.id === modal.id) {
        return {
          ...team,
          teamName: e?.target?.value
        }
      } else return team
    })
    setModal(updatedModal)
  }

  // Function to handle the submission of the selected team
  function submit () {
    const add = modal?.selectedPlayerArray?.map((data) => data?._id)

    const teams = []
    const data = {
      aPlayers: add,
      sName: teamName,
      iTeamId: modal?.id
    }
    const data2 = {
      aPlayers: add,
      sName: teamName
    }
    if (modal?.editTeam) {
      teams?.push(data)
      setOpenPicker(true)
    } else {
      if (!data2?.sName) {
        setTeamNameError('Please enter team name!')
      } else {
        teams?.push(data2)
        setOpenPicker(true)
      }
    }

    const sendData = {
      teams,
      iMatchId: id,
      token
    }

    dispatch(getMatchDetails(id, token))
    dispatch(getMatchPlayerListDetails(id, token))
    dispatch(createBaseTeam(sendData))

    // if (modal?.editTeam) {
    //   location?.reload()
    // }
  }
  // Function to handle copying a team
  function handleCopyClick () {
    try {
      const copiedTeam = { ...modal }
      copiedTeam.id = uuidv4()
      copiedTeam.editTeam = false
      const updatedAllModal = [...allModal, copiedTeam]
      setModal(updatedAllModal)
    } catch (error) {
      console.log(error)
    }
  }
  // Function to handle the delete/discard a team
  function handleDiscardClick () {
    dispatch(deleteBaseTeam(modal?.id, token))
    dispatch(getMatchPlayerListDetails(id, token))
    const myTeams = []
    allModal?.forEach(item => {
      if (item?.id !== modal?.id) {
        myTeams?.push(item)
      }
    })
    // Call the function to update the modal data with the remaining teams
    handleModalChange({ data: myTeams })
    // window.location.reload()
  }

  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    ref && (ref.current.scrollTop = props?.position)
  }, [ref])

  return (
    <>
      <div className='teams-main-div'>
        <div className='teams-list-head'>
          <div className='teams-fill-player'>
            {
              array?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className={index < modal.selectedPlayerArray.length ? 'selected-fill-player ' : 'team-fill'}>{item}</td>
                  </tr>
                )
              })
            }
          </div>
          <div className='teams-input'>
            <Label for="title" className='title mb-1'>
              Team
              {' '}
              { index + 1 }
              {' '}
              Name
              {' '}
              <RequiredField/>
            </Label>
            <Input name="name" placeholder={`Enter Team ${index + 1} Name`} className={teamNameError ? 'league-placeholder-error' : 'title-input'} value={teamName} type='text' onChange={(e) => handleChange(e)}/>
          </div>
          <div>
            <Row className='team-credits'>
              <h4 className='mb-0'> Credits Left</h4>
              <h4 className='mb-0'>
                {' '}
                {creditLeft}
              </h4>
            </Row>
          </div>
          <div className='p-2'>
            <Row className='teams-player'>
              <h4 className='mb-0'>
                {matchDetails?.oHomeTeam?.sShortName}
                {' '}
                <strong>{homeTeam}</strong>
              </h4>
              <h4 className='mb-0 text-right'>
                <strong>{awayTeam}</strong>
                {' '}
                {matchDetails?.oAwayTeam?.sShortName}
              </h4>
            </Row>
          </div>
        </div>

        <div className={classNames('scrolling', { 'scrolling-height': !iTeamId, 'scrolling-height-without-createbtn': iTeamId })} onScroll={props.handleScrollSecond} ref={ref} >
          {
        modal?.aPlayer[role]?.map((data, index) => (
          <div className='teams-player-listing' key={data._id}>
            <div className='players-wrap'>
              <div className='player-img'>{data?.isAdded && <img src={data?.isAdded && defaultPlayerRoleImages(sportstype, data?.eRole) } />}</div>
              <div className='player-name'>
                <h4>
                  {' '}
                  {data?.isAdded === true ? data?.sName : ''}
                </h4>
              </div>
              <div className='add-btn-div'>
                <Button
                  id={(data?.isDisable || data?.isLimitExceed || data?.isElevenPlayer) ? 'btn' + index : ''}
                  className={data?.isAdded ? 'remove-btn' : (data.isDisable || data?.isLimitExceed || data?.isElevenPlayer) ? 'disabled-btn' : 'add-btn'}
                  disabled={data?.isDisable || data?.isLimitExceed || data?.isElevenPlayer}
                  onClick={() => handleClick(data, index, data?.isAdded)}
                >
                  <span>
                    {' '}
                    <img src={data?.isAdded ? minusIcon : plusIcon} />
                  </span>
                </Button>
                {(data?.isLimitExceed) && (
                <UncontrolledTooltip className="bg-default-disbaled" delay={0} placement="bottom" target={'btn' + index} >
                  <p className='mb-1'> You have selected maximum player form one Team </p>
                </UncontrolledTooltip>
                )}
                {(data?.isDisable || data?.isElevenPlayer) && (
                <UncontrolledTooltip className="bg-default-disbaled" delay={0} placement="bottom" target={'btn' + index} >
                  <p className='mb-1'>Maximum number of players are selected</p>
                </UncontrolledTooltip>
                )}
              </div>
            </div>
          </div>
        )
        )
        }

        </div>
        <div className='footer-section'>
          <Button className='theme-btn-league'
            onClick={() => submit()}
            disabled={submitDisabled}
          >
            {modal?.editTeam ? 'Edit' : 'Save'}
          </Button>
          <Button className='theme-btn-cancel' disabled={btnDisabled} onClick={() => handleCopyClick() }>Copy</Button>
          <Button className='theme-btn-discard' disabled={btnDisabled} onClick={() => handleDiscardClick()}>Discard</Button>
        </div>
      </div>

    </>
  )
})

Teams.propTypes = {
  match: PropTypes.object,
  index: PropTypes.number,
  playerDetails: PropTypes.array,
  role: PropTypes.string,
  modal: PropTypes.array,
  setModal: PropTypes.func,
  singlemodal: PropTypes.object,
  id: PropTypes.string,
  sportstype: PropTypes.string,
  allModal: PropTypes.array,
  creditLeft: PropTypes.number,
  setCreditLeft: PropTypes.func,
  handleModalChange: PropTypes.func,
  playerRole: PropTypes.object,
  sportRule: PropTypes.object,
  handleScrollSecond: PropTypes.func,
  matchStatus: PropTypes.string,
  setOpenPicker: PropTypes.func,
  iTeamId: PropTypes.string

}

Teams.displayName = Teams

export default Teams
