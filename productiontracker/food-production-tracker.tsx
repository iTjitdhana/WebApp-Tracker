"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Play, Square, Menu, Clock, CheckCircle2 } from "lucide-react"

export default function Component() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState("09:34:14")
  const [endTime, setEndTime] = useState("09:41:47")
  const [duration, setDuration] = useState("00:07:33")
  const [currentTime, setCurrentTime] = useState("00:34:04")

  const productionSteps = [
    { id: 4, name: "เครื่องวัตถุดิบ: ปั่นทอง / กวาง (1 ชาก) / แก้ก", status: "pending", time: "--", duration: "--" },
    { id: 5, name: "เครื่องวัตถุดิบ: คั่นแล้วกะเทียม / ข้าง", status: "active", time: "09:52:37", duration: "3-43-25" },
    { id: 6, name: "เครื่องวัตถุดิบ: ปั่น / แก้ก", status: "pending", time: "--", duration: "--" },
    { id: 7, name: "เครื่องวัตถุดิบ: ผึ่งผักโขม / แก้ก", status: "pending", time: "--", duration: "--" },
    { id: 8, name: "เก็บน้ำงานที่และอุปกรณ์", status: "pending", time: "--", duration: "--" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">ระบบจับเวลาการผลิต</h1>
              <p className="text-white/70">Food Production Timer</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/90 font-medium">02/07/2025</span>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Menu className="w-4 h-4 mr-2" />
                เมนู
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Timer Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info */}
            <Card className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    งานที่ผลิต: Ankimo pate (เครื่องวัตถุดิบ) (02/07/2025)
                  </h2>
                  <p className="text-white/70">เครื่องอุปกรณ์</p>
                </div>
              </CardContent>
            </Card>

            {/* Step Counter */}
            <Card className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl p-8 min-w-[120px] text-center shadow-2xl border border-green-700/50">
                    <div className="text-6xl font-bold text-white mb-2">{currentStep.toString().padStart(2, "0")}</div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    onClick={() => setCurrentStep(currentStep + 1)}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-center text-white/70 mt-4">ขั้นตอนที่</p>
              </CardContent>
            </Card>

            {/* Time Display */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm border-emerald-400/30">
                <CardContent className="p-6 text-center">
                  <div className="text-emerald-300 text-sm mb-2">เวลาเริ่ม</div>
                  <div className="text-2xl font-bold text-white">{startTime}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-rose-500/20 to-red-500/20 backdrop-blur-sm border-rose-400/30">
                <CardContent className="p-6 text-center">
                  <div className="text-rose-300 text-sm mb-2">เวลาสิ้นสุด</div>
                  <div className="text-2xl font-bold text-white">{endTime}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border-blue-400/30">
                <CardContent className="p-6 text-center">
                  <div className="text-blue-300 text-sm mb-2">เวลาที่ใช้</div>
                  <div className="text-2xl font-bold text-white">{duration}</div>
                </CardContent>
              </Card>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-8 py-3 rounded-xl shadow-lg"
                onClick={() => setIsRunning(!isRunning)}
              >
                <Play className="w-5 h-5 mr-2" />
                เริ่มงาน
              </Button>

              <Button
                size="lg"
                variant="destructive"
                className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white px-8 py-3 rounded-xl shadow-lg"
                onClick={() => setIsRunning(false)}
              >
                <Square className="w-5 h-5 mr-2" />
                หยุดงาน
              </Button>
            </div>

            {/* Additional Info */}
            <Card className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <p className="text-white/70">ยังไม่มีข้อมูล</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Step Selection */}
            <Card className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-4">งานที่ผลิต</h3>
                <Select defaultValue="step6">
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="step6">งานที่ 6: Ankimo pate (เครื่องวัตถุดิบ)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Production Steps */}
            <Card className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-white/70" />
                  <h3 className="text-white font-semibold">รายการขั้นตอนการผลิต</h3>
                </div>

                <div className="space-y-3">
                  {productionSteps.map((step) => (
                    <div
                      key={step.id}
                      className={`p-4 rounded-lg border transition-all ${
                        step.status === "active"
                          ? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-400/30"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-white/70 text-sm">{step.id}.</span>
                            {step.status === "active" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          </div>
                          <p className="text-white text-sm leading-relaxed">{step.name}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-white/70 text-xs">เริ่ม:</div>
                          <div className="text-white text-sm font-mono">{step.time}</div>
                          <div className="text-white/70 text-xs mt-1">ใช้เวลา:</div>
                          <div className="text-white text-sm font-mono">{step.duration}</div>
                        </div>
                      </div>
                      {step.status === "active" && (
                        <div className="mt-3 pt-3 border-t border-emerald-400/20">
                          <div className="text-emerald-300 text-sm">
                            เวลา: {step.time} | ใช้เวลา: {step.duration}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-white/70 text-sm">เวลารวมของงาน</div>
                    <div className="text-white text-lg font-bold">{currentTime}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
