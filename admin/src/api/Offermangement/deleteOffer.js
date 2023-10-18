import axios from '../../axios'
const deleteOffer = async (Id) => {
  return await axios.delete(`/statics/admin/offer/${Id}/v1`)
}
export default deleteOffer
