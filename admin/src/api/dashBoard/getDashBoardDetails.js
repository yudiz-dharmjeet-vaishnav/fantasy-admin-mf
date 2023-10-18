import axios from '../../axios'
const getDashBoardDetails = async () => {
  return await axios.get('/gaming/admin/dashboard/v1')
}

export default getDashBoardDetails
