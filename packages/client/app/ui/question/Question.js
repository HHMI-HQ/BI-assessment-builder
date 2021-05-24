import React from 'react'
// import PropTypes from 'prop-types'
import styled from 'styled-components'

import { grid, th } from '@coko/client'
import { LeftOutlined } from '@ant-design/icons'

import Metadata from './Metadata'
import { Button, Checkbox, Split, Tabs } from '../common'

const Wrapper = styled.div``

const StyledBackButton = styled(Button)`
  margin-right: ${grid(2)};
`

const RightAreaWrapper = styled.div`
  > label {
    margin-right: ${grid(2)};
  }
`

const EditorWrapper = styled.div`
  align-items: center;
  background-color: ${th('colorSecondary')};
  color: white;
  display: flex;
  font-size: 26px;
  height: 100%;
  justify-content: center;
`

// QUESTION submit button here seems to be outside the form
// submit also refers to wax
// does all this pose an accessibility problem?

const Question = props => {
  const { className } = props

  const BackButton = (
    <StyledBackButton icon={<LeftOutlined />}>Back</StyledBackButton>
  )

  const RightArea = (
    <RightAreaWrapper>
      <Checkbox>Accept terms and conditions</Checkbox>
      <Button type="primary">Submit</Button>
    </RightAreaWrapper>
  )

  return (
    <Wrapper className={className}>
      <Tabs
        tabBarExtraContent={{
          left: BackButton,
          right: RightArea,
        }}
      >
        <Tabs.TabPane key={0} tab="Question">
          <Split gutter={8} splitAt={16}>
            <EditorWrapper>Wax placeholder</EditorWrapper>
            <Metadata />
          </Split>
        </Tabs.TabPane>
      </Tabs>
    </Wrapper>
  )
}

Question.propTypes = {}

Question.defaultProps = {}

export default Question
