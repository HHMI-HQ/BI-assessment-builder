/* eslint-disable react/jsx-props-no-spreading */

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { debounce } from 'lodash'

import { Form as AntForm } from 'antd'
import { grid } from '@coko/client'

import BasicRibbon from './Ribbon'

const FormWrapper = styled.div``

const Ribbon = styled(BasicRibbon)`
  margin-bottom: ${grid(2)};
`

const FormItem = props => {
  /**
   * Disable prop types as these props will be checked in the `AntForm.Item`
   * component. Enable again if you introduce custom props.
   */

  /* eslint-disable-next-line react/prop-types */
  const { children, onBlur, validateTrigger, ...rest } = props
  const [lostFocusOnce, setLostFocusOnce] = useState(false)

  /**
   * Default behaviour is that errors only appear once you have touched the
   * input and moved away from it. Once touched, validations are run on every
   * change. Submitting a form will touch all fields. Setting validateTrigger
   * in the props will override the default behaviour. All we're doing here is
   * changing the default.
   */
  const useDefaultTrigger = !validateTrigger
  const defaultTrigger = !lostFocusOnce ? 'onBlur' : 'onChange'
  const trigger = useDefaultTrigger ? defaultTrigger : validateTrigger

  const handleBlur = () => {
    if (useDefaultTrigger && !lostFocusOnce) setLostFocusOnce(true)
    onBlur && onBlur()
  }

  return (
    <AntForm.Item onBlur={handleBlur} validateTrigger={trigger} {...rest}>
      {children}
    </AntForm.Item>
  )
}

// Disable the prop types that are the same as the underlying component
export const Form = props => {
  const {
    autoSave,
    autoSaveDebounceDelay,
    children,
    // eslint-disable-next-line react/prop-types
    form: propsForm,
    onAutoSave,
    // eslint-disable-next-line react/prop-types
    onValuesChange,
    submissionStatus,
    ribbonMessage,
    ...rest
  } = props

  const showRibbon = !!submissionStatus && !!ribbonMessage
  const [internalForm] = AntForm.useForm()
  const form = propsForm || internalForm

  // eslint-disable-next-line react/prop-types
  const runAutoSave = debounce(() => onAutoSave(form.getFieldsValue()), 500)

  const handleValuesChange = (changedValues, allValues) => {
    if (autoSave && onAutoSave) runAutoSave()
    onValuesChange && onValuesChange()
  }

  return (
    <FormWrapper>
      {showRibbon && <Ribbon status={submissionStatus}>{ribbonMessage}</Ribbon>}

      <AntForm form={form} onValuesChange={handleValuesChange} {...rest}>
        {children}
      </AntForm>
    </FormWrapper>
  )
}

Form.propTypes = {
  autoSave: PropTypes.bool,
  autoSaveDebounceDelay: PropTypes.number,
  onAutoSave: PropTypes.func,
  ribbonMessage: PropTypes.string,
  submissionStatus: PropTypes.oneOf(['success', 'error', 'danger']),
}

Form.defaultProps = {
  autoSave: false,
  autoSaveDebounceDelay: 500,
  onAutoSave: null,
  ribbonMessage: null,
  submissionStatus: null,
}

// const Form = {}
// Object.setPrototypeOf(Form, AntForm)

/* Replicate exports from https://github.com/ant-design/ant-design/blob/master/components/form/index.tsx#L24-L35 */
Form.render = Form
Form.Item = FormItem
Form.ErrorList = AntForm.ErrorList
Form.useForm = AntForm.useForm
Form.Provider = AntForm.FormProvider

// Form.create = () => {
//   devWarning(
//     false,
//     'Form',
//     'antd v4 removed `Form.create`. Please remove or use `@ant-design/compatible` instead.',
//   )
// }

export default Form
