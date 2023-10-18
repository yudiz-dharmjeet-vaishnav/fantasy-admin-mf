import axios from '../../axios'
const getSideBackgroundImage = async (key) => {
  return await axios.get(`/gaming/admin/side-background/${key}/v1`)
}

export default getSideBackgroundImage
