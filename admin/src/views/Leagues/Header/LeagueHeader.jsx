import React, { Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle, Col, CustomInput, Form, FormGroup, Input, PopoverBody, Row, UncontrolledPopover } from 'reactstrap'
import PropTypes from 'prop-types'

import addlIcon from '../../../assets/images/add-white-icon.svg'
import exportIcon from '../../../assets/images/export-icon.svg'
import backIcon from '../../../assets/images/back-icon-1.svg'
import infoIcon from '../../../assets/images/info-icon.svg'

// Common header for leagues tab
function LeagueHeader (props) {
  const {
    list,
    GameCategoryList,
    hidden,
    seriesLBCategory,
    seriesDetails,
    seriesLeaderBoard,
    prizeDistributionFunc,
    winPrizeDistributionFunc,
    calculate,
    handleSearchBox,
    heading,
    LeagueCategory,
    onLeagueCategory,
    openModalPrizeBreakUp,
    seriesStatus,
    onFiltering
  } = props

  const navigate = useNavigate()
  const seriesCount = useSelector(state => state.seriesLeaderBoard.seriesCount)
  const seriesLeaderBoardDetails = useSelector(state => state.seriesLeaderBoard.seriesLeaderBoardDetails)
  const LeagueCategoryList = useSelector((state) => state.leaguecategory.LeaguecategoryList)
  const LeagueDetails = useSelector((state) => state.league.LeagueDetails)

  return (
    <div className="header-block">
      {!props.league && (
        <div className="filter-block d-flex justify-content-between align-items-start">
          <div className="d-inline-flex">
            {seriesDetails && props.backUrl
              ? (
                <img
                  className="custom-go-back"
                  height="24"
                  onClick={() => navigate(`${props.backUrl}`)}
                  src={backIcon}
                  width="24"
                />
                )
              : (
                  ''
                )}

            {seriesLBCategory && props.backUrl
              ? (
                <img
                  className="custom-go-back"
                  height="24"
                  onClick={() => navigate(`${props.backUrl}`)}
                  src={backIcon}
                  width="24"
                />
                )
              : (
                  ''
                )}

            {props.goToLeague
              ? (
                <img
                  className="custom-go-back"
                  height="24"
                  onClick={() => navigate(`${props.goToLeague}`)}
                  src={backIcon}
                  width="24"
                />
                )
              : (
                  ''
                )}

            {props.LeagueDetailsLink
              ? (
                <img
                  className="custom-go-back"
                  height="24"
                  onClick={() => navigate(`${props.LeagueDetailsLink}`)}
                  src={backIcon}
                  width="24"
                />
                )
              : (
                  ''
                )}

            <h2 className="ml-2">
              {props.heading}
              {props.info && (
                <Fragment>
                  <img className="custom-info" id="info" src={infoIcon} />
                  <UncontrolledPopover placement="bottom" target="info" trigger="legacy">
                    <PopoverBody>
                      <p>After updating anything from here, It will take some time to reflect on theapp.</p>
                    </PopoverBody>
                  </UncontrolledPopover>
                </Fragment>
              )}
            </h2>
          </div>
          <div className="btn-list">
            {props.onExport && list && (list.total > 0 || list.length !== 0) && (
              <Button className="theme-btn icon-btn-export ml-2" onClick={props.onExport}>
                <img alt="add" src={exportIcon} />
                {props.export}
              </Button>
            )}
          </div>
        </div>
      )}
      {((calculate && seriesLeaderBoardDetails?.eStatus === 'CMP') || seriesLeaderBoard || GameCategoryList || heading || props.buttonText || props.permission || props.addButton) && (
        <Row className='d-flex align-items-center justify-content-end'>
          {calculate && seriesLeaderBoardDetails?.eStatus === 'CMP' && (
            <Fragment>
              <Col className='calculation-card' lg='3' md='6' xl={3}>
                <Card>
                  <CardBody>
                    <div className='d-flex justify-content-between'>
                      <div>
                        <CardTitle>Prize Calculation</CardTitle>
                        <CardSubtitle>
                          {seriesCount?.nPrizeCalculatedCategory || 0}
                          {' '}
                          /
                          {' '}
                          {seriesCount?.nSeriesCategoryCount || 0}
                        </CardSubtitle>
                      </div>
                      <CardText>
                        <Button className='calculate-button' disabled={(seriesCount?.nPrizeCalculatedCategory === seriesCount?.nSeriesCategoryCount)} onClick={prizeDistributionFunc}>
                          Calculate
                        </Button>
                      </CardText>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col className='calculation-card pr-0' lg='3' md='6' xl={3}>
                <Card>
                  <CardBody>
                    <div className='d-flex justify-content-between'>
                      <div>
                        <CardTitle>Win Prize Distribution</CardTitle>
                        <CardSubtitle>
                          {seriesCount?.nWinDistributedCategory || 0}
                          {' '}
                          /
                          {' '}
                          {seriesCount?.nSeriesCategoryCount || 0}
                        </CardSubtitle>
                      </div>
                      <CardText>
                        <Button className='calculate-button' disabled={(seriesCount?.nWinDistributedCategory === seriesCount?.nSeriesCategoryCount) || (seriesCount?.nPrizeCalculatedCategory !== seriesCount?.nSeriesCategoryCount)} onClick={winPrizeDistributionFunc}>
                          Calculate
                        </Button>
                      </CardText>
                    </div>
                  </CardBody>
                </Card>
              </Col>

            </Fragment>
          )}
          <Col className={seriesLeaderBoard ? 'series-buttons' : 'league-buttons'} lg="8" md={seriesLeaderBoard ? 8 : 12}>
            {!hidden && (
              <Form className="league-search ml-10px-480 fdc-480">
                <FormGroup>
                  <Input
                    className="search-box"
                    name="search"
                    onChange={(event) => props.handleSearch(event.target.value)}
                    placeholder="Search"
                    type="search"
                    value={props.search}
                  />
                </FormGroup>
                {GameCategoryList && (
                  <FormGroup>
                    <CustomInput
                      className="ml-0-480 select-sports"
                      id="SelectGameLeague"
                      name="select"
                      onChange={(event) => props.handleSportType(event.target.value)}
                      placeholder="Select a Sport"
                      type="select"
                      value={props.selectGame}
                      width="350px"
                    >
                      {GameCategoryList &&
                        GameCategoryList.length !== 0 &&
                        GameCategoryList.map((data, index) => {
                          return (
                            <option key={index} value={data?.sKey}>
                              {data?.sName}
                            </option>
                          )
                        })}
                    </CustomInput>
                  </FormGroup>
                )}

                {heading && (
                  <FormGroup>
                    <CustomInput
                      className=" ml-0-480 select-sports"
                      id="leagueType"
                      name="leagueType"
                      onChange={(event) => onLeagueCategory(event)}
                      placeholder='League Category'
                      type="select"
                      value={LeagueCategory}
                    >
                      <option value="">League Category</option>
                      {LeagueCategoryList?.map((data) => (
                        <option key={data._id} value={data.sTitle}>
                          {data.sTitle}
                        </option>
                      ))}
                    </CustomInput>
                  </FormGroup>
                )}
                {heading && (
                  <FormGroup>
                    <CustomInput
                      className=" ml-0-480 select-sports"
                      id="leagueCategory"
                      name="leagueCategory"
                      onChange={(event) => handleSearchBox(event)}
                      placeholder='League Type'
                      type="select"
                      value={props.searchField}
                    >
                      <option value="">League Type</option>
                      <option value="nBonusUtil">Bonus Util</option>
                      <option value="bConfirmLeague">Confirm League</option>
                      <option value="bMultipleEntry">Multiple Entry</option>
                      <option value="bAutoCreate">Auto Create</option>
                      <option value="bPoolPrize">Pool Prize</option>
                      <option value="bUnlimitedJoin">Unlimited Join</option>
                    </CustomInput>
                  </FormGroup>
                )}
                {seriesLeaderBoard && (
                  <FormGroup>
                    <CustomInput
                      className='ml-0-480 select-sports'
                      id="status"
                      name="status"
                      onChange={(event) => onFiltering(event)}
                      type="select"
                      value={seriesStatus}
                    >
                      <option value="">Status</option>
                      <option value="P">Pending</option>
                      <option value="L">Live</option>
                      <option value="CMP">Completed</option>
                    </CustomInput>
                    {' '}

                  </FormGroup>
                )}
              </Form>
            )}
          </Col>
          <Col
            className={seriesLeaderBoard ? 'series-buttons fdc-480 d-flex align-items-center justify-content-end' : 'league-buttons fdc-480 d-flex align-items-center justify-content-end'}
            lg={(calculate && seriesLeaderBoardDetails?.eStatus === 'CMP') ? 8 : 4}
            md={seriesLeaderBoard ? 4 : 12}
          >
            {props.buttonText && props.permission && !props.addButton && (
              <Button className="theme-btn icon-btn ml-2" onClick={() => openModalPrizeBreakUp(LeagueDetails?._id)}>
                <img alt="add" src={addlIcon} />
                {props.buttonText}
              </Button>
            )}

            {props.buttonText && props.permission && props.addButton && (
              <Button className="theme-btn icon-btn ml-2" tag={Link} to={props.setUrl}>
                <img alt="add" src={addlIcon} />
                {props.buttonText}
              </Button>
            )}
          </Col>
        </Row>
      )}
    </div>
  )
}

LeagueHeader.propTypes = {
  heading: PropTypes.string,
  setUrl: PropTypes.string,
  GameCategoryList: PropTypes.array,
  buttonText: PropTypes.string,
  onExport: PropTypes.func,
  LeagueDetailsLink: PropTypes.string,
  backUrl: PropTypes.string,
  goToLeague: PropTypes.string,
  hidden: PropTypes.any,
  search: PropTypes.string,
  handleSearch: PropTypes.func,
  selectGame: PropTypes.string,
  handleSportType: PropTypes.func,
  permission: PropTypes.bool,
  seriesLBCategory: PropTypes.bool,
  seriesDetails: PropTypes.bool,
  list: PropTypes.object,
  seriesLeaderBoard: PropTypes.bool,
  addButton: PropTypes.bool,
  info: PropTypes.bool,
  prizeDistributionFunc: PropTypes.func,
  winPrizeDistributionFunc: PropTypes.func,
  calculate: PropTypes.bool,
  export: PropTypes.string,
  searchField: PropTypes.string,
  handleSearchBox: PropTypes.func,
  league: PropTypes.bool,
  LeagueCategory: PropTypes.bool,
  onLeagueCategory: PropTypes.func,
  openModalPrizeBreakUp: PropTypes.func,
  onFiltering: PropTypes.func,
  seriesStatus: PropTypes.string
}
export default LeagueHeader
