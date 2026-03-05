// page.tsx
import { redirect } from 'next/navigation'
import { checkRole } from '@/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'
import { UserTable } from './UserTable'
import type { Roles } from '@/types/globals'

interface SerializedUser {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddress: string
  role: Roles | undefined
}

export default async function AdminDashboard() {
  if (!(await checkRole('admin'))) {
    redirect('/')
  }

  const client = await clerkClient()
  const { data: users } = await client.users.getUserList({ limit: 100 })

  const serializedUsers: SerializedUser[] = users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress:
      user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
        ?.emailAddress || 'No email',
    role: user.publicMetadata.role as Roles | undefined,
  }))

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        Admin Dashboard
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Manage user roles and permissions
      </p>

      <UserTable users={serializedUsers} />
    </div>
  )
}