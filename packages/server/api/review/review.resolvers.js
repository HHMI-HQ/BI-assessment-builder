const {
  getAttachments,
  submitReview,
  saveReview,
} = require('../../controllers/review.controller')

const submitReviewResolver = async (_, { input }, ctx) => {
  const { questionVersionId, content, attachments, reviewerId } = input
  return submitReview(
    questionVersionId,
    content,
    reviewerId || ctx.userId,
    attachments,
  )
}

const saveReviewResolver = async (_, { input }, ctx) => {
  const { questionVersionId, reviewerId, responses } = input
  return saveReview(questionVersionId, reviewerId || ctx.userId, responses)
}

const attachmentsResolver = async ({ id }) => {
  return getAttachments(id)
}

module.exports = {
  Mutation: {
    saveReview: saveReviewResolver,
    submitReview: submitReviewResolver,
  },
  Review: {
    attachments: attachmentsResolver,
  },
}
