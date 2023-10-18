import React, { Fragment, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { useQuery } from '@tanstack/react-query'

import Layout from '../../../components/Layout'
import CommonRuleList from './CommonRuleList'
import MainHeading from '../component/MainHeading'
import getRuleList from '../../../api/commonRule/querie/useGetRuleList'

function CommonRules (props) {
  const content = useRef()

  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)

  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  // const token = useSelector(state => state?.auth?.token)
  // const { data: ruleList, isLoading } = useGetRuleList(token)

  const { data: ruleList, isLoading } = useQuery({
    queryKey: ['getRuleList', start, offset],
    queryFn: () => getRuleList(start, offset),
    select: (res) => res?.data?.data
  })

  function onExport () {
    content.current.onExport()
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainHeading
              export="Export"
              heading="Common Rules"
              list={ruleList}
              onExport={onExport}
              permission={(Auth && Auth === 'SUPER') || (adminPermission?.RULE !== 'R')}
            />
            <div className='without-pagination'>
              <CommonRuleList
                {...props}
                ref={content}
                rulesList={ruleList}
                isLoading={isLoading}
                start={start}
                setStart={setStart}
                offset={offset}
                setOffset={setOffset}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

export default CommonRules
