import type React from "react"
import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"
import { ConditionalLayoutWrapper } from "@/components/layout/conditional-layout-wrapper"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
})

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
      <head>
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}
          strategy="lazyOnload"
        />
      </head>
      <body className="font-inter antialiased">
        <ConditionalLayoutWrapper>{children}</ConditionalLayoutWrapper>
        <ScrollToTop />
        <Toaster />
      </body>
    </html>
  )
}
