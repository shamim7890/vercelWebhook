// lib/webhook.ts
// ─────────────────────────────────────────────────────────────
// Webhook security: verifying the signature
//
// WHY THIS MATTERS:
// Your webhook endpoint is a public URL. Anyone could send
// a fake POST request pretending to be Clerk. To prevent this,
// Clerk signs every webhook request with a secret key using
// the Svix library. We verify that signature before trusting
// any data.
//
// HOW IT WORKS:
// 1. Clerk generates a HMAC signature using your CLERK_WEBHOOK_SECRET
// 2. It adds the signature to the request headers (svix-id, svix-timestamp, svix-signature)
// 3. You use the same secret + the same Svix library to verify it
// 4. If the signature doesn't match → reject the request
// ─────────────────────────────────────────────────────────────

import { Webhook } from 'svix'
import { headers } from 'next/headers'

// These are the Clerk webhook event types we care about
export type WebhookEventType = 'user.created' | 'user.updated' | 'user.deleted'

// Shape of the data Clerk sends us for user events
export interface ClerkUserWebhookData {
  id: string                          // Clerk user ID e.g. "user_2abc123"
  email_addresses: Array<{
    email_address: string
    id: string
  }>
  primary_email_address_id: string
  first_name: string | null
  last_name: string | null
  public_metadata: {
    role?: string                     // The role we set in publicMetadata
  }
}

export interface ClerkWebhookEvent {
  type: WebhookEventType
  data: ClerkUserWebhookData
}

// ─────────────────────────────────────────────────────────────
// verifyWebhook()
// Call this at the top of your webhook API route.
// Returns the parsed event if valid, throws if invalid.
// ─────────────────────────────────────────────────────────────
export async function verifyWebhook(request: Request): Promise<ClerkWebhookEvent> {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error('CLERK_WEBHOOK_SECRET is not set in environment variables')
  }

  // Read the raw request body as text (needed for signature verification)
  const body = await request.text()

  // Get the Svix headers Clerk adds to every webhook request
  const headerPayload = await headers()
  const svixId        = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  // If any Svix headers are missing, this is not a valid Clerk webhook
  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new Error('Missing Svix headers — request is not from Clerk')
  }

  // Create a Svix Webhook instance with our secret
  const wh = new Webhook(webhookSecret)

  // verify() throws if the signature is invalid
  // If it succeeds, we know the request genuinely came from Clerk
  const event = wh.verify(body, {
    'svix-id':        svixId,
    'svix-timestamp': svixTimestamp,
    'svix-signature': svixSignature,
  }) as ClerkWebhookEvent

  return event
}

// ─────────────────────────────────────────────────────────────
// Helper: extract the primary email from Clerk's user data
// ─────────────────────────────────────────────────────────────
export function getPrimaryEmail(data: ClerkUserWebhookData): string {
  const primary = data.email_addresses.find(
    (e) => e.id === data.primary_email_address_id
  )
  return primary?.email_address ?? ''
}