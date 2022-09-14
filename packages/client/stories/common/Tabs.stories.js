import React from 'react'
import { lorem } from 'faker'
import { range } from 'lodash'

import { Tabs } from 'ui'

export const Base = () => (
  <Tabs>
    {range(3).map(i => (
      <Tabs.TabPane key={i} tab={lorem.words(2)}>
        {lorem.sentences(6)}
      </Tabs.TabPane>
    ))}
  </Tabs>
)

export const NewSyntax = () => {
  const items = [
    { label: 'Tab 1', key: 'tab-1', children: 'Tab 1 content - simple text' },
    {
      label: 'Tab 2',
      key: 'tab-2',
      children: (
        <div>
          <p>Tab 2 content - jsx</p>
          <p>
            <button type="button">Button</button>
          </p>
        </div>
      ),
    },
  ]

  return <Tabs items={items} />
}

export default {
  component: Tabs,
  title: 'Common/Tabs',
}
