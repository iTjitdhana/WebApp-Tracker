"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Calendar, Edit, Save, X, Search, RefreshCw, Download, FileText } from "lucide-react"
import { format } from "date-fns"
import { th } from "date-fns/locale"

interface LogEntry {
  id: number
  work_plan_id: number | null
  process_number: number | null
  status: 'start' | 'stop'
  timestamp: string
}

interface WorkPlan {
  id: number
  job_name: string
  job_code: string
}

interface ExportOptions {
  startDate: string
  endDate: string
  workPlanId: string
  includeWorkplans: boolean
  exportDeviceId: boolean
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [workPlans, setWorkPlans] = useState<WorkPlan[]>([])
  const [allWorkPlans, setAllWorkPlans] = useState<WorkPlan[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<Partial<LogEntry>>({})
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingDate, setEditingDate] = useState<string>("")
  const [editingTime, setEditingTime] = useState<string>("")
  const [sortBy, setSortBy] = useState<'job_name' | 'process_number' | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Export states
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    workPlanId: 'all',
    includeWorkplans: false,
    exportDeviceId: false
  })
  const [exporting, setExporting] = useState(false)

  // Job name input states
  const [jobNameInput, setJobNameInput] = useState("")
  const [showJobNameSuggestions, setShowJobNameSuggestions] = useState(false)
  const [jobNameSuggestions, setJobNameSuggestions] = useState<string[]>([])

  // ดึงข้อมูล work plans สำหรับวันที่เลือก
  useEffect(() => {
    if (!selectedDate) return;
    fetch(`/api/workplans?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        setWorkPlans(data)
      })
      .catch((error) => {
        console.error("Error fetching work plans:", error)
      })
  }, [selectedDate])

  // ดึงข้อมูล work plans ทั้งหมดสำหรับ export
  useEffect(() => {
    fetch('/api/workplans/all')
      .then((res) => res.json())
      .then((data) => {
        setAllWorkPlans(data)
      })
      .catch((error) => {
        console.error("Error fetching all work plans:", error)
      })
  }, [])

  // ดึงข้อมูล logs ตามวันที่
  const fetchLogs = async (date: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/logs?date=${date}`)
      const data = await response.json()
      setLogs(data)
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs(selectedDate)
  }, [selectedDate])

  // เริ่มการแก้ไข
  const startEditing = (log: LogEntry) => {
    setEditingId(log.id)
    setEditingData({
      work_plan_id: log.work_plan_id,
      process_number: log.process_number,
      status: log.status,
      timestamp: log.timestamp
    })
    // แยกวันและเวลา
    const d = new Date(log.timestamp)
    setEditingDate(d.toISOString().slice(0, 10))
    setEditingTime(d.toTimeString().slice(0, 8))
  }

  // ยกเลิกการแก้ไข
  const cancelEditing = () => {
    setEditingId(null)
    setEditingData({})
    setEditingDate("")
    setEditingTime("")
  }

  // บันทึกการแก้ไข
  const saveEdit = async () => {
    if (!editingId) return
    // รวมวันและเวลา - ตรวจสอบว่าเวลาเป็น 24 ชั่วโมง
    let newTimestamp = editingData.timestamp
    if (editingDate && editingTime) {
      // ตรวจสอบว่า editingTime เป็นรูปแบบ HH:mm:ss หรือไม่
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
      if (timeRegex.test(editingTime)) {
        newTimestamp = `${editingDate} ${editingTime}`
      } else {
        // ถ้าไม่ใช่ 24 ชั่วโมง ให้แปลงเป็น 24 ชั่วโมง
        const [hours, minutes, seconds] = editingTime.split(':').map(Number)
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        newTimestamp = `${editingDate} ${formattedTime}`
      }
    }
    try {
      const response = await fetch(`/api/logs/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...editingData, timestamp: newTimestamp }),
      })
      if (response.ok) {
        setLogs(logs.map(log => 
          log.id === editingId 
            ? { ...log, ...editingData, timestamp: newTimestamp }
            : log
        ))
        setEditingId(null)
        setEditingData({})
        setEditingDate("")
        setEditingTime("")
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
      }
    } catch (error) {
      console.error("Error saving log:", error)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    }
  }

  // ลบ log
  const deleteLog = async (id: number) => {
    if (!confirm('คุณต้องการลบ log นี้หรือไม่?')) return

    try {
      const response = await fetch(`/api/logs/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setLogs(logs.filter(log => log.id !== id))
      } else {
        alert('เกิดข้อผิดพลาดในการลบข้อมูล')
      }
    } catch (error) {
      console.error("Error deleting log:", error)
      alert('เกิดข้อผิดพลาดในการลบข้อมูล')
    }
  }

  // กรองข้อมูลตาม search term
  const filteredLogs = logs
    .filter(log => {
      const workPlan = workPlans.find(wp => wp.id === log.work_plan_id)
      const searchLower = searchTerm.toLowerCase()
      return (
        log.id.toString().includes(searchLower) ||
        (workPlan?.job_name || '').toLowerCase().includes(searchLower) ||
        (workPlan?.job_code || '').toLowerCase().includes(searchLower) ||
        log.status.toLowerCase().includes(searchLower)
      )
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      if (sortBy === 'job_name') {
        const nameA = (workPlans.find(wp => wp.id === a.work_plan_id)?.job_name || '').toLowerCase();
        const nameB = (workPlans.find(wp => wp.id === b.work_plan_id)?.job_name || '').toLowerCase();
        if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
        if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
      if (sortBy === 'process_number') {
        const numA = a.process_number || 0;
        const numB = b.process_number || 0;
        if (numA < numB) return sortOrder === 'asc' ? -1 : 1;
        if (numA > numB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
      return 0;
    });

  const getWorkPlanName = (workPlanId: number | null) => {
    const workPlan = workPlans.find(wp => wp.id === workPlanId)
    return workPlan ? `${workPlan.job_name} (${workPlan.job_code})` : '-'
  }

  const getStatusBadge = (status: string) => {
    return status === 'start' 
      ? <Badge className="bg-green-100 text-green-800">เริ่ม</Badge>
      : <Badge className="bg-red-100 text-red-800">หยุด</Badge>
  }

  // Export functions
  const handleExport = async () => {
    setExporting(true)
    try {
      const params = new URLSearchParams({
        startDate: exportOptions.startDate,
        endDate: exportOptions.endDate,
        workPlanId: exportOptions.workPlanId,
        includeWorkplans: exportOptions.includeWorkplans.toString(),
        format: 'csv',
        exportDeviceId: exportOptions.exportDeviceId ? 'true' : 'false'
      })

      const response = await fetch(`/api/logs/export?${params}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `logs_export_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        setShowExportModal(false)
      } else {
        alert('เกิดข้อผิดพลาดในการ export ข้อมูล')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('เกิดข้อผิดพลาดในการ export ข้อมูล')
    } finally {
      setExporting(false)
    }
  }

  const resetExportOptions = () => {
    setExportOptions({
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      workPlanId: 'all',
      includeWorkplans: false,
      exportDeviceId: false
    })
  }

  // Job name input functions
  const handleJobNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setJobNameInput(value)
    setShowJobNameSuggestions(true)
    const suggestions = allWorkPlans.filter(wp => wp.job_name.toLowerCase().includes(value.toLowerCase()))
    setJobNameSuggestions(suggestions.map(wp => wp.job_name))
  }

  const handleSelectJobName = (jobName: string) => {
    setJobNameInput(jobName)
    setShowJobNameSuggestions(false)
    const selectedWorkPlan = allWorkPlans.find(wp => wp.job_name === jobName)
    if (selectedWorkPlan) {
      setExportOptions(options => ({
        ...options,
        workPlanId: selectedWorkPlan.id.toString()
      }))
    }
  }

  return (
    <div className="w-full min-h-screen px-0 mx-auto">
      <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 p-4 font-noto-thai">
        <div>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">ระบบจัดการ Logs</h1>
            <p className="text-gray-600">ดูและแก้ไขข้อมูล logs การทำงาน</p>
          </div>

          {/* Controls */}
          <Card className="mb-6 bg-white/90 shadow-md border border-blue-100">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <label className="text-sm font-medium text-blue-700">เลือกวันที่:</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-40 border-blue-200 focus-visible:ring-blue-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-500" />
                  <Input
                    type="text"
                    placeholder="ค้นหา..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 border-blue-200 focus-visible:ring-blue-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-blue-700">เรียงตาม:</label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as 'job_name' | 'process_number' | '')}
                    className="border-blue-200 rounded px-2 py-1"
                  >
                    <option value="">- ไม่เรียง -</option>
                    <option value="job_name">ชื่องาน</option>
                    <option value="process_number">หมายเลขกระบวนการ</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-2 py-1 border rounded border-blue-200 text-blue-700 hover:bg-blue-100"
                    title={sortOrder === 'asc' ? 'เรียงน้อยไปมาก' : 'เรียงมากไปน้อย'}
                  >
                    {sortOrder === 'asc' ? '⬆️' : '⬇️'}
                  </button>
                </div>

                <Button
                  onClick={() => fetchLogs(selectedDate)}
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  รีเฟรช
                </Button>

                <Button
                  onClick={() => setShowExportModal(true)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card className="bg-white/95 shadow-lg border border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-blue-900">
                <span>ข้อมูล Logs - {format(new Date(selectedDate), 'dd MMMM yyyy', { locale: th })}</span>
                <span className="text-sm text-blue-500">({filteredLogs.length} รายการ)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-blue-50 border-b border-blue-100">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">งาน</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">หมายเลขกระบวนการ</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">สถานะ</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">เวลา</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-blue-800">การดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-50">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-blue-50/70 transition-colors">
                        <td className="px-4 py-3 text-sm text-blue-900">{log.id}</td>
                        <td className="px-4 py-3 text-sm text-blue-900">
                          {editingId === log.id ? (
                            <select
                              value={editingData.work_plan_id || ''}
                              onChange={(e) => setEditingData({
                                ...editingData,
                                work_plan_id: e.target.value ? parseInt(e.target.value) : null
                              })}
                              className="w-full p-1 border rounded border-blue-300 bg-green-100 text-black placeholder:text-gray-400 focus-visible:ring-blue-400"
                            >
                              <option value="">เลือกงาน</option>
                              {workPlans.map(wp => (
                                <option key={wp.id} value={wp.id}>
                                  {wp.job_name} ({wp.job_code})
                                </option>
                              ))}
                            </select>
                          ) : (
                            getWorkPlanName(log.work_plan_id)
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-blue-900">
                          {editingId === log.id ? (
                            <Input
                              type="number"
                              value={editingData.process_number || ''}
                              onChange={(e) => setEditingData({
                                ...editingData,
                                process_number: e.target.value ? parseInt(e.target.value) : null
                              })}
                              className="w-20 border-blue-300 bg-green-100 text-black placeholder:text-gray-400 focus-visible:ring-blue-400"
                            />
                          ) : (
                            log.process_number || '-'
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {editingId === log.id ? (
                            <select
                              value={editingData.status || ''}
                              onChange={(e) => setEditingData({
                                ...editingData,
                                status: e.target.value as 'start' | 'stop'
                              })}
                              className="p-1 border rounded border-blue-300 bg-green-100 text-black focus-visible:ring-blue-400"
                            >
                              <option value="start">เริ่ม</option>
                              <option value="stop">หยุด</option>
                            </select>
                          ) : (
                            log.status === 'start' 
                              ? <Badge className="bg-blue-100 text-blue-800 border border-blue-200">เริ่ม</Badge>
                              : <Badge className="bg-gray-100 text-gray-700 border border-gray-200">หยุด</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-blue-900">
                          {editingId === log.id ? (
                            <div className="flex gap-2">
                              <Input
                                type="date"
                                value={editingDate}
                                onChange={e => setEditingDate(e.target.value)}
                                className="border-blue-300 bg-green-100 text-black placeholder:text-gray-400 focus-visible:ring-blue-400"
                              />
                              <Input
                                type="text"
                                pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"
                                placeholder="HH:mm:ss"
                                maxLength={8}
                                value={editingTime}
                                onChange={e => setEditingTime(e.target.value)}
                                className="border-blue-300 bg-green-100 text-black placeholder:text-gray-400 focus-visible:ring-blue-400"
                              />
                            </div>
                          ) : (
                            format(new Date(log.timestamp), 'HH:mm:ss', { locale: th })
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          {editingId === log.id ? (
                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                onClick={saveEdit}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEditing}
                                className="border-blue-300 text-blue-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditing(log)}
                                className="border-blue-300 text-blue-700"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteLog(log.id)}
                                className="border-red-300 text-red-700"
                              >
                                ลบ
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredLogs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    ไม่พบข้อมูล logs สำหรับวันที่เลือก
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Export Modal */}
          {showExportModal && (
            <>
              <div className="fixed inset-0 bg-white z-40"></div>
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Export Logs เป็น CSV
                    </h3>
                    <button
                      onClick={() => setShowExportModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* ช่วงวันที่ */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ช่วงวันที่
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={exportOptions.startDate}
                          onChange={(e) => setExportOptions({
                            ...exportOptions,
                            startDate: e.target.value
                          })}
                          className="border-gray-300 focus-visible:ring-gray-400"
                        />
                        <span className="flex items-center text-gray-500">ถึง</span>
                        <Input
                          type="date"
                          value={exportOptions.endDate}
                          onChange={(e) => setExportOptions({
                            ...exportOptions,
                            endDate: e.target.value
                          })}
                          className="border-gray-300 focus-visible:ring-gray-400"
                        />
                      </div>
                    </div>

                    {/* เลือกงาน */}
                    <div className="relative mb-2 pb-48">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        เลือกงาน
                      </label>
                      <Input
                        type="text"
                        value={jobNameInput}
                        onChange={handleJobNameInputChange}
                        placeholder="ค้นหาชื่องาน..."
                        className="w-full border border-gray-300 rounded px-3 py-2 focus-visible:ring-gray-400"
                      />
                      {showJobNameSuggestions && jobNameSuggestions.length > 0 && (
                        <div className="bg-white border border-blue-200 rounded shadow-2xl max-h-48 overflow-y-auto w-full mt-1">
                          {jobNameSuggestions.map((s, i) => (
                            <div
                              key={i}
                              className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                              onClick={() => handleSelectJobName(s)}
                            >
                              {s}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* รวม Workplans */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="includeWorkplans"
                        checked={exportOptions.includeWorkplans}
                        onChange={(e) => setExportOptions({
                          ...exportOptions,
                          includeWorkplans: e.target.checked
                        })}
                        className="rounded border-gray-400 text-gray-600 focus:ring-gray-500"
                      />
                      <label htmlFor="includeWorkplans" className="text-sm text-gray-700">
                        รวมข้อมูล Workplans ด้วย
                      </label>
                    </div>

                    {/* Export แบบ DeviceID */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="exportDeviceId"
                        checked={exportOptions.exportDeviceId || false}
                        onChange={e => setExportOptions({
                          ...exportOptions,
                          exportDeviceId: e.target.checked
                        })}
                        className="rounded border-gray-400 text-gray-600 focus:ring-gray-500"
                      />
                      <label htmlFor="exportDeviceId" className="text-sm text-gray-700">
                        Export แบบ DeviceID (ESP-XX)
                      </label>
                    </div>

                    {/* คำอธิบาย */}
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 border border-gray-200">
                      <p className="font-medium mb-1">ข้อมูลที่จะ Export:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Logs ตามช่วงวันที่และงานที่เลือก</li>
                        {exportOptions.includeWorkplans && (
                          <li>ข้อมูล Workplans พร้อมผู้ปฏิบัติงาน</li>
                        )}
                        <li>ไฟล์ CSV สามารถเปิดใน Excel หรือ Google Sheets ได้</li>
                      </ul>
                    </div>

                    {/* ปุ่มดำเนินการ */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {exporting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            กำลัง Export...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Export CSV
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={resetExportOptions}
                        variant="outline"
                        className="border-gray-300 text-gray-700"
                      >
                        รีเซ็ต
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <style jsx global>{`
        select:focus, input:focus, select:active, input:active {
          background-color: #d1fae5 !important; /* bg-green-100 */
          color: #111 !important; /* text-black */
        }
        option:checked, option:focus, option:active {
          background-color: #d1fae5 !important;
          color: #111 !important;
        }
        input[type="time"] {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          color-scheme: light;
        }
        input[type="time"]::-webkit-calendar-picker-indicator {
          display: none;
        }
        input[type="time"]::-webkit-datetime-edit {
          color: #111 !important;
          font-family: monospace;
        }
        input[type="time"]::-webkit-datetime-edit-fields-wrapper {
          color: #111 !important;
        }
        input[type="time"]::-webkit-datetime-edit-hour-field,
        input[type="time"]::-webkit-datetime-edit-minute-field,
        input[type="time"]::-webkit-datetime-edit-second-field {
          color: #111 !important;
          background: transparent;
        }
        input[type="time"]::-webkit-datetime-edit-ampm-field {
          display: none !important;
          width: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        input[type="time"]::-moz-datetime-edit-ampm-field {
          display: none !important;
        }
        input[type="time"]::-ms-datetime-edit-ampm-field {
          display: none !important;
        }
      `}</style>
    </div>
  )
} 