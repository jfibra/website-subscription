import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set")
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const sendWelcomeEmail = async (email: string, firstName: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_APP_NAME} <noreply@yourdomain.com>`,
      to: [email],
      subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}!</h1>
          <p>Hi {{userName}},</p>
          <p>Thank you for joining ${process.env.NEXT_PUBLIC_APP_NAME}! We're excited to help you create amazing websites.</p>
          <p>Here's what you can do next:</p>
          <ul>
            <li>Complete your profile setup</li>
            <li>Browse our website templates</li>
            <li>Create your first website project</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/user/dashboard" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              Get Started
            </a>
          </div>
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Best regards,<br>The ${process.env.NEXT_PUBLIC_APP_NAME} Team</p>
        </div>
      `.replace("{{userName}}", firstName),
    })

    if (error) {
      console.error("Failed to send welcome email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return { success: false, error }
  }
}

export const sendPaymentSuccessEmail = async (
  email: string,
  userName: string,
  paymentId: string,
  amount: number,
  planName: string,
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_APP_NAME} <noreply@yourdomain.com>`,
      to: [email],
      subject: `Payment Confirmation - ${process.env.NEXT_PUBLIC_APP_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #28a745; text-align: center;">Payment Successful!</h1>
          <p>Hi {{userName}},</p>
          <p>Thank you for your payment! Your subscription has been activated.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Payment Details:</h3>
            <p><strong>Plan:</strong> ${planName}</p>
            <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
            <p><strong>Payment ID:</strong> {{paymentId}}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p>Your subscription is now active and you can start creating your websites!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/user/dashboard" 
               style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              View Dashboard
            </a>
          </div>
          
          <p>Best regards,<br>The ${process.env.NEXT_PUBLIC_APP_NAME} Team</p>
        </div>
      `
        .replace("{{userName}}", userName)
        .replace("{{paymentId}}", paymentId),
    })

    if (error) {
      console.error("Failed to send payment success email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending payment success email:", error)
    return { success: false, error }
  }
}

export const sendSupportTicketNotification = async (
  adminEmail: string,
  userName: string,
  subject: string,
  ticketId: number,
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_APP_NAME} <noreply@yourdomain.com>`,
      to: [adminEmail],
      subject: `New Support Ticket - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc3545; text-align: center;">New Support Ticket</h1>
          <p>A new support ticket has been submitted:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>From:</strong> {{userName}}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Ticket ID:</strong> #${ticketId}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/support-tickets" 
               style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              View Ticket
            </a>
          </div>
        </div>
      `.replace("{{userName}}", userName),
    })

    if (error) {
      console.error("Failed to send support ticket notification:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending support ticket notification:", error)
    return { success: false, error }
  }
}
