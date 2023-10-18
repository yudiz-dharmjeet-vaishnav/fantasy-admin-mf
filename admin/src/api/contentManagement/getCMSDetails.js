import axios from '../../axios'

const getCMSDetails = async (Slug) => {
  return await axios.get(`/statics/admin/cms/${Slug}/v1`)
}

export default getCMSDetails
