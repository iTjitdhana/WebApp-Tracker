"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  BarChart3, 
  Users, 
  Package, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Timer,
  RefreshCw
} from "lucide-react"

interface DashboardData {
  summary: {
    totalWorkPlans: number
    activeWorkPlans: number
    completedWorkPlans: number
    totalOperators: number
    currentActiveTime: string
    totalProductionTime: string
    efficiency: string
    progress: string
  }
  workPlans: Array<{
    id: number
    job_name: string
    status: string
    production_minutes: number | null
    standard_minutes: number | null
    operator_names: string
    actual_start_time: string | null
    actual_end_time: string | null
  }>
  timestamp: string
}

// ฟังก์ชันสำหรับแปลงนาทีเป็นรูปแบบ HH:MM:SS
function formatTimeFromMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const secs = 0
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// ฟังก์ชันสำหรับแปลงนาทีเป็นรูปแบบ MM:SS
function formatTimeFromMinutesShort(minutes: number): string {
  const mins = Math.floor(minutes)
  const secs = Math.round((minutes - mins) * 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// ฟังก์ชันสำหรับแปลง ms เป็น MM:SS
function formatMsToMMSS(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [liveTimers, setLiveTimers] = useState<{[key: number]: number}>({})

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      const data = await response.json()
      setDashboardData(data)
      setLastUpdated(new Date())
      setError(null)

      // อัปเดต live timers สำหรับงานที่กำลังดำเนินการ
      const newLiveTimers: {[key: number]: number} = {}
      data.workPlans.forEach((workPlan: any) => {
        if (workPlan.status === 'กำลังดำเนินการ' && workPlan.actual_start_time) {
          const startTime = new Date(workPlan.actual_start_time).getTime()
          const now = new Date().getTime()
          const elapsedMinutes = Math.round((now - startTime) / 60000)
          newLiveTimers[workPlan.id] = elapsedMinutes
        }
      })
      setLiveTimers(newLiveTimers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // อัปเดต live timers ทุกวินาที
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setLiveTimers(prev => {
        const updated: {[key: number]: number} = {}
        Object.keys(prev).forEach(key => {
          const workPlanId = parseInt(key)
          const workPlan = dashboardData?.workPlans.find(wp => wp.id === workPlanId)
          
          // อัปเดตเฉพาะงานที่ยังกำลังดำเนินการ
          if (workPlan && workPlan.status === 'กำลังดำเนินการ' && workPlan.actual_start_time) {
            const startTime = new Date(workPlan.actual_start_time).getTime()
            const now = new Date().getTime()
            const elapsedMinutes = Math.round((now - startTime) / 60000)
            updated[workPlanId] = elapsedMinutes
          }
        })
        return updated
      })
    }, 1000) // อัปเดตทุกวินาที

    return () => clearInterval(timerInterval)
  }, [dashboardData])

  useEffect(() => {
    fetchDashboardData()
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">กำลังโหลดข้อมูล Dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert className="mb-6">
            <AlertDescription>
              เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}
            </AlertDescription>
          </Alert>
          <Button onClick={fetchDashboardData} className="mb-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            ลองใหม่
          </Button>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert>
            <AlertDescription>
              ไม่พบข้อมูล Dashboard
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const { summary, workPlans } = dashboardData
  const progressValue = parseInt(summary.progress.replace('%', ''))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📊 Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              ภาพรวมการผลิตและสถิติ
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-500 mt-1">
                อัปเดตล่าสุด: {lastUpdated.toLocaleTimeString('th-TH')}
              </p>
            )}
          </div>
          <Button onClick={fetchDashboardData} variant="outline" size="sm">
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            รีเฟรช
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                สถานะการผลิต
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {summary.activeWorkPlans > 0 ? 'กำลังดำเนินการ' : 'รอดำเนินการ'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.activeWorkPlans} งานกำลังดำเนินการ
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <Package className="mr-2 h-4 w-4 text-blue-500" />
                งานที่เสร็จสิ้น
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {summary.completedWorkPlans}/{summary.totalWorkPlans}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.progress} ของงานทั้งหมด
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <Clock className="mr-2 h-4 w-4 text-orange-500" />
                เวลาที่ใช้
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {summary.totalProductionTime}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                เวลารวมการผลิต
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <Users className="mr-2 h-4 w-4 text-purple-500" />
                พนักงานที่ทำงาน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {summary.totalOperators} คน
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                พนักงานที่เกี่ยวข้อง
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>ความคืบหน้าการผลิต</CardTitle>
              <CardDescription>
                ติดตามความคืบหน้าในปัจจุบัน
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ความคืบหน้า</span>
                  <span>{summary.progress}</span>
                </div>
                <Progress value={progressValue} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{summary.activeWorkPlans}</div>
                  <div className="text-gray-600">กำลังดำเนินการ</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{summary.completedWorkPlans}</div>
                  <div className="text-gray-600">เสร็จสิ้น</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>สถิติการผลิต</CardTitle>
              <CardDescription>
                ข้อมูลสถิติรายวัน
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>งานทั้งหมด</span>
                  <Badge variant="outline">{summary.totalWorkPlans} งาน</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>ประสิทธิภาพ</span>
                  <Badge className="bg-blue-100 text-blue-800">{summary.efficiency}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>เวลาที่ใช้จริง</span>
                  <Badge className="bg-green-100 text-green-800">{summary.totalProductionTime}</Badge>
                </div>
                {summary.currentActiveTime !== '00:00:00' && (
                  <div className="flex items-center justify-between">
                    <span>เวลากำลังดำเนินการ</span>
                    <Badge className="bg-orange-100 text-orange-800">{summary.currentActiveTime}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Work Plans List */}
        <Card>
          <CardHeader>
            <CardTitle>รายการงานการผลิต</CardTitle>
            <CardDescription>
              รายละเอียดงานทั้งหมดในวันนี้
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workPlans.map((workPlan) => {
                let productionDisplay = '-';
                let productionClass = '';
                let timerIcon = null;
                // กำลังดำเนินการ: Live timer
                if (workPlan.status === 'กำลังดำเนินการ' && workPlan.actual_start_time) {
                  // ใช้ useState/useEffect สำหรับ live timer
                  const [now, setNow] = useState(Date.now());
                  useEffect(() => {
                    const interval = setInterval(() => setNow(Date.now()), 1000);
                    return () => clearInterval(interval);
                  }, []);
                  const start = new Date(workPlan.actual_start_time).getTime();
                  const diff = now - start;
                  productionDisplay = formatMsToMMSS(diff);
                  productionClass = 'text-blue-600 font-bold animate-pulse';
                  timerIcon = <Timer className="mr-1 h-3 w-3 text-blue-500" />;
                }
                // เสร็จสิ้น: ใช้เวลาระหว่าง start-end
                else if (workPlan.status === 'เสร็จสิ้น' && workPlan.actual_start_time && workPlan.actual_end_time) {
                  const start = new Date(workPlan.actual_start_time).getTime();
                  const end = new Date(workPlan.actual_end_time).getTime();
                  const diff = end - start;
                  productionDisplay = formatMsToMMSS(diff);
                  productionClass = 'text-green-700 font-bold';
                }
                return (
                  <div key={workPlan.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{workPlan.job_name}</h3>
                      <p className="text-sm text-gray-600">
                        พนักงาน: {workPlan.operator_names}
                      </p>
                      {workPlan.actual_start_time && (
                        <p className="text-xs text-gray-500">
                          เริ่ม: {new Date(workPlan.actual_start_time).toLocaleTimeString('th-TH')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`text-sm font-medium flex items-center ${productionClass}`}>
                          {timerIcon}
                          {productionDisplay}
                        </div>
                        {workPlan.standard_minutes && (
                          <div className="text-xs text-gray-500">
                            มาตรฐาน: {Math.floor(workPlan.standard_minutes / 60)}:{(workPlan.standard_minutes % 60).toString().padStart(2, '0')}
                          </div>
                        )}
                      </div>
                      <Badge 
                        variant={
                          workPlan.status === 'เสร็จสิ้น' ? 'default' : 
                          workPlan.status === 'กำลังดำเนินการ' ? 'secondary' : 'outline'
                        }
                        className={
                          workPlan.status === 'เสร็จสิ้น' ? 'bg-green-100 text-green-800' :
                          workPlan.status === 'กำลังดำเนินการ' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {workPlan.status}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 