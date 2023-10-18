import axios from '../../axios'
const addCMS = async (addDataCMS) => {
  const { Title, Description, Slug, Category, Details, priority, contentStatus } = addDataCMS
  return await axios.post('/statics/admin/cms/add/v1', {
    sTitle: Title,
    sDescription: Description,
    sSlug: Slug,
    sCategory: Category,
    sContent: Details,
    nPriority: priority,
    eStatus: contentStatus
  })
}
export default addCMS
