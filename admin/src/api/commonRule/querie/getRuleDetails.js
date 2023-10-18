import axios from '../../../axios'

const getRuleDetails = async (ID) => {
  return await axios.get(`/gaming/admin/rules/${ID}/v1`)
}
export default getRuleDetails
