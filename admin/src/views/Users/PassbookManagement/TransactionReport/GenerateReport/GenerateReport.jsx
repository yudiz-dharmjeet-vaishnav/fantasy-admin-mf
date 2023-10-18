import React, { forwardRef, Fragment, useEffect, useRef, useState } from 'react'
import { Button, Col, CustomInput, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import moment from 'moment'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'

import calendarIcon from '../../../../../assets/images/calendar.svg'

import Loading from '../../../../../components/Loading'

function GenerateReport (props) {
  const { generateReportModal, setGenerateReportModal, getMatchListFunc, getMatchesTotalCountFunc, getMatchLeagueListFunc, generateTransactionReportFunc } = props
  const toggleModal = () => setGenerateReportModal(false)
  const [transactionType, setTransactionType] = useState('')
  const [type, setType] = useState('')
  const [transactionStatus, setTransactionStatus] = useState('')
  const [sportsType, setSportsType] = useState('')
  const [match, setMatch] = useState([])
  const [matchLeague, setMatchLeague] = useState([])
  const [matchOptions, setMatchOptions] = useState([])
  const [matchLeagueOptions, setMatchLeagueOptions] = useState([])
  const [searchValue, setSearchValue] = useState([])
  const [searchType, setSearchType] = useState([])
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [limit] = useState(20)
  const [dateRangeErr, setDateRangeErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [matchActivePage, setMatchActivePage] = useState(1)
  const [matchLeagueActivePage, setMatchLeagueActivePage] = useState(1)
  const [matchTotal, setMatchTotal] = useState(0)
  const [matchLeagueTotal, setMatchLeagueTotal] = useState(0)

  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const matchList = useSelector(state => state.match.matchList)
  const matchesTotalCount = useSelector(state => state.match.matchesTotalCount)
  const matchLeagueList = useSelector(state => state.matchleague.matchLeagueList)
  const previousProps = useRef({ sportsType, match, searchValue, matchList, matchLeagueList }).current

  useEffect(() => {
    if (previousProps.sportsType !== sportsType) {
      if (sportsType) {
        const start = 0
        getMatchListFunc(start, limit, searchValue, sportsType)
        getMatchesTotalCountFunc(searchValue, sportsType)
      }
    }
    return () => {
      previousProps.sportsType = sportsType
    }
  }, [sportsType])

  useEffect(() => {
    if (previousProps.match !== match) {
      if (match) {
        const start = 0
        getMatchLeagueListFunc(start, limit, '', searchValue, match.value, sportsType)
      }
    }
    return () => {
      previousProps.match = match
    }
  }, [match])

  useEffect(() => {
    if (previousProps.matchList !== matchList) {
      if (matchList?.results?.length > 0) {
        const arr = [...matchOptions]
        matchList.results.map((match) => {
          const obj = {
            value: match._id,
            label: match.sName + '(' + moment(match?.dStartDate).format('DD/MM/YYYY hh:mm:ss A') + ')'
          }
          arr.push(obj)
          return arr
        })
        setMatchOptions(arr)
      }
      setLoading(false)
    }
    if (previousProps.matchesTotalCount !== matchesTotalCount) {
      setMatchTotal(matchesTotalCount?.count ? matchesTotalCount.count : 0)
      setLoading(false)
    }
    return () => {
      previousProps.matchList = matchList
      previousProps.matchesTotalCount = matchesTotalCount
    }
  }, [matchList, matchesTotalCount])

  useEffect(() => {
    if (previousProps.matchLeagueList !== matchLeagueList) {
      if (matchLeagueList?.results?.length > 0) {
        const arr = [...matchLeagueOptions]
        matchLeagueList.results.map((match) => {
          const obj = {
            value: match._id,
            label: match.sName
          }
          arr.push(obj)
          return arr
        })
        setMatchLeagueOptions(arr)
      }
      setLoading(false)
    }
    if (matchLeagueList && matchLeagueList.nTotal) {
      setMatchLeagueTotal(matchLeagueList.nTotal)
    }
    return () => {
      previousProps.matchLeagueList = matchLeagueList
    }
  }, [matchLeagueList])

  function onFiltering (event, type) {
    if (type === 'TransactionType') {
      setTransactionType(event.target.value)
    } else if (type === 'eType') {
      setType(event.target.value)
    } else if (type === 'TransactionStatus') {
      setTransactionStatus(event.target.value)
    } else if (type === 'SportsType') {
      setSportsType(event.target.value)
    }
  }

  // function to put custom input in date-picker
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range-notify' onClick={onClick}>
      <img alt='calendar' src={calendarIcon} />
      <Input ref={ref} className='range' placeholder='Select Date Range' readOnly value={value} />
      {/* {((!startDate) && (!endDate)) && <img src={calendarIcon} alt="calendar" />} */}
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  function handleChange (event, type) {
    switch (type) {
      case 'Match':
        setMatch(event)
        break
      case 'MatchLeague':
        setMatchLeague(event)
        break
      default:
        break
    }
  }

  function handleInputChange (value, type) {
    setSearchValue(value)
    setSearchType(type)
  }

  useEffect(() => {
    const callSearchService = () => {
      if (searchType === 'Match') {
        const isMatchTotalValid = (matchTotal !== matchOptions.length)
        const isValueNotInList = !(matchList?.results?.some(match => match?.sName?.toUpperCase().includes(searchValue) || match?.sName?.toLowerCase().includes(searchValue)))
        if (isMatchTotalValid && isValueNotInList) {
          const start = 0
          getMatchListFunc(start, limit, searchValue, sportsType)
          getMatchesTotalCountFunc(searchValue, sportsType)
          setLoading(true)
        }
      } else if (searchType === 'MatchLeague') {
        const start = 0
        const isMatchLeagueTotalValid = (matchLeagueTotal !== matchLeagueOptions.length)
        const isMatchLeagueNotInList = !(matchLeagueList.results.some(data => data.sName.toUpperCase().includes(searchValue) || data.sName.toLowerCase().includes(searchValue)))
        if (isMatchLeagueTotalValid && isMatchLeagueNotInList) {
          getMatchLeagueListFunc(start, limit, 'LEAGUE', searchValue, match.value, sportsType)
          setLoading(true)
        }
      }
    }
    if (previousProps.searchValue !== searchValue) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.searchValue = searchValue
      }
    }
    return () => {
      previousProps.searchValue = searchValue
    }
  }, [searchValue])

  function onMatchPagination () {
    const length = Math.ceil(matchTotal / 10)
    if (matchActivePage < length) {
      const start = matchActivePage * 10
      getMatchListFunc(start, limit, searchValue, sportsType)
      getMatchesTotalCountFunc(searchValue, sportsType)
      setMatchActivePage(matchActivePage + 1)
    }
  }

  function onMatchLeaguePagination () {
    const length = Math.ceil(matchLeagueTotal / 10)
    if (matchLeagueActivePage < length) {
      const start = matchLeagueActivePage * 10
      getMatchLeagueListFunc(start, limit, '', searchValue, match.value, sportsType)
      setMatchLeagueActivePage(matchLeagueActivePage + 1)
    }
  }

  function onSubmit (e) {
    e.preventDefault()
    let validate = false
    if (match?.value) {
      validate = match?.value
    } else {
      validate = startDate && endDate
    }
    if (validate) {
      generateTransactionReportFunc(startDate, endDate, transactionType, type, transactionStatus, sportsType, match?.value || '', matchLeague?.value || '')
    } else {
      if (!(match?.value) && (!startDate || !endDate)) {
        setDateRangeErr('Required field')
      }
    }
  }

  return (
    <Modal className='modal-league-analytics' isOpen={generateReportModal}>
      <ModalHeader className='popup-modal-header modal-title-head w-100' toggle={toggleModal}>Generate Report</ModalHeader>
      <ModalBody className="modal-prize-popup p-4">
        {loading && <Loading />}

        <Form>
          <Row>
            <Col className='mt-2' md={6} xl={6}>
              <FormGroup>
                <Label for='dateRange'>Date Range</Label>
                <DatePicker
                  customInput={<ExampleCustomInput />}
                  dropdownMode="select"
                  endDate={endDate}
                  isClearable={true}
                  maxDate={new Date()}
                  onChange={(update) => {
                    setDateRange(update)
                    setDateRangeErr('')
                  }}
                  peekNextMonth
                  placeholderText='Select Date Range'
                  selectsRange={true}
                  showMonthDropdown
                  showYearDropdown
                  startDate={startDate}
                  value={dateRange}
                />
                <p className='error-text'>{dateRangeErr}</p>
              </FormGroup>
            </Col>
            <Col className='mt-2' md={6} xl={6}>
              <FormGroup>
                <Label for='sportsType'>Sports Type</Label>
                <CustomInput
                  className="custom-input-transaction"
                  id="sportsType"
                  name="sportsType"
                  onChange={(event) => onFiltering(event, 'SportsType')}
                  type="select"
                  value={sportsType}
                >
                  <option value="">All</option>
                  <option value="CRICKET">Cricket</option>
                  <option value="FOOTBALL">Football</option>
                  <option value="BASKETBALL">Basketball</option>
                  <option value="KABADDI">Kabaddi</option>
                </CustomInput>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-2'>
            <Col className='mt-2' md={6} xl={6}>
              <FormGroup>
                <Label for='Match'>Match</Label>
                <Select
                  controlShouldRenderValue={matchOptions}
                  id='match'
                  isDisabled={adminPermission?.MATCH === 'R' || !sportsType}
                  name='match'
                  onChange={(selectedOption) => handleChange(selectedOption, 'Match')}
                  onInputChange={(value) => handleInputChange(value, 'Match')}
                  onMenuScrollToBottom={onMatchPagination}
                  options={matchOptions}
                  placeholder='Select a Match'
                  type='select'
                  value={match}
                />
              </FormGroup>
            </Col>
            <Col className='mt-2' md={6} xl={6}>
              <FormGroup>
                <Label for='Match'>Match League</Label>
                <Select
                  controlShouldRenderValue={matchLeagueOptions}
                  id='matchLeague'
                  isDisabled={adminPermission?.MATCH === 'R' || Object.keys(match).length === 0}
                  name='matchLeague'
                  onChange={(selectedOption) => handleChange(selectedOption, 'MatchLeague')}
                  onInputChange={(value) => handleInputChange(value, 'MatchLeague')}
                  onMenuScrollToBottom={onMatchLeaguePagination}
                  options={matchLeagueOptions}
                  placeholder='Select a Match League'
                  type='select'
                  value={matchLeague}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-2'>
            <Col className='mt-2' md={6} xl={6}>
              <FormGroup>
                <Label for='transactionStatus'>Transaction Status</Label>
                <CustomInput
                  className="custom-input-transaction"
                  id="transactionStatus"
                  name="transactionStatus"
                  onChange={(event) => onFiltering(event, 'TransactionStatus')}
                  type="select"
                  value={transactionStatus}
                >
                  <option value="">All</option>
                  <option value="CMP">Completed</option>
                  <option value="R">Refunded</option>
                  <option value="CNCL">Cancelled</option>
                </CustomInput>
              </FormGroup>
            </Col>
            <Col className='mt-2' md={6} xl={6}>
              <FormGroup>
                <Label for='eType'>Type</Label>
                <CustomInput
                  className="custom-input-transaction"
                  id="eType"
                  name="eType"
                  onChange={(event) => onFiltering(event, 'eType')}
                  type="select"
                  value={type}
                >
                  <option value="">All</option>
                  <option value="Cr">Credited</option>
                  <option value="Dr">Debited</option>
                </CustomInput>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mb-3 mt-2'>
            <Col className='mt-2' md={6} xl={6}>
              <FormGroup>
                <Label for='TransactionType'>Transaction Type</Label>
                <CustomInput
                  id="TransactionType"
                  name="TransactionType"
                  onChange={(event) => onFiltering(event, 'TransactionType')}
                  type="select"
                  value={transactionType}
                >
                  <option value="">All</option>
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
              </FormGroup>
            </Col>
          </Row>

          <div>
            {
            ((Auth && Auth === 'SUPER') || (adminPermission?.PASSBOOK !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn full-btn" onClick={onSubmit} type="submit">Generate</Button>
              </Fragment>
            )
          }
          </div>
        </Form>
      </ModalBody>
    </Modal>
  )
}

GenerateReport.propTypes = {
  generateReportModal: PropTypes.bool,
  setGenerateReportModal: PropTypes.func,
  value: PropTypes.string,
  onClick: PropTypes.func,
  token: PropTypes.string,
  getMatchListFunc: PropTypes.func,
  getMatchesTotalCountFunc: PropTypes.func,
  getMatchLeagueListFunc: PropTypes.func,
  generateTransactionReportFunc: PropTypes.func
}

export default GenerateReport
