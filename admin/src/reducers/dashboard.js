import { CLEAR_CHARTS_MESSAGE, DASHBOARD_DETAILS } from '../actions/constants'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case DASHBOARD_DETAILS:
      return {
        ...state,
        dashboardDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_CHARTS_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
