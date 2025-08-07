"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Plus, 
  Settings, 
  BarChart3, 
  Users, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  Stop,
  RefreshCw
} from "lucide-react"

export default function HomePage() {
  const [isActive, setIsActive] = useState(false)
  const [progress, setProgress] = useState(65)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🍽️ Food Production Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            ระบบติดตามการผลิตอาหารแบบเรียลไทม์
          </p>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            size="lg" 
            className="h-20 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => alert("เริ่มการผลิต!")}
          >
            <Play className="mr-2 h-6 w-6" />
            เริ่มการผลิต
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="h-20 border-orange-300 text-orange-600 hover:bg-orange-50"
            onClick={() => alert("หยุดชั่วคราว!")}
          >
            <Pause className="mr-2 h-6 w-6" />
            หยุดชั่วคราว
          </Button>
          
          <Button 
            size="lg" 
            variant="destructive" 
            className="h-20"
            onClick={() => alert("หยุดการผลิต!")}
          >
            <Stop className="mr-2 h-6 w-6" />
            หยุดการผลิต
          </Button>
          
          <Button 
            size="lg" 
            variant="secondary" 
            className="h-20"
            onClick={() => {
              setProgress(Math.random() * 100)
              alert("อัพเดทข้อมูลแล้ว!")
            }}
          >
            <RefreshCw className="mr-2 h-6 w-6" />
            อัพเดทข้อมูล
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
              <div className="text-2xl font-bold text-green-600">กำลังดำเนินการ</div>
              <p className="text-xs text-muted-foreground mt-1">
                เริ่มต้นเมื่อ 2 ชั่วโมงที่แล้ว
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <Package className="mr-2 h-4 w-4 text-blue-500" />
                จำนวนที่ผลิตได้
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">1,247 ชิ้น</div>
              <p className="text-xs text-muted-foreground mt-1">
                เพิ่มขึ้น 12% จากเมื่อวาน
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
              <div className="text-2xl font-bold text-orange-600">2:15:30</div>
              <p className="text-xs text-muted-foreground mt-1">
                เหลือเวลาอีก 45 นาที
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
              <div className="text-2xl font-bold text-purple-600">8 คน</div>
              <p className="text-xs text-muted-foreground mt-1">
                จากทั้งหมด 12 คน
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress and Controls */}
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
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="production-mode" 
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="production-mode">
                  โหมดการผลิตอัตโนมัติ
                </Label>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setProgress(Math.max(0, progress - 10))}
                >
                  ลด 10%
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setProgress(Math.min(100, progress + 10))}
                >
                  เพิ่ม 10%
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>การตั้งค่าการผลิต</CardTitle>
              <CardDescription>
                ปรับแต่งพารามิเตอร์การผลิต
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target">เป้าหมายการผลิต (ชิ้น)</Label>
                <Input 
                  id="target" 
                  type="number" 
                  placeholder="2000" 
                  defaultValue="2000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="speed">ความเร็วการผลิต (ชิ้น/ชั่วโมง)</Label>
                <Input 
                  id="speed" 
                  type="number" 
                  placeholder="500" 
                  defaultValue="500"
                />
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Settings className="mr-2 h-4 w-4" />
                  บันทึกการตั้งค่า
                </Button>
                <Button variant="outline" className="flex-1">
                  รีเซ็ต
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Card>
          <CardHeader>
            <CardTitle>รายละเอียดการผลิต</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
                <TabsTrigger value="analytics">สถิติ</TabsTrigger>
                <TabsTrigger value="alerts">การแจ้งเตือน</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">95%</div>
                    <div className="text-sm text-gray-600">ประสิทธิภาพ</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">ข้อผิดพลาด</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">2</div>
                    <div className="text-sm text-gray-600">การบำรุงรักษา</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-4 mt-4">
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-gray-400" />
                  <span className="ml-2 text-gray-500">กราฟสถิติการผลิต</span>
                </div>
              </TabsContent>
              
              <TabsContent value="alerts" className="space-y-4 mt-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    ระบบทำงานปกติ ไม่มีการแจ้งเตือน
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Badges Example */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">สถานะต่างๆ</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">กำลังดำเนินการ</Badge>
            <Badge variant="secondary">รอการตรวจสอบ</Badge>
            <Badge variant="destructive">ข้อผิดพลาด</Badge>
            <Badge variant="outline">บำรุงรักษา</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
