
import { RegisterForm } from '@/features/auth/components/register'
import { requireUnAuth } from '@/lib/auth-utils';
import React from 'react'

async function Register() {
     await requireUnAuth();
  return (
    <div>
      <RegisterForm/>
    </div>
  )
}

export default Register
