"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Plus,
  Calendar,
  Clock,
  Users,
  Target,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  FileText,
  Filter,
  Search,
  TrendingUp,
  TrendingDown
} from "lucide-react"

export default function WorkplansPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const workplans = [
    {
      id: 1,
      title: "แผนการผลิตอาหารไทย",
      description: "การผลิตอาหารไทยสำหรับสัปดาห์นี้",
      status: "active",
      priority: "high",
      startDate: "2024-01-15",
      endDate: "2024-01-21",
      assignedTo: "ทีม A",
      progress: 75,
      tasks: [
        { id: 1, name: "เตรียมวัตถุดิบ", completed: true },
        { id: 2, name: "ปรุงอาหาร", completed: true },
        { id: 3, name: "ตรวจสอบคุณภาพ", completed: false },
        { id: 4, name: "บรรจุภัณฑ์", completed: false }
      ]
    },
    {
      id: 2,
      title: "แผนการผลิตขนมหวาน",
      description: "การผลิตขนมหวานสำหรับเทศกาล",
      status: "pending",
      priority: "medium",
      startDate: "2024-01-20",
      endDate: "2024-01-25",
      assignedTo: "ทีม B",
      progress: 30,
      tasks: [
        { id: 1, name: "เตรียมสูตร", completed: true },
        { id: 2, name: "ผสมส่วนผสม", completed: false },
        { id: 3, name: "อบขนม", completed: false },
        { id: 4, name: "ตกแต่ง", completed: false }
      ]
    },
    {
      id: 3,
      title: "แผนการผลิตเครื่องดื่ม",
      description: "การผลิตเครื่องดื่มเย็น",
      status: "completed",
      priority: "low",
      startDate: "2024-01-10",
      endDate: "2024-01-14",
      assignedTo: "ทีม C",
      progress: 100,
      tasks: [
        { id: 1, name: "เตรียมน้ำ", completed: true },
        { id: 2, name: "ผสมเครื่องดื่ม", completed: true },
        { id: 3, name: "บรรจุขวด", completed: true },
        { id: 4, name: "ตรวจสอบคุณภาพ", completed: true }
      ]
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">กำลังดำเนินการ</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">รอดำเนินการ</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">เสร็จสิ้น</Badge>
      default:
        return <Badge variant="outline">ไม่ระบุ</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">สูง</Badge>
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800">ปานกลาง</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">ต่ำ</Badge>
      default:
        return <Badge variant="outline">ไม่ระบุ</Badge>
    }
  }

  const filteredWorkplans = workplans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📋 Work Plans
              </h1>
              <p className="text-gray-600 text-lg">
                จัดการแผนงานการผลิต
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                สร้างแผนงานใหม่
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="ค้นหาแผนงาน..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Work Plans Content */}
        <Card>
          <CardHeader>
            <CardTitle>แผนงานการผลิต</CardTitle>
            <CardDescription>
              รายการแผนงานทั้งหมด
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                <TabsTrigger value="active">กำลังดำเนินการ</TabsTrigger>
                <TabsTrigger value="pending">รอดำเนินการ</TabsTrigger>
                <TabsTrigger value="completed">เสร็จสิ้น</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredWorkplans.map((plan) => (
                    <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{plan.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(plan.status)}
                            {getPriorityBadge(plan.priority)}
                          </div>
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-gray-500">วันที่เริ่ม</Label>
                            <div className="flex items-center mt-1">
                              <Calendar className="mr-1 h-3 w-3" />
                              {plan.startDate}
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-500">วันที่สิ้นสุด</Label>
                            <div className="flex items-center mt-1">
                              <Calendar className="mr-1 h-3 w-3" />
                              {plan.endDate}
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-500">มอบหมายให้</Label>
                            <div className="flex items-center mt-1">
                              <Users className="mr-1 h-3 w-3" />
                              {plan.assignedTo}
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-500">ความคืบหน้า</Label>
                            <div className="flex items-center mt-1">
                              <Target className="mr-1 h-3 w-3" />
                              {plan.progress}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">งานย่อย</Label>
                          <div className="space-y-1">
                            {plan.tasks.map((task) => (
                              <div key={task.id} className="flex items-center space-x-2 text-sm">
                                {task.completed ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-gray-400" />
                                )}
                                <span className={task.completed ? "line-through text-gray-500" : ""}>
                                  {task.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="active" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredWorkplans.filter(plan => plan.status === "active").map((plan) => (
                    <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{plan.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(plan.status)}
                            {getPriorityBadge(plan.priority)}
                          </div>
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-gray-500">วันที่เริ่ม</Label>
                            <div className="flex items-center mt-1">
                              <Calendar className="mr-1 h-3 w-3" />
                              {plan.startDate}
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-500">วันที่สิ้นสุด</Label>
                            <div className="flex items-center mt-1">
                              <Calendar className="mr-1 h-3 w-3" />
                              {plan.endDate}
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-500">มอบหมายให้</Label>
                            <div className="flex items-center mt-1">
                              <Users className="mr-1 h-3 w-3" />
                              {plan.assignedTo}
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-500">ความคืบหน้า</Label>
                            <div className="flex items-center mt-1">
                              <Target className="mr-1 h-3 w-3" />
                              {plan.progress}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredWorkplans.filter(plan => plan.status === "pending").map((plan) => (
                    <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{plan.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(plan.status)}
                            {getPriorityBadge(plan.priority)}
                          </div>
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-gray-500">วันที่เริ่ม</Label>
                            <div className="flex items-center mt-1">
                              <Calendar className="mr-1 h-3 w-3" />
                              {plan.startDate}
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-500">วันที่สิ้นสุด</Label>
                            <div className="flex items-center mt-1">
                              <Calendar className="mr-1 h-3 w-3" />
                              {plan.endDate}
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-500">มอบหมายให้</Label>
                            <div className="flex items-center mt-1">
                              <Users className="mr-1 h-3 w-3" />
                              {plan.assignedTo}
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-500">ความคืบหน้า</Label>
                            <div className="flex items-center mt-1">
                              <Target className="mr-1 h-3 w-3" />
                              {plan.progress}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredWorkplans.filter(plan => plan.status === "completed").map((plan) => (
                    <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{plan.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(plan.status)}
                            {getPriorityBadge(plan.priority)}
                          </div>
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-gray-500">วันที่เริ่ม</Label>
                            <div className="flex items-center mt-1">
                              <Calendar className="mr-1 h-3 w-3" />
                              {plan.startDate}
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-500">วันที่สิ้นสุด</Label>
                            <div className="flex items-center mt-1">
                              <Calendar className="mr-1 h-3 w-3" />
                              {plan.endDate}
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-500">มอบหมายให้</Label>
                            <div className="flex items-center mt-1">
                              <Users className="mr-1 h-3 w-3" />
                              {plan.assignedTo}
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-500">ความคืบหน้า</Label>
                            <div className="flex items-center mt-1">
                              <Target className="mr-1 h-3 w-3" />
                              {plan.progress}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{workplans.length}</div>
                <div className="text-sm text-gray-600">แผนงานทั้งหมด</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{workplans.filter(p => p.status === "active").length}</div>
                <div className="text-sm text-gray-600">กำลังดำเนินการ</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{workplans.filter(p => p.status === "pending").length}</div>
                <div className="text-sm text-gray-600">รอดำเนินการ</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{workplans.filter(p => p.status === "completed").length}</div>
                <div className="text-sm text-gray-600">เสร็จสิ้น</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 