import axios from '../axios'
import { DASHBOARD_DETAILS } from './constants'

export const getDashBoardDetails = (token) => async (dispatch) => {
  await axios.get('/gaming/admin/dashboard/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: DASHBOARD_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: DASHBOARD_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}
