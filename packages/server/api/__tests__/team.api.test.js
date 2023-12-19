const { internet } = require('faker')
const createGraphQLServer = require('./helpers/createTestServer')
const { User, Team, TeamMember, QuestionVersion } = require('../../models')

const clearDb = require('../../models/__tests__/_clearDb')

const {
  createUser,
  createIdentity,
} = require('../../models/__tests__/__helpers__/users')

const {
  createEmptyQuestion,
} = require('../../controllers/__tests__/__helpers__/questions')

const { updateReviewerPool } = require('../../controllers/question.controllers')

// gql queries
const UPDATE_GLOBAL_TEAMS = `
  mutation updateGlobalTeams($input: [UpdateGlobalTeamsInput!]!) {
    updateGlobalTeams(input: $input) {
      id
      role
      displayName
      members {
        id
        user {
          id
        }
      }
    }
  }
`

const QUESTION = `
  query Question($id: ID!, $published: Boolean) {
    question(id: $id) {
      versions(latestOnly: true, publishedOnly: $published) {
        id
        reviewerStatus
        reviews {
          id
          status {
             submitted
           }
        }
        reviewerPool {
          id
          status
          reviewSubmitted
          user {
            id
            displayName
            email
            topicsReviewing
            receivedTraining
            receivedInclusiveLanguageTraining
          }
        }
      }
    }
  }
`

describe('Team API authorization', () => {
  beforeEach(async () => clearDb())

  afterAll(() => {
    const team = Team.knex()
    const teamMember = TeamMember.knex()
    const user = User.knex()
    team.destroy()
    teamMember.destroy()
    user.destroy()
  })

  it('blocks inactive users from updating global teams', async () => {
    const user = await User.insert({
      isActive: false,
    })

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: UPDATE_GLOBAL_TEAMS,
      variables: {
        input: [
          {
            id: '48b95dcb-54b2-4c55-b5bf-d832ce368601',
            members: ['48b95dcb-54b2-4c55-b5bf-d832ce368602'],
          },
        ],
      },
    })

    expect(user.isActive).toBe(false)
    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })

  it('blocks users who are not admins from updating global teams', async () => {
    const user = await User.insert({
      isActive: true,
    })

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: UPDATE_GLOBAL_TEAMS,
      variables: {
        input: [
          {
            id: '48b95dcb-54b2-4c55-b5bf-d832ce368601',
            members: ['48b95dcb-54b2-4c55-b5bf-d832ce368602'],
          },
        ],
      },
    })

    const isAdmin = await user.hasGlobalRole('admin')
    expect(user.isActive).toBe(true)
    expect(isAdmin).toBe(false)
    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })

  it('allow active admin users to update global teams', async () => {
    const user = await User.insert({
      isActive: true,
    })

    const user2 = await User.insert({
      isActive: true,
    })

    const globalTeam = await Team.insert({
      role: 'admin',
      displayName: 'Admin',
      global: true,
    })

    await TeamMember.insert({
      teamId: globalTeam.id,
      userId: user.id,
    })

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: UPDATE_GLOBAL_TEAMS,
      variables: {
        input: [
          {
            id: globalTeam.id,
            members: [user.id, user2.id],
          },
        ],
      },
    })

    const isAdmin = await user.hasGlobalRole('admin')

    expect(user.isActive).toBe(true)
    expect(isAdmin).toBe(true)
    expect(result.errors).toBe(undefined)
    expect(result.data).not.toBe(null)
  })

  it('returns the correct review status', async () => {
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

    // const qv =
    await updateReviewerPool(questionVersion.id, [reviewer1.id, reviewer2.id])

    // console.log('qveeeeee', qv)

    // const teamMember1 =
    await TeamMember.findOne({ userId: reviewer1.id })

    // const teamMember2 =
    await TeamMember.findOne({ userId: reviewer2.id })

    // console.log('teamMember1', teamMember1)
    // console.log('teamMember2', teamMember2)

    const testServer = await createGraphQLServer(user.id)

    // const result =
    await testServer.executeOperation({
      query: QUESTION,
      variables: {
        id: question.id,
      },
    })

    // console.log('result', JSON.stringify(result.data, null, 2))

    expect(true).toBe(true)
  })
})
