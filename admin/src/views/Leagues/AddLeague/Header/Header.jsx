import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, FormGroup } from 'reactstrap'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

function Header (props) {
  const {
    isCreate,
    addLeaguepriceBreakup,
    openModalFunc,
    openModalAnayltics
  } = props

  const LeagueDetails = useSelector((state) => state.league.LeagueDetails)
  const { id } = useParams()
  return (
    <>
      {!isCreate && (
        <div className="btn-league-headers title d-flex align-items-center fdc-480 align-start-480">
          <FormGroup className="btn-league-header d-flex justify-content-between mb-0 fdc-480">
            {isCreate
              ? null
              : (
                <div className="d-flex inline-input league-button">
                  <Button className="theme-btn blue-btn mr-3" onClick={() => openModalAnayltics(id)}>
                    League Analytics
                  </Button>
                  <Button className="theme-btn d-inline-flex justify-content-center align-items-center green-btn mr-3" tag={Link} to={addLeaguepriceBreakup}>
                    League Prize BreakUp
                  </Button>
                  <Button className="theme-btn d-inline-flex justify-content-center align-items-center orange-btn mr-3" state= {{ leageToAdminLogs: true }} tag={Link} to={{ pathname: `/admin-logs/logs/${LeagueDetails?._id}` }}>
                    League Logs
                  </Button>
                  <Button className='theme-btn purple-btn' onClick={() => openModalFunc()}>
                    Copy League
                  </Button>
                </div>
                )}
          </FormGroup>
        </div>
      )}
    </>
  )
}
Header.propTypes = {
  isCreate: PropTypes.bool,
  addLeaguepriceBreakup: PropTypes.string,
  openModalFunc: PropTypes.func,
  openModalAnayltics: PropTypes.func
}

export default Header
