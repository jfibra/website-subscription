"use client"

import { motion } from "framer-motion"
import { Zap, Shield, Search, Headphones, CreditCard, Smartphone } from "lucide-react"

const benefits = [
  {
    icon: Zap,
    title: "Built on Next.js",
    description: "Lightning-fast performance with modern React framework and server-side rendering.",
  },
  {
    icon: Shield,
    title: "Free SSL & Hosting",
    description: "Secure hosting with SSL certificates included. Your site is safe and trusted.",
  },
  {
    icon: Search,
    title: "SEO Optimized",
    description: "Built-in SEO best practices to help your site rank higher in search results.",
  },
  {
    icon: CreditCard,
    title: "No Upfront Costs",
    description: "Start with just a small setup fee. No large upfront investments required.",
  },
  {
    icon: Headphones,
    title: "Ongoing Support",
    description: "Monthly updates and changes included. We're here to help your site evolve.",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Every site is designed mobile-first and looks perfect on all devices.",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-20 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-plus-jakarta font-extrabold text-4xl md:text-6xl mb-6">
            Why Choose Our <span className="gradient-text">Subscription Model</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get all the benefits of a professional website without the traditional hassles and costs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 shadow-md">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-plus-jakarta font-bold text-xl mb-4">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
