import axios from '../axios'
import axios1 from 'axios'
import { ADD_SYSTEM_USER, CLEAR_SYSTEM_USERS_MESSAGE, GET_PROBABILITY, JOIN_BOT_IN_CONTEST, SYSTEM_USERS_TOTAL_COUNT, SYSTEM_USER_DETAILS, SYSTEM_USER_LIST, COMBINATION_BOT_TEAMS, COMBINATION_BOT_LOGS, AUTO_KILLS_BOTS, AUTO_KILLS_BOTS_FLAG } from './constants'
const errMsg = 'Server is unavailable.'
// const axios2Else = process.env.REACT_APP_ENVIRONMENT === 'staging' ? process.env.REACT_APP_NODE_AXIOS_BASE_URL_STAG : process.env.REACT_APP_NODE_AXIOS_BASE_URL_PROD
export const axios2 = axios1.create({
  baseURL: 'https://node-dev.fantasywl.in/api'
})

export const getSystemUserList = (data) => async (dispatch) => {
  dispatch({ type: CLEAR_SYSTEM_USERS_MESSAGE })
  const { start, limit, sort, order, searchvalue, filterBy, startDate, endDate, isFullResponse, token } = data
  const urlElse2 = (filterBy === 'INTERNAL_ACCOUNT')
    ? `/auth/admin/agent/list/v1?start=${start}&limit=${limit}&sorting=${sort}&order=${order}&search=${searchvalue}&internalAccount=${true}&datefrom=${startDate}&dateto=${endDate}&isFullResponse=${isFullResponse}`
    : `/auth/admin/agent/list/v1?start=${start}&limit=${limit}&sorting=${sort}&order=${order}&search=${searchvalue}&datefrom=${startDate}&dateto=${endDate}&isFullResponse=${isFullResponse}`
  const urlElse = (filterBy === 'MOBILE_VERIFIED')
    ? `/auth/admin/agent/list/v1?start=${start}&limit=${limit}&sorting=${sort}&order=${order}&search=${searchvalue}&mobile=${true}&datefrom=${startDate}&dateto=${endDate}&isFullResponse=${isFullResponse}`
    : urlElse2
  const url = (filterBy === 'EMAIL_VERIFIED')
    ? `/auth/admin/agent/list/v1?start=${start}&limit=${limit}&sorting=${sort}&order=${order}&search=${searchvalue}&email=${true}&datefrom=${startDate}&dateto=${endDate}&isFullResponse=${isFullResponse}`
    : urlElse
  await axios.get(url, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SYSTEM_USER_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true,
        isFullResponse
      }
    })
  }).catch(() => {
    dispatch({
      type: SYSTEM_USER_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const addSystemUsers = (nUsers, token) => async (dispatch) => {
  await axios.post('/auth/admin/system-user/v1', { nUsers }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_SYSTEM_USER,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_SYSTEM_USER,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const combinationBotTeams = (matchId, players, aMatchLeagueId, selSize, token) => async (dispatch) => {
  dispatch({ type: CLEAR_SYSTEM_USERS_MESSAGE })
  await axios.put(`/gaming/admin/match-player/combination-agent-players/${matchId}/v1`, { players, aMatchLeagueId, selSize }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: COMBINATION_BOT_TEAMS,
      payload: {
        isTeamUpdate: true,
        resMessage: response.data.message ? response.data.message : [],
        resStatus: true
      }
    })
  }).catch((err) => {
    dispatch({
      type: COMBINATION_BOT_TEAMS,
      payload: {
        isTeamUpdate: true,
        resMessage: err?.response?.data ? err?.response?.data?.message : '',
        resStatus: false
      }
    })
  })
}

export const getSystemUserDetails = (ID, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/agent/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SYSTEM_USER_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SYSTEM_USER_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const getSystemUsersTotalCount = (data) => async (dispatch) => {
  const { searchvalue, filterBy, startDate, endDate, token } = data
  const urlElse2 = (filterBy === 'INTERNAL_ACCOUNT')
    ? `/auth/admin/agent/counts/v1?search=${searchvalue}&internalAccount=${true}&datefrom=${startDate}&dateto=${endDate}`
    : `/auth/admin/agent/counts/v1?search=${searchvalue}&datefrom=${startDate}&dateto=${endDate}`
  const urlElse = (filterBy === 'MOBILE_VERIFIED')
    ? `/auth/admin/agent/counts/v1?search=${searchvalue}&mobile=${true}&datefrom=${startDate}&dateto=${endDate}`
    : urlElse2
  const url = (filterBy === 'EMAIL_VERIFIED')
    ? `/auth/admin/agent/counts/v1?search=${searchvalue}&email=${true}&datefrom=${startDate}&dateto=${endDate}`
    : urlElse
  await axios.get(url, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SYSTEM_USERS_TOTAL_COUNT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SYSTEM_USERS_TOTAL_COUNT,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const getProbability = (data) => async (dispatch) => {
  const { players, rules, matchLeagueId, matchId, token } = data
  dispatch({ type: CLEAR_SYSTEM_USERS_MESSAGE })
  await axios2.post(`/system/admin/match-players-probability-with-cvc/${matchId}/v1`, {
    players, rules, iMatchLeagueId: matchLeagueId
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_PROBABILITY,
      payload: {
        data: response.data.data,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_PROBABILITY,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const joinBotInContest = (data) => async (dispatch) => {
  const { players, teamCount, rules, instantAdd, matchLeagueId, matchId, token } = data
  dispatch({ type: CLEAR_SYSTEM_USERS_MESSAGE })
  await axios2.post(`/system/admin/join-agent-team-with-cvc/${matchId}/v1`, {
    players, teamCount, rules, bInstantAdd: instantAdd, iMatchLeagueId: matchLeagueId
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: JOIN_BOT_IN_CONTEST,
      payload: {
        resMessage: response.data.message,
        isTeamCreate: true,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: JOIN_BOT_IN_CONTEST,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        isTeamCreate: false,
        resStatus: false
      }
    })
  })
}

export const combinationBotLogs = (matchId, matchLeagueId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_SYSTEM_USERS_MESSAGE })
  await axios.get(`/gaming/admin/match-player/combination-agent-players/${matchId}/v1?iMatchLeagueId=${matchLeagueId}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: COMBINATION_BOT_LOGS,
      payload: {
        data: response.data ? response.data : [],
        resStatus: true
      }
    })
  }).catch((err) => {
    dispatch({
      type: COMBINATION_BOT_LOGS,
      payload: {
        resMessage: err?.response?.data ? '' : '',
        resStatus: false
      }
    })
  })
}

export const autoKillBots = (shutDown, token) => async (dispatch) => {
  await axios2.post('/system/admin/auto-kill-agent/v1', {
    bShutdown: shutDown
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: AUTO_KILLS_BOTS,
      payload: {
        resMessage: response.data.message,
        isTeamCreate: true,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: AUTO_KILLS_BOTS,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        isTeamCreate: false,
        resStatus: false
      }
    })
  })
}

export const getAutoKillDetails = (token) => async (dispatch) => {
  await axios2.get('/system/admin/auto-kill-agent/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: AUTO_KILLS_BOTS_FLAG,
      payload: {
        data: response.data?.data ? response?.data?.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: AUTO_KILLS_BOTS_FLAG,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}
