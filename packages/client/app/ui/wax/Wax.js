import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'

import { Wax } from 'wax-prosemirror-core'
import { Button } from 'ui'

const EditorScrollContainer = styled.div`
  flex-grow: 1;
  overflow: auto;
`

const SubmitTestBar = styled.div`
  background-color: ${th('colorBackground')};
  border-top: 1px solid ${th('colorBorder')};
  padding: ${grid(1)} ${grid(2)};
`

const renderImage = file => {
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    // Some extra delay to make the asynchronicity visible
    setTimeout(() => reader.readAsDataURL(file), 150)
  })
}

// const t = `<p class="paragraph">Based on the equation below</p><math-display class="math-node">x + y = 5</math-display><p class="paragraph">Which ones are correct?</p><p class="paragraph"></p><div id="" class="mutiple-choice"><div class="mutiple-choice-option" id="d7b65415-ff82-446f-afa4-accaa3837f4a" correct="false" feedback=""><p class="paragraph">answer 1</p><p class="paragraph"><math-inline class="math-node">x+y=1</math-inline></p></div><div class="mutiple-choice-option" id="e7d6bb2f-7cd7-44f1-92a0-281e72157538" correct="true" feedback=""><p class="paragraph">answer 2</p></div><div class="mutiple-choice-option" id="d6fc749f-afae-4203-9562-d68c380a86e5" correct="false" feedback=""><p class="paragraph">answer 3</p></div></div>`

const WaxWrapper = React.memo(
  props => {
    const {
      content,
      onContentChange,
      config,
      layout,
      readOnly,
      innerRef,
      published,
      testView,
    } = props

    if (!config || !layout) {
      return null
    }

    const [submitted, setSubmitted] = useState(false)
    const [editorContent, setEditorContent] = useState(content)

    const [testMode, setTestMode] = useState(
      published && !submitted && testView,
    )

    useEffect(() => {
      if (testView) {
        setSubmitted(false)
        setTestMode(true)
      } else {
        setSubmitted(false)
        setTestMode(false)
      }

      // reset original content after switching views
      setEditorContent(content)
    }, [testView])

    const submitTest = () => {
      setSubmitted(true)
      setTestMode(false)

      const answer = JSON.parse(
        JSON.stringify({
          type: 'doc',
          content: innerRef.current.getContent(),
        }),
      )

      setEditorContent(answer)
    }

    const resetTest = () => {
      setSubmitted(false)
      setTestMode(true)
      setEditorContent(content)
    }

    return (
      <>
        <EditorScrollContainer>
          <Wax
            autoFocus
            config={config}
            customValues={{ showFeedBack: submitted, testMode }}
            fileUpload={file => renderImage(file)}
            layout={layout}
            onChange={!testMode && onContentChange}
            readonly={readOnly}
            ref={innerRef}
            targetFormat="JSON"
            value={testMode ? editorContent : content}
          />
        </EditorScrollContainer>

        {testView && (
          <SubmitTestBar>
            {submitted ? (
              <Button onClick={resetTest} type="primary">
                Reset
              </Button>
            ) : (
              <Button onClick={submitTest} type="primary">
                Submit
              </Button>
            )}
          </SubmitTestBar>
        )}
      </>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.readOnly === nextProps.readOnly &&
      prevProps.testView === nextProps.testView
    )
  },
)

WaxWrapper.propTypes = {
  content: PropTypes.shape(),
  onContentChange: PropTypes.func,
  config: PropTypes.shape().isRequired,
  innerRef: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({
      current: PropTypes.shape(),
    }),
  ]),
  layout: PropTypes.elementType.isRequired,
  readOnly: PropTypes.bool,
  published: PropTypes.bool,
  testView: PropTypes.bool,
}

WaxWrapper.defaultProps = {
  content: {},
  onContentChange: () => {},
  innerRef: null,
  readOnly: false,
  published: false,
  testView: false,
}

export default WaxWrapper
