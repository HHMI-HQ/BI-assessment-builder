import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Divider, TextArea } from '@coko/client/dist/ui'

import {
  FormHeading,
  InputWraper,
  StyledFormItem,
  StyledCheckboxGroup,
  // options
  concernsOptions,
} from './reviewerFormUI'

const Step3 = props => {
  const { concerns } = props

  const [hasConcerns, setHasConcerns] = useState(concerns || [])

  const handleConcernsChange = val => {
    if (val) {
      setHasConcerns(val)
    }
  }

  return (
    <>
      <FormHeading>
        Evaluate the Formating & Writing Style in Educator Mode
      </FormHeading>
      <Divider />
      <InputWraper>
        <StyledFormItem
          label="The construction of this item has:"
          name="concerns"
          rules={[
            {
              required: true,
              message: 'Please select one of the options above.',
            },
          ]}
        >
          <StyledCheckboxGroup
            name="concerns"
            onChange={handleConcernsChange}
            options={concernsOptions}
            vertical
          />
        </StyledFormItem>
        {hasConcerns.includes('clarity') && (
          <StyledFormItem
            label="If clarity-related issue(s) are noted, please explain in detail."
            name="clarityConcerns"
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
        {hasConcerns.includes('grammatical') && (
          <StyledFormItem
            label="If grammatical or structural issues are noted, please explain in detail."
            name="grammaticalConcerns"
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
        {hasConcerns.includes('other') && (
          <StyledFormItem
            label="If other item construction concerns are noted, please explain in detail."
            name="otherConcerns"
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
        <StyledFormItem
          label="Do you have any additional suggestions for improving the item as written?"
          name="suggestions"
        >
          <TextArea />
        </StyledFormItem>
      </InputWraper>
    </>
  )
}

Step3.propTypes = {
  concerns: PropTypes.arrayOf(PropTypes.string),
}

Step3.defaultProps = {
  concerns: [],
}

export default Step3
