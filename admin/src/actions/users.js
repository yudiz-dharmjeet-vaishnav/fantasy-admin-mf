import axios from '../axios'
import { GET_RECOMMANDED_LIST } from './constants'
const errMsg = 'Server is unavailable.'

export const getRecommendedList = (ID, sendId, token) => async (dispatch) => {
  await axios.get(`/auth/admin/user/recommendation/v1?sSearch=${ID}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_RECOMMANDED_LIST,
      payload: {
        data: response.data.data ? response.data.data : {},
        isSendId: sendId,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_RECOMMANDED_LIST,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}
