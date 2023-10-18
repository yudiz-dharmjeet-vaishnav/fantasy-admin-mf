import axios from '../../axios'
const getCurrencyData = async () => {
  return await axios.get('/gaming/admin/currency/v1')
}
export default getCurrencyData
