"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export function ConditionalLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPath = pathname.startsWith("/admin")
  const isUserPath = pathname.startsWith("/user")
  const isAuthPath = pathname.startsWith("/auth")

  const showNavAndFooter = !isAdminPath && !isUserPath && !isAuthPath

  return (
    <>
      {showNavAndFooter && <Navbar />}
      <main className={showNavAndFooter ? "pt-20" /* Account for fixed Navbar height */ : ""}>{children}</main>
      {showNavAndFooter && <Footer />}
    </>
  )
}
