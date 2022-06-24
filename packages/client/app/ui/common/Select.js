/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { debounce as lodashDebounceFunc } from 'lodash'

import { Select as AntSelect } from 'antd'

// no ref for Select component, so we need a wrapper to attach the ref and query its children
const Wrapper = styled.div`
  .ant-select {
    width: 100%;
  }
`

const StyledSelect = styled(AntSelect)`
  width: 100%;
`

const StyledDropdown = styled.div`
  .ant-select-item-option-content {
    ${props =>
      props.wrapOptionText &&
      css`
        white-space: normal;
      `}
  }
`

const dropdownRender = (menu, wrapOptionText) => (
  <StyledDropdown wrapOptionText={wrapOptionText}>{menu}</StyledDropdown>
)

const Select = props => {
  const {
    async,
    className,
    // debounce,
    debounceTimeout,

    // disable rule for props handled by ant
    /* eslint-disable react/prop-types */
    filterOption,
    notFoundContent,
    onSearch,
    showSearch,
    /* eslint-enable react/prop-types */

    wrapOptionText,
    ...rest
  } = props

  const selectRef = useRef(null)

  // axe devtools complains about missing aria-expanded attribute
  // it is added after you click on the element, but in the beginning it is not present
  useEffect(() => {
    selectRef.current
      .querySelector(`.ant-select [role="combobox"]`)
      .setAttribute('aria-expanded', false)
  }, [])

  const handleSearch = searchValue => {
    onSearch(searchValue)
  }

  // const useDebounce = async ? true : debounce

  const searchFunc = async
    ? lodashDebounceFunc(handleSearch, debounceTimeout)
    : handleSearch

  return (
    <Wrapper ref={selectRef}>
      <StyledSelect
        className={className}
        dropdownRender={menu => dropdownRender(menu, wrapOptionText)}
        filterOption={async && !filterOption ? false : filterOption}
        notFoundContent={!notFoundContent && async ? null : notFoundContent}
        onSearch={onSearch && searchFunc}
        showSearch={showSearch || !!onSearch}
        {...rest}
      />
    </Wrapper>
  )
}

Select.propTypes = {
  async: PropTypes.bool,
  // debounce: PropTypes.bool,
  debounceTimeout: PropTypes.number,
  wrapOptionText: PropTypes.bool,
}

Select.defaultProps = {
  async: false,
  // debounce: false,
  debounceTimeout: 500,
  wrapOptionText: false,
}

export default Select
