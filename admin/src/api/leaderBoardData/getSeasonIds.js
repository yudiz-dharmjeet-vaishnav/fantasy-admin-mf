import axios from '../../axios'
const getSeasonIds = async (start, limit, search) => {
  return await axios.get(`/gaming/admin/season-id-list/v1?start=${start}&limit=${limit}&search=${search}`)
}
export default getSeasonIds
