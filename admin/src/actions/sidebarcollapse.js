import { SIDEBAR_COLLAPSE } from './constants'

export const collapseSideFunction = (collapse) => {
  return ({
    type: SIDEBAR_COLLAPSE,
    payload: {
      status: collapse
    }
  })
}
