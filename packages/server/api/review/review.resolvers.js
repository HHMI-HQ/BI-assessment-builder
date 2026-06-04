const {
  getReview,
  saveReview,
  submitReview,
  getAttachments,
} = require('../../controllers/review.controller')

const getReviewResolver = async (_, { questionVersionId, reviewerId }, ctx) => {
  return getReview(questionVersionId, reviewerId || ctx.userId)
}

const saveReviewResolver = async (_, { input }, ctx) => {
  const { questionVersionId, reviewerId, responses } = input
  return saveReview(questionVersionId, reviewerId || ctx.userId, responses)
}

const submitReviewResolver = async (_, { input }, ctx) => {
  const { questionVersionId, content, attachments, reviewerId } = input
  return submitReview(
    questionVersionId,
    content,
    reviewerId || ctx.userId,
    attachments,
  )
}

const attachmentsResolver = async ({ id }) => {
  return getAttachments(id)
}

const responsesResolver = async ({ responses }) => {
  return JSON.stringify(responses)
}

module.exports = {
  Query: {
    getReview: getReviewResolver,
  },
  Mutation: {
    saveReview: saveReviewResolver,
    submitReview: submitReviewResolver,
  },
  Review: {
    attachments: attachmentsResolver,
    responses: responsesResolver,
  },
}
