import React from 'react'
import { Divider, TextArea } from '@coko/client/dist/ui'

import {
  FormHeading,
  ExplanatoryParagraph,
  InputWraper,
  StyledFormItem,
  StyledRadio,
  // options
  yesOrNoOptions,
  difficultyOptions,
} from './reviewerFormUI'

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
