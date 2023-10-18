import axios from '../../axios'
const addOffer = async (addOfferData) => {
  const { Title, Details, Description, Active, offerImage } = addOfferData
  try {
    if (offerImage) {
      const response = await axios.post('/statics/admin/offer/pre-signed-url/v1', { sFileName: offerImage.file.name, sContentType: offerImage.file.type })
      const url = response.data.data.sUrl
      const sImage = response.data.data.sPath
      await axios.put(url, offerImage?.file, { headers: { 'Content-Type': offerImage?.file?.type, noAuth: true } })
      return await axios.post('/statics/admin/offer/add/v1', {
        sTitle: Title, sDetail: Details, sDescription: Description, eStatus: Active, sImage
      })
    } else {
      return await axios.post('/statics/admin/offer/add/v1', {
        sTitle: Title, sDetail: Details, sDescription: Description, eStatus: Active, sImage: ''
      })
    }
  } catch (error) {
    console.log('error', error)
  }
}

export default addOffer
