import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { Divider } from '@coko/client/dist/ui/common'
import { Button, Modal } from '../common'

import Wax from '../wax/Wax'
import { simpleConfig } from '../wax/config'
import { DashLayout, HhmiLayout } from '../wax/layout'

const ReadOnlyLayout = styled(DashLayout)`
  border-inline-start: ${grid(1)} solid ${th('colorPrimary')};
  padding-inline-start: ${grid(2)};
`

const FeedbackEditorLayout = styled(HhmiLayout)`
  /* stylelint-disable-next-line string-quotes */
  [role='toolbar'] {
    padding-block-end: ${grid(2)};
  }
`

const ModalHeader = Modal.header
const ModalFooter = Modal.footer
const ModalContext = React.createContext(null)

const FeedbackModal = props => {
  const { showModal, setShowModal, content, onApplyFeedback, onImageUpload } =
    props

  const waxRef = useRef(null)

  const handleInsertFeedback = () => {
    onApplyFeedback(content.attrs?.id, waxRef.current.getContent())
    setShowModal(false)
  }

  return (
    <ModalContext.Provider value={null}>
      <Modal
        footer={
          <ModalFooter>
            <Button onClick={() => setShowModal(false)} type="primary">
              Cancel
            </Button>
            <Button onClick={handleInsertFeedback} type="primary">
              Insert Feedback
            </Button>
          </ModalFooter>
        }
        onCancel={() => setShowModal(false)}
        open={showModal}
        title={<ModalHeader>Edit feedback</ModalHeader>}
        width="850px"
      >
        <p>Edit feedback for this answer:</p>
        <Wax
          config={simpleConfig}
          content={{ type: 'doc', content: content.content }}
          layout={ReadOnlyLayout}
          readOnly
        />
        <Divider />
        <Wax
          config={simpleConfig}
          content={content.attrs?.feedback || ''}
          innerRef={waxRef}
          layout={FeedbackEditorLayout}
          onImageUpload={onImageUpload}
          targetFormat="HTML"
        />
      </Modal>
    </ModalContext.Provider>
  )
}

FeedbackModal.propTypes = {
  showModal: PropTypes.bool,
  setShowModal: PropTypes.func,
  content: PropTypes.shape(),
  onApplyFeedback: PropTypes.func,
  onImageUpload: PropTypes.func,
}

FeedbackModal.defaultProps = {
  showModal: false,
  setShowModal: null,
  content: {},
  onApplyFeedback: null,
  onImageUpload: null,
}

export default FeedbackModal
