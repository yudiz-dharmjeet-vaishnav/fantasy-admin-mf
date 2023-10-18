import axios from '../../axios'
const getMaintenanceMode = async () => {
  return await axios.get('/statics/admin/maintenance-mode/v1')
}

export default getMaintenanceMode
