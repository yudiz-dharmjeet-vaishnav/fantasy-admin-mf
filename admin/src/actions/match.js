import axios from '../axios'
import { ADD_MATCH, CLEAR_MATCH_MESSAGE, FETCH_MATCH, GENERATE_PDF, LOAD_LIVE_LEADER_BOARD, MATCHES_TOTAL_COUNT, MATCH_DETAILS, MATCH_LIST, MATCH_DATA_REFRESH, MERGE_MATCH, POST_PREVIEW, PRIZE_DISTRIBUTION, UPCOMING_MATCH_LIST, UPDATE_MATCH, WIN_PRIZE_MATCH_DISTRIBUTION, SCORE_CARD, LIVE_INNINGS, EXTRA_WIN_LIST, GENERATE_DREAM_TEAM, GET_BASE_TEAMS_LISTING, MATCH_LIST_INREVIEW, MATCH_LIST_LIVE } from './constants'
const errMsg = 'Server is unavailable.'

export const getMatchList = (matchListData) => async (dispatch) => {
  const { start, limit, sort, order, search, sportsType, filter, startDate, endDate, provider, season, format, token } = matchListData
  await axios.get(`/gaming/admin/match/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&sportsType=${sportsType}&filter=${filter}&datefrom=${startDate}&dateto=${endDate}&eProvider=${provider}&iSeasonId=${season}&eFormat=${format}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true,
        status: filter
      }
    })
  }).catch(() => {
    dispatch({
      type: MATCH_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}
export const getMatchListLive = (matchListData) => async (dispatch) => {
  const { start, limit, sort, order, search, sportsType, filter, startDate, endDate, provider, season, format, token } = matchListData
  await axios.get(`/gaming/admin/match/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&sportsType=${sportsType}&filter=L&datefrom=${startDate}&dateto=${endDate}&eProvider=${provider}&iSeasonId=${season}&eFormat=${format}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_LIST_LIVE,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true,
        status: filter
      }
    })
  }).catch(() => {
    dispatch({
      type: MATCH_LIST_LIVE,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}
export const getMatchListInReview = (matchListData) => async (dispatch) => {
  const { start, limit, sort, order, search, sportsType, filter, startDate, endDate, provider, season, format, token } = matchListData

  await axios.get(`/gaming/admin/match/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&sportsType=${sportsType}&filter=I&datefrom=${startDate}&dateto=${endDate}&eProvider=${provider}&iSeasonId=${season}&eFormat=${format}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_LIST_INREVIEW,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true,
        status: filter
      }
    })
  }).catch(() => {
    dispatch({
      type: MATCH_LIST_INREVIEW,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}
export const fetchMatch = (date, provider, token, sportsType) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_MESSAGE })
  await axios.post(`/gaming/admin/match/${sportsType}/v1`, {
    dDate: date,
    eProvider: provider
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: FETCH_MATCH,
      payload: {
        data: response.data.data,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: FETCH_MATCH,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const addMatch = (addMatchData) => async (dispatch) => {
  const { Series, seasonName, seasonId, SeasonKey, MatchName, MatchFormat, StartDate, TeamAName, TeamBName, TeamAScore, TeamBScore, Venue, eCategory, matchOnTop, TossWinner, ChooseTossWinner, bDisabled, MaxTeamLimit, sSponsoredText, FantasyPostID, StreamURL, StreamType, matchKey, info, winningText, scoreCardFlag, grandLeague, dreamTeamFlag, pitchDetails, avgVenueScore, token } = addMatchData
  dispatch({ type: CLEAR_MATCH_MESSAGE })
  try {
    if (Series) {
      await axios.post('/gaming/admin/match/v1', {
        iSeasonId: seasonId,
        iSeriesId: Series,
        sSeasonName: seasonName,
        sSeasonKey: SeasonKey,
        sName: MatchName,
        eFormat: MatchFormat,
        dStartDate: StartDate,
        iHomeTeamId: TeamAName,
        iAwayTeamId: TeamBName,
        nHomeTeamScore: TeamAScore,
        nAwayTeamScore: TeamBScore,
        sVenue: Venue,
        eCategory: eCategory,
        iTossWinnerId: TossWinner,
        eTossWinnerAction: ChooseTossWinner,
        nMaxTeamLimit: MaxTeamLimit,
        bMatchOnTop: matchOnTop === 'Y',
        bDisabled: bDisabled === 'Y',
        sSponsoredText: sSponsoredText,
        sFantasyPost: FantasyPostID,
        sStreamUrl: StreamURL,
        eStreamType: StreamType,
        sKey: matchKey,
        sInfo: info,
        sWinning: winningText,
        iGrandLeagueId: grandLeague,
        bScorecardShow: scoreCardFlag === 'Y',
        bDreamTeam: dreamTeamFlag === 'Y',
        sPitchDetails: pitchDetails,
        nAvgVenueScore: avgVenueScore
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch({
          type: ADD_MATCH,
          payload: {
            data: response.data.data,
            resStatus: true,
            resMessage: response.data.message
          }
        })
      })
    } else {
      await axios.post('/gaming/admin/match/v1', {
        iSeasonId: seasonId,
        sSeasonName: seasonName,
        sSeasonKey: SeasonKey,
        sName: MatchName,
        eFormat: MatchFormat,
        dStartDate: StartDate,
        iHomeTeamId: TeamAName,
        iAwayTeamId: TeamBName,
        nHomeTeamScore: TeamAScore,
        nAwayTeamScore: TeamBScore,
        sVenue: Venue,
        eCategory: eCategory,
        iTossWinnerId: TossWinner,
        eTossWinnerAction: ChooseTossWinner,
        nMaxTeamLimit: MaxTeamLimit,
        bMatchOnTop: matchOnTop === 'Y',
        bDisabled: bDisabled === 'Y',
        sSponsoredText: sSponsoredText,
        sFantasyPost: FantasyPostID,
        sStreamUrl: StreamURL,
        eStreamType: StreamType,
        sKey: matchKey,
        sInfo: info,
        sWinning: winningText,
        iGrandLeagueId: grandLeague,
        bScorecardShow: scoreCardFlag === 'Y',
        bDreamTeam: dreamTeamFlag === 'Y',
        sPitchDetails: pitchDetails,
        nAvgVenueScore: avgVenueScore
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch({
          type: ADD_MATCH,
          payload: {
            data: response2.data.data,
            resStatus: true,
            resMessage: response2.data.message
          }
        })
      })
    }
  } catch (error) {
    dispatch({
      type: ADD_MATCH,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg
      }
    })
  }
}

export const updateMatch = (updateMatchData) => async (dispatch) => {
  const { Series, seasonName, seasonId, SeasonKey, MatchName, MatchFormat, StartDate, TeamAName, TeamBName, TeamAScore, TeamBScore, Venue, MatchStatus, TossWinner, ChooseTossWinner, matchOnTop, eCategory, token, ID, bDisabled, MaxTeamLimit, sSponsoredText, FantasyPostID, StreamURL, StreamType, matchKey, info, winningText, scoreCardFlag, grandLeague, dreamTeamFlag, pitchDetails, avgVenueScore } = updateMatchData
  dispatch({ type: CLEAR_MATCH_MESSAGE })
  try {
    if (Series) {
      await axios.put(`/gaming/admin/match/${ID}/v1`, {
        iSeasonId: seasonId,
        sSeasonName: seasonName,
        iSeriesId: Series,
        sSeasonKey: SeasonKey,
        sName: MatchName,
        eFormat: MatchFormat,
        dStartDate: StartDate,
        iHomeTeamId: TeamAName,
        iAwayTeamId: TeamBName,
        nHomeTeamScore: TeamAScore,
        nAwayTeamScore: TeamBScore,
        sVenue: Venue,
        eStatus: MatchStatus,
        eCategory: eCategory,
        iTossWinnerId: TossWinner,
        eTossWinnerAction: ChooseTossWinner,
        nMaxTeamLimit: MaxTeamLimit,
        bMatchOnTop: matchOnTop === 'Y',
        bDisabled: bDisabled === 'Y',
        sSponsoredText,
        sFantasyPost: FantasyPostID,
        sStreamUrl: StreamURL,
        eStreamType: StreamType,
        sKey: matchKey,
        sInfo: info,
        sWinning: winningText,
        iGrandLeagueId: grandLeague,
        bScorecardShow: scoreCardFlag === 'Y',
        bDreamTeam: dreamTeamFlag === 'Y',
        sPitchDetails: pitchDetails,
        nAvgVenueScore: avgVenueScore
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch({
          type: UPDATE_MATCH,
          payload: {
            resStatus: true,
            data: response.data.data,
            resMessage: response.data.message
          }
        })
      })
    } else {
      await axios.put(`/gaming/admin/match/${ID}/v1`, {
        iSeasonId: seasonId,
        sSeasonName: seasonName,
        sSeasonKey: SeasonKey,
        sName: MatchName,
        eFormat: MatchFormat,
        dStartDate: StartDate,
        iHomeTeamId: TeamAName,
        iAwayTeamId: TeamBName,
        nHomeTeamScore: TeamAScore,
        nAwayTeamScore: TeamBScore,
        sVenue: Venue,
        eStatus: MatchStatus,
        eCategory: eCategory,
        iTossWinnerId: TossWinner,
        eTossWinnerAction: ChooseTossWinner,
        nMaxTeamLimit: MaxTeamLimit,
        bMatchOnTop: matchOnTop === 'Y',
        bDisabled: bDisabled === 'Y',
        sSponsoredText,
        sFantasyPost: FantasyPostID,
        sStreamUrl: StreamURL,
        eStreamType: StreamType,
        sKey: matchKey,
        sInfo: info,
        sWinning: winningText,
        iGrandLeagueId: grandLeague,
        bScorecardShow: scoreCardFlag === 'Y',
        bDreamTeam: dreamTeamFlag === 'Y',
        sPitchDetails: pitchDetails,
        nAvgVenueScore: avgVenueScore
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch({
          type: UPDATE_MATCH,
          payload: {
            resStatus: true,
            data: response2.data.data,
            resMessage: response2.data.message
          }
        })
      })
    }
  } catch (error) {
    dispatch({
      type: UPDATE_MATCH,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg
      }
    })
  }
}

export const getMatchDetails = (Id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_MESSAGE })
  await axios.get(`/gaming/admin/match/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: MATCH_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const priceDistriBution = (iMatchId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_MESSAGE })
  await axios.get(`/gaming/admin/user-team/price-distribution/${iMatchId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PRIZE_DISTRIBUTION,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        prizeFlag: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: PRIZE_DISTRIBUTION,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false,
        prizeFlag: false
      }
    })
  })
}

export const winPrizeDistribution = (iMatchId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_MESSAGE })
  await axios.get(`/gaming/admin/user-team/win-price-distribution/${iMatchId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: WIN_PRIZE_MATCH_DISTRIBUTION,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        winFlag: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: WIN_PRIZE_MATCH_DISTRIBUTION,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false,
        winFlag: false
      }
    })
  })
}

export const generatePdf = (type, id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_MESSAGE })
  await axios.get(`/gaming/admin/check-fair-play/${id}/v1?sType=${type}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GENERATE_PDF,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GENERATE_PDF,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getUpcomingMatchList = (start, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/match/full-list/v1?start=${start}&limit=10`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPCOMING_MATCH_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: UPCOMING_MATCH_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getPost = (id, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/predictions/${id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: POST_PREVIEW,
      payload: {
        data: response.data.data ? response.data.data : '',
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: POST_PREVIEW,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getMatchesTotalCount = (data) => async (dispatch) => {
  const { filter, search, startDate, endDate, provider, season, format, sportsType, token } = data
  await axios.get(`/gaming/admin/match/counts/v1?search=${search}&sportsType=${sportsType}&filter=${filter}&datefrom=${startDate}&dateto=${endDate}&eProvider=${provider}&iSeasonId=${season}&eFormat=${format}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCHES_TOTAL_COUNT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true,
        status: filter
      }
    })
  }).catch(() => {
    dispatch({
      type: MATCHES_TOTAL_COUNT,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const loadLiveLeaderBoard = (matchId, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/cron/load-leaderboard/v2?matchId=${matchId}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LOAD_LIVE_LEADER_BOARD,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: LOAD_LIVE_LEADER_BOARD,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const mergeMatch = (data) => async (dispatch) => {
  const { oldMatchId, apiGeneratedMatchId, availablePlayers, token } = data
  await axios.post('/gaming/admin/match/merge/v1', {
    id: oldMatchId,
    apiMatchId: apiGeneratedMatchId,
    aPlayers: availablePlayers
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MERGE_MATCH,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: MERGE_MATCH,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg
      }
    })
  })
}

export const matchRefresh = (matchId, token) => async (dispatch) => {
  await axios.post(`/gaming/admin/match/refresh/${matchId}/v1`, {}, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_DATA_REFRESH,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: MATCH_DATA_REFRESH,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const liveInnings = (matchId, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/live-innings/${matchId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LIVE_INNINGS,
      payload: {
        data: response.data.data,
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: LIVE_INNINGS,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const fullScoreCard = (matchId, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/scorecard/${matchId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SCORE_CARD,
      payload: {
        data: response.data.data,
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: SCORE_CARD,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getExtraWinList = (matchId, start, limit, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/user-league/extra-win-list/${matchId}/v1?start=${start}&limit=${limit}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: EXTRA_WIN_LIST,
      payload: {
        data: response.data.data,
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: EXTRA_WIN_LIST,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const generateDreamTeam = (matchId, token) => async (dispatch) => {
  await axios.post(`/gaming/admin/dream-team/${matchId}/v1`, {}, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GENERATE_DREAM_TEAM,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GENERATE_DREAM_TEAM,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getBaseTeams = (start, limit, matchId, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/base-team/${matchId}/v1?nSkip=${start}&nLimit=${limit}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_BASE_TEAMS_LISTING,
      payload: {
        data: response.data.data,
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_BASE_TEAMS_LISTING,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const clearMatchMsg = () => (dispatch) => {
  dispatch({ type: CLEAR_MATCH_MESSAGE })
}
