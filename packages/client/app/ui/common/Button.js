import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import { Button as AntButton } from 'antd'
import { omit, pick } from 'lodash'

import { darken, th, grid } from '@coko/client'

const colors = {
  danger: 'colorError',
  error: 'colorError',
  success: 'colorSuccess',
  // warn: 'colorWarning',
}

const CustomButtonStyles = css`
  box-shadow: none;
  font-size: ${th('fontSizeBase')};
  /* let lineHeight expand the button height */
  height: unset;
  line-height: ${th('lineHeightBase')};
  ${props =>
    props.direction === 'rtl' &&
    css`
      direction: rtl;

      .anticon + span {
        margin-right: 8px;
        margin-left: 0;
      }
    `};

  ${props => {
    const { status, theme, type, ghost, disabled } = props

    if (disabled) return null

    if (!Object.keys(colors).includes(status)) {
      if (type === 'primary' && !ghost) {
        return css`
          &:hover,
          &:focus,
          &:active {
            background-color: ${darken('colorPrimary', 0.25)} !important;
          }
        `
      }

      return css`
        &:hover,
        &:focus,
        &:active {
          border-color: ${darken('colorPrimary', 0.25)} !important;
          color: ${darken('colorPrimary', 0.25)} !important;
        }
      `
    }

    const color = theme[colors[status]]

    // primary
    if (type === 'primary')
      return css`
        background-color: ${color};
        border-color: ${color};
        color: ${theme.colorTextReverse};

        &:hover,
        &:focus,
        &:active {
          border-color: ${color};
          color: ${theme.colorTextReverse};
        }

        &:hover,
        &:focus {
          background-color: ${darken(color, 0.25)} !important;
        }

        &:active {
          background-color: ${darken(color, 0.25)} !important;
        }
      `

    // non-primary
    return css`
      color: ${color};
      border-color: ${color};

      &:hover,
      &:focus {
        color: ${darken(color, 0.25)};
        border-color: ${darken(color, 0.25)};
      }

      &:active {
        color: ${darken(color, 0.25)};
        border-color: ${darken(color, 0.25)};
      }
    `
  }}
  padding: 0 ${grid(4)};
`

const StyledButton = styled(AntButton)`
  ${CustomButtonStyles}
`

const StyledLink = styled(Link)`
  ${CustomButtonStyles}
`

/**
 * API is the same as https://ant.design/components/button/#API, except for the
 * `danger` prop, which is ommited in favour of `status`, described below.
 */

const Button = props => {
  const { children, className, autoFocus, to, ...rest } = props
  const passProps = omit(rest, 'danger')

  const buttonRef = useRef(null)

  useEffect(() => {
    if (autoFocus) {
      buttonRef.current?.focus()
    }
  }, [])

  if (to !== '') {
    const prefixCls = 'ant-btn'
    const sizeClassNameMap = { large: 'lg', small: 'sm' }

    const classes = [
      prefixCls,
      rest.shape !== 'default' && rest.shape && `${prefixCls}-${rest.shape}`,
      rest.type && `${prefixCls}-${rest.type}`,
      rest.size &&
        rest.size !== 'middle' &&
        `${prefixCls}-${sizeClassNameMap[rest.size]}`,
      rest.ghost && `${prefixCls}-background-ghost`,
      rest.block && `${prefixCls}-block`,
      rest.direction === 'rtl' && `${prefixCls}-rtl`,
      className,
    ].filter(Boolean)

    // only keep releant props when rendering a Link
    const linkProps = pick(rest, ['target', 'onClick'])

    return (
      <StyledLink className={classes} ref={buttonRef} to={to} {...linkProps}>
        {rest.icon}
        <span>{children}</span>
      </StyledLink>
    )
  }

  return (
    <StyledButton className={className} ref={buttonRef} {...passProps}>
      {children}
    </StyledButton>
  )
}

Button.propTypes = {
  status: PropTypes.oneOf(['error', 'danger', 'success']),
  autoFocus: PropTypes.bool,
  to: PropTypes.string,
}

Button.defaultProps = {
  status: null,
  autoFocus: false,
  to: '',
}

export default Button
