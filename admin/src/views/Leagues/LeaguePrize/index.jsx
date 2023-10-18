import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import LeagueHeader from '../Header/LeagueHeader'
import LeaguePrizeListComponent from './LeaguePrizeList'
import MainLeagueHeader from '../MainHeader/MainLeagueHeader'
import { getLeagueDetails, getLeaguePrizeList, getLeagueAnalytics } from '../../../actions/league'

function LeaguePrize (props) {
  const { id } = useParams()
  const [leagueId, setleagueId] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [showInputFields, setShowInputFields] = useState(false)
  const [leagueLoading, setLeagueLoading] = useState(false)
  const [leaguePrizeBreakupModal, setLeaguePrizeBreakupModal] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const toggleMessage = () => setModalOpen(!modalOpen)
  const toggleModal = () => {
    setLeaguePrizeBreakupModal(!leaguePrizeBreakupModal)
    setIsEdit(false)
  }

  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const LeaguePrizeList = useSelector(state => state.league.LeaguePrizeList)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const dispatch = useDispatch()

  function getList (LeagueID) {
    dispatch(getLeaguePrizeList(LeagueID, token))
  }

  useEffect(() => {
    if (id) {
      setleagueId(id)
      getLeagueDetailsFunc()
    }
  }, [])

  function addPrizeBreakup () {
    setShowInputFields(!showInputFields)
  }

  function getLeagueDetailsFunc () {
    dispatch(getLeagueDetails(id, token))
  }

  function openModalAnayltics (id) {
    setLeagueLoading(true)
    dispatch(getLeagueAnalytics(id, token))
    setLeaguePrizeBreakupModal(true)
  }

  function openModalPrizeBreakUp () {
    setLeaguePrizeBreakupModal(true)
  }
  return (
    <div>
      <Layout {...props} >

        <main className="main-content">
          <section className="management-section common-box">
            <MainLeagueHeader
              {...props}
              LeagueDetailsLink={`/league/update-league/${leagueId}`}
              heading="League Prize Breakups"
              seriesLeaderBoard
              setUrl={`/league/add-League-Price-Breakup/${leagueId}`}
            />
            <div className='without-pagination'>
              <LeagueHeader
                SearchPlaceholder="Search league Prize"
                addPrizeBreakup={addPrizeBreakup}
                buttonText="Add League Prize BreakUp"
                hidden
                league
                openModalAnayltics={openModalAnayltics}
                openModalPrizeBreakUp={openModalPrizeBreakUp}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'R')}
                seriesLeaderBoard
              />
              <LeaguePrizeListComponent
                {...props}
                List={LeaguePrizeList}
                getList={getList}
                isEdit={isEdit}
                leagueLoading={leagueLoading}
                leaguePrizeBreakupModal={leaguePrizeBreakupModal}
                openModalAnayltics={openModalAnayltics}
                setIsEdit={setIsEdit}
                setLeagueLoading={setLeagueLoading}
                setLeaguePrizeBreakupModal={setLeaguePrizeBreakupModal}
                showInputFields={showInputFields}
                toggleMessage={toggleMessage}
                toggleModal={toggleModal}
              />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

LeaguePrize.propTypes = {
  match: PropTypes.object
}

export default LeaguePrize
