"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Zap, Rocket } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Improved background with better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-green-50/50 to-orange-50/30"></div>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(34, 197, 94, 0.3) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6 border border-green-200"
            >
              <Zap className="w-4 h-4 mr-2" />
              Professional Web Solutions
            </motion.div>

            {/* Main Heading - Improved contrast */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-6"
            >
              Websites That{" "}
              <span className="bg-gradient-to-r from-green-700 to-orange-600 bg-clip-text text-transparent font-extrabold">
                Adapt & Grow
              </span>
            </motion.h1>

            {/* Subtitle - Better contrast */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl font-medium"
            >
              Professional Next.js websites designed to evolve with your business. No upfront costs, no long-term
              contracts. Just results that scale naturally.
            </motion.p>

            {/* Feature List - Improved visibility */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid sm:grid-cols-2 gap-3 mb-8"
            >
              {["24-hour first preview", "Built on Next.js", "Mobile-first design", "Cancel anytime"].map(
                (feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-800 font-medium">{feature}</span>
                  </div>
                ),
              )}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                asChild
              >
                <Link href="/auth">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-400 hover:border-green-500 hover:bg-green-50 text-gray-800 hover:text-green-800 px-8 py-6 text-lg rounded-xl transition-all duration-300 font-semibold"
                asChild
              >
                <Link href="#pricing">View Pricing</Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-12 pt-8 border-t border-gray-300"
            >
              <p className="text-sm text-gray-600 mb-4 font-medium">Trusted by businesses worldwide</p>
              <div className="flex items-center space-x-8 opacity-70">
                <Image
                  src="/nextjs-logo.png"
                  alt="Next.js"
                  width={60}
                  height={30}
                  className="h-6 w-auto object-contain"
                />
                <Image
                  src="/vercel-logo.png"
                  alt="Vercel"
                  width={60}
                  height={30}
                  className="h-6 w-auto object-contain"
                />
                <Image
                  src="/tailwind-logo.png"
                  alt="Tailwind"
                  width={60}
                  height={30}
                  className="h-6 w-auto object-contain"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Main Hero Image */}
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-orange-400/20 rounded-3xl blur-3xl transform rotate-6"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                <Image
                  src="/iguana-hero.png"
                  alt="Professional Website Design"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-2xl"
                  priority
                />

                {/* Floating Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-800">Live & Growing</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center space-x-2">
                    <Rocket className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-semibold text-gray-800">Fast Deploy</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center cursor-pointer hover:border-green-500 transition-colors"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="w-1 h-3 bg-gray-500 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
