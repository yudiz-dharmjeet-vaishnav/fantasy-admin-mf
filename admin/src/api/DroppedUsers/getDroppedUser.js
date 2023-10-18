import axios from '../../axios'
const getDroppedUser = async (data) => {
  const { start, limit, sort, order, search, type, startDate, endDate } = data
  await axios.get(`gaming/admin/dropped-registrations/list/v1?nStart=${start}&nLimit=${limit}&sSort=${sort}&sOrder=${order}&sSearch=${search}&dDateFrom=${startDate}&dDateTo=${endDate}&sType=${type}`)
}

export default getDroppedUser
