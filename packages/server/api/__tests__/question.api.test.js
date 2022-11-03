const createGraphQLServer = require('./helpers/createTestServer')
const { User, Question } = require('../../models')

const clearDb = require('../../models/__tests__/_clearDb')

// gql queries
const GET_AUTHOR_DASHBOARD = `
  query GetAuthorDashboard(
    $orderBy: String
    $ascending: Boolean
    $page: Int
    $pageSize: Int
    $searchQuery: String
  ) {
    getAuthorDashboard(
      orderBy: $orderBy
      ascending: $ascending
      page: $page
      pageSize: $pageSize
      searchQuery: $searchQuery
    ) {
      result {
        id
        versions(latestOnly: true) {
          id
        }
      }
      totalCount
    }
  }
`

const GET_EDITOR_DASHBOARD = `
  query GetEditorDashboard(
    $orderBy: String
    $ascending: Boolean
    $page: Int
    $pageSize: Int
    $searchQuery: String
  ) {
    getManagingEditorDashboard(
      orderBy: $orderBy
      ascending: $ascending
      page: $page
      pageSize: $pageSize
      searchQuery: $searchQuery
    ) {
      result {
        id
        versions(latestOnly: true) {
          id
        }
      }
      totalCount
    }
  }
`

describe('Question API authorization', () => {
  beforeEach(async () => clearDb())

  afterAll(() => {
    const question = Question.knex()
    const user = User.knex()
    question.destroy()
    user.destroy()
  })

  it("blocks inactive users from quering author's dashboard", async () => {
    const user = await User.insert({
      isActive: false,
    })

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: GET_AUTHOR_DASHBOARD,
      variables: {
        orderBy: 'date',
        ascending: true,
        page: 1,
        pageSize: 10,
        searchQuery: '',
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })

  it("blocks inactive users from quering editor's dashboard", async () => {
    const user = await User.insert({
      isActive: false,
    })

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: GET_EDITOR_DASHBOARD,
      variables: {
        orderBy: 'date',
        ascending: true,
        page: 1,
        pageSize: 10,
        searchQuery: '',
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })

  it("blocks users who are not editors from quering editor's dashboard", async () => {
    const user = await User.insert({
      isActive: true,
    })

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: GET_EDITOR_DASHBOARD,
      variables: {
        orderBy: 'date',
        ascending: true,
        page: 1,
        pageSize: 10,
        searchQuery: '',
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })
})
