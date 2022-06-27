export const hasGlobalRole = (user, role) => {
  if (!user || !role) return false
  const exists = user.teams.find(t => t.global && t.role === role)
  return !!exists
}

export const hasRole = (user, role, objectId) => {
  if (!user || !role || !objectId) return false

  const exists = user.teams.find(
    t => !t.global && t.role === role && t.objectId === objectId,
  )

  return !!exists
}
