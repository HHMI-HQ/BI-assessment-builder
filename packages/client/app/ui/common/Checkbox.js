import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Checkbox as AntCheckbox } from 'antd'

// define css here and export to use in CheckboxGroup as well
export const checkboxStyles = css`
  .ant-checkbox-inner,
  .ant-checkbox-checked,
  .ant-checkbox-inner::after {
    transition: all 0.2s;
  }
`

const StyledCheckbox = styled(AntCheckbox)`
  ${checkboxStyles}
`

const Checkbox = props => {
  const { ariaLabel, children, className, ...rest } = props
  const checkbox = useRef(null)

  useEffect(() => {
    if (ariaLabel) {
      checkbox.current.input.setAttribute('aria-label', ariaLabel)
    }
  }, [])

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <StyledCheckbox className={className} {...rest} ref={checkbox}>
      {children}
    </StyledCheckbox>
  )
}

Checkbox.propTypes = {
  /** optional attribute for aria-label when the checkbox is rendered with no label */
  ariaLabel: PropTypes.string,
}

Checkbox.defaultProps = {
  ariaLabel: '',
}

export default Checkbox
