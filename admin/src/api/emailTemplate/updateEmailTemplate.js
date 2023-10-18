import axios from '../../axios'
const updateEmailTemplate = async (updateEmailTemplateData) => {
  const { Slug, Title, Description, Content, Subject, EmailStatus, ID } = updateEmailTemplateData
  return await axios.put(`/statics/admin/email-template/${ID}/v1`, {
    sSlug: Slug,
    sTitle: Title,
    sContent: Content,
    sSubject: Subject,
    sDescription: Description,
    eStatus: EmailStatus
  })
}

export default updateEmailTemplate
