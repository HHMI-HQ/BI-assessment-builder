import React from 'react'
import styled from 'styled-components'
import { grid } from '@coko/client'
import { Divider, TextArea } from '@coko/client/dist/ui'
import { Form, Radio } from '../common'

const FormHeading = styled.h3`
  text-align: center;
  text-wrap: balance;
`

const ExplanatoryParagraph = styled.p`
  padding-inline: ${grid(2)};
`

const InputWraper = styled.div`
  padding: ${grid(2)};
`

const StyledFormItem = styled(Form.Item)`
  margin-block-end: ${grid(8)};

  .ant-form-item-label {
    margin-block-end: ${grid(4)};

    label {
      align-items: flex-start;

      &::before {
        margin-block-start: ${grid(1)};
      }
    }
  }
`

const StyledRadio = styled(Radio)`
  padding-inline: ${grid(2)};

  label:not(:first-child) {
    margin-block-start: ${grid(1)};
  }
`

const yesOrNoOptions = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
]

const difficultyOptions = [
  {
    label: 'Appropriate',
    value: 'appropriate',
  },
  {
    label: 'Too difficult',
    value: 'difficult',
  },
  {
    label: 'Too simple',
    value: 'simple',
  },
]

const Step1 = props => {
  return (
    <>
      <FormHeading>Analyze the Assessment Item in Learner Mode</FormHeading>
      <ExplanatoryParagraph>
        You should be viewing the item as a learner would. Please attempt to
        answer the item and complete the questions below.
      </ExplanatoryParagraph>
      <Divider />
      <InputWraper>
        <StyledFormItem
          label="Did you answer the item correctly?"
          name="answeredCorrectly"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <StyledRadio
            name="answeredCorrectly"
            options={yesOrNoOptions}
            vertical
          />
        </StyledFormItem>
        <StyledFormItem
          label="Were there any barriers or points of confusion for you in answering this item?"
          name="barriers"
        >
          <TextArea />
        </StyledFormItem>
        <StyledFormItem
          label="In the context of your biology course, the content assessed by this item is:"
          name="difficulty"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <StyledRadio name="difficulty" options={difficultyOptions} vertical />
        </StyledFormItem>
      </InputWraper>
    </>
  )
}

export default Step1
