const { internet } = require('faker')
const { Review, QuestionVersion, User, Team } = require('../../models')

const {
  createUser,
  createIdentity,
} = require('../../models/__tests__/__helpers__/users')

const clearDb = require('../../models/__tests__/_clearDb')

const {
  updateReviewerPool,
  changeAmountOfReviewers,
} = require('../question.controllers')

const {
  inviteMaxReviewers,
  submitReview,
  saveReview,
} = require('../review.controller')

const { createEmptyQuestion } = require('./__helpers__/questions')

const reviewResponses = {
  barriers: 'A',
  concerns: ['grammatical'],
  hasIssues: false,
  difficulty: 'appropriate',
  suggestions: 'qqqq',
  issuesDetails: 'ISSUES',
  otherConcerns: 'O',
  clarityConcerns: 'C',
  answeredCorrectly: true,
  feedbackEvaluation: 'hasIssues',
  grammaticalConcerns: 'Grammatical',
  feedbackIssuesDetails: 'qq',
}

describe('Review Controller', () => {
  beforeEach(clearDb)

  afterAll(async () => {
    await clearDb()
    const knex = Review.knex()
    knex.destroy()
  })

  test('invites max reviewers', async () => {
    const question = await createEmptyQuestion()
    const user1 = await User.insert({})
    const user2 = await User.insert({})

    const ids = [user1.id, user2.id]

    let questionVersion = await QuestionVersion.findOne({
      questionId: question.id,
    })

    let invitedMembers = await inviteMaxReviewers(questionVersion)

    expect(invitedMembers).toHaveLength(0)

    questionVersion = await updateReviewerPool(questionVersion.id, ids)
    invitedMembers = await inviteMaxReviewers(questionVersion)

    expect(invitedMembers).toHaveLength(0)

    questionVersion = await changeAmountOfReviewers(questionVersion.id, 2)
    invitedMembers = await inviteMaxReviewers(questionVersion)

    expect(invitedMembers).toHaveLength(2)

    invitedMembers.forEach(member => expect(ids).toContain(member.userId))
  })

  test('saveReview updates responses', async () => {
    const question = await createEmptyQuestion()
    const editor = await createUser()
    const handlingEditor1 = await createUser()
    const handlingEditor2 = await createUser()

    await createIdentity(editor, internet.email(), false, null)

    await createIdentity(handlingEditor1, internet.email(), false, null)

    await createIdentity(handlingEditor2, internet.email(), false, null)

    const questionVersion = await QuestionVersion.findOne({
      questionId: question.id,
    })

    const editorTeam = await Team.insert({
      role: 'editor',
      global: true,
      displayName: 'Managing Editor',
    })

    await Team.updateMembershipByTeamId(editorTeam.id, [editor.id])

    const handlingEditorTeam = await Team.insert({
      role: 'handlingEditor',
      displayName: 'Handling Editor',
      objectId: questionVersion.questionId,
      objectType: 'question',
    })

    await Team.updateMembershipByTeamId(handlingEditorTeam.id, [
      handlingEditor1.id,
      handlingEditor2.id,
    ])

    const reviewer = await createUser()

    await createIdentity(reviewer, internet.email(), false, null)

    await Review.insert({
      questionVersionId: questionVersion.id,
      reviewerId: reviewer.id,
      status: {
        pending: true,
        submitted: false,
      },
    })

    const review = await Review.findOne({
      questionVersionId: questionVersion.id,
      reviewerId: reviewer.id,
    })

    expect(review.responses).toMatchObject({})

    const updatedReview = await saveReview(
      questionVersion.id,
      reviewer.id,
      JSON.stringify(reviewResponses),
    )

    expect(updatedReview.responses).toMatchObject(reviewResponses)
  })

  test('submitReview updates review status for user/questionVersion combination', async () => {
    const question = await createEmptyQuestion()
    const editor = await createUser()
    const handlingEditor1 = await createUser()
    const handlingEditor2 = await createUser()

    await createIdentity(editor, internet.email(), false, null)

    await createIdentity(handlingEditor1, internet.email(), false, null)

    await createIdentity(handlingEditor2, internet.email(), false, null)

    const questionVersion = await QuestionVersion.findOne({
      questionId: question.id,
    })

    const editorTeam = await Team.insert({
      role: 'editor',
      global: true,
      displayName: 'Managing Editor',
    })

    await Team.updateMembershipByTeamId(editorTeam.id, [editor.id])

    const handlingEditorTeam = await Team.insert({
      role: 'handlingEditor',
      displayName: 'Handling Editor',
      objectId: questionVersion.questionId,
      objectType: 'question',
    })

    await Team.updateMembershipByTeamId(handlingEditorTeam.id, [
      handlingEditor1.id,
      handlingEditor2.id,
    ])

    const reviewer = await createUser()

    await createIdentity(reviewer, internet.email(), false, null)

    await Review.insert({
      questionVersionId: questionVersion.id,
      reviewerId: reviewer.id,
      status: {
        pending: true,
        submitted: false,
      },
      // insert responses as well
      responses: reviewResponses,
    })

    const review = await Review.findOne({
      questionVersionId: questionVersion.id,
      reviewerId: reviewer.id,
    })

    expect(review.status).toMatchObject({ pending: true, submitted: false })

    const reviewId = await submitReview(questionVersion.id, reviewer.id)
    const submittedReview = await Review.findById(reviewId)

    expect(submittedReview.status).toMatchObject({
      pending: false,
      submitted: true,
    })
  })
})
