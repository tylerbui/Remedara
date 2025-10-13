import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, FileText, Shield, MessageSquare, UserCheck } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
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
            <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800">
              <Link href="/login">Get Started</Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-100">
              <Link href="/book">Book Appointment</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader>
              <Calendar className="h-8 w-8 text-gray-700 mb-2" />
              <CardTitle className="text-gray-900">Smart Scheduling</CardTitle>
              <CardDescription className="text-gray-600">
                Automated appointment scheduling with provider availability management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time availability</li>
                <li>• Conflict prevention</li>
                <li>• Automated reminders</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader>
              <FileText className="h-8 w-8 text-gray-700 mb-2" />
              <CardTitle className="text-gray-900">Digital Intake</CardTitle>
              <CardDescription className="text-gray-600">
                Comprehensive digital forms with e-signatures and document management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Dynamic forms</li>
                <li>• E-signature support</li>
                <li>• Insurance capture</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader>
              <Shield className="h-8 w-8 text-gray-700 mb-2" />
              <CardTitle className="text-gray-900">HIPAA Compliant</CardTitle>
              <CardDescription className="text-gray-600">
                Enterprise-grade security with encrypted PHI storage and audit logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Data encryption</li>
                <li>• Audit trails</li>
                <li>• Access controls</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-gray-700 mb-2" />
              <CardTitle className="text-gray-900">Role-Based Access</CardTitle>
              <CardDescription className="text-gray-600">
                Secure access control for patients, providers, front desk, and admins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Patient portal</li>
                <li>• Provider dashboard</li>
                <li>• Admin controls</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-gray-700 mb-2" />
              <CardTitle className="text-gray-900">Communication Hub</CardTitle>
              <CardDescription className="text-gray-600">
                Integrated messaging system with automated notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• SMS reminders</li>
                <li>• Email notifications</li>
                <li>• Patient messaging</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader>
              <UserCheck className="h-8 w-8 text-gray-700 mb-2" />
              <CardTitle className="text-gray-900">Check-in Kiosk</CardTitle>
              <CardDescription className="text-gray-600">
                Self-service check-in with digital consent and form completion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Kiosk mode</li>
                <li>• Digital consent</li>
                <li>• Form validation</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Ready to Transform Your Clinic?</CardTitle>
              <CardDescription className="text-gray-600">
                Join healthcare providers who trust Remedara for their scheduling needs
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-4">
              <Button asChild className="bg-gray-900 hover:bg-gray-800">
                <Link href="/register">Start Free Trial</Link>
              </Button>
              <Button variant="outline" asChild className="border-gray-300 text-gray-700 hover:bg-gray-100">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}