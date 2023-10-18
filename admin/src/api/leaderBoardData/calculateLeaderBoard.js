import axios from '../../axios'
const calculateLeaderBoard = async () => {
  return await axios.post('/gaming/admin/leadership-board/v2')
}
export default calculateLeaderBoard
