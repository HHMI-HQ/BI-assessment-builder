/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row as AntRow, Col } from 'antd'
import ProfileForm from './ProfileForm'
import { FormSection, Form, Input, Select, Radio } from '../common'

const Wrapper = styled.div``

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

const ProfileInfo = props => {
  const {
    autoSave,
    className,
    message,
    form,
    initialValues,
    loading,
    onAutoSave,
    onSubmit,
    secondaryButtonAction,
    secondaryButtonLabel,
    showSecondaryButton,
    submitButtonLabel,
    submissionStatus,
    ...rest
  } = props

  return (
    <Wrapper className={className}>
      <ProfileForm
        autoSave={autoSave}
        form={form}
        initialValues={initialValues}
        loading={loading}
        message={message}
        onAutoSave={onAutoSave}
        onSubmit={onSubmit}
        secondaryButtonAction={secondaryButtonAction}
        secondaryButtonLabel={secondaryButtonLabel}
        showSecondaryButton={showSecondaryButton}
        submissionStatus={submissionStatus}
        submitButtonLabel={submitButtonLabel}
        {...rest}
      >
        <FormSection label="Contact Information">
          <Row>
            <Col span={12}>
              {/* QUESTION reverse order from sign up form? */}
              <Form.Item
                label="Last name"
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: 'You have to fill in your last name',
                  },
                ]}
              >
                <Input placeholder="Fill in your last name" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="First name"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: 'You have to fill in your first name',
                  },
                ]}
              >
                <Input placeholder="Fill in your first name" />
              </Form.Item>
            </Col>

            <Col span={6}>
              {/* QUESTION is this useful information? */}
              {/* QUESTION should this be required? */}
              <Form.Item
                label="Preferred Pronouns"
                name="pronouns"
                rules={[
                  {
                    required: true,
                    message: 'You have to fill in your prefered pronouns',
                  },
                ]}
              >
                <Input placeholder="Fill in your preferred pronouns" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="Middle name"
                name="middleName"
                rules={[
                  {
                    required: true,
                    message: 'You have to fill in your middle name',
                  },
                ]}
              >
                <Input placeholder="Fill in your middle name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              {/* QUESTION why not the display name? */}
              <Form.Item
                label="Name as you would like it to appear in the assessment builder"
                name="displayName"
                rules={[
                  {
                    required: true,
                    message: 'You have to fill in your display name',
                  },
                ]}
              >
                <Input placeholder="Fill in your display name" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              {/* QUESTION what is this? */}
              <Form.Item
                label="Please select the group(s) with which you most closely personally identify"
                name="groupID"
              >
                <Select
                  mode="multiple"
                  options={[]}
                  placeholder="Check all that apply"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: 'You have to fill in your phone number',
                  },
                  {
                    pattern: /^\d+$/,
                    message: 'Please enter a valid phone number',
                  },
                ]}
              >
                <Input placeholder="Fill in your phone number" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'You have to fill in you email address',
                  },
                  {
                    type: 'email',
                    message: 'This is not a valid email',
                  },
                ]}
              >
                <Input placeholder="Fill in your email address" />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        <FormSection label="Address">
          <Row>
            <Col span={12}>
              <Form.Item
                label="City"
                name="city"
                rule={[
                  {
                    required: true,
                    message:
                      'You have to fill in the coty where your Institution is located',
                  },
                ]}
              >
                <Input placeholder="Enter the City where your Institution is located" />
              </Form.Item>
            </Col>

            <Col span={12}>
              {/* QUESTION what if it is outside the US */}
              {/* QUESTION required? */}
              <Form.Item label="State / Territory (US)" name="state">
                <Input placeholder="Select the State where your institution is located" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="Country" name="country">
                <Input placeholder="Select the country where your institution is located is located" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Work / Home Address" name="address">
                <Input placeholder="Type your work/home address" />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        <FormSection label="School">
          <Row>
            <Col span={12}>
              <Form.Item
                label="Position"
                name="position"
                rules={[
                  {
                    required: true,
                    message: 'You have to fill in you position',
                  },
                ]}
              >
                <Input placeholder="Type your position" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Institution/Organization"
                name="organizaion"
                rules={[
                  {
                    required: true,
                    message:
                      'You have to fill in your Institution/Organization',
                  },
                ]}
              >
                <Input placeholder="Type your Institution/Organization" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              {/* QUESTION need the types */}
              <Form.Item
                label="Type of School"
                name="typeOfSchool"
                rules={[
                  {
                    required: true,
                    message: 'You have to select your Type of School',
                  },
                ]}
              >
                <Select
                  options={[
                    { label: 'Type 1', value: 'type1' },
                    { label: 'Type 2', value: 'type2' },
                  ]}
                  placeholder="Select your type of school"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              {/* QUESTION is the number input more appropriate here? */}
              <Form.Item
                label="Years of teaching exprerience"
                name="yearsOfExperience"
                rules={[
                  {
                    required: true,
                    message:
                      'You have to select your years of teaching experience',
                  },
                ]}
              >
                <Select
                  options={[
                    { label: '< 5', value: 'lessThan5' },
                    { label: '> 5', value: 'moreThan5' },
                  ]}
                  placeholder="Select your years of teaching experience"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              {/* QUESTION what is this sorcery? */}
              <Form.Item label="Type of Institution" name="typeOfInstitution">
                <Select
                  options={[]}
                  placeholder="Select you type of Institution"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              {/* QUESTION need options */}
              <Form.Item
                label="Number of students enrolled at your school"
                name="nrOfStudents"
              >
                <Select
                  options={[]}
                  placeholder="Select Number of students enrolled at your school/institution"
                />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        <FormSection label="Reviewing" last>
          <Row>
            <Col span={12}>
              <Form.Item
                label="Are you interested in serving as a reviewer?"
                name="reviewerInterest"
                rules={[
                  {
                    required: true,
                    message: 'Please select an option',
                  },
                ]}
              >
                <Radio name="reviewerInterest" options={yesOrNoOptions} />
              </Form.Item>
            </Col>

            <Col span={12}>
              {/* QUESTION need options */}
              <Form.Item label="What course(s) do you teach?" name="course">
                <Select
                  mode="multiple"
                  options={[]}
                  placeholder="Select courses"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Form.Item
                label="Select the three topics you are most comfortable reviewing for scientific accuracy"
                name="courses-review"
              >
                <Select
                  mode="multiple"
                  options={[]}
                  placeholder="Select three topics"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="Have you had training in writing/reviewing assessment items?"
                name="assessmentTraining"
              >
                <Radio name="assessmentTraining" options={yesOrNoOptions} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Have you had training on assessing items for inclusive language?"
                name="assessmentTrainingInclusive"
              >
                <Radio
                  name="assessmentTrainingInclusive"
                  options={yesOrNoOptions}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="Source" name="source">
                <Input placeholder="Where did you hear about this?" />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>
      </ProfileForm>
    </Wrapper>
  )
}

ProfileInfo.propTypes = {
  autoSave: PropTypes.bool,
  message: PropTypes.string,
  form: PropTypes.shape(),
  initialValues: PropTypes.shape(),
  loading: PropTypes.bool,
  onAutoSave: PropTypes.func,
  onSubmit: PropTypes.func,
  secondaryButtonAction: PropTypes.func,
  secondaryButtonLabel: PropTypes.string,
  showSecondaryButton: PropTypes.bool,
  submitButtonLabel: PropTypes.string,
  submissionStatus: PropTypes.string,
}

ProfileInfo.defaultProps = {
  autoSave: true,
  message: '',
  form: null,
  initialValues: {},
  loading: false,
  onAutoSave: () => {},
  onSubmit: () => {},
  secondaryButtonAction: () => {},
  secondaryButtonLabel: 'Clear',
  showSecondaryButton: true,
  submitButtonLabel: 'Submit',
  submissionStatus: null,
}

export default ProfileInfo
