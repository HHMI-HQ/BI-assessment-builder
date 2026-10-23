export default [
  {
    label: 'Seed admin',
    execute: async () => {
      /* eslint-disable-next-line global-require */
      const seedAdmin = require('./scripts/seedAdmin0')
      await seedAdmin()
    },
  },
]
