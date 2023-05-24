import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroll-component'
import { grid } from '@coko/client'

import ChatMessage from './ChatMessage'
import { Empty, Spin, VisuallyHiddenElement } from '../common'

const StyledChatMessage = styled(ChatMessage)`
  &:not(:first-child) {
    margin-bottom: ${grid(1)};
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  overflow: auto;
  overflow-anchor: none;
  overscroll-behavior: contain;
`

const StyledInfiniteScroll = styled(InfiniteScroll)`
  display: flex;
  flex-direction: column;
`

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-block: ${grid(6)} ${grid(3)};

  // put the loader on top even now that order of messages is not reversed
  order: -1;
`

const NoMoreMessagesWrapper = styled.div`
  margin-block: ${grid(4)};
  order: -1;
  text-align: center;
`

const ChatMessageList = props => {
  const { className, hasMore, messages, onFetchMore } = props

  return (
    <Wrapper className={className} id="scrollableDiv">
      {messages.length === 0 ? (
        <Empty
          description="No coverstions yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          role="status"
        />
      ) : (
        <StyledInfiniteScroll
          dataLength={messages.length}
          endMessage={
            <NoMoreMessagesWrapper role="status">
              No more messages
            </NoMoreMessagesWrapper>
          }
          hasMore={hasMore}
          inverse
          loader={
            <SpinnerWrapper id="chat-loading">
              <VisuallyHiddenElement aria-live="assertive" role="status">
                loading previous messages
              </VisuallyHiddenElement>
              <Spin />
            </SpinnerWrapper>
          }
          next={onFetchMore}
          scrollableTarget="scrollableDiv"
          scrollThreshold="50px"
        >
          {messages.map(({ content, date, own, user }) => (
            <StyledChatMessage
              className="message"
              content={content}
              date={date}
              own={own}
              user={user}
            />
          ))}
        </StyledInfiniteScroll>
      )}
    </Wrapper>
  )
}

ChatMessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string,
      date: PropTypes.string,
      own: PropTypes.bool,
      user: PropTypes.string,
    }),
  ),
  hasMore: PropTypes.bool,
  onFetchMore: PropTypes.func,
}

ChatMessageList.defaultProps = {
  messages: [],
  hasMore: false,
  onFetchMore: () => {},
}

export default ChatMessageList
