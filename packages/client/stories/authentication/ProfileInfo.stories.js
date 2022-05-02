/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { ProfileInfo, Form } from 'ui'

export const Base = args => {
  const [form] = Form.useForm()

  const clearFormFields = () => {
    form.resetFields()
  }

  const onAutoSave = () => {
    // eslint-disable-next-line no-console
    console.log('saving form automatically')
  }

  return (
    <ProfileInfo
      {...args}
      form={form}
      onAutoSave={onAutoSave}
      secondaryButtonAction={clearFormFields}
    />
  )
}

export default {
  component: ProfileInfo,
  title: 'Authentication/Profile Info',
}
