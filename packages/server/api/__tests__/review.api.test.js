const { internet } = require('faker')
const createGraphQLServer = require('./helpers/createTestServer')

const { User, Team, TeamMember, QuestionVersion } = require('../../models')

const clearDb = require('../../models/__tests__/_clearDb')

const {
  createEmptyQuestion,
} = require('../../controllers/__tests__/__helpers__/questions')

const {
  createUser,
  createIdentity,
} = require('../../models/__tests__/__helpers__/users')

const { updateReviewerPool } = require('../../controllers/question.controllers')

const QUESTION = `
  query Question($id: ID!, $published: Boolean) {
    question(id: $id) {
      versions(latestOnly: true, publishedOnly: $published) {
        id
        reviewerStatus
        isReviewerAutomationOn
        amountOfReviewers
        reviews {
          id
          status {
             submitted
          }
          responses
        }
        reviewerPool {
          id
          status
          reviewSubmitted
		  user {
			id
			displayName
			topicsReviewing
			receivedTraining
			receivedInclusiveLanguageTraining
			defaultIdentity{
			  id
			  email
			}
		  }
        }
      }
    }
  }
`

const ACCEPT_OR_REJECT_REVIEW_INVITATION = `
  mutation AcceptOrRejectReviewInvitation(
    $questionVersionId: ID!
    $accepted: Boolean!
    $reason: String
  ) {
    acceptOrRejectInvitation(
      questionVersionId: $questionVersionId
      accepted: $accepted
      reason: $reason
    )
  }
`

const SAVE_REVIEW = `
  mutation SaveReview($questionVersionId: ID!, $reviewerId: ID!, $responses: String!) {
    saveReview(questionVersionId: $questionVersionId, reviewerId: $reviewerId, responses: $responses) {
        id
        responses
    }
  }
   `

const SUBMIT_REVIEW = `
  mutation SubmitReview($input: SubmitReviewInput!) {
    submitReview(input: $input)
  }
   `

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

describe('Review API', () => {
  beforeEach(async () => clearDb())

  afterAll(() => {
    const team = Team.knex()
    const teamMember = TeamMember.knex()
    const user = User.knex()
    team.destroy()
    teamMember.destroy()
    user.destroy()
  })

  it('updates review responses', async () => {
    const user = await createUser()
    const editor = await createUser()
    const handlingEditor1 = await createUser()
    const handlingEditor2 = await createUser()

    await createIdentity(editor, internet.email(), false, null)
    await createIdentity(handlingEditor1, internet.email(), false, null)
    await createIdentity(handlingEditor2, internet.email(), false, null)

    const question = await createEmptyQuestion()
    const reviewer1 = await createUser()
    const reviewer2 = await createUser()

    await createIdentity(reviewer1, internet.email(), false, null)
    await createIdentity(reviewer2, internet.email(), false, null)

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

    const reviewerTeam = await Team.insert({
      role: 'reviewer',
      global: true,
      displayName: 'Reviewer',
    })

    await Team.updateMembershipByTeamId(reviewerTeam.id, [
      reviewer1.id,
      reviewer2.id,
    ])

    await updateReviewerPool(questionVersion.id, [reviewer1.id, reviewer2.id])

    const testServer = await createGraphQLServer()

    const response1 = await testServer.executeOperation(
      {
        query: QUESTION,
        variables: {
          id: question.id,
        },
      },
      {
        contextValue: {
          userId: user.id,
        },
      },
    )

    const data1 = response1.body.singleResult.data

    const [version1] = data1.question.versions

    version1.reviewerPool.forEach(reviewer =>
      expect(reviewer.reviewSubmitted).toBe(false),
    )

    const reviewerServer1 = await createGraphQLServer()
    const reviewerServer2 = await createGraphQLServer()

    await reviewerServer1.executeOperation(
      {
        query: ACCEPT_OR_REJECT_REVIEW_INVITATION,
        variables: {
          questionVersionId: questionVersion.id,
          accepted: false,
          reason: 'no',
        },
      },
      {
        contextValue: {
          userId: reviewer1.id,
        },
      },
    )

    await reviewerServer2.executeOperation(
      {
        query: ACCEPT_OR_REJECT_REVIEW_INVITATION,
        variables: {
          questionVersionId: questionVersion.id,
          accepted: true,
        },
      },
      {
        contextValue: {
          userId: reviewer2.id,
        },
      },
    )

    // const response2 = await testServer.executeOperation(
    //   {
    //     query: QUESTION,
    //     variables: {
    //       id: question.id,
    //     },
    //   },
    //   {
    //     contextValue: {
    //       userId: user.id,
    //     },
    //   },
    // )

    // const data2 = response2.body.singleResult.data

    // const [version2] = data2.question.versions

    // expect(
    //   version2.reviewerPool.find(r => r.user.id === reviewer1.id)
    //     .reviewSubmitted,
    // ).toBe(false)

    // expect(
    //   version2.reviewerPool.find(r => r.user.id === reviewer2.id)
    //     .reviewSubmitted,
    // ).toBe(false)

    const updatedReview = await reviewerServer2.executeOperation(
      {
        query: SAVE_REVIEW,
        variables: {
          questionVersionId: version1.id,
          reviewerId: reviewer2.id,
          responses: JSON.stringify(reviewResponses),
        },
      },
      {
        contextValue: {
          userId: reviewer2.id,
        },
      },
    )

    expect(updatedReview.body.singleResult.data.saveReview.responses).toBe(
      JSON.stringify(reviewResponses),
    )
  })

  it('returns the correct review status after submitting', async () => {
    const user = await createUser()
    const editor = await createUser()
    const handlingEditor1 = await createUser()
    const handlingEditor2 = await createUser()

    await createIdentity(editor, internet.email(), false, null)
    await createIdentity(handlingEditor1, internet.email(), false, null)
    await createIdentity(handlingEditor2, internet.email(), false, null)

    const question = await createEmptyQuestion()
    const reviewer1 = await createUser()
    const reviewer2 = await createUser()

    await createIdentity(reviewer1, internet.email(), false, null)
    await createIdentity(reviewer2, internet.email(), false, null)

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

    const reviewerTeam = await Team.insert({
      role: 'reviewer',
      global: true,
      displayName: 'Reviewer',
    })

    await Team.updateMembershipByTeamId(reviewerTeam.id, [
      reviewer1.id,
      reviewer2.id,
    ])

    await updateReviewerPool(questionVersion.id, [reviewer1.id, reviewer2.id])

    const testServer = await createGraphQLServer()

    const response1 = await testServer.executeOperation(
      {
        query: QUESTION,
        variables: {
          id: question.id,
        },
      },
      {
        contextValue: {
          userId: user.id,
        },
      },
    )

    const data1 = response1.body.singleResult.data

    const [version1] = data1.question.versions

    version1.reviewerPool.forEach(reviewer =>
      expect(reviewer.reviewSubmitted).toBe(false),
    )

    const reviewerServer1 = await createGraphQLServer()
    const reviewerServer2 = await createGraphQLServer()

    await reviewerServer1.executeOperation(
      {
        query: ACCEPT_OR_REJECT_REVIEW_INVITATION,
        variables: {
          questionVersionId: questionVersion.id,
          accepted: false,
          reason: 'no',
        },
      },
      {
        contextValue: {
          userId: reviewer1.id,
        },
      },
    )

    await reviewerServer2.executeOperation(
      {
        query: ACCEPT_OR_REJECT_REVIEW_INVITATION,
        variables: {
          questionVersionId: questionVersion.id,
          accepted: true,
        },
      },
      {
        contextValue: {
          userId: reviewer2.id,
        },
      },
    )

    const response2 = await testServer.executeOperation(
      {
        query: QUESTION,
        variables: {
          id: question.id,
        },
      },
      {
        contextValue: {
          userId: user.id,
        },
      },
    )

    const data2 = response2.body.singleResult.data

    const [version2] = data2.question.versions

    expect(
      version2.reviewerPool.find(r => r.user.id === reviewer1.id)
        .reviewSubmitted,
    ).toBe(false)

    expect(
      version2.reviewerPool.find(r => r.user.id === reviewer2.id)
        .reviewSubmitted,
    ).toBe(false)

    await reviewerServer2.executeOperation(
      {
        query: SAVE_REVIEW,
        variables: {
          questionVersionId: version2.id,
          reviewerId: reviewer2.id,
          responses: JSON.stringify(reviewResponses),
        },
      },
      {
        contextValue: {
          userId: reviewer2.id,
        },
      },
    )

    await reviewerServer2.executeOperation(
      {
        query: SUBMIT_REVIEW,
        variables: {
          input: {
            questionVersionId: version2.id,
          },
        },
      },
      {
        contextValue: {
          userId: reviewer2.id,
        },
      },
    )

    const response3 = await testServer.executeOperation(
      {
        query: QUESTION,
        variables: {
          id: question.id,
        },
      },
      {
        contextValue: {
          userId: user.id,
        },
      },
    )

    const data3 = response3.body.singleResult.data

    const [version3] = data3.question.versions

    expect(
      version3.reviewerPool.find(r => r.user.id === reviewer1.id)
        .reviewSubmitted,
    ).toBe(false)

    expect(
      version3.reviewerPool.find(r => r.user.id === reviewer2.id)
        .reviewSubmitted,
    ).toBe(true)
  })
})
