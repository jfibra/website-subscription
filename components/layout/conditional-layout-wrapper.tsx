"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingIguana } from "@/components/iguana/floating-iguana"

export function ConditionalLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isAdminPath = pathname?.startsWith("/admin")
  const isUserPath = pathname?.startsWith("/user")
  const isAuthPath = pathname?.startsWith("/auth")

  const shouldHideNavAndFooter = isAdminPath || isUserPath || isAuthPath
  const shouldShowFloatingIguana = !shouldHideNavAndFooter

  return (
    <>
      {!shouldHideNavAndFooter && <Navbar />}
      <main className={shouldHideNavAndFooter ? "" : "pt-20"}>{children}</main>
      {!shouldHideNavAndFooter && <Footer />}
      {shouldShowFloatingIguana && <FloatingIguana />}
    </>
  )
}
