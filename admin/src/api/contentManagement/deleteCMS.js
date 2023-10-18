import axios from '../../axios'
const deleteCMS = async (Id) => {
  return await axios.delete(`/statics/admin/cms/${Id}/v1`)
}
export default deleteCMS
