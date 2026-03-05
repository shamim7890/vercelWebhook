// UserTable.tsx
'use client'

import { useState } from 'react'
import { setRole } from './_actions'
import type { Roles } from '@/types/globals'

interface SerializedUser {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddress: string
  role: Roles | undefined
}

interface UserTableProps {
  users: SerializedUser[]
}

export function UserTable({ users }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null)

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase()
    const email = user.emailAddress.toLowerCase()
    const search = searchTerm.toLowerCase()

    return fullName.includes(search) || email.includes(search)
  })

  const handleRoleChange = async (userId: string, newRole: Roles | null) => {
    setLoadingUserId(userId)
    await setRole(userId, newRole)
    setLoadingUserId(null)
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '0.75rem 1rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        />
      </div>

      <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                Name
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                Email
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                Current Role
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                Change Role
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const currentRole = user.role
                const isLoading = loadingUserId === user.id

                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '500', color: '#111827' }}>
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                      {user.emailAddress}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          backgroundColor: currentRole === 'admin' ? '#dbeafe' : currentRole === 'moderator' ? '#fef3c7' :currentRole === 'user' ? '#f3f4f6' : '#f3f4f6',
                          color: currentRole === 'admin' ? '#1e40af' : currentRole === 'moderator' ? '#92400e' :currentRole === 'user' ? '#6b7280' : '#6b7280',
                        }}
                      >
                        {currentRole || 'None'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <select
                        value={currentRole || 'none'}
                        onChange={(e) => {
                          const value = e.target.value
                          handleRoleChange(user.id, value === 'none' ? null : (value as Roles))
                        }}
                        disabled={isLoading}
                        style={{
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          backgroundColor: 'white',
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          opacity: isLoading ? 0.5 : 1,
                        }}
                      >
                        <option value="none">None</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                        <option value="user">User</option>
                      </select>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  )
}