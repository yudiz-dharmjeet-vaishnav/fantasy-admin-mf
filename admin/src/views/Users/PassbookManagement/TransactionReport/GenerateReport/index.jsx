import React from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import PropTypes from 'prop-types'

import GenerateReport from './GenerateReport'
import { getMatchLeagueList } from '../../../../../actions/matchleague'
import { generateTransactionReport } from '../../../../../actions/passbook'
import { getMatchesTotalCount, getMatchList } from '../../../../../actions/match'

function GenerateReportIndex (props) {
  const { token } = props
  const dispatch = useDispatch()

  function getMatchListFunc (start, limit, search, sportsType) {
    const matchListData = {
      start, limit, sort: 'dCreatedAt', order: 'desc', search, sportsType, filter: '', startDate: '', endDate: '', provider: '', season: '', format: '', token
    }
    dispatch(getMatchList(matchListData))
  }

  function getMatchesTotalCountFunc (search, sportsType) {
    const matchListData = {
      search, filter: '', startDate: '', endDate: '', sportsType: sportsType.toUpperCase(), provider: '', season: '', format: '', token
    }
    dispatch(getMatchesTotalCount(matchListData))
  }

  function getMatchLeagueListFunc (start, limit, searchType, search, matchId, sportsType) {
    const matchLeagueData = {
      start, limit, sort: '_id', order: 'desc', searchType, searchText: search, leagueType: '', isFullList: false, ID: matchId, sportsType, cancelFlag: '', bCMBList: false, eType: '', token
    }
    dispatch(getMatchLeagueList(matchLeagueData))
  }

  function generateTransactionReportFunc (startDate, endDate, eTransactionType, eType, eStatus, eCategory, iMatchId, iMatchLeagueId) {
    const StartDate = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const EndDate = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const data = {
      dDateFrom: StartDate ? new Date(StartDate).toISOString() : '', dDateTo: EndDate ? new Date(EndDate).toISOString() : '', eTransactionType, eType, eStatus, eCategory, iMatchId, iMatchLeagueId, token
    }
    dispatch(generateTransactionReport(data))
  }

  return (
    <GenerateReport
      {...props}
      generateTransactionReportFunc={generateTransactionReportFunc}
      getMatchLeagueListFunc={getMatchLeagueListFunc}
      getMatchListFunc={getMatchListFunc}
      getMatchesTotalCountFunc={getMatchesTotalCountFunc}
    />
  )
}

GenerateReportIndex.propTypes = {
  token: PropTypes.string
}

export default GenerateReportIndex
