"use client"

import { motion } from "framer-motion"
import { Check, Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const services = [
  {
    name: "One-Pager Website",
    price: "$39/month",
    setup: "$49 setup",
    description: "Perfect for events, freelancers, and simple business needs",
    features: [
      "Single responsive landing page",
      "Contact form integration",
      "Social media links",
      "Basic SEO optimization",
      "SSL certificate included",
      "Mobile-first design",
      "3 monthly content edits",
      "24-hour preview delivery",
    ],
    idealFor: ["Event promotion", "Freelancer portfolios", "Simple business cards", "Product launches"],
  },
  {
    name: "Informational Website",
    price: "$59/month",
    setup: "$99 setup",
    description: "Ideal for small businesses wanting to establish online presence",
    features: [
      "3-5 professional pages",
      "Advanced contact forms",
      "Google Maps integration",
      "Image galleries",
      "Testimonials section",
      "Basic blog functionality",
      "3 monthly content edits",
      "Google Analytics setup",
    ],
    idealFor: ["Local businesses", "Service providers", "Consultants", "Small retailers"],
  },
  {
    name: "Multi-Page Website",
    price: "$89/month",
    setup: "$129 setup",
    description: "Comprehensive solution for growing companies",
    features: [
      "6-10 custom pages",
      "Advanced SEO optimization",
      "Blog with CMS",
      "Newsletter integration",
      "Advanced analytics",
      "Social media integration",
      "5 monthly content edits",
      "Priority support",
    ],
    idealFor: ["Growing businesses", "Professional services", "Content creators", "Agencies"],
  },
  {
    name: "E-commerce Website",
    price: "$129/month",
    setup: "$199 setup",
    description: "Complete online store with payment processing",
    features: [
      "Product catalog management",
      "Shopping cart functionality",
      "Secure payment processing",
      "Inventory management",
      "Order tracking system",
      "Customer account portal",
      "5 monthly updates",
      "E-commerce analytics",
    ],
    idealFor: ["Online retailers", "Product sellers", "Subscription services", "Digital products"],
  },
  {
    name: "Custom Website",
    price: "From $159/month",
    setup: "Quote-based",
    description: "Tailored solutions for unique business requirements",
    features: [
      "Custom functionality development",
      "Database integration",
      "User authentication systems",
      "API integrations",
      "Advanced features",
      "Dedicated support",
      "Unlimited monthly updates",
      "Custom reporting",
    ],
    idealFor: ["SaaS platforms", "Booking systems", "Membership sites", "Complex workflows"],
  },
]

const customExamples = [
  "Booking and reservation platforms",
  "Membership and subscription portals",
  "Job boards and career sites",
  "Customer dashboards and CRM systems",
  "Online forms and automation tools",
  "Learning management systems",
  "Event management platforms",
  "Real estate listing sites",
]

const addOns = [
  {
    name: "Advanced SEO Package",
    price: "$29/month",
    description: "Comprehensive SEO optimization and monthly reports",
  },
  {
    name: "Logo Design",
    price: "$199 one-time",
    description: "Professional logo design with 3 concepts and revisions",
  },
  {
    name: "Booking System Integration",
    price: "$49/month",
    description: "Calendar booking system with payment processing",
  },
  {
    name: "Social Media Integration",
    price: "$19/month",
    description: "Advanced social media feeds and sharing tools",
  },
  { name: "Email Marketing Setup", price: "$39/month", description: "Newsletter system with automation and analytics" },
  { name: "Priority Support", price: "$29/month", description: "24-hour response time and phone support" },
]

const faqs = [
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your website will remain live until the end of your current billing period.",
  },
  {
    question: "What types of edits are included in my monthly allowance?",
    answer:
      "Monthly edits include text changes, image updates, minor layout adjustments, adding new content sections, and updating contact information. Major redesigns or new page additions may require upgrading your plan.",
  },
  {
    question: "How long does the initial setup take?",
    answer:
      "You'll receive your first website preview within 24 hours of completing our questionnaire. Once approved, your site goes live immediately. The entire process typically takes 2-3 business days.",
  },
  {
    question: "Do you provide hosting and domain services?",
    answer:
      "Yes, hosting is included in all plans with SSL certificates. We can help you purchase a domain or connect your existing domain to your new website at no additional cost.",
  },
  {
    question: "What happens if I need more edits than my plan allows?",
    answer:
      "Additional edits can be purchased at $25 per edit, or you can upgrade to a higher plan for more monthly edits. We'll always discuss options with you before any additional charges.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle. We'll help ensure a smooth transition.",
  },
]

export default function ServicesPage() {
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
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From simple landing pages to complex custom platforms, we have the perfect solution for your business
              needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full rounded-xl shadow-md hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="font-plus-jakarta text-2xl mb-2">{service.name}</CardTitle>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-blue-600">{service.price}</div>
                      <div className="text-sm text-gray-500">{service.setup}</div>
                    </div>
                    <p className="text-gray-600">{service.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Features Included:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Ideal For:</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.idealFor.map((item, itemIndex) => (
                          <span key={itemIndex} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full" asChild>
                      <Link href="/auth">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Projects Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-plus-jakarta font-extrabold text-3xl md:text-5xl mb-6">Custom Projects We Build</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our custom plan covers any type of web application or platform your business needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {customExamples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  <Plus className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{example}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-plus-jakarta font-extrabold text-3xl md:text-5xl mb-6">Optional Add-ons</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enhance your website with these additional services and features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-plus-jakarta font-bold text-lg">{addon.name}</h3>
                  <span className="text-blue-600 font-bold">{addon.price}</span>
                </div>
                <p className="text-gray-600 text-sm">{addon.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-plus-jakarta font-extrabold text-3xl md:text-5xl mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Get answers to common questions about our services and process.</p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-md"
              >
                <h3 className="font-plus-jakarta font-bold text-lg mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-plus-jakarta font-extrabold text-3xl md:text-5xl mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">Choose your plan and get your website preview within 24 hours.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/auth">
                  Start Your Website <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600"
                asChild
              >
                <Link href="/contact">Ask Questions First</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
