import React, { Fragment, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import Layout from '../../../../components/Layout'
import UpdatePointComponent from './UpdatePoint'
import SportsMainHeader from '../../SportsMainHeader'

function UpdatePoint (props) {
  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''
  const [updateDisableButton, setUpdateDisableButton] = useState('')
  const [multiDisableButton, setMultiDisableButton] = useState('')
  const [errPoints, setErrPoints] = useState('')
  const content = useRef()
  const page = JSON.parse(localStorage.getItem('queryParams'))

  function onSubmit () {
    content.current.onSubmit()
  }

  function onInsideSubmit () {
    content.current.onInsideSubmit()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <SportsMainHeader
          {...props}
          UpdatePoint
          cancelLink={`/${sportsType}/point-system${page?.PointSystem || ''}`}
          errPoints={errPoints}
          heading="Edit Score Point"
          multiDisableButton={multiDisableButton}
          onInsideSubmit={onInsideSubmit}
          onSubmit={onSubmit}
          sportsType={sportsType}
          updateDisableButton={updateDisableButton}
        />
        <div className='without-pagination'>
          <UpdatePointComponent
            {...props}
            ref={content}
            errPoints={errPoints}
            setErrPoints={setErrPoints}
            setMultiDisableButton={setMultiDisableButton}
            setUpdateDisableButton={setUpdateDisableButton}
          />
        </div>
      </Layout>
    </Fragment>
  )
}

UpdatePoint.propTypes = {
  location: PropTypes.object
}
export default UpdatePoint
