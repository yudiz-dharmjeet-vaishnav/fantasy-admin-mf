import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Layout from '../../../components/Layout'
import CategoryTemplateList from './CategoryTemplate'
import MainLeagueHeader from '../../Leagues/MainHeader/MainLeagueHeader'
import { getSeriesLBCategoriesTemplateList } from '../../../actions/seriesLeaderBoard'

function CategoryTemplate (props) {
  const token = useSelector(state => state.auth.token)
  const categoryTemplateList = useSelector(state => state.seriesLeaderBoard.categoryTemplateList)
  const dispatch = useDispatch()

  function getList () {
    dispatch(getSeriesLBCategoriesTemplateList(token))
  }

  return (
    <Fragment>
      <Layout {...props} >
        <div>
          <main className="main-content">
            <section className="management-section common-box">
              <MainLeagueHeader
                heading="Category Templates"
              />
              <CategoryTemplateList
                {...props}
                getList={getList}
                list={categoryTemplateList}
              />
            </section>
          </main>
        </div>
      </Layout>
    </Fragment>
  )
}

export default CategoryTemplate
