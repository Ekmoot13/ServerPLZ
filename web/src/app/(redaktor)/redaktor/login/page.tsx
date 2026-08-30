import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/redaktorAuth'
import LoginForm from './LoginForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) redirect('/redaktor')
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <LoginForm />
    </main>
  )
}
