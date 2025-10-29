'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, Stethoscope, Shield, Lock } from 'lucide-react'
import { toast } from 'sonner'

export default function ProviderLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        toast.error('Login failed', {
          description: 'Please check your credentials and try again',
        })
        return
      }

      // Get user session to verify provider role
      const session = await getSession()

      if (!session) {
        setError('Failed to retrieve session')
        return
      }

      // Check if user is a provider
      if (
        session.user.role !== 'PROVIDER' &&
        session.user.role !== 'ADMIN' &&
        session.user.role !== 'FRONT_DESK'
      ) {
        toast.error('Access denied', {
          description: 'This portal is for healthcare providers only',
        })
        setError('This portal is for healthcare providers only')
        await signIn('credentials', { redirect: false }) // Sign out
        return
      }

      toast.success('Welcome back!', {
        description: 'Redirecting to your provider dashboard',
      })

      // Redirect to provider dashboard
      router.push('/provider/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred')
      toast.error('Login failed', {
        description: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-[#E8E2D5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-[#3D7A5F] rounded-full flex items-center justify-center mb-4">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-[#2D5F4C]">Provider Portal</h2>
          <p className="mt-2 text-sm text-[#5A7366]">Secure access for healthcare providers</p>
        </div>

        <Card className="border-[#D4C9B3] shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-[#2D5F4C]">Sign In</CardTitle>
            <CardDescription className="text-center">
              Access your practice dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#2D5F4C]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="provider@clinic.com"
                  required
                  disabled={isLoading}
                  className="border-[#D4C9B3] focus:border-[#3D7A5F]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[#2D5F4C]">
                    Password
                  </Label>
                  <Link
                    href="/provider/forgot-password"
                    className="text-xs text-[#3D7A5F] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  className="border-[#D4C9B3] focus:border-[#3D7A5F]"
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#3D7A5F] hover:bg-[#2D5F4C] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Security Features</span>
              </div>
            </div>

            {/* Security badges */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center space-x-2 text-xs text-[#5A7366]">
                <Shield className="h-4 w-4 text-[#3D7A5F]" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-[#5A7366]">
                <Lock className="h-4 w-4 text-[#3D7A5F]" />
                <span>256-bit Encryption</span>
              </div>
            </div>

            <Separator />

            <div className="text-center text-sm space-y-2">
              <p className="text-[#5A7366]">
                New to Remedara?{' '}
                <Link
                  href="/provider/register"
                  className="text-[#3D7A5F] hover:underline font-medium"
                >
                  Register your practice
                </Link>
              </p>
              <p className="text-xs text-[#5A7366]">
                Looking for patient portal?{' '}
                <Link href="/login" className="text-[#3D7A5F] hover:underline">
                  Patient Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-[#5A7366] space-y-1">
          <p>Protected by enterprise-grade security</p>
          <p className="text-[0.65rem]">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
