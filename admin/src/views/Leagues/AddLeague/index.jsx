import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import AddLeague from './AddLeague'
import Header from './Header/Header'
import MainHeader from './Header/MainHeader'
import Layout from '../../../components/Layout'
import { addNewLeague, updateNewLeague, getLeagueDetails, getLeagueAnalytics } from '../../../actions/league'

function AddLeaguePage (props) {
  const { id } = useParams()
  const [LeagueId, setLeagueId] = useState('')
  const [isCreate, setIsCreate] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [updateDisableButton, setUpdateDisableButton] = useState('')
  const [leagueLoading, setLeagueLoading] = useState(false)
  const [leagueAnalyticsModalOpen, setLeagueAnalyticsModalOpen] = useState(false)
  const content = useRef()
  const toggleMessage = () => setModalOpen(!modalOpen)
  const toggleModal = () => {
    setLeagueAnalyticsModalOpen(!leagueAnalyticsModalOpen)
  }
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()
  const Auth = useSelector((state) => state.auth.adminData && state.auth.adminData.eType)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const adminPermission = useSelector((state) => state.auth.adminPermission)

  useEffect(() => {
    if (id) {
      setLeagueId(id)
      // dispatch action to get League Details
      dispatch(getLeagueDetails(id, token))
    }
  }, [])

  // fordispatch action to add league
  function AddNewLeague (addNewLeagueData) {
    dispatch(addNewLeague(addNewLeagueData, token))
  }

  // fordispatch action to update the league
  function UpdateLeague (updateLeagueData) {
    dispatch(updateNewLeague(updateLeagueData, token, id))
  }

  function openModalAnayltics (id) {
    setLeagueLoading(true)
    dispatch(getLeagueAnalytics(id, token))
    setLeagueAnalyticsModalOpen(true)
  }
  function onAdd () {
    content.current.onAdd()
  }

  function openModalFunc () {
    content.current.openModalFunc()
  }
  return (
    <div>
      <Layout {...props} >
        <MainHeader
          Auth={Auth}
          adminPermission={adminPermission}
          cancelLink="/league"
          isCreate={isCreate}
          onAdd={onAdd}
          page={page}
          setIsCreate={setIsCreate}
          updateDisableButton={updateDisableButton}
        />
        <div className='without-pagination'>
          <Header
            addLeaguepriceBreakup={`/league/league-Prize/${LeagueId}`}
            isCreate={isCreate}
            openModalAnayltics={openModalAnayltics}
            openModalFunc={openModalFunc}
            setIsCreate={setIsCreate}
          />
          <AddLeague
            {...props}
            ref={content}
            AddNewLeague={AddNewLeague}
            UpdateLeague={UpdateLeague}
            cancelLink="/league"
            isCreate={isCreate}
            leagueAnalyticsModalOpen={leagueAnalyticsModalOpen}
            leagueLoading={leagueLoading}
            modalOpen={modalOpen}
            priceBreakUpPage="/league/league-Prize"
            setIsCreate={setIsCreate}
            setLeagueAnalyticsModalOpen={setLeagueAnalyticsModalOpen}
            setLeagueLoading={setLeagueLoading}
            setModalOpen={setModalOpen}
            setUpdateDisableButton={setUpdateDisableButton}
            toggleMessage={toggleMessage}
            toggleModal={toggleModal}
          />
        </div>
      </Layout>
    </div>
  )
}

AddLeaguePage.propTypes = {
  match: PropTypes.object
}
export default AddLeaguePage
