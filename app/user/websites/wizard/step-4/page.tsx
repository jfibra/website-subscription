"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Upload, FileText, ImageIcon } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function WizardStep4Page() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    contentReady: "",
    logoFile: null as File | null,
    logoUrl: "",
    contentDescription: "",
    additionalImages: [] as File[],
    socialMediaLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
    },
    specialRequests: "",
    timeline: "",
    budget: "",
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(true) // This step is optional

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem("websiteWizardData")
    if (savedData) {
      const parsed = JSON.parse(savedData)
      if (parsed.step4) {
        setFormData((prev) => ({ ...prev, ...parsed.step4 }))
        if (parsed.step4.logoUrl) {
          setLogoPreview(parsed.step4.logoUrl)
        }
      }
    }
  }, [])

  const handleNext = () => {
    // Save data to localStorage
    const existingData = JSON.parse(localStorage.getItem("websiteWizardData") || "{}")
    const updatedData = {
      ...existingData,
      step4: formData,
      currentStep: 5,
    }
    localStorage.setItem("websiteWizardData", JSON.stringify(updatedData))
    router.push("/user/websites/wizard/step-5")
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, logoFile: file }))
      const previewUrl = URL.createObjectURL(file)
      setLogoPreview(previewUrl)
      setFormData((prev) => ({ ...prev, logoUrl: previewUrl }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({ ...prev, additionalImages: [...prev.additionalImages, ...files] }))
  }

  const contentOptions = [
    { value: "all-ready", label: "I have everything ready", description: "Logo, text, images, and content" },
    {
      value: "some-ready",
      label: "I have some content",
      description: "I have some materials but need help with others",
    },
    {
      value: "need-help",
      label: "I need help creating content",
      description: "Please help me create most of the content",
    },
    { value: "not-sure", label: "I'm not sure", description: "Let's discuss what I need" },
  ]

  const timelineOptions = [
    { value: "asap", label: "ASAP (Rush - 1-2 weeks)", description: "I need this completed urgently" },
    { value: "standard", label: "Standard (2-4 weeks)", description: "Normal timeline works for me" },
    { value: "relaxed", label: "Relaxed (4-8 weeks)", description: "I'm not in a hurry" },
    { value: "flexible", label: "Flexible", description: "Work around your schedule" },
  ]

  const budgetOptions = [
    { value: "basic", label: "Basic ($299-$599)", description: "Simple website with essential features" },
    { value: "standard", label: "Standard ($599-$999)", description: "Professional website with advanced features" },
    { value: "premium", label: "Premium ($999-$1999)", description: "Custom design with premium features" },
    { value: "enterprise", label: "Enterprise ($2000+)", description: "Complex website with custom development" },
    { value: "discuss", label: "Let's discuss", description: "I'd like to talk about pricing" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-white to-orange-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-6 border-2 hover:bg-iguana-50">
            <Link href="/user/websites/wizard/step-3">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>

          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-iguana-600">Step 4 of 5</span>
              <span className="text-sm text-gray-500">Content & Assets</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-iguana-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: "80%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="shadow-2xl border-2 border-gray-100">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-iguana-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-4xl font-bold text-gray-900 mb-4">Content & Assets</CardTitle>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Help us understand what content you have ready and what you need help creating.
                </p>
              </CardHeader>
              <CardContent className="p-12">
                <div className="space-y-12">
                  {/* Content Readiness */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">What content do you have ready?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {contentOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => setFormData((prev) => ({ ...prev, contentReady: option.value }))}
                          className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                            formData.contentReady === option.value
                              ? "border-iguana-500 bg-iguana-50 shadow-lg"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <h4 className="font-bold text-lg text-gray-900 mb-2">{option.label}</h4>
                          <p className="text-gray-600">{option.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Logo & Branding</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <Label htmlFor="logo" className="text-lg font-semibold text-gray-900 mb-3 block">
                          Upload Your Logo
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-iguana-400 transition-colors">
                          <input
                            type="file"
                            id="logo"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <label htmlFor="logo" className="cursor-pointer">
                            {logoPreview ? (
                              <div className="space-y-4">
                                <img
                                  src={logoPreview || "/placeholder.svg"}
                                  alt="Logo preview"
                                  className="max-h-32 mx-auto rounded-lg"
                                />
                                <p className="text-sm text-gray-600">Click to change logo</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                                <div>
                                  <p className="text-lg font-semibold text-gray-700">Upload your logo</p>
                                  <p className="text-sm text-gray-500">PNG, JPG, SVG up to 10MB</p>
                                </div>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="contentDescription" className="text-lg font-semibold text-gray-900 mb-3 block">
                          Describe Your Content
                        </Label>
                        <Textarea
                          id="contentDescription"
                          placeholder="Tell us about the content you have ready, what style you prefer, and any specific requirements..."
                          value={formData.contentDescription}
                          onChange={(e) => setFormData((prev) => ({ ...prev, contentDescription: e.target.value }))}
                          rows={6}
                          className="text-lg p-4 border-2 focus:border-iguana-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Images */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Additional Images</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-iguana-400 transition-colors">
                      <input
                        type="file"
                        id="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="images" className="cursor-pointer">
                        <div className="space-y-4">
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-lg font-semibold text-gray-700">Upload additional images</p>
                            <p className="text-sm text-gray-500">
                              Product photos, team photos, or any other images you want to include
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                    {formData.additionalImages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">{formData.additionalImages.length} image(s) selected</p>
                      </div>
                    )}
                  </div>

                  {/* Social Media Links */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Social Media Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="facebook" className="text-lg font-semibold text-gray-900 mb-3 block">
                          Facebook
                        </Label>
                        <Input
                          id="facebook"
                          placeholder="https://facebook.com/yourpage"
                          value={formData.socialMediaLinks.facebook}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              socialMediaLinks: { ...prev.socialMediaLinks, facebook: e.target.value },
                            }))
                          }
                          className="text-lg p-4 border-2 focus:border-iguana-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagram" className="text-lg font-semibold text-gray-900 mb-3 block">
                          Instagram
                        </Label>
                        <Input
                          id="instagram"
                          placeholder="https://instagram.com/yourpage"
                          value={formData.socialMediaLinks.instagram}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              socialMediaLinks: { ...prev.socialMediaLinks, instagram: e.target.value },
                            }))
                          }
                          className="text-lg p-4 border-2 focus:border-iguana-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter" className="text-lg font-semibold text-gray-900 mb-3 block">
                          Twitter/X
                        </Label>
                        <Input
                          id="twitter"
                          placeholder="https://twitter.com/yourpage"
                          value={formData.socialMediaLinks.twitter}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              socialMediaLinks: { ...prev.socialMediaLinks, twitter: e.target.value },
                            }))
                          }
                          className="text-lg p-4 border-2 focus:border-iguana-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin" className="text-lg font-semibold text-gray-900 mb-3 block">
                          LinkedIn
                        </Label>
                        <Input
                          id="linkedin"
                          placeholder="https://linkedin.com/company/yourcompany"
                          value={formData.socialMediaLinks.linkedin}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              socialMediaLinks: { ...prev.socialMediaLinks, linkedin: e.target.value },
                            }))
                          }
                          className="text-lg p-4 border-2 focus:border-iguana-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Timeline & Budget */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Timeline & Budget</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <Label className="text-lg font-semibold text-gray-900 mb-4 block">
                          When do you need this completed?
                        </Label>
                        <div className="space-y-4">
                          {timelineOptions.map((option) => (
                            <div
                              key={option.value}
                              onClick={() => setFormData((prev) => ({ ...prev, timeline: option.value }))}
                              className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                                formData.timeline === option.value
                                  ? "border-iguana-500 bg-iguana-50 shadow-lg"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <h4 className="font-bold text-gray-900 mb-1">{option.label}</h4>
                              <p className="text-gray-600 text-sm">{option.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-lg font-semibold text-gray-900 mb-4 block">
                          What's your budget range?
                        </Label>
                        <div className="space-y-4">
                          {budgetOptions.map((option) => (
                            <div
                              key={option.value}
                              onClick={() => setFormData((prev) => ({ ...prev, budget: option.value }))}
                              className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                                formData.budget === option.value
                                  ? "border-iguana-500 bg-iguana-50 shadow-lg"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <h4 className="font-bold text-gray-900 mb-1">{option.label}</h4>
                              <p className="text-gray-600 text-sm">{option.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Special Requests</h3>
                    <Textarea
                      placeholder="Any special requests, specific features, design inspirations, or anything else you'd like us to know..."
                      value={formData.specialRequests}
                      onChange={(e) => setFormData((prev) => ({ ...prev, specialRequests: e.target.value }))}
                      rows={4}
                      className="text-lg p-4 border-2 focus:border-iguana-500 resize-none w-full"
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t-2 border-gray-100">
                  <Button variant="outline" asChild className="text-lg px-8 py-4 border-2">
                    <Link href="/user/websites/wizard/step-3">
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </Link>
                  </Button>

                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-iguana-500 to-orange-500 hover:from-iguana-600 hover:to-orange-600 text-white font-bold text-lg px-12 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
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
