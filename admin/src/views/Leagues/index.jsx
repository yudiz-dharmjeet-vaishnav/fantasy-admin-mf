import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Layout from '../../components/Layout'
import LeaguesList from './LeaguesList'
import LeagueHeader from './Header/LeagueHeader'
import MainLeagueHeader from './MainHeader/MainLeagueHeader'
import { getFilterCategory, getListOfCategory } from '../../actions/leaguecategory'
import { getLeagueList, getGameCategory, BlankMessage, updateNewLeague } from '../../actions/league'

function League (props) {
  const location = useLocation()
  const [searchField, setSearchField] = useQueryState('searchField', '')
  const [search, setSearch] = useQueryState('search', '')
  const [SportsType, setSportsType] = useQueryState('sportsType', 'CRICKET')
  const [LeagueCategory, setLeagueCategory] = useQueryState('leagueCategory', '')
  const [initialFlag, setinitialFlag] = useState(false)
  const token = useSelector(state => state.auth.token)
  const LeagueList = useSelector(state => state.league.LeagueList)
  const LeagueCategoryList = useSelector(state => state.leaguecategory.LeaguecategoryList)
  const GameCategoryList = useSelector(state => state.league.GamecategoryList)
  const FiltercategoryList = useSelector(state => state.leaguecategory.FiltercategoryList)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const dispatch = useDispatch()
  const content = useRef()

  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearch(obj.search)
    }
    if (obj.searchField) {
      setSearchField(obj.searchField)
    }
  }, [])

  function onExport () {
    content.current.onExport()
  }

  function onHandleSearch (value) {
    setSearch(value)
    setinitialFlag(true)
  }

  function onHandleSport (value) {
    setSportsType(value)
  }

  function getList (start, limit, sort, order, searchText, field, leagueCategory, sportsType) {
    const leagueListParams = {
      start, limit, sort, order, search: searchText.trim(), searchField: field, leagueCategory, sportsType, token
    }
    dispatch(getLeagueList(leagueListParams))
  }

  function BlankMessagefun () {
    dispatch(BlankMessage())
  }

  function getListOfCategoryFun () {
    dispatch(getListOfCategory(token))
  }

  function getGameCategoryFun () {
    dispatch(getGameCategory(token))
  }

  function getFilterCategoryFun () {
    dispatch(getFilterCategory(token))
  }

  function UpdateLeague (updateLeagueData, id) {
    dispatch(updateNewLeague(updateLeagueData, token, id))
  }

  function onHandleSearchBox (e) {
    setSearchField(e.target.value)
  }
  function onLeagueCategory (e) {
    setLeagueCategory(e.target.value)
  }

  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainLeagueHeader
              export ='Export'
              heading="Leagues"
              list={LeagueList}
              onExport={onExport}
              permission={(Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'R')}
            />
            <div className={LeagueList?.total === 0 ? 'without-pagination' : 'setting-component'}>
              <LeagueHeader
                GameCategoryList={GameCategoryList}
                LeagueCategory={LeagueCategory}
                SearchPlaceholder="Search league"
                addButton
                buttonText="Create League"
                handleSearch={onHandleSearch}
                handleSearchBox={onHandleSearchBox}
                handleSportType={onHandleSport}
                heading
                league
                list={LeagueList}
                onLeagueCategory={onLeagueCategory}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'R')}
                search={search}
                searchBox
                searchField={searchField}
                selectGame={SportsType}
                setUrl="/league/add-league"
              />
              <LeaguesList
                {...props}
                ref={content}
                FiltercategoryList={FiltercategoryList}
                LeagueCategoryList={LeagueCategoryList}
                LeaguePrizeLink="/league/league-Prize"
                List={LeagueList}
                UpdatedLeague={UpdateLeague}
                activeSports={GameCategoryList}
                blankMessage={BlankMessagefun}
                flag={initialFlag}
                getFilterCategory={getFilterCategoryFun}
                getGameCategory={getGameCategoryFun}
                getList={getList}
                getListOfCategory={getListOfCategoryFun}
                handleSearch={onHandleSearch}
                handleSearchBox={onHandleSearchBox}
                handleSportType={onHandleSport}
                search={search}
                searchField={searchField}
                selectGame={SportsType}
                updateLeague="/league/update-league"
              />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

League.propTypes = {
  location: PropTypes.object
}

export default League
