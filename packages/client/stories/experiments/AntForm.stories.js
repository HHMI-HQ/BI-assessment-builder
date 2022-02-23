import React from 'react'
import styled from 'styled-components'
import { datatype, name } from 'faker'
import {
  Form,
  Input,
  Checkbox,
  CheckboxGroup,
  Select,
  Switch,
  Radio,
  TextArea,
} from 'ui'
import { range } from 'lodash'

let renderCounter = 1
const counters = [1, 1, 1, 1, 1, 1]

const makeOptions = n =>
  range(n).map(i => {
    return {
      label: name.findName(),
      value: datatype.uuid(),
    }
  })

const options = makeOptions(3)
const checkboxOptions = makeOptions(3)
const radioOptions = makeOptions(3)

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

  // eslint-disable-next-line no-console
  const onSubmit = () => console.log(form.getFieldsValue())

  const onValuesChange = (changedValues, allValues) => {
    // eslint-disable-next-line no-console
    console.log(changedValues, allValues)
  }

  return (
    <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
      <GridWrapper>
        {range(6).map(i => {
          return (
            <>
              <Grid4>
                <h2>Section {i + 1}</h2>
              </Grid4>
              <Grid4>
                <h3>
                  Counter{i + 1}: {counters[i]++}
                </h3>
              </Grid4>
              <Grid2>
                <Form.Item
                  hasFeedback
                  label="Last name"
                  name={`lastName${i}`}
                  rules={[
                    {
                      required: true,
                      message: 'Cannot submit without a this field',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                {/* eslint-disable-next-line no-plusplus */}
              </Grid2>
              <Form.Item
                hasFeedback
                label="Fisrt name"
                name={`firstName${i}`}
                rules={[
                  {
                    required: true,
                    message: 'Cannot submit without a this field',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                hasFeedback
                label="Pronouns"
                name={`pronouns${i}`}
                rules={[
                  {
                    required: true,
                    message: 'Cannot submit without a this field',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Grid2>
                <Form.Item
                  hasFeedback
                  label="Middle name"
                  name={`middleName${i}`}
                  rules={[
                    {
                      required: true,
                      message: 'Cannot submit without a this field',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Grid2>
              <Grid2>
                <Form.Item
                  hasFeedback
                  label="Display name"
                  name={`displayName${i}`}
                  rules={[
                    {
                      required: true,
                      message: 'Cannot submit without a this field',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Grid2>
              <Grid4>
                <Form.Item
                  label="Select option"
                  name={`option${i}`}
                  rules={[{ required: true, message: 'Select an option' }]}
                >
                  <Select options={options} />
                </Form.Item>
              </Grid4>
              <Form.Item
                label="Choose at least one"
                name={`chooseOne${i}`}
                rules={[{ required: true, message: 'Must choose one' }]}
              >
                <CheckboxGroup options={checkboxOptions} vertical />
              </Form.Item>
              <Form.Item
                label="Which one is it?"
                name={`radiobutton${i}`}
                rules={[{ required: true, message: 'Must choose one' }]}
              >
                <Radio options={radioOptions} vertical />
              </Form.Item>
              <Form.Item
                label="Are you sure?"
                name={`single-checkbox${i}`}
                rules={[
                  {
                    validator: (_, value) => {
                      if (value) {
                        return Promise.resolve()
                      }

                      // eslint-disable-next-line prefer-promise-reject-errors
                      return Promise.reject('Some message here')
                    },
                    message: 'Please check',
                  },
                ]}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item
                label="Why?"
                name={`textarea${i}`}
                rules={[{ required: true, message: 'Explain why' }]}
              >
                <TextArea />
              </Form.Item>
              <Grid4>
                <hr />
              </Grid4>
            </>
          )
        })}
        <input onClick={onSubmit} type="submit" />
        {/* eslint-disable-next-line no-plusplus */}
        <p>Render counter: {renderCounter++}</p>
      </GridWrapper>
    </Form>
  )
}

export default {
  component: AntForm,
  title: 'Experiments/Ant form',
}
