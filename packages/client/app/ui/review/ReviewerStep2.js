import React, { useState } from 'react'
import { Divider, TextArea } from '@coko/client/dist/ui'
import PropTypes from 'prop-types'
import {
  FormHeading,
  ExplanatoryParagraph,
  InputWraper,
  StyledFormItem,
  StyledRadio,
  // options
  hasIssuesOptions,
} from './reviewerFormUI'

const Step2 = props => {
  const { hasIssues: savedIssues } = props

  const [hasIssues, setHasIssues] = useState(savedIssues)

  const handleIssuesDetection = val => {
    setHasIssues(val)
  }

  return (
    <>
      <FormHeading>Evaluate the Content in Educator Mode</FormHeading>
      <ExplanatoryParagraph>
        Now, toggle your view to Educator to complete the rest of your review
        for this item.
      </ExplanatoryParagraph>
      <Divider />
      <InputWraper>
        <StyledFormItem
          label="Evaluating content"
          name="hasIssues"
          rules={[
            {
              required: true,
              message: 'Please select one of the options above.',
            },
          ]}
        >
          <StyledRadio
            name="hasIssues"
            onChange={handleIssuesDetection}
            options={hasIssuesOptions}
            vertical
          />
        </StyledFormItem>
        {hasIssues && (
          <StyledFormItem
            label="You identified content-related issues; please explain in greater detail:"
            name="issuesDetails"
            rules={[
              {
                required: true,
                message: 'This field is required.',
              },
            ]}
          >
            <TextArea />
          </StyledFormItem>
        )}
      </InputWraper>
    </>
  )
}

Step2.propTypes = {
  hasIssues: PropTypes.bool,
}

Step2.defaultProps = {
  hasIssues: false,
}

export default Step2
