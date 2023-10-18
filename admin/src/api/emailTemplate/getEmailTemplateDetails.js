import axios from '../../axios'
const getEmailTemplateDetails = async (slug) => {
  return await axios.get(`/statics/admin/email-template/${slug}/v1`)
}
export default getEmailTemplateDetails
