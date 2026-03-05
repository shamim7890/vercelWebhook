// app/api/webhooks/clerk/route.ts
// The webhook handler - Clerk calls this on user.created, user.updated, user.deleted
//
// KEY FIX: On user.created, we now write the default role back to Clerk's
// publicMetadata. Without this, Clerk shows no role on the user profile,
// and the session JWT won't carry a role either.
//
// FLOW for new signups:
//   1. user.created fires -> we insert to Supabase + set publicMetadata { role: 'user' } in Clerk
//   2. Setting publicMetadata triggers user.updated webhook -> that's fine, it just re-syncs

import { NextResponse } from 'next/server'
import { verifyWebhook, getPrimaryEmail } from '@/lib/webhook'
import { supabaseAdmin } from '@/lib/supabase'
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(request: Request): Promise<NextResponse> {
  // STEP 1: Verify the signature -- proves the request really came from Clerk
  let event
  try {
    event = await verifyWebhook(request)
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  console.log('Webhook received:', event.type)

  try {
    switch (event.type) {

      // user.created: new user signed up
      case 'user.created': {
        const { data } = event
        const email = getPrimaryEmail(data)

        console.log('New user:', email, data.id)

        // 1. Save user to Supabase with default role 'user'
        const { error } = await supabaseAdmin
          .from('users')
          .upsert({
            clerk_id:   data.id,
            email:      email,
            first_name: data.first_name,
            last_name:  data.last_name,
            role:       'user',
          }, {
            onConflict: 'clerk_id',
          })

        if (error) {
          console.error('Supabase insert failed:', error)
          return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        // 2. THE FIX: Write the default role to Clerk publicMetadata.
        //    Without this, the Clerk dashboard shows no role on the user,
        //    and the session token has no role claim.
        //    This triggers a user.updated webhook -- that's harmless,
        //    the handler just re-syncs the same 'user' role to Supabase.
        const client = await clerkClient()
        await client.users.updateUserMetadata(data.id, {
          publicMetadata: { role: 'user' },
        })

        console.log('User created + role set in Clerk publicMetadata:', email)
        break
      }

      // user.updated: profile or metadata changed
      // Fires when an admin changes a role, OR when we set publicMetadata above
      case 'user.updated': {
        const { data } = event
        const email = getPrimaryEmail(data)

        // Read role from Clerk publicMetadata -- fallback to 'user' if missing
        const role = (data.public_metadata?.role as string) || 'user'

        console.log('User updated:', email, 'role:', role)

        const { error } = await supabaseAdmin
          .from('users')
          .update({
            email:      email,
            first_name: data.first_name,
            last_name:  data.last_name,
            role:       role,
          })
          .eq('clerk_id', data.id)

        if (error) {
          console.error('Supabase update failed:', error)
          return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        console.log('User updated in Supabase:', email, '->', role)
        break
      }

      // user.deleted: user removed from Clerk
      case 'user.deleted': {
        const { data } = event

        const { error } = await supabaseAdmin
          .from('users')
          .delete()
          .eq('clerk_id', data.id)

        if (error) {
          console.error('Supabase delete failed:', error)
          return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        console.log('User deleted from Supabase:', data.id)
        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    // Return 200 -- tells Clerk the webhook was processed successfully
    // Any non-2xx response causes Clerk to retry
    return NextResponse.json({ success: true }, { status: 200 })

  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}