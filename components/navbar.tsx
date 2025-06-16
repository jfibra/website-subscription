"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createSupabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

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
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Get user session and profile
  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)

        if (session?.user) {
          const { data: profile } = await supabase
            .from("users")
            .select("first_name, last_name, profile_image")
            .eq("id", session.user.id)
            .single()
          setUserProfile(profile)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (!session?.user) {
        setUserProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/auth")
      router.refresh()
    } catch (error) {
      console.error("Error logging out:", error)
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

            {/* User Authentication */}
            {!isLoading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full ml-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={userProfile?.profile_image || ""} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {userProfile?.first_name?.[0] || user.email?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">
                            {userProfile?.first_name} {userProfile?.last_name}
                          </p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/user/dashboard" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/user/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/auth" className="ml-4">
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all">
                      Get Started
                    </Button>
                  </Link>
                )}
              </>
            )}
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

                {/* Mobile User Menu */}
                {!isLoading && (
                  <div className="border-t pt-3 mt-3">
                    {user ? (
                      <>
                        <div className="px-3 py-2 text-sm text-gray-600">
                          {userProfile?.first_name} {userProfile?.last_name}
                          <br />
                          <span className="text-xs">{user.email}</span>
                        </div>
                        <Link
                          href="/user/dashboard"
                          className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/user/profile"
                          className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsMobileMenuOpen(false)
                          }}
                          className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <div className="px-3 py-3">
                        <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">Get Started</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
