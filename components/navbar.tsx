"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    href: "/",
    label: "Home",
    featured: false,
  },
  {
    href: "/about",
    label: "About",
    featured: false,
  },
  {
    href: "/services",
    label: "Services",
    featured: false,
    submenu: [
      { href: "/services#one-pager", label: "One-Page Sites" },
      { href: "/services#informational", label: "Business Sites" },
      { href: "/services#ecommerce", label: "E-commerce" },
      { href: "/services#custom", label: "Custom Solutions" },
    ],
  },
  {
    href: "/contact",
    label: "Contact",
    featured: false,
  },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById("mobile-menu")
      const menuButton = document.getElementById("mobile-menu-button")

      if (
        isMobileMenuOpen &&
        mobileMenu &&
        menuButton &&
        !mobileMenu.contains(event.target as Node) &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false)
        setActiveSubmenu(null)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isMobileMenuOpen])

  const toggleSubmenu = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveSubmenu(activeSubmenu === index ? null : index)
  }

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (isMobileMenuOpen) {
      setActiveSubmenu(null)
    }
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="font-plus-jakarta font-extrabold text-2xl md:text-3xl gradient-text">
            WebFlow Pro
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div key={item.href} className="relative group">
                {item.submenu ? (
                  <button
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium rounded-md group-hover:bg-gray-50 flex items-center"
                    onClick={(e) => toggleSubmenu(index, e)}
                  >
                    {item.label}
                    <ChevronDown
                      className={`ml-1 w-4 h-4 transition-transform ${activeSubmenu === index ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium rounded-md hover:bg-gray-50 ${
                      item.featured ? "text-blue-600" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Submenu */}
                {item.submenu && (
                  <AnimatePresence>
                    {activeSubmenu === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                      >
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => setActiveSubmenu(null)}
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}

            <Link href="/auth" className="ml-4">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-button"
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              className="md:hidden bg-white border-t"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item, index) => (
                  <div key={item.href}>
                    {item.submenu ? (
                      <>
                        <button
                          className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md flex justify-between items-center"
                          onClick={(e) => toggleSubmenu(index, e)}
                        >
                          {item.label}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${activeSubmenu === index ? "rotate-180" : ""}`}
                          />
                        </button>

                        <AnimatePresence>
                          {activeSubmenu === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 space-y-1 mt-1"
                            >
                              {item.submenu.map((subitem) => (
                                <Link
                                  key={subitem.href}
                                  href={subitem.href}
                                  className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {subitem.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md ${
                          item.featured ? "text-blue-600 font-medium" : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="px-3 py-3">
                  <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">Get Started</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
