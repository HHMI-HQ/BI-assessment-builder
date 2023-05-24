import React from 'react'
import { lorem, name } from 'faker'

import { ChatThread } from 'ui'
import { createData, noop, randomPick } from '../../app/utilities/_helpers'

const createMessages = n =>
  createData(n, i => ({
    content: lorem.sentences(2),
    date: new Date().toISOString(),
    own: randomPick([true, false]),
    user: name.findName(),
  }))

export const Base = () => {
  const [messages, setMessages] = React.useState(createMessages(20))
  const [announcementText, setAnnouncementText] = React.useState('')

  const handleSend = content => {
    const msg = {
      content,
      date: new Date().toISOString(),
      own: true,
      user: name.findName(),
    }

    setMessages(curMessages => [...curMessages, msg])
    setAnnouncementText(`you said ${content}`)
  }

  const handleFetchMoreMessage = async () => {
    setAnnouncementText(null)

    // eslint-disable-next-line no-promise-executor-return
    const mockDelay = time => new Promise(resolve => setTimeout(resolve, time))
    await mockDelay(1000)
    const prevMessages = createMessages(10)
    setMessages(curMessages => [...prevMessages, ...curMessages])
    setAnnouncementText(`Loaded ${prevMessages.length}  previous messages`)
  }

  return (
    <div style={{ height: '70vh' }}>
      <ChatThread
        announcementText={announcementText}
        hasMore={messages.length < 20}
        messages={messages}
        onFetchMore={handleFetchMoreMessage}
        onSendMessage={handleSend}
      />
    </div>
  )
}

export const Empty = () => <ChatThread onSendMessage={noop} />

export default {
  component: ChatThread,
  title: 'Chat/Chat Thread',
}
