"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Clock, Calendar, Play, Pause, CheckCircle, XCircle, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProductionItem {
  id: number
  name: string
  category: string
  startTime: string
  endTime: string
  duration: string
  actualDuration?: string
  status: "completed" | "in-progress" | "pending" | "cancelled"
  timeRange: string
  operator_names: string
  operator_codes: string
  actual_start_time?: string
  actual_end_time?: string
  production_minutes?: number
  standard_minutes?: number
}

export default function ProductionDashboard() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentTime, setCurrentTime] = useState<string>("")
  const [mounted, setMounted] = useState(false)
  const [productionData, setProductionData] = useState<ProductionItem[]>([])
  const [error, setError] = useState<string | null>(null)

  // ดึงข้อมูลจาก API (แยกเป็นฟังก์ชัน)
  const fetchWorkplans = () => {
    fetch("/api/workplans")
      .then((res) => {
        if (!res.ok) throw new Error('API error')
        return res.json()
      })
      .then((data) => {
        // mapping ข้อมูลจาก API ที่รวมข้อมูลแล้ว
        const mapped: ProductionItem[] = data.map((item: any) => {
          let duration = "-"
          if (item.start_time && item.end_time) {
            const [sh, sm] = item.start_time.split(":").map(Number)
            const [eh, em] = item.end_time.split(":").map(Number)
            let start = sh * 60 + sm
            let end = eh * 60 + em
            let diff = end - start
            if (diff < 0) diff += 24 * 60
            const h = Math.floor(diff / 60)
            const m = diff % 60
            duration = `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}`
          }
          let status: "completed" | "in-progress" | "pending" | "cancelled" = "pending"
          if (item.status === "เสร็จสิ้น") status = "completed"
          else if (item.status === "กำลังดำเนินการ") status = "in-progress"
          else if (item.status === "รอดำเนินการ") status = "pending"
          return {
            id: item.id,
            name: item.job_name || "-",
            category: item.job_code || "-",
            startTime: item.start_time ? item.start_time.slice(0, 5) : "-",
            endTime: item.end_time ? item.end_time.slice(0, 5) : "-",
            duration,
            status,
            timeRange: item.start_time && item.end_time ? `${item.start_time.slice(0,5)}-${item.end_time.slice(0,5)}` : "-",
            operator_names: item.operator_names || "-",
            operator_codes: item.operator_codes || "-",
            actual_start_time: item.actual_start_time,
            actual_end_time: item.actual_end_time,
            production_minutes: item.production_minutes,
            standard_minutes: item.standard_minutes
          }
        })
        setProductionData(mapped)
        setError(null)
      })
      .catch((err) => {
        console.error('Fetch error:', err)
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูลตารางงาน กรุณาตรวจสอบการเชื่อมต่อหรือ API')
      })
  }

  useEffect(() => {
    fetchWorkplans()
    const interval = setInterval(fetchWorkplans, 60000) // 1 นาที
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setMounted(true)
    setSelectedDate(new Date())
    
    // อัปเดตเวลาทุกวินาที
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 text-lg">เสร็จสิ้น</Badge>
      case "in-progress":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-lg">กำลังดำเนินการ</Badge>
      case "pending":
        return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100 text-lg">รอดำเนินการ</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-lg">ยกเลิก</Badge>
      default:
        return <Badge variant="secondary" className="text-lg">ไม่ทราบสถานะ</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-8 h-8 text-white" />
      case "in-progress":
        return <Play className="w-8 h-8 text-white" />
      case "pending":
        return <Pause className="w-8 h-8 text-white" />
      case "cancelled":
        return <XCircle className="w-8 h-8 text-white" />
      default:
        return <Clock className="w-8 h-8 text-white" />
    }
  }

  // Status config (นับจำนวนงานตามสถานะจริง)
  const statusConfig = {
    completed: { 
      label: "เสร็จสิ้น", 
      color: "bg-gradient-to-br from-green-700 via-green-800 to-emerald-900", 
      count: productionData.filter(item => item.status === "completed").length 
    },
    "in-progress": {
      label: "กำลังดำเนินการ",
      color: "bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600",
      count: productionData.filter(item => item.status === "in-progress").length,
    },
    pending: { 
      label: "รอดำเนินการ", 
      color: "bg-gradient-to-br from-slate-600 via-gray-600 to-zinc-700", 
      count: productionData.filter(item => item.status === "pending").length 
    },
    cancelled: { 
      label: "งานที่ถูกยกเลิก", 
      color: "bg-gradient-to-br from-red-600 via-rose-600 to-pink-700", 
      count: productionData.filter(item => item.status === "cancelled").length 
    },
  }

  const statusBgMap: Record<string, string> = {
    completed: "/images/completed-dish-background.jpg",
    "in-progress": "/images/clean-kitchen-background.jpg",
    pending: "/images/storage-room-background.jpg",
    cancelled: "/images/quality-control-background.jpg",
  }
  const statusIconMap: Record<string, JSX.Element> = {
    completed: <CheckCircle className="w-16 h-16" />,
    "in-progress": <Play className="w-16 h-16" />,
    pending: <Pause className="w-16 h-16" />,
    cancelled: <XCircle className="w-16 h-16" />,
  }

  // แบ่งข้อมูลเป็น 2 ตาราง ตารางละครึ่ง
  const mid = Math.ceil(productionData.length / 2)
  const leftTableData = productionData.slice(0, mid)
  const rightTableData = productionData.slice(mid)

  const ProductionTable = ({ data, title, startIndex = 0 }: { data: ProductionItem[]; title: string; startIndex?: number }) => (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-[10px] overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed font-noto-thai">
            <thead className="bg-emerald-900 rounded-t-xl">
              <tr>
                <th className="px-2 py-3 text-center text-xl md:text-2xl font-black text-white w-12 tracking-wide">งานที่</th>
                <th className="px-2 py-3 text-center text-xl md:text-2xl font-black text-white w-56 tracking-wide">ชื่องาน</th>
                <th className="px-2 py-3 text-center text-xl md:text-2xl font-black text-white w-16 tracking-wide">เวลาเริ่ม</th>
                <th className="px-2 py-3 text-center text-xl md:text-2xl font-black text-white w-16 tracking-wide">เวลาผลิต</th>
                <th className="px-2 py-3 text-center text-xl md:text-2xl font-black text-white w-16 tracking-wide">เวลามาตรฐาน</th>
                <th className="px-2 py-3 text-center text-xl md:text-2xl font-black text-white w-16 tracking-wide">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100 font-noto-thai">
              {data.map((item, idx) => {
                // เวลาเริ่มจริง (ถ้ามี log start) ไม่งั้นใช้ start_time
                const startTimeDisplay = item.actual_start_time
                  ? item.actual_start_time.slice(11, 16)
                  : item.startTime;
                // เวลาผลิตจริง (production_minutes)
                const prodMinutes = item.production_minutes;
                const prodDisplay = prodMinutes != null && prodMinutes >= 0
                  ? `${Math.floor(prodMinutes / 60)}:${(prodMinutes % 60).toString().padStart(2, '0')}`
                  : '-';
                // เวลามาตรฐาน (standard_minutes)
                const stdMinutes = item.standard_minutes;
                const stdDisplay = stdMinutes != null && stdMinutes >= 0
                  ? `${Math.floor(stdMinutes / 60)}:${(stdMinutes % 60).toString().padStart(2, '0')}`
                  : '-';
                // เวลาแผน (start-end)
                const planRange = item.startTime && item.endTime ? `${item.startTime}-${item.endTime}` : '-';
                return (
                  <React.Fragment key={item.id}>
                    {/* แถวบน */}
                    <tr
                  className={`hover:bg-gradient-to-r hover:from-emerald-25 hover:via-green-25 hover:to-white-0 transition-all duration-200 ${
                        selectedStatus && item.status !== selectedStatus ? 'opacity-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3 align-top text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-800 text-white rounded-full flex items-center justify-center text-4xl font-black">
                          {startIndex + idx + 1}
                    </div>
                  </td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col items-start">
                          <span className="font-black text-2xl md:text-3xl text-slate-900 mb-1 max-w-[22rem] truncate whitespace-nowrap overflow-ellipsis block">{item.name}</span>
                          <span className="text-emerald-700 text-lg md:text-xl font-medium">{item.operator_names}</span>
                          <span className="text-slate-500 text-lg md:text-xl">{planRange}</span>
                    </div>
                  </td>
                      <td className="px-4 py-3 align-middle text-center">
                        <span className={`font-noto-thai font-black text-4xl font-extrabold ${prodDisplay !== '-' ? 'text-purple-700' : 'text-slate-900'}`}>{startTimeDisplay}</span>
                      </td>
                      <td className="px-4 py-3 align-middle text-center">
                        <span className="font-noto-thai font-black text-blue-700 text-4xl font-extrabold">{prodDisplay}</span>
                      </td>
                      <td className="px-4 py-3 align-middle text-center">
                        <span className="font-noto-thai font-black text-orange-700 text-4xl font-extrabold">{stdDisplay}</span>
                      </td>
                      <td className="px-4 py-3 align-middle text-center">
                        {getStatusBadge(item.status)}
                  </td>
                </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )

  // ไม่แสดงเนื้อหาจนกว่าจะ mounted แล้ว
  if (!mounted) {
    return (
      <div className="font-noto-thai min-h-screen flex items-center justify-center">
        <div className="text-3xl text-slate-600">กำลังโหลด...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="font-noto-thai min-h-screen flex items-center justify-center">
        <div className="text-3xl text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="font-noto-thai">
      {/* Content with relative positioning */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white shadow-2xl border-b border-gray-200">
          <div className="w-full px-6 py-6">
            <div className="flex items-center justify-between">
              {/* Left Side - JDN Logo */}
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <Image src="/images/jdn-logo.png" alt="JDN Logo" width={60} height={40} className="object-contain" />
                </div>
                <div>
                  <h1 className="text-6xl font-black mb-2 text-slate-800">ตารางงานการผลิตสินค้าครัวกลาง</h1>
                </div>
              </div>

              {/* Right Side - Brand Logos and Date/Time */}
              <div className="flex items-center gap-6">
                {/* Brand Logos */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <Image src="/images/banana-leaf-logo.png" alt="Banana Leaf Logo" width={60} height={40} className="object-contain" />
                  <Image src="/images/shabu101-logo.jpg" alt="Shabu 101 Logo" width={60} height={40} className="object-contain" />
                  <Image src="/images/meating-house-logo.png" alt="The Meating House Logo" width={60} height={40} className="object-contain" />
                </div>

                {/* Date and Time */}
                <div className="text-right">
                  <div className="flex items-center gap-2 text-slate-600 mb-1">
                    <Calendar className="w-6 h-6" />
                    <input
                      type="date"
                      value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      className="text-xl bg-transparent border-none outline-none cursor-pointer hover:text-slate-800 transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Clock className="w-6 h-6" />
                    <span className="text-3xl font-black">{currentTime}</span>
                  </div>
                </div>

                {/* Navigation Button */}
                <div className="flex items-center">
                  <a href="http://localhost:3001/logs" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      จัดการ Logs
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container with Background */}
        <div className="w-full px-3 py-2">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-2">
              {Object.entries(statusConfig).map(([key, config]) => (
                <Card key={key} className="relative overflow-hidden border-0 shadow-lg h-32 md:h-32">
                  {/* ภาพพื้นหลัง */}
                  <Image src={statusBgMap[key] || ""} alt="bg" fill className="object-cover" style={{zIndex:1}} />
                  {/* overlay มืด */}
                  <div className="absolute inset-0 bg-black/40 z-10"></div>
                  <CardContent className="p-3 md:p-4 relative z-20 h-full flex flex-col justify-between">
                      <div>
                      <p className="text-2xl md:text-3xl font-bold mb-1 text-white drop-shadow">{config.label}</p>
                      <p className="text-4xl md:text-5xl font-bold text-white drop-shadow">{config.count} งาน</p>
                      </div>
                    {/* ไอคอน overlay มุมขวาล่าง */}
                    <div className="absolute bottom-2 right-2 text-white opacity-90 z-30">
                      {statusIconMap[key]}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <ProductionTable data={leftTableData} title="ตารางงานการผลิตสินค้าครัวกลาง" startIndex={0} />
              <ProductionTable data={rightTableData} title="ตารางงานการผลิตสินค้าครัวกลาง" startIndex={leftTableData.length} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}