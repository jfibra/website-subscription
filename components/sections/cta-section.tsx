"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-700 to-purple-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-plus-jakarta font-bold text-4xl md:text-6xl mb-6">Launch Your Website Today</h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Join hundreds of businesses who trust us with their online presence. Start with just $39/month.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/auth">
                Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 border-white hover:bg-white hover:text-blue-600 text-blue-600"
              asChild
            >
              <Link href="/contact">Talk to Us First</Link>
            </Button>
          </div>

          <div className="mt-8 text-sm opacity-75">
            ✨ No contracts • 🚀 Cancel anytime • 💳 First preview in 24 hours
          </div>
        </motion.div>
      </div>
    </section>
  )
}
