"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  CheckCircle2,
  Menu,
  CalendarIcon,
  ChevronDown,
  BarChart3,
  History,
  ClipboardList,
  CheckSquare,
  CheckCircle,
} from "lucide-react"
import { format } from "date-fns"
import { th } from "date-fns/locale"

export default function Component() {
  const [currentStep, setCurrentStep] = useState(4)
  const [isRunning, setIsRunning] = useState(true)
  const [startTime, setStartTime] = useState("09:34:14")
  const [endTime, setEndTime] = useState("09:41:47")
  const [duration, setDuration] = useState("00:07:33")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 6, 2)) // July 2, 2025
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const productionSteps = [
    {
      id: 1,
      name: "เตรียมอุปกรณ์",
      status: "completed",
      startTime: "09:34:14",
      duration: "00:07:33",
      endTime: "09:41:47",
    },
    {
      id: 2,
      name: "เตรียมวัตถุดิบ: ปอกหอมใหญ่ / ล้าง",
      status: "completed",
      startTime: "09:45:12",
      duration: "00:05:30",
      endTime: "09:50:42",
    },
    {
      id: 3,
      name: "เตรียมวัตถุดิบ: หั่นหอม",
      status: "completed",
      startTime: "09:50:45",
      duration: "00:02:15",
      endTime: "09:53:00",
    },
    {
      id: 4,
      name: "เตรียมวัตถุดิบ: ปั่นหอม / กรอง (1 นาที) / แพ็ค",
      status: "active",
      startTime: "09:53:05",
      duration: "-0:41:01",
      endTime: "--",
    },
    {
      id: 5,
      name: "เก็บล้างพื้นที่และอุปกรณ์",
      status: "pending",
      startTime: "--",
      duration: "--",
      endTime: "--",
    },
  ]

  const menuItems = [
    { icon: BarChart3, label: "แดชบอร์ด", href: "/dashboard" },
    { icon: History, label: "ประวัติการผลิต", href: "/history" },
    { icon: ClipboardList, label: "แผนงานผลิต", href: "/planning" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header with System Title and Navigation */}
      <div className="bg-gradient-to-r from-[#355e3b] to-[#2d5016] text-white py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Menu Button with Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-6 py-3 transition-all duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="w-5 h-5 mr-2" />
                เมนู
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`}
                />
              </Button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-300 transform origin-top ${
                  isMenuOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="py-2">
                  {menuItems.map((item, index) => (
                    <button
                      key={item.label}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors duration-200"
                      style={{
                        transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
                      }}
                    >
                      <item.icon className="w-5 h-5 text-[#355e3b]" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* System Title */}
            <h1 className="text-3xl font-semibold text-center flex-1">ระบบควบคุมกระบวนการผลิตครัวกลาง</h1>

            {/* Date Picker */}
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-6 py-3 transition-all duration-200"
                >
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  {format(selectedDate, "dd/MM/yyyy", { locale: th })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white shadow-xl border border-gray-200" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date)
                      setIsDatePickerOpen(false)
                    }
                  }}
                  initialFocus
                  className="rounded-lg"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Overlay for menu */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          <div className="grid grid-cols-10 gap-6">
            {/* Main Content - 60% */}
            <div className="col-span-6 space-y-4">
              {/* Header Card */}
              <Card className="bg-gray-50 border border-gray-200 shadow-xl h-[104px] flex items-center">
                <CardContent className="p-6 text-center w-full">
                  <h1 className="text-3xl font-semibold text-gray-800">งานที่ผลิต: Ankimo pate (เครื่องวัตถุดิบ)</h1>
                </CardContent>
              </Card>

              {/* Step Counter Card */}
              <Card className="bg-gray-50 border border-gray-200 shadow-2xl">
                <CardContent className="p-8">
                  <p className="text-center text-[#355e3b] mb-6 text-xl font-medium">กระบวนการที่</p>
                  <div className="flex items-center justify-center gap-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-20 h-20 bg-gradient-to-br from-[#355e3b] via-[#2d5016] to-[#1e3a0f] hover:from-[#2d5016] hover:via-[#1e3a0f] hover:to-[#0f1d08] border-2 border-[#355e3b]/70 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-95"
                      onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    >
                      <ChevronLeft className="w-10 h-10 text-white drop-shadow-lg" />
                    </Button>

                    <div className="bg-gradient-to-br from-[#355e3b] via-[#2d5016] to-[#1e3a0f] rounded-3xl p-10 border-2 border-[#355e3b]/70 shadow-2xl ring-4 ring-[#355e3b]/30">
                      <div className="text-8xl font-bold text-white text-center min-w-[160px] drop-shadow-2xl">
                        {currentStep.toString().padStart(2, "0")}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-20 h-20 bg-gradient-to-br from-[#355e3b] via-[#2d5016] to-[#1e3a0f] hover:from-[#2d5016] hover:via-[#1e3a0f] hover:to-[#0f1d08] border-2 border-[#355e3b]/70 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-95"
                      onClick={() => setCurrentStep(currentStep + 1)}
                    >
                      <ChevronRight className="w-10 h-10 text-white drop-shadow-lg" />
                    </Button>
                  </div>
                  <div className="flex justify-center mt-6">
                    <div className="border border-dashed border-gray-400 rounded px-3 py-1 bg-gray-100">
                      <p className="text-center text-gray-700 text-sm">เตรียมอุปกรณ์</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Display Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-[#355e3b]/10 to-[#2d5016]/10 border border-[#355e3b]/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-[#355e3b] text-lg font-bold mb-3 uppercase tracking-wide">เวลาเริ่ม</div>
                    <div className="text-4xl font-light text-[#2d5016]">{startTime}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-rose-700 text-lg font-bold mb-3 uppercase tracking-wide">เวลาสิ้นสุด</div>
                    <div className="text-4xl font-light text-rose-800">{endTime}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-blue-700 text-lg font-bold mb-3 uppercase tracking-wide">เวลาที่ใช้</div>
                    <div className="text-4xl font-light text-blue-800">{duration}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-br from-[#355e3b] via-[#2d5016] to-[#1e3a0f] hover:from-[#2d5016] hover:via-[#1e3a0f] hover:to-[#0f1d08] text-white px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium border-0"
                  onClick={() => setIsRunning(!isRunning)}
                >
                  <Play className="w-5 h-5 mr-3" />
                  เริ่มกระบวนการ
                </Button>

                <Button
                  size="lg"
                  className="bg-gradient-to-br from-rose-500 via-red-600 to-red-700 hover:from-rose-600 hover:via-red-700 hover:to-red-800 text-white px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium border-0"
                  onClick={() => setIsRunning(false)}
                >
                  <CheckCircle className="w-5 h-5 mr-3" />
                  สิ้นสุดกระบวนการ
                </Button>

                <Button
                  size="lg"
                  className="bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 hover:from-gray-400 hover:via-gray-500 hover:to-gray-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium border-0"
                >
                  <CheckSquare className="w-5 h-5 mr-3" />
                  สิ้นสุดการผลิต
                </Button>
              </div>
            </div>

            {/* Right Sidebar - 40% */}
            <div className="col-span-4 space-y-4">
              {/* Work Selection Card */}
              <Card className="bg-gray-50 border border-gray-200 shadow-xl h-[104px] flex items-center">
                <CardContent className="p-6 w-full">
                  <h3 className="text-gray-800 font-medium mb-4 text-lg">เลือกงานที่ผลิต</h3>
                  <Select defaultValue="work6">
                    <SelectTrigger className="bg-white border-gray-300 text-gray-800 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work6">งานที่ 6: Ankimo pate (เครื่องวัตถุดิบ)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Production Steps List */}
              <Card className="bg-gray-50 border border-gray-200 shadow-xl h-[520px] flex flex-col">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <h3 className="text-gray-800 font-medium text-lg">รายการกระบวนการผลิต</h3>
                  </div>

                  <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
                    <div className="space-y-3">
                      {productionSteps.map((step) => (
                        <div
                          key={step.id}
                          className={`p-4 rounded-lg border transition-all min-h-[100px] ${
                            step.status === "active"
                              ? "bg-[#355e3b] text-white border-[#2d5016]"
                              : step.status === "completed"
                                ? "bg-gray-100 text-gray-800 border-gray-300"
                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-sm font-medium ${
                                    step.status === "active" ? "text-white" : "text-gray-600"
                                  }`}
                                >
                                  {step.id}.
                                </span>
                                {step.status === "completed" && <CheckCircle2 className="w-4 h-4 text-[#355e3b]" />}
                                {step.status === "active" && <CheckCircle2 className="w-4 h-4 text-white" />}
                              </div>
                              <p
                                className={`text-base leading-relaxed ${
                                  step.status === "active" ? "text-white" : "text-gray-800"
                                }`}
                              >
                                {step.name}
                              </p>
                            </div>
                            <div className="text-right ml-4 text-sm">
                              <div
                                className={`font-bold ${step.status === "active" ? "text-[#7fb069]" : "text-[#355e3b]"}`}
                              >
                                เริ่ม: {step.startTime}
                              </div>
                              <div
                                className={`font-bold ${step.status === "active" ? "text-red-200" : "text-red-600"}`}
                              >
                                สิ้นสุด: {step.endTime}
                              </div>
                              <div
                                className={`font-bold ${step.status === "active" ? "text-blue-200" : "text-blue-600"}`}
                              >
                                ใช้เวลา: {step.duration}
                              </div>
                            </div>
                          </div>
                          {step.status === "active" && (
                            <div className="mt-3 pt-3 border-t border-white/20">
                              <div className="text-white text-sm font-medium">เริ่ม: {step.startTime}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-300">
                    <div className="text-center">
                      <div className="text-gray-600 text-base mb-1">เวลารวมของงาน</div>
                      <div className="text-gray-800 text-2xl font-bold">00:34:04</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
