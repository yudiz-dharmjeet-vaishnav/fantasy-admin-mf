import axios from '../../axios'
const getSettingDetails = async (Id) => {
  return await axios.get(`/gaming/admin/setting/${Id}/v1`)
}

export default getSettingDetails
