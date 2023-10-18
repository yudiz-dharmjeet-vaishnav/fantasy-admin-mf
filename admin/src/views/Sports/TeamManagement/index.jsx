import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import PropTypes from 'prop-types'

import TeamList from './TeamList'
import SportsHeader from '../SportsHeader'
import Layout from '../../../components/Layout'
import { getTeamList, getTeamsTotalCount } from '../../../actions/team'

import SportsMainHeader from '../SportsMainHeader'
function IndexTeamManagement (props) {
  const location = useLocation()
  const [SearchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [provider, setProvider] = useQueryState('provider', '')
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const dispatch = useDispatch()
  const teamList = useSelector(state => state.team.teamList)
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('baseball') ? 'baseball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''

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

  function getTeamsTotalCountFunc (searchText, provider) {
    const data = {
      searchText, provider, sportsType, token
    }
    // dispatch action to TeamsTotalCount
    dispatch(getTeamsTotalCount(data))
  }

  function getList (start, limit, sort, order, searchText, provider) {
    const teamListData = {
      start, limit, sort, order, searchText: searchText.trim(), provider, sportsType, token
    }
    // dispatch action to Team List
    dispatch(getTeamList(teamListData))
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
              heading={`${sportsType.charAt(0).toUpperCase() + sportsType.slice(1)} Team Management`}
            />
            <div className={teamList?.results?.length === 0 ? 'without-pagination' : 'setting-component'}>
              <SportsHeader
                SearchPlaceholder="Search Team"
                TeamManagement
                buttonText="Add Team"
                extButton
                handleSearch={onHandleSearch}
                heading
                matchManagement
                onFiltering={onFiltering}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.TEAM !== 'R')}
                provider={provider}
                search={SearchText}
                setProvider={setProvider}
                setUrl={`/${sportsType}/team-management/add-team`}
              />
              <TeamList
                {...props}
                EditPlayerLink={`/${sportsType}/team-management/update-team`}
                flag={initialFlag}
                getList={getList}
                getTeamsTotalCountFunc={getTeamsTotalCountFunc}
                onFiltering={onFiltering}
                provider={provider}
                search={SearchText}
                setProvider={setProvider}
                sportsType={sportsType}
                token={token}
              />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

IndexTeamManagement.propTypes = {
  location: PropTypes.object
}

export default IndexTeamManagement
