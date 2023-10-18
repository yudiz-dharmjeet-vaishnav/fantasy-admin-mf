import React, { useState, Fragment, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import PropTypes from 'prop-types'

import editButton from '../../../assets/images/edit-pen-icon.svg'

import SkeletonTable from '../../../components/SkeletonTable'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import { modalMessageFunc } from '../../../helpers/helper'
function PlayerRole (props) {
  const {
    sportsType, getList, EditPlayerRoleLink
  } = props
  const [loading, setLoading] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)

  const playerRoleList = useSelector(state => state.playerRole.playerRoleList)
  const resStatus = useSelector(state => state.playerRole.resStatus)
  const resMessage = useSelector(state => state.playerRole.resMessage)
  const previousProps = useRef({ playerRoleList, resStatus, resMessage }).current

  useEffect(() => {
    getList()
    setLoading(true)
  }, [sportsType])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          getList()
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.playerRoleList !== playerRoleList) {
      if (playerRoleList) {
        setLoading(false)
      }
    }
    return () => {
      previousProps.playerRoleList = playerRoleList
    }
  }, [playerRoleList])

  return (
    <Fragment>
      {
      !loading && playerRoleList?.length === 0
        ? (
          <DataNotFound message="PlayerRoleList" obj=""/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">

              <AlertMessage
                close={close}
                message={message}
                modalMessage={modalMessage}
                status={status}
              />
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Role</th>
                    <th>Short Name</th>
                    <th>Min player</th>
                    <th>Max Player</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={6} />
                    : (
                      <Fragment>
                        {
                    playerRoleList && playerRoleList.length !== 0 && playerRoleList.map((data, i) => (
                      <tr key={data._id}>
                        <td>{i + 1}</td>
                        <td>{data.sFullName}</td>
                        <td>{data.sName}</td>
                        <td>{data.nMin}</td>
                        <td>{data.nMax}</td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Button className="view" color="link" tag={Link} to={`${EditPlayerRoleLink}/${data._id}`}>
                                <Button className='edit-btn-icon'>
                                  <img alt="View" src={editButton} />
                                </Button>
                              </Button>
                            </li>
                          </ul>
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

PlayerRole.propTypes = {
  sportsType: PropTypes.string,
  EditPlayerRoleLink: PropTypes.string,
  getList: PropTypes.func
}

export default PlayerRole
