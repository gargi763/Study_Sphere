import { useState, useEffect } from 'react';
import { Wifi, CheckCircle2, XCircle, Clock, AlertCircle, RefreshCw, Radio, CalendarDays, BarChart3, Table2, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const subjects = ['Data Structures', 'Operating Systems', 'Database Systems', 'Computer Networks', 'Software Engineering'];

const statusConfig = {
  present: { label: 'Present', color: 'text-green-400', bg: 'bg-green-500/15', icon: CheckCircle2 },
  absent: { label: 'Absent', color: 'text-red-400', bg: 'bg-red-500/15', icon: XCircle },
  late: { label: 'Late', color: 'text-yellow-400', bg: 'bg-yellow-500/15', icon: Clock },
  excused: { label: 'Excused', color: 'text-blue-400', bg: 'bg-blue-500/15', icon: AlertCircle },
};

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

interface AttendanceRecord {
  id: string;
  subject: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: AttendanceStatus;
  rfidTag?: string;
}

interface SubjectAttendance {
  subject: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  percentage: number;
}

const generateMockHistory = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    subjects.forEach(subject => {
      const rand = Math.random();
      let status: AttendanceStatus = 'present';
      if (rand > 0.85) status = 'absent';
      else if (rand > 0.75) status = 'late';
      else if (rand > 0.70) status = 'excused';

      if (status !== 'absent') {
        const hour = 8 + Math.floor(Math.random() * 4);
        const minute = Math.floor(Math.random() * 60);
        records.push({
          id: `${dateStr}-${subject}`,
          subject,
          date: dateStr,
          checkInTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          status,
          rfidTag: status === 'present' ? `RFID-${Math.random().toString(36).substr(2, 8).toUpperCase()}` : undefined,
        });
      } else {
        records.push({
          id: `${dateStr}-${subject}`,
          subject,
          date: dateStr,
          status,
        });
      }
    });
  }

  return records;
};

const calculateSubjectAttendance = (records: AttendanceRecord[]): SubjectAttendance[] => {
  return subjects.map(subject => {
    const subjectRecords = records.filter(r => r.subject === subject);
    const present = subjectRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const absent = subjectRecords.filter(r => r.status === 'absent').length;
    const late = subjectRecords.filter(r => r.status === 'late').length;
    const total = subjectRecords.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { subject, present, absent, late, total, percentage };
  });
};

export default function AttendanceManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'chart'>('overview');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [subjectStats, setSubjectStats] = useState<SubjectAttendance[]>([]);
  const [rfidSimulating, setRfidSimulating] = useState(false);
  const [rfidDetected, setRfidDetected] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const mockData = generateMockHistory();
    setRecords(mockData);
    setSubjectStats(calculateSubjectAttendance(mockData));
  }, []);

  const simulateRfidScan = () => {
    setRfidSimulating(true);
    setRfidDetected(false);

    setTimeout(() => {
      setRfidDetected(true);
      setRfidSimulating(false);
    }, 2000);
  };

  const markAttendance = (subject: string, status: AttendanceStatus = 'present') => {
    setCheckingIn(true);

    setTimeout(() => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      const isLate = now.getHours() >= 10;
      const finalStatus = status === 'present' && isLate ? 'late' : status;

      const newRecord: AttendanceRecord = {
        id: `${today}-${subject}-${Date.now()}`,
        subject,
        date: today,
        checkInTime: timeStr,
        status: finalStatus,
        rfidTag: rfidDetected ? `RFID-${Math.random().toString(36).substr(2, 8).toUpperCase()}` : undefined,
      };

      const existingIndex = records.findIndex(r => r.date === today && r.subject === subject);

      if (existingIndex >= 0) {
        const updated = [...records];
        updated[existingIndex] = { ...updated[existingIndex], ...newRecord };
        setRecords(updated);
        setLastAction(`Updated attendance for ${subject}`);
      } else {
        setRecords(prev => [newRecord, ...prev]);
        setLastAction(`Marked ${finalStatus} for ${subject}`);
      }

      setSubjectStats(calculateSubjectAttendance(records));
      setCheckingIn(false);
      setRfidDetected(false);

      setTimeout(() => setLastAction(null), 3000);
    }, 1000);
  };

  const paginatedRecords = records.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(records.length / itemsPerPage);

  const overallPercentage = subjectStats.length > 0
    ? Math.round(subjectStats.reduce((sum, s) => sum + s.percentage, 0) / subjectStats.length)
    : 0;

  const todayRecords = records.filter(r => r.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        {(['overview', 'history', 'chart'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl transition-all ${
              activeTab === tab
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-blue-300/50 hover:text-blue-200 hover:bg-white/5'
            }`}
          >
            {tab === 'overview' && <Radio size={16} />}
            {tab === 'history' && <Table2 size={16} />}
            {tab === 'chart' && <BarChart3 size={16} />}
            <span className="capitalize">{tab}</span>
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Real-time Status */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Real-time Status</h3>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-green-400 text-xs font-medium">System Active</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* RFID Scanner */}
              <div className="glass rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    rfidSimulating
                      ? 'bg-blue-500/30 animate-pulse'
                      : rfidDetected
                        ? 'bg-green-500/30'
                        : 'bg-white/10'
                  }`}>
                    <Wifi
                      size={24}
                      className={`transition-all ${
                        rfidSimulating
                          ? 'text-blue-400 animate-pulse'
                          : rfidDetected
                            ? 'text-green-400'
                            : 'text-blue-300/50'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-white font-medium">RFID Scanner</p>
                    <p className="text-blue-300/50 text-xs">
                      {rfidSimulating ? 'Scanning...' : rfidDetected ? 'Card Detected!' : 'Ready to scan'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={simulateRfidScan}
                  disabled={rfidSimulating}
                  className="w-full glass hover:bg-white/10 text-blue-300 hover:text-white py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 border border-blue-500/20 disabled:opacity-50"
                >
                  <Radio size={16} className={rfidSimulating ? 'animate-pulse' : ''} />
                  {rfidSimulating ? 'Scanning RFID...' : 'Simulate RFID Scan'}
                </button>

                {rfidDetected && (
                  <div className="mt-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-2 text-green-400 text-xs">
                      <CheckCircle2 size={14} />
                      <span>RFID Tag: RFID-{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mark Attendance */}
              <div className="glass rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Zap size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Quick Check-In</p>
                    <p className="text-blue-300/50 text-xs">Mark attendance for today</p>
                  </div>
                </div>

                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm mb-3 outline-none focus:border-blue-500/50"
                >
                  {subjects.map(s => (
                    <option key={s} value={s} className="bg-gray-900">{s}</option>
                  ))}
                </select>

                <button
                  onClick={() => markAttendance(selectedSubject)}
                  disabled={checkingIn}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {checkingIn ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Mark Present
                    </>
                  )}
                </button>

                {lastAction && (
                  <div className="mt-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20 animate-fade-in">
                    <div className="flex items-center gap-2 text-green-400 text-xs">
                      <CheckCircle2 size={14} />
                      {lastAction}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Today's Attendance */}
            <div className="mt-6">
              <h4 className="text-blue-300/60 text-xs uppercase tracking-wide mb-3">Today's Attendance</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {subjects.map(subject => {
                  const todayRecord = todayRecords.find(r => r.subject === subject);
                  const config = todayRecord ? statusConfig[todayRecord.status] : null;
                  return (
                    <div
                      key={subject}
                      className={`glass rounded-xl p-3 text-center border ${
                        todayRecord
                          ? 'border-green-500/20'
                          : 'border-white/5 opacity-50'
                      }`}
                    >
                      <p className="text-white text-xs font-medium truncate mb-1">{subject}</p>
                      {todayRecord && config ? (
                        <div className={`flex items-center justify-center gap-1 ${config.color}`}>
                          <config.icon size={12} />
                          <span className="text-[10px]">{config.label}</span>
                        </div>
                      ) : (
                        <span className="text-blue-300/40 text-[10px]">Not marked</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Overall Attendance</h3>
              <div className="text-2xl font-bold text-gradient-blue">{overallPercentage}%</div>
            </div>

            <div className="space-y-4">
              {subjectStats.map(stat => {
                const barWidth = `${stat.percentage}%`;
                const barColor = stat.percentage >= 85
                  ? 'from-green-500 to-green-400'
                  : stat.percentage >= 75
                    ? 'from-yellow-500 to-yellow-400'
                    : 'from-red-500 to-red-400';

                return (
                  <div key={stat.subject}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-200/70 text-sm">{stat.subject}</span>
                      <span className={`text-sm font-semibold ${
                        stat.percentage >= 85 ? 'text-green-400' : stat.percentage >= 75 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {stat.percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
                        style={{ width: barWidth }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {activeTab === 'history' && (
        <div className="glass-card rounded-2xl p-6 border border-white/8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold text-lg">Attendance History</h3>
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-blue-400" />
              <span className="text-blue-300/50 text-sm">Last 30 days</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 text-blue-300/50 text-xs uppercase tracking-wide font-medium">Date</th>
                  <th className="text-left py-3 px-2 text-blue-300/50 text-xs uppercase tracking-wide font-medium">Subject</th>
                  <th className="text-left py-3 px-2 text-blue-300/50 text-xs uppercase tracking-wide font-medium">Check In</th>
                  <th className="text-left py-3 px-2 text-blue-300/50 text-xs uppercase tracking-wide font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-blue-300/50 text-xs uppercase tracking-wide font-medium">RFID</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map(record => {
                  const config = statusConfig[record.status];
                  const Icon = config.icon;
                  return (
                    <tr key={record.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-2 text-white text-sm">{record.date}</td>
                      <td className="py-3 px-2 text-blue-200/70 text-sm">{record.subject}</td>
                      <td className="py-3 px-2 text-blue-200/50 text-sm font-mono">
                        {record.checkInTime || '--:--'}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1.5 ${config.bg} ${config.color} text-xs px-2.5 py-1 rounded-full`}>
                          <Icon size={12} />
                          {config.label}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {record.rfidTag ? (
                          <code className="text-blue-300/50 text-xs bg-white/5 px-2 py-0.5 rounded">
                            {record.rfidTag}
                          </code>
                        ) : (
                          <span className="text-blue-300/30 text-xs">--</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
            <span className="text-blue-300/40 text-xs">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, records.length)} of {records.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="glass p-2 rounded-lg text-blue-300/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-white text-sm px-3">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="glass p-2 rounded-lg text-blue-300/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chart' && (
        <div className="glass-card rounded-2xl p-6 border border-white/8">
          <h3 className="text-white font-semibold text-lg mb-6">Attendance Percentage by Subject</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div>
              <p className="text-blue-300/50 text-xs mb-4">Subject Attendance Comparison</p>
              <div className="space-y-4">
                {subjectStats.map((stat, i) => {
                  const maxPercent = Math.max(...subjectStats.map(s => s.percentage));
                  const barHeight = (stat.percentage / maxPercent) * 100;
                  const barColor = stat.percentage >= 85
                    ? 'from-green-500 to-green-400'
                    : stat.percentage >= 75
                      ? 'from-yellow-500 to-yellow-400'
                      : 'from-red-500 to-red-400';

                  return (
                    <div key={stat.subject} className="flex items-center gap-4">
                      <div className="w-24 shrink-0">
                        <span className="text-blue-200/60 text-xs truncate">{stat.subject}</span>
                      </div>
                      <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden relative">
                        <div
                          className={`h-full rounded-lg bg-gradient-to-r ${barColor} transition-all duration-1000`}
                          style={{ width: `${barHeight}%`, transitionDelay: `${i * 100}ms` }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-sm font-bold">
                          {stat.percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Donut Chart */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-48 h-48">
                <svg width="192" height="192" viewBox="0 0 192 192">
                  {subjectStats.map((stat, i) => {
                    const radius = 70;
                    const circumference = 2 * Math.PI * radius;
                    const totalRecords = subjectStats.reduce((sum, s) => sum + s.total, 0);
                    const percentage = totalRecords > 0 ? stat.total / totalRecords : 0;
                    const strokeDash = percentage * circumference;
                    const rotation = i * 72;

                    return (
                      <circle
                        key={stat.subject}
                        cx="96"
                        cy="96"
                        r={radius}
                        fill="none"
                        stroke={stat.percentage >= 85 ? '#22c55e' : stat.percentage >= 75 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="24"
                        strokeLinecap="round"
                        strokeDasharray={`${strokeDash - 10} ${circumference}`}
                        transform={`rotate(${rotation} 96 96)`}
                        style={{
                          opacity: 0.7,
                          filter: `drop-shadow(0 0 6px ${stat.percentage >= 85 ? '#22c55e60' : stat.percentage >= 75 ? '#f59e0b60' : '#ef444460'})`,
                        }}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-bold text-white">{overallPercentage}%</p>
                  <p className="text-blue-300/50 text-xs">Overall</p>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2">
                {subjectStats.map(stat => (
                  <div key={stat.subject} className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        stat.percentage >= 85 ? 'bg-green-500' : stat.percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-blue-300/60 text-xs">{stat.subject}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="grid grid-cols-3 gap-4">
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-green-400">{subjectStats.reduce((sum, s) => sum + s.present, 0)}</p>
                <p className="text-blue-300/50 text-xs mt-1">Present Days</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-red-400">{subjectStats.reduce((sum, s) => sum + s.absent, 0)}</p>
                <p className="text-blue-300/50 text-xs mt-1">Absent Days</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-yellow-400">{subjectStats.reduce((sum, s) => sum + s.late, 0)}</p>
                <p className="text-blue-300/50 text-xs mt-1">Late Days</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
