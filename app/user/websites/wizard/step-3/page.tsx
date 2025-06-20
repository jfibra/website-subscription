"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, Layout, ShoppingCart, Mail, Users, FileText, Camera, MessageSquare } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function WizardStep3Page() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    pages: [] as string[],
    features: [] as string[],
    integrations: [] as string[],
  })

  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem("websiteWizardData")
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setFormData((prev) => ({ ...prev, ...parsed.step3 }))
    }
  }, [])

  useEffect(() => {
    // Check if form is valid - at least one page selected
    setIsValid(formData.pages.length > 0)
  }, [formData])

  const handleNext = () => {
    // Save data to localStorage
    const existingData = JSON.parse(localStorage.getItem("websiteWizardData") || "{}")
    const updatedData = {
      ...existingData,
      step3: formData,
      currentStep: 4,
    }
    localStorage.setItem("websiteWizardData", JSON.stringify(updatedData))
    router.push("/user/websites/wizard/step-4")
  }

  const handlePageToggle = (pageValue: string) => {
    setFormData((prev) => ({
      ...prev,
      pages: prev.pages.includes(pageValue) ? prev.pages.filter((p) => p !== pageValue) : [...prev.pages, pageValue],
    }))
  }

  const handleFeatureToggle = (featureValue: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(featureValue)
        ? prev.features.filter((f) => f !== featureValue)
        : [...prev.features, featureValue],
    }))
  }

  const handleIntegrationToggle = (integrationValue: string) => {
    setFormData((prev) => ({
      ...prev,
      integrations: prev.integrations.includes(integrationValue)
        ? prev.integrations.filter((i) => i !== integrationValue)
        : [...prev.integrations, integrationValue],
    }))
  }

  const essentialPages = [
    { value: "home", label: "Home Page", description: "Your main landing page", icon: Layout },
    { value: "about", label: "About Us", description: "Tell your story and mission", icon: Users },
    { value: "services", label: "Services/Products", description: "What you offer", icon: ShoppingCart },
    { value: "contact", label: "Contact", description: "How to reach you", icon: Mail },
  ]

  const additionalPages = [
    { value: "blog", label: "Blog", description: "Share news and insights", icon: FileText },
    { value: "gallery", label: "Gallery/Portfolio", description: "Showcase your work", icon: Camera },
    { value: "testimonials", label: "Testimonials", description: "Customer reviews", icon: MessageSquare },
    { value: "faq", label: "FAQ", description: "Frequently asked questions", icon: MessageSquare },
    { value: "team", label: "Team", description: "Meet your team", icon: Users },
    { value: "pricing", label: "Pricing", description: "Your pricing plans", icon: ShoppingCart },
  ]

  const websiteFeatures = [
    { value: "contact-form", label: "Contact Form", description: "Let visitors get in touch" },
    { value: "newsletter", label: "Newsletter Signup", description: "Build your email list" },
    { value: "social-media", label: "Social Media Links", description: "Connect your social profiles" },
    { value: "google-maps", label: "Google Maps", description: "Show your location" },
    { value: "live-chat", label: "Live Chat", description: "Real-time customer support" },
    { value: "booking-system", label: "Booking System", description: "Online appointments" },
    { value: "e-commerce", label: "Online Store", description: "Sell products online" },
    { value: "member-login", label: "Member Login", description: "User accounts and login" },
  ]

  const integrationOptions = [
    { value: "google-analytics", label: "Google Analytics", description: "Track website performance" },
    { value: "facebook-pixel", label: "Facebook Pixel", description: "Track conversions" },
    { value: "mailchimp", label: "Mailchimp", description: "Email marketing" },
    { value: "stripe", label: "Stripe", description: "Payment processing" },
    { value: "paypal", label: "PayPal", description: "Payment processing" },
    { value: "calendly", label: "Calendly", description: "Online scheduling" },
    { value: "hubspot", label: "HubSpot", description: "CRM integration" },
    { value: "zapier", label: "Zapier", description: "Automation workflows" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-white to-orange-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-6 border-2 hover:bg-iguana-50">
            <Link href="/user/websites/wizard/step-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>

          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-iguana-600">Step 3 of 5</span>
              <span className="text-sm text-gray-500">Features & Pages</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-iguana-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="shadow-2xl border-2 border-gray-100">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-iguana-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Layout className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-4xl font-bold text-gray-900 mb-4">Choose Your Features</CardTitle>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Select the pages and features you want on your website. You can always add more later.
                </p>
              </CardHeader>
              <CardContent className="p-12">
                <div className="space-y-12">
                  {/* Essential Pages */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Essential Pages *</h3>
                    <p className="text-gray-600 mb-6">These are the core pages most websites need</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {essentialPages.map((page) => (
                        <div
                          key={page.value}
                          onClick={() => handlePageToggle(page.value)}
                          className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                            formData.pages.includes(page.value)
                              ? "border-iguana-500 bg-iguana-50 shadow-lg"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-iguana-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <page.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-bold text-lg text-gray-900">{page.label}</h4>
                                <Checkbox
                                  checked={formData.pages.includes(page.value)}
                                  onChange={() => handlePageToggle(page.value)}
                                  className="pointer-events-none"
                                />
                              </div>
                              <p className="text-gray-600">{page.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Pages */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Additional Pages</h3>
                    <p className="text-gray-600 mb-6">Optional pages to enhance your website</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {additionalPages.map((page) => (
                        <div
                          key={page.value}
                          onClick={() => handlePageToggle(page.value)}
                          className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                            formData.pages.includes(page.value)
                              ? "border-iguana-500 bg-iguana-50 shadow-lg"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <page.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-bold text-gray-900">{page.label}</h4>
                                <Checkbox
                                  checked={formData.pages.includes(page.value)}
                                  onChange={() => handlePageToggle(page.value)}
                                  className="pointer-events-none"
                                />
                              </div>
                              <p className="text-gray-600 text-sm">{page.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Website Features */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Website Features</h3>
                    <p className="text-gray-600 mb-6">Interactive features to engage your visitors</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {websiteFeatures.map((feature) => (
                        <div
                          key={feature.value}
                          onClick={() => handleFeatureToggle(feature.value)}
                          className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                            formData.features.includes(feature.value)
                              ? "border-iguana-500 bg-iguana-50 shadow-lg"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900 mb-2">{feature.label}</h4>
                              <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                            <Checkbox
                              checked={formData.features.includes(feature.value)}
                              onChange={() => handleFeatureToggle(feature.value)}
                              className="pointer-events-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Integrations */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Third-Party Integrations</h3>
                    <p className="text-gray-600 mb-6">Connect your website with popular tools and services</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {integrationOptions.map((integration) => (
                        <div
                          key={integration.value}
                          onClick={() => handleIntegrationToggle(integration.value)}
                          className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                            formData.integrations.includes(integration.value)
                              ? "border-iguana-500 bg-iguana-50 shadow-lg"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900 mb-2">{integration.label}</h4>
                              <p className="text-gray-600 text-sm">{integration.description}</p>
                            </div>
                            <Checkbox
                              checked={formData.integrations.includes(integration.value)}
                              onChange={() => handleIntegrationToggle(integration.value)}
                              className="pointer-events-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t-2 border-gray-100">
                  <Button variant="outline" asChild className="text-lg px-8 py-4 border-2">
                    <Link href="/user/websites/wizard/step-2">
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </Link>
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!isValid}
                    className="bg-gradient-to-r from-iguana-500 to-orange-500 hover:from-iguana-600 hover:to-orange-600 text-white font-bold text-lg px-12 py-4 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
