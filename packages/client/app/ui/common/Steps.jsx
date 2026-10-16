import React from 'react'
import styled from 'styled-components'
import { Steps as AntSteps } from 'antd'
import { th } from '@coko/client'

const StyledSteps = styled(AntSteps)`
  &&& {
    display: flex;

    .ant-steps-item {
      flex: 1;
    }

    .ant-steps-item:first-child .ant-steps-item-tail {
      margin-inline-start: 0%;
      width: 100%;
    }

    .ant-steps-item .ant-steps-item-tail::after {
      margin-inline-start: 50%;
    }

    .ant-steps-item:last-child .ant-steps-item-tail::after {
      display: none;
    }

    .ant-steps-item-icon {
      height: 12px;
      margin-inline-start: calc(50% - 6px);
      position: relative;
      top: -3px;
      width: 12px;

      .ant-steps-icon-dot {
        border: 1px solid ${th('colorPrimary')};
        border-radius: 50%;
      }
    }

    .ant-steps-item.ant-steps-item-finish {
      .ant-steps-item-tail::after {
        background-color: ${th('colorPrimary')};
      }

      .ant-steps-icon .ant-steps-icon-dot {
        background-color: ${th('colorPrimary')};
      }
    }
  }
`

const Steps = props => {
  return <StyledSteps {...props} />
}

export default Steps
