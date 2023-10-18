import React from 'react'

import SubAdminMainHeader from '../../components/SubAdminMainHeader'
import SingleLogDetails from './SingleLogDetails'
import Layout from '../../../../components/Layout'

function SingleLog (props) {
  return (
    <>
      <Layout>
        <SubAdminMainHeader
          {...props}
          SingleLogs
          header="Activity Details"
        />
        <div className='without-pagination'>
          <SingleLogDetails
            {...props}
          />
        </div>
      </Layout>
    </>
  )
}

export default SingleLog
