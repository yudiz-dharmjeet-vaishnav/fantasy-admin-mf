import { axios2 } from '../../actions/systemusers'
const getAutoKillDetails = async (token) => {
  return await axios2.get('/system/admin/auto-kill-agent/v1', { headers: { Authorization: token } })
}

export default getAutoKillDetails
