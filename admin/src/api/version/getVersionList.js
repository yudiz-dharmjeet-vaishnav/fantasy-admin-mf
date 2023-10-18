import axios from '../../axios'
const getVersionList = async (start, limit) => {
  return await axios.get(`/statics/admin/version/list/v1?start=${start}&limit=${limit}`)
}

export default getVersionList
