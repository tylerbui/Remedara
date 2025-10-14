'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, FileText, Shield, MessageSquare, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { HomeNavbar } from '@/components/HomeNavbar'

export default function HomePage() {
  const { data: session } = useSession()
  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavbar />
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Remedara
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional clinic scheduling and patient intake management system. 
            Streamline your healthcare operations with our secure, compliant platform.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild className="bg-gray-900 hover:bg-gray-800 text-lg px-12 py-4 h-auto">
              <Link href="/login">Get Started</Link>
            </Button>
            {session && (
              <Button variant="outline" asChild size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                <Link href="/book">Book Appointment</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
          <Card className="border-gray-200 hover:shadow-lg transition-shadow p-8">
            <CardHeader className="pb-8">
              <Calendar className="h-14 w-14 text-gray-700 mb-6" />
              <CardTitle className="text-3xl text-gray-900 mb-4">Smart Scheduling</CardTitle>
              <CardDescription className="text-xl text-gray-600 leading-relaxed">
                Automated appointment scheduling with provider availability management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-lg text-gray-600 space-y-3">
                <li>• Real-time availability</li>
                <li>• Conflict prevention</li>
                <li>• Automated reminders</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow p-8">
            <CardHeader className="pb-8">
              <FileText className="h-14 w-14 text-gray-700 mb-6" />
              <CardTitle className="text-3xl text-gray-900 mb-4">Digital Intake</CardTitle>
              <CardDescription className="text-xl text-gray-600 leading-relaxed">
                Comprehensive digital forms with e-signatures and document management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-lg text-gray-600 space-y-3">
                <li>• Dynamic forms</li>
                <li>• E-signature support</li>
                <li>• Insurance capture</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow p-8">
            <CardHeader className="pb-8">
              <Shield className="h-14 w-14 text-gray-700 mb-6" />
              <CardTitle className="text-3xl text-gray-900 mb-4">HIPAA Compliant</CardTitle>
              <CardDescription className="text-xl text-gray-600 leading-relaxed">
                Enterprise-grade security with encrypted PHI storage and audit logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-lg text-gray-600 space-y-3">
                <li>• Data encryption</li>
                <li>• Audit trails</li>
                <li>• Access controls</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow p-8">
            <CardHeader className="pb-8">
              <Users className="h-14 w-14 text-gray-700 mb-6" />
              <CardTitle className="text-3xl text-gray-900 mb-4">Role-Based Access</CardTitle>
              <CardDescription className="text-xl text-gray-600 leading-relaxed">
                Secure access control for patients, providers, front desk, and admins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-lg text-gray-600 space-y-3">
                <li>• Patient portal</li>
                <li>• Provider dashboard</li>
                <li>• Admin controls</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow p-8">
            <CardHeader className="pb-8">
              <MessageSquare className="h-14 w-14 text-gray-700 mb-6" />
              <CardTitle className="text-3xl text-gray-900 mb-4">Communication Hub</CardTitle>
              <CardDescription className="text-xl text-gray-600 leading-relaxed">
                Integrated messaging system with automated notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-lg text-gray-600 space-y-3">
                <li>• SMS reminders</li>
                <li>• Email notifications</li>
                <li>• Patient messaging</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow p-8">
            <CardHeader className="pb-8">
              <UserCheck className="h-14 w-14 text-gray-700 mb-6" />
              <CardTitle className="text-3xl text-gray-900 mb-4">Check-in Kiosk</CardTitle>
              <CardDescription className="text-xl text-gray-600 leading-relaxed">
                Self-service check-in with digital consent and form completion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-lg text-gray-600 space-y-3">
                <li>• Kiosk mode</li>
                <li>• Digital consent</li>
                <li>• Form validation</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-4xl mx-auto border-gray-200 p-8">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl text-gray-900 mb-4">Ready to Transform Your Clinic?</CardTitle>
              <CardDescription className="text-xl text-gray-600 leading-relaxed">
                Join healthcare providers who trust Remedara for their scheduling needs
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row justify-center gap-6">
              <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800 px-8 py-4 text-lg font-medium">
                <Link href="/register">Start Free Trial</Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-4 text-lg font-medium">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}