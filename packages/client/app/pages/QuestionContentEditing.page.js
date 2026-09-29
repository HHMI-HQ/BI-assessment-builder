import React from 'react'
import { useCurrentUser } from '@coko/client'
import { useMutation } from '@apollo/client'
import { UPDATE_QUESTION } from '../graphql'
import { hasGlobalRole } from '../utilities'
import { Form, Button, Input, TextArea, Result, Link, Layout } from '../ui'

const QuestionContentEditingPage = () => {
  const { currentUser } = useCurrentUser()
  const [form] = Form.useForm()

  const [updateQuestionMutation] = useMutation(UPDATE_QUESTION)

  const quoteKeys = src => {
    // Match keys that are unquoted identifiers, optionally single-quoted
    return src.replace(
      /([{,]\s*)([A-Za-z_$][\w$]*|'[^']*')(\s*:)/g,
      (_, pre, key, post) => {
        const bare = key.replace(/^'|'$/g, '')
        return `${pre}"${bare}"${post}`
      },
    )
  }

  const cleanQuotes = src =>
    src
      .replace(/^\uFEFF/, '')
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/\u00A0/g, ' ') // nbsp → space
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width chars
      .replace(/'/g, '"')

  const handleSubmit = ({ id, versionId, content }) => {
    const mutationData = {
      variables: {
        questionId: id,
        questionVersionId: versionId,
        input: {
          content: JSON.stringify(JSON.parse(quoteKeys(cleanQuotes(content)))),
        },
      },
    }

    try {
      updateQuestionMutation(mutationData)
    } catch (error) {
      console.error(error)
    }
  }

  if (!hasGlobalRole(currentUser, 'admin')) {
    return (
      <Result
        // replace link with a Button with to="/dashboard" after MR is merged
        extra={<Link to="/dashboard">Back to Dashboard</Link>}
        status="403"
        subTitle="Sorry, you are not authorized to access this page."
        title="403"
      />
    )
  }

  return (
    <Layout>
      <Layout.Header>Edit question content</Layout.Header>
      <Layout.Content>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Question ID"
            name="id"
            rules={[
              {
                required: true,
                message: 'Question ID is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Question version ID"
            name="versionId"
            rules={[
              {
                required: true,
                message: 'Question version ID is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
            rules={[
              {
                required: true,
                message: 'Content is required',
              },
            ]}
          >
            <TextArea />
          </Form.Item>

          <Button htmlType="submit" type="primary">
            Update
          </Button>
        </Form>
      </Layout.Content>
    </Layout>
  )
}

export default QuestionContentEditingPage
