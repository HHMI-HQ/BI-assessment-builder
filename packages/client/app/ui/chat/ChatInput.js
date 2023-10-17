import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { MentionsInput, Mention } from 'react-mentions'
import { grid } from '@coko/client'

import { SendOutlined } from '@ant-design/icons'

import { Button, Upload } from '../common'

const MainContainer = styled('div')`
  display: flex;
  flex-direction: column;
`

const StyledUpload = styled(Upload)`
  margin-block: ${grid(2)};
  margin-inline: ${grid(1)};
`

const SendButton = styled(Button)`
  background: ${props => props.theme.colorPrimaryBorder};
  border: none;
  border-radius: 50%;
  color: ${props => props.theme.colorTextReverse};
  height: 45px;
  margin-inline: ${grid(1)};
  outline: none;
  width: 50px;

  &:hover,
  &:focus {
    background: ${props => props.theme.colorPrimary};
    /* stylelint-disable-next-line declaration-no-important */
    color: ${props => props.theme.colorTextReverse} !important;
  }
`

const InputWrapper = styled('div')`
  background: rgb(0 0 0 / 10%);
  border-radius: 20px;
  box-shadow: inset rgb(0 0 0 / 18%) 0 1px 2px;

  display: flex;
  margin-block: ${grid(1)};
  padding: ${grid(2)};

  // overrding react-mentions styles
  .mentions-input {
    flex-grow: 1;
    height: 100%;
  }

  .mentions-input__input {
    border: none;
    color: ${props => props.theme.colorText};
    outline: none;
  }

  .mentions-input__suggestions__list {
    border: 1px solid ${props => props.theme.colorPrimaryBorder};
    border-radius: ${grid(1)};
  }

  .mentions-input__suggestions__item {
    padding-inline: ${grid(2)};
  }

  .mentions-input__suggestions__item--focused {
    background: ${props => props.theme.colorPrimaryBorder};
    color: ${props => props.theme.colorBackground};
  }
`

const UploadWrapper = styled('div')`
  align-self: end;
`

const ChatInputSection = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

// TODO -- this needs to be a wax editor with two plugins (mention & task)

const ChatInput = props => {
  const { className, onSend, participants, ...rest } = props

  const [inputValue, setInputValue] = useState('')
  const [mentions, setMentions] = useState([])
  const [attachments, setAttachments] = useState([])

  const handleTextChange = (_, __, newPlainTextValue, newMentions) => {
    setInputValue(newPlainTextValue)
    const mentionIDs = newMentions.map(({ id }) => id)
    setMentions(curMentions => [...curMentions, ...mentionIDs])
  }

  const handleAttachmentChange = ({ fileList }) => {
    setAttachments(fileList)
  }

  const handleRemoveAttachment = file => {
    setAttachments(selectedFiles =>
      selectedFiles.filter(item => item.uid !== file.uid),
    )
  }

  const handleSend = async () => {
    if (inputValue.trim().length !== 0) {
      onSend(inputValue, mentions, attachments)
      setInputValue('')
      setAttachments([])
    }
  }

  return (
    <MainContainer>
      <UploadWrapper style={{ alignSelf: 'end' }}>
        <StyledUpload
          accept=".pdf,.jpeg,.png"
          aria-label="upload-attachments"
          files={attachments}
          multiple
          onChange={handleAttachmentChange}
          onRemove={handleRemoveAttachment}
        />
      </UploadWrapper>
      <ChatInputSection>
        <InputWrapper style={{ flexGrow: 1 }}>
          <MentionsInput
            className="mentions-input"
            forceSuggestionsAboveCursor
            onChange={handleTextChange}
            value={inputValue}
            {...rest}
          >
            <Mention
              appendSpaceOnAdd
              data={participants}
              displayTransform={(_, display) => `@${display}`}
              trigger="@"
            />
          </MentionsInput>
        </InputWrapper>
        <SendButton data-testid="send-btn" onClick={handleSend}>
          <SendOutlined />
        </SendButton>
      </ChatInputSection>
    </MainContainer>
  )
}

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  participants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      display: PropTypes.string,
    }),
  ),
}

ChatInput.defaultProps = {
  participants: [],
}

export default ChatInput
