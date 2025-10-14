'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Stethoscope, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  HelpCircle,
  FileText,
  Calendar,
  Shield,
  CreditCard,
  Settings,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { HomeNavbar } from '@/components/HomeNavbar'

export default function SupportPage() {
  const patientFAQs = [
    {
      icon: Calendar,
      category: "Appointments",
      questions: [
        {
          question: "How do I schedule an appointment?",
          answer: "After logging into your patient portal, click 'Book Appointment' and select your preferred provider, date, and time slot. You'll receive a confirmation email once your appointment is scheduled."
        },
        {
          question: "Can I reschedule or cancel my appointment?",
          answer: "Yes! You can reschedule or cancel appointments up to 24 hours in advance through your patient portal or by calling our support line."
        },
        {
          question: "How do I receive appointment reminders?",
          answer: "We automatically send SMS and email reminders 24 hours and 2 hours before your appointment. You can update your notification preferences in your account settings."
        }
      ]
    },
    {
      icon: FileText,
      category: "Forms & Documents",
      questions: [
        {
          question: "How do I complete intake forms?",
          answer: "You'll receive a link to complete intake forms when you schedule your first appointment. Forms can also be accessed through your patient portal under 'My Documents'."
        },
        {
          question: "Can I upload my insurance information?",
          answer: "Yes! You can upload photos of your insurance cards directly in the patient portal. This information will be securely stored and shared with your healthcare provider."
        },
        {
          question: "Are my documents secure?",
          answer: "Absolutely. All documents are encrypted and stored in HIPAA-compliant systems. Only authorized healthcare providers can access your information."
        }
      ]
    },
    {
      icon: CreditCard,
      category: "Billing & Payment",
      questions: [
        {
          question: "How do I pay my bill?",
          answer: "You can pay bills through your patient portal using a credit card, debit card, or bank account. We also accept payments over the phone."
        },
        {
          question: "Can I set up a payment plan?",
          answer: "Yes! Contact our billing department to discuss payment plan options that work for your budget."
        }
      ]
    },
    {
      icon: Settings,
      category: "Account Management",
      questions: [
        {
          question: "How do I update my personal information?",
          answer: "Log into your patient portal and go to 'Account Settings' to update your contact information, emergency contacts, and notification preferences."
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your email address."
        }
      ]
    }
  ]

  const providerFAQs = [
    {
      icon: Calendar,
      category: "Schedule Management",
      questions: [
        {
          question: "How do I set my availability?",
          answer: "Access the Provider Dashboard and go to 'Schedule Settings'. You can set your regular hours, block time for breaks, and mark days as unavailable."
        },
        {
          question: "Can I see my schedule across multiple locations?",
          answer: "Yes! The system supports multi-location scheduling. You can view and manage appointments across all your practice locations from one dashboard."
        },
        {
          question: "How do I handle emergency appointments?",
          answer: "You can create emergency slots or override your schedule to accommodate urgent appointments. The system will notify affected patients of any changes."
        }
      ]
    },
    {
      icon: Users,
      category: "Patient Management",
      questions: [
        {
          question: "How do I access patient intake forms?",
          answer: "Patient forms are automatically available in each appointment record. You can review completed forms before the appointment through the Provider Dashboard."
        },
        {
          question: "Can I send messages to patients?",
          answer: "Yes! Use the secure messaging feature to communicate with patients about appointments, follow-ups, or general questions."
        },
        {
          question: "How do I view patient history?",
          answer: "Click on any patient's name to access their complete profile, including appointment history, documents, and previous communications."
        }
      ]
    },
    {
      icon: Shield,
      category: "Compliance & Security",
      questions: [
        {
          question: "Is the system HIPAA compliant?",
          answer: "Yes! Remedara is fully HIPAA compliant with end-to-end encryption, audit logs, and secure data storage. We regularly undergo security audits and compliance reviews."
        },
        {
          question: "How is patient data protected?",
          answer: "All data is encrypted in transit and at rest. Access is strictly controlled through role-based permissions, and all activities are logged for audit purposes."
        }
      ]
    },
    {
      icon: Settings,
      category: "System Administration",
      questions: [
        {
          question: "How do I add staff members?",
          answer: "Go to 'Practice Settings' > 'Staff Management' to invite new team members. You can assign different permission levels based on their role."
        },
        {
          question: "Can I customize appointment types?",
          answer: "Yes! You can create custom appointment types with specific durations, requirements, and booking rules through the Practice Settings."
        },
        {
          question: "How do I export patient data?",
          answer: "Use the 'Reports' section to export patient data, appointment summaries, and other practice analytics in various formats."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavbar />
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Customer Support & FAQ
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get help with Remedara. Find answers to common questions or contact our support team.
          </p>
        </div>

        {/* Contact Support Section */}
        <div className="mb-20">
          <Card className="max-w-4xl mx-auto border-gray-200 p-8">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl text-gray-900 mb-4">Need Help? Contact Us</CardTitle>
              <CardDescription className="text-xl text-gray-600">
                Our support team is here to help you get the most out of Remedara
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Phone className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">Phone Support</h3>
                <p className="text-lg text-gray-600 mb-6">Speak with our support team</p>
                <p className="text-2xl font-medium text-gray-900">(555) 123-4567</p>
                <div className="flex items-center justify-center mt-4">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-base text-gray-500">Mon-Fri, 8AM-6PM EST</span>
                </div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Mail className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">Email Support</h3>
                <p className="text-lg text-gray-600 mb-6">Send us your questions</p>
                <p className="text-2xl font-medium text-gray-900">support@remedara.com</p>
                <div className="flex items-center justify-center mt-4">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-base text-gray-500">Response within 4 hours</span>
                </div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <MessageSquare className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">Live Chat</h3>
                <p className="text-lg text-gray-600 mb-6">Chat with our support team</p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg font-medium">
                  Start Chat
                </Button>
                <div className="flex items-center justify-center mt-4">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-base text-gray-500">Mon-Fri, 8AM-8PM EST</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-16">
          {/* Patient FAQ */}
          <div>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Patient FAQ</h2>
              <p className="text-xl text-gray-600">Common questions for patients using Remedara</p>
            </div>

            <div className="grid gap-8">
              {patientFAQs.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="border-gray-200 p-8">
                  <CardHeader className="pb-10">
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <category.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl text-gray-900">{category.category}</CardTitle>
                        <Badge variant="secondary" className="mt-2 text-base px-3 py-1">
                          {category.questions.length} questions
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {category.questions.map((faq, faqIndex) => (
                      <div key={faqIndex} className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <HelpCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                          <h3 className="text-xl font-medium text-gray-900">{faq.question}</h3>
                        </div>
                        <p className="text-lg text-gray-600 pl-10 leading-relaxed">{faq.answer}</p>
                        {faqIndex < category.questions.length - 1 && (
                          <Separator className="mt-8" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Provider FAQ */}
          <div>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <Stethoscope className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Provider FAQ</h2>
              <p className="text-xl text-gray-600">Common questions for healthcare providers using Remedara</p>
            </div>

            <div className="grid gap-8">
              {providerFAQs.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="border-gray-200 p-8">
                  <CardHeader className="pb-10">
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <category.icon className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl text-gray-900">{category.category}</CardTitle>
                        <Badge variant="secondary" className="mt-2 text-base px-3 py-1">
                          {category.questions.length} questions
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {category.questions.map((faq, faqIndex) => (
                      <div key={faqIndex} className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <HelpCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                          <h3 className="text-xl font-medium text-gray-900">{faq.question}</h3>
                        </div>
                        <p className="text-lg text-gray-600 pl-10 leading-relaxed">{faq.answer}</p>
                        {faqIndex < category.questions.length - 1 && (
                          <Separator className="mt-8" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <Card className="max-w-3xl mx-auto border-gray-200 p-8">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl text-gray-900 mb-4">Still Need Help?</CardTitle>
              <CardDescription className="text-xl text-gray-600">
                Can't find what you're looking for? Our support team is ready to assist you.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row justify-center gap-6">
              <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800 px-10 py-5 text-xl font-medium">
                <Link href="mailto:support@remedara.com">Email Support</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-100 px-10 py-5 text-xl font-medium">
                Call (555) 123-4567
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}