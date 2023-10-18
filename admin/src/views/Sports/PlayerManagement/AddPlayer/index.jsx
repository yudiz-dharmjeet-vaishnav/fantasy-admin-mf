import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import AddPlayer from './AddPlayer'
import Layout from '../../../../components/Layout'
import SportsMainHeader from '../../SportsMainHeader'
import { getPlayerRoleList } from '../../../../actions/playerRole'
import { addPlayer, getPlayerDetails, updatePlayer } from '../../../../actions/player'

function IndexAddPlayer (props) {
  const location = useLocation()
  const { id } = useParams()
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const token = useSelector(state => state.auth.token)
  const playerDetails = useSelector(state => state.player.playerDetails)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const playerRoleList = useSelector(state => state.playerRole.playerRoleList)
  const dispatch = useDispatch()
  const content = useRef()
  const SportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('baseball') ? 'baseball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : ''

  function AddNewPlayer (sKey, sName, sImage, nFantasyCredit, eRole) {
    const addPlayerData = {
      sKey, sName, sImage, nFantasyCredit, eRole, sportsType: SportsType, token
    }
    dispatch(addPlayer(addPlayerData))
  }

  function UpdatePlayer (Id, sKey, sName, sImage, nFantasyCredit, eRole) {
    const updatePlayerData = {
      Id, sKey, sName, sImage, nFantasyCredit, eRole, sportsType: SportsType, token
    }
    dispatch(updatePlayer(updatePlayerData))
  }

  useEffect(() => {
    if (id) {
      dispatch(getPlayerDetails(id, token))
    }
    if ((Auth === 'SUPER') || (adminPermission?.ROLES !== 'N')) {
      dispatch(getPlayerRoleList(SportsType, token))
    }
  }, [SportsType])

  function heading () {
    if (isCreate) {
      return 'Add Player'
    }
    return !isEdit ? 'Edit Player' : 'Player Details'
  }

  function Submit () {
    content.current.Submit()
  }
  function button () {
    if (isCreate) {
      return 'Add Player'
    }
    return !isEdit ? 'Save Changes' : 'Edit Player'
  }
  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <SportsMainHeader
            Submit={Submit}
            addPlayer
            button={button()}
            cancelLink={`/${SportsType}/player-management`}
            heading={heading()}
            submitDisableButton={submitDisableButton}
          />
          <div className='without-pagination'>
            <AddPlayer
              {...props}
              ref={content}
              AddNewPlayer={AddNewPlayer}
              PlayerDetails={playerDetails}
              UpdatePlayer={UpdatePlayer}
              cancelLink={`/${SportsType}/player-management`}
              gameCategory={SportsType}
              isCreate={isCreate}
              isEdit={isEdit}
              playerRoleList={playerRoleList}
              setIsCreate={setIsCreate}
              setIsEdit={setIsEdit}
              setSubmitDisableButton={setSubmitDisableButton}
            />
          </div>
        </main>
      </Layout>
    </Fragment>
  )
}

IndexAddPlayer.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default IndexAddPlayer
