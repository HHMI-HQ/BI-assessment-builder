import React, { useState } from 'react'
import styled from 'styled-components'
import { grid } from '@coko/client'
import { Divider, TextArea } from '@coko/client/dist/ui'
import PropTypes from 'prop-types'
import { Form, Radio, CheckboxGroup } from '../common'

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

const StyledCheckboxGroup = styled(CheckboxGroup)`
  padding-inline: ${grid(2)};

  label:not(:first-child) {
    margin-block-start: ${grid(1)};
  }

  .ant-checkbox {
    align-self: self-start;
    margin-top: 3px;
  }
`

const hasIssuesOptions = [
  {
    label: 'There are NO content-related issues',
    value: false,
  },
  {
    label: 'There are content-related issues  ',
    value: true,
  },
]

const issuesOptions = [
  {
    label: 'There is a factual error in the stem',
    value: 'factualError',
  },
  {
    label: 'Sufficient detail to answer the item is lacking',
    value: 'insufficientDetail',
  },
  {
    label:
      'The content of this item does not incorporate the most up-to-date understanding in the field',
    value: 'outdated',
  },
  {
    label: 'There are other content-related issues',
    value: 'simple',
  },
]

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
        Now, toggle your view to Educator mode to complete the rest of your
        review.
      </ExplanatoryParagraph>
      <Divider />
      <InputWraper>
        <StyledFormItem
          label="Evaluating content"
          name="hasIssues"
          rules={[
            {
              required: true,
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
          <>
            <StyledFormItem
              label="You identified content-related issues; please select all that apply:"
              name="issuesIdentification"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <StyledCheckboxGroup
                name="issuesIdentification"
                options={issuesOptions}
                vertical
              />
            </StyledFormItem>
            <StyledFormItem
              label="Please explain the issue(s) in greater detail:"
              name="issuesDetails"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea />
            </StyledFormItem>
          </>
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
