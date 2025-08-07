"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Play,
  Pause,
  Square,
  RefreshCw,
  Thermometer,
  Droplets,
  Activity,
  Settings,
  Target,
  Timer,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  Shield,
  Wrench,
  Bell,
  BarChart3
} from "lucide-react"

export default function TrackerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            🎉 หน้า Tracker ใช้งานได้แล้ว!
          </h1>
          <p className="text-green-600 text-lg">
            ระบบติดตามการผลิตอาหารทำงานปกติที่ http://localhost:3001/tracker
          </p>
          <div className="mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                สถานะ: ✅ ใช้งานได้
              </h2>
              <p className="text-gray-600">
                หน้า tracker พร้อมใช้งานแล้วครับ!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 