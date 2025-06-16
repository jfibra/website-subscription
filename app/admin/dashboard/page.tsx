import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Globe, MessageSquare, Activity } from "lucide-react" // Added new icons
import Link from "next/link" // Added Link

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Ensure only admins can access this page (middleware should handle this, but double-check)
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("roles(name)")
    .eq("id", session.user.id)
    .single()

  // @ts-ignore
  if (profileError || profile?.roles?.name !== "admin") {
    redirect("/user/dashboard?error=unauthorized")
  }

  // Fetch admin specific data (examples)
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, first_name, last_name, auth_users:auth.users(email), roles(name)")
    .limit(5)
    .order("created_at", { ascending: false })

  const { data: websites, error: websitesError } = await supabase
    .from("websites")
    .select("id, title, status, users(first_name, last_name)")
    .limit(5)
    .order("created_at", { ascending: false })

  const { data: openTickets, error: ticketsError } = await supabase
    .from("support_tickets")
    .select("id, subject, status")
    .eq("status", "open")
    .limit(5)
    .order("created_at", { ascending: false })

  const { data: recentActivities, error: logsError } = await supabase
    .from("activity_logs")
    .select("id, activity, created_at, users(first_name, last_name)")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 font-plus-jakarta">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0} (recent)</div>
            <Link href="/admin/users" className="text-xs text-blue-600 hover:underline">
              View All Users
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Websites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{websites?.length || 0} (recent)</div>
            <Link href="/admin/websites" className="text-xs text-blue-600 hover:underline">
              View All Websites
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets?.length || 0}</div>
            <Link href="/admin/support-tickets" className="text-xs text-blue-600 hover:underline">
              View All Tickets
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentActivities?.length || 0} (recent)</div>
            <Link href="/admin/activity-logs" className="text-xs text-blue-600 hover:underline">
              View All Logs
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            {usersError && <p className="text-sm text-red-500">Error: {usersError.message}</p>}
            {users && users.length > 0 ? (
              <ul className="space-y-2">
                {users.map((user) => (
                  // @ts-ignore
                  <li key={user.id} className="text-sm">
                    {user.first_name} {user.last_name} ({user.auth_users?.email}) - Role: {user.roles?.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No recent users found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Websites</CardTitle>
          </CardHeader>
          <CardContent>
            {websitesError && <p className="text-sm text-red-500">Error: {websitesError.message}</p>}
            {websites && websites.length > 0 ? (
              <ul className="space-y-2">
                {websites.map((site) => (
                  <li key={site.id} className="text-sm">
                    {site.title} - Status: {site.status} (Owner: {site.users?.first_name} {site.users?.last_name})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No recent websites found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {ticketsError && <p className="text-sm text-red-500">Error: {ticketsError.message}</p>}
            {openTickets && openTickets.length > 0 ? (
              <ul className="space-y-2">
                {openTickets.map((ticket) => (
                  <li key={ticket.id} className="text-sm">
                    {ticket.subject} - Status: {ticket.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No open support tickets.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {logsError && <p className="text-sm text-red-500">Error: {logsError.message}</p>}
            {recentActivities && recentActivities.length > 0 ? (
              <ul className="space-y-2">
                {recentActivities.map((log) => (
                  <li key={log.id} className="text-sm">
                    {log.activity} by {log.users?.first_name} {log.users?.last_name || "N/A"} (
                    {new Date(log.created_at).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity logs.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
