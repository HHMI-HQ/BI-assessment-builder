import PropTypes from 'prop-types'
import React from 'react'
import { Button, Result } from '../common'

class ErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }

    const validationResults = this.validate()

    if (validationResults.hasError) {
      console.error(validationResults)
      this.state = { hasError: true, error: 'Corrupted content' }
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  reset = () => {
    const { onReset } = this.props
    const tempState = { ...this.state, resetting: true }
    this.setState(tempState)

    onReset().then(() => {
      this.setState({ hasError: false, error: null })
    })
  }

  validate() {
    const { content } = this.props

    const groups = [
      ['fill_the_gap_container', 'fill_the_gap', 'fill_the_gap_wrapper'],
      ['essay_container', 'essay_question', 'essay_prompt', 'essay_answer'],
      ['matching_wrapper', 'matching_container', 'matching_option'],
      ['multiple_drop_down_wrapper', 'multiple_drop_down_container'],
      ['numerical_wrapper', 'numerical_answer_container'],
      [
        'multiple_choice_container',
        'question_node_multiple',
        'multiple_choice',
      ],
      [
        'multiple_choice_single_correct_container',
        'question_node_multiple_single',
        'multiple_choice_single_correct',
      ],
      ['true_false_container', 'question_node_true_false', 'true_false'],
      [
        'true_false_single_correct_container',
        'question_node_true_false_single',
        'true_false_single_correct',
      ],
    ]

    // Map every type to the index of the group it belongs to.
    const typeToGroup = new Map()

    groups.forEach((group, i) => {
      group.forEach(type => typeToGroup.set(type, i))
    })

    // Collect which groups are actually present, with example paths for debugging.
    const presentGroups = new Map() // groupIndex -> [{ type, path }]
    const stack = [['doc', content]]

    if (content && Object.keys(content).length) {
      while (stack.length) {
        const [path, node] = stack.pop()

        if (node && typeof node === 'object') {
          if (node.type && typeToGroup.has(node.type)) {
            const g = typeToGroup.get(node.type)
            if (!presentGroups.has(g)) presentGroups.set(g, [])
            presentGroups.get(g).push({ type: node.type, path })
          }

          if (Array.isArray(node.content)) {
            node.content.forEach((child, i) => {
              stack.push([`${path}.content[${i}]`, child])
            })
          }
        }
      }
    }

    // 0 or 1 group present → fine. 2+ groups → conflict.
    if (presentGroups.size <= 1) return { hasError: false }

    return {
      hasError: true,
      hits: [...presentGroups.entries()].map(([groupIndex, hits]) => ({
        groupIndex,
        group: groups[groupIndex],
        hits,
      })),
    }
  }

  render() {
    const { hasError, error, resetting } = this.state
    const { fallback, children } = this.props

    if (hasError) {
      return fallback
        ? fallback({ error, onReset: this.reset, resetting })
        : null
    }

    return children
  }
}

ErrorBoundaryInner.propTypes = {
  content: PropTypes.shape().isRequired,
  fallback: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
}

// eslint-disable-next-line node/handle-callback-err
const Fallback = ({ error, onReset, resetting }) => {
  return (
    <Result
      extra={
        <Button loading={resetting} onClick={onReset} type="primary">
          Reset editor content
        </Button>
      }
      status="500"
      subTitle="The content of the editor has been corrupted. Click the button below to reset the content. Previous content will be lost."
      title="Something went wrong"
    />
  )
}

Fallback.propTypes = {
  onReset: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  resetting: PropTypes.bool.isRequired,
}

const ErrorBoundary = ({ children, content, onReset }) => (
  <ErrorBoundaryInner content={content} fallback={Fallback} onReset={onReset}>
    {children}
  </ErrorBoundaryInner>
)

ErrorBoundary.propTypes = {
  content: PropTypes.shape().isRequired,
  onReset: PropTypes.func.isRequired,
}

export default ErrorBoundary
