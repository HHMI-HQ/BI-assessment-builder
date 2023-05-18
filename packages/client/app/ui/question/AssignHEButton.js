import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Select, Modal } from '../common'

const ModalHeader = Modal.header
const ModalFooter = Modal.footer
const ModalContext = React.createContext(null)

const AssignHEButton = props => {
  const {
    className,
    loading,
    onAssign,
    onSearchHE,
    handlingEditors,
    searchLoading,
    loadAssignedHEs,
    currentHandlingEditors,
  } = props

  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  // const [assignedHEs, setAssignedHEs] = useState(currentHandlingEditors)
  const [modal, contextHolder] = Modal.useModal()

  useEffect(async () => {
    if (showModal) {
      loadAssignedHEs()
    }
  }, [showModal])

  const handleOk = () => {
    setShowModal(false)
    onAssign(selectedUser)
      .then()
      .catch(() => {
        const conversionErrorModal = modal.error()
        conversionErrorModal.update({
          title: <ModalHeader>Assignment error</ModalHeader>,
          content:
            'Something went wrong while assigning the handling editor! Please try again or contact your system administrator.',
          footer: [
            <ModalFooter key="footer">
              <Button onClick={conversionErrorModal.destroy} type="primary">
                Ok
              </Button>
            </ModalFooter>,
          ],
        })
      })
  }

  const handleSelectChange = (userId, options) => {
    setSelectedUser(userId)
  }

  return (
    <ModalContext.Provider value={null}>
      <Button
        aria-label="Assign Handling Editor"
        className={className}
        id="assignHE"
        loading={loading}
        onClick={() => setShowModal(true)}
        type="primary"
      >
        Assign HE
      </Button>

      <Modal
        afterClose={() => document.body.querySelector('#assignHE').focus()}
        destroyOnClose
        footer={[
          <ModalFooter key="footer">
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
            <Button autoFocus onClick={handleOk} type="primary">
              Assign
            </Button>
          </ModalFooter>,
        ]}
        onCancel={() => setShowModal(false)}
        open={showModal}
        title={<ModalHeader>Assign Handling Editor</ModalHeader>}
      >
        {currentHandlingEditors.length > 0 ? (
          <>
            <h3>Current assigned handling editors:</h3>
            <ul>
              {currentHandlingEditors.map(he => (
                <li key={he.id}>{he.displayName}</li>
              ))}
            </ul>
          </>
        ) : null}
        <Form.Item label="Find a user to assign as handling editor for this question">
          <Select
            // https://github.com/ant-design/ant-design/issues/19970#issuecomment-763139893
            async
            defaultOpen={false}
            labelInValue
            loading={searchLoading}
            onChange={handleSelectChange}
            onSearch={onSearchHE}
            options={handlingEditors}
            placeholder="Search for a handling editor"
            value={selectedUser}
          />
        </Form.Item>
      </Modal>
      {contextHolder}
    </ModalContext.Provider>
  )
}

AssignHEButton.propTypes = {
  loading: PropTypes.bool,
  onAssign: PropTypes.func,
  handlingEditors: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  currentHandlingEditors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      displayName: PropTypes.string,
    }),
  ),
  onSearchHE: PropTypes.func,
  searchLoading: PropTypes.bool,
  loadAssignedHEs: PropTypes.func,
}

AssignHEButton.defaultProps = {
  loading: false,
  onAssign: () => {},
  onSearchHE: () => {},
  searchLoading: false,
  handlingEditors: [],
  loadAssignedHEs: () => {},
  currentHandlingEditors: [],
}

export default AssignHEButton
