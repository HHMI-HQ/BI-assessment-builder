import React from 'react'
import { lorem } from 'faker'
import { LinkOutlined } from '@ant-design/icons'

import { Button } from 'ui'

export const Base = () => <Button>{lorem.words(2)}</Button>
export const Primary = () => <Button type="primary">{lorem.words(2)}</Button>

export const Danger = () => <Button status="danger">{lorem.words(2)}</Button>

export const PrimaryDanger = () => (
  <Button status="error" type="primary">
    {lorem.words(2)}
  </Button>
)

export const Success = () => <Button status="success">{lorem.words(2)}</Button>

export const PrimarySuccess = () => (
  <Button status="success" type="primary">
    {lorem.words(2)}
  </Button>
)

export const AnchorButton = () => (
  <Button href="#" type="primary">
    Anchor tag with button styles
  </Button>
)

export const LinkButton = () => (
  <Button direction="rtl" ghost icon={<LinkOutlined />} to="#" type="primary">
    React-router Link with buttons styles
  </Button>
)

export default {
  component: Button,
  title: 'Common/Button',
}
