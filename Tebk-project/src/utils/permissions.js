export const ROLES = {
  ADMIN:    'admin',
  CLIENT:   'client',
  SUPPLIER: 'supplier',
}

export function isAdmin(user)    { return user?.role === ROLES.ADMIN }
export function isClient(user)   { return user?.role === ROLES.CLIENT }
export function isSupplier(user) { return user?.role === ROLES.SUPPLIER }

export function hasRole(user, role) {
  if (!user) return false
  if (Array.isArray(role)) return role.includes(user.role)
  return user.role === role
}
