import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid } from '@coko/client'
import { Divider, TextArea } from '@coko/client/dist/ui'
import { Form, Radio, CheckboxGroup, Input } from '../common'

const FormHeading = styled.h3`
  text-align: center;
  text-wrap: balance;
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

const concernsOptions = [
  {
    label: 'No clarity, grammatical, structural, or other concerns',
    value: false,
  },
  {
    label: 'Clarity, grammatical, structural, or other concerns',
    value: true,
  },
]

const concernsSpecificsOptions = [
  {
    label: 'Clarity concerns',
    value: 'clarity',
  },
  {
    label: 'Grammatical or structural concerns',
    value: 'gramatical',
  },
  {
    label: 'Other Item construction concerns',
    value: 'other',
  },
]

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
