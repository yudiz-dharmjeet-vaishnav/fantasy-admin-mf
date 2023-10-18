import { SIDEBAR_COLLAPSE } from '../actions/constants'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case SIDEBAR_COLLAPSE:
      return {
        ...state,
        status: action.payload
      }
    default:
      return state
  }
}
