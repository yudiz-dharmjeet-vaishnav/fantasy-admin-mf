import React, { useState, useEffect } from 'react'
import { useQueryState } from 'react-router-use-location-state'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import qs from 'query-string'
import PropTypes from 'prop-types'

import PlayerList from './PlayerList'
import SportsHeader from '../SportsHeader'
import Layout from '../../../components/Layout'
import SportsMainHeader from '../SportsMainHeader'
import { getPlayersList, getPlayersTotalCount } from '../../../actions/player'

function IndexPlayerManagement (props) {
  const location = useLocation()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [provider, setProvider] = useQueryState('provider', '')
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const playerList = useSelector(state => state.player.playersList)
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('baseball') ? 'baseball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''
  const dispatch = useDispatch()

  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setinitialFlag(true)
  }

  function getPlayersTotalCountFunc (search, provider) {
    const data = {
      searchText: search, provider, sportsType, token
    }
    // dispatch action to plyersTotalCount
    dispatch(getPlayersTotalCount(data))
  }

  // dispatch action to get total count of players
  function getList (start, limit, sort, order, search, provider) {
    const getPlayerList = {
      start, limit, sort, order, searchText: search.trim(), provider, sportsType, token
    }
    dispatch(getPlayersList(getPlayerList))
  }

  function onFiltering (event) {
    setProvider(event.target.value)
  }
  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <SportsMainHeader
              heading={`${sportsType.charAt(0).toUpperCase() + sportsType.slice(1)} Player Management`}
            />
            <div className={playerList?.results?.length === 0 ? 'without-pagination' : 'setting-component'}>
              <SportsHeader
                SearchPlaceholder="Search player"
                buttonText="Add Player"
                extButton
                handleSearch={onHandleSearch}
                heading
                matchManagement
                onFiltering={onFiltering}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.PLAYER !== 'R')}
                playerManagement
                provider={provider}
                search={searchText}
                setProvider={setProvider}
                setUrl={`/${sportsType}/player-management/add-player`}
              />
              <PlayerList
                {...props}
                EditPlayerLink={`/${sportsType}/player-management/update-player`}
                flag={initialFlag}
                getList={getList}
                getPlayersTotalCountFunc={getPlayersTotalCountFunc}
                onFiltering={onFiltering}
                provider={provider}
                search={searchText}
                setProvider={setProvider}
                sportsType={sportsType}
              />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

IndexPlayerManagement.propTypes = {
  location: PropTypes.object
}

export default IndexPlayerManagement
