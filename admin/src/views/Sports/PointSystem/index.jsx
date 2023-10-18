import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import Heading from '../../Settings/component/Heading'
import PointSystemManagement from './PointSystemManagement'
import MainHeading from '../../Settings/component/MainHeading'
import { getFormatsList, getPointSystemList } from '../../../actions/pointSystem'

function PointSystem (props) {
  const location = useLocation()
  const [format, setFormat] = useQueryState('format', '')
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const token = useSelector(state => state.auth.token)
  const getPointSystemsList = useSelector(state => state.pointSystem.getPointSystemList)
  const FormatsList = useSelector(state => state.pointSystem.getFormatsList)
  const dispatch = useDispatch()
  const content = useRef()

  const sportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('baseball') ? 'baseball' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''
  const previousProps = useRef({ format, sportsType }).current

  function onExport () {
    content.current.onExport()
  }

  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
    if (obj.format) {
      setFormat(obj.format)
    }
  }, [])

  useEffect(() => {
    if (format && (previousProps.format !== format)) {
      getList(searchText)
      setLoading(true)
    }

    return () => {
      previousProps.format = format
    }
  }, [format])

  useEffect(() => {
    getFormatList(sportsType)
    if (previousProps.sportsType !== sportsType) {
      if (sportsType === 'cricket') {
        setFormat('T20')
      }
      if (sportsType === 'football') {
        setFormat('FOOTBALL')
      }
      if (sportsType === 'basketball') {
        setFormat('BASKETBALL')
      }
      if (sportsType === 'kabaddi') {
        setFormat('KABADDI')
      }
      if (sportsType === 'baseball') {
        setFormat('BASEBALL')
      }
      if (sportsType === 'hockey') {
        setFormat('hockey')
      }
      if (sportsType === 'csgo') {
        setFormat('CSGO')
      }
      if (sportsType === 'dota2') {
        setFormat('DOTA2')
      }
      if (sportsType === 'lol') {
        setFormat('lol')
      }

      setLoading(true)
      setSearchText('')
    }

    return () => {
      previousProps.sportsType = sportsType
    }
  }, [sportsType])

  function formatChangefun (e) {
    setFormat(e.target.value)
  }

  function getFormatList (type) {
    dispatch(getFormatsList(type, token))
  }

  function getList (search) {
    let type
    if (!format) {
      if (sportsType === 'cricket') {
        type = 'T20'
        setFormat(type)
      }
      if (sportsType === 'football') {
        type = 'FOOTBALL'
        setFormat(type)
      }
      if (sportsType === 'basketball') {
        type = 'BASKETBALL'
        setFormat(type)
      }
      if (sportsType === 'kabaddi') {
        type = 'KABADDI'
        setFormat(type)
      }
      if (sportsType === 'hockey') {
        type = 'HOCKEY'
        setFormat(type)
      }
      if (sportsType === 'csgo') {
        type = 'CSGO'
        setFormat(type)
      }
      if (sportsType === 'dota2') {
        type = 'DOTA2'
        setFormat(type)
      }
      if (sportsType === 'lol') {
        type = 'LOL'
        setFormat(type)
      }
      dispatch(getPointSystemList(search.trim(), type, token))
    } else {
      dispatch(getPointSystemList(search.trim(), format, token))
    }
  }

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setinitialFlag(true)
  }

  return (
    <Fragment>
      <Layout {...props} >

        <main className="main-content">
          <section className="management-section common-box">
            <MainHeading
              FormatsList={FormatsList}
              export="Export"
              heading="Point System"
              info
              onExport={onExport}
            />
            <div className='without-pagination'>
              <Heading
                FormatsList={FormatsList}
                format={format}
                handleChange={formatChangefun}
                handleSearch={onHandleSearch}
                permission
                pointSystem
                search={searchText}
              />
              <PointSystemManagement
                {...props}
                ref={content}
                flag={initialFlag}
                format={format}
                getFormatList={getFormatList}
                getList={getList}
                getPointSystemsList={getPointSystemsList}
                loading={loading}
                search={searchText}
                setLoading={setLoading}
                sportsType={sportsType}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

PointSystem.propTypes = {
  location: PropTypes.object
}

export default PointSystem
