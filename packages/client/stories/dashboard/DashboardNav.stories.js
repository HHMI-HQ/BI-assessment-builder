import React from 'react'
import { DashboardNav } from 'ui'

export const Base = () => {
  const createQuestion = () => {
    console.log('create question')
  }

  return (
    <DashboardNav
      active="authored"
      createQuestion={createQuestion}
      userRole="editor"
    />
  )
}

export default {
  component: DashboardNav,
  title: 'Dashboard/DashboardNav',
}
