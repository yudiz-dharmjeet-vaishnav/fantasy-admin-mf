import React, { useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Layout from '../../../../components/Layout'
import SportsMainHeader from '../../SportsMainHeader'
// import Loading from '../../../../components/Loading'
import BaseTeam from './BaseTeam'

function IndexBaseTeam (props) {
  const { matchid, id } = useParams()
  const location = useLocation()
  const [openPicker, setOpenPicker] = useState(false)
  const [saveAllDisabled, setSaveAllDisabled] = useState('')

  const content = useRef()
  const sportsType = location?.pathname?.includes('cricket') ? 'cricket' : location?.pathname?.includes('football') ? 'football' : location?.pathname?.includes('basketball') ? 'basketball' : location?.pathname?.includes('kabaddi') ? 'kabaddi' : location?.pathname?.includes('hockey') ? 'hockey' : location?.pathname?.includes('csgo') ? 'csgo' : location?.pathname?.includes('dota2') ? 'dota2' : location?.pathname?.includes('lol') ? 'lol' : ''

  function saveAll () {
    setOpenPicker(true)
    content?.current?.submitAll()
  }

  function handleSaveAll (isOpen = true) {
    setOpenPicker(isOpen)
  }
  function onClose () {
    handleSaveAll(false)
  }

  return (
    <>
      <div>
        <Layout {...props}>
          {({ openCollapse }) => (
            <>
              <SportsMainHeader
                heading="Base Team"
                baseTeamButton
                BaseTeams
                cancelLink={`/${sportsType}/match-management/base-teams/${matchid}`}
                saveAll ={saveAll}
                setOpenPicker={setOpenPicker}
                saveAllDisabled={saveAllDisabled}
              />
              <div className='without-pagination'>
                <BaseTeam
                  {...props}
                  ref={content}
                  id={matchid}
                  iTeamId = {id}
                  openPicker={openPicker}
                  handleSaveAll={handleSaveAll}
                  onClose={onClose}
                  setSaveAllDisabled={setSaveAllDisabled}
                  setOpenPicker={setOpenPicker}
                  openCollapse={openCollapse}
                />
              </div>
            </>
          )}
        </Layout>
      </div>
    </>
  )
}
IndexBaseTeam.propTypes = {
  match: PropTypes?.object
}
export default IndexBaseTeam
