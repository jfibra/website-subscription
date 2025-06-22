import Stripe from "stripe"

if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.SECRET_KEY, {
  apiVersion: "2024-04-10", // Or your preferred API version
})
