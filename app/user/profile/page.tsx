"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { uploadWebsiteAsset } from "@/lib/supabase/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Phone, Building, Upload, Save } from "lucide-react"
import { motion } from "framer-motion"
import type { SupabaseClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic" // Corrected: hyphen instead of underscore

export default function UserProfilePage() {
  const { toast } = useToast()

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null) // State for Supabase client
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    profile_image: "",
  })
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    // Initialize Supabase client only on the client side after component mounts
    setSupabase(getSupabaseBrowserClient())
  }, [])

  useEffect(() => {
    async function fetchUserProfile() {
      if (!supabase) return // Wait for Supabase client to be initialized

      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)
        const { data, error } = await supabase
          .from("users")
          .select("first_name, last_name, phone_number, company_name, profile_image")
          .eq("id", user.id)
          .single()

        if (error) {
          toast({
            title: "Error",
            description: `Failed to load profile: ${error.message}`,
            variant: "destructive",
          })
        } else if (data) {
          setProfile({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: user.email || "", // Email comes from auth.user
            phone_number: data.phone_number || "",
            company_name: data.company_name || "",
            profile_image: data.profile_image || "",
          })
          setImagePreview(data.profile_image)
        }
      } else {
        toast({
          title: "Authentication Error",
          description: "User not logged in.",
          variant: "destructive",
        })
      }
      setLoading(false)
    }
    fetchUserProfile()
  }, [supabase, toast]) // Add supabase to dependency array

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImageFile(null)
      setImagePreview(profile.profile_image) // Revert to existing image if no new file
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!userId || !supabase) {
      toast({
        title: "Error",
        description: "User ID or Supabase client not found. Please log in again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    let newProfileImageUrl = profile.profile_image

    if (imageFile) {
      const { publicUrl, error: uploadError } = await uploadWebsiteAsset(imageFile, userId, "profile", "profile_image")
      if (uploadError) {
        toast({
          title: "Upload Failed",
          description: `Failed to upload profile image: ${uploadError.message}`,
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }
      newProfileImageUrl = publicUrl || ""
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number || null,
        company_name: profile.company_name || null,
        profile_image: newProfileImageUrl,
      })
      .eq("id", userId)

    if (updateError) {
      toast({
        title: "Update Failed",
        description: `Failed to update profile: ${updateError.message}`,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      })
      setProfile((prev) => ({ ...prev, profile_image: newProfileImageUrl })) // Update state with new URL
      setImageFile(null) // Clear file input after successful upload
    }
    setIsSubmitting(false)
  }

  if (loading || !supabase) {
    return (
      <div className="min-h-screen pt-16 gradient-bg flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 gradient-bg flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full mx-4"
      >
        <Card className="shadow-xl rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="font-plus-jakarta font-extrabold text-3xl mb-2">My Profile</CardTitle>
            <p className="text-gray-600">Update your personal and company information.</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-24 h-24 border-2 border-blue-200 shadow-md">
                  <AvatarImage
                    src={imagePreview || "/placeholder.svg?height=96&width=96&query=user profile"}
                    alt="Profile Picture"
                  />
                  <AvatarFallback>
                    {profile.first_name ? profile.first_name[0] : "U"}
                    {profile.last_name ? profile.last_name[0] : "P"}
                  </AvatarFallback>
                </Avatar>
                <Label
                  htmlFor="profileImage"
                  className="cursor-pointer flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Profile Image
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={profile.first_name}
                      onChange={handleInputChange}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={profile.last_name}
                      onChange={handleInputChange}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    className="pl-9 bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed here.</p>
              </div>

              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={profile.phone_number}
                    onChange={handleInputChange}
                    className="pl-9"
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <div className="relative mt-1">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="company_name"
                    name="company_name"
                    type="text"
                    value={profile.company_name}
                    onChange={handleInputChange}
                    className="pl-9"
                    placeholder="Your Company Inc."
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
                {!isSubmitting && <Save className="ml-2 w-4 h-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
