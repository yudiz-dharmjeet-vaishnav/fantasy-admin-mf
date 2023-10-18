import axios from '../../axios'

const imageUpload = (image) => async (dispatch) => {
  const response = await axios.post('/statics/admin/email-template/pre-signed-url/v1', { sFileName: image.name, sContentType: image.type })
  const url = response.data.data.sUrl
  const sImage = response.data.data.sPath
  console.log('sImage', sImage)
  const response2 = await axios.put(url, image, { headers: { 'Content-Type': image.type, noAuth: true } })
  return response2
}

export default imageUpload
