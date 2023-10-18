// /gaming/admin/rules/rewards/list/v1
import axios from '../../../axios'

const getRewardsList = async () => {
  return await axios.get('/gaming/admin/rules/rewards/list/v1')
}
export default getRewardsList
