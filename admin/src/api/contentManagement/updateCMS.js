import axios from '../../axios'
const updateCMS = async (updateDataCMS) => {
  const { Title, Description, Slug, Category, Details, priority, contentStatus, cmsId } = updateDataCMS
  return await axios.put(`/statics/admin/cms/${cmsId}/v1`, {
    sTitle: Title,
    sDescription: Description,
    sCategory: Category,
    sSlug: Slug,
    sContent: Details,
    nPriority: priority,
    eStatus: contentStatus
  })
}
export default updateCMS
