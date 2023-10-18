import React, { Fragment } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import ExtraWinList from './ExtraWinList'
import Layout from '../../../../components/Layout'
import SportsMainHeader from '../../SportsMainHeader'
import { getExtraWinList } from '../../../../actions/match'

function IndexExtraWinList (props) {
  // const {
  //   match
  // } = props
  const { id } = useParams()
  const location = useLocation()
  const dispatch = useDispatch()

  const extraWinListData = useSelector(state => state.match.extraWinListData)
  const token = useSelector(state => state.auth.token)
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''
  function getExtraWinListFunc (start, limit) {
    dispatch(getExtraWinList(id, start, limit, token))
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <SportsMainHeader
              heading="Extra Win List"
              hidden
              matchLeaguePage={`/${sportsType}/match-management/match-league-management/${id}`}
            />
            <div className={extraWinListData?.nTotal === 0 ? 'without-pagination' : 'setting-component'}>
              <ExtraWinList
                {...props}
                getExtraWinListFunc={getExtraWinListFunc}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

IndexExtraWinList.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default IndexExtraWinList
