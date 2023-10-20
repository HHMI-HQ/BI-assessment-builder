import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { th } from '@coko/client'
// eslint-disable-next-line import/no-extraneous-dependencies
import { name, lorem } from 'faker'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { Checkbox, List, TabsStyled } from '../ui'

const StyledTabs = styled(TabsStyled)`
  height: 100%;
  width: 100%;

  .ant-tabs-content-holder {
    border-top: 1px solid ${th('colorBorder')};

    .ant-tabs-content {
      height: 100%;

      .ant-tabs-tabpane {
        height: 100%;
        margin: auto;
      }
    }
  }
`

const fakeMessages = length => {
  const lngth = Array.from({ length })
  const messages = []
  lngth.forEach((e, i) => {
    messages[i] = {
      id: i,
      from: `@${name.findName()}`,
      content: lorem.words(15),
      date: new Date().toLocaleString(),
    }
  })
  return messages
}

// eslint-disable-next-line react/prop-types
const NotificationPage = ({ currentTabKey }) => {
  const fakesmsgs = fakeMessages(33)
  const location = useLocation()
  const [currentTab, setCurrentTab] = useState(currentTabKey)

  useEffect(() => {
    if (location) {
      const tmp = location.pathname.slice(
        location.pathname.lastIndexOf('/') + 1,
      )

      setCurrentTab(tmp)
    }
  }, [location])

  const tabs = [
    {
      label: 'Message Notifications',
      key: 'messages',
      children: (
        <List
          dataSource={fakesmsgs}
          pagination={{
            pageSize: 10,
          }}
          renderItem={({ from, content, date, id }) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  width: '95%',
                  gap: '2ch',
                  borderBottom: '1px solid #178369',
                  padding: '0.2rem 1rem',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '80%',
                    gap: '1ch',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Checkbox />
                  <strong style={{ color: '#178369' }}>{`${from}`}: </strong>
                  <p
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '30%',
                    }}
                  >{`${content}`}</p>
                </span>
                <p>{`${date}`}</p>
              </span>
            </div>
          )}
        />
      ),
    },
    {
      label: 'Tasks Notifications',
      key: 'tasks',
      children: (
        <List
          dataSource={fakesmsgs}
          renderItem={({ content }) => <p>{content}</p>}
        />
      ),
    },
  ]

  return (
    <StyledTabs
      activeKey={currentTab}
      defaultActiveKey={currentTab}
      items={tabs.map(t => t)}
      type="line"
    />
  )
}

export default NotificationPage
