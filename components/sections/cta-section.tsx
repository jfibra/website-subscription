"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-green-900 to-gray-800"></div>
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.3) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-plus-jakarta font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-white">
            Launch Your Website Today
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-100 leading-relaxed">
            Join hundreds of businesses who trust us with their online presence. Start with just $39/month.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold"
              asChild
            >
              <Link href="/auth">
                Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 rounded-xl font-semibold"
              asChild
            >
              <Link href="/contact">Talk to Us First</Link>
            </Button>
          </div>

          <div className="mt-8 text-sm text-gray-300">
            ✨ No contracts • 🚀 Cancel anytime • 💳 First preview in 24 hours
          </div>
        </motion.div>
      </div>
    </section>
  )
}
