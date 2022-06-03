/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { th } from '@coko/client'

import { Question, metadata, resources } from 'ui'
import {
  flatAPCoursesMetadata,
  flatIBCourseMetadata,
  flatVisionAndChangeMetadata,
  flatAAMCMetadata,
  editorInitialContent,
  initialMetadataValues,
} from '../../app/utilities'

const Wrapper = styled.div`
  border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  height: 800px;
`

const initialContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'Initial value: simple paragraph. Type your question content here. Go to Editor View story for more complex initial value',
        },
      ],
    },
  ],
}

const frameworks = metadata.frameworks.map(framework => {
  const frameworkData = {
    label: framework.label,
    value: framework.value,
  }

  let additionalMetadata

  if (
    framework.value === 'apBiology' ||
    framework.value === 'apEnvironmentalScience'
  ) {
    additionalMetadata = flatAPCoursesMetadata(framework)
  }

  if (
    framework.value === 'biBiology' ||
    framework.value === 'biEnvironmentalScience'
  ) {
    additionalMetadata = flatIBCourseMetadata(framework)
  }

  return {
    ...frameworkData,
    ...additionalMetadata,
  }
})

const introToBioMeta = metadata.introToBioMeta.map(data => {
  const meta = {
    label: data.label,
    value: data.value,
  }

  let additionalMetadata

  if (data.value === 'visionAndChange') {
    additionalMetadata = flatVisionAndChangeMetadata(data)
  }

  if (data.value === 'aamcFuturePhysicians') {
    additionalMetadata = flatAAMCMetadata(data)
  }

  return {
    ...meta,
    ...additionalMetadata,
  }
})

const flatMeta = {
  topics: metadata.topics,
  blooms: metadata.blooms,
  frameworks,
  introToBioMeta,
}

export const Base = args => {
  const [submitted, setSubmitted] = useState(false)
  const shouldSaveChanges = useRef(false)
  const editorContentRef = useRef(initialContent)
  const [editorContent, setEditorContent] = useState(initialContent)

  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      // this works
      if (shouldSaveChanges.current) {
        console.log('autosave content')
        // call save function to with to save editorContent.current
        console.log(editorContentRef.current)
        shouldSaveChanges.current = false
      } else {
        console.log('nothing to save')
      }
    }, 5000)

    // clear timer when component unmounts
    return () => clearInterval(autoSaveTimer)
  }, [])

  const emptyNavigationFunction = e => {
    e.preventDefault()
    console.log('link clicked')
  }

  const onSubmit = data => {
    console.log(data)

    const editorState = {
      type: 'doc',
      content: JSON.parse(JSON.stringify(data.editorContent)),
    }

    setEditorContent(editorState)
    setSubmitted(true)
  }

  const handleEditorContentChanged = newContent => {
    if (!shouldSaveChanges.current) {
      shouldSaveChanges.current = true
      editorContentRef.current = newContent
    }
  }

  return (
    <Wrapper>
      <Question
        {...args}
        editorContent={editorContent}
        isSubmitted={submitted}
        loading={false}
        metadata={flatMeta}
        onClickBackButton={emptyNavigationFunction}
        onClickNextButton={emptyNavigationFunction}
        onClickPreviousButton={emptyNavigationFunction}
        onEditorContentAutoSave={handleEditorContentChanged}
        onMetadataAutoSave={() => console.log('metadata auto save')}
        onQuestionSubmit={onSubmit}
        questionAgreedTc={false}
        resources={resources}
        submitting={false}
      />
    </Wrapper>
  )
}

export const EditorView = () => {
  const [reviewing, setReviewing] = useState(false)

  const reject = () => {
    console.log('rejected')
  }

  const publish = () => {
    console.log('publish')
  }

  const moveToReview = () => {
    setReviewing(true)
  }

  return (
    <Question
      editorContent={editorInitialContent}
      editorView
      initialMetadataValues={initialMetadataValues}
      isSubmitted
      loading={false}
      metadata={flatMeta}
      onClickBackButton={() => console.log('go back to dashboard')}
      onEditorContentAutoSave={() => console.log('editor content auto save')}
      onMetadataAutoSave={() => console.log('metadata auto save')}
      onMoveToReview={moveToReview}
      onPublish={publish}
      onQuestionSubmit={data => console.log(data)}
      onReject={reject}
      questionAgreedTc={false}
      resources={resources}
      submitting={false}
      underReview={reviewing}
    />
  )
}

export default {
  component: Question,
  title: 'Question/Question',
}
