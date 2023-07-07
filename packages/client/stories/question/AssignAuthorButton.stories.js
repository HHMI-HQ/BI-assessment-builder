import React from 'react'
import AssignAuthorButton from '../../app/ui/question/AssignAuthorButton'

export const Base = () => {
  const handleAssginAuthor = () => {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  const [authors, setAuthors] = React.useState([
    {
      value: '3aa64674-5b8b-47f1-96dd-ae83455106da',
      label: 'user1',
    },
    {
      value: '6b619777-ae96-4217-9811-a40b8eccddef',
      label: 'user2',
    },
    {
      value: 'a7987191-8532-40bd-9f97-9748ab613ef3',
      label: 'user3',
    },
    {
      value: 'a91e4a93-0bf1-4bac-b884-1c084c491d81',
      label: 'user4',
    },
  ])

  const handleSearch = query => {
    setAuthors(() =>
      authors.filter(handlingEditor => handlingEditor.label === query),
    )
  }

  return (
    <AssignAuthorButton
      authors={authors}
      onAssignAuthor={handleAssginAuthor}
      onSearchAuthor={handleSearch}
    />
  )
}

export default {
  component: AssignAuthorButton,
  title: 'Question/AssignAuthorButton',
}
