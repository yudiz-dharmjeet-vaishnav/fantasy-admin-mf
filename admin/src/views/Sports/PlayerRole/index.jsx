import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPlayerRoleList } from '../../../actions/playerRole'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import PlayerRoleList from './PlayerRole'
import Layout from '../../../components/Layout'
import SportsMainHeader from '../SportsMainHeader'

function IndexPlayerRole (props) {
  const location = useLocation()
  const token = useSelector(state => state.auth.token)
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('baseball') ? 'baseball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''
  const dispatch = useDispatch()

  function listOfPlayerRole () {
    dispatch(getPlayerRoleList(sportsType, token))
  }

  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <SportsMainHeader
              heading={`${sportsType.charAt(0).toUpperCase() + sportsType.slice(1)} Player Roles`}
            />
            <div className='without-pagination'>
              <PlayerRoleList
                {...props}
                EditPlayerRoleLink={`/${sportsType}/player-role-management/update-player-role`}
                getList={listOfPlayerRole}
                sportsType={sportsType}
              />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

IndexPlayerRole.propTypes = {
  location: PropTypes.object
}

export default IndexPlayerRole
