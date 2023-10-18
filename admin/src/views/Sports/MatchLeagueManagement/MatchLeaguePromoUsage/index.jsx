import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import qs from 'query-string'
import PropTypes from 'prop-types'

import SportsHeader from '../../SportsHeader'
import Layout from '../../../../components/Layout'
import SportsMainHeader from '../../SportsMainHeader'
import MatchLeaguePromoUsage from './MatchLeaguePromoUsage'

import { getMatchDetails } from '../../../../actions/match'
import { getMatchLeagueDetails, getPromoCodeUsageList } from '../../../../actions/matchleague'

const PromoUsage = props => {
  const { id1, id2 } = useParams()
  const location = useLocation()
  const content = useRef()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setInitialFlag] = useState(false)
  const [matchName, setMatchName] = useState('')
  const [matchLeagueName, setMatchLeagueName] = useState('')
  const token = useSelector(state => state.auth.token)
  const promoUsageList = useSelector(state => state.matchleague.promoUsageList)
  const matchDetails = useSelector(state => state.match.matchDetails)
  const matchLeagueDetails = useSelector(state => state.matchleague.matchLeagueDetails)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''
  const dispatch = useDispatch()

  useEffect(() => {
    if (id1) {
      dispatch(getMatchDetails(id1, token))
    }
    if (id2) {
      dispatch(getMatchLeagueDetails(id2, token))
    }
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  useEffect(() => {
    if (matchDetails) {
      setMatchName(matchDetails.sName)
    }
  }, [matchDetails])

  useEffect(() => {
    if (matchLeagueDetails) {
      setMatchLeagueName(matchLeagueDetails.sName)
    }
  }, [matchLeagueDetails])

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setInitialFlag(true)
  }

  function getList (start, limit, search) {
    dispatch(getPromoCodeUsageList(start, limit, search, id2, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function onExport () {
    content.current.onExport()
  }

  function heading () {
    if (matchName && matchLeagueName) {
      if (window.innerWidth <= 480) {
        return (
          <div>
            Promo Code Usage List
            {' '}
            <p className='mb-0'>{`(${matchName})`}</p>
            {' '}
            <p className='mb-0'>{`(${matchLeagueName})`}</p>
          </div>
        )
      } else {
        return (
          <div>
            Promo Code Usage List
            {' '}
            {`(${matchName} - ${matchLeagueName})`}
          </div>
        )
      }
    } else {
      return 'Promo Code Usage List'
    }
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <SportsMainHeader
              goBack={props?.location?.state?.goBack}
              heading={heading()}
              matchLeaguePage={`/${sportsType}/match-management/match-league-management/${id1}`}
              onExport={onExport}
              onRefresh={onRefreshFun}
              permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'R')}
              refresh="Refresh"
            />
            <div className='without-pagination'>
              <SportsHeader
                SearchPlaceholder="Search"
                buttonText="Promo Usage List"
                handleSearch={onHandleSearch}
                matchManagement
                promoUsageList={promoUsageList}
                search={searchText}
              />
              <MatchLeaguePromoUsage
                {...props}
                ref={content}
                List={promoUsageList}
                flag={initialFlag}
                getList={getList}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'R')}
                searchText={searchText}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

PromoUsage.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default PromoUsage
