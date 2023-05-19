import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DeleteOutlined } from '@ant-design/icons'

import { Button, Form, Select, Modal } from '../common'

const ModalHeader = Modal.header
const ModalFooter = Modal.footer
const ModalContext = React.createContext(null)

const HeContainer = styled.span`
  align-items: baseline;
  display: flex;
  justify-content: space-between;
  width: 50%;
`

const StyledButton = styled(Button)`
  background-color: transparent;
  border: none;
  cursor: pointer;
`

const AssignHEButton = props => {
  const {
    className,
    loading,
    onAssign,
    onSearchHE,
    onUnassign,
    handlingEditors,
    searchLoading,
    loadAssignedHEs,
    currentHandlingEditors,
  } = props

  const [showModal, setShowModal] = useState(false)
  const [modal, contextHolder] = Modal.useModal()
  const [assingHeForm] = Form.useForm()

  useEffect(async () => {
    if (showModal) {
      loadAssignedHEs()
    }
  }, [showModal])

  const handleAssign = ({ newHandlingEditor }) => {
    onAssign(newHandlingEditor)
      .then(() => {
        assingHeForm.resetFields()
      })
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

  const handleUnassignHE = userId => {
    onUnassign(userId)
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
            <Button
              autoFocus
              onClick={() => assingHeForm.submit()}
              type="primary"
            >
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
            <ol>
              {currentHandlingEditors.map(he => (
                <li key={he.id}>
                  <HeContainer>
                    {he.displayName}
                    <StyledButton
                      aria-label={`Unassign handling editor ${he.displayName}`}
                      icon={<DeleteOutlined />}
                      onClick={() => handleUnassignHE(he.id)}
                    />
                  </HeContainer>
                </li>
              ))}
            </ol>
          </>
        ) : null}
        <Form
          form={assingHeForm}
          layout="vertical"
          onFinish={handleAssign}
          onValuesChange={() =>
            assingHeForm.validateFields(['newHandlingEditor'])
          }
        >
          <Form.Item
            label="Find a user to assign as handling editor for this question"
            name="newHandlingEditor"
            rules={[
              {
                required: true,
                message: 'Please select a user to assign',
              },
            ]}
            validateTrigger="onSubmit"
          >
            <Select
              // https://github.com/ant-design/ant-design/issues/19970#issuecomment-763139893
              async
              defaultOpen={false}
              labelInValue
              loading={searchLoading}
              onSearch={onSearchHE}
              options={handlingEditors}
              placeholder="Search for a handling editor"
            />
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </ModalContext.Provider>
  )
}

AssignHEButton.propTypes = {
  loading: PropTypes.bool,
  onAssign: PropTypes.func,
  onUnassign: PropTypes.func,
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
  onUnassign: () => {},
  onSearchHE: () => {},
  searchLoading: false,
  handlingEditors: [],
  loadAssignedHEs: () => {},
  currentHandlingEditors: [],
}

export default AssignHEButton
