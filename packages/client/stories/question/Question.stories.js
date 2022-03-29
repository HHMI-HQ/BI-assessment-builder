/* eslint-disable no-console */
import React from 'react'
import styled from 'styled-components'
import { lorem } from 'faker'

import { th } from '@coko/client'

import { Question } from 'ui'

const Wrapper = styled.div`
  border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  height: 800px;
`

const options = {
  topic: 'biochemistryMolecularBiology',
}

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: lorem.sentences(130),
        },
      ],
    },
  ],
}

export const Base = () => (
  <Wrapper>
    <Question
      editorContent={content}
      initialMetadataValues={options}
      loading={false}
      onClickBackButton={() => console.log('back')}
      onEditorContentAutoSave={s => console.log('editor auto save', s)}
      onQuestionSubmit={console.log('submit question')}
      questionAgreedTc={false}
      submitting={false}
    />
  </Wrapper>
)

export default {
  component: Question,
  title: 'Question/Question',
}
