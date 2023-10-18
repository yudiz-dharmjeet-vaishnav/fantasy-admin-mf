import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import LeagueHeader from '../Header/LeagueHeader'
import FilterCategoryList from './FilterCategoryList'
import MainLeagueHeader from '../MainHeader/MainLeagueHeader'
import { getFilterCategoryList } from '../../../actions/leaguecategory'

function FilterCategoryManagement (props) {
  const location = useLocation()
  const [searchText, setSearchText] = useState('')
  const [SportsType, setSportsType] = useState('CRICKET')
  const [initialFlag, setinitialFlag] = useState(false)
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const FiltercategoriesList = useSelector(state => state.leaguecategory.FiltercategoriesList)
  const dispatch = useDispatch()

  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  // forhandle search operations
  function onHandleSearch (value) {
    setSearchText(value)
    setinitialFlag(true)
  }

  // forhandle sports change
  function onHandleSport (e) {
    setSportsType(e.target.value)
  }

  // forget list
  function getList (start, limit, sort, order, search) {
    dispatch(getFilterCategoryList(start, limit, sort, order, search.trim(), token))
  }

  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainLeagueHeader
              heading="Filter Categories"
              info
              permission={(Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'R')}
            />
            <div className={FiltercategoriesList?.total === 0 ? 'without-pagination' : 'setting-component'}>
              <LeagueHeader
                SearchPlaceholder="Search Filter Category"
                addButton
                buttonText="Create Filter Category"
                handleSearch={onHandleSearch}
                handleSportType={onHandleSport}
                league
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'R')}
                search={searchText}
                selectGame={SportsType}
                setUrl="/league/add-filter-category"
              />
              <FilterCategoryList
                {...props}
                List={FiltercategoriesList}
                flag={initialFlag}
                getList={getList}
                search={searchText}
                selectGame={SportsType}
                updateLeague="/league/filter-league-category"
              />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

FilterCategoryManagement.propTypes = {
  location: PropTypes.object
}

export default FilterCategoryManagement
