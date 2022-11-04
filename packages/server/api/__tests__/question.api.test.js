const createGraphQLServer = require('./helpers/createTestServer')
const { User, Question, QuestionVersion } = require('../../models')

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

const CREATE_QUESTION = `
  mutation CreateQuestion {
    createQuestion {
      id
    }
  }
`

const UPDATE_QUESTION = `
mutation UpdateQuestion(
  $questionId: ID!
  $questionVersionId: ID!
  $input: UpdateQuestionInput!
) {
  updateQuestion(
    questionId: $questionId
    questionVersionId: $questionVersionId
    input: $input
  ) {
    id
    versions(latestOnly: true) {
      id
    }
  }
}
`

const SUBMIT_QUESTION = `
  mutation SubmitQuestion(
    $questionId: ID!
    $questionVersionId: ID!
    $input: UpdateQuestionInput!
  ) {
    submitQuestion(
      questionId: $questionId
      questionVersionId: $questionVersionId
      input: $input
    ) {
      id
      agreedTc
      versions(latestOnly: true, publishedOnly: false) {
        submitted
      }
    }
  }
`

const REJECT_QUESTION = `
  mutation RejectQuestion($questionId: ID!) {
    rejectQuestion(questionId: $questionId) {
      id
      rejected
    }
  }
`

const MOVE_QUESTION_VERSION_TO_REVIEW = `
mutation MoveQuestionVersionToReview($questionVersionId: ID!) {
  moveQuestionVersionToReview(questionVersionId: $questionVersionId) {
    id
    underReview
  }
}
`

const MOVE_QUESTION_VERSION_TO_PRODUCTION = `
mutation MoveQuestionVersionToProdution($questionVersionId: ID!) {
  moveQuestionVersionToProduction(questionVersionId: $questionVersionId) {
    id
    underReview
    inProduction
  }
}
`

const PUBLISH_QUESTION_VERSION = `
mutation PublishQuestionVersion($questionVersionId: ID!) {
  publishQuestionVersion(questionVersionId: $questionVersionId) {
    id
  }
}
`

const CREATE_NEW_VERSION = `
mutation CreateNewQuestionVersion($questionId: ID!) {
  createNewQuestionVersion(questionId: $questionId) {
    id
    versions(latestOnly: true, publishedOnly: false) {
      id
    }
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

  it('blocks inactive users from creating questions', async () => {
    const user = await User.insert({
      isActive: false,
    })

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: CREATE_QUESTION,
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })

  // updating questions...
  it('blocks inactive users from updating questions', async () => {
    const user = await User.insert({
      isActive: false,
    })

    const question = await Question.insert({})
    const questionVersion = await Question.getVersions(question.id)

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: UPDATE_QUESTION,
      variables: {
        questionId: question.id,
        questionVersionId: questionVersion.result[0].id,
        input: {},
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })
  it('blocks users from updating rejected questions', async () => {
    const user = await User.insert({
      isActive: true,
    })

    const question = await Question.insert({ rejected: true })
    const questionVersion = await Question.getVersions(question.id)

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: UPDATE_QUESTION,
      variables: {
        questionId: question.id,
        questionVersionId: questionVersion.result[0].id,
        input: {},
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })
  it('blocks question update if question is not submitted and user is not its author', async () => {
    const user = await User.insert({
      isActive: true,
    })

    const question = await Question.insert({})
    const questionVersion = await Question.getVersions(question.id)

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: UPDATE_QUESTION,
      variables: {
        questionId: question.id,
        questionVersionId: questionVersion.result[0].id,
        input: {},
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })
  it('blocks question update if question is submitted but not yet under review', async () => {
    const user = await User.insert({
      isActive: true,
    })

    const question = await Question.insert({})
    const questionVersion = await Question.getVersions(question.id)

    const submittedVersion = await QuestionVersion.patchAndFetchById(
      questionVersion.result[0].id,
      { submitted: true },
    )

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: UPDATE_QUESTION,
      variables: {
        questionId: question.id,
        questionVersionId: submittedVersion.id,
        input: {},
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })
  it('blocks question update if question is under review', async () => {
    const user = await User.insert({
      isActive: true,
    })

    const question = await Question.insert({})
    const questionVersion = await Question.getVersions(question.id)

    const submittedVersion = await QuestionVersion.patchAndFetchById(
      questionVersion.result[0].id,
      { underReview: true },
    )

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: UPDATE_QUESTION,
      variables: {
        questionId: question.id,
        questionVersionId: submittedVersion.id,
        input: {},
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })
  it('blocks non-editors from updating questions in production', async () => {
    const user = await User.insert({
      isActive: true,
    })

    const question = await Question.insert({})
    const questionVersion = await Question.getVersions(question.id)

    const submittedVersion = await QuestionVersion.patchAndFetchById(
      questionVersion.result[0].id,
      { inProduction: true },
    )

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: UPDATE_QUESTION,
      variables: {
        questionId: question.id,
        questionVersionId: submittedVersion.id,
        input: {},
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })
  it('blocks question update if question is published', async () => {
    const user = await User.insert({
      isActive: true,
    })

    const question = await Question.insert({})
    const questionVersion = await Question.getVersions(question.id)

    const submittedVersion = await QuestionVersion.patchAndFetchById(
      questionVersion.result[0].id,
      { published: true },
    )

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: UPDATE_QUESTION,
      variables: {
        questionId: question.id,
        questionVersionId: submittedVersion.id,
        input: {},
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })
  //
  //
  it('blocks inactive users from submitting a question', async () => {
    const user = await User.insert({
      isActive: false,
    })

    const question = await Question.insert({})
    const questionVersion = await Question.getVersions(question.id)

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: SUBMIT_QUESTION,
      variables: {
        questionId: question.id,
        questionVersionId: questionVersion.result[0].id,
        input: {},
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })

  it('blocks users from submitting a question of which they are not authors', async () => {
    const user = await User.insert({
      isActive: true,
    })

    const question = await Question.insert({})
    const questionVersion = await Question.getVersions(question.id)

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: SUBMIT_QUESTION,
      variables: {
        questionId: question.id,
        questionVersionId: questionVersion.result[0].id,
        input: {},
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })

  it('blocks inactive users from rejecting questions', async () => {
    const user = await User.insert({
      isActive: false,
    })

    const question = await Question.insert({})

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: REJECT_QUESTION,
      variables: {
        questionId: question.id,
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })

  it('blocks users who are not editors from rejecting questions', async () => {
    const user = await User.insert({
      isActive: true,
    })

    const question = await Question.insert({})

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: REJECT_QUESTION,
      variables: {
        questionId: question.id,
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })

  it('blocks inactive users from moving questions to review', async () => {
    const user = await User.insert({
      isActive: true,
    })

    const question = await Question.insert({})
    const questionVersion = await Question.getVersions(question.id)

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: MOVE_QUESTION_VERSION_TO_REVIEW,
      variables: {
        questionVersionId: questionVersion.result[0].id,
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })
  it('blocks users who are not editors from moving questions to review', async () => {
    const user = await User.insert({
      isActive: true,
    })

    const question = await Question.insert({})
    const questionVersion = await Question.getVersions(question.id)

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: MOVE_QUESTION_VERSION_TO_REVIEW,
      variables: {
        questionVersionId: questionVersion.result[0].id,
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })
  it('blocks inactive users from moving questions to production', async () => {
    const user = await User.insert({
      isActive: false,
    })

    const question = await Question.insert({})
    const questionVersion = await Question.getVersions(question.id)

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: MOVE_QUESTION_VERSION_TO_PRODUCTION,
      variables: {
        questionVersionId: questionVersion.result[0].id,
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })
  it('blocks users who are not editors from moving questions to production', async () => {
    const user = await User.insert({
      isActive: true,
    })

    const question = await Question.insert({})
    const questionVersion = await Question.getVersions(question.id)

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: MOVE_QUESTION_VERSION_TO_PRODUCTION,
      variables: {
        questionVersionId: questionVersion.result[0].id,
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })
  it('blocks inactive users from publishing a question', async () => {
    const user = await User.insert({
      isActive: false,
    })

    const question = await Question.insert({})
    const questionVersion = await Question.getVersions(question.id)

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: PUBLISH_QUESTION_VERSION,
      variables: {
        questionVersionId: questionVersion.result[0].id,
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })
  it('blocks users who are not editors from publishing a question', async () => {
    const user = await User.insert({
      isActive: true,
    })

    const question = await Question.insert({})
    const questionVersion = await Question.getVersions(question.id)

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: PUBLISH_QUESTION_VERSION,
      variables: {
        questionVersionId: questionVersion.result[0].id,
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })
  it('blocks inactive users from creating new question versions', async () => {
    const user = await User.insert({
      isActive: false,
    })

    const question = await Question.insert({})

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: CREATE_NEW_VERSION,
      variables: {
        questionId: question.id,
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })
  it('blocks users who are not editors from creating new question versions', async () => {
    const user = await User.insert({
      isActive: true,
    })

    const question = await Question.insert({})

    const testServer = await createGraphQLServer(user.id)

    const result = await testServer.executeOperation({
      query: CREATE_NEW_VERSION,
      variables: {
        questionId: question.id,
      },
    })

    expect(result.data).toBe(null)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toEqual('Not Authorised!')
  })
})
