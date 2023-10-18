import axios from '../../axios'
const deleteVersion = async (Id) => {
  return await axios.delete(`/statics/admin/version/${Id}/v1`)
}

export default deleteVersion
