import axios1 from 'axios'
import axios from '../axios'
import { ADD_MATCH_LEAGUE, ADD_SYSTEM_TEAMS, BANNER_MATCH_LEAGUE_LIST, BOT_COUNT_MATCH_LEAGUE, BOT_DETAILS_MATCH_CONTEST, CANCEL_MATCH_LEAGUE, CLEAR_MATCH_LEAGUE_MESSAGE, LEAGUE_COUNT, MATCH_LEAGUE_DETAILS, MATCH_LEAGUE_LIST, MATCH_LEAGUE_REPORT, NORMAL_BOT_TEAMS, POINT_CALCULATE, PROMO_USAGE_LIST, UPDATE_BOT_STATUS, USERS_CASHBACK_LIST, USER_LEAGUE_LIST, USER_TEAM_LIST, USER_TEAM_PLAYER_LIST, GET_USER_COPY_TEAMS, UPDATE_COPY_BOT, GET_EXCEL_REPORT, RESET_MATCH_LEAGUE, COPY_BOT_TEAM_PLAYER_LIST, FIRST_DEPOSIT_REPORT } from './constants'
// const axios2Elsepart = process.env.REACT_APP_ENVIRONMENT === 'staging' ? process.env.REACT_APP_NODE_AXIOS_BASE_URL_STAG : process.env.REACT_APP_NODE_AXIOS_BASE_URL_PROD
const axios2 = axios1.create({
  baseURL: 'https://node-dev.fantasywl.in/api'
})
const errMsg = 'Server is unavailable.'

export const getMatchLeagueList = (matchLeagueData) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_LEAGUE_MESSAGE })
  const { start, limit, sort, order, searchText, leagueType, isFullList, ID, sportsType, token, cancelFlag } = matchLeagueData
  await axios.get(`/gaming/admin/match-league/${ID}/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&iUserId=${searchText}&search=${searchText}&sportsType=${sportsType}&leagueType=${leagueType}&isFullResponse=${isFullList}&bCancelled=${cancelFlag}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_LEAGUE_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true,
        isFullResponse: isFullList
      }
    })
  }).catch(() => {
    dispatch({
      type: MATCH_LEAGUE_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const canceledMatchLeague = (iMatchLeagueId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_LEAGUE_MESSAGE })
  await axios.put(`/gaming/admin/match-league/${iMatchLeagueId}/cancel/v1`, { }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: CANCEL_MATCH_LEAGUE,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: CANCEL_MATCH_LEAGUE,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getUserLeagueList = (userLeagueData) => async (dispatch) => {
  const { start, limit, sort, order, searchText, userType, isFullList, sportsType, ID, token } = userLeagueData
  await axios.get(`/gaming/admin/user-league/list/${ID}/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${searchText}&eType=${userType}&sportsType=${sportsType}&bBotTeams=${isFullList}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: USER_LEAGUE_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resMessage: response.data.message,
        resStatus: true,
        isFullResponse: isFullList
      }
    })
  }).catch(() => {
    dispatch({
      type: USER_LEAGUE_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const addSystemTeams = (iMatchId, iMatchLeagueId, nTeams, bInstantAdd, token) => async (dispatch) => {
  dispatch({ type: 'CLEAR_MATCH_LEAGUE_MESSAGE' })
  await axios2.post(`/system/admin/join-league/${iMatchId}/v2`, { iMatchLeagueId, nTeams: parseInt(nTeams), bInstantAdd }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_SYSTEM_TEAMS,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_SYSTEM_TEAMS,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const botUsers = (botUser, matchLeagueId, token) => async (dispatch) => {
  dispatch({ type: 'CLEAR_MATCH_LEAGUE_MESSAGE' })
  await axios.put(`/gaming/admin/match-league/agent-create/${matchLeagueId}/v1`, {
    bBotCreate: botUser
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_BOT_STATUS,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_BOT_STATUS,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const getUserTeamList = (iMatchId, iUserId, token) => async (dispatch) => {
  await axios.post('/gaming/admin/user-team/v1', { iMatchId, iUserId }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: USER_TEAM_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: USER_TEAM_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getUserTeamPlayerList = (ID, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/user-team/team-player/${ID}/v2`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: USER_TEAM_PLAYER_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: USER_TEAM_PLAYER_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const AddCricketMatchLeague = (ID, LeagueID, token) => async (dispatch) => {
  dispatch({ type: 'CLEAR_MATCH_LEAGUE_MESSAGE' })
  await axios.post('/gaming/admin/match-league/v2', {
    iMatchId: ID,
    aLeagueId: LeagueID
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_MATCH_LEAGUE,
      payload: {
        data: response.data.data,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_MATCH_LEAGUE,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const getBannerMatchLeagueList = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_LEAGUE_MESSAGE })
  await axios.get(`/gaming/admin/upcoming-match-league/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: BANNER_MATCH_LEAGUE_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: BANNER_MATCH_LEAGUE_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getUsersCashbackList = (cashbackData) => async (dispatch) => {
  const { start, limit, search, matchId, matchLeagueID, token } = cashbackData
  await axios.get(`/gaming/admin/match-league/${matchLeagueID}/cashback-details/v2?start=${start}&limit=${limit}&iUserId=${search}&search=${search}&iMatchId=${matchId}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: USERS_CASHBACK_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: USERS_CASHBACK_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getMatchLeagueDetails = (matchLeagueID, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/single-match-league/${matchLeagueID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_LEAGUE_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: MATCH_LEAGUE_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getLeagueCount = (status, cancelToken, matchLeagueID, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/final-league-count/${matchLeagueID}/v1?eStatus=${status}`, { headers: { Authorization: token }, cancelToken }).then((response) => {
    dispatch({
      type: LEAGUE_COUNT,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: LEAGUE_COUNT,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const pointCalculate = (matchId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_LEAGUE_MESSAGE })
  await axios.get(`/gaming/admin/user-team/score/${matchId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: POINT_CALCULATE,
      payload: {
        resMessage: response.data.message ? response.data.message : [],
        resStatus: true,
        resFlag: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: POINT_CALCULATE,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false,
        resFlag: false
      }
    })
  })
}

export const botCountMatchLeague = (matchLeagueId, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/match-league/${matchLeagueId}/get-process-count/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: BOT_COUNT_MATCH_LEAGUE,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: BOT_COUNT_MATCH_LEAGUE,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const botLogsForMatchContest = (start, limit, key, matchLeagueId, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/contest-bot-logs/${matchLeagueId}/v1?start=${start}&limit=${limit}&eType=${key}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: BOT_DETAILS_MATCH_CONTEST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: BOT_DETAILS_MATCH_CONTEST,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getMatchLeagueReport = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_LEAGUE_MESSAGE })
  await axios.get(`/gaming/admin/match-league/${ID}/report/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: MATCH_LEAGUE_REPORT,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: MATCH_LEAGUE_REPORT,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getPromoCodeUsageList = (start, limit, search, matchLeagueId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_LEAGUE_MESSAGE })
  await axios.get(`/gaming/admin/match-league/${matchLeagueId}/promo-usage/v1?start=${start}&limit=${limit}&search=${search}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PROMO_USAGE_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: PROMO_USAGE_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const normalBotTeams = (matchId, aMatchLeagueId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_MATCH_LEAGUE_MESSAGE })
  await axios2.put(`/system/admin/agent-team-update/${matchId}/v1`, { aMatchLeagueId }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: NORMAL_BOT_TEAMS,
      payload: {
        resMessage: response.data.message ? response.data.message : [],
        resStatus: true
      }
    })
  }).catch((err) => {
    dispatch({
      type: NORMAL_BOT_TEAMS,
      payload: {
        resMessage: err?.response ? err?.response?.data?.message : '',
        resStatus: false
      }
    })
  })
}

export const getUserCopyTeams = (userTeamId, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/agent-team/team-player/v1?iTeamId=${userTeamId}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_USER_COPY_TEAMS,
      payload: {
        data: response.data.data,
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_USER_COPY_TEAMS,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const updateCopyBot = (matchLeagueId, nCopyBotsPerTeam, nSameCopyBotTeam, token) => async (dispatch) => {
  await axios.put(`/gaming/admin/match-league/${matchLeagueId}/copy-agent/v1`, { nCopyBotsPerTeam, nSameCopyBotTeam }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_COPY_BOT,
      payload: {
        data: response.data.data,
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_COPY_BOT,
      patyload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getExcelReport = (id, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/user-league/report/${id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_EXCEL_REPORT,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_EXCEL_REPORT,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const resetMatchLeague = (matchLeagueId, token) => async (dispatch) => {
  await axios.post(`/gaming/admin/match-league/reset-spot/${matchLeagueId}/v1`, {}, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: RESET_MATCH_LEAGUE,
      payload: {
        resetResMessage: response.data.message,
        resetResStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: RESET_MATCH_LEAGUE,
      payload: {
        resetResMessage: error.response ? error.response.data.message : errMsg,
        resetResStatus: false
      }
    })
  })
}

export const getCopyBotTeamPlayerList = (userTeamId, matchLeagueId, token) => async (dispatch) => {
  dispatch({ type: 'CLEAR_MATCH_LEAGUE_MESSAGE' })
  await axios.get(`/gaming/admin/copy-agent-team  /team-player/${userTeamId}/${matchLeagueId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: COPY_BOT_TEAM_PLAYER_LIST,
      payload: {
        data: response?.data?.data || [],
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: COPY_BOT_TEAM_PLAYER_LIST,
      payload: {
        data: [],
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const getFirstDeportReport = (data) => async (dispatch) => {
  const { startDate, endDate, token } = data
  await axios.get(`/payment/admin/deposit/first-deposit-report/v1?datefrom=${startDate}&dateto=${endDate}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: FIRST_DEPOSIT_REPORT,
      payload: {
        data: response.data.data ? response.data.data : [],
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: FIRST_DEPOSIT_REPORT,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}
