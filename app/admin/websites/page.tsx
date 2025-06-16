import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Globe, LinkIcon } from "lucide-react"
import type { Database } from "@/types/supabase"

type Website = Database["public"]["Tables"]["websites"]["Row"] & {
  users: { first_name: string | null; last_name: string | null } | null
  plans: { name: string | null } | null
}

export default async function AdminWebsitesPage() {
  const supabase = createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Ensure only admins can access this page
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("roles(name)")
    .eq("id", session.user.id)
    .single()

  // @ts-ignore
  if (profileError || profile?.roles?.name !== "admin") {
    redirect("/user/dashboard?error=unauthorized")
  }

  const { data: websites, error: websitesError } = await supabase
    .from("websites")
    .select(`
      id,
      title,
      description,
      live_url,
      status,
      created_at,
      users(first_name, last_name),
      plans(name)
    `)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-800"
      case "development":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "paused":
        return "bg-orange-100 text-orange-800"
      case "deleted":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 font-plus-jakarta">All Websites</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" /> Website List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {websitesError && <p className="text-red-500">Error loading websites: {websitesError.message}</p>}
          {!websites || websites.length === 0 ? (
            <p className="text-muted-foreground">No websites found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Live URL</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {websites.map((site: Website) => (
                    <TableRow key={site.id}>
                      <TableCell className="font-medium">{site.title}</TableCell>
                      <TableCell>
                        {site.users?.first_name} {site.users?.last_name}
                      </TableCell>
                      <TableCell>{site.plans?.name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(site.status)}>
                          {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {site.live_url ? (
                          <a
                            href={site.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <LinkIcon className="w-4 h-4 mr-1" /> View
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>{new Date(site.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
