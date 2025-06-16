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
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  DollarSign,
  Settings,
  CreditCard,
} from "lucide-react"
import Link from "next/link"

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
        return "bg-green-100 text-green-800 border-green-200"
      case "development":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
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
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Welcome Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userProfile?.first_name || "User"}!
            </h1>
            <p className="text-gray-600">
              {userProfile?.company_name || "Manage your websites and projects from your dashboard"}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Websites</p>
                  <p className="text-3xl font-bold">{totalWebsites}</p>
                </div>
                <Globe className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Live Websites</p>
                  <p className="text-3xl font-bold">{liveWebsites}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">In Development</p>
                  <p className="text-3xl font-bold">{developmentWebsites}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Pending Requests</p>
                  <p className="text-3xl font-bold">{pendingWebsites}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    asChild
                    className="h-20 flex-col space-y-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    <Link href="/user/websites/create">
                      <Plus className="w-6 h-6" />
                      <span className="font-semibold">Create New Website</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-20 flex-col space-y-2 border-2 hover:bg-gray-50">
                    <Link href="/user/request-edit">
                      <Edit3 className="w-6 h-6" />
                      <span className="font-semibold">Request Edit</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-20 flex-col space-y-2 border-2 hover:bg-gray-50">
                    <Link href="/user/billing">
                      <CreditCard className="w-6 h-6" />
                      <span className="font-semibold">Billing & Payments</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-20 flex-col space-y-2 border-2 hover:bg-gray-50">
                    <Link href="/user/settings">
                      <Settings className="w-6 h-6" />
                      <span className="font-semibold">Account Settings</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* My Websites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    My Websites
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/user/websites/create">
                      <Plus className="w-4 h-4 mr-2" />
                      New Website
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {websites && websites.length > 0 ? (
                  <div className="space-y-4">
                    {websites.map((website) => (
                      <div
                        key={website.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            {website.preview_image_url ? (
                              <img
                                src={website.preview_image_url || "/placeholder.svg"}
                                alt={website.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Globe className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{website.title}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={`text-xs ${getStatusColor(website.status)}`}>
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(website.status)}
                                  <span>{website.status.charAt(0).toUpperCase() + website.status.slice(1)}</span>
                                </div>
                              </Badge>
                              {website.plans && (
                                <Badge variant="outline" className="text-xs">
                                  {website.plans.name}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {website.live_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={website.live_url} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </a>
                            </Button>
                          )}
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/user/websites/${website.id}`}>Manage</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No websites yet</h3>
                    <p className="text-gray-600 mb-4">Create your first website to get started</p>
                    <Button asChild>
                      <Link href="/user/websites/create">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Website
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Recent Activity
                  {unreadNotifications > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white text-xs">{unreadNotifications}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications && notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border ${!notification.is_read ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}`}
                      >
                        <h4 className="font-medium text-sm text-gray-900">{notification.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/user/notifications">View All Notifications</Link>
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">No recent activity</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            {transactions && transactions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Recent Payments
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/user/billing">View All</Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">${transaction.amount}</p>
                          <Badge variant="outline" className="text-xs">
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
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-800">Account Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
                    asChild
                  >
                    <Link href="/user/billing">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Billing & Payments
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
                    asChild
                  >
                    <Link href="/user/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Account Settings
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
                    asChild
                  >
                    <Link href="/user/support">
                      <MessageSquare className="w-4 h-4 mr-2" />
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
