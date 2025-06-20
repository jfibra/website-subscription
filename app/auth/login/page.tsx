"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createSupabaseClient } from "@/lib/supabase/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setIsLoading(false)
      return
    }

    router.push("/user/dashboard")
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-100 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm border border-green-100 shadow-xl rounded-xl p-8">
        <div className="flex justify-center mb-8">
          <Image
            src="/site-iguana-logo-new.png"
            alt="Site Iguana logo"
            width={180}
            height={70}
            priority
            className="h-auto w-auto"
          />
        </div>

        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Sign in to your account</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle className="font-semibold">Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full iguana-button text-white" disabled={isLoading}>
            {isLoading ? "Signing&nbsp;in…" : "Sign&nbsp;in"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-green-600 hover:underline font-medium">
            Sign&nbsp;up
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500 mt-4">
          <Link href="/privacy" className="hover:underline">
            Privacy&nbsp;Policy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="hover:underline">
            Terms&nbsp;of&nbsp;Service
          </Link>
        </p>
      </div>
    </main>
  )
}
