const config = {
  teams: {
    global: [
      {
        displayName: 'Managing Editor',
        role: 'editor',
      },
      {
        displayName: 'Handling Editor',
        role: 'handlingEditor',
      },
      {
        displayName: 'Reviewer',
        role: 'reviewer',
      },
      {
        displayName: 'Production',
        role: 'production',
      },
      // {
      //   displayName: "Admin",
      //   role: "admin",
      // },
    ],
    nonGlobal: [
      {
        displayName: 'Managing Editor',
        role: 'editor',
      },
      {
        displayName: 'Handling Editor',
        role: 'handlingEditor',
      },
      {
        displayName: 'Author',
        role: 'author',
      },
      {
        displayName: 'Reviewer',
        role: 'reviewer',
      },
    ],
  },
}

export default config
