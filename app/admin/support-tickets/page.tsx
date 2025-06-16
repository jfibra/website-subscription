import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"
import type { Database } from "@/types/supabase"

type SupportTicket = Database["public"]["Tables"]["support_tickets"]["Row"] & {
  users: { first_name: string | null; last_name: string | null; auth_users: { email: string | null } | null } | null
}

export default async function AdminSupportTicketsPage() {
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

  const { data: tickets, error: ticketsError } = await supabase
    .from("support_tickets")
    .select(`
      id,
      subject,
      message,
      priority,
      status,
      created_at,
      users(
        first_name,
        last_name,
        auth_users:auth.users(email)
      )
    `)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 font-plus-jakarta">Support Tickets</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> All Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ticketsError && <p className="text-red-500">Error loading tickets: {ticketsError.message}</p>}
          {!tickets || tickets.length === 0 ? (
            <p className="text-muted-foreground">No support tickets found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket: SupportTicket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.subject}</TableCell>
                      <TableCell>
                        {ticket.users?.first_name} {ticket.users?.last_name} ({ticket.users?.auth_users?.email})
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">
                        {ticket.message}
                      </TableCell>
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
