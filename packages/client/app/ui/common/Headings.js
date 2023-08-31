// eslint-disable-next-line react/jsx-props-no-spreading

import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { Typography } from 'antd'

const { Title } = Typography

const TitleWrapper = styled.div`
  align-items: center;
  background: ${p =>
    p.level === 1 && `linear-gradient(60deg, #00763a, #8ac341)`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0;
  ${p =>
    p.level === 1 &&
    css`
      height: 10rem;
      & h1 {
        color: #fff;
        margin: 0;
        text-shadow: 0 1px 5px #0006;
      }
    `};

  text-align: center;
  width: 100%;
`

const Heading = props => {
  const { className, children, level } = props

  return (
    <TitleWrapper className={className} level={level}>
      <Title>{children}</Title>
    </TitleWrapper>
  )
}

Heading.propTypes = {
  level: PropTypes.number,
}

Heading.defaultProps = {
  level: 1,
}

export const H1 = ({ children, className }) => (
  <Heading className={className} level={1}>
    {children}
  </Heading>
)

export const H2 = ({ children, className }) => (
  <Heading className={className} level={2}>
    {children}
  </Heading>
)

export const H3 = ({ children, className }) => (
  <Heading className={className} level={3}>
    {children}
  </Heading>
)

export const H4 = ({ children, className }) => (
  <Heading className={className} level={4}>
    {children}
  </Heading>
)

export const H5 = ({ children, className }) => (
  <Heading className={className} level={5}>
    {children}
  </Heading>
)
