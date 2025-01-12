export function isAuthenticated(): boolean {
  return !!localStorage.getItem('authToken')
}

export function logout() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
}
