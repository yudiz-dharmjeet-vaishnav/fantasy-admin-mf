export default (state = { }, action) => {
  switch (action.type) {
    case 'USER_TOKEN':
      return {
        ...state,
        token: action.payload
      }
    case 'IsFullList':
      // state.isFullList = false
      return {
        ...state,
        isFullList: action.payload
      }
    default:
      return state
  }
}
