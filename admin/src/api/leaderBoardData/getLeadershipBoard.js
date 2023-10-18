import axios from '../../axios'
const getLeadershipBoard = async () => {
  return await axios.get('/gaming/admin/leadership-board/v2')
}
export default getLeadershipBoard
