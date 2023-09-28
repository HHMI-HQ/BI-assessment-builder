import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { MentionsInput, Mention } from 'react-mentions'
import { grid } from '@coko/client'

import { SendOutlined } from '@ant-design/icons'

import { Button } from '../common'

// const Wrapper = styled.div``

const SendButton = styled(Button)`
  border: none;
  color: ${props => props.theme.colorPrimary};
  outline: none;
`

const InputContainer = styled('div')`
  display: flex;
  border: 1px solid grey;

  // overrding react-mentions styles

  .mentions-input {
    flex-grow: 1;
    height: 100%;
  }
  .mentions-input__input {
    outline: none;
    border: none;
  }
  .mentions-input__suggestions__list {
    border: 1px solid ${props => props.theme.colorPrimaryBorder};
  }
  .mentions-input__suggestions__item {
    padding-inline: ${grid(2)};
  }
  .mentions-input__suggestions__item--focused {
    background: ${props => props.theme.colorPrimary};
    color: ${props => props.theme.colorBackground};
  }
`

// TODO -- this needs to be a wax editor with two plugins (mention & task)

const ChatInput = props => {
  const { className, onSend, participants, ...rest } = props

  const [inputValue, setInputValue] = useState('')
  const [mentions, setMentions] = useState([])

  const handleChange = (_, __, newPlainTextValue, newMentions) => {
    setInputValue(newPlainTextValue)
    const mentionIDs = newMentions.map(({ id }) => id)
    setMentions(curMentions => [...curMentions, ...mentionIDs])
  }

  const handleSend = () => {
    if (inputValue.trim().length !== 0) {
      onSend(inputValue, mentions)
      setInputValue('')
    }
  }

  return (
    <InputContainer>
      <MentionsInput
        className="mentions-input"
        forceSuggestionsAboveCursor
        onChange={handleChange}
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
      <SendButton data-testid="send-btn" onClick={handleSend}>
        <SendOutlined />
      </SendButton>
    </InputContainer>
  )
}

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  participants: PropTypes.arrayOf({
    id: PropTypes.string,
    display: PropTypes.string,
  }),
}

ChatInput.defaultProps = {
  participants: [],
}

export default ChatInput
