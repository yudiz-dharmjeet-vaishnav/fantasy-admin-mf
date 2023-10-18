import axios from '../../axios'
const getOfferList = async (start, limit, sort, order, search) => {
  return await axios.get(`/statics/admin/offer/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}`)
}

export default getOfferList
