import React, { Fragment } from 'react'

import AddCategoryTemplate from './AddCategoryTemplate'
import Layout from '../../../../components/Layout'

// this component is not in used
// this will use in future
function AddTemplate (props) {
  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <AddCategoryTemplate
              {...props}
              cancelLink="/category-template"
            />
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

export default AddTemplate
