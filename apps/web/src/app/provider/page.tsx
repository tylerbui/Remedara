import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function ProviderPage() {
  const session = await getServerSession(authOptions)

  // Check if user is authenticated and is a provider
  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'PROVIDER') {
    redirect('/patient/dashboard') // Redirect patients to their dashboard
  }

  // Redirect to provider dashboard
  redirect('/provider/dashboard')
}
