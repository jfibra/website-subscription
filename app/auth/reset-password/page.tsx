"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  // token typically arrives as a query param in the reset-link e-mail
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!token) {
      setMessage("Invalid or missing reset token.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      if (res.ok) {
        setMessage("Password reset successfully. You can now log in.")
      } else {
        const data = await res.json().catch(() => ({}))
        setMessage(data.error ?? "Something went wrong.")
      }
    } catch {
      setMessage("Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-center text-2xl font-semibold">Reset Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Submitting…" : "Reset Password"}
          </Button>
        </form>

        {message && <p className="text-center text-sm text-muted-foreground">{message}</p>}
      </div>
    </main>
  )
}
