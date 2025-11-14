"use client"
import React from 'react'
import { cn  } from '@/lib/utils'
import { createAuthClient } from 'better-auth/react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
function Page() {
  const {data} = authClient.useSession();

  return (
    <div className='min-h-screen min-w-screen flex-items-center justify-center'>
      {JSON.stringify(data)}
      {data && (
     <Button onClick={()=>authClient.signOut()}>
        Logout
      </Button>
      )}
   
    </div>
  )
}

export default Page
