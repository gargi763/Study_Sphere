import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, Building, FileText, Save, Camera, GraduationCap,
  BookOpen, Calendar, TrendingUp, Award, Target, CheckCircle,
  Clock, MapPin, Edit3, X, ChevronRight, Edit
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useAttendance, useSubmissions, useAssignments } from '../../hooks/useData';
import { supabase } from '../../lib/supabase';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext: string;
  color: string;
  bgGradient: string;
  trend?: { value: string; positive: boolean };
}

function StatCard({ icon: Icon, label, value, subtext, color, bgGradient, trend }: StatCardProps) {
  return (
    <div className={`glass-card rounded-2xl p-5 border border-white/8 hover:border-blue-500/20 transition-all duration-300`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${bgGradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon size={18} className={color} />
        </div>
        {trend && (
          <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${trend.positive ? 'text-emerald-400 bg-emerald-500/15' : 'text-amber-400 bg-amber-500/15'}`}>
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-slate-400 text-sm mt-1">{subtext}</p>
    </div>
  );
}

interface ProgressBarProps {
  label: string;
  value: number;
  color: string;
  icon?: React.ElementType;
}

function ProgressBar({ label, value, color, icon: Icon }: ProgressBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm flex items-center gap-1.5">
          {Icon && <Icon size={12} className={color.replace('text-', 'text-').split(' ')[0]} />}
          {label}
        </span>
        <span className="text-white text-sm font-semibold">{value}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${value}%`, boxShadow: `0 0 8px ${value > 80 ? 'rgba(52, 211, 153, 0.5)' : value > 60 ? 'rgba(251, 191, 36, 0.5)' : 'rgba(239, 68, 68, 0.5)'}` }}
        />
      </div>
    </div>
  );
}

export default function StudentProfilePage() {
  const { user, profile, studentProfile, updateProfile, updateStudentProfile } = useAuthContext();
  const { records, getSubjectStats, getOverallPercentage } = useAttendance(user?.id);
  const { submissions } = useSubmissions(user?.id);
  const { assignments } = useAssignments(user?.id);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [subjectAttendance, setSubjectAttendance] = useState<{ subject: string; percentage: number; present: number; total: number }[]>([]);

  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    department: profile?.department ?? '',
    bio: profile?.bio ?? '',
  });

  const [studentForm, setStudentForm] = useState({
    major: studentProfile?.major ?? '',
    year: studentProfile?.year ?? '',
    university: studentProfile?.university ?? '',
  });

  useEffect(() => {
    if (records.length > 0) {
      setSubjectAttendance(getSubjectStats());
    }
  }, [records, getSubjectStats]);

  useEffect(() => {
    setForm({
      full_name: profile?.full_name ?? '',
      phone: profile?.phone ?? '',
      department: profile?.department ?? '',
      bio: profile?.bio ?? '',
    });
    setStudentForm({
      major: studentProfile?.major ?? '',
      year: studentProfile?.year ?? '',
      university: studentProfile?.university ?? '',
    });
  }, [profile, studentProfile]);

  const overallAttendance = getOverallPercentage();
  const gpa = studentProfile?.gpa ?? 0;
  const pendingAssignments = assignments.filter(a => {
    const submission = submissions.find(s => s.assignment_id === a.id);
    return !submission || submission.status === 'pending';
  }).length;
  const completedSubmissions = submissions.filter(s => s.status === 'graded').length;
  const totalStudyHours = Math.floor(Math.random() * 50 + 80); // Simulated - in real app would calculate from study_plans
  const currentStreak = 14; // Simulated

  const initials = (profile?.full_name || user?.email || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await Promise.all([
        updateProfile(form),
        studentProfile && updateStudentProfile(studentForm),
      ]);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message ?? 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      full_name: profile?.full_name ?? '',
      phone: profile?.phone ?? '',
      department: profile?.department ?? '',
      bio: profile?.bio ?? '',
    });
    setStudentForm({
      major: studentProfile?.major ?? '',
      year: studentProfile?.year ?? '',
      university: studentProfile?.university ?? '',
    });
    setEditing(false);
    setError('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Profile</h1>
          <p className="text-slate-400 text-sm mt-1">View and manage your academic profile</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
          >
            <Edit size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Header Card */}
      <div className="glass-card rounded-2xl p-6 border border-white/8 hover:border-blue-500/20 transition-all duration-300">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-blue-500/30">
              {initials}
            </div>
            <button className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-slate-700 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-600 transition-all shadow-lg">
              <Camera size={15} />
            </button>
          </div>

          {/* Name & Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-white">
                {profile?.full_name || 'Student Name'}
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <GraduationCap size={12} className="inline mr-1" />
                {studentProfile?.year || 'Student'}
              </span>
            </div>
            <p className="text-slate-400 mt-2 flex items-center gap-2">
              <Mail size={14} />
              {user?.email}
            </p>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <span className="text-slate-400 text-sm flex items-center gap-1.5">
                <Building size={14} className="text-blue-400" />
                {studentProfile?.major || profile?.department || 'Undeclared Major'}
              </span>
              <span className="text-slate-400 text-sm flex items-center gap-1.5">
                <MapPin size={14} className="text-cyan-400" />
                {studentProfile?.university || 'University'}
              </span>
              <span className="text-slate-400 text-sm font-mono flex items-center gap-1.5">
                <FileText size={14} className="text-emerald-400" />
                {studentProfile?.student_id || 'STU-XXXX-XXXX'}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 flex-shrink-0">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{gpa.toFixed(1)}</p>
              <p className="text-slate-500 text-xs mt-1">GPA</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">{overallAttendance}%</p>
              <p className="text-slate-500 text-xs mt-1">Attendance</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-400">{currentStreak}</p>
              <p className="text-slate-500 text-xs mt-1">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Award}
          label="GPA"
          value={gpa.toFixed(2)}
          subtext="Current Semester"
          color="text-blue-400"
          bgGradient="from-blue-600/30 to-blue-500/20"
          trend={{ value: gpa >= 3.5 ? 'Excellent' : 'Good', positive: gpa >= 3.5 }}
        />
        <StatCard
          icon={Target}
          label="Attendance"
          value={`${overallAttendance}%`}
          subtext="Overall Attendance"
          color="text-emerald-400"
          bgGradient="from-emerald-600/30 to-emerald-500/20"
          trend={{ value: overallAttendance >= 85 ? '+2.3%' : 'Needs work', positive: overallAttendance >= 85 }}
        />
        <StatCard
          icon={BookOpen}
          label="Assignments"
          value={pendingAssignments}
          subtext="Pending Tasks"
          color="text-amber-400"
          bgGradient="from-amber-600/30 to-amber-500/20"
          trend={{ value: `${completedSubmissions} completed`, positive: true }}
        />
        <StatCard
          icon={Clock}
          label="Study Hours"
          value={`${totalStudyHours}h`}
          subtext="This Semester"
          color="text-cyan-400"
          bgGradient="from-cyan-600/30 to-cyan-500/20"
          trend={{ value: '+12%', positive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="glass-card rounded-2xl p-6 border border-white/8 hover:border-blue-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <User size={18} className="text-blue-400" />
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
                  <User size={12} /> Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                ) : (
                  <p className="text-white text-sm py-3 px-4 bg-white/3 rounded-xl">{profile?.full_name || '—'}</p>
                )}
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
                  <Mail size={12} /> Email Address
                </label>
                <p className="text-slate-400 text-sm py-3 px-4 bg-white/3 rounded-xl">{user?.email}</p>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
                  <Phone size={12} /> Phone Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                ) : (
                  <p className="text-white text-sm py-3 px-4 bg-white/3 rounded-xl">{profile?.phone || '—'}</p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
                  <Building size={12} /> Department
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={form.department}
                    onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                ) : (
                  <p className="text-white text-sm py-3 px-4 bg-white/3 rounded-xl">{profile?.department || '—'}</p>
                )}
              </div>

              {/* Major */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
                  <BookOpen size={12} /> Major
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={studentForm.major}
                    onChange={e => setStudentForm(f => ({ ...f, major: e.target.value }))}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                ) : (
                  <p className="text-white text-sm py-3 px-4 bg-white/3 rounded-xl">{studentProfile?.major || '—'}</p>
                )}
              </div>

              {/* Academic Year */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
                  <GraduationCap size={12} /> Academic Year
                </label>
                {editing ? (
                  <select
                    value={studentForm.year}
                    onChange={e => setStudentForm(f => ({ ...f, year: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                ) : (
                  <p className="text-white text-sm py-3 px-4 bg-white/3 rounded-xl">{studentProfile?.year || '—'}</p>
                )}
              </div>

              {/* University (full width) */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
                  <MapPin size={12} /> University
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={studentForm.university}
                    onChange={e => setStudentForm(f => ({ ...f, university: e.target.value }))}
                    placeholder="e.g. Tech University"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                ) : (
                  <p className="text-white text-sm py-3 px-4 bg-white/3 rounded-xl">{studentProfile?.university || '—'}</p>
                )}
              </div>

              {/* Bio (full width) */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
                  <FileText size={12} /> Bio
                </label>
                {editing ? (
                  <textarea
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder="A brief description about yourself..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                  />
                ) : (
                  <p className="text-white text-sm py-3 px-4 bg-white/3 rounded-xl min-h-[72px] whitespace-pre-wrap">{profile?.bio || '—'}</p>
                )}
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 mt-4">{error}</p>
            )}

            {saved && (
              <p className="text-emerald-400 text-xs bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-3 py-2 mt-4">Profile updated successfully!</p>
            )}

            {editing && (
              <div className="flex gap-3 pt-4 mt-4 border-t border-white/5">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Academic Statistics */}
          <div className="glass-card rounded-2xl p-6 border border-white/8 hover:border-blue-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-400" />
                Academic Performance
              </h3>
              <span className="text-xs text-slate-500">This Semester</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-4xl font-bold text-white">{gpa.toFixed(1)}</p>
                <p className="text-slate-400 text-sm mt-1">Current GPA</p>
                <div className="mt-3 flex items-center justify-center gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-md ${gpa >= 3.7 ? 'text-emerald-400 bg-emerald-500/15' : gpa >= 3.0 ? 'text-amber-400 bg-amber-500/15' : 'text-red-400 bg-red-500/15'}`}>
                    {gpa >= 3.7 ? 'Dean\'s List' : gpa >= 3.0 ? 'Good Standing' : 'Needs Improvement'}
                  </span>
                </div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-4xl font-bold text-white">{completedSubmissions}</p>
                <p className="text-slate-400 text-sm mt-1">Assignments Completed</p>
                <div className="mt-3 flex items-center justify-center gap-1">
                  <CheckCircle size={12} className="text-emerald-400" />
                  <span className="text-xs text-emerald-400">{Math.round((completedSubmissions / Math.max(submissions.length, 1)) * 100)}% Success</span>
                </div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-4xl font-bold text-white">{currentStreak}</p>
                <p className="text-slate-400 text-sm mt-1">Day Study Streak</p>
                <div className="mt-3 flex items-center justify-center gap-1">
                  <span className="text-xs text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md">Keep it up!</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <p className="text-slate-400 text-xs mb-4 flex items-center gap-2">
                <Calendar size={12} />
                Subject Performance Breakdown
              </p>
              {subjectAttendance.length > 0 ? (
                <div className="space-y-4">
                  {subjectAttendance.slice(0, 5).map(subject => (
                    <ProgressBar
                      key={subject.subject}
                      label={subject.subject}
                      value={subject.percentage}
                      color={subject.percentage >= 85 ? 'text-emerald-400' : subject.percentage >= 70 ? 'text-amber-400' : 'text-red-400'}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">
                  <Target size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No attendance data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Attendance Summary */}
        <div className="space-y-6">
          {/* Attendance Summary Card */}
          <div className="glass-card rounded-2xl p-6 border border-white/8 hover:border-blue-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target size={18} className="text-emerald-400" />
                Attendance
              </h3>
            </div>

            {/* Circular Progress */}
            <div className="flex justify-center mb-6">
              <div className="relative w-36 h-36">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke={overallAttendance >= 85 ? '#34d399' : overallAttendance >= 70 ? '#fbbf24' : '#f87171'}
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - overallAttendance / 100)}`}
                    className="transition-all duration-1000"
                    style={{ filter: `drop-shadow(0 0 8px ${overallAttendance >= 85 ? 'rgba(52, 211, 153, 0.5)' : overallAttendance >= 70 ? 'rgba(251, 191, 36, 0.5)' : 'rgba(248, 113, 113, 0.5)'})` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{overallAttendance}%</span>
                  <span className="text-xs text-slate-400">Overall</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {subjectAttendance.slice(0, 4).map(subject => (
                <div key={subject.subject} className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all">
                  <span className="text-sm text-slate-300 truncate flex-1">{subject.subject}</span>
                  <span className={`text-sm font-semibold ${subject.percentage >= 85 ? 'text-emerald-400' : subject.percentage >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                    {subject.percentage}%
                  </span>
                </div>
              ))}
            </div>

            {subjectAttendance.length > 4 && (
              <button className="w-full mt-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1">
                View All Subjects
                <ChevronRight size={14} />
              </button>
            )}
          </div>

          {/* Quick Info Card */}
          <div className="glass-card rounded-2xl p-6 border border-white/8 hover:border-blue-500/20 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-4">Account Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-slate-400">Member Since</span>
                <span className="text-sm text-white">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-slate-400">Roll Number</span>
                <span className="text-sm text-white font-mono">{studentProfile?.student_id || '—'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-slate-400">Account Type</span>
                <span className="text-xs font-medium px-2 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Student
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-400">Status</span>
                <span className="text-xs font-medium px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
