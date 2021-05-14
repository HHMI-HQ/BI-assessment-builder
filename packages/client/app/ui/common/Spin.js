/**
 * Spinner code license here (MIT): https://github.com/tobiasahlin/SpinKit/blob/master/LICENSE
 */

import React from 'react'
// import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { Spin as AntSpin } from 'antd'

const bounce = keyframes`
   0%, 100% {
     transform: scale(0.0);
   } 
   
   50% {
     transform: scale(1.0);
   }
`

const IndicatorWrapper = styled.div`
  height: 40px;
  position: relative;
  width: 40px;
`

const BounceOne = styled.div`
  animation: ${bounce} 2s infinite ease-in-out;
  background-color: ${props => props.theme.colorPrimary};
  border-radius: 50%;
  height: 100%;
  left: 0;
  opacity: 0.6;
  position: absolute;
  top: 0;
  width: 100%;
`

const BounceTwo = styled(BounceOne)`
  animation-delay: -1s;
`

const Indicator = () => (
  <IndicatorWrapper>
    <BounceOne />
    <BounceTwo />
  </IndicatorWrapper>
)

const Spin = props => {
  const { className } = props

  return <AntSpin className={className} indicator={<Indicator />} />
}

Spin.propTypes = {}

Spin.defaultProps = {}

export default Spin
