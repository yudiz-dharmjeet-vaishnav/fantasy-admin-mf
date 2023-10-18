import axios from '../../axios'
const addSeason = async (aSeasons) => {
  return await axios.post('/gaming/admin/leadership-board-add-season/v1', { aSeasons })
}
export default addSeason
