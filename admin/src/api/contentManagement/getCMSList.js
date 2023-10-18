import axios from '../../axios'
const getCMSList = async (start, limit, search) => {
  return await axios.get(`/statics/admin/cms/v1?start=${start}&limit=${limit}&search${search}`)
}
export default getCMSList
