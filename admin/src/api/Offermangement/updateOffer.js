import axios from '../../axios'
const updateOffer = async (updateOfferData) => {
  const { Title, Details, Description, Active, offerImage, offerId } = updateOfferData
  if (offerImage && offerImage.file) {
    const response = await axios.post('/statics/admin/offer/pre-signed-url/v1', { sFileName: offerImage.file.name, sContentType: offerImage.file.type })
    const url = response.data.data.sUrl
    const sImage = response.data.data.sPath
    // await axios.put(bImgUrl, sImage.file, { headers: { 'Content-Type': sImage.file.type, noAuth: true } })
    await axios.put(url, offerImage.file, { headers: { 'Content-Type': offerImage.file.type, noAuth: true } })
    return await axios.put(`/statics/admin/offer/${offerId}/v1`, {
      sTitle: Title, sDetail: Details, sDescription: Description, eStatus: Active, sImage
    })
  } else {
    return await axios.put(`/statics/admin/offer/${offerId}/v1`, {
      sTitle: Title, sDetail: Details, sDescription: Description, eStatus: Active, sImage: offerImage
    })
  }
}
export default updateOffer
