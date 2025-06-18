"use client"

export async function handleLogout() {
  try {
    // Simply redirect to the logout endpoint
    window.location.href = "/auth/logout"
  } catch (error) {
    console.error("Logout error:", error)
    // Fallback: redirect to login page
    window.location.href = "/auth/login"
  }
}
