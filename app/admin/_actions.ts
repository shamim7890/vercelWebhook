// _actions.ts
'use server'

import { checkRole } from '@/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import type { Roles } from '@/types/globals'

export async function setRole(userId: string, role: Roles | null) {
  const client = await clerkClient()

  if (!(await checkRole('admin'))) {
    return { success: false, message: 'Not Authorized' }
  }

  try {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    })
    revalidatePath('/admin')
    return { success: true, message: 'Role updated successfully' }
  } catch (err) {
    return { success: false, message: 'Failed to update role' }
  }
}

export async function removeRole(formData: FormData) {
  const client = await clerkClient()

  try {
    const res = await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: null },
    })
    return { message: res.publicMetadata }
  } catch (err) {
    return { message: err }
  }
}