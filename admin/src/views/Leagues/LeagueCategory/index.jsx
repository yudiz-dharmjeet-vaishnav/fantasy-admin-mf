import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import LeaguesCategoryList from './LeagueCategoryList'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import LeagueHeader from '../Header/LeagueHeader'
import MainLeagueHeader from '../MainHeader/MainLeagueHeader'
import { getLeagueCategoryList } from '../../../actions/leaguecategory'

function LeagueCategoryManagement (props) {
  const location = useLocation()
  const [searchText, setSearchText] = useState('')
  const [SportsType, setSportsType] = useState('CRICKET')
  const [initialFlag, setinitialFlag] = useState(false)
  const token = useSelector(state => state.auth.token)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const LeagueCategoryList = useSelector(state => state.leaguecategory.LeaguecategoriesList)
  const dispatch = useDispatch()
  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  function onHandleSearch (value) {
    setSearchText(value)
    setinitialFlag(true)
  }

  function onHandleSport (e) {
    setSportsType(e.target.value)
  }

  function getList (start, limit, sort, order, search) {
    dispatch(getLeagueCategoryList(start, limit, sort, order, search.trim(), token))
  }

  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainLeagueHeader
              heading='League Categories'
              info
              permission={(Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'R')}
            />
            <div className={LeagueCategoryList?.total === 0 ? 'without-pagination' : 'setting-component'}>
              <LeagueHeader
                SearchPlaceholder="Search league Category"
                addButton
                buttonText="Create League Category"
                handleSearch={onHandleSearch}
                handleSportType={onHandleSport}
                league
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'R')}
                search={searchText}
                selectGame={SportsType}
                setUrl="/league/add-league-category"
              />
              <LeaguesCategoryList
                {...props}
                List={LeagueCategoryList}
                flag={initialFlag}
                getList={getList}
                search={searchText}
                selectGame={SportsType}
                updateLeague="/league/update-league-category"
              />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

LeagueCategoryManagement.propTypes = {
  location: PropTypes.object
}
export default LeagueCategoryManagement
