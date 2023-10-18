import React, { useState, Fragment, useRef, useEffect, forwardRef } from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Input, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledPopover, PopoverBody, CustomInput } from 'reactstrap'
import { Link, useNavigate } from 'react-router-dom'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import DatePicker from 'react-datepicker'
import PropTypes from 'prop-types'

import closeIcon from '../../../assets/images/close-icon.svg'
import infoIcon from '../../../assets/images/info2.svg'
import addlIcon from '../../../assets/images/add-white-icon.svg'
import calendarIcon from '../../../assets/images/calendar.svg'
import backIcon from '../../../assets/images/back-icon-1.svg'
import excelIcon from '../../../assets/images/excel-icon.svg'

// Common header component for settings tab
const animatedComponents = makeAnimated()
function Heading (props) {
  const {
    heading,
    format,
    handleChange,
    list,
    startDate,
    endDate,
    feedback,
    FormatsList,
    promocode,
    version,
    recommendedList,
    promocodeStatistics,
    setModalOpen,
    modalOpen,
    permission,
    sliderStatistics,
    dateRange,
    setDateRange,
    notificationFilter,
    dateFlag,
    automatedNotification,
    onFiltering,
    type,
    complainStatus,
    notificationType,
    typesList,
    toggle,
    isOpen,
    Auth,
    handleInputChange,
    onSeasonSelect,
    season,
    seasonErr,
    seasonList,
    onSubmit,
    onSeasonPagination,
    adminPermission,
    leadershipBoard,
    Popup,
    promoType,
    sPlatform,
    pushNotification,
    bannerStatisticsList,
    TotalBonusGiven,
    PromoUsage
  } = props
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const previousProps = useRef({ recommendedList }).current

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range' onClick={onClick}>
      <img alt="calendar" src={calendarIcon} />
      <Input ref={ref} className='range' placeholder='Select Date Range' readOnly value={value} />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  useEffect(() => {
    if ((previousProps.recommendedList !== recommendedList) && recommendedList) {
      setShow(true)
    }
    return () => {
      previousProps.recommendedList = recommendedList
    }
  }, [recommendedList])

  return (
    <div className='setting-header-block'>
      <div className='d-flex justify-content-between'>
        <div className='d-flex inline-input'>
          {automatedNotification ? <img className='custom-go-back' height='24' onClick={() => navigate(`/users/push-notification${page?.PushNotificationManagement || ''}`)} src={backIcon} width='24' /> : ''}
          <h2 className='ml-2'>
            {heading}
            {props?.info && (
            <Fragment>
              <img className='custom-info' id='info' src={infoIcon} />
              <UncontrolledPopover placement="bottom" target='info' trigger="legacy">
                <PopoverBody>
                  <p>After updating anything from here, It will take some time to reflect on the app.</p>
                </PopoverBody>
              </UncontrolledPopover>
            </Fragment>
            )}

          </h2>
        </div>
        {props?.onExport && FormatsList && (FormatsList?.total > 0 || FormatsList?.length !== 0)
          ? (
            <img
              alt='excel'
              className='header-button'
              onClick={props?.onExport}
              src={excelIcon}
              style={{ cursor: 'pointer' }}
              title='Export'
            />
            )
          : ''}
      </div>

      <div className='d-flex justify-content-between align-items-center fdc-480'>
        <Form className={`d-flex fdc-480 align-items-center setting-filter ${history?.location?.search?.includes('SEASON_WISE') ? '' : 'flex-wrap'}`}>
          {props.handleSearch
            ? (
              <FormGroup>
                <Input
                  autoComplete='off'
                  className='search-box'
                  name='search'
                  onChange={props?.handleSearch}
                  placeholder='Search'
                  type='search'
                  value={props?.search}
                />
              </FormGroup>
              )
            : ''}
          {props?.handleRecommendedSearch && (
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
                  value={props?.search || props?.complaintSearch}
                />
              </DropdownToggle>
              {(props?.search || props?.complaintSearch)
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
              {(list?.nTotal >= 1 || list?.aData?.length >= 1)
                ? (
                  <DropdownMenu className={recommendedList?.length >= 1 ? 'recommended-search-dropdown' : ''} open={show}>
                    {(recommendedList?.length >= 1)
                      ? ((typeof (props?.complaintSearch) === 'number')
                          ? (
                            <Fragment>
                              {
                            recommendedList?.length > 0 && recommendedList?.map((recommendedData, index) => {
                              return (
                                <DropdownItem key={index} onClick={(e) => { props?.handleChangeSearch(e, recommendedData.sMobNum) }}>
                                  {recommendedData.sMobNum}
                                </DropdownItem>
                              )
                            })}
                            </Fragment>
                            )
                          : (
                            <Fragment>
                              {
                            recommendedList?.length > 0 && recommendedList?.map((recommendedData, index) => {
                              return (
                                <DropdownItem key={index} onClick={(e) => { props?.handleChangeSearch(e, recommendedData?.sUsername) }}>
                                  {recommendedData?.sUsername}
                                </DropdownItem>
                              )
                            })}
                            </Fragment>
                            ))
                      : (
                        <DropdownItem>
                          User not found
                        </DropdownItem>
                        )}
                  </DropdownMenu>
                  )
                : ''}
            </UncontrolledDropdown>
          </FormGroup>
          )}
          {promocodeStatistics && (
          <FormGroup>
            <UncontrolledDropdown>
              <DropdownToggle caret className='searchList' nav>
                <Input
                  autoComplete="off"
                  className='search-box'
                  name='search'
                  onChange={(e) => {
                    props?.handleRecommendedSearchStatistics(e, e?.target?.value)
                    props?.handleChangeSearchStatistics(e, '')
                    setShow(true)
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
                      props?.handleRecommendedSearchStatistics(e, '')
                      props?.handleChangeSearchStatistics(e, '')
                    }}
                    src={closeIcon}
                  />
                  )
                : ''}
              {PromoUsage?.length >= 1 && (
              <DropdownMenu className={recommendedList?.length >= 1 ? 'recommended-search-dropdown' : ''} open={show}>
                {recommendedList?.length >= 1
                  ? (typeof (props?.userSearch) === 'number')
                      ? (
                        <Fragment>
                          {
                      recommendedList?.length > 0 && recommendedList?.map((recommendedData, index1) => {
                        return (
                          <DropdownItem key={index1} onClick={(e) => { props.handleChangeSearchStatistics(e, recommendedData?.sMobNum) }}>
                            {recommendedData?.sMobNum}
                          </DropdownItem>
                        )
                      })}
                        </Fragment>
                        )
                      : (
                        <Fragment>
                          {
                      recommendedList?.length > 0 && recommendedList?.map((recommendedData, index2) => {
                        return (
                          <DropdownItem key={index2} onClick={(e) => { props?.handleChangeSearchStatistics(e, recommendedData?.sEmail) }}>
                            {recommendedData?.sEmail}
                          </DropdownItem>
                        )
                      })}
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
          {(feedback || promocode || notificationFilter || sliderStatistics) && (
            <FormGroup>
              <DatePicker
                customInput={<ExampleCustomInput />}
                dropdownMode="select"
                endDate={endDate}
                isClearable={true}
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
                maxDate={new Date()}
              />
            </FormGroup>
          )}
          {pushNotification && (
          <CustomInput
            className='format-f'
            id="sPlatform"
            name="sPlatform"
            onChange={(event) => onFiltering(event)}
            type="select"
            value={sPlatform}
          >
            <option value="">Platform</option>
            <option value="Web">Web</option>
            <option value="IOS">IOS</option>
            <option value="Android">Android</option>
          </CustomInput>
          )}
          {feedback && (
            <FormGroup>
              <CustomInput
                className="format-f"
                id="promoType"
                name="promoType"
                onChange={(event) => onFiltering(event, 'type')}
                type="select"
                value={type}
              >
                <option value="">Type</option>
                <option value="F">Feedback</option>
                <option value="C">Complaint</option>
              </CustomInput>
            </FormGroup>
          )}

          {feedback && (
            <FormGroup>
              <CustomInput
                className="format-f"
                id="promoType"
                name="promoType"
                onChange={(event) => onFiltering(event, 'complainStatus')}
                type="select"
                value={complainStatus}
              >
                <option value="">Status</option>
                <option value="P">Pending</option>
                <option value="I">In-Progress</option>
                <option value='D'>Declined</option>
                <option value='R'>Resolved</option>
              </CustomInput>
            </FormGroup>
          )}
          {notificationFilter && !pushNotification && (
            <CustomInput
              className=" format-f"
              id="notificationType"
              name="notificationType"
              onChange={(event) => onFiltering(event)}
              type="select"
              value={notificationType}
            >
              <option value="">All</option>
              {typesList && typesList?.length !== 0 && typesList?.map((data, i) => {
                return (
                  <option key={data?._id} value={data?._id}>{data?.sHeading}</option>
                )
              })}
            </CustomInput>
          )}
          {promocode && (
            <CustomInput
              className="format-f"
              id="promoType"
              name="promoType"
              onChange={(event) => onFiltering(event)}
              type="select"
              value={promoType}
            >
              <option value="">Type</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="MATCH">Match</option>
            </CustomInput>
          )}
          {leadershipBoard && (
            <CustomInput
              className='mt-2 mx-2 format-f'
              id="leaderboard"
              name="leaderboard"
              onChange={(event) => toggle(event)}
              type="select"
              value={isOpen}
            >
              <option value="ALL_TIME">All Time</option>
              <option value="MONTH_WISE">Month Wise</option>
              <option value="SEASON_WISE">Season Wise</option>
            </CustomInput>
          )}

          {isOpen === 'SEASON_WISE' && (
            <Form className="d-flex justify-content-start">
              <FormGroup>
                <Select
                  captureMenuScroll={true}
                  className='custom-react-select-leaderBoard'
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  id="Season"
                  isDisabled={adminPermission?.LEADERSHIP_BOARD === 'R'}
                  isMulti={true}
                  menuPlacement="auto"
                  name="Season"
                  onChange={selectedOption => onSeasonSelect(selectedOption)}
                  onInputChange={(value) => { handleInputChange(value) }}
                  onMenuScrollToBottom={onSeasonPagination}
                  options={seasonList}
                  placeholder="Select Seasons"
                  value={season}
                />
                {seasonErr && <p className="error-text">{seasonErr}</p>}
              </FormGroup>
              {((Auth && Auth === 'SUPER') || (adminPermission?.LEADERSHIP_BOARD !== 'R')) &&
                (
                <FormGroup>
                  <Button className="wrap-style-btn ml-4" hidden={season?.length === 0} onClick={onSubmit} >
                    <img alt="add" src={addlIcon} title='Add Season'/>
                    <span className='mr-4'> Add Seasons </span>
                  </Button>
                </FormGroup>
                )}
            </Form>
          )}
          {Popup && (
          <CustomInput
            className=' format-f'
            id="type"
            name="type"
            onChange={(event) => onFiltering(event)}
            type="select"
            value={type}
          >
            <option value="">Type</option>
            <option value="I">Internal</option>
            <option value="E">External</option>
          </CustomInput>
          )}
        </Form>
        <FormGroup className='d-flex'>
          {TotalBonusGiven && (
          <h3 className='success-text m-0'>
            Total Bonus Given :
            {' '}
            {TotalBonusGiven || 0}
          </h3>
          )}
          {(permission && props?.aNotification) && (
            <Button className={`theme-btn mr-3 ${version} icon-btn`} tag={Link} to='/users/push-notification/automated-notification'>
              {props?.aNotification}
            </Button>
          )}
          {(permission && props?.notification) && (
            <Button className={`theme-btn icon-btn ${version} && `} onClick={() => setModalOpen(!modalOpen)}>
              <img alt="add" src={addlIcon} />
              {props?.notification}
            </Button>
          )}
          {(props?.buttonText === 'Add Promocode' && permission) && (
            <Button className={`theme-btn icon-btn ${version}  mr-3`} state= {{ nPromocode: true }} tag={Link} to={{ pathname: '/settings/add-n-promocode' } }>
              <img alt="add" src={addlIcon} />
              Add Multiple Promocodes
            </Button>
          )}
          {(props?.buttonText && permission) && (
            <Button className={`theme-btn icon-btn ${version} `} tag={Link} to={props?.setUrl}>
              <img alt="add" src={addlIcon} />
              {props?.buttonText}
            </Button>
          )}
        </FormGroup>
        {(format || props?.pointSystem) && (
        <FormGroup>
          <CustomInput
            className='format-f'
            id='matchFormat'
            name='select'
            onChange={handleChange}
            type='select'
            value={format}
          >
            {FormatsList &&
                FormatsList?.length !== 0 && FormatsList?.map((data, i) => {
              return (
                <>
                  <option key={data} value={data}>
                    {data}
                    ?
                  </option>
                </>
              )
            })}
          </CustomInput>
        </FormGroup>
        )}
        {sliderStatistics && (
        <div className='d-flex align-items-center success-text'>
          <b>
            Total Click Count:
            {bannerStatisticsList?.nTotalBannerClick || 0}
          </b>
        </div>
        )}
      </div>
    </div>
  )
}

Heading.propTypes = {
  search: PropTypes.string,
  heading: PropTypes.string,
  handleSearch: PropTypes.func,
  onExport: PropTypes.func,
  buttonText: PropTypes.string,
  setUrl: PropTypes.string,
  format: PropTypes.string,
  handleChange: PropTypes.func,
  list: PropTypes.arrayOf(PropTypes.object),
  feedback: PropTypes.string,
  FormatsList: PropTypes.object,
  promocode: PropTypes.any,
  version: PropTypes.string,
  recommendedList: PropTypes.object,
  complaintSearch: PropTypes.string,
  handleRecommendedSearch: PropTypes.func,
  handleChangeSearch: PropTypes.func,
  sliderStatistics: PropTypes.bool,
  promocodeStatistics: PropTypes.any,
  notification: PropTypes.string,
  aNotification: PropTypes.string,
  setModalOpen: PropTypes.func,
  modalOpen: PropTypes.bool,
  permission: PropTypes.bool,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  setDateRange: PropTypes.func,
  dateRange: PropTypes.array,
  onClick: PropTypes.func,
  value: PropTypes.string,
  notificationFilter: PropTypes.bool,
  getMaintenanceModeFunc: PropTypes.func,
  maintenancePermission: PropTypes.bool,
  dateFlag: PropTypes.bool,
  refresh: PropTypes.bool,
  onRefresh: PropTypes.func,
  info: PropTypes.bool,
  automatedNotification: PropTypes.bool,
  pointSystem: PropTypes.bool,
  onFiltering: PropTypes.func,
  type: PropTypes.PropTypes.string,
  complainStatus: PropTypes.string,
  notificationType: PropTypes.string,
  typesList: PropTypes.array,
  toggle: PropTypes.func,
  isOpen: PropTypes.string,
  calculateLeaderBoardData: PropTypes.func,
  leadershipBoard: PropTypes.bool,
  Auth: PropTypes.string,
  handleInputChange: PropTypes.func,
  onSeasonSelect: PropTypes.func,
  season: PropTypes.string,
  seasonErr: PropTypes.string,
  seasonList: PropTypes.object,
  onSubmit: PropTypes.func,
  onSeasonPagination: PropTypes.func,
  adminPermission: PropTypes.string,
  Popup: PropTypes.bool,
  promoType: PropTypes.string,
  sPlatform: PropTypes.string,
  pushNotification: PropTypes.string,
  bannerStatisticsList: PropTypes.object,
  TotalBonusGiven: PropTypes.number,
  userSearch: PropTypes.object,
  PromoUsage: PropTypes.array,
  handleRecommendedSearchStatistics: PropTypes.func,
  handleChangeSearchStatistics: PropTypes.func
}

export default connect()(Heading)
