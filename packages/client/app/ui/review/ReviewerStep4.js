import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Divider, TextArea } from '@coko/client/dist/ui'
import { Input } from '../common'

import {
  FormHeading,
  InputWraper,
  StyledFormItem,
  StyledRadio,
  StyledCheckboxGroup,
  // options
  concernsOptions,
  concernsSpecificsOptions,
} from './reviewerFormUI'

const Step3 = props => {
  const { concerns, concernsSpecifics } = props

  const [hasConcerns, setHasConcerns] = useState(concerns)

  const [otherConcerns, setOtherConcerns] = useState(
    concernsSpecifics?.indexOf('other') > -1,
  )

  const handleConcernsChange = val => {
    if (val) {
      setHasConcerns(true)
    } else {
      setHasConcerns(false)
    }
  }

  const handleConcernsSpecificsChange = vals => {
    if (vals.indexOf('other') > -1) {
      setOtherConcerns(true)
    } else {
      setOtherConcerns(false)
    }
  }

  return (
    <>
      <FormHeading>
        Evaluate the Formatin & Writing Style in Educator Mode
      </FormHeading>
      <Divider />
      <InputWraper>
        <StyledFormItem
          label="The construction of this item has:"
          name="concerns"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <StyledRadio
            name="concerns"
            onChange={handleConcernsChange}
            options={concernsOptions}
            vertical
          />
        </StyledFormItem>
        {hasConcerns && (
          <>
            <StyledFormItem
              label="Which clarity, grammatical, structural, or other item construction concerns do you have? Select all that apply."
              name="concernsSpecifics"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <StyledCheckboxGroup
                name="concernsSpecifics"
                onChange={handleConcernsSpecificsChange}
                options={concernsSpecificsOptions}
                vertical
              />
            </StyledFormItem>
            {otherConcerns && (
              <StyledFormItem
                label="Specify other concerns about item construction:"
                name="otherConcerns"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </StyledFormItem>
            )}
            <StyledFormItem
              label="Please explain the clarity-related issue(s) in greater detail:"
              name="concernsDetails"
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
  concerns: PropTypes.bool,
  concernsSpecifics: PropTypes.arrayOf(PropTypes.string),
}

Step3.defaultProps = {
  concerns: false,
  concernsSpecifics: [],
}

export default Step3
