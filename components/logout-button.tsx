"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOutIcon } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface LogoutButtonProps {
  variant?: "ghost" | "outline" | "default"
  size?: "sm" | "default" | "lg"
  className?: string
  showText?: boolean
}

export function LogoutButton({
  variant = "ghost",
  size = "default",
  className = "",
  showText = true,
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)
    // Simply redirect to the logout endpoint
    window.location.href = "/auth/logout"
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? (
        <LoadingSpinner size={16} className={showText ? "mr-2" : ""} />
      ) : (
        <LogOutIcon className={showText ? "mr-2 h-4 w-4" : "h-4 w-4"} />
      )}
      {showText && (isLoggingOut ? "Logging out..." : "Logout")}
    </Button>
  )
}
