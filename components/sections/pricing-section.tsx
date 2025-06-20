"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, Star } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Perfect for small businesses and personal brands",
    features: [
      "Custom Next.js website",
      "Mobile-responsive design",
      "Basic SEO optimization",
      "SSL certificate included",
      "3 pages included",
      "Contact form integration",
      "Monthly updates (3 requests)",
      "Email support",
    ],
    popular: false,
    cta: "Get Started",
    color: "border-gray-200",
  },
  {
    name: "Professional",
    price: "$199",
    period: "/month",
    description: "Ideal for growing businesses with advanced needs",
    features: [
      "Everything in Starter",
      "Up to 10 pages",
      "Advanced SEO optimization",
      "Google Analytics setup",
      "Social media integration",
      "Blog/CMS integration",
      "Weekly updates (6 requests)",
      "Priority email support",
      "Performance monitoring",
    ],
    popular: true,
    cta: "Most Popular",
    color: "border-green-500 ring-2 ring-green-500 ring-opacity-50",
  },
  {
    name: "Enterprise",
    price: "$399",
    period: "/month",
    description: "For established businesses requiring premium features",
    features: [
      "Everything in Professional",
      "Unlimited pages",
      "E-commerce integration",
      "Custom functionality",
      "API integrations",
      "Advanced analytics",
      "Unlimited updates",
      "24/7 phone support",
      "Dedicated account manager",
      "Custom domain management",
    ],
    popular: false,
    cta: "Contact Sales",
    color: "border-gray-200",
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your business. All plans include hosting, SSL, and ongoing maintenance.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${plan.color} ${
                plan.popular ? "transform lg:scale-105" : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-xl text-gray-500 ml-1">{plan.period}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full py-6 text-lg font-semibold rounded-xl transition-all duration-300 ${
                    plan.popular
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300"
                  }`}
                  asChild
                >
                  <Link href="/auth">{plan.cta}</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-4">
            All plans include a 30-day money-back guarantee. No setup fees, cancel anytime.
          </p>
          <p className="text-sm text-gray-500">
            Need a custom solution?{" "}
            <Link href="/contact" className="text-green-600 hover:text-green-700 font-medium">
              Contact us
            </Link>{" "}
            for enterprise pricing.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
