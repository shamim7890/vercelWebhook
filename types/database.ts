/**
 * types/database.ts
 *
 * Hand-written Supabase schema types.
 * You can also generate these automatically with:
 *   npx supabase gen types typescript --project-id <your-project-id>
 *
 * KEY DESIGN DECISIONS:
 * ─────────────────────
 * - Primary key is `clerk_id` (Clerk's user ID like "user_2abc…"), not a UUID.
 *   This means every query can use the Clerk user ID directly — no mapping needed.
 *
 * - `role` in UserInsert is typed as UserRole (strict union).
 *
 * - `role` in UserUpdate is typed as `string` — this is intentional.
 *   The webhook handler reads the role as:
 *     (data.public_metadata?.role as string) || 'user'
 *   which produces a `string`. Typing the Update column as `string` means
 *   that value is directly assignable without a second cast.
 *
 * - Supabase v2's GenericSchema constraint requires ALL five keys:
 *     Tables, Views, Functions, Enums, CompositeTypes
 *   Missing any one collapses .insert()/.update() params to `never`.
 *   { [_ in never]: never } is the correct empty-map shape (same as codegen output).
 */

export type UserRole = 'user' | 'moderator' | 'admin'

export interface UserRow {
  clerk_id:   string
  email:      string
  first_name: string | null
  last_name:  string | null
  role:       UserRole
  created_at: string
  updated_at: string
}

export interface UserInsert {
  clerk_id:    string
  email:       string
  first_name?: string | null
  last_name?:  string | null
  role?:       UserRole
}

export interface UserUpdate {
  email?:      string
  first_name?: string | null
  last_name?:  string | null
  /**
   * Typed as `string` (not UserRole) so the webhook's
   *   `(data.public_metadata?.role as string) || 'user'`
   * is directly assignable without an extra narrowing step.
   */
  role?:       string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row:           UserRow
        Insert:        UserInsert
        Update:        UserUpdate
        Relationships: []
      }
    }
    Views:          { [_ in never]: never }
    Functions:      { [_ in never]: never }
    Enums:          { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}