import React, { useState } from 'react'
import styled from 'styled-components'
import { datatype, name } from 'faker'
import { Form, Input, CheckboxGroup, Select } from 'ui'
import { range } from 'lodash'

let counter = 1

const makeOptions = n =>
  range(n).map(i => {
    return {
      label: name.findName(),
      value: datatype.uuid(),
    }
  })

const options = makeOptions(3)

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-row-gap: 20px;
  grid-column-gap: 10px;
`

const Grid2 = styled.div`
  grid-column: span 2;
`

const Grid4 = styled.div`
  grid-column: span 4;
`

export const AntForm = () => {
  const [form] = Form.useForm()

  const onSubmit = () => console.log(form.getFieldsValue())

  const onValuesChange = (changedValues, allValues) => {
    console.log(changedValues, allValues)
  }

  return (
    <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
      <GridWrapper>
        <Grid2>
          <Form.Item
            hasFeedback
            label="Last name"
            name="lastName"
            rules={[
              { required: true, message: 'Cannot submit without a this field' },
            ]}
          >
            <Input />
          </Form.Item>
        </Grid2>
        <Form.Item
          hasFeedback
          label="Fisrt name"
          name="firstName"
          rules={[
            { required: true, message: 'Cannot submit without a this field' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Pronouns"
          name="pronouns"
          rules={[
            { required: true, message: 'Cannot submit without a this field' },
          ]}
        >
          <Input />
        </Form.Item>
        <Grid2>
          <Form.Item
            hasFeedback
            label="Middle name"
            name="middleName"
            rules={[
              { required: true, message: 'Cannot submit without a this field' },
            ]}
          >
            <Input />
          </Form.Item>
        </Grid2>
        <Grid2>
          <Form.Item
            hasFeedback
            label="DIsplay name"
            name="displayName"
            rules={[
              { required: true, message: 'Cannot submit without a this field' },
            ]}
          >
            <Input />
          </Form.Item>
        </Grid2>
        <Grid4>
          <Form.Item
            label="Select option"
            name="option"
            rules={[{ required: true }]}
          >
            <Select options={options} />
          </Form.Item>
        </Grid4>
        <Form.Item
          label="Choose one"
          name="chooseOne"
          rules={[{ required: true, message: 'Must choose one' }]}
        >
          <CheckboxGroup
            options={[
              {
                label: 'Choose this',
                value: '1',
              },
              {
                label: 'Choose that',
                value: '2',
              },
              {
                label: 'Choose the other one',
                value: '3',
              },
            ]}
            vertical
          />
        </Form.Item>
        <div>
          <input onClick={onSubmit} type="submit" />
        </div>
        {/* eslint-disable-next-line no-plusplus */}
        <p>Render counter: {counter++}</p>
      </GridWrapper>
    </Form>
  )
}

export default {
  component: AntForm,
  title: 'Experiments/Ant form',
}
