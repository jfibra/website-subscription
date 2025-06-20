"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Mail, Clock, Users } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function WizardSuccessPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-white to-orange-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className="shadow-2xl border-2 border-gray-100 overflow-hidden">
              {/* Success Header */}
              <div className="bg-gradient-to-r from-iguana-500 to-orange-500 text-white p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-4xl font-bold mb-4"
                >
                  🎉 Website Request Submitted Successfully!
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="text-xl text-white/90"
                >
                  Thank you for choosing Site Iguana! We're excited to bring your vision to life.
                </motion.p>
              </div>

              <CardContent className="p-12">
                {/* What Happens Next */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Happens Next?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">1. Email Confirmation</h3>
                      <p className="text-gray-600">
                        You'll receive a confirmation email within the next few minutes with your request details.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1, duration: 0.6 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-iguana-500 to-iguana-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">2. Review & Proposal</h3>
                      <p className="text-gray-600">
                        Our team will review your request and send you a detailed proposal within 24 hours.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3, duration: 0.6 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">3. Let's Build!</h3>
                      <p className="text-gray-600">
                        Once approved, we'll start building your amazing website and keep you updated throughout.
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Important Information */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">📧 Check Your Email</h3>
                  <p className="text-gray-700 mb-4">
                    We've sent a confirmation email with your request details and a unique reference number. If you
                    don't see it in your inbox, please check your spam folder.
                  </p>
                  <p className="text-gray-700">
                    <strong>Need to make changes?</strong> No problem! Just reply to the confirmation email or contact
                    our support team.
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-iguana-500 to-orange-500 hover:from-iguana-600 hover:to-orange-600 text-white font-bold text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="/user/dashboard">
                      Return to Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4 border-2">
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </motion.div>

                {/* Additional Help */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 0.6 }}
                  className="text-center mt-8 pt-8 border-t border-gray-200"
                >
                  <p className="text-gray-600">
                    Questions? Need help? We're here for you!{" "}
                    <Link href="/contact" className="text-iguana-600 hover:text-iguana-700 font-semibold">
                      Contact our support team
                    </Link>
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
