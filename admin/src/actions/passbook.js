import axios from '../axios'
import { CLEAR_PASSBOOK_MESSAGE, GENERATE_TRANSACTION_REPORT, GET_TRANSACTION_REPORT_LIST, PASSBOOK_DETAILS, PASSBOOK_LIST, STATISTIC_DETAILS, SYSTEM_USER_PASSBOOK_DETAILS, SYSTEM_USER_STATISTIC_DETAILS, TRANSACTIONS_TOTAL_COUNT } from './constants'

export const getPassbookList = (passBookData) => async (dispatch) => {
  dispatch({ type: CLEAR_PASSBOOK_MESSAGE })
  const { start, limit, sort, order, userType, search, searchType, startDate, endDate, particulars, eType, status, isFullResponse, token } = passBookData
  await axios.get(`/gaming/admin/passbook/list/v2?start=${start}&limit=${limit}&sort=${sort}&order=${order}&eUserType=${userType}&searchType=${searchType}&search=${search}&datefrom=${startDate}&dateto=${endDate}&particulars=${particulars}&type=${eType}&eStatus=${status}&isFullResponse=${isFullResponse}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PASSBOOK_LIST,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true,
        isFullResponse
      }
    })
  }).catch(() => {
    dispatch({
      type: PASSBOOK_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getLeaguePassbookList = (passBookData) => async (dispatch) => {
  dispatch({ type: CLEAR_PASSBOOK_MESSAGE })
  const { id, start, limit, sort, order, search, searchType, startDate, endDate, particulars, eType, status, isFullResponse, token } = passBookData
  await axios.get(`/gaming/admin/passbook/match-league-list/${id}/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&searchType=${searchType}&search=${search}&datefrom=${startDate}&dateto=${endDate}&particulars=${particulars}&type=${eType}&eStatus=${status}&isFullResponse=${isFullResponse}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PASSBOOK_LIST,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true,
        isFullResponse
      }
    })
  }).catch(() => {
    dispatch({
      type: PASSBOOK_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getPassbookDetails = (iUserId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PASSBOOK_MESSAGE })
  await axios.get(`/gaming/admin/passbooks/${iUserId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PASSBOOK_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: PASSBOOK_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getStatisticDetails = (iUserId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PASSBOOK_MESSAGE })
  await axios.get(`/gaming/admin/statistics/${iUserId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: STATISTIC_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: STATISTIC_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getSystemUserPassbookDetails = (iUserId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PASSBOOK_MESSAGE })
  await axios.get(`/gaming/admin/agent/passbooks/${iUserId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SYSTEM_USER_PASSBOOK_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SYSTEM_USER_PASSBOOK_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getSystemUserStatisticDetails = (iUserId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PASSBOOK_MESSAGE })
  await axios.get(`/gaming/admin/agent/statistics/${iUserId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SYSTEM_USER_STATISTIC_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SYSTEM_USER_STATISTIC_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getTransactionsTotalCount = (data) => async (dispatch) => {
  const { search, searchType, userType, startDate, endDate, particulars, eType, status, isFullResponse, token } = data
  await axios.get(`/gaming/admin/passbook/counts/v2?searchType=${searchType}&search=${search}&eUserType=${userType}&datefrom=${startDate}&dateto=${endDate}&particulars=${particulars}&type=${eType}&eStatus=${status}&isFullResponse=${isFullResponse}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: TRANSACTIONS_TOTAL_COUNT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: TRANSACTIONS_TOTAL_COUNT,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const getLeagueTransactionsTotalCount = (data) => async (dispatch) => {
  const { id, search, searchType, startDate, endDate, particulars, eType, status, isFullResponse, token } = data
  await axios.get(`/gaming/admin/passbook/match-league-list/count/${id}/v1?searchType=${searchType}&search=${search}&datefrom=${startDate}&dateto=${endDate}&particulars=${particulars}&type=${eType}&eStatus=${status}&isFullResponse=${isFullResponse}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: TRANSACTIONS_TOTAL_COUNT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: TRANSACTIONS_TOTAL_COUNT,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const generateTransactionReport = (generateReportData) => async (dispatch) => {
  dispatch({ type: CLEAR_PASSBOOK_MESSAGE })
  const { dDateFrom, dDateTo, eTransactionType, eType, eStatus, eCategory, iMatchId, iMatchLeagueId, token } = generateReportData
  await axios.post('/gaming/admin/passbook/transaction-report/v1',
    { dDateFrom, dDateTo, eTransactionType, eType, eStatus, eCategory, iMatchId, iMatchLeagueId }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GENERATE_TRANSACTION_REPORT,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GENERATE_TRANSACTION_REPORT,
      payload: {
        data: [],
        resMessage: error.response ? error?.response?.data?.message : 'Server is unavailable.',
        resStatus: false
      }
    })
  })
}

export const getTransactionReportList = (data) => async (dispatch) => {
  const { start, limit, sort, startDate, endDate, token } = data
  dispatch({ type: CLEAR_PASSBOOK_MESSAGE })
  await axios.get(`/gaming/admin/passbook/list-transaction-report/v1?start=${start}&limit=${limit}&sorting=${sort}&datefrom=${startDate}&dateto=${endDate}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_TRANSACTION_REPORT_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: GET_TRANSACTION_REPORT_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}
