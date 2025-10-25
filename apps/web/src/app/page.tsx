'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, FileText, Shield, MessageSquare, UserCheck, LayoutDashboard, User, Stethoscope, Activity } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { HomeNavbar } from '@/components/HomeNavbar'

export default function HomePage() {
  const { data: session } = useSession()
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <HomeNavbar />
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#2D5F4C] mb-4">
            {session ? `Welcome back, ${session.user.name?.split(' ')[0]}!` : 'Remedara'}
          </h1>
          <p className="text-xl text-[#5A7366] max-w-3xl mx-auto">
            {session ? (
              session.user.role === 'PATIENT' ? 
                'Your health records and appointments are just a click away. Manage your care with ease.' :
              session.user.role === 'PROVIDER' ? 
                'Access your practice dashboard, patient records, and schedule management.' :
                'Manage clinic operations, patient records, and administrative tasks.'
            ) : (
              'Professional clinic scheduling and patient intake management system. Streamline your healthcare operations with our secure, compliant platform.'
            )}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {!session ? (
              <Button asChild className="bg-[#3D7A5F] hover:bg-[#2D5F4C] text-white text-lg px-12 py-4 h-auto">
                <Link href="/login">Get Started</Link>
              </Button>
            ) : (
              <>
                {/* Patient Dashboard */}
                {session.user.role === 'PATIENT' && (
                  <>
                    <Button asChild className="bg-[#3D7A5F] hover:bg-[#2D5F4C] text-white text-lg px-12 py-4 h-auto">
                      <Link href="/patient/dashboard">
                        <LayoutDashboard className="h-5 w-5 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="border-[#3D7A5F] text-[#3D7A5F] hover:bg-[#E8E2D5] text-lg px-12 py-4 h-auto">
                      <Link href="/records">
                        <User className="h-5 w-5 mr-2" />
                        My Records
                      </Link>
                    </Button>
                  </>
                )}
                
                {/* Provider Dashboard */}
                {session.user.role === 'PROVIDER' && (
                  <>
                    <Button asChild className="bg-[#3D7A5F] hover:bg-[#2D5F4C] text-white text-lg px-12 py-4 h-auto">
                      <Link href="/provider">
                        <Stethoscope className="h-5 w-5 mr-2" />
                        Provider Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="border-[#3D7A5F] text-[#3D7A5F] hover:bg-[#E8E2D5] text-lg px-12 py-4 h-auto">
                      <Link href="/records">
                        <FileText className="h-5 w-5 mr-2" />
                        Patient Records
                      </Link>
                    </Button>
                  </>
                )}
                
                {/* Admin Dashboard */}
                {(session.user.role === 'ADMIN' || session.user.role === 'FRONT_DESK') && (
                  <>
                    <Button asChild className="bg-[#3D7A5F] hover:bg-[#2D5F4C] text-white text-lg px-12 py-4 h-auto">
                      <Link href="/provider">
                        <LayoutDashboard className="h-5 w-5 mr-2" />
                        Admin Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="border-[#3D7A5F] text-[#3D7A5F] hover:bg-[#E8E2D5] text-lg px-12 py-4 h-auto">
                      <Link href="/records">
                        <Users className="h-5 w-5 mr-2" />
                        Manage Records
                      </Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
          <Card className="border-[#D4C9B3] bg-white hover:shadow-lg transition-shadow p-8">
            <CardHeader className="pb-8">
              <Calendar className="h-14 w-14 text-[#3D7A5F] mb-6" />
              <CardTitle className="text-3xl text-[#2D5F4C] mb-4">Smart Scheduling</CardTitle>
              <CardDescription className="text-xl text-[#5A7366] leading-relaxed">
                Automated appointment scheduling with provider availability management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-lg text-[#5A7366] space-y-3">
                <li>• Real-time availability</li>
                <li>• Conflict prevention</li>
                <li>• Automated reminders</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-[#D4C9B3] bg-white hover:shadow-lg transition-shadow p-8">
            <CardHeader className="pb-8">
              <FileText className="h-14 w-14 text-[#3D7A5F] mb-6" />
              <CardTitle className="text-3xl text-[#2D5F4C] mb-4">Digital Intake</CardTitle>
              <CardDescription className="text-xl text-[#5A7366] leading-relaxed">
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

          <Card className="border-[#D4C9B3] bg-white hover:shadow-lg transition-shadow p-8">
            <CardHeader className="pb-8">
              <Shield className="h-14 w-14 text-[#3D7A5F] mb-6" />
              <CardTitle className="text-3xl text-[#2D5F4C] mb-4">HIPAA Compliant</CardTitle>
              <CardDescription className="text-xl text-[#5A7366] leading-relaxed">
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

          <Card className="border-[#D4C9B3] bg-white hover:shadow-lg transition-shadow p-8">
            <CardHeader className="pb-8">
              <Users className="h-14 w-14 text-[#3D7A5F] mb-6" />
              <CardTitle className="text-3xl text-[#2D5F4C] mb-4">Role-Based Access</CardTitle>
              <CardDescription className="text-xl text-[#5A7366] leading-relaxed">
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

          <Card className="border-[#D4C9B3] bg-white hover:shadow-lg transition-shadow p-8">
            <CardHeader className="pb-8">
              <MessageSquare className="h-14 w-14 text-[#3D7A5F] mb-6" />
              <CardTitle className="text-3xl text-[#2D5F4C] mb-4">Communication Hub</CardTitle>
              <CardDescription className="text-xl text-[#5A7366] leading-relaxed">
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

          <Card className="border-[#D4C9B3] bg-white hover:shadow-lg transition-shadow p-8">
            <CardHeader className="pb-8">
              <UserCheck className="h-14 w-14 text-[#3D7A5F] mb-6" />
              <CardTitle className="text-3xl text-[#2D5F4C] mb-4">Check-in Kiosk</CardTitle>
              <CardDescription className="text-xl text-[#5A7366] leading-relaxed">
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
          <Card className="max-w-4xl mx-auto border-[#D4C9B3] bg-white p-8">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl text-[#2D5F4C] mb-4">
                {session ? (
                  session.user.role === 'PATIENT' ? 'Your Health, Simplified' :
                  session.user.role === 'PROVIDER' ? 'Streamline Your Practice' :
                  'Manage Your Clinic Efficiently'
                ) : (
                  'Ready to Transform Your Clinic?'
                )}
              </CardTitle>
              <CardDescription className="text-xl text-[#5A7366] leading-relaxed">
                {session ? (
                  session.user.role === 'PATIENT' ? 'Access your complete medical history, schedule appointments, and stay connected with your healthcare providers.' :
                  session.user.role === 'PROVIDER' ? 'Manage patient records, appointments, and practice operations all in one secure platform.' :
                  'Oversee clinic operations, manage staff, and ensure smooth patient care delivery.'
                ) : (
                  'Join healthcare providers who trust Remedara for their scheduling needs'
                )}
              </CardDescription>
            </CardHeader>
            {!session && (
              <CardContent className="flex flex-col sm:flex-row justify-center gap-6">
                <Button asChild size="lg" className="bg-[#3D7A5F] hover:bg-[#2D5F4C] text-white px-8 py-4 text-lg font-medium">
                  <Link href="/register">Start Free Trial</Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="border-[#3D7A5F] text-[#3D7A5F] hover:bg-[#E8E2D5] px-8 py-4 text-lg font-medium">
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </CardContent>
            )}
            {session && (
              <CardContent className="flex flex-col sm:flex-row justify-center gap-6">
                {session.user.role === 'PATIENT' && (
                  <>
                    <Button asChild size="lg" className="bg-[#3D7A5F] hover:bg-[#2D5F4C] text-white px-8 py-4 text-lg font-medium">
                      <Link href="/patient/dashboard">
                        <LayoutDashboard className="h-5 w-5 mr-2" />
                        Go to Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" asChild size="lg" className="border-[#3D7A5F] text-[#3D7A5F] hover:bg-[#E8E2D5] px-8 py-4 text-lg font-medium">
                      <Link href="/records">
                        <FileText className="h-5 w-5 mr-2" />
                        View Records
                      </Link>
                    </Button>
                  </>
                )}
                {session.user.role === 'PROVIDER' && (
                  <>
                    <Button asChild size="lg" className="bg-[#3D7A5F] hover:bg-[#2D5F4C] text-white px-8 py-4 text-lg font-medium">
                      <Link href="/provider">
                        <Stethoscope className="h-5 w-5 mr-2" />
                        Go to Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" asChild size="lg" className="border-[#3D7A5F] text-[#3D7A5F] hover:bg-[#E8E2D5] px-8 py-4 text-lg font-medium">
                      <Link href="/records">
                        <Users className="h-5 w-5 mr-2" />
                        Patient Records
                      </Link>
                    </Button>
                  </>
                )}
                {(session.user.role === 'ADMIN' || session.user.role === 'FRONT_DESK') && (
                  <>
                    <Button asChild size="lg" className="bg-[#3D7A5F] hover:bg-[#2D5F4C] text-white px-8 py-4 text-lg font-medium">
                      <Link href="/provider">
                        <LayoutDashboard className="h-5 w-5 mr-2" />
                        Admin Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" asChild size="lg" className="border-[#3D7A5F] text-[#3D7A5F] hover:bg-[#E8E2D5] px-8 py-4 text-lg font-medium">
                      <Link href="/records">
                        <FileText className="h-5 w-5 mr-2" />
                        All Records
                      </Link>
                    </Button>
                  </>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}