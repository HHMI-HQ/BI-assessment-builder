import { gql } from '@apollo/client'

export default gql`
  query Resource {
    getResources {
      label
      value
      url
      topics
      subtopics
    }
  }
`
