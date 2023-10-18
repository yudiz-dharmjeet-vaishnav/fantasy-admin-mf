import axios from '../../axios'
const getFeedbackList = async (data) => {
  const { start, limit, sort, order, search, type, status, dateFrom, dateTo } = data
  return await axios.get(`/admin/complaint/v1?iUserId=${search}&start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&type=${type}&status=${status}&datefrom=${dateFrom}&dateto=${dateTo}`)
}

export default getFeedbackList
