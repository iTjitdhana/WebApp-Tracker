import React, { useEffect, useState, useRef } from 'react';
import { format, parse, parseISO } from 'date-fns';
import { th } from 'date-fns/locale/th';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

// สมมติว่ามี API /api/workplans สำหรับ GET/POST/PUT

interface Operator {
  id: number;
  name: string;
}

interface WorkPlan {
  id: number;
  job_name: string;
  operators: Operator[];
  start_time: string; // HH:mm
  end_time: string;   // HH:mm
  date: string;       // yyyy-MM-dd
  production_date?: string; // yyyy-MM-dd (จาก API)
  operator_names?: string;  // string (จาก API)
}

const WorkPlansPage = () => {
  const [workPlans, setWorkPlans] = useState<WorkPlan[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [form, setForm] = useState({
    job_name: '',
    operatorIds: [] as number[],
    start_time: '',
    end_time: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [jobNameSuggestions, setJobNameSuggestions] = useState<string[]>([]);
  const [showJobNameSuggestions, setShowJobNameSuggestions] = useState(false);
  const [reordering, setReordering] = useState(false);

  // โหลด operator list จาก /api/users
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setOperators(data))
      .catch(() => setOperators([]));
  }, []);

  // โหลด workplans ตามวันที่
  useEffect(() => {
    setError(null);
    fetch(`/api/workplans?date=${selectedDate}`)
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => setWorkPlans(data))
      .catch(err => setError('โหลดข้อมูลไม่สำเร็จ: ' + err.message));
  }, [selectedDate]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'operatorIds') {
      const options = (e.target as HTMLSelectElement).options;
      const selected: number[] = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) selected.push(Number(options[i].value));
      }
      setForm(f => ({ ...f, operatorIds: selected.slice(0, 4) }));
    } else if (name === 'start_time' || name === 'end_time') {
      setForm(f => ({ ...f, [name]: value }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!form.job_name || form.operatorIds.length === 0 || !form.start_time || !form.end_time) {
      setError('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    if (!timeRegex.test(form.start_time) || !timeRegex.test(form.end_time)) {
      setError('กรุณากรอกเวลาเป็นรูปแบบ HH:mm (เช่น 09:30)');
      return;
    }
    setError(null);
    const body = {
      ...form,
      date: selectedDate,
      id: editingId,
    };
    const method = editingId ? 'PUT' : 'POST';
    const url = '/api/workplans' + (editingId ? `/${editingId}` : '');
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setForm({ job_name: '', operatorIds: [], start_time: '', end_time: '' });
      setEditingId(null);
      setSelectedDate(selectedDate); // reload
    } else {
      setError('บันทึกข้อมูลไม่สำเร็จ');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('คุณต้องการลบงานนี้หรือไม่?')) return;
    const res = await fetch(`/api/workplans/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSelectedDate(selectedDate); // reload
      setError(null);
      alert('ลบสำเร็จ');
    } else {
      setError('ลบไม่สำเร็จ');
    }
  };

  const handleEdit = (wp: WorkPlan) => {
    setEditingId(wp.id);
    setForm({
      job_name: wp.job_name,
      operatorIds: wp.operators.map(o => o.id),
      start_time: wp.start_time,
      end_time: wp.end_time,
    });
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ job_name: '', operatorIds: [], start_time: '', end_time: '' });
    setError(null);
  };

  // autocomplete ชื่องาน
  const handleJobNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(f => ({ ...f, job_name: value }));
    if (value.length > 0) {
      fetch(`/api/jobnames?q=${encodeURIComponent(value)}`)
        .then(res => res.json())
        .then(data => {
          setJobNameSuggestions(data);
          setShowJobNameSuggestions(true);
        });
    } else {
      setJobNameSuggestions([]);
      setShowJobNameSuggestions(false);
    }
  };
  const handleSelectJobName = (name: string) => {
    setForm(f => ({ ...f, job_name: name }));
    setShowJobNameSuggestions(false);
  };

  // Reorder functions
  const moveWorkPlan = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === workPlans.length - 1) return;
    
    const newWorkPlans = [...workPlans];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newWorkPlans[index], newWorkPlans[newIndex]] = [newWorkPlans[newIndex], newWorkPlans[index]];
    setWorkPlans(newWorkPlans);
    setReordering(true);
  };

  const saveReorder = async () => {
    if (!reordering) return;
    
    const workPlanIds = workPlans.map(wp => wp.id);
    try {
      const res = await fetch('/api/workplans/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workPlanIds, date: selectedDate }),
      });
      
      if (res.ok) {
        setReordering(false);
        alert('บันทึกลำดับสำเร็จ');
      } else {
        alert('บันทึกลำดับไม่สำเร็จ');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  return (
    <div className="w-full mx-auto py-8 flex flex-col md:flex-row gap-8 px-4">
      {/* Form Section */}
      <div className="md:w-1/5 w-full">
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded shadow p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-blue-900 mb-2">{editingId ? 'แก้ไข Work Plan' : 'เพิ่ม Work Plan'}</h2>
          <div className={`relative mb-2${showJobNameSuggestions && jobNameSuggestions.length > 0 ? ' pb-48' : ''}`}>
            <label className="block mb-1">ชื่องาน:</label>
            <Input
              name="job_name"
              value={form.job_name}
              onChange={handleJobNameChange}
              autoComplete="off"
              className="border-blue-300"
            />
            {showJobNameSuggestions && jobNameSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 z-50 bg-white border border-blue-200 rounded shadow-lg max-h-48 overflow-y-auto w-full">
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
          <div>
            <label className="block mb-1">ผู้ปฏิบัติงาน (เลือกได้สูงสุด 4 คน):</label>
            <div className="flex flex-col gap-1">
              {operators.map(op => (
                <label key={op.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={op.id}
                    checked={form.operatorIds.includes(op.id)}
                    onChange={e => {
                      let newIds = form.operatorIds.slice();
                      if (e.target.checked) {
                        if (newIds.length < 4) newIds.push(op.id);
                      } else {
                        newIds = newIds.filter(id => id !== op.id);
                      }
                      setForm(f => ({ ...f, operatorIds: newIds }));
                    }}
                  />
                  <span>{op.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block mb-1">เวลาเริ่ม (24 ชม.):</label>
              <Input
                name="start_time"
                type="text"
                value={form.start_time}
                onChange={handleFormChange}
                className="border-blue-300"
                placeholder="เช่น 09:30"
                maxLength={5}
              />
            </div>
            <div>
              <label className="block mb-1">เวลาจบ (24 ชม.):</label>
              <Input
                name="end_time"
                type="text"
                value={form.end_time}
                onChange={handleFormChange}
                className="border-blue-300"
                placeholder="เช่น 14:00"
                maxLength={5}
              />
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">* ถ้า input เวลาเป็น AM/PM แนะนำใช้ Chrome, Edge หรือ Firefox เพื่อแสดง 24 ชม.</div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-700 text-white flex-1">{editingId ? 'บันทึกการแก้ไข' : 'เพิ่ม Work Plan'}</Button>
            {editingId && (
              <Button type="button" onClick={handleCancel} variant="outline" className="flex-1">ยกเลิก</Button>
            )}
          </div>
        </form>
      </div>
      {/* Table Section */}
      <div className="md:w-4/5 w-full">
        <div className="mb-4 flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <label>เลือกวันที่:</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="border-blue-300"
            />
          </div>
          {reordering && (
            <Button 
              onClick={saveReorder} 
              className="bg-green-600 text-white hover:bg-green-700"
            >
              บันทึกลำดับ
            </Button>
          )}
        </div>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="p-2">วันที่</th>
              <th className="p-2">ชื่องาน</th>
              <th className="p-2">ผู้ปฏิบัติงาน</th>
              <th className="p-2">เวลาเริ่ม</th>
              <th className="p-2">เวลาจบ</th>
              <th className="p-2">ลำดับ</th>
              <th className="p-2">แก้ไข</th>
              <th className="p-2">ลบ</th>
            </tr>
          </thead>
          <tbody>
            {workPlans.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-8">ไม่พบข้อมูล</td>
              </tr>
            ) : (
              workPlans.map((wp, index) => (
                <tr key={wp.id} className="border-b hover:bg-blue-50">
                  <td className="p-2 text-blue-900">
                    {wp.production_date
                      ? format(parseISO(wp.production_date), 'dd/MM/yyyy', { locale: th })
                      : '-'}
                  </td>
                  <td className="p-2 text-blue-900">{wp.job_name}</td>
                  <td className="p-2 text-blue-900">
                    {(wp.operators && wp.operators.length > 0)
                      ? wp.operators.map(o => <span key={o.id} className="inline-block bg-blue-100 text-blue-800 rounded px-2 py-0.5 mr-1 text-xs">{o.name}</span>)
                      : (wp.operator_names || '-')}
                  </td>
                  <td className="p-2 text-blue-900">{wp.start_time ? wp.start_time.slice(0,5) : '-'}</td>
                  <td className="p-2 text-blue-900">{wp.end_time ? wp.end_time.slice(0,5) : '-'}</td>
                  <td className="p-2">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveWorkPlan(index, 'up')}
                        disabled={index === 0}
                        className="p-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveWorkPlan(index, 'down')}
                        disabled={index === workPlans.length - 1}
                        className="p-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="p-2">
                    <Button type="button" onClick={() => handleEdit(wp)} className="bg-blue-200 text-blue-900">แก้ไข</Button>
                  </td>
                  <td className="p-2">
                    <Button type="button" onClick={() => handleDelete(wp.id)} className="bg-red-200 text-red-900">ลบ</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkPlansPage; 