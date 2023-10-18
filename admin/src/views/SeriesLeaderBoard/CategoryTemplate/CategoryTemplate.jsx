import React, { useState, Fragment, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import SkeletonTable from '../../../components/SkeletonTable'
import { modalMessageFunc } from '../../../helpers/helper'
import { getUrl } from '../../../actions/url'

function CategoryTemplateList (props) {
  const { list, getList } = props
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const dispatch = useDispatch()
  const previousProps = useRef({ list }).current

  useEffect(() => {
    if (location.state) {
      if (location.state.message) {
        setMessage(location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      navigate(location.pathname, { replace: true })
    }
    dispatch(getUrl('media'))
    getList()
    setLoading(true)
  }, [])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.list !== list) {
      if (list) {
        setLoading(false)
      }
    }
    return () => {
      previousProps.list = list
    }
  }, [list])

  return (
    <Fragment>
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="Category Template" obj=''/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th> No. </th>
                    <th> Name </th>
                    <th> Type </th>
                    <th> Info </th>
                    <th> Image </th>
                    <th> Column Text </th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={6} />
                    : (
                      <Fragment>
                        {
                    list && list.length !== 0 && list.map((data, index) => (
                      <tr key={data._id}>
                        <td>{index + 1}</td>
                        <td>
                          {data.sName}
                        </td>
                        <td>
                          {data.eType}
                        </td>
                        <td>
                          {data.sInfo}
                        </td>
                        <td>
                          {url && data.sImage
                            ? <img alt="No Image" className="theme-image" src={url + data.sImage} />
                            : ' No Image '
                          }
                        </td>
                        <td>
                          {data.sColumnText}
                        </td>
                      </tr>
                    ))
                  }
                      </Fragment>
                      )
            }
                </tbody>
              </table>
            </div>
          </div>
          )}
    </Fragment>
  )
}

CategoryTemplateList.propTypes = {
  list: PropTypes.object,
  getList: PropTypes.func,
  location: PropTypes.object,
  history: PropTypes.object
}

export default CategoryTemplateList
