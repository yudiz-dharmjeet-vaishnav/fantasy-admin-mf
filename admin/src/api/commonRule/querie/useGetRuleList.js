import axios from '../../../axios'

const getRuleList = async (start, limit) => {
  return await axios.get(`/gaming/admin/rules/v1?start=${start}&limit=${limit}`)
}
export default getRuleList
