import axios from '../../../axios'

const updateRule = async ({ eRule, sRuleName, nAmount, eType, eStatus, nExpireDays, sRewardOn, Id, sKYCDoc }) => {
  if (eRule === 'RR') {
    return await axios.put(`/gaming/admin/rules/${Id}/v1`, {
      eRule,
      sRuleName,
      nAmount,
      eType,
      eStatus,
      nExpireDays,
      sRewardOn
    })
  } else {
    return await axios.put(`/gaming/admin/rules/${Id}/v1`, {
      eRule,
      sRuleName,
      nAmount,
      eType,
      eStatus,
      nExpireDays,
      sKYCDoc
    })
  }
}
export default updateRule
