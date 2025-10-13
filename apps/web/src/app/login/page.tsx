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
import { AlertCircle, Mail } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
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

      // Get user session to determine redirect
      const session = await getSession()
      toast.success('Login successful', {
        description: 'Welcome back to Remedara',
      })

      // Redirect based on user role
      switch (session?.user.role) {
        case 'ADMIN':
          router.push('/admin/dashboard')
          break
        case 'PROVIDER':
          router.push('/provider/dashboard')
          break
        case 'FRONT_DESK':
          router.push('/front-desk/dashboard')
          break
        case 'PATIENT':
        default:
          router.push('/patient/dashboard')
          break
      }
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

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await signIn('google', {
        callbackUrl: '/patient/dashboard',
      })
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('Login failed', {
        description: 'Failed to login with Google. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign in to Remedara</h2>
          <p className="mt-2 text-sm text-gray-600">Access your healthcare scheduling portal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Mail className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Don&apos;t have an account? </span>
              <Link href="/register" className="text-gray-900 hover:underline font-medium">
                Sign up
              </Link>
            </div>

            <div className="text-center text-sm">
              <Link
                href="/forgot-password"
                className="text-gray-600 hover:text-gray-900 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}
