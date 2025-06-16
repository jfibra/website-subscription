"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Check, Star, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useState, useRef } from "react"

const plans = [
  {
    name: "One-Pager",
    description: "Perfect for events and freelancers",
    monthlyFee: 39,
    setupFee: 49,
    edits: 3,
    features: [
      "Single landing page",
      "Mobile responsive",
      "Basic SEO",
      "SSL & hosting included",
      "3 monthly edits",
      "24hr preview delivery",
    ],
    popular: false,
  },
  {
    name: "Informational",
    description: "Ideal for small businesses",
    monthlyFee: 59,
    setupFee: 99,
    edits: 3,
    features: [
      "3-5 pages",
      "Contact forms",
      "Google Maps integration",
      "Social media links",
      "Basic analytics",
      "Monthly content updates",
    ],
    popular: true,
  },
  {
    name: "Multi-Page",
    description: "For growing companies",
    monthlyFee: 89,
    setupFee: 129,
    edits: 5,
    features: [
      "6-10 pages",
      "Advanced SEO",
      "Blog functionality",
      "Newsletter signup",
      "Advanced analytics",
      "Priority support",
    ],
    popular: false,
  },
  {
    name: "E-commerce",
    description: "Complete online stores",
    monthlyFee: 129,
    setupFee: 199,
    edits: 5,
    features: [
      "Product catalog",
      "Shopping cart",
      "Payment processing",
      "Inventory management",
      "Order tracking",
      "Customer accounts",
    ],
    popular: false,
  },
  {
    name: "Custom",
    description: "Dashboards, booking systems & more",
    monthlyFee: 159,
    setupFee: "Quote",
    edits: "Unlimited",
    features: [
      "Custom functionality",
      "Database integration",
      "User authentication",
      "API integrations",
      "Advanced features",
      "Dedicated support",
    ],
    popular: false,
  },
]

export function PricingSection() {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95])

  return (
    <section id="pricing" ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 noise-bg z-0"></div>
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 to-transparent z-0"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent z-0"></div>

      <motion.div style={{ opacity, scale }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-4">
            Flexible Plans
          </span>
          <h2 className="font-plus-jakarta font-extrabold text-4xl md:text-6xl mb-6">
            Simple <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your business. All plans include hosting, SSL, and ongoing support.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center shadow-md">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <Card
                className={`h-full rounded-xl transition-all duration-500 ${
                  hoveredPlan === index ? "shadow-2xl transform -translate-y-2" : "shadow-md hover:shadow-xl"
                } ${plan.popular ? "gradient-border shadow-xl" : ""}`}
              >
                <CardHeader className="text-center pb-4">
                  <CardTitle className="font-plus-jakarta text-2xl mb-2">{plan.name}</CardTitle>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold">
                      ${plan.monthlyFee}
                      <span className="text-lg font-normal text-gray-600">/mo</span>
                    </div>
                    <div className="text-sm text-gray-500">Setup: ${plan.setupFee}</div>
                    <div className="text-sm text-blue-600 font-medium">{plan.edits} monthly edits</div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: hoveredPlan === index || hoveredPlan === null ? 1 : 0.7,
                          x: 0,
                        }}
                        transition={{ duration: 0.3, delay: featureIndex * 0.05 }}
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        : "bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50"
                    }`}
                    asChild
                  >
                    <Link href="/auth">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link href="/services#faq" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            Have questions about our plans?
            <ChevronDown className="ml-1 w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
