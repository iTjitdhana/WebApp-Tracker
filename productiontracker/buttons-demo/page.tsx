"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Plus, 
  Minus,
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
  RefreshCw,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Star,
  Heart,
  Share,
  Copy,
  Save,
  Cancel,
  Confirm,
  Warning,
  Info,
  Success,
  Error
} from "lucide-react"

export default function ButtonsDemoPage() {
  const [isActive, setIsActive] = useState(false)
  const [sliderValue, setSliderValue] = useState([50])
  const [selectedOption, setSelectedOption] = useState("")
  const [checkboxValue, setCheckboxValue] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎛️ UI Components Demo
          </h1>
          <p className="text-gray-600 text-lg">
            ตัวอย่างปุ่มกดและ UI Components ต่างๆ
          </p>
        </div>

        {/* Basic Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>ปุ่มพื้นฐาน (Basic Buttons)</CardTitle>
            <CardDescription>
              ปุ่มกดพื้นฐานที่มีรูปแบบต่างๆ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>ปุ่มปกติ</Button>
              <Button variant="secondary">ปุ่มรอง</Button>
              <Button variant="outline">ปุ่มขอบ</Button>
              <Button variant="ghost">ปุ่มโปร่ง</Button>
              <Button variant="destructive">ปุ่มลบ</Button>
              <Button variant="link">ปุ่มลิงก์</Button>
            </div>
            
            <Separator />
            
            <div className="flex flex-wrap gap-2">
              <Button size="sm">ขนาดเล็ก</Button>
              <Button size="default">ขนาดปกติ</Button>
              <Button size="lg">ขนาดใหญ่</Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>ปุ่มการทำงาน (Action Buttons)</CardTitle>
            <CardDescription>
              ปุ่มกดสำหรับการทำงานต่างๆ พร้อมไอคอน
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => alert("เริ่มการทำงาน!")}
              >
                <Play className="mr-2 h-4 w-4" />
                เริ่ม
              </Button>
              
              <Button 
                variant="outline" 
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
                onClick={() => alert("หยุดชั่วคราว!")}
              >
                <Pause className="mr-2 h-4 w-4" />
                หยุด
              </Button>
              
              <Button 
                variant="destructive"
                onClick={() => alert("หยุดการทำงาน!")}
              >
                <Stop className="mr-2 h-4 w-4" />
                หยุด
              </Button>
              
              <Button 
                variant="secondary"
                onClick={() => alert("รีเฟรชข้อมูล!")}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                รีเฟรช
              </Button>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                ดาวน์โหลด
              </Button>
              
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                อัปโหลด
              </Button>
              
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                แก้ไข
              </Button>
              
              <Button variant="outline">
                <Trash2 className="mr-2 h-4 w-4" />
                ลบ
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>ตัวควบคุม (Controls)</CardTitle>
              <CardDescription>
                ตัวอย่างการใช้งาน Switch, Slider, และ Checkbox
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="demo-switch" 
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="demo-switch">
                  โหมดอัตโนมัติ {isActive ? "(เปิด)" : "(ปิด)"}
                </Label>
              </div>
              
              <div className="space-y-2">
                <Label>ระดับความเร็ว: {sliderValue[0]}%</Label>
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="demo-checkbox"
                  checked={checkboxValue}
                  onCheckedChange={setCheckboxValue}
                />
                <Label htmlFor="demo-checkbox">
                  ยอมรับเงื่อนไข {checkboxValue ? "✓" : ""}
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ฟอร์ม (Form Elements)</CardTitle>
              <CardDescription>
                ตัวอย่าง Input, Select, และ Radio Group
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="demo-input">ชื่อผลิตภัณฑ์</Label>
                <Input 
                  id="demo-input" 
                  placeholder="ใส่ชื่อผลิตภัณฑ์..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="demo-select">ประเภทผลิตภัณฑ์</Label>
                <Select value={selectedOption} onValueChange={setSelectedOption}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภท" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">อาหาร</SelectItem>
                    <SelectItem value="beverage">เครื่องดื่ม</SelectItem>
                    <SelectItem value="snack">ขนมขบเคี้ยว</SelectItem>
                    <SelectItem value="dessert">ของหวาน</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>คุณภาพผลิตภัณฑ์</Label>
                <RadioGroup defaultValue="high">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">ต่ำ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">ปานกลาง</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">สูง</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Badges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>แบดจ์สถานะ (Status Badges)</CardTitle>
            <CardDescription>
              แสดงสถานะต่างๆ ด้วย Badge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">กำลังดำเนินการ</Badge>
              <Badge variant="secondary">รอการตรวจสอบ</Badge>
              <Badge variant="destructive">ข้อผิดพลาด</Badge>
              <Badge variant="outline">บำรุงรักษา</Badge>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                สำเร็จ
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                เตือน
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                ข้อมูล
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Alert Examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>การแจ้งเตือน (Alerts)</CardTitle>
            <CardDescription>
              ตัวอย่างการแสดงข้อความแจ้งเตือน
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                การทำงานเสร็จสิ้นเรียบร้อยแล้ว
              </AlertDescription>
            </Alert>
            
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                มีการแจ้งเตือน: ระบบจะปิดปรับปรุงในอีก 30 นาที
              </AlertDescription>
            </Alert>
            
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                เกิดข้อผิดพลาด: ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Tabs Demo */}
        <Card>
          <CardHeader>
            <CardTitle>แท็บ (Tabs)</CardTitle>
            <CardDescription>
              ตัวอย่างการใช้งาน Tabs component
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="buttons" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="buttons">ปุ่มกด</TabsTrigger>
                <TabsTrigger value="forms">ฟอร์ม</TabsTrigger>
                <TabsTrigger value="status">สถานะ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="buttons" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline">
                    <Plus className="mr-1 h-3 w-3" />
                    เพิ่ม
                  </Button>
                  <Button size="sm" variant="outline">
                    <Minus className="mr-1 h-3 w-3" />
                    ลบ
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="mr-1 h-3 w-3" />
                    ดู
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="mr-1 h-3 w-3" />
                    คัดลอก
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="forms" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>ค้นหา</Label>
                  <div className="flex gap-2">
                    <Input placeholder="พิมพ์เพื่อค้นหา..." />
                    <Button size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="status" className="space-y-4 mt-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">ออนไลน์</Badge>
                  <Badge variant="secondary">ไม่ว่าง</Badge>
                  <Badge variant="destructive">ออฟไลน์</Badge>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            ← กลับไปหน้าหลัก
          </Button>
        </div>
      </div>
    </div>
  )
} 