import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { grid } from '@coko/client'

import { Button, Form, Input, Select } from '../common'

const Wrapper = styled.div``

const InputWithButtonWrapper = styled.div`
  display: flex;

  > div {
    flex-grow: 1;
    margin-right: ${grid(1)};
  }
`

// QUESTION - I need the options for all these select elements

const Metadata = props => {
  const {
    className,

    onAutoSave,

    cognitiveLevelOptions,
    coreCompetencyOptions,
    coreConceptOptions,
    frameworkOptions,
    principleOptions,
    programLevelOutcomeOptions,
    readingLevelOptions,
    sectionOptions,
    subDisciplineOptions,
    topicOptions,
    unitOptions,
  } = props

  const [form] = Form.useForm()

  // const handleAutoSave =

  return (
    <Wrapper className={className}>
      <Form autoSave form={form} layout="vertical" onAutoSave={onAutoSave}>
        <Form.Item
          label="Unit"
          name="unit"
          rules={[{ required: true, message: 'Unit is required' }]}
        >
          <Select options={unitOptions} />
        </Form.Item>

        <Form.Item
          label="Section"
          name="section"
          rules={[{ required: true, message: 'Section is required' }]}
        >
          <Select options={sectionOptions} />
        </Form.Item>

        <Form.Item
          label="Topic"
          name="topic"
          rules={[{ required: true, message: 'Topic is required' }]}
        >
          <Select options={topicOptions} />
        </Form.Item>

        <Form.Item label="Keywords" name="keywords">
          <Input />
        </Form.Item>

        <Form.Item
          label="Biointeractive resources"
          name="biointeractiveResources"
        >
          <InputWithButtonWrapper>
            <Input />
            <Button type="primary">Add link</Button>
          </InputWithButtonWrapper>
        </Form.Item>

        <Form.Item
          label="Bloom's cognitive level"
          name="cognitiveLevel"
          rules={[
            { required: true, message: "Bloom's cognitive level is required" },
          ]}
        >
          <Select options={cognitiveLevelOptions} />
        </Form.Item>

        <Form.Item label="Reading level" name="readingLevel">
          <Select options={readingLevelOptions} />
        </Form.Item>

        <Form.Item label="Framework" name="framework">
          <Select options={frameworkOptions} />
        </Form.Item>

        <Form.Item label="Core concept" name="coreConcept">
          <Select options={coreConceptOptions} />
        </Form.Item>

        <Form.Item label="Principle" name="principle">
          <Select options={principleOptions} />
        </Form.Item>

        <Form.Item label="Subdiscipline" name="subDiscipline">
          <Select options={subDisciplineOptions} />
        </Form.Item>

        <Form.Item label="Statement" name="statement">
          <Input />
        </Form.Item>

        <Form.Item label="Core competency" name="coreCompetency">
          <Select options={coreCompetencyOptions} />
        </Form.Item>

        <Form.Item label="Program level outcome" name="programLevelOutcome">
          <Select options={programLevelOutcomeOptions} />
        </Form.Item>
      </Form>
    </Wrapper>
  )
}

Metadata.propTypes = {
  onAutoSave: PropTypes.func,

  cognitiveLevelOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  coreCompetencyOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  coreConceptOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  frameworkOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  principleOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  programLevelOutcomeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  readingLevelOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  sectionOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  subDisciplineOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  topicOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  unitOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

Metadata.defaultProps = {
  onAutoSave: null,
}

export default Metadata
