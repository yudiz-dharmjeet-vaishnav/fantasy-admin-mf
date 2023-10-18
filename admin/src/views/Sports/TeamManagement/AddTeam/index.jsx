
import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import AddTeam from './AddTeam'
import Layout from '../../../../components/Layout'
import SportsMainHeader from '../../SportsMainHeader'
import { addTeam, getTeamDetails, updateTeam } from '../../../../actions/team'

function IndexAddTeam (props) {
  const { id } = useParams()
  const location = useLocation()
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [Name, setName] = useState('')
  const [ShortName, setShortName] = useState('')
  const [Key, setKey] = useState('')
  const [updateDisableButton, setUpdateDisableButton] = useState('')
  const token = useSelector(state => state.auth.token)
  const TeamDetails = useSelector(state => state.team.teamDetails)
  const dispatch = useDispatch()
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const content = useRef()
  function AddNewTeam (sKey, sName, sImage, sShortName, teamStatus) {
    const addTeamData = {
      sKey, sName, sImage, sShortName, sportsType, teamStatus, token
    }
    dispatch(addTeam(addTeamData))
  }

  function UpdateTeam (Id, sKey, sName, sImage, sShortName, teamStatus) {
    const updateTeamData = {
      Id, sportsType, sKey, sName, sImage, sShortName, teamStatus, token
    }
    dispatch(updateTeam(updateTeamData))
  }

  useEffect(() => {
    if (id) {
      dispatch(getTeamDetails(id, token))
    }
  }, [])

  function heading () {
    if (isCreate) {
      return 'Add Team'
    }
    return !isEdit ? 'Edit Team' : 'Team Details'
  }
  function button () {
    if (isCreate) {
      return 'Add Team'
    }
    return !isEdit ? 'Save Changes' : 'Edit Team'
  }
  function Submit () {
    content.current.Submit()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <SportsMainHeader
          Auth={Auth}
          Key={Key}
          Name={Name}
          ShortName={ShortName}
          Submit={Submit}
          adminPermission={adminPermission}
          button ={button()}
          cancelLink={`/${sportsType}/team-management`}
          heading={heading()}
          teamPlayer
          updateDisableButton={updateDisableButton}
        />
        <div className='without-pagination'>
          <AddTeam
            {...props}
            ref={content}
            AddNewTeam={AddNewTeam}
            Auth={Auth}
            Key={Key}
            Name={Name}
            ShortName={ShortName}
            TeamDetails={TeamDetails}
            UpdateTeam={UpdateTeam}
            adminPermission={adminPermission}
            cancelLink={`/${sportsType}/team-management`}
            isCreate={isCreate}
            isEdit={isEdit}
            setIsCreate={setIsCreate}
            setIsEdit={setIsEdit}
            setKey={setKey}
            setName={setName}
            setShortName={setShortName}
            setUpdateDisableButton={setUpdateDisableButton}
          />
        </div>
      </Layout>
    </Fragment>
  )
}

IndexAddTeam.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default IndexAddTeam
