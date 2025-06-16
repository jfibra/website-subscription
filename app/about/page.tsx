"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Users, Target, Code, Heart } from "lucide-react"

const techStack = [
  { name: "Next.js", logo: "/nextjs-logo.png" },
  { name: "Tailwind CSS", logo: "/tailwind-logo.png" },
  { name: "Vercel", logo: "/vercel-logo.png" },
  { name: "Framer Motion", logo: "/framer-motion-logo.png" },
  { name: "Stripe", logo: "/stripe-logo.png" },
]

const values = [
  {
    icon: Users,
    title: "Client-Focused",
    description: "Every decision we make is centered around delivering value to our clients.",
  },
  {
    icon: Target,
    title: "Results-Driven",
    description: "We measure success by the growth and success of your business online.",
  },
  {
    icon: Code,
    title: "Modern Technology",
    description: "We use cutting-edge tools to build fast, secure, and scalable websites.",
  },
  {
    icon: Heart,
    title: "Passionate Team",
    description: "We love what we do and it shows in every website we create.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-plus-jakarta font-extrabold text-4xl md:text-6xl mb-6">
              About <span className="gradient-text">WebFlow Pro</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to make professional websites accessible to every business, regardless of size or
              budget.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="font-plus-jakarta font-extrabold text-3xl md:text-5xl mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                Traditional web development is expensive, time-consuming, and often leaves businesses with outdated
                sites they can't easily update. We believe every business deserves a modern, professional website that
                grows with them.
              </p>
              <p className="text-lg text-gray-600">
                That's why we created a subscription model that makes high-quality websites accessible through
                affordable monthly payments, complete with ongoing support and regular updates.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Image
                src="/website-team-collaboration.png"
                alt="Team working"
                width={600}
                height={500}
                className="rounded-xl shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-plus-jakarta font-extrabold text-3xl md:text-5xl mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and every website we create.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-lg text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-plus-jakarta font-bold text-xl mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-plus-jakarta font-extrabold text-3xl md:text-5xl mb-6">
              Why We Use <span className="gradient-text">Next.js</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              We chose Next.js because it delivers the perfect combination of performance, SEO optimization, and
              developer experience. Your website loads faster, ranks better, and provides an exceptional user
              experience.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <Image
                  src={tech.logo || `/placeholder.svg?height=60&width=60&query=${encodeURIComponent(tech.name)} logo`}
                  alt={tech.name}
                  width={60}
                  height={60}
                  className="mb-3 grayscale hover:grayscale-0 transition-all duration-300"
                />
                <span className="text-sm font-medium text-gray-600">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
