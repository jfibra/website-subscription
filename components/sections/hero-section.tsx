"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return

      const rect = heroRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setMousePosition({ x, y })
    }

    const heroElement = heroRef.current
    if (heroElement) {
      heroElement.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [])

  const calculateTransform = (offsetX: number, offsetY: number, factor: number) => {
    if (!heroRef.current) return { x: 0, y: 0 }

    const { width, height } = heroRef.current.getBoundingClientRect()
    const centerX = width / 2
    const centerY = height / 2

    const x = ((mousePosition.x - centerX) / centerX) * offsetX
    const y = ((mousePosition.y - centerY) / centerY) * offsetY

    return { x: x * factor, y: y * factor }
  }

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute top-0 left-0 w-full h-full dot-pattern opacity-30"></div>
          <div className="absolute top-0 left-0 w-full h-full noise-bg"></div>
        </motion.div>

        {/* Floating Shapes */}
        <motion.div
          className="absolute top-[20%] left-[15%] w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{
            transform: `translate3d(${calculateTransform(20, 20, 0.5).x}px, ${calculateTransform(20, 20, 0.5).y}px, 0)`,
          }}
        />

        <motion.div
          className="absolute bottom-[20%] right-[15%] w-72 h-72 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{
            transform: `translate3d(${calculateTransform(-20, -20, 0.3).x}px, ${calculateTransform(-20, -20, 0.3).y}px, 0)`,
          }}
        />
      </div>

      {/* Video Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="video-background opacity-20"
          poster="/abstract-geometric-poster.png"
          onLoadedData={() => setIsLoaded(true)}
        >
          <source src="/placeholder.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-white/95 to-purple-50/90" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Floating Badge */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="inline-block mb-6"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border border-blue-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              Professional Web Design & Management
            </span>
          </motion.div>

          <motion.h1
            className="font-plus-jakarta font-extrabold text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight tracking-tighter text-shadow text-balance"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Websites Built for <span className="gradient-text">Growth</span>, Managed with Care
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Start your online presence with a modern Next.js site. No upfront fees, no complicated contracts. We design,
            build, and manage your website so you can focus on your business.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button
              size="lg"
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl"
              asChild
            >
              <Link href="/auth">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2 hover-lift rounded-xl" asChild>
              <Link href="#pricing">
                <Play className="mr-2 w-5 h-5" /> See Plans
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-12 text-sm text-gray-500 flex flex-wrap justify-center gap-x-6 gap-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="flex items-center">
              <span className="inline-block w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mr-2 flex items-center justify-center text-white text-xs">
                ✓
              </span>
              First preview in 24 hours
            </div>
            <div className="flex items-center">
              <span className="inline-block w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mr-2 flex items-center justify-center text-white text-xs">
                ✓
              </span>
              Built on Next.js
            </div>
            <div className="flex items-center">
              <span className="inline-block w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mr-2 flex items-center justify-center text-white text-xs">
                ✓
              </span>
              Cancel anytime
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </motion.div>

      {/* Featured Clients/Technologies */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 py-6 bg-gradient-to-t from-white/80 to-transparent backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <Image src="/nextjs-logo.png" alt="Next.js" width={80} height={40} className="h-8 w-auto object-contain" />
            <Image
              src="/tailwind-logo.png"
              alt="Tailwind CSS"
              width={80}
              height={40}
              className="h-8 w-auto object-contain"
            />
            <Image src="/vercel-logo.png" alt="Vercel" width={80} height={40} className="h-8 w-auto object-contain" />
            <Image
              src="/framer-motion-logo.png"
              alt="Framer Motion"
              width={80}
              height={40}
              className="h-8 w-auto object-contain"
            />
            <Image src="/stripe-logo.png" alt="Stripe" width={80} height={40} className="h-8 w-auto object-contain" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
