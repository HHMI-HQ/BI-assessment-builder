import styled from 'styled-components'
import { grid } from '@coko/client'
import { CheckboxGroup, Form, Radio } from '../../common'

export const FormHeading = styled.h3`
  text-align: center;
  text-wrap: balance;
`

export const ExplanatoryParagraph = styled.p`
  padding-inline: ${grid(2)};
`

export const InputWraper = styled.div`
  padding: ${grid(2)};
`

export const StyledFormItem = styled(Form.Item)`
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

export const StyledRadio = styled(Radio)`
  padding-inline: ${grid(2)};

  label:not(:first-child) {
    margin-block-start: ${grid(1)};
  }
`

export const StyledCheckboxGroup = styled(CheckboxGroup)`
  padding-inline: ${grid(2)};

  label:not(:first-child) {
    margin-block-start: ${grid(1)};
  }

  .ant-checkbox {
    align-self: self-start;
    margin-top: 3px;
  }
`
