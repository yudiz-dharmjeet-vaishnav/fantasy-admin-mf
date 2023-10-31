import { GET_RECOMMANDED_LIST } from '../actions/constants'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case GET_RECOMMANDED_LIST:
      return {
        ...state,
        recommendedList: action.payload.data,
        isSendId: action.payload.isSendId,
        resStatus: action.payload.resStatus
      }
    default:
      return state
  }
}
