const {
  logger,
  User,
  db,
  useTransaction,
  Identity,
  Team,
  TeamMember,
} = require('@coko/server')
const crypto = require('crypto')

// eslint-disable-next-line import/newline-after-import
module.exports = async () => {
  try {
    await useTransaction(async () => {
      const exists = await User.findOne({
        username: 'admin0',
      })

      if (exists) {
        logger.info(
          '[seedAdmin0]: `admin0` with admin privelages already exists',
        )
        return
      }

      const newAdmin = await User.insert({
        username: 'admin0',
        password: 'Password@123',
        givenNames: 'Admin',
        surname: 'Adminius',
        agreedTc: true,
        isActive: true,
      })

      // update profile_submitted field separately bcs it does not exist in the coko-server model
      await db.raw(
        `UPDATE users SET profile_submitted=true WHERE id='${newAdmin.id}'`,
      )

      const verificationToken = crypto.randomBytes(64).toString('hex')
      const verificationTokenTimestamp = new Date()

      await Identity.insert({
        userId: newAdmin.id,
        email: 'admin0@hhmi.org',
        isVerified: true,
        isDefault: true,
        isSocial: false,
        verificationTokenTimestamp,
        verificationToken,
      })

      const adminTeam = await Team.findOne({
        role: 'admin',
        global: true,
      })

      await TeamMember.insert({
        teamId: adminTeam.id,
        userId: newAdmin.id,
      })
      // await addToTeams('admin0@hhmi.org', 'admin')

      logger.info(
        '[seedAdmin0]: User `admin0` has been created with admin privelages',
      )
    })
  } catch (error) {
    throw new Error(error)
  }
}
