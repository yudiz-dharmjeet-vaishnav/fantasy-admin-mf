import axios from '../../axios'

const submitSiteSideBackgroundImage = async (bgImage, key) => {
  const response = await axios.post(
    '/gaming/admin/side-background/pre-signed-url/v1',
    { sFileName: bgImage.file.name, sContentType: bgImage.file.type }
  )

  const url = response.data.data.sUrl
  const sImage = response.data.data.sPath

  await axios.put(url, bgImage.file, { headers: { 'Content-Type': bgImage.file.type } })

  const response1 = await axios.post(
    '/gaming/admin/side-background/v1',
    { sImage, sKey: key }
  )

  return response1.data
}

export default submitSiteSideBackgroundImage
