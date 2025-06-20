import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Globe,
  Plus,
  Edit3,
  MessageSquare,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  DollarSign,
  Settings,
  CreditCard,
  Sparkles,
  Zap,
  Target,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function UserDashboardPage() {
  const supabase = createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Fetch user profile
  const { data: userProfile } = await supabase
    .from("users")
    .select("first_name, last_name, profile_image, company_name")
    .eq("id", session.user.id)
    .single()

  // Fetch user websites with counts
  const { data: websites } = await supabase
    .from("websites")
    .select("id, title, status, live_url, preview_image_url, created_at, plan_id, plans(name)")
    .eq("user_id", session.user.id)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })

  // Fetch recent notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, message, created_at, is_read, category")
    .eq("user_id", session.user.id)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch recent transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, amount, description, created_at, status")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  // Calculate stats
  const totalWebsites = websites?.length || 0
  const liveWebsites = websites?.filter((w) => w.status === "live").length || 0
  const pendingWebsites = websites?.filter((w) => w.status === "pending").length || 0
  const developmentWebsites = websites?.filter((w) => w.status === "development").length || 0
  const unreadNotifications = notifications?.filter((n) => !n.is_read).length || 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "development":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "paused":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live":
        return <CheckCircle className="w-4 h-4" />
      case "development":
        return <Clock className="w-4 h-4" />
      case "pending":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-white to-orange-50">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-iguana-600 via-iguana-500 to-orange-500">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-4 text-shadow-strong">
                Welcome back, {userProfile?.first_name || "Creator"}! 🦎
              </h1>
              <p className="text-xl text-white/90 font-medium max-w-2xl">
                {userProfile?.company_name
                  ? `Ready to grow ${userProfile.company_name}? Let's build something amazing together.`
                  : "Your digital empire awaits. Let's create websites that convert and captivate."}
              </p>
            </div>
            <div className="hidden lg:block">
              <Image
                src="/site-iguana-logo-new.png"
                alt="Site Iguana"
                width={200}
                height={120}
                className="opacity-90"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card className="relative overflow-hidden bg-gradient-to-br from-iguana-500 to-iguana-600 text-white border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-iguana-100 text-lg font-semibold mb-2">Total Websites</p>
                  <p className="text-5xl font-bold">{totalWebsites}</p>
                </div>
                <Globe className="h-12 w-12 text-iguana-200" />
              </div>
              <div className="absolute -bottom-2 -right-2 opacity-20">
                <Globe className="h-24 w-24" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-lg font-semibold mb-2">Live & Active</p>
                  <p className="text-5xl font-bold">{liveWebsites}</p>
                </div>
                <CheckCircle className="h-12 w-12 text-emerald-200" />
              </div>
              <div className="absolute -bottom-2 -right-2 opacity-20">
                <CheckCircle className="h-24 w-24" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-lg font-semibold mb-2">In Progress</p>
                  <p className="text-5xl font-bold">{developmentWebsites}</p>
                </div>
                <Clock className="h-12 w-12 text-amber-200" />
              </div>
              <div className="absolute -bottom-2 -right-2 opacity-20">
                <Clock className="h-24 w-24" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-lg font-semibold mb-2">Pending Review</p>
                  <p className="text-5xl font-bold">{pendingWebsites}</p>
                </div>
                <AlertCircle className="h-12 w-12 text-purple-200" />
              </div>
              <div className="absolute -bottom-2 -right-2 opacity-20">
                <AlertCircle className="h-24 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Create Website CTA */}
            <Card className="relative overflow-hidden bg-gradient-to-r from-iguana-500 to-orange-500 text-white border-0 shadow-2xl">
              <CardContent className="p-12">
                <div className="flex items-center justify-between">
                  <div className="max-w-2xl">
                    <h2 className="text-4xl font-bold mb-4 text-shadow-strong">
                      Ready to Create Your Next Website? 🚀
                    </h2>
                    <p className="text-xl text-white/90 mb-8 leading-relaxed">
                      Our step-by-step wizard makes it easy. Answer a few questions, and we'll craft the perfect website
                      for your vision.
                    </p>
                    <Button
                      asChild
                      size="lg"
                      className="bg-white text-iguana-600 hover:bg-gray-100 text-xl px-12 py-6 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      <Link href="/user/websites/wizard/start">
                        <Sparkles className="w-6 h-6 mr-3" />
                        Start Website Wizard
                      </Link>
                    </Button>
                  </div>
                  <div className="hidden xl:block opacity-20">
                    <Target className="h-32 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-xl border-0">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center text-3xl font-bold text-gray-900">
                  <Zap className="w-8 h-8 mr-4 text-iguana-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button
                    asChild
                    variant="outline"
                    className="h-24 flex-col space-y-3 border-2 border-iguana-200 hover:bg-iguana-50 hover:border-iguana-300 transition-all duration-300"
                  >
                    <Link href="/user/request-edit">
                      <Edit3 className="w-8 h-8 text-iguana-600" />
                      <span className="font-bold text-lg text-gray-900">Request Changes</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="h-24 flex-col space-y-3 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300"
                  >
                    <Link href="/user/billing">
                      <CreditCard className="w-8 h-8 text-orange-600" />
                      <span className="font-bold text-lg text-gray-900">Billing & Plans</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="h-24 flex-col space-y-3 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
                  >
                    <Link href="/user/settings">
                      <Settings className="w-8 h-8 text-purple-600" />
                      <span className="font-bold text-lg text-gray-900">Account Settings</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="h-24 flex-col space-y-3 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                  >
                    <Link href="/user/support">
                      <MessageSquare className="w-8 h-8 text-blue-600" />
                      <span className="font-bold text-lg text-gray-900">Get Support</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* My Websites */}
            <Card className="shadow-xl border-0">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center text-3xl font-bold text-gray-900">
                    <Globe className="w-8 h-8 mr-4 text-iguana-500" />
                    My Websites
                  </div>
                  <Button size="lg" asChild className="bg-iguana-500 hover:bg-iguana-600 text-white font-bold">
                    <Link href="/user/websites/wizard/start">
                      <Plus className="w-5 h-5 mr-2" />
                      New Website
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {websites && websites.length > 0 ? (
                  <div className="space-y-6">
                    {websites.map((website) => (
                      <div
                        key={website.id}
                        className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-xl hover:border-iguana-200 hover:bg-iguana-50/50 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-iguana-100 to-orange-100 rounded-xl flex items-center justify-center shadow-lg">
                            {website.preview_image_url ? (
                              <img
                                src={website.preview_image_url || "/placeholder.svg"}
                                alt={website.title}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <Globe className="w-8 h-8 text-iguana-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-gray-900 mb-2">{website.title}</h3>
                            <div className="flex items-center space-x-3">
                              <Badge className={`text-sm font-semibold ${getStatusColor(website.status)}`}>
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(website.status)}
                                  <span>{website.status.charAt(0).toUpperCase() + website.status.slice(1)}</span>
                                </div>
                              </Badge>
                              {website.plans && (
                                <Badge variant="outline" className="text-sm font-semibold border-2">
                                  {website.plans.name}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {website.live_url && (
                            <Button size="lg" variant="outline" asChild className="font-semibold">
                              <a href={website.live_url} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-5 h-5 mr-2" />
                                View Live
                              </a>
                            </Button>
                          )}
                          <Button size="lg" variant="outline" asChild className="font-semibold">
                            <Link href={`/user/websites/${website.id}`}>Manage</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-iguana-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Globe className="w-12 h-12 text-iguana-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No websites yet</h3>
                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                      Ready to make your mark online? Let's create your first website together.
                    </p>
                    <Button
                      asChild
                      size="lg"
                      className="bg-iguana-500 hover:bg-iguana-600 text-white font-bold text-lg px-8 py-4"
                    >
                      <Link href="/user/websites/wizard/start">
                        <Plus className="w-6 h-6 mr-3" />
                        Create Your First Website
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-bold text-gray-900">
                  <Bell className="w-6 h-6 mr-3 text-iguana-500" />
                  Recent Activity
                  {unreadNotifications > 0 && (
                    <Badge className="ml-3 bg-red-500 text-white text-sm font-bold">{unreadNotifications}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications && notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-xl border-2 ${!notification.is_read ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}`}
                      >
                        <h4 className="font-bold text-gray-900 mb-2">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                        <p className="text-xs text-gray-400 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    <Button variant="outline" size="lg" className="w-full font-semibold" asChild>
                      <Link href="/user/notifications">View All Notifications</Link>
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No recent activity</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            {transactions && transactions.length > 0 && (
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center text-2xl font-bold text-gray-900">
                      <DollarSign className="w-6 h-6 mr-3 text-iguana-500" />
                      Recent Payments
                    </div>
                    <Button variant="outline" size="sm" asChild className="font-semibold">
                      <Link href="/user/billing">View All</Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border"
                      >
                        <div>
                          <p className="font-bold text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600 text-lg">${transaction.amount}</p>
                          <Badge variant="outline" className="text-xs font-semibold">
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account Management */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-800">Account Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-purple-300 text-purple-700 hover:bg-purple-100 font-semibold"
                    asChild
                  >
                    <Link href="/user/billing">
                      <CreditCard className="w-5 h-5 mr-3" />
                      Billing & Payments
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-purple-300 text-purple-700 hover:bg-purple-100 font-semibold"
                    asChild
                  >
                    <Link href="/user/settings">
                      <Settings className="w-5 h-5 mr-3" />
                      Account Settings
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-purple-300 text-purple-700 hover:bg-purple-100 font-semibold"
                    asChild
                  >
                    <Link href="/user/support">
                      <MessageSquare className="w-5 h-5 mr-3" />
                      Get Support
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
