import React, { forwardRef, Fragment, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button, FormGroup, Input, Form, CustomInput, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu, Row, Col } from 'reactstrap'
import { useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import PropTypes from 'prop-types'

import calendarIcon from '../../../assets/images/calendar.svg'
import addlIcon from '../../../assets/images/add-white-icon.svg'
import closeIcon from '../../../assets/images/close-icon.svg'

// Common header component for sub admin tab
function SubAdminHeader (props) {
  const { isMatchLog, isLeagueLog, dateFlag, recommendedList, permission, List, adminLogs, adminsList, adminSearch, handleAdminSearch, handleOtherFilter, searchType, startDate, endDate, dateRange, setDateRange, matchApiLogUrl, matchApiLogs, filter, onFilter, subAdmin } = props
  const [show, setShow] = useState(false)
  const location = useLocation()
  const previousProps = useRef({ recommendedList }).current
  const Auth = useSelector((state) => state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)

  useEffect(() => {
    if (previousProps?.recommendedList !== recommendedList && recommendedList) {
      setShow(true)
    }
    return () => {
      previousProps.recommendedList = recommendedList
    }
  }, [recommendedList])

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range' onClick={onClick}>
      <img alt="calendar" src={calendarIcon} />
      <Input ref={ref} className='mx-2 range' placeholder='Select Date Range' readOnly value={value} />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput
  return (
    <div className="header-block">
      {(!location?.pathname?.includes(('/admin-logs/logs')) && !matchApiLogs) && (
      <div className="filter-block d-flex justify-content-between align-items-start fdc-480">
        <Form className="d-flex fdc-480 flex-wrap subAdmin-filter align-items-center">
          {(props?.Searchable || (props?.adminLogs && (!isMatchLog) && (!isLeagueLog) && (searchType !== 'AW' && searchType !== 'AD' && searchType !== 'D' && searchType !== 'W' && searchType !== 'KYC' && searchType !== 'P' && searchType !== 'BD' && searchType !== ''))) && (
          <FormGroup>
            {props.adminLogs && (
            <Input className="search-box"
              close
              name="search"
              onChange={(e) => { props?.handleNormalSearch(e?.target?.value) }}
              placeholder='Search'
              type="search"
              value={props?.search}
            />
            )}
            {!props?.adminLogs && <Input className="search-box" close name="search" onChange={props?.handleSearch} placeholder='Search' type="search" value={props?.search} />}
          </FormGroup>
          )}
          {props?.adminLogs && (!isMatchLog) && (!isLeagueLog) && (searchType === 'AW' || searchType === 'AD' || searchType === 'D' || searchType === 'W' || searchType === 'KYC' || searchType === 'P' || searchType === 'BD' || searchType === '') && (
            <FormGroup>
              <UncontrolledDropdown>
                <DropdownToggle caret className='searchList w-100' nav>
                  <Input
                    autoComplete="off"
                    className='search-box'
                    name='search'
                    onChange={(e) => {
                      props?.handleRecommendedSearch(e, e?.target?.value)
                      props?.handleChangeSearch(e, '')
                      setShow(true)
                    }}
                    onKeyPress={(e) => {
                      props?.handleRecommendedSearch(e, e?.target?.value)
                      props?.handleChangeSearch(e, '')
                    }}
                    placeholder='Search'
                    type='text'
                    value={props?.search || props?.userSearch}
                  />
                </DropdownToggle>
                {(props?.search || props?.userSearch)
                  ? (
                    <img alt="close"
                      className='custom-close-img'
                      onClick={(e) => {
                        props?.handleRecommendedSearch(e, '')
                        props?.handleChangeSearch(e, '')
                      }
                    }
                      src={closeIcon}
                    />
                    )
                  : ''}
                {(List?.total >= 1 || List?.aResult?.length >= 1) && (
                  <DropdownMenu className={recommendedList?.length >= 1 ? 'recommended-search-dropdown' : ''} open={show}>
                    {recommendedList?.length >= 1
                      ? (typeof (props.userSearch) === 'number')
                          ? (
                            <Fragment>
                              {
                              recommendedList?.length > 0 && recommendedList?.map((recommendedData, index) => {
                                return (
                                  <DropdownItem key={index} onClick={(e) => { props?.handleChangeSearch(e, recommendedData.sMobNum) }}>
                                    {recommendedData?.sMobNum}
                                  </DropdownItem>
                                )
                              })
                            }
                            </Fragment>
                            )
                          : (
                            <Fragment>
                              {
                              recommendedList?.length > 0 && recommendedList?.map((recommendedData, index) => {
                                return (
                                  <DropdownItem key={index} onClick={(e) => { props?.handleChangeSearch(e, recommendedData?.sEmail) }}>
                                    {recommendedData?.sEmail}
                                  </DropdownItem>
                                )
                              })
                            }
                            </Fragment>
                            )
                      : (
                        <DropdownItem>
                          User not found
                        </DropdownItem>
                        )
                    }
                  </DropdownMenu>
                )}
              </UncontrolledDropdown>
            </FormGroup>
          )}

          {adminLogs && (!isMatchLog) && (!isLeagueLog) && (
          <FormGroup>
            <DatePicker
              customInput={<ExampleCustomInput />}
              dropdownMode="select"
              endDate={endDate}
              isClearable={true}
              maxDate={new Date()}
              onChange={(update) => {
                setDateRange(update) &&
                 (dateFlag.current = true)
              }}
              placeholderText='Select Date Range'
              selectsRange={true}
              showMonthDropdown
              showYearDropdown
              startDate={startDate}
              value={dateRange}
            />
          </FormGroup>
          )}
          {subAdmin && (
          <FormGroup>
            <DatePicker
              customInput={<ExampleCustomInput />}
              dropdownMode="select"
              endDate={endDate}
              isClearable={true}
              maxDate={new Date()}
              onChange={(update) => {
                setDateRange(update)
              }}
              placeholderText='Select Date Range'
              selectsRange={true}
              showMonthDropdown
              showYearDropdown
              startDate={startDate}
              value={dateRange}
            />
          </FormGroup>
          )}

          {props.adminLogs && (!isMatchLog) && (!isLeagueLog) && (
          <FormGroup>
            <CustomInput
              className="mt-1 searchFilter"
              id="type"
              name="type"
              onChange={handleOtherFilter}
              type="select"
              value={searchType}
            >
              <option value=''>Operation Type</option>
              <option value='D'>Process Deposit</option>
              <option value='W'>Process Withdraw</option>
              <option value='KYC'>KYC</option>
              <option value='BD'>Bank Details</option>
              <option value='SUB'>Sub Admin</option>
              <option value='AD'>Deposit</option>
              <option value="AW">Withdraw</option>
              <option value="P">Profile</option>
              <option value="PC">Promo Code</option>
              <option value="L">League</option>
              <option value="PB">League Prize Breakup</option>
              <option value="M">Match</option>
              <option value="ML">Match League</option>
              <option value="MP">Match Player</option>
              <option value="S">Settings</option>
              <option value="CR">Common Rules</option>
              <option value="CF">Complaints & Feedback</option>
              <option value='LB'>Leaderboard</option>
              <option value="SLB">Series Leaderboard</option>
            </CustomInput>
          </FormGroup>
          )}
          {adminLogs && (!isMatchLog) && (!isLeagueLog) && (
            <FormGroup>
              <CustomInput
                className="mt-1 status-s"
                id="type"
                name="type"
                onChange={(event) => handleAdminSearch(event)}
                type="select"
                value={adminSearch}
              >
                <option key='' value=''>Select Admin</option>
                {adminsList && adminsList?.length !== 0 && adminsList?.map((data, i) => {
                  return (
                    <>
                      {
                      data?.sUsername &&
                      <option key={data?._id} value={data?._id}>{data?.sUsername}</option>
                    }
                    </>
                  )
                })}
              </CustomInput>
            </FormGroup>
          )}

        </Form>
        <div className="btn-list ">
          {isMatchLog && adminLogs && ((Auth && Auth === 'SUPER') || (adminPermission?.SUBADMIN !== 'N')) && (
            <Button className="theme-btn ml-2 d-inline-flex justify-content-center align-items-center" tag={Link} to={matchApiLogUrl}>
              Match API Logs
            </Button>
          )}
          {
            permission && (
              <Fragment>
                <Button className="theme-btn icon-btn" tag={Link} to={props?.addLink}>
                  <img alt="add" src={addlIcon} />
                  {props?.addText}
                </Button>
              </Fragment>
            )
          }
        </div>
      </div>
      )}
      {matchApiLogs && (
      <Row>
        <Col md="6" xl="2">
          <CustomInput
            className='api-log-select'
            id="filter"
            name="filter"
            onChange={(e) => onFilter(e)}
            type="select"
            value={filter}
          >
            <option value="">Select Type</option>
            <option value="LINEUP">LINEUP</option>
            <option value="MATCHES">MATCHES</option>
            <option value="SCOREPOINT">SCOREPOINT</option>
            <option value="SCORECARD">SCORECARD</option>
          </CustomInput>
        </Col>
      </Row>
      ) }
    </div>
  )
}

SubAdminHeader.propTypes = {
  search: PropTypes.string,
  handleSearch: PropTypes.func,
  permission: PropTypes.bool,
  Searchable: PropTypes.bool,
  addLink: PropTypes.string,
  addText: PropTypes.string,
  List: PropTypes.object,
  adminLogs: PropTypes.any,
  adminsList: PropTypes.array,
  handleAdminSearch: PropTypes.func,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  setDateRange: PropTypes.func,
  dateRange: PropTypes.array,
  onClick: PropTypes.func,
  value: PropTypes.string,
  adminSearch: PropTypes.string,
  userSearch: PropTypes.string,
  recommendedList: PropTypes.arrayOf(PropTypes.object),
  handleRecommendedSearch: PropTypes.func,
  handleChangeSearch: PropTypes.func,
  dateFlag: PropTypes.bool,
  isMatchLog: PropTypes.string,
  isLeagueLog: PropTypes.string,
  matchApiLogUrl: PropTypes.string,
  matchApiLogs: PropTypes.bool,
  handleOtherFilter: PropTypes.func,
  searchType: PropTypes.string,
  handleNormalSearch: PropTypes.func,
  filter: PropTypes.string,
  onFilter: PropTypes.func,
  subAdmin: PropTypes.bool
}

export default SubAdminHeader
