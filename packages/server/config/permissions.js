const { rule, isAuthenticated } = require('@coko/server/authorization')

const isEditor = rule()(async (_, __, ctx) => {
  const UserModel = ctx.connectors.User.model
  const user = await UserModel.query().findById(ctx.user)
  return user.hasGlobalRole('editor')
})

const isAdmin = rule()(async (_, __, ctx) => {
  const UserModel = ctx.connectors.User.model
  const user = await UserModel.query().findById(ctx.user)
  return user.hasGlobalRole('admin')
})

const permissions = {
  Mutation: {
    // Authentication
    resendVerificationEmailAfterLogin: isAuthenticated,
    // Users
    submitQuestionnaire: isAuthenticated,
    updateUserProfile: isAuthenticated,
    updatePassword:
      isAuthenticated &&
      rule()(async (_, { input: { id } }, { user }) => {
        // only if id from arguments is same as current user's id
        return id === user
      }),
    deleteUsers:
      isAuthenticated &&
      isAdmin &&
      rule()(async (_, args, ctx) => {
        // allow only if current user is not in the list of ids to delete
        return args.ids.indexOf(ctx.user) === -1
      }),
    deactivateUsers:
      isAuthenticated &&
      isAdmin &&
      rule()(async (_, args, ctx) => {
        // allow only if current user is not in the list of ids to deactivate
        return args.ids.indexOf(ctx.user) === -1
      }),

    // Teams
    addTeamMember: isAuthenticated,
    updateTeamMembership: isAuthenticated,
    updateGlobalTeams: isAuthenticated && isAdmin,

    // Questions
    createQuestion: isAuthenticated,
    updateQuestion: isAuthenticated,
    submitQuestion: isAuthenticated,
    rejectQuestion: isAuthenticated && isEditor,
    moveQuestionVersionToReview: isAuthenticated && isEditor,
    publishQuestionVersion: isAuthenticated && isEditor,
  },
  Query: {
    // Users
    filterUsers: isAuthenticated && isAdmin,
    // Teams
    getGlobalTeams: isAuthenticated && isAdmin,
    getNonTeamMemberUsers: isAuthenticated && isAdmin,
    // Questions:
    getAuthorDashboard: isAuthenticated,
    getManagingEditorDashboard: isAuthenticated && isEditor,
  },
}

module.exports = permissions
