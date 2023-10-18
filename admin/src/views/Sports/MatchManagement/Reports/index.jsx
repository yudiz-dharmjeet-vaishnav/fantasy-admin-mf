import React, { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Layout from '../../../../components/Layout'
import ReportListData from './ReportList'
import SportsMainHeader from '../../SportsMainHeader'

function ReportListMain (props) {
  // const {
  //   match
  // } = props
  const { id } = useParams()
  const location = useLocation()
  const [matchId, setMatchId] = useState('')
  const SportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''

  useEffect(() => {
    if (id) {
      setMatchId(id)
    }
  }, [])

  return (
    <div>
      <Layout {...props} >
        <SportsMainHeader
          {...props}
          MatchPageLink={`/${SportsType}/match-management/view-match/${matchId}`}
          heading="Report List"
        />
        <div className='without-pagination'>
          <main className='main-content'>
            <section className='management-section common-box'>
              <ReportListData
                {...props}
                MatchPageLink={`/${SportsType}/match-management/view-match/${matchId}`}
              />
            </section>
          </main>
        </div>
      </Layout>
    </div>
  )
}

ReportListMain.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default ReportListMain
