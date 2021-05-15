import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { grid } from '@coko/client'
import { Row as AntRow, Col as AntCol } from 'antd'

import AuthorizationHeader from './AuthenticationHeader'
import {
  Button,
  ButtonGroup as UIButtonGroup,
  Form,
  FormSection,
  Input,
  Radio,
  Ribbon as UIRibbon,
  Select,
} from '../common'

const Wrapper = styled.div``

// Align other elements with FormSection (which has padding of the same size)
const sideMargins = css`
  margin-left: ${grid(4)};
  margin-right: ${grid(4)};
`

const ButtonGroup = styled(UIButtonGroup)`
  ${sideMargins}
`

const Ribbon = styled(UIRibbon)`
  margin-top: ${grid(4)};
  ${sideMargins}
`

const Col = styled(AntCol)``

// QUESTION spaces are different compared to the designs
const Row = ({ children }) => <AntRow gutter={8}>{children}</AntRow>

const yesOrNoOptions = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
]

// QUESTION what is the overlap between this and the user profile?

const SignupQuestionnaire = props => {
  const { className, onAutoSave, onSubmit } = props

  const [showErrorRibbon, setShowErrorRibbon] = useState(false)
  // const [form] = Form.useForm()

  const handleFinish = vals => {
    onSubmit(vals)
  }

  const handleFinishFailed = () => {
    setShowErrorRibbon(true)
  }

  const handleValuesChange = () => {
    // if (showErrorRibbon) setShowErrorRibbon(false)
    setShowErrorRibbon(false)
  }

  return (
    <Wrapper className={className}>
      <AuthorizationHeader>Sign up</AuthorizationHeader>

      <Form
        autoSave
        // form={form}
        layout="vertical"
        onAutoSave={onAutoSave}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        onValuesChange={handleValuesChange}
      >
        {/* QUESTION we've already added this info while signing up */}
        <FormSection label="Contact Information">
          <Row>
            <Col span={12}>
              {/* QUESTION reverse order from sign up form? */}
              <Form.Item label="Last name">
                <Input />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="First name">
                <Input />
              </Form.Item>
            </Col>

            <Col span={6}>
              {/* QUESTION is this useful information? */}
              {/* QUESTION should this be required? */}
              <Form.Item label="Preferred Pronouns">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="Middle name">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              {/* QUESTION why not the display name? */}
              <Form.Item label="Name as you would like it to appear in the assessment builder">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              {/* QUESTION what is this? */}
              <Form.Item label="Please select the group with which you most closely personally identify">
                <Select options={[]} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="Phone">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Email">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        <FormSection label="Address">
          <Row>
            <Col span={12}>
              <Form.Item label="City">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              {/* QUESTION what if it is outside the US */}
              {/* QUESTION required? */}
              <Form.Item label="State / Territory (US)">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="Country">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Work / Home Address">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        <FormSection label="School">
          <Row>
            <Col span={12}>
              <Form.Item label="Position">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Institution/Organization">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              {/* QUESTION need the types */}
              <Form.Item label="Type of School">
                <Select options={[]} />
              </Form.Item>
            </Col>

            <Col span={12}>
              {/* QUESTION is the number input more appropriate here? */}
              <Form.Item label="Years of teaching exprerience">
                <Select options={[]} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              {/* QUESTION what is this sorcery? */}
              <Form.Item label="Type of Institution">
                <Select options={[]} />
              </Form.Item>
            </Col>

            <Col span={12}>
              {/* QUESTION need options */}
              <Form.Item label="Number of students enrolled at your school">
                <Select options={[]} />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        <FormSection label="Reviewing" last>
          <Row>
            <Col span={12}>
              <Form.Item label="Are you interested in serving as a reviewer?">
                <Radio options={yesOrNoOptions} />
              </Form.Item>
            </Col>

            <Col span={12}>
              {/* QUESTION need options */}
              <Form.Item label="What course(s) do you teach?">
                <Select options={[]} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Form.Item label="Select the three topics you are most comfortable reviewing for scientific accuracy">
                <Select options={[]} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="Have you had training in writing/reviewing assessment items?"
                name="assessmentTraining"
              >
                <Radio options={yesOrNoOptions} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Have you had training on assessing items for inclusive language?"
                name="assessmentTrainingInclusive"
              >
                <Radio options={yesOrNoOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="Source"
                name="source"
                rules={[{ required: true, message: 'Tell me' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        <ButtonGroup justify="right">
          {/* QUESTION do we need a clear button? */}
          <Button>Clear</Button>
          <Button htmlType="submit" type="primary">
            Submit
          </Button>
        </ButtonGroup>

        <Ribbon hide={!showErrorRibbon} status="error">
          There are errors in the form. Please fix them and submit again.
        </Ribbon>
      </Form>
    </Wrapper>
  )
}

SignupQuestionnaire.propTypes = {
  onAutoSave: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

SignupQuestionnaire.defaultProps = {}

export default SignupQuestionnaire
