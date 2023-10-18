import React, { Fragment, useRef } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'

import Layout from '../../../components/Layout'
import MainHeading from '../component/MainHeading'
import EmailTemplateListComponent from './EmailTemplateList'
// import { getEmailTemplateList } from '../../../actions/users'
import getEmailTemplateList from '../../../api/emailTemplate/getEmailTemplateList'

function EmailTemplate (props) {
  const content = useRef()
  // const dispatch = useDispatch()
  // const token = useSelector(state => state.auth.token)
  // const EmailTemplateList = useSelector(state => state.users.EmailTemplateList)

  function onExport () {
    content.current.onExport()
  }
  const { data: EmailTemplateList, isLoading } = useQuery({
    queryKey: ['getEmailTemplateList'],
    queryFn: () => getEmailTemplateList(),
    select: (response) => response?.data?.data
  })
  // function getList () {
  //   dispatch(getEmailTemplateList(token))
  // }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainHeading
              export="Export"
              heading="Email Template"
              list={EmailTemplateList}
              onExport={onExport}
            />
            <div className='without-pagination'>
              <EmailTemplateListComponent
                {...props}
                ref={content}
                // getList={getList}
                templatesList={EmailTemplateList}
                isLoading={isLoading}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

export default EmailTemplate
