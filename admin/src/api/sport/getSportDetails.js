import axios from '../../axios'
const getSportDetails = async (ID) => {
  return await axios.get(`/gaming/admin/sport/${ID}/v1`)
}

export default getSportDetails
