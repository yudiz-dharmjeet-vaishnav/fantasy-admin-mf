import axios from '../axios'
import { catchForList, catchFunc, getListData, successFunc } from '../helpers/helper'
import { ADD_PROMOCODE, CLEAR_PROMOCODE_MESSAGE, DELETE_PROMOCODE, PROMOCODE_DETAILS, PROMOCODE_LIST, PROMOCODE_STATISTICS_LIST, UPDATE_PROMOCODE } from './constants'

export const getPromocodeList = (promoCodeListData) => async (dispatch) => {
  const { start, limit, sort, order, search, promoType, dateFrom, dateTo, token } = promoCodeListData
  await axios.get(`/gaming/admin/promocode/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&eType=${promoType}&datefrom=${dateFrom}&dateto=${dateTo}`, { headers: { Authorization: token } }).then((response) => {
    dispatch(getListData(PROMOCODE_LIST, response))
  }).catch((error) => {
    dispatch(catchForList(PROMOCODE_LIST, error))
  })
}

export const addPromocode = (addPromocodeData) => async (dispatch) => {
  dispatch({ type: CLEAR_PROMOCODE_MESSAGE })
  const { promoType, selectedMatches, selectedLeagues, Name, CouponCode, description, amount, minAmount, maxAmount, maxAllow, maxAllowPerUser, startingDate, endingDate, Percentage, promocodeStatus, isMaxAllowForAllUsers, showInFront, maxDiscount, token } = addPromocodeData
  try {
    if (selectedMatches && selectedMatches.length > 0 && selectedLeagues && selectedLeagues.length > 0) {
      await axios.post('/gaming/admin/promocode/v3', {
        eType: promoType,
        aMatches: selectedMatches,
        aLeagues: selectedLeagues,
        sName: Name,
        sCode: CouponCode,
        sInfo: description,
        nAmount: amount,
        nMinAmount: minAmount,
        nMaxAmount: maxAmount,
        nMaxAllow: parseInt(maxAllow),
        nPerUserUsage: parseInt(maxAllowPerUser),
        dStartTime: startingDate,
        dExpireTime: endingDate,
        bIsPercent: Percentage,
        eStatus: promocodeStatus,
        bMaxAllowForAllUser: isMaxAllowForAllUsers,
        bShow: showInFront,
        nMaxDiscount: maxDiscount
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch(successFunc(ADD_PROMOCODE, response))
      })
    } else {
      await axios.post('/gaming/admin/promocode/v3', {
        eType: promoType,
        sName: Name,
        sCode: CouponCode,
        sInfo: description,
        nAmount: amount,
        nMinAmount: minAmount,
        nMaxAmount: maxAmount,
        nMaxAllow: parseInt(maxAllow),
        nPerUserUsage: parseInt(maxAllowPerUser),
        dStartTime: startingDate,
        dExpireTime: endingDate,
        bIsPercent: Percentage,
        eStatus: promocodeStatus,
        bMaxAllowForAllUser: isMaxAllowForAllUsers,
        bShow: showInFront,
        nMaxDiscount: maxDiscount
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch(successFunc(ADD_PROMOCODE, response2))
      })
    }
  } catch (error) {
    dispatch(catchFunc(ADD_PROMOCODE, error))
  }
}

export const addNPromocode = (addPromocodeData) => async (dispatch) => {
  dispatch({ type: CLEAR_PROMOCODE_MESSAGE })
  const { promoType, selectedMatches, selectedLeagues, Name, description, amount, count, pLength, prefix, suffix, minAmount, maxAmount, maxAllow, maxAllowPerUser, startingDate, endingDate, Percentage, promocodeStatus, isMaxAllowForAllUsers, showInFront, token } = addPromocodeData
  try {
    if (selectedMatches && selectedMatches.length > 0 && selectedLeagues && selectedLeagues.length > 0) {
      await axios.post('/gaming/admin/promocode/v2', {
        eType: promoType,
        aMatches: selectedMatches,
        aLeagues: selectedLeagues,
        sName: Name,
        sInfo: description,
        nAmount: amount,
        nCount: count,
        nLength: pLength,
        sPrefix: prefix,
        sSuffix: suffix,
        nMinAmount: minAmount,
        nMaxAmount: maxAmount,
        nMaxAllow: parseInt(maxAllow),
        nPerUserUsage: parseInt(maxAllowPerUser),
        dStartTime: startingDate,
        dExpireTime: endingDate,
        bIsPercent: Percentage,
        eStatus: promocodeStatus,
        bMaxAllowForAllUser: isMaxAllowForAllUsers,
        bShow: showInFront
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch(successFunc(ADD_PROMOCODE, response))
      })
    } else {
      await axios.post('/gaming/admin/promocode/v2', {
        eType: promoType,
        sName: Name,
        sInfo: description,
        nAmount: amount,
        nCount: count,
        nLength: pLength,
        sPrefix: prefix,
        sSuffix: suffix,
        nMinAmount: minAmount,
        nMaxAmount: maxAmount,
        nMaxAllow: parseInt(maxAllow),
        nPerUserUsage: parseInt(maxAllowPerUser),
        dStartTime: startingDate,
        dExpireTime: endingDate,
        bIsPercent: Percentage,
        eStatus: promocodeStatus,
        bMaxAllowForAllUser: isMaxAllowForAllUsers,
        bShow: showInFront
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch(successFunc(ADD_PROMOCODE, response2))
      })
    }
  } catch (error) {
    dispatch(catchFunc(ADD_PROMOCODE, error))
  }
}

export const getPromocodeDetails = (Id, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/promocode/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PROMOCODE_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: PROMOCODE_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const updatePromocode = (updatePromocodeData) => async (dispatch) => {
  dispatch({ type: CLEAR_PROMOCODE_MESSAGE })
  const { promoType, selectedMatches, selectedLeagues, promocodeId, Name, CouponCode, description, amount, minAmount, maxAmount, maxAllow, maxAllowPerUser, startingDate, endingDate, Percentage, promocodeStatus, isMaxAllowForAllUsers, showInFront, maxDiscount, token } = updatePromocodeData
  try {
    if (selectedMatches && selectedMatches.length > 0 && selectedLeagues && selectedLeagues.length > 0) {
      await axios.put(`/gaming/admin/promocode/${promocodeId}/v1`, {
        eType: promoType,
        aMatches: selectedMatches,
        aLeagues: selectedLeagues,
        sName: Name,
        sCode: CouponCode,
        sInfo: description,
        nAmount: amount,
        nMinAmount: minAmount,
        nMaxAmount: maxAmount,
        nMaxAllow: parseInt(maxAllow),
        nPerUserUsage: parseInt(maxAllowPerUser),
        dStartTime: startingDate,
        dExpireTime: endingDate,
        bIsPercent: Percentage,
        eStatus: promocodeStatus,
        bMaxAllowForAllUser: isMaxAllowForAllUsers,
        bShow: showInFront,
        nMaxDiscount: maxDiscount
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch(successFunc(UPDATE_PROMOCODE, response))
      })
    } else {
      await axios.put(`/gaming/admin/promocode/${promocodeId}/v1`, {
        eType: promoType,
        sName: Name,
        sCode: CouponCode,
        sInfo: description,
        nAmount: amount,
        nMinAmount: minAmount,
        nMaxAmount: maxAmount,
        nMaxAllow: parseInt(maxAllow),
        nPerUserUsage: parseInt(maxAllowPerUser),
        dStartTime: startingDate,
        dExpireTime: endingDate,
        bIsPercent: Percentage,
        eStatus: promocodeStatus,
        bMaxAllowForAllUser: isMaxAllowForAllUsers,
        bShow: showInFront,
        nMaxDiscount: maxDiscount
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch(successFunc(UPDATE_PROMOCODE, response))
      })
    }
  } catch (error) {
    dispatch(catchFunc(UPDATE_PROMOCODE, error))
  }
}

export const deletePromocode = (Id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROMOCODE_MESSAGE })
  await axios.delete(`/gaming/admin/promocode/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch(successFunc(DELETE_PROMOCODE, response))
  }).catch((error) => {
    dispatch(catchFunc(DELETE_PROMOCODE, error))
  })
}

export const getPromocodeStatisticsDetails = (start, limit, sort, order, search, PromoCodeID, token) => async (dispatch) => {
  await axios.get(`/gaming/admin/promocode/stats/${PromoCodeID}/v2?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&iUserId=${search}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PROMOCODE_STATISTICS_LIST,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: PROMOCODE_STATISTICS_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}
