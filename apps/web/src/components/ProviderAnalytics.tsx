'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Heart,
  Activity,
  Pill,
  TestTube,
  AlertTriangle,
  CheckCircle,
  Star,
  MapPin,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Zap,
  Shield,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'
import { format, subDays, subMonths } from 'date-fns'

interface KPICard {
  title: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface ChartData {
  name: string
  value: number
  date?: string
  appointments?: number
  revenue?: number
  patients?: number
  satisfaction?: number
}

export default function ProviderAnalytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(false)

  // Mock data - replace with real API calls
  const kpiData: KPICard[] = [
    {
      title: 'Total Patients',
      value: 1247,
      change: 12.5,
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Monthly Revenue',
      value: '$47,320',
      change: 8.2,
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Appointments This Month',
      value: 342,
      change: -3.1,
      trend: 'down',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Patient Satisfaction',
      value: '4.8/5',
      change: 5.2,
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      title: 'Average Wait Time',
      value: '12 min',
      change: -15.3,
      trend: 'up', // Lower wait time is good
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'No-Show Rate',
      value: '8.2%',
      change: -2.1,
      trend: 'up', // Lower no-show is good
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ]

  // Practice Performance Data
  const performanceData = [
    { name: 'Jan', appointments: 280, revenue: 42000, patients: 1150, satisfaction: 4.6 },
    { name: 'Feb', appointments: 295, revenue: 43500, patients: 1180, satisfaction: 4.7 },
    { name: 'Mar', appointments: 310, revenue: 45000, patients: 1200, satisfaction: 4.5 },
    { name: 'Apr', appointments: 325, revenue: 46200, patients: 1220, satisfaction: 4.8 },
    { name: 'May', appointments: 342, revenue: 47320, patients: 1247, satisfaction: 4.8 },
  ]

  // Patient Demographics
  const ageGroupData = [
    { name: '0-18', value: 156, color: '#0088FE' },
    { name: '19-35', value: 298, color: '#00C49F' },
    { name: '36-50', value: 387, color: '#FFBB28' },
    { name: '51-65', value: 286, color: '#FF8042' },
    { name: '65+', value: 120, color: '#8884d8' },
  ]

  const insuranceData = [
    { name: 'Private', value: 45.2, color: '#0088FE' },
    { name: 'Medicare', value: 28.7, color: '#00C49F' },
    { name: 'Medicaid', value: 18.3, color: '#FFBB28' },
    { name: 'Self-Pay', value: 7.8, color: '#FF8042' },
  ]

  // Clinical Insights
  const topDiagnoses = [
    { name: 'Hypertension', count: 89, percentage: 26.2 },
    { name: 'Type 2 Diabetes', count: 67, percentage: 19.7 },
    { name: 'Anxiety Disorder', count: 45, percentage: 13.2 },
    { name: 'Hyperlipidemia', count: 38, percentage: 11.2 },
    { name: 'Depression', count: 34, percentage: 10.0 },
  ]

  const treatmentOutcomes = [
    { condition: 'Hypertension', improved: 78, stable: 15, worsened: 7 },
    { condition: 'Diabetes', improved: 65, stable: 25, worsened: 10 },
    { condition: 'Anxiety', improved: 82, stable: 12, worsened: 6 },
    { condition: 'Depression', improved: 71, stable: 20, worsened: 9 },
  ]

  // Operational Analytics
  const appointmentTypes = [
    { name: 'Routine Check-up', value: 35, color: '#0088FE' },
    { name: 'Follow-up', value: 28, color: '#00C49F' },
    { name: 'Consultation', value: 20, color: '#FFBB28' },
    { name: 'Urgent Care', value: 12, color: '#FF8042' },
    { name: 'Procedure', value: 5, color: '#8884d8' },
  ]

  const monthlyTrends = [
    { month: 'Jan', newPatients: 42, returnPatients: 238, cancelations: 28, noShows: 25 },
    { month: 'Feb', newPatients: 38, returnPatients: 257, cancelations: 31, noShows: 22 },
    { month: 'Mar', newPatients: 51, returnPatients: 259, cancelations: 29, noShows: 27 },
    { month: 'Apr', newPatients: 45, returnPatients: 280, cancelations: 26, noShows: 24 },
    { month: 'May', newPatients: 47, returnPatients: 295, cancelations: 24, noShows: 28 },
  ]

  const getTrendIcon = (trend: 'up' | 'down' | 'stable', isPositive?: boolean) => {
    if (trend === 'stable') return <Minus className="h-4 w-4 text-gray-500" />
    
    const isGoodChange = isPositive ? trend === 'up' : trend === 'down'
    
    return trend === 'up' 
      ? <ArrowUpRight className={`h-4 w-4 ${isGoodChange ? 'text-green-500' : 'text-red-500'}`} />
      : <ArrowDownRight className={`h-4 w-4 ${isGoodChange ? 'text-green-500' : 'text-red-500'}`} />
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable', change: number, isPositive = true) => {
    if (trend === 'stable') return 'text-gray-600'
    const isGoodChange = isPositive ? change > 0 : change < 0
    return isGoodChange ? 'text-green-600' : 'text-red-600'
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }}>
              {pld.dataKey}: {typeof pld.value === 'number' && pld.dataKey === 'revenue' 
                ? `$${pld.value.toLocaleString()}` 
                : pld.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Practice Analytics</h2>
          <p className="text-gray-600 mt-1">Comprehensive insights into your practice performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="365d">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          const isPositiveMetric = !['Average Wait Time', 'No-Show Rate'].includes(kpi.title)
          
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                <div className="flex items-center space-x-1 mt-2">
                  {getTrendIcon(kpi.trend, isPositiveMetric)}
                  <span className={`text-xs font-medium ${getTrendColor(kpi.trend, kpi.change, isPositiveMetric)}`}>
                    {Math.abs(kpi.change).toFixed(1)}% from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="clinical">Clinical Insights</TabsTrigger>
          <TabsTrigger value="operational">Operations</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Revenue Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Appointment Volume */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Monthly Appointments</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="appointments" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Patient Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Patient Growth</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="patients" stroke="#8b5cf6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Patient Satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span>Patient Satisfaction</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[4.0, 5.0]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="satisfaction" stroke="#f59e0b" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Clinical Insights Tab */}
        <TabsContent value="clinical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Diagnoses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-red-600" />
                  <span>Most Common Diagnoses</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topDiagnoses.map((diagnosis, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{diagnosis.name}</span>
                          <span className="text-sm text-gray-600">{diagnosis.count} patients</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${diagnosis.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Treatment Outcomes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span>Treatment Outcomes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={treatmentOutcomes} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="condition" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="improved" stackId="a" fill="#10b981" />
                    <Bar dataKey="stable" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="worsened" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span>Improved</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span>Stable</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span>Worsened</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clinical Quality Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Med Adherence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">87.3%</div>
                <div className="flex items-center space-x-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600">+2.1% this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Preventive Care</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">92.5%</div>
                <div className="flex items-center space-x-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600">+4.2% this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Follow-up Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">78.9%</div>
                <div className="flex items-center space-x-1 mt-2">
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-red-600">-1.3% this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Referral Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">15.2%</div>
                <div className="flex items-center space-x-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600">+0.8% this month</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operational" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointment Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5 text-blue-600" />
                  <span>Appointment Types</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={appointmentTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {appointmentTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span>Monthly Patient Flow</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="newPatients" fill="#10b981" name="New Patients" />
                    <Bar dataKey="returnPatients" fill="#3b82f6" name="Return Patients" />
                    <Bar dataKey="cancelations" fill="#f59e0b" name="Cancelations" />
                    <Bar dataKey="noShows" fill="#ef4444" name="No Shows" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Operational Efficiency Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Exam Rooms</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Equipment</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Staff Hours</span>
                      <span className="text-sm font-medium">91%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '91%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Efficiency Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg. Appointment Duration</span>
                    <span className="font-medium">18 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Daily Patient Capacity</span>
                    <span className="font-medium">24 patients</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Booking Efficiency</span>
                    <span className="font-medium">89.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Same-Day Availability</span>
                    <span className="font-medium">67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cost per Patient</span>
                    <span className="font-medium">$138.40</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Revenue per Patient</span>
                    <span className="font-medium">$286.70</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Operating Margin</span>
                    <span className="font-medium text-green-600">51.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monthly Overhead</span>
                    <span className="font-medium">$23,450</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Patient Age Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ageGroupData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ageGroupData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Insurance Coverage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Insurance Coverage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insuranceData.map((insurance, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{insurance.name}</span>
                        <span className="text-sm text-gray-600">{insurance.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${insurance.value}%`,
                            backgroundColor: insurance.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Geographic and Outcome Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Average Patient Age</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">47.2</div>
                <div className="text-xs text-gray-500 mt-1">years</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Gender Split</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span>Female</span>
                    <span className="font-medium">58%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Male</span>
                    <span className="font-medium">42%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">New vs Return</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span>Return</span>
                    <span className="font-medium">76%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New</span>
                    <span className="font-medium">24%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Distance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">8.7</div>
                <div className="text-xs text-gray-500 mt-1">miles from practice</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}