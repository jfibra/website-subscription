import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit3, MessageSquare, UserCircle, Bell, Globe } from "lucide-react" // Added Bell and Globe
import Link from "next/link"
import { Badge } from "@/components/ui/badge" // Added Badge

export default async function UserDashboardPage() {
  const supabase = createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Fetch user specific data
  const { data: websites, error: websitesError } = await supabase
    .from("websites")
    .select("id, title, status, live_url, preview_image_url")
    .eq("user_id", session.user.id)
    .eq("is_deleted", false) // Only show active websites

  const { data: notifications, error: notificationsError } = await supabase
    .from("notifications")
    .select("id, title, message, created_at, is_read")
    .eq("user_id", session.user.id)
    .eq("is_deleted", false) // Only show active notifications
    .order("created_at", { ascending: false })
    .limit(5)

  const getWebsiteStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-800"
      case "development":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "paused":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 font-plus-jakarta">My Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>My Websites</span>
                <Button size="sm" asChild>
                  <Link href="/user/websites/new">Create New Website</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {websitesError && <p className="text-red-500">Error fetching websites: {websitesError.message}</p>}
              {websites && websites.length > 0 ? (
                <ul className="space-y-4">
                  {websites.map((site) => (
                    <li key={site.id} className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{site.title}</h3>
                        <Badge className={`mt-1 px-2 py-0.5 text-xs ${getWebsiteStatusColor(site.status)}`}>
                          {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                        </Badge>
                        {site.live_url && (
                          <a
                            href={site.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline ml-2"
                          >
                            View Live
                          </a>
                        )}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/user/websites/${site.id}`}>Manage</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">You haven't created any websites yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Notifications</span>
                <Button size="sm" variant="ghost" asChild>
                  <Link href="/user/notifications">View All</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notificationsError && (
                <p className="text-red-500">Error fetching notifications: {notificationsError.message}</p>
              )}
              {notifications && notifications.length > 0 ? (
                <ul className="space-y-3">
                  {notifications.map((notif) => (
                    <li
                      key={notif.id}
                      className={`p-3 rounded-md ${!notif.is_read ? "bg-blue-50 border-blue-200 border" : "bg-gray-50"}`}
                    >
                      <h4 className="font-medium text-sm">{notif.title}</h4>
                      <p className="text-xs text-muted-foreground">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(notif.created_at).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No new notifications.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/user/websites/new">
                  <Globe className="w-4 h-4 mr-2" /> Create New Website
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/user/request-edit">
                  <Edit3 className="w-4 h-4 mr-2" /> Request an Edit
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/user/support">
                  <MessageSquare className="w-4 h-4 mr-2" /> Create Support Ticket
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/user/profile">
                  <UserCircle className="w-4 h-4 mr-2" /> Update Profile
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/user/notifications">
                  <Bell className="w-4 h-4 mr-2" /> View All Notifications
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700 mb-4">Check our FAQ or contact support for assistance.</p>
              <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-100" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        User dashboard features coming soon: detailed website management, edit request forms, support ticket system,
        profile updates.
      </p>
    </div>
  )
}
