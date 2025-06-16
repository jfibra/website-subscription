"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { FileText, Eye, Rocket, Edit } from "lucide-react"

const steps = [
  {
    icon: FileText,
    title: "Fill Out Questionnaire",
    description: "Tell us about your business, goals, and design preferences through our simple form.",
  },
  {
    icon: Eye,
    title: "Get Preview in 24 Hours",
    description: "Receive a complete preview of your website within one business day.",
  },
  {
    icon: Rocket,
    title: "Subscribe & Go Live",
    description: "Choose your plan, and we'll launch your site immediately.",
  },
  {
    icon: Edit,
    title: "Monthly Updates",
    description: "Request 3-5 changes monthly depending on your plan. We handle the rest.",
  },
]

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95])

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white z-0"></div>
      <div className="absolute inset-0 dot-pattern opacity-30 z-0"></div>
      <div className="absolute inset-0 noise-bg z-0"></div>

      {/* Animated Path */}
      <div className="absolute left-1/2 top-32 bottom-32 w-1 bg-gradient-to-b from-blue-100 via-blue-500 to-purple-500 hidden lg:block z-0"></div>

      <motion.div style={{ opacity, scale }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-4">
            Simple Process
          </span>
          <h2 className="font-plus-jakarta font-extrabold text-4xl md:text-6xl mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From concept to launch in just 4 simple steps. No technical knowledge required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300">
                  <step.icon className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg font-bold text-blue-600 shadow-lg border-2 border-blue-100">
                  {index + 1}
                </div>

                {/* Connector Line (visible on mobile) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 bottom-0 transform translate-y-full -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-transparent lg:hidden"></div>
                )}
              </div>

              <div className="text-center px-4 py-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full glass-effect">
                <h3 className="font-plus-jakarta font-bold text-xl mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>

              {/* Connector Line (visible on desktop) */}
              {index < steps.length - 1 && (
                <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-full h-1 bg-gradient-to-r from-blue-400 to-transparent hidden lg:block"></div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
