import React, { Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'reactstrap'
import PropTypes from 'prop-types'

import addIcon from '../../../assets/images/add-icon.svg'
import backIcon from '../../../assets/images/back-icon-1.svg'
import excelIcon from '../../../assets/images/export-icon.svg'

function SubAdminMainHeader (props) {
  const {
    isMatchLog,
    isLeagueLog,
    permission,
    permissionComponent,
    List,
    AddSubAdmin,
    onSubmit,
    updateDisable,
    button,
    Auth,
    adminPermission,
    EditRole,
    MatchAPILog,
    cancelLink,
    SingleLogs
  } = props

  const navigate = useNavigate()
  const page = JSON?.parse(localStorage?.getItem('queryParams'))

  return (
    <div className="header-block">
      <div className="subAdmin-header d-flex justify-content-between ">
        <div className='d-flex inline-input align-items-center'>
          {(AddSubAdmin || EditRole || MatchAPILog) && <img className='custom-go-back' height='20' onClick={() => navigate(-1)} src={backIcon} width='20' />}
          {(isMatchLog || isLeagueLog || SingleLogs) && <img className='custom-go-back' height='20' onClick={() => navigate(-1)} src={backIcon} width='20' />}
          <h2 className='heading ml-2'>{props.header}</h2>
        </div>
        <div className="btn-list">
          {
            EditRole && <Button className="theme-btn outline-btn outline-theme mr-2" tag={Link} to={`${cancelLink}${page?.RolesManagement || ''}`}>Cancel</Button>
          }
          {props?.onExport && List && (List.total > 0 || List?.length >= 1) && (
          <Button className="theme-btn icon-btn-export ml-2" onClick={props?.onExport}>
            <img alt="add" src={excelIcon} />
            {props.export}
          </Button>
          )}
          {permission && permissionComponent &&
            <img alt="add" className="header-button" onClick={() => navigate(props?.addLink)} src={addIcon} style={{ cursor: 'pointer' }} title={props?.buttonText}/>
          }
          {props?.refresh && (
            <Button className='theme-btn icon-btn-refresh ml refresh' onClick={props?.onRefresh}>
              {props?.refresh}
            </Button>
          )}

          {AddSubAdmin &&
            ((Auth && Auth === 'SUPER') || (adminPermission?.SUBADMIN !== 'R')) && (
              <Fragment>
                <Button className="theme-btn " disabled={updateDisable} onClick={onSubmit}>
                  {button}
                </Button>
              </Fragment>
          )
          }
          { EditRole &&
             ((Auth && Auth === 'SUPER') || (adminPermission?.ADMIN_ROLE !== 'R')) &&
              (
                <Fragment>
                  <Button className="theme-btn" disabled={!props.name} onClick={onSubmit}>
                    {button()}
                  </Button>
                </Fragment>
              )
            }
        </div>
      </div>

    </div>
  )
}

SubAdminMainHeader.propTypes = {
  onExport: PropTypes.func,
  permission: PropTypes.bool,
  permissionComponent: PropTypes.any,
  addLink: PropTypes.string,
  buttonText: PropTypes.string,
  header: PropTypes.string,
  List: PropTypes.object,
  onClick: PropTypes.func,
  refresh: PropTypes.bool,
  onRefresh: PropTypes.func,
  isMatchLog: PropTypes.string,
  isLeagueLog: PropTypes.string,
  export: PropTypes.string,
  AddSubAdmin: PropTypes.bool,
  EditRole: PropTypes.bool,
  MatchAPILog: PropTypes.bool,
  onSubmit: PropTypes.func,
  updateDisable: PropTypes.bool,
  button: PropTypes.func,
  Auth: PropTypes.string,
  adminPermission: PropTypes.string,
  page: PropTypes.object,
  cancelLink: PropTypes.string,
  SingleLogs: PropTypes.bool,
  name: PropTypes.string
}

export default SubAdminMainHeader
