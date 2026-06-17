import { useState, useEffect, useRef } from 'react';
import {
  Wifi, CheckCircle2, XCircle, Clock, AlertCircle, RefreshCw, Radio,
  CalendarDays, BarChart3, Table2, ChevronLeft, ChevronRight, Zap,
  TrendingUp, TrendingDown, Activity, Loader2, Trash2, Filter, Users
} from 'lucide-react';
import { useAttendance, useRfidEvents, AttendanceRecord, SubjectStat } from '../../hooks/useData';
import { useAuthContext } from '../../context/AuthContext';

const SUBJECTS = [
  'Data Structures', 'Operating Systems', 'Database Systems',
  'Computer Networks', 'Software Engineering',
];

const STATUS_CONFIG = {
  present:  { label: 'Present',  color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/20',  icon: CheckCircle2 },
  absent:   { label: 'Absent',   color: 'text-red-400',     bg: 'bg-red-500/15 border-red-500/20',          icon: XCircle      },
  late:     { label: 'Late',     color: 'text-amber-400',   bg: 'bg-amber-500/15 border-amber-500/20',      icon: Clock        },
  excused:  { label: 'Excused',  color: 'text-blue-400',    bg: 'bg-blue-500/15 border-blue-500/20',        icon: AlertCircle  },
} as const;

type Tab = 'overview' | 'history' | 'analytics';
type StatusFilter = 'all' | AttendanceRecord['status'];

function PercentBadge({ pct }: { pct: number }) {
  const color = pct >= 85 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : pct >= 75 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    : 'text-red-400 bg-red-500/10 border-red-500/20';
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${color}`}>{pct}%</span>;
}

function SubjectBar({ stat, max }: { stat: SubjectStat; max: number }) {
  const barPct = max > 0 ? (stat.percentage / max) * 100 : 0;
  const barColor = stat.percentage >= 85
    ? 'from-emerald-500 to-teal-400'
    : stat.percentage >= 75 ? 'from-amber-500 to-yellow-400'
    : 'from-red-500 to-rose-400';

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 truncate w-28 flex-shrink-0">{stat.subject}</span>
      <div className="flex-1 h-7 bg-white/5 rounded-lg overflow-hidden relative">
        <div
          className={`h-full rounded-lg bg-gradient-to-r ${barColor} transition-all duration-700`}
          style={{ width: `${barPct}%` }}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs font-bold">
          {stat.percentage}%
        </span>
      </div>
      <div className="flex gap-1 text-[10px] w-28 flex-shrink-0">
        <span className="text-emerald-400">{stat.present + stat.late}P</span>
        <span className="text-slate-600">/</span>
        <span className="text-red-400">{stat.absent}A</span>
        <span className="text-slate-600">/</span>
        <span className="text-amber-400">{stat.late}L</span>
      </div>
    </div>
  );
}

export default function AttendanceManagement() {
  const { user, role } = useAuthContext();
  const {
    records, loading, upsertRecord, deleteRecord,
    getSubjectStats, getOverallPercentage, getTodayRecords,
  } = useAttendance(user?.id);
  const { events: rfidEvents, scanning, simulateScan } = useRfidEvents(user?.id);

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [markingStatus, setMarkingStatus] = useState<AttendanceRecord['status']>('present');
  const [marking, setMarking] = useState(false);
  const [rfidDetected, setRfidDetected] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [animatedBars, setAnimatedBars] = useState(false);
  const itemsPerPage = 12;

  // Faculty: can mark for any student (demo: marks for current user as proxy)
  const isFacultyOrAdmin = role === 'faculty' || role === 'admin';

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedBars(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const showLastAction = (msg: string) => {
    setLastAction(msg);
    setTimeout(() => setLastAction(null), 3500);
  };

  const handleMarkAttendance = async (status: AttendanceRecord['status'] = markingStatus) => {
    if (!user?.id) return;
    setMarking(true);
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().slice(0, 5);
      const isLate = now.getHours() >= 10 && status === 'present';
      const finalStatus = isLate ? 'late' : status;

      await upsertRecord({
        student_id: user.id,
        subject: selectedSubject,
        date: today,
        status: finalStatus,
        check_in_time: finalStatus !== 'absent' ? timeStr : null,
        rfid_tag: rfidDetected,
        marked_by: rfidDetected ? 'rfid' : isFacultyOrAdmin ? 'faculty' : 'self',
        faculty_id: isFacultyOrAdmin ? user.id : null,
      });

      showLastAction(`Marked ${finalStatus} for ${selectedSubject}`);
      setRfidDetected(null);
    } catch (e: any) {
      showLastAction(`Error: ${e.message}`);
    } finally {
      setMarking(false);
    }
  };

  const handleRfidScan = async () => {
    if (!user?.id) return;
    try {
      const event = await simulateScan(user.id, selectedSubject);
      setRfidDetected(event.card_uid);
      showLastAction(`RFID detected: ${event.card_uid}`);
    } catch (e: any) {
      showLastAction(`Scan failed: ${e.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRecord(id);
      showLastAction('Record deleted');
    } catch (e: any) {
      showLastAction(`Delete failed: ${e.message}`);
    }
  };

  const subjectStats = getSubjectStats();
  const overallPct = getOverallPercentage();
  const todayRecords = getTodayRecords();
  const maxStatPct = subjectStats.length ? Math.max(...subjectStats.map(s => s.percentage)) : 100;

  const filteredRecords = records.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (subjectFilter !== 'all' && r.subject !== subjectFilter) return false;
    return true;
  });
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const totalPresent = subjectStats.reduce((s, x) => s + x.present + x.late, 0);
  const totalAbsent  = subjectStats.reduce((s, x) => s + x.absent, 0);
  const totalLate    = subjectStats.reduce((s, x) => s + x.late, 0);
  const totalRecords = subjectStats.reduce((s, x) => s + x.total, 0);

  return (
    <div className="space-y-5 p-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Attendance</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {loading ? 'Loading...' : `${records.length} records · ${overallPct}% overall`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl w-fit">
        {([
          { id: 'overview',  label: 'Overview',  icon: Radio     },
          { id: 'history',   label: 'History',   icon: Table2    },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ─────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-5">

          {/* Quick-stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Overall',     value: `${overallPct}%`, sub: 'attendance rate', icon: Activity,     color: 'from-blue-500 to-cyan-500' },
              { label: 'Attended',    value: totalPresent,      sub: 'classes present', icon: CheckCircle2, color: 'from-emerald-500 to-teal-500' },
              { label: 'Absent',      value: totalAbsent,       sub: 'classes missed',  icon: XCircle,      color: 'from-red-500 to-rose-500' },
              { label: 'Late',        value: totalLate,         sub: 'late arrivals',   icon: Clock,        color: 'from-amber-500 to-yellow-500' },
            ].map(s => {
              const SIcon = s.icon;
              return (
                <div key={s.label} className="glass rounded-2xl p-4 border border-white/10">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                    <SIcon size={16} className="text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-5">

            {/* RFID Scanner */}
            <div className="glass rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  scanning ? 'bg-blue-500/30 animate-pulse' : rfidDetected ? 'bg-emerald-500/20' : 'bg-white/8'
                }`}>
                  <Wifi size={20} className={scanning ? 'text-blue-400 animate-pulse' : rfidDetected ? 'text-emerald-400' : 'text-slate-400'} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">RFID Scanner</p>
                  <p className="text-xs text-slate-500">
                    {scanning ? 'Scanning for tag...' : rfidDetected ? `Tag: ${rfidDetected}` : 'Ready'}
                  </p>
                </div>
                <div className="ml-auto">
                  {scanning
                    ? <span className="flex items-center gap-1 text-xs text-blue-400"><Loader2 size={12} className="animate-spin" />Scanning</span>
                    : <span className="flex items-center gap-1 text-xs text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Active</span>
                  }
                </div>
              </div>

              <button
                onClick={handleRfidScan}
                disabled={scanning}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-sm font-medium transition-all disabled:opacity-50"
              >
                <Radio size={15} className={scanning ? 'animate-pulse' : ''} />
                {scanning ? 'Scanning RFID...' : 'Simulate RFID Scan'}
              </button>

              {rfidDetected && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-emerald-300 font-mono">{rfidDetected}</span>
                  <span className="text-xs text-slate-400 ml-auto">Ready to check-in</span>
                </div>
              )}

              {/* Recent RFID events */}
              {rfidEvents.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/8">
                  <p className="text-xs text-slate-500 mb-2">Recent scans</p>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {rfidEvents.slice(0, 5).map(ev => (
                      <div key={ev.id} className="flex items-center gap-2 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                        <span className="text-slate-400 font-mono truncate">{ev.card_uid}</span>
                        <span className="text-slate-600 ml-auto flex-shrink-0">
                          {new Date(ev.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Check-in */}
            <div className="glass rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Zap size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {isFacultyOrAdmin ? 'Faculty Mark Attendance' : 'Quick Check-In'}
                  </p>
                  <p className="text-xs text-slate-500">Mark attendance for a class</p>
                </div>
                {isFacultyOrAdmin && (
                  <span className="ml-auto flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <Users size={10} />Faculty
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                >
                  {SUBJECTS.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                </select>

                {/* Status select */}
                <div className="grid grid-cols-4 gap-1.5">
                  {(['present','late','excused','absent'] as const).map(st => {
                    const cfg = STATUS_CONFIG[st];
                    const SIcon = cfg.icon;
                    return (
                      <button
                        key={st}
                        onClick={() => setMarkingStatus(st)}
                        className={`flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-medium transition-all ${
                          markingStatus === st ? `${cfg.bg} ${cfg.color}` : 'border-white/8 text-slate-500 hover:border-white/15 hover:text-slate-300'
                        }`}
                      >
                        <SIcon size={13} />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleMarkAttendance()}
                  disabled={marking}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {marking ? <><Loader2 size={15} className="animate-spin" />Processing...</> : <><CheckCircle2 size={15} />Mark {STATUS_CONFIG[markingStatus].label}</>}
                </button>
              </div>

              {lastAction && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span className="text-xs text-emerald-300">{lastAction}</span>
                </div>
              )}
            </div>
          </div>

          {/* Today's attendance grid */}
          <div className="glass rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-white">Today's Status</p>
              <span className="text-xs text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {SUBJECTS.map(subject => {
                const rec = todayRecords.find(r => r.subject === subject);
                const cfg = rec ? STATUS_CONFIG[rec.status] : null;
                const CIcon = cfg?.icon;
                return (
                  <div
                    key={subject}
                    className={`rounded-xl p-3 text-center border transition-all cursor-pointer ${
                      rec ? `${STATUS_CONFIG[rec.status].bg} ${STATUS_CONFIG[rec.status].color}` : 'border-white/8 bg-white/3 text-slate-500'
                    }`}
                    onClick={() => { setSelectedSubject(subject); }}
                    title={`Click to select ${subject}`}
                  >
                    <p className="text-xs font-medium truncate mb-1.5">{subject}</p>
                    {rec && CIcon ? (
                      <div className="flex items-center justify-center gap-1">
                        <CIcon size={11} />
                        <span className="text-[10px] font-medium">{cfg!.label}</span>
                      </div>
                    ) : (
                      <span className="text-[10px]">Not marked</span>
                    )}
                    {rec?.check_in_time && (
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">{rec.check_in_time}</p>
                    )}
                    {rec?.rfid_tag && (
                      <p className="text-[9px] text-blue-400 mt-0.5 font-mono truncate">RFID</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── HISTORY TAB ──────────────────────────────────────────────── */}
      {activeTab === 'history' && (
        <div className="glass rounded-2xl p-5 border border-white/10">
          {/* Filters */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter size={13} /> Filters:
            </div>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value as StatusFilter); setCurrentPage(1); }}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs outline-none focus:border-blue-500/50"
            >
              <option value="all" className="bg-gray-900">All Status</option>
              {(['present','absent','late','excused'] as const).map(s => (
                <option key={s} value={s} className="bg-gray-900">{STATUS_CONFIG[s].label}</option>
              ))}
            </select>
            <select
              value={subjectFilter}
              onChange={e => { setSubjectFilter(e.target.value); setCurrentPage(1); }}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs outline-none focus:border-blue-500/50"
            >
              <option value="all" className="bg-gray-900">All Subjects</option>
              {SUBJECTS.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
            </select>
            <span className="text-xs text-slate-500 ml-auto">{filteredRecords.length} records</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
              <Loader2 size={20} className="animate-spin" /> Loading attendance records...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <CalendarDays size={36} className="mb-3 opacity-40" />
              <p className="text-sm">No attendance records found</p>
              <p className="text-xs mt-1">Mark your first attendance in the Overview tab</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/8">
                      <th className="text-left py-2.5 px-2 text-xs text-slate-500 font-medium uppercase tracking-wide">Date</th>
                      <th className="text-left py-2.5 px-2 text-xs text-slate-500 font-medium uppercase tracking-wide">Subject</th>
                      <th className="text-left py-2.5 px-2 text-xs text-slate-500 font-medium uppercase tracking-wide">Check-in</th>
                      <th className="text-left py-2.5 px-2 text-xs text-slate-500 font-medium uppercase tracking-wide">Status</th>
                      <th className="text-left py-2.5 px-2 text-xs text-slate-500 font-medium uppercase tracking-wide">RFID</th>
                      <th className="text-left py-2.5 px-2 text-xs text-slate-500 font-medium uppercase tracking-wide">By</th>
                      <th className="py-2.5 px-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRecords.map(record => {
                      const cfg = STATUS_CONFIG[record.status];
                      const Icon = cfg.icon;
                      return (
                        <tr key={record.id} className="border-b border-white/5 hover:bg-white/3 transition-colors group">
                          <td className="py-3 px-2 text-sm text-white font-mono">{record.date}</td>
                          <td className="py-3 px-2 text-sm text-slate-300">{record.subject}</td>
                          <td className="py-3 px-2 text-sm text-slate-400 font-mono">
                            {record.check_in_time
                              ? typeof record.check_in_time === 'string' && record.check_in_time.includes('T')
                                ? new Date(record.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : record.check_in_time
                              : '—'
                            }
                          </td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                              <Icon size={11} /> {cfg.label}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            {record.rfid_tag
                              ? <code className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">{record.rfid_tag.slice(0, 14)}</code>
                              : <span className="text-slate-600 text-xs">—</span>
                            }
                          </td>
                          <td className="py-3 px-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                              record.marked_by === 'rfid' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                              : record.marked_by === 'faculty' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                              : 'text-slate-500 bg-white/5 border-white/10'
                            }`}>
                              {record.marked_by}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <button
                              onClick={() => handleDelete(record.id)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/8">
                  <span className="text-xs text-slate-500">
                    {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 hover:bg-white/8 transition-all"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <span className="text-sm text-white px-2">{currentPage} / {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 hover:bg-white/8 transition-all"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── ANALYTICS TAB ────────────────────────────────────────────── */}
      {activeTab === 'analytics' && (
        <div className="space-y-5">

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Present Days',  value: totalPresent, color: 'text-emerald-400', icon: CheckCircle2 },
              { label: 'Absent Days',   value: totalAbsent,  color: 'text-red-400',     icon: XCircle      },
              { label: 'Late Arrivals', value: totalLate,    color: 'text-amber-400',   icon: Clock        },
            ].map(s => {
              const SIcon = s.icon;
              return (
                <div key={s.label} className="glass rounded-2xl p-5 border border-white/10 text-center">
                  <SIcon size={20} className={`${s.color} mx-auto mb-2`} />
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-5">

            {/* Bar chart by subject */}
            <div className="glass rounded-2xl p-5 border border-white/10">
              <h3 className="text-sm font-semibold text-white mb-5">Attendance by Subject</h3>
              {subjectStats.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {subjectStats.map(s => (
                    <SubjectBar key={s.subject} stat={s} max={animatedBars ? maxStatPct : 0} />
                  ))}
                </div>
              )}
            </div>

            {/* Donut + overall */}
            <div className="glass rounded-2xl p-5 border border-white/10 flex flex-col items-center">
              <h3 className="text-sm font-semibold text-white mb-5 self-start">Overall Rate</h3>

              <div className="relative w-44 h-44">
                <svg width="176" height="176" viewBox="0 0 176 176">
                  <circle cx="88" cy="88" r="66" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
                  <circle
                    cx="88" cy="88" r="66"
                    fill="none"
                    stroke={overallPct >= 85 ? '#22c55e' : overallPct >= 75 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeDasharray={`${(overallPct / 100) * (2 * Math.PI * 66)} ${2 * Math.PI * 66}`}
                    transform="rotate(-90 88 88)"
                    style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 8px ${overallPct >= 85 ? '#22c55e80' : overallPct >= 75 ? '#f59e0b80' : '#ef444480'})` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-bold text-white">{overallPct}%</p>
                  <p className="text-xs text-slate-400 mt-0.5">Overall</p>
                </div>
              </div>

              {/* Threshold indicators */}
              <div className="mt-5 w-full space-y-2">
                {[
                  { label: 'Excellent threshold', threshold: 85, color: 'bg-emerald-500' },
                  { label: 'Good threshold',       threshold: 75, color: 'bg-amber-500'  },
                  { label: 'Critical threshold',   threshold: 60, color: 'bg-red-500'    },
                ].map(t => (
                  <div key={t.label} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${t.color}`} />
                    <span className="text-slate-400 flex-1">{t.label}</span>
                    <span className="text-slate-300 font-mono">{t.threshold}%</span>
                    <span className={overallPct >= t.threshold ? 'text-emerald-400' : 'text-red-400'}>
                      {overallPct >= t.threshold ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Alert */}
              {overallPct < 75 && (
                <div className="mt-4 w-full p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300">Attendance below 75%. You may be at risk of academic penalties. Attend upcoming classes.</p>
                </div>
              )}
              {overallPct >= 75 && overallPct < 85 && (
                <div className="mt-4 w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
                  <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300">Attendance is acceptable but aim for 85%+ for better academic standing.</p>
                </div>
              )}
            </div>
          </div>

          {/* Subject-wise detail table */}
          {subjectStats.length > 0 && (
            <div className="glass rounded-2xl p-5 border border-white/10">
              <h3 className="text-sm font-semibold text-white mb-4">Subject Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/8">
                      {['Subject','Total','Present','Late','Absent','Excused','Rate'].map(h => (
                        <th key={h} className="text-left py-2.5 px-2 text-xs text-slate-500 font-medium uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subjectStats.map(s => (
                      <tr key={s.subject} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="py-3 px-2 text-sm text-white font-medium">{s.subject}</td>
                        <td className="py-3 px-2 text-sm text-slate-300">{s.total}</td>
                        <td className="py-3 px-2 text-sm text-emerald-400">{s.present}</td>
                        <td className="py-3 px-2 text-sm text-amber-400">{s.late}</td>
                        <td className="py-3 px-2 text-sm text-red-400">{s.absent}</td>
                        <td className="py-3 px-2 text-sm text-blue-400">{s.excused}</td>
                        <td className="py-3 px-2"><PercentBadge pct={s.percentage} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
