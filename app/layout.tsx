import type React from "react"
import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta" })

export const metadata: Metadata = {
  title: "WebFlow Pro - Monthly Website Subscriptions",
  description:
    "Professional websites built for you. Pay monthly, no upfront costs. Modern Next.js sites with ongoing support.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="font-inter antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ScrollToTop />
        <Toaster />
      </body>
    </html>
  )
}
