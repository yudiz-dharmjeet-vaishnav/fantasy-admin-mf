import axios from '../../axios'
const getUrl = type => async (dispatch) => {
  return await axios.get(`/gaming/get-url/${type}/v1`)
}

export default getUrl
