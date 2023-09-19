// import { history } from '../App'

// import cricketIcon from './assets/images/cricket-image.svg'
// import footballIcon from './assets/images/football-image.svg'
// import basketballIcon from './assets/images/basketball-image.svg'
// import kabaddiIcon from './assets/images/kabaddi-image.svg'
// import baseballIcon from './assets/images/baseball-image.svg'
// import PlayerImage from './assets/images/avatar.svg'
// import WK from './assets/images/wk.svg'
// import BATS from './assets/images/batsman.svg'
// import ALLR from './assets/images/all.svg'
// import BWL from './assets/images/bowler.svg'
// import GK from './assets/images/gk.svg'
// import DEF from './assets/images/def.svg'
// import MID from './assets/images/mid.svg'
// import FWD from './assets/images/fwd.svg'
// import C from './assets/images/center.svg'
// import PF from './assets/images/pf.svg'
// import SG from './assets/images/sg.svg'
// import PG from './assets/images/pg.svg'
// import SF from './assets/images/sf.svg'
// import CT from './assets/images/catcher.svg'
// import IF from './assets/images/if.svg'
// import P from './assets/images/pitcher.svg'
// import OF from './assets/images/of.svg'
// import DEFENDER from './assets/images/defender.svg'
// import RAID from './assets/images/raids.svg'
import moment from 'moment'

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDUH3YJ9lSOPsof/8qyHKPG1kuA
QXNLEWE4bd+VLBgbEitOwm9+TLpzcnzweaiVfr9NIoaEydxP4ZlJF/h/7fhOuazS
QRld429/k+ZzyfmpDkGIPbgKOndPdy0AuWZoiEMXKQvSbtmbCN0isWlquW1vU7Fn
SJi4Dm1LbgpnL6FLgwIDAQAB
-----END PUBLIC KEY-----`

// Functions that has been used at multiple places

// Get list function
export function getListData (type, response) {
  return {
    type,
    payload: {
      data: response.data.data[0] ? response.data.data[0] : [],
      resStatus: true
    }
  }
}

// catch function for list
export function catchForList (type, error) {
  return {
    type,
    payload: {
      data: [],
      resStatus: false
    }
  }
}

export function successFunc (type, response) {
  return {
    type,
    payload: {
      resMessage: response.data.message,
      resStatus: true,
      type
    }
  }
}

// Catch function
export function catchFunc (type, error) {
  return {
    type,
    payload: {
      resMessage: error?.response ? error.response?.data?.message || error?.response?.data?.errors[0]?.msg + ' of ' + error?.response?.data?.errors[0]?.param : 'Server is unavailable.',
      resStatus: false,
      type
    }
  }
}

// reducer
export function commonReducer (state, action) {
  return {
    ...state,
    resStatus: action.payload.resStatus,
    resMessage: action.payload.resMessage,
    type: action.payload.type
  }
}

// to encrypt password
// export function encryption (sPassword) {
//   const crypt = new Crypt()
//   const encrypted = crypt.encrypt(publicKey, sPassword)
//   return encrypted.toString()
// }

export function verifyEmail (value) {
  const emailRex = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (emailRex.test(value)) {
    return true
  }
  return false
}

export function verifyPassword (value) {
  const passwordRex = /^[\S]{5,14}$/
  if (passwordRex.test(value)) {
    return true
  }
  return false
}

export function panCardNumber (value) {
  const panRex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/
  if (!panRex.test(value)) {
    return true
  }
  return false
}

export function isPincode (value) {
  const pincodeRegEx = /^[1-9]{1}[0-9]{5}$/
  if (!pincodeRegEx.test(value)) {
    return true
  }
  return false
}

export function withoutSpace (value) {
  const SpacelessRex = /\s/g
  if (SpacelessRex.test(value)) {
    return true
  }
  return false
}

export function verifyLength (value, length) {
  if (value?.length >= length) {
    return true
  }
  return false
}

export function verifyMobileNumber (value) {
  const mobRex = /^[0-9]{10}$/
  if (mobRex.test(value)) {
    return true
  }
  return false
}

export function verifyAadhaarNumber (value) {
  const mobRex = /^[0-9]{12}$/
  if (mobRex.test(value)) {
    return true
  }
  return false
}

export function isNumber (value) {
  const numRex = /^[0-9\b]+$/
  if (numRex.test(value)) {
    return true
  }
  return false
}

export function isScore (value) {
  const score = /([0-9]+)\/([0-9]+)/
  const score2 = /[0-9]/
  if (score.test(value) || score2.test(value)) {
    return true
  }
  return false
}

export function isFloat (value) {
  const numRex = /^\d+(\.\d{1,2})?$/
  if (numRex.test(value)) {
    return true
  }
  return false
}

export function isPositive (value) {
  if (value > 0) {
    return true
  }
  return false
}

export function unAuthorized () {
  localStorage.removeItem('Token')
  // store.dispatch({
  //   type: 'TOKEN_LOGIN',
  //   payload: {
  //     token: null
  //   }
  // })
  // history.push('/auth/login')
}

export function verifyUrl (value) {
  const urlRex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
  if (urlRex.test(value)) {
    return true
  }
  return false
}

export function getUrl () {
  return 'https://yudiz-fantasy-media.s3.ap-south-1.amazonaws.com/'
}

export function ifscCode (value) {
  const ifscRex = /^[A-Z]{4}0[A-Z0-9]{6}$/
  if (!ifscRex.test(value)) {
    return true
  }
  return false
}

export function alertClass (status, close) {
  if (status) {
    return `sucess-alert ${!close ? 'alert' : 'alert-close'}`
  }
  return `fail-alert ${!close ? 'alert' : 'alert-close'}`
}

export function modalMessageFunc (modalMessage, setModalMessage, setClose) {
  if (modalMessage) {
    setTimeout(() => {
      setModalMessage(false)
      setClose(false)
    }, 3000)
    setTimeout(() => {
      setClose(true)
    }, 2500)
  }
}

export function verifySpecialCharacter (value) {
  const regex = /^[0-9a-zA-Z]+$/
  if (regex.test(value)) {
    return true
  }
  return false
}

export function blockInvalidChar (e, str) {
  if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8) {
    // If this is the first character and it is a dash, that's okay
    if (str.length === 0 && (e.keyCode === 189 || e.keyCode === 109)) {
      return true
    }

    e.preventDefault()
    return false
  }
}

// export function getSportIcon (sport) {
//   if (sport.toLowerCase() === 'cricket') {
//     return cricketIcon
//   } else if (sport.toLowerCase() === 'football') {
//     return footballIcon
//   } else if (sport.toLowerCase() === 'basketball') {
//     return basketballIcon
//   } else if (sport.toLowerCase() === 'kabaddi') {
//     return kabaddiIcon
//   } else if (sport.toLowerCase() === 'baseball') {
//     return baseballIcon
//   }
// }

// formate currency

export function formatCompactNumber (number) {
  if (number < 1000) {
    return number.toFixed(2)
  } else if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(2) + 'K'
  } else if (number >= 1000000 && number < 1000000000) {
    return (number / 1000000).toFixed(2) + 'M'
  } else if (number >= 1000000000 && number < 1000000000000) {
    return (number / 1000000000).toFixed(2) + 'B'
  } else if (number >= 1000000000000 && number < 1000000000000000) {
    return (number / 1000000000000).toFixed(2) + 'T'
  }
}
export function formatCompactNumberForGraph (number, logo) {
  if (number < 1000) {
    return number
  } else if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(2) + 'K'
  } else if (number >= 1000000 && number < 1000000000) {
    return (number / 1000000).toFixed(2) + 'M'
  } else if (number >= 1000000000 && number < 1000000000000) {
    return (number / 1000000000).toFixed(2) + 'B'
  } else if (number >= 1000000000000 && number < 1000000000000000) {
    return (number / 1000000000000).toFixed(2) + 'T'
  }
}

// export function defaultPlayerRoleImages (sportstype, Role) {
//   if (sportstype === 'cricket') {
//     if (Role === 'WK') {
//       return WK
//     } if (Role === 'ALLR') {
//       return ALLR
//     } if (Role === 'BATS') {
//       return BATS
//     } if (Role === 'BWL') {
//       return BWL
//     }
//     return PlayerImage
//   } else if (sportstype === 'football') {
//     if (Role === 'MID') {
//       return MID
//     } if (Role === 'GK') {
//       return GK
//     } if (Role === 'FWD') {
//       return FWD
//     } if (Role === 'DEF') {
//       return DEF
//     }
//     return PlayerImage
//   } else if (sportstype === 'basketball') {
//     if (Role === 'PG') {
//       return PG
//     } else if (Role === 'SG') {
//       return SG
//     } else if (Role === 'SF') {
//       return SF
//     } else if (Role === 'PF') {
//       return PF
//     } else if (Role === 'C') {
//       return C
//     } return PlayerImage
//   } else if (sportstype === 'kabaddi') {
//     if (Role === 'DEF') {
//       return DEFENDER
//     } else if (Role === 'ALLR') {
//       return RAID
//     } else if (Role === 'RAID') {
//       return RAID
//     } else {
//       return PlayerImage
//     }
//   }
// }

// export function baseballStaticImage (Role) {
//   if (Role === 'IF') {
//     return IF
//   } else if (Role === 'OF') {
//     return OF
//   } else if (Role === 'P') {
//     return P
//   } else if (Role === 'CT') {
//     return CT
//   } else {
//     return PlayerImage
//   }
// }

// export function hockeyStaticImage (Role) {
//   if (Role === 'GK') {
//     return GK
//   } else if (Role === 'DEF') {
//     return DEF
//   } else if (Role === 'MID') {
//     return MID
//   } else if (Role === 'FWD') {
//     return FWD
//   } else {
//     return PlayerImage
//   }
// }

// this is use for image accept function

export function acceptFormat () {
  return 'image/png, image/jpg, image/jpeg'
}

// use For after show number point digit
export function fixDigit (value) {
  return Number.isInteger(value) ? Number(value) : Number(value).toFixed(2)
}

// date formate common Function

export function dateFormate (value) {
  return value ? moment(value).format('DD/MM/YYYY hh:mm A') : 'No Data Available'
}
