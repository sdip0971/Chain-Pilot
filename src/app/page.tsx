
import React from 'react'
import { cn  } from '@/lib/utils'
import { createAuthClient } from 'better-auth/react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/features/auth/logout'
import { requireAuth } from '@/lib/auth-utils'
import { caller } from '@/trpc/server'
async function Page() {
  await requireAuth();
  const data = await caller.getUser();

  return (
    <div className='min-h-screen min-w-screen flex-items-center justify-center'>
      {JSON.stringify(data)}
      {data && (
       <LogoutButton/>
      )}
   
    </div>
  )
}

export default Page
