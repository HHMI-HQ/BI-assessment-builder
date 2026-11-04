const {
  modelJsonSchemaTypes: { stringNullable },
} = require('@coko/server')

const { TeamMember: TeamMemberModel } = require('@coko/server')
const { REVIEWER_STATUSES } = require('../../controllers/constants')

class TeamMember extends TeamMemberModel {
  static get schema() {
    return {
      type: 'object',
      required: [],
      properties: {
        description: stringNullable,
      },
    }
  }

  hasActiveInvitation() {
    return (
      this.status === REVIEWER_STATUSES.invited ||
      this.status === REVIEWER_STATUSES.accepted
    )
  }

  canInvite() {
    return !this.status || this.status === REVIEWER_STATUSES.added
  }
}

module.exports = TeamMember
