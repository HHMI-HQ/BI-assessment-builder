const {
  updateGlobalTeams,
  getNonTeamMemberUsers,
  filterGlobalTeamMembers,
} = require('../../controllers/team.controllers')

const getNonTeamMemberUsersResolver = async (_, { teamId, term }, ctx) => {
  return getNonTeamMemberUsers(teamId, term)
}

const filterGlobalTeamMembersResolver = async (_, { role, query }, ctx) => {
  return filterGlobalTeamMembers(role, query)
}

const updateGlobalTeamsResolver = async (_, { input }, ctx) => {
  return updateGlobalTeams(input)
}

module.exports = {
  Query: {
    getNonTeamMemberUsers: getNonTeamMemberUsersResolver,
    filterGlobalTeamMembers: filterGlobalTeamMembersResolver,
  },
  Mutation: {
    updateGlobalTeams: updateGlobalTeamsResolver,
  },
}
