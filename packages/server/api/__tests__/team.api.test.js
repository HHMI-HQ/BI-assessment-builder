const createGraphQLServer = require('./helpers/createTestServer')
const { User, Team, TeamMember } = require('../../models')

const clearDb = require('../../models/__tests__/_clearDb')

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
          displayName
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
})
