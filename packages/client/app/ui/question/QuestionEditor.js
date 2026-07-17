import React, { useEffect, useState, createContext, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import Wax from '../wax/Wax'
import { config, hhmiConfig } from '../wax/config'

// # region styled
const EditorWrapper = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: auto;
  /* max-width: 75vw; */
  overflow: auto;
  position: relative;
  width: 100%;
`

const EditorScrollContainer = styled.div`
  flex-grow: 1;
  overflow: auto;
`

const MissingQuestionTypeAlert = styled.div`
  background-color: rgba(200 200 200 / 25%);
  inset: 0;
  position: absolute;

  > span {
    background-color: ${th('colorBackground')};
    border: 1px solid ${th('colorBorder')};
    inset-block-start: 40%;
    inset-inline-start: 50%;
    padding: ${grid(4)};
    position: absolute;
    transform: translate(-50%, -50%);
  }
`
// #endregion styled

export const ComplexItemSetContext = createContext({})

const QuestionEditor = props => {
  const {
    content,
    innerRef,
    layout,
    onContentChange,
    onImageUpload,
    readOnly,
    published,
    leadingContent,
    complexSetEditLink,
    complexItemSetId,
    selectedQuestionType,
    refreshEditorContent,
    showFeedBack,
    testMode,
    enhancedEditor,
  } = props

  const updateKey = useRef(0)
  const [customValues, setCustomValues] = useState({ showFeedBack, testMode })

  const [waxConfig, setWaxConfig] = useState(
    enhancedEditor ? hhmiConfig : config,
  )

  useEffect(() => {
    enhancedEditor ? setWaxConfig(hhmiConfig) : setWaxConfig(config)
  }, [enhancedEditor])

  useEffect(() => {
    if (refreshEditorContent) {
      updateKey.current += 1
    }
  }, [refreshEditorContent])

  // changing customValues will rerender the editor
  // avoid rerendering if testMode or showFeedBack don't change
  // force rerendering when question is published and content changes (for next/previous navigation)
  useEffect(() => {
    if (
      testMode !== customValues.testMode ||
      showFeedBack !== customValues.showFeedBack ||
      published
    ) {
      setCustomValues({ testMode, showFeedBack })
    }
  }, [testMode, showFeedBack, published, content])

  const contextValue = React.useMemo(
    () => ({
      leadingContent,
      complexSetEditLink,
      complexItemSetId,
    }),
    [leadingContent],
  )

  return (
    <EditorWrapper aria-label="Question editor">
      <EditorScrollContainer>
        <ComplexItemSetContext.Provider value={contextValue}>
          <Wax
            config={waxConfig}
            // content={preserveLocalState ? editorContent : content}
            content={content && Object.keys(content).length ? content : null}
            customValues={customValues}
            innerRef={innerRef}
            key={`${selectedQuestionType?.waxValue}-${updateKey.current}-${readOnly}`}
            layout={layout}
            onContentChange={!testMode ? onContentChange : () => {}}
            onImageUpload={onImageUpload}
            readOnly={readOnly}
          />
        </ComplexItemSetContext.Provider>
      </EditorScrollContainer>

      {!selectedQuestionType && (
        <MissingQuestionTypeAlert data-testid="missing-question-text">
          <span>
            Please select an item type in the metadata form to start editing
          </span>
        </MissingQuestionTypeAlert>
      )}
    </EditorWrapper>
  )
}

QuestionEditor.propTypes = {
  content: PropTypes.shape(),
  leadingContent: PropTypes.shape(),
  innerRef: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({
      current: PropTypes.shape(),
    }),
  ]),
  layout: PropTypes.elementType.isRequired,
  onContentChange: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func,
  readOnly: PropTypes.bool,
  published: PropTypes.bool,
  complexSetEditLink: PropTypes.string,
  complexItemSetId: PropTypes.string,
  selectedQuestionType: PropTypes.shape(),
  refreshEditorContent: PropTypes.bool,
  showFeedBack: PropTypes.bool,
  testMode: PropTypes.bool,
  enhancedEditor: PropTypes.bool,
}

QuestionEditor.defaultProps = {
  content: {},
  leadingContent: null,
  readOnly: false,
  innerRef: null,
  onImageUpload: () => {},
  published: false,
  complexSetEditLink: null,
  complexItemSetId: null,
  selectedQuestionType: null,
  refreshEditorContent: false,
  showFeedBack: false,
  testMode: false,
  enhancedEditor: true,
}

export default QuestionEditor
