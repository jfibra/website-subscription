import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function getPlans() {
  const supabase = createServerComponentClient({ cookies })
  const { data: plans, error } = await supabase.from("plans").select("*").order("monthly_price", { ascending: true })

  if (error) {
    console.error("Error fetching plans:", error)
    return []
  }
  return plans
}

export interface Plan {
  id: number
  name: string
  description: string
  long_description: string | null // This field is used for richer descriptions
  monthly_price: number
  setup_fee: number | null
  edit_limit: number
  is_custom: boolean
  is_popular: boolean // This field is used for the "Most Popular" badge
  features: string[] | null // This array is iterated to list features
  ideal_for: string[] | null // This array is iterated to list ideal use cases
}
