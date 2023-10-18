
import axios from '../../axios'
const getEmailTemplateList = async () => {
  return await axios.get('/statics/admin/email-template/v1')
}

export default getEmailTemplateList
