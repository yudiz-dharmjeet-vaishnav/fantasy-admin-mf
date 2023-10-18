import React from 'react'
import PropTypes from 'prop-types'
import { CustomInput } from 'reactstrap'
import Pagination from 'rc-pagination'
import localeInfo from '../locale/en_US'

// Common component for pagination
const PaginationComponent = props => {
  const { activePageNo, startingNo, endingNo, total, listLength, setListLength, setPageNo, setOffset, offset, setStart, paginationFlag } = props
  function onChangeLength (event) {
    let limit
    if (event?.target?.value?.includes(5)) {
      limit = 5
    } else if (event?.target?.value?.includes(7)) {
      limit = 7
    } else if (event?.target?.value?.includes(10)) {
      limit = 10
    } else if (event?.target?.value?.includes(20)) {
      limit = 20
    } else if (event?.target?.value?.includes(30)) {
      limit = 30
    } else if (event?.target?.value?.includes(40)) {
      limit = 40
    }
    paginationFlag.current = true
    setStart(0)
    setListLength(`${limit} Rows`)
    setOffset(limit)
    setPageNo(1)
  }
  const localCollapse = JSON?.parse(localStorage?.getItem('collapse'))

  // this function will called when page changes
  function onPageChange (current, pageSize) {
    if (current !== activePageNo) {
      paginationFlag.current = true
      setStart((current - 1) * offset)
      setOffset(offset)
    }
    setPageNo(current, { method: 'push' })
  }

  return (

    <div className={`d-flex justify-content-between align-items-center fdc-480 margin-top-10px-480 ${localCollapse === true ? 'collapse-pagination' : 'main-pagination'}`}>
      <div className='showing-pagination d-flex align-items-center fdc-480 margin-top-10px-480'>
        {total !== 0 && (
          <div>
            {`Showing ${startingNo} To ${endingNo} of `}
            <b>{`${total} `}</b>
            {' '}
          </div>
        )}
      </div>

      <Pagination
        current={activePageNo}
        locale={localeInfo}
        onChange={onPageChange}
        onShowSizeChange={onChangeLength}
        pageSize={offset}
        showQuickJumper
        showSizeChanger
        total={total}
      />

      <div className='showing-pagination-show d-flex align-items-center fdc-480 margin-top-10px-480'>
        <div>
          <b>Show</b>
        </div>
        <div className='ml-3 ml-0-480 margin-top-10px-480'>
          <CustomInput
            className='custom-select-row'
            id='customSelect'
            name='customSelect'
            onChange={(e) => onChangeLength(e)}
            type='select'
            value={listLength}
          >
            <option>5 Rows</option>
            <option>7 Rows</option>
            <option>10 Rows</option>
            <option>20 Rows</option>
            <option>30 Rows</option>
            <option>40 Rows</option>
          </CustomInput>
        </div>
      </div>
    </div>
  )
}

PaginationComponent.propTypes = {
  activePageNo: PropTypes.number,
  startingNo: PropTypes.number,
  endingNo: PropTypes.number,
  total: PropTypes.number,
  listLength: PropTypes.string,
  setOffset: PropTypes.func,
  setLoading: PropTypes.func,
  setStart: PropTypes.func,
  setListLength: PropTypes.func,
  offset: PropTypes.number,
  setPageNo: PropTypes.func,
  paginationFlag: PropTypes.object
}

export default PaginationComponent
