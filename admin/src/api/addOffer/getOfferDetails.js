import axios from '../../axios'
const getOfferDetails = async (Id) => {
  return await axios.get(`/statics/admin/offer/${Id}/v1`)
}
export default getOfferDetails
