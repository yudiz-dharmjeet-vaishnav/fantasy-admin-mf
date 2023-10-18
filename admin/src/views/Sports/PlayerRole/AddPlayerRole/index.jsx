import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearMsg, getPlayerRoleDetails, updatePlayerRole } from '../../../../actions/playerRole'
import { useLocation, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Layout from '../../../../components/Layout'
import AddPlayerRoleForm from './AddPlayerRole'
import SportsMainHeader from '../../SportsMainHeader'

function IndexAddPlayerRole (props) {
  const location = useLocation()
  const { id } = useParams()
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const token = useSelector(state => state.auth.token)
  const PlayerRoleDetails = useSelector(state => state.playerRole.playerRoleDetails)
  const dispatch = useDispatch()
  const content = useRef()
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('baseball') ? 'baseball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)

  useEffect(() => {
    playerRoleDetailsFunc()
  }, [])

  function playerRoleDetailsFunc () {
    dispatch(getPlayerRoleDetails(id, sportsType, token))
  }

  function UpdatePlayerRole (sFullName, nMax, nMin, nPosition) {
    dispatch(updatePlayerRole(sFullName, nMax, nMin, nPosition, id, sportsType, token))
  }

  function clearMsgFun () {
    dispatch(clearMsg())
  }

  function heading () {
    if (isCreate) {
      return 'Add Player Role'
    }
    return !isEdit ? 'Edit Player Role' : 'View Player Role Details'
  }
  function button () {
    if (isCreate) {
      return 'Create PlayerRole'
    }
    return !isEdit ? 'Save Changes' : 'Edit PlayerRole'
  }
  function onSubmit () {
    content.current.onSubmit()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <SportsMainHeader
            Auth={Auth}
            addPlayerRole
            button={button()}
            cancelLink={`/${sportsType}/player-role-management`}
            heading={heading()}
            onSubmit={onSubmit}
            submitDisableButton={submitDisableButton}
          />
          <div className='without-pagination'>
            <AddPlayerRoleForm
              {...props}
              ref={content}
              PlayerRoleDetails={PlayerRoleDetails}
              UpdatePlayerRole={UpdatePlayerRole}
              clearMsg={clearMsgFun}
              isCreate={isCreate}
              isEdit = {isEdit}
              playerRoleDetailsFunc={playerRoleDetailsFunc}
              setIsCreate={setIsCreate}
              setIsEdit={setIsEdit}
              setSubmitDisableButton={setSubmitDisableButton}
              sportsType={sportsType}
            />
          </div>
        </main>
      </Layout>
    </Fragment>
  )
}

IndexAddPlayerRole.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default IndexAddPlayerRole
