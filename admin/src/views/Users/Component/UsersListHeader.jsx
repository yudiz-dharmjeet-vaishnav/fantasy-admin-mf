import React, { useState, Fragment, useEffect, useRef, forwardRef } from 'react'
import { Button, Form, FormGroup, Input, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, CustomInput } from 'reactstrap'
import DatePicker from 'react-datepicker'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import calendarIcon from '../../../assets/images/calendar.svg'
import addlIcon from '../../../assets/images/add-white-icon.svg'
import closeIcon from '../../../assets/images/close-icon.svg'

// Common header for users tab
function UserListHeader (props) {
  const {
    hidden,
    users,
    handleOtherFilter,
    filter,
    dateRange,
    dateFlag,
    setDateRange,
    permission,
    recommendedList,
    list,
    heading,
    search,
    handleSearch,
    startDate,
    endDate,
    searchComplaint,
    setModalMessage,
    searchType,
    passbook,
    onFiltering,
    pendingKycCount,
    aadhaarStatus,
    panStatus,
    transactionStatus,
    eType,
    particulars,
    paymentStatus,
    onStatusChange,
    withdrawPaymentMethod,
    onMethodChange,
    depositPaymentMethod,
    onFilter,
    userType,
    handleUserType,
    reversedInfo,
    onReversedChange,
    dateFiltering,
    dateFilterDropDown,
    // depositReport,
    isSeriesLeaderBoardUserRank,
    transactionReport, transactionReportPage, generateTransactionReport, setGenerateReportModal,
    modalToggle,
    disableButton,
    droppedUser
  } = props

  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const previousProps = useRef({ recommendedList }).current

  useEffect(() => {
    if (previousProps.recommendedList !== recommendedList && recommendedList) {
      setShow(true)
    }
    return () => {
      previousProps.recommendedList = recommendedList
    }
  }, [recommendedList])

  // this forwardRef user Date Filter
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range' onClick={onClick}>
      <img alt="calendar" src={calendarIcon} />
      <Input ref={ref} className='mx-2 range' placeholder='Select Date Range' readOnly value={value} />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  return (
    <div className="header-block">
      <div className="filter-block d-flex justify-content-between align-items-start fdc-480">
        <Form className="d-flex flex-wrap fdc-480 user-sub-header">
          {passbook && !props?.isUserToPassbook && !props?.isTdsToPassbook && !props?.isSystemUserToPassbook && (
          <FormGroup>
            <CustomInput
              className="select-user-header w-100"
              id="type"
              name="type"
              onChange={handleOtherFilter}
              type="select"
              value={searchType}
            >
              <option value=''>Search by</option>
              <option key='NAME' value='NAME'>Name</option>
              <option key='USERNAME' value='USERNAME'>Username</option>
              <option key='MOBILE' value='MOBILE'>Mobile No</option>
              <option key='PASSBOOK' value='PASSBOOK'>Passbook ID</option>
            </CustomInput>
          </FormGroup>
          )}
          {(!searchComplaint && !hidden && !props?.isUserToPassbook && !props?.isTdsToPassbook && !props?.isSystemUserToPassbook) && (
          <FormGroup>
            <Input className="search-box" name="search" onChange={handleSearch} onKeyPress={handleSearch} placeholder="Search" type="search" value={search} />
          </FormGroup>
          )}

          {searchComplaint && (
            <FormGroup>
              <UncontrolledDropdown>
                <DropdownToggle caret className='searchList w-100' nav>
                  <Input
                    autoComplete="off"
                    className='search-box'
                    name='search'
                    onChange={(e) => {
                      props.handleRecommendedSearch(e, e.target.value)
                      props.handleChangeSearch(e, '')
                      setShow(true)
                    }}
                    onKeyPress={(e) => {
                      props.handleRecommendedSearch(e, e.target.value)
                      props.handleChangeSearch(e, '')
                    }}
                    placeholder='Search'
                    type='text'
                    value={props.search || props.kycSearch}
                  />
                </DropdownToggle>
                {(props.search || props.kycSearch)
                  ? (
                    <img alt="close"
                      className='custom-close-img'
                      onClick={(e) => {
                        props.handleRecommendedSearch(e, '')
                        props.handleChangeSearch(e, '')
                      }
                    }
                      src={closeIcon}
                    />
                    )
                  : ''}
                {(list?.total >= 1 || list?.length >= 1) && (
                <DropdownMenu className={recommendedList?.length >= 1 ? 'recommended-search-dropdown' : ''} open={show}>
                  {recommendedList?.length >= 1
                    ? (typeof (props.kycSearch) === 'number')
                        ? (
                          <Fragment>
                            {
                            recommendedList?.length > 0 && recommendedList.map((recommendedData, index) => {
                              return (
                                <DropdownItem key={index}
                                  onClick={(e) => {
                                    props.handleChangeSearch(e, recommendedData.sMobNum)
                                  }}
                                >
                                  {recommendedData.sMobNum}
                                </DropdownItem>
                              )
                            })
                          }
                          </Fragment>
                          )
                        : (
                          <Fragment>
                            {
                            recommendedList?.length > 0 && recommendedList.map((recommendedData, index) => {
                              return (
                                <DropdownItem key={index}
                                  onClick={(e) => {
                                    props.handleChangeSearch(e, recommendedData.sEmail)
                                  }}
                                >
                                  {recommendedData.sEmail}
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
          {!props.hideDateBox && (
          <FormGroup>
            <DatePicker
              customInput={<ExampleCustomInput />}
              dropdownMode="select"
              endDate={endDate}
              isClearable={true}
              maxDate={new Date()}
              onChange={(update) => {
                setDateRange(update)
                dateFlag && (dateFlag.current = true)
              }}
              peekNextMonth
              placeholderText='Select Date Range'
              selectsRange={true}
              showMonthDropdown
              showYearDropdown
              startDate={startDate}
              value={dateRange}
            />
          </FormGroup>
          )}

          {users && (
          <FormGroup>
            <CustomInput
              className="select-user-header"
              id="type"
              name="type"
              onChange={handleOtherFilter}
              type="select"
              value={filter}
            >
              <option value=''>Filter by</option>
              <option key='EMAIL_VERIFIED' value='EMAIL_VERIFIED'>Email Verified</option>
              <option key='MOBILE_VERIFIED' value='MOBILE_VERIFIED'>Mobile Verified</option>
              <option key='INTERNAL_ACCOUNT' value='INTERNAL_ACCOUNT'>Internal Account</option>
            </CustomInput>
          </FormGroup>
          )}
          {droppedUser && (
          <FormGroup>
            <CustomInput
              className="select-user-header"
              id="type"
              name="type"
              onChange={handleOtherFilter}
              type="select"
              value={filter}
            >
              <option value=''>Filter by</option>
              <option key='E' value='E'>Email </option>
              <option key='M' value='M'>Mobile </option>
            </CustomInput>
          </FormGroup>
          )}

          { dateFiltering && (
          <FormGroup>
            <CustomInput
              className="select-user-header w-100"
              disabled={dateRange[0] === null}
              id="type"
              name="type"
              onChange={dateFiltering}
              type="select"
              value={dateRange[0] === null ? '' : dateFilterDropDown}
            >
              <option value="">ALL</option>
              <option key='Request_Date' value={false} >Request Date</option>
              <option key='Approval_Date' value={true}>Approval Date</option>
            </CustomInput>
          </FormGroup>
          )
          }
          {heading === 'KYC Verification' && (
          <FormGroup>
            <CustomInput
              className='select-user-header w-100'
              id="panStatus"
              name="panStatus"
              onChange={(event) => onFiltering(event, 'PAN')}
              type="select"
              value={panStatus}
            >
              <option value="">Pan Status</option>
              <option value="P">
                Pending
                {panStatus === 'P' && '(' + pendingKycCount?.nPanCount + ')'}
              </option>
              <option value="A">
                Accepted
                {panStatus === 'A' && '(' + pendingKycCount?.nPanCount + ')'}
              </option>
              <option value='R'>
                Rejected
                {panStatus === 'R' && '(' + pendingKycCount?.nPanCount + ')'}
              </option>
              <option value="N">
                Not Uploaded
                {panStatus === 'N' && '(' + pendingKycCount?.nPanCount + ')'}
              </option>
            </CustomInput>
          </FormGroup>
          )}
          {heading === 'KYC Verification' && (
            <CustomInput
              className='select-user-header'
              id="aadhaarStatus"
              name="aadhaarStatus"
              onChange={(event) => onFiltering(event, 'AADHAAR')}
              type="select"
              value={aadhaarStatus}
            >
              <option value="">Aadhaar Status</option>
              <option value="P">
                Pending
                {aadhaarStatus === 'P' && '(' + pendingKycCount?.nAadharCount + ')'}
              </option>
              <option value="A">
                Accepted
                {aadhaarStatus === 'A' && '(' + pendingKycCount?.nAadharCount + ')'}
              </option>
              <option value='R'>
                Rejected
                {aadhaarStatus === 'R' && '(' + pendingKycCount?.nAadharCount + ')'}
              </option>
              <option value="N">
                Not Uploaded
                {aadhaarStatus === 'N' && '(' + pendingKycCount?.nAadharCount + ')'}
              </option>
            </CustomInput>
          )}
          {heading === 'Transactions' && (
          <FormGroup>
            <CustomInput
              className="select-user-header w-100"
              id="transactionStatus"
              name="transactionStatus"
              onChange={(event) => onFiltering(event, 'TransactionStatus')}
              type="select"
              value={transactionStatus}
            >
              <option value="">Transaction Status</option>
              <option value="CMP">Completed</option>
              <option value="R">Refunded</option>
              <option value="CNCL">Cancelled</option>
            </CustomInput>
          </FormGroup>
          )}
          {heading === 'Transactions' && (
          <FormGroup>
            <CustomInput
              className="select-user-header w-100"
              id="eType"
              name="eType"
              onChange={(event) => onFiltering(event, 'eType')}
              type="select"
              value={eType}
            >
              <option value="">Type</option>
              <option value="Cr">Credited</option>
              <option value="Dr">Debited</option>
            </CustomInput>
          </FormGroup>
          )}
          {heading === 'Transactions' && (
          <FormGroup>
            <CustomInput
              className="select-user-header w-100"
              id="type"
              name="type"
              onChange={handleUserType}
              type="select"
              value={userType}
            >
              <option value=''>User Type</option>
              <option key='U' value='U'>User</option>
              <option key='B' value='B'>Bot</option>
            </CustomInput>
          </FormGroup>
          )}
          {heading === 'Transactions' && (
            <CustomInput
              className='select-user-header'
              id="Particulars"
              name="Particulars"
              onChange={(event) => onFiltering(event, 'Particulars')}
              // className="mt-2"
              type="select"
              value={particulars}
            >
              <option value="">Transaction Type</option>
              <option value="Bonus">Bonus</option>
              <option value="Refer-Bonus">Refer Bonus</option>
              <option value="Bonus-Expire">Bonus Expire</option>
              <option value="Deposit">Deposit </option>
              <option value="Withdraw">Withdraw </option>
              <option value="Withdraw-Return">Withdraw Return</option>
              <option value="Play">Play</option>
              <option value="Play-Return">Play Return</option>
              <option value="Win">Win </option>
              <option value="Cashback-Contest">Cashback Contest</option>
              <option value="Cashback-Return">Cashback Return</option>
              <option value="Creator-Bonus">Creator Bonus</option>
              <option value='Loyalty-Point'>Loyalty Point</option>
              <option value='TDS'>TDS</option>
            </CustomInput>
          )}

          {heading === 'Withdrawals' && (
          <FormGroup >
            <CustomInput
              className="select-user-header w-100"
              id="Status"
              name="Status"
              onChange={(event) => onStatusChange(event)}
              type="select"
              value={paymentStatus}
            >
              <option value="">Payment Status</option>
              <option value="P">Pending</option>
              <option value="S">Success </option>
              <option value="C">Cancelled </option>
              <option value="R">Refunded </option>
              <option value="I">Initiated </option>
            </CustomInput>
          </FormGroup>
          )}
          {heading === 'Withdrawals' && (
          <FormGroup>
            <CustomInput
              className="select-user-header w-100"
              id="GatewayInfo"
              name="GatewayInfo"
              onChange={(event) => onMethodChange(event)}
              type="select"
              value={withdrawPaymentMethod}
            >
              <option value=''> Gateway Info</option>
              <option value="CASHFREE">CASHFREE </option>
              <option value="ADMIN">ADMIN </option>
              <option value='PAYTM'>PAYTM</option>
              <option value='STRIPE'>STRIPE</option>
            </CustomInput>
          </FormGroup>
          )}
          {heading === 'Withdrawals' && (
          <CustomInput
            className='select-user-header'
            id="ReversedInfo"
            name="ReversedInfo"
            onChange={(event) => onReversedChange(event)}
              // className="mt-2"
            type="select"
            value={reversedInfo}
          >
            <option value="all">Reversed Info</option>
            <option value="y">Yes</option>
            <option value="n">No</option>
          </CustomInput>
          )}
          {heading === 'Deposits' && (
          <FormGroup>

            <CustomInput
              className="select-user-header w-100"
              id="Status"
              name="Status"
              onChange={(event) => onStatusChange(event)}
              type="select"
              value={paymentStatus}
            >
              <option value="">Deposit Status</option>
              <option value="P">Pending</option>
              <option value="S">Success </option>
              <option value="C">Cancelled </option>
              <option value="R">Refunded </option>
            </CustomInput>
          </FormGroup>
          )}

          {heading === 'Deposits' && (
            <CustomInput
              className="select-user-header"
              id="GatewayInfo"
              name="GatewayInfo"
              onChange={(event) => onMethodChange(event)}
              type="select"
              value={depositPaymentMethod}
            >
              <option value="">Gateway Info</option>
              <option value="ADMIN">ADMIN </option>
              <option value="CASHFREE">CASHFREE </option>
              <option value='PAYTM'>PAYTM</option>
              <option value='STRIPE'>STRIPE</option>
            </CustomInput>
          )}

          {heading === 'TDS Management' && (
          <FormGroup>
            <CustomInput
              className="select-user-header w-100"
              id="type"
              name="type"
              onChange={handleUserType}
              type="select"
              value={userType}
            >
              <option value=''>User Type</option>
              <option key='U' value='U'>User</option>
              <option key='B' value='B'>Bot</option>
            </CustomInput>
          </FormGroup>
          )}
          {heading === 'TDS Management' && (
          <CustomInput
            className='select-user-header'
            id="filter"
            name="filter"
            onChange={(e) => onFilter(e)}
            type="select"
            value={filter}
          >
            <option value="">Status</option>
            <option value="P">Pending</option>
            <option value="A">Accepted</option>
          </CustomInput>
          )}

        </Form>
        {modalToggle && (
        <Button className="theme-btn d-flex flex-end icon-btn " disabled={disableButton} onClick={modalToggle}>
          Generate Report
        </Button>
        )}
        {props.normalUser && list && (
        <div className='total-text-count'>
          Total Users :
          {' '}
          <b>{(props?.heading === true ? list?.count : props?.totalCount?.count) || 0}</b>
        </div>
        )}
        {props.buttonText && permission && (
          <div className='system-user-button'>
            <Button className="theme-btn icon-btn w-100" onClick={setModalMessage}>
              <img alt="add" src={addlIcon} />
              {props.buttonText}
            </Button>
            {props.systemUsers && list && (
            <div className='total-text-count mt-0 mr-2'>
              Total System Users :
                {' '}
              <b>
                {props.totalCount?.count || 0}
              </b>
            </div>
            )}
          </div>
        )}
        {generateTransactionReport && (
          <Button className="theme-btn" onClick={() => setGenerateReportModal(true)}>
            Generate Transaction Report
          </Button>
        )}
        {transactionReport && !isSeriesLeaderBoardUserRank && (
          <Button className="theme-btn" onClick={() => navigate(transactionReportPage)}>
            Transaction Reports
          </Button>
        )}
      </div>
    </div>
  )
}

UserListHeader.defaultProps = {
  history: {}
}

UserListHeader.propTypes = {
  handleSearch: PropTypes.func,
  onExport: PropTypes.func,
  search: PropTypes.string,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  heading: PropTypes.string,
  isDateRangeSelect: PropTypes.bool,
  searchBox: PropTypes.bool,
  handleModalOpen: PropTypes.func,
  recommendedList: PropTypes.arrayOf(PropTypes.object),
  list: PropTypes.object,
  user: PropTypes.bool,
  passBookID: PropTypes.string,
  isOpenDateModal: PropTypes.bool,
  onHandlePassBookID: PropTypes.func,
  PassbookID: PropTypes.string,
  commonSearch: PropTypes.string,
  searchComplaint: PropTypes.bool,
  setModalMessage: PropTypes.func,
  buttonText: PropTypes.string,
  kycSearch: PropTypes.string,
  refresh: PropTypes.bool,
  handleRecommendedSearch: PropTypes.func,
  handleChangeSearch: PropTypes.func,
  searchValue: PropTypes.string,
  onRefresh: PropTypes.func,
  normalUser: PropTypes.bool,
  permission: PropTypes.bool,
  setDateRange: PropTypes.func,
  dateRange: PropTypes.array,
  onClick: PropTypes.func,
  value: PropTypes.string,
  filter: PropTypes.string,
  handleOtherFilter: PropTypes.func,
  users: PropTypes.bool,
  systemUsers: PropTypes.bool,
  totalCount: PropTypes.object,
  hidden: PropTypes.bool,
  dateFlag: PropTypes.func,
  hideDateBox: PropTypes.bool,
  userDetailsPage: PropTypes.string,
  searchType: PropTypes.string,
  passbook: PropTypes.bool,
  isUserToPassbook: PropTypes.bool,
  isSystemUserToPassbook: PropTypes.bool,
  userToPassbookId: PropTypes.string,
  isTdsToPassbook: PropTypes.bool,
  isLeagueToPassbook: PropTypes.bool,
  leagueToPassbookId: PropTypes.string,
  isLeagueToTds: PropTypes.bool,
  leagueToTdsId: PropTypes.string,
  leagueToTdsMatch: PropTypes.String,
  leagueToTdsLeague: PropTypes.string,
  leagueToPassbookMatch: PropTypes.String,
  leagueToPassbookLeague: PropTypes.string,
  onFiltering: PropTypes.func,
  pendingKycCount: PropTypes.string,
  aadhaarStatus: PropTypes.string,
  panStatus: PropTypes.string,
  transactionStatus: PropTypes.string,
  eType: PropTypes.string,
  particulars: PropTypes.string,
  paymentStatus: PropTypes.string,
  onStatusChange: PropTypes.func,
  withdrawPaymentMethod: PropTypes.string,
  onMethodChange: PropTypes.func,
  depositPaymentMethod: PropTypes.string,
  onFilter: PropTypes.func,
  userType: PropTypes.string,
  handleUserType: PropTypes.func,
  reversedInfo: PropTypes.string,
  onReversedChange: PropTypes.func,
  dateFiltering: PropTypes.func,
  dateFilterDropDown: PropTypes.string,
  depositReport: PropTypes.func,
  disableButton: PropTypes.bool,
  transactionReport: PropTypes.bool,
  transactionReportPage: PropTypes.string,
  generateTransactionReport: PropTypes.bool,
  setGenerateReportModal: PropTypes.func,
  isSeriesLeaderBoardUserRank: PropTypes.bool,
  modalToggle: PropTypes.bool,
  droppedUser: PropTypes.bool

}

export default UserListHeader
