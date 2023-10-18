import axios from '../../axios'
const getSettingList = async (start, limit, sort, order, search, isFullList) => {
  const data = await axios.get(`/gaming/admin/setting/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&isFullResponse=${isFullList}`)
  return data
}

export default getSettingList
