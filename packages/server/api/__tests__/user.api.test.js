const createTestServer = require('./helpers/createTestServer')
const { User } = require('../../models')

const clearDb = require('../../models/__tests__/_clearDb')

describe('User API authorization', () => {
  beforeEach(async () => clearDb())

  afterAll(() => {
    const knex = User.knex()
    knex.destroy()
  })

  const FILTER_USERS = `
query FilterUsers($params: UsersQueryParams, $options: PageInput) {
    filterUsers(params: $params, options: $options) {
      result {
        id
        displayName
        defaultIdentity {
          email
        }
        coursesTeaching
        created
        isActive

        teams {
          role
        }
      }
      totalCount
    }
  }
`

  it('test', async () => {
    const user = await User.insert({
      isActive: false,
    })

    const testServer = await createTestServer(user)

    const result = await testServer.executeOperation({
      query: FILTER_USERS,
      variables: { isActive: true },
    })

    // eslint-disable-next-line no-console
    console.log(result)

    expect(true).toBe(true)
  })
})
