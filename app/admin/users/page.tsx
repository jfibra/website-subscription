import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users } from "lucide-react"
import type { Database } from "@/types/supabase"

type UserProfile = Database["public"]["Tables"]["users"]["Row"] & {
  roles: { name: string } | null
  auth_users: { email: string } | null
}

export default async function AdminUsersPage() {
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

  const { data: users, error: usersError } = await supabase
    .from("users")
    .select(`
      id,
      first_name,
      last_name,
      phone_number,
      company_name,
      created_at,
      roles(name),
      auth_users:auth.users(email)
    `)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 font-plus-jakarta">All Users</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" /> User List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usersError && <p className="text-red-500">Error loading users: {usersError.message}</p>}
          {!users || users.length === 0 ? (
            <p className="text-muted-foreground">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: UserProfile) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.auth_users?.email || "N/A"}</TableCell>
                      <TableCell>{user.roles?.name || "N/A"}</TableCell>
                      <TableCell>{user.phone_number || "N/A"}</TableCell>
                      <TableCell>{user.company_name || "N/A"}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
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
