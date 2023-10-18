import React, { Fragment, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'

import SystemBotLogs from './SystemBotLogs'
import Layout from '../../../../components/Layout'
import SportsHeader from '../../SportsHeader'
import SportsMainHeader from '../../SportsMainHeader'

import { getMatchDetails } from '../../../../actions/match'
import { combinationBotLogs } from '../../../../actions/systemusers'
import { botLogsForMatchContest, getMatchLeagueDetails } from '../../../../actions/matchleague'

function SystemBotLogsPage (props) {
  const location = useLocation()
  const dispatch = useDispatch()
  const { id2, id, id1 } = useParams()
  const content = useRef()
  const token = useSelector(state => state.auth.token)
  const [matchLeagueName, setMatchLeagueName] = useState('')
  const [matchName, setMatchName] = useState('')
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)

  const MatchDetails = useSelector(state => state.match.matchDetails)
  const matchLeagueDetails = useSelector(state => state.matchleague.matchLeagueDetails)
  const systemBotDetails = useSelector(state => state.matchleague.systemBotDetails)
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''
  const isCopyBotLogs = location.pathname.includes('/copy-bot-logs')

  useEffect(() => {
    if (id) {
      dispatch(getMatchDetails(id, token))
    }
    if (id2) {
      getBotLogs(0, 10)
      dispatch(getMatchLeagueDetails(id2, token))
      setLoading(true)
    }
  }, [])

  function combinationBotLogsFunc () {
    setModalOpen(true)
    getCombinationBotLogs()
  }

  function getCombinationBotLogs () {
    dispatch(combinationBotLogs(id1, id2, token))
  }

  useEffect(() => {
    if (MatchDetails) {
      setMatchName(MatchDetails.sName)
    }
  }, [MatchDetails])

  useEffect(() => {
    if (matchLeagueDetails) {
      setMatchLeagueName(matchLeagueDetails.sName)
      setLoading(false)
    }
  }, [matchLeagueDetails])

  useEffect(() => {
    getBotLogs(0, 10)
  }, [isCopyBotLogs])

  function getBotLogs (start, limit) {
    const key = isCopyBotLogs ? 'CB' : ''
    dispatch(botLogsForMatchContest(start, limit, key, id2, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function heading () {
    const title = isCopyBotLogs ? 'Copy Bot Logs' : 'System Bot Logs'
    if (matchName && matchLeagueName) {
      if (window.innerWidth <= 480) {
        return (
          <div>
            {title}
            {' '}
            <p className='mb-0'>{`(${matchName})`}</p>
            {' '}
            <p className='mb-0'>{`(${matchLeagueName})`}</p>
          </div>
        )
      } else {
        return (
          <div>
            {title}
            {' '}
            {`(${matchName} - ${matchLeagueName})`}
          </div>
        )
      }
    } else {
      return <div>{title}</div>
    }
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <SportsMainHeader
              copyBotBackUrl={`/${sportsType}/match-management/match-league-management/system-bot-logs/${id1}/${id2}`}
              heading={heading()}
              isCopyBotLogs={isCopyBotLogs}
              matchLeaguePage={`/${sportsType}/match-management/match-league-management/${id1}`}
              onRefresh={onRefreshFun}
              refresh="Refresh  "
            />
            <div className={systemBotDetails?.aData?.length === 0 ? 'without-pagination' : 'setting-component'}>
              <SportsHeader
                combinationBotLogs
                combinationBotLogsFunc={combinationBotLogsFunc}
                copyBotBackUrl={`/${sportsType}/match-management/match-league-management/system-bot-logs/${id1}/${id2}`}
                copyBotLogs
                copyBotLogsUrl={`/${sportsType}/match-management/match-league-management/system-bot-logs/${id1}/${id2}/copy-bot-logs`}
                hidden
                isCopyBotLogs={isCopyBotLogs}
                matchManagement
                onRefresh={onRefreshFun}
                refresh
              />
              <SystemBotLogs
                {...props}
                ref={content}
                getBotLogs={getBotLogs}
                isCopyBotLogs={isCopyBotLogs}
                isModalOpen={isModalOpen}
                loading={loading}
                setLoading={setLoading}
                setModalOpen={setModalOpen}
                systemBotDetails={systemBotDetails}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

SystemBotLogsPage.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default SystemBotLogsPage
