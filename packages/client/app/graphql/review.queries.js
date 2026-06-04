import { gql } from '@apollo/client'

const SUBMIT_REVIEW = gql`
  mutation SubmitReview($input: SubmitReviewInput!) {
    submitReview(input: $input)
  }
`

const GET_REVIEW = gql`
  query GetReview($questionVersionId: ID!, $reviewerId: ID!) {
    getReview(questionVersionId: $questionVersionId, reviewerId: $reviewerId) {
      id
      responses
      status {
        pending
        submitted
      }
    }
  }
`

const SAVE_REVIEW = gql`
  mutation SaveReview(
    $questionVersionId: ID!
    $reviewerId: ID!
    $responses: String!
  ) {
    saveReview(
      questionVersionId: $questionVersionId
      reviewerId: $reviewerId
      responses: $responses
    ) {
      id
      responses
      status {
        pending
        submitted
      }
    }
  }
`

export { GET_REVIEW, SUBMIT_REVIEW, SAVE_REVIEW }
