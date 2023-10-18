import axios from '../../axios'
const getSportsList = async () => {
  return await axios.get('/gaming/admin/sport/list/v1')
}

export default getSportsList
